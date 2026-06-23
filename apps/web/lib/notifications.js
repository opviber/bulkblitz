/**
 * BulkBlitz Notification Service Stubs
 * 
 * In production, these stubs will be configured with:
 * - Twilio WhatsApp Business API or similar provider
 * - Firebase Cloud Messaging (FCM) or OneSignal SDK
 * - SendGrid, Resend, or AWS SES
 */

export async function sendWhatsAppNotification(phone, message) {
  const deliveryId = `wa_msg_${Math.random().toString(36).substring(7)}`;
  const timestamp = new Date().toISOString();

  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  💬 WHATSAPP DELIVERY STUB                                     ║
╠════════════════════════════════════════════════════════════════╣
║  Recipient Phone:  ${phone.padEnd(44)}║
║  Message ID:       ${deliveryId.padEnd(44)}║
║  Sent Time:        ${timestamp.padEnd(44)}║
╠════════════════════════════════════════════════════════════════╣
║  Message Content:                                              ║
║  ${message.split('\n').join('\n║  ')}
╚════════════════════════════════════════════════════════════════╝
  `);

  return {
    success: true,
    provider: "WhatsApp API Stub",
    deliveryId,
    timestamp,
  };
}

export async function sendPushNotification(userId, title, body) {
  const pushId = `push_notif_${Math.random().toString(36).substring(7)}`;
  const timestamp = new Date().toISOString();

  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  📱 PUSH NOTIFICATION STUB (FCM/OneSignal)                     ║
╠════════════════════════════════════════════════════════════════╣
║  User ID:          ${userId.padEnd(44)}║
║  Notification ID:  ${pushId.padEnd(44)}║
║  Sent Time:        ${timestamp.padEnd(44)}║
╠════════════════════════════════════════════════════════════════╣
║  Title:            ${title.padEnd(44)}║
║  Body:             ${body.padEnd(44)}║
╚════════════════════════════════════════════════════════════════╝
  `);

  return {
    success: true,
    provider: "Firebase FCM Stub",
    pushId,
    timestamp,
  };
}

export async function sendEmailNotification(email, subject, body) {
  const emailId = `mail_msg_${Math.random().toString(36).substring(7)}`;
  const timestamp = new Date().toISOString();

  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  ✉️ EMAIL DELIVERY STUB (SendGrid/Resend)                      ║
╠════════════════════════════════════════════════════════════════╣
║  Recipient:        ${email.padEnd(44)}║
║  Subject:          ${subject.padEnd(44)}║
║  Email ID:         ${emailId.padEnd(44)}║
║  Sent Time:        ${timestamp.padEnd(44)}║
╠════════════════════════════════════════════════════════════════╣
║  Body Content:                                                 ║
║  ${body.split('\n').join('\n║  ')}
╚════════════════════════════════════════════════════════════════╝
  `);

  return {
    success: true,
    provider: "Resend Email Stub",
    emailId,
    timestamp,
  };
}

// =============================================================================
// Unified dispatch — persists an in-app Notification row and routes to the
// configured provider channel. Safe to call from any server route.
// =============================================================================
import { prisma } from "./prisma";

/**
 * dispatchNotification(userId, { channel, title, body, link })
 * channel ∈ WHATSAPP | PUSH | EMAIL | SMS
 */
export async function dispatchNotification(userId, { channel = "PUSH", title, body, link }) {
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
        if (user.email) return await sendEmailNotification(user.email, title, body);
        return await sendPushNotification(userId, title, body);
      case "SMS":
      case "PUSH":
      default:
        return await sendPushNotification(userId, title, body);
    }
  } catch (e) {
    console.warn("notification dispatch failed:", e?.message);
    return { success: false };
  }
}
