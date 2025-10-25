import { getStore } from '@netlify/blobs';

export async function handler(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const { id } = JSON.parse(event.body || '{}');
    if (!id) return { statusCode: 400, body: 'Missing id' };

    const store = getStore('hearts');
    const heartsRaw = await store.get('hearts.json');
    const hearts = heartsRaw ? JSON.parse(heartsRaw) : {};

    hearts[id] = Number(hearts[id] || 0) + 1;
    await store.set('hearts.json', JSON.stringify(hearts));

    return { statusCode: 200, headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ok:true, id, heartCount: hearts[id] }) };
  } catch (e) {
    return { statusCode: 500, body: 'heart error: ' + e.message };
  }
}