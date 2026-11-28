// Snake Park payment approval: called by the app when Pi asks for server approval.
// The API key lives only in the Pages secret PI_NETWORK_API_KEY (set by the owner).
export async function onRequestPost({ request, env }) {
  try {
    if (!env.PI_NETWORK_API_KEY) return json({ error: 'server key not configured' }, 500);
    const { paymentId } = await request.json();
    if (!paymentId) return json({ error: 'paymentId required' }, 400);
    const res = await fetch('https://api.minepi.com/v2/payments/' + encodeURIComponent(paymentId) + '/approve', {
      method: 'POST',
      headers: { 'Authorization': 'Key ' + env.PI_NETWORK_API_KEY }
    });
    if (!res.ok) return json({ error: 'pi approve failed', status: res.status }, 502);
    return json({ ok: true });
  } catch (e) {
    return json({ error: String(e && e.message || e) }, 500);
  }
}
function json(obj, status) {
  return new Response(JSON.stringify(obj), { status: status || 200, headers: { 'Content-Type': 'application/json' } });
}
