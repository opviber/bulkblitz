// =============================================================================
// BulkBlitz — Realtime helpers (Supabase Realtime broadcast)
//
// Server: broadcastBatchUpdate() emits PRICE_UPDATED / SLOT_FILLED on a per-batch
//         channel. No-op when Supabase isn't configured.
// Client: subscribeToBatch() (in components) listens on the same channel.
// =============================================================================
import { supabase } from "./supabase";

export function batchChannelName(batchId) {
  return `batch:${batchId}`;
}

/**
 * Server-side broadcast of a batch update to all connected viewers.
 * @param {string} batchId
 * @param {{ type: 'PRICE_UPDATED'|'SLOT_FILLED'|'BATCH_CLOSED', payload: object }} event
 */
export async function broadcastBatchUpdate(batchId, event) {
  try {
    const channel = supabase.channel(batchChannelName(batchId), {
      config: { broadcast: { ack: false } },
    });
    await channel.send({
      type: "broadcast",
      event: event.type,
      payload: { batchId, ...event.payload },
    });
    await supabase.removeChannel(channel);
  } catch (err) {
    // Realtime is best-effort; never block the transaction on it.
    console.warn("broadcastBatchUpdate failed:", err?.message);
  }
}
