'use client';

/**
 * SiteLogoSettings.tsx   →  src/components/admin/SiteLogoSettings.tsx
 *
 * Drop <SiteLogoSettings /> anywhere in your admin page (e.g. a "Settings" tab).
 * Upload once → Header and Footer logos both change.
 */

import React, { useRef, useState } from 'react';
import { SiteLogo } from '@/components/layout/SiteLogo';
import { notifyLogoChanged } from '@/lib/useSiteLogo';

export function SiteLogoSettings() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function pick(f: File | null) {
    setMsg(null);
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function send(method: 'POST' | 'DELETE') {
    setBusy(true);
    setMsg(null);
    try {
      const body = new FormData();
      if (method === 'POST' && file) body.append('file', file);

      const res = await fetch('/api/site-logo', {
        method,
        headers: { 'x-admin-key': adminKey },
        body: method === 'POST' ? body : undefined,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong.');

      notifyLogoChanged(); // header + footer refresh instantly
      pick(null);
      if (inputRef.current) inputRef.current.value = '';
      setMsg({
        ok: true,
        text: method === 'POST' ? 'Logo updated in header and footer.' : 'Logo reset to default.',
      });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Upload failed.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="bg-white border border-[#E3EEF8] rounded-xl p-5 sm:p-6 max-w-xl">
      <h3 className="text-lg font-extrabold text-[#0F1B3E] mb-1">Site Logo</h3>
      <p className="text-[13px] text-[#44506B] mb-4">
        Upload one image and it replaces the logo in both the header and the footer.
        JPG, PNG or WebP, up to 2 MB. Square images look best.
      </p>

      <div className="flex items-center gap-5 mb-4">
        <div className="text-center">
          <SiteLogo size={72} />
          <div className="text-[11px] text-[#8896AB] mt-1">Current</div>
        </div>
        {preview && (
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="New logo preview"
              className="w-[72px] h-[72px] rounded-full object-cover border-2 border-[#C99A3B]"
            />
            <div className="text-[11px] text-[#8896AB] mt-1">New</div>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => pick(e.target.files?.[0] ?? null)}
        className="block w-full text-[13px] text-[#44506B] mb-3 file:mr-3 file:rounded-lg file:border-0 file:bg-[#0F1B3E] file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-[#13224F]"
      />

      <input
        type="password"
        value={adminKey}
        onChange={(e) => setAdminKey(e.target.value)}
        placeholder="Admin key (ADMIN_UPLOAD_KEY)"
        className="w-full border border-[#E3EEF8] rounded-lg px-3 py-2 text-[13px] mb-4 outline-hidden focus:border-[#C99A3B]"
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!file || !adminKey || busy}
          onClick={() => send('POST')}
          className="bg-[#0F1B3E] text-white border-[1.5px] border-[#C99A3B] px-5 py-2 rounded-lg text-xs font-bold disabled:opacity-40 cursor-pointer hover:bg-[#13224F] transition"
        >
          {busy ? 'Saving…' : 'Save logo'}
        </button>
        <button
          type="button"
          disabled={!adminKey || busy}
          onClick={() => send('DELETE')}
          className="border border-[#E3EEF8] text-[#44506B] px-5 py-2 rounded-lg text-xs font-bold disabled:opacity-40 cursor-pointer hover:border-[#C99A3B] transition"
        >
          Reset to default
        </button>
      </div>

      {msg && (
        <p className={`mt-3 text-[13px] font-semibold ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>
          {msg.text}
        </p>
      )}
    </section>
  );
}