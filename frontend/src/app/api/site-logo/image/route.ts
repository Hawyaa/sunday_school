/**
 * image-route.ts   →  save as  src/app/api/site-logo/image/route.ts
 *
 * Streams the currently uploaded logo. The ?v=<timestamp> in the URL busts caches
 * whenever a new logo is uploaded, so it can be cached "forever".
 *
 * Next 16 + cacheComponents: no `dynamic` / `runtime` exports; connection() keeps it dynamic.
 */

import { NextResponse, connection } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DIR = path.join(process.cwd(), 'data');
const MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

export async function GET() {
  await connection(); // opt out of build-time prerendering
  try {
    const meta = JSON.parse(await fs.readFile(path.join(DIR, 'site-logo.json'), 'utf8'));
    const bytes = await fs.readFile(path.join(DIR, `site-logo.${meta.ext}`));
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        'Content-Type': MIME[meta.ext] ?? 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}