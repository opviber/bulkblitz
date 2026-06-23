import { NextResponse } from "next/server";
import { requireUser, handleAuthError, supabaseAdmin } from "@/lib/auth";
import { uploadSchema, parseBody } from "@/lib/validation";
import crypto from "crypto";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "batch-images";

// POST /api/uploads  { fileName, contentType }
// Returns a signed upload URL (Supabase Storage). Sandbox returns a stub path.
export async function POST(request) {
  try {
    const user = await requireUser(["MANUFACTURER", "ADMIN"]);
    const { data, error } = await parseBody(request, uploadSchema);
    if (error) return error;

    const ext = data.fileName.split(".").pop()?.slice(0, 8) || "bin";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const admin = supabaseAdmin();
    if (!admin) {
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json({
          sandbox: true,
          path,
          uploadUrl: null,
          publicUrl: `/uploads-stub/${path}`,
        });
      }
      return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
    }

    const { data: signed, error: sErr } = await admin.storage
      .from(BUCKET)
      .createSignedUploadUrl(path);
    if (sErr) return NextResponse.json({ error: sErr.message }, { status: 502 });

    const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({
      path,
      token: signed.token,
      uploadUrl: signed.signedUrl,
      publicUrl: pub.publicUrl,
    });
  } catch (err) {
    if (err?.status) return handleAuthError(err);
    return NextResponse.json({ error: "Upload init failed" }, { status: 500 });
  }
}
