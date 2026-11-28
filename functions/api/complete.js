// Snake Park payment completion: called by the app after the blockchain
// transaction exists, and also to finish a payment interrupted earlier.
// The API key lives only in the Pages secret PI_NETWORK_API_KEY (set by the owner).
export async function onRequestPost({ request, env }) {
  try {
    if (!env.PI_NETWORK_API_KEY) return json({ error: 'server key not configured' }, 500);
    const { paymentId, txid } = await request.json();
    if (!paymentId || !txid) return json({ error: 'paymentId and txid required' }, 400);
    const res = await fetch('https://api.minepi.com/v2/payments/' + encodeURIComponent(paymentId) + '/complete', {
      method: 'POST',
      headers: { 'Authorization': 'Key ' + env.PI_NETWORK_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ txid })
    });
    if (!res.ok) return json({ error: 'pi complete failed', status: res.status }, 502);
    return json({ ok: true });
  } catch (e) {
    return json({ error: String(e && e.message || e) }, 500);
  }
}
function json(obj, status) {
  return new Response(JSON.stringify(obj), { status: status || 200, headers: { 'Content-Type': 'application/json' } });
}
