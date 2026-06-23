import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cron/close-batches
// Invoked by Vercel Cron. Finds LIVE batches past their endTime and closes each
// via the per-batch close endpoint. Protected by CRON_SECRET in production.
export async function GET(request) {
  if (process.env.NODE_ENV === "production") {
    const secret = process.env.CRON_SECRET;
    const auth = request.headers.get("authorization");
    if (!secret || auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const due = await prisma.batch.findMany({
    where: { status: "LIVE", endTime: { lte: new Date() } },
    select: { id: true },
    take: 100,
  });

  const origin = new URL(request.url).origin;
  const results = [];
  for (const b of due) {
    try {
      const res = await fetch(`${origin}/api/batches/${b.id}/close`, {
        method: "POST",
        headers: { authorization: `Bearer ${process.env.CRON_SECRET || ""}` },
      });
      results.push({ id: b.id, status: res.status });
    } catch (e) {
      results.push({ id: b.id, error: e?.message });
    }
  }

  return NextResponse.json({ processed: due.length, results });
}
