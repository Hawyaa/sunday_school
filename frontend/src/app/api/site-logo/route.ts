/**
 * route.ts   →  src/app/api/site-logo/route.ts
 *
 * GET    → { url }   current logo URL (falls back to /abun.jpg)
 * POST   → upload a new logo (multipart/form-data, field "file")  [admin only]
 * DELETE → reset to the default logo                               [admin only]
 *
 * The file is stored in  <project>/data/  and served by /api/site-logo/image.
 *
 * AUTH: set  ADMIN_UPLOAD_KEY=some-long-secret  in .env.local. Requests must send it
 * in the "x-admin-key" header. If you already have admin sessions, replace
 * isAuthorized() with your own check.
 *
 * NOTE: this writes to disk, so it works on your PC / a VPS / Docker with a volume.
 * On Vercel (read-only filesystem) switch the storage to Supabase / Firebase / Blob.
 *
 * Next 16 + cacheComponents: no `dynamic` / `runtime` exports. GET calls connection()
 * so it is never prerendered at build time.
 */

import { NextRequest, NextResponse, connection } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DIR = path.join(process.cwd(), 'data');
const META = path.join(DIR, 'site-logo.json');
const DEFAULT_LOGO = '/abun.jpg';
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function isAuthorized(req: NextRequest): boolean {
  const key = process.env.ADMIN_UPLOAD_KEY;
  if (!key) return false;
  return req.headers.get('x-admin-key') === key;
}

async function readMeta(): Promise<{ ext: string; updatedAt: number } | null> {
  try {
    return JSON.parse(await fs.readFile(META, 'utf8'));
  } catch {
    return null;
  }
}

async function removeLogoFiles() {
  for (const ext of Object.values(TYPES)) {
    await fs.rm(path.join(DIR, `site-logo.${ext}`), { force: true });
  }
  await fs.rm(META, { force: true });
}

export async function GET() {
  await connection(); // opt out of build-time prerendering
  const meta = await readMeta();
  const url = meta ? `/api/site-logo/image?v=${meta.updatedAt}` : DEFAULT_LOGO;
  return NextResponse.json({ url }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { error: 'Not authorized (check ADMIN_UPLOAD_KEY in .env.local and the key you entered).' },
      { status: 403 },
    );
  }

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file received.' }, { status: 400 });
  }
  const ext = TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: 'Use a JPG, PNG or WebP image.' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image is too large (max 2 MB).' }, { status: 400 });
  }

  await fs.mkdir(DIR, { recursive: true });
  await removeLogoFiles();
  await fs.writeFile(path.join(DIR, `site-logo.${ext}`), Buffer.from(await file.arrayBuffer()));
  const updatedAt = Date.now();
  await fs.writeFile(META, JSON.stringify({ ext, updatedAt }));

  return NextResponse.json({ url: `/api/site-logo/image?v=${updatedAt}` });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }
  await removeLogoFiles();
  return NextResponse.json({ url: DEFAULT_LOGO });
}