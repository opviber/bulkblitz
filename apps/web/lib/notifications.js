// =============================================================================
// BulkBlitz — Notification Service
//
// Real providers used when env vars are set; structured stubs log to console
// when providers aren't configured (keeps local dev informative).
//
// Providers:
//   WhatsApp → MSG91 WhatsApp Business API (MSG91_AUTH_KEY + MSG91_TEMPLATE_ID)
//   Email    → Resend (RESEND_API_KEY + RESEND_FROM)
//   Push     → FCM server key (FCM_SERVER_KEY) — v1 API in production
//   SMS      → Falls back to console stub (add Twilio / MSG91 SMS later)
// =============================================================================
import { prisma } from "./prisma";

// ── WhatsApp (MSG91) ──────────────────────────────────────────────────────────
async function sendWhatsAppMsg91(phone, message) {
  const key = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;
  if (!key) return null; // fall through to stub

  const body = {
    receiver: `91${phone.replace(/\D/g, "").slice(-10)}`,
    template_id: templateId || "",
    VAR1: message.slice(0, 255),
  };
  const res = await fetch("https://api.msg91.com/api/v5/whatsapp/otp", {
    method: "POST",
    headers: { authkey: key, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.ok ? { success: true, provider: "MSG91-WA" } : null;
}

export async function sendWhatsAppNotification(phone, message) {
  const result = await sendWhatsAppMsg91(phone, message).catch(() => null);
  if (result) return result;

  // Structured console stub
  console.log(`\n[WA STUB] → +91${phone}\n${message}\n`);
  return { success: true, provider: "WhatsApp Stub" };
}

// ── Email (Resend) ────────────────────────────────────────────────────────────
async function sendEmailResend(email, subject, body) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "BulkBlitz <noreply@bulkblitz.in>";
  if (!apiKey) return null;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [email],
      subject,
      html: `<p style="font-family:sans-serif;color:#111;line-height:1.6">${body.replace(/\n/g, "<br>")}</p>
             <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
             <p style="font-size:12px;color:#888">BulkBlitz &mdash; bulk up. price down. &mdash; <a href="https://bulkblitz.in">bulkblitz.in</a></p>`,
    }),
  });
  const d = await res.json().catch(() => ({}));
  return res.ok ? { success: true, provider: "Resend", id: d.id } : null;
}

export async function sendEmailNotification(email, subject, body) {
  const result = await sendEmailResend(email, subject, body).catch(() => null);
  if (result) return result;
  console.log(`\n[EMAIL STUB] → ${email}\nSubject: ${subject}\n${body}\n`);
  return { success: true, provider: "Email Stub" };
}

// ── Push (FCM) ────────────────────────────────────────────────────────────────
async function sendFcmPush(userId, title, body) {
  const key = process.env.FCM_SERVER_KEY;
  if (!key) return null;

  // FCM legacy HTTP API (swap for FCM v1 + OAuth2 in production)
  const res = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: { Authorization: `key=${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      condition: `'user-${userId}' in topics`,
      notification: { title, body },
    }),
  });
  return res.ok ? { success: true, provider: "FCM" } : null;
}

export async function sendPushNotification(userId, title, body) {
  const result = await sendFcmPush(userId, title, body).catch(() => null);
  if (result) return result;
  console.log(`\n[PUSH STUB] userId=${userId}\n${title}: ${body}\n`);
  return { success: true, provider: "Push Stub" };
}

// ── Unified dispatcher ────────────────────────────────────────────────────────
/**
 * dispatchNotification(userId, { channel, title, body, link })
 * Persists an in-app Notification row, then routes to the right provider.
 * channel ∈ WHATSAPP | EMAIL | PUSH | SMS
 */
export async function dispatchNotification(userId, { channel = "PUSH", title, body, link }) {
  // Persist in-app notification
  try {
    await prisma.notification.create({
      data: { userId, channel, title, body, link: link || null },
    });
  } catch (e) {
    console.warn("notification persist failed:", e?.message);
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false };
    const text = `${title}\n${body}`;
    switch (channel) {
      case "WHATSAPP":
        return await sendWhatsAppNotification(user.phone, text);
      case "EMAIL":
        return user.email
          ? await sendEmailNotification(user.email, title, body)
          : await sendPushNotification(userId, title, body);
      case "SMS":
        console.log(`[SMS STUB] → ${user.phone}: ${text}`);
        return { success: true, provider: "SMS Stub" };
      case "PUSH":
      default:
        return await sendPushNotification(userId, title, body);
    }
  } catch (e) {
    console.warn("notification dispatch failed:", e?.message);
    return { success: false };
  }
}
