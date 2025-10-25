import fs from 'fs';
import path from 'path';
import { getStore } from '@netlify/blobs';

export async function handler() {
  try {
    const file = path.join(process.cwd(), 'data', 'patterns.json');
    const catalog = JSON.parse(fs.readFileSync(file, 'utf-8'));

    const store = getStore('hearts');
    const heartsRaw = await store.get('hearts.json');
    const hearts = heartsRaw ? JSON.parse(heartsRaw) : {};

    const withCounts = catalog.map(p => ({
      ...p,
      heartCount: Number(hearts[p.id] || 0)
    }));

    return { statusCode: 200, headers:{'Content-Type':'application/json'}, body: JSON.stringify(withCounts) };
  } catch (e) {
    return { statusCode: 500, body: 'get-patterns error: ' + e.message };
  }
}