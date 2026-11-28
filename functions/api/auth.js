// Snake Park sign-in check (Production / console app): the client sends the
// Pi accessToken from Pi.authenticate; we verify it with Pi's own /v2/me
// endpoint and return the uid/username in the same shape the old App Studio
// exchange returned, so the client code is unchanged.
export async function onRequestPost({ request }) {
  try {
    const { accessToken } = await request.json();
    if (!accessToken) return json({ error: 'accessToken required' }, 400);
    const res = await fetch('https://api.minepi.com/v2/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    });
    if (!res.ok) return json({ error: 'pi me failed', status: res.status }, 401);
    const me = await res.json();
    const uid = me && (me.uid || (me.user && me.user.uid));
    const username = me && (me.username || (me.user && me.user.username));
    if (!uid) return json({ error: 'bad me response' }, 502);
    return json({ user: { uid, username } });
  } catch (e) {
    return json({ error: String(e && e.message || e) }, 500);
  }
}
function json(obj, status) {
  return new Response(JSON.stringify(obj), { status: status || 200, headers: { 'Content-Type': 'application/json' } });
}
