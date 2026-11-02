'use client';

/**
 * RegisterForm.tsx
 * 4-step member registration  ->  POST /api/registration
 * Steps: 1 Personal, 2 Church & address, 3 Contact & emergency, 4 Account & consent
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { API } from '@/lib/auth';

const STEPS = ['Personal', 'Church', 'Contact', 'Confirm'];

const EMPTY = {
  registrationType: 'LONG_TERM', division: '', fullName: '', christianName: '', gender: '', age: '',
  dateOfBirth: '', motherName: '', schoolOrOccupation: '',
  confessionFather: '', confessionChurch: '', confessionAddress: '', address: '', kebele: '', houseNumber: '',
  preferredDepartment: '', talentSkills: '',
  phoneNumber: '', emergencyContactName: '', emergencyRelationship: '', emergencyContactPhone: '',
  parentName: '', parentConsent: false, youthCovenantAccepted: false,
  password: '', confirm: '',
};
type Form = typeof EMPTY;

/** required fields per step (extra rules for the last step are in validate()) */
const REQUIRED: Record<number, { key: keyof Form; label: string }[]> = {
  0: [
    { key: 'division', label: 'Division' }, { key: 'fullName', label: 'Full name' },
    { key: 'christianName', label: 'Christian name' }, { key: 'gender', label: 'Gender' }, { key: 'age', label: 'Age' },
  ],
  1: [{ key: 'confessionFather', label: 'Confession father' }, { key: 'address', label: 'Address' }],
  2: [{ key: 'emergencyContactName', label: 'Emergency contact name' }, { key: 'emergencyContactPhone', label: 'Emergency contact phone' }],
  3: [],
};

const input =
  "w-full rounded-xl border border-[#e4d3ad] bg-[#fffdf9] px-3.5 py-2.5 font-['Crimson_Text',Georgia,serif] text-[16px] text-[#1c2740] outline-none transition placeholder:text-[#8a93a8] focus:border-[#c8952f] focus:ring-2 focus:ring-[#c8952f]/20";

function Field({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-sans text-[12px] font-medium text-[#0f2352]">
        {label} {optional && <i className="font-normal not-italic text-[#8a93a8]">(optional)</i>}
      </span>
      {children}
    </label>
  );
}

export function RegisterForm() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ number?: string } | null>(null);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));
  const text = (k: keyof Form) => ({
    value: String(f[k]),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => set(k, e.target.value as never),
    className: input,
  });
  const isYouth = f.division === 'YOUTH';

  function validate(s: number): string[] {
    const errs = REQUIRED[s].filter(({ key }) => !String(f[key]).trim()).map(({ label }) => `${label} is required`);
    if (s === 0 && f.age && (Number(f.age) < 1 || Number(f.age) > 120)) errs.push('Please enter a valid age');
    if (s === 3) {
      if (f.password.length < 6) errs.push('Password must be at least 6 characters');
      if (f.password !== f.confirm) errs.push('Passwords do not match');
      if (isYouth && !f.youthCovenantAccepted) errs.push('Please accept the youth covenant');
      if (!isYouth) {
        if (!f.parentName.trim()) errs.push('Parent or guardian name is required');
        if (!f.parentConsent) errs.push('Parent or guardian consent is required');
      }
    }
    return errs;
  }

  function next() {
    const errs = validate(step);
    setErrors(errs);
    if (errs.length === 0) setStep((s) => s + 1);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(3);
    setErrors(errs);
    if (errs.length) return;

    const { confirm, ...rest } = f;
    const body: Record<string, unknown> = {};
    Object.entries(rest).forEach(([k, v]) => {
      if (typeof v === 'string' && v.trim() === '') return; // skip empty optional fields
      body[k] = v;
    });
    body.age = Number(f.age);
    if (f.dateOfBirth) body.dateOfBirth = new Date(f.dateOfBirth).toISOString();
    if (isYouth) { delete body.parentName; delete body.parentConsent; }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/registration`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const list: string[] = Array.isArray(json?.errors) && json.errors.length
          ? json.errors.map((x: { field?: string; message?: string }) => (x.field ? `${x.field}: ${x.message}` : x.message ?? 'Invalid value'))
          : [json?.message || 'Registration failed. Please try again.'];
        setErrors(list);
        return;
      }
      setDone({ number: json?.data?.registrationNumber });
    } catch {
      setErrors(['Cannot reach the server. Please check your connection and try again.']);
    } finally {
      setLoading(false);
    }
  }

  /* ── success ───────────────────────────────────────────────────────── */
  if (done) {
    return (
      <div className="mx-auto w-full max-w-[560px] rounded-2xl border border-[#ecdcb8] bg-[#fffdf9] p-9 text-center shadow-[0_6px_28px_rgba(15,35,82,.08)]">
        <img src="/images/cross.png" alt="" aria-hidden="true" className="mx-auto mb-3 h-[54px] w-auto" />
        <h2 className="font-['Playfair_Display',Georgia,serif] text-[26px] font-bold text-[#0f2352]">Registration Submitted</h2>
        <p className="mt-2 font-['Crimson_Text',Georgia,serif] text-[17px] leading-snug text-[#35609a]">
          Thank you! Your registration is waiting for approval by the administration.
        </p>
        {done.number && (
          <p className="mx-auto mt-4 inline-block rounded-full border border-[#e4d3ad] bg-[#f6efe0] px-5 py-2 font-sans text-[13px] font-semibold text-[#0f2352]">
            Registration No: {done.number}
          </p>
        )}
        <div className="mt-6">
          <Link href="/login" className="inline-block rounded-full bg-gradient-to-b from-[#d3a03c] to-[#b9852a] px-8 py-3 font-sans text-[13px] font-semibold text-white">Go to Login</Link>
        </div>
      </div>
    );
  }

  /* ── form ──────────────────────────────────────────────────────────── */
  return (
    <form onSubmit={submit} noValidate className="mx-auto w-full max-w-[760px] rounded-2xl border border-[#ecdcb8] bg-[#fffdf9] p-6 shadow-[0_6px_28px_rgba(15,35,82,.08)] sm:p-9">
      {/* progress */}
      <ol className="mb-8 flex items-center">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 items-center last:flex-none">
            <span className={`grid size-9 shrink-0 place-items-center rounded-full font-sans text-[13px] font-semibold ${i <= step ? 'bg-[#0f2352] text-white shadow-[0_0_0_4px_#f3e6cc]' : 'border border-[#e4d3ad] bg-[#f6efe0] text-[#8a93a8]'}`}>{i + 1}</span>
            <span className={`ml-2 hidden font-sans text-[12px] font-medium sm:block ${i <= step ? 'text-[#0f2352]' : 'text-[#8a93a8]'}`}>{s}</span>
            {i < STEPS.length - 1 && <span className={`mx-3 h-px flex-1 ${i < step ? 'bg-[#c8952f]' : 'bg-[#e4d3ad]'}`} />}
          </li>
        ))}
      </ol>

      <div className="grid gap-4 sm:grid-cols-2">
        {step === 0 && (
          <>
            <Field label="Registration type">
              <select {...text('registrationType')}><option value="LONG_TERM">Long term</option><option value="SHORT_TERM">Short term</option></select>
            </Field>
            <Field label="Division">
              <select {...text('division')}><option value="">Select…</option><option value="CHILDREN">Children</option><option value="INTERMEDIATE">Intermediate</option><option value="YOUTH">Youth</option></select>
            </Field>
            <Field label="Full name"><input {...text('fullName')} placeholder="As written on your ID" /></Field>
            <Field label="Christian name"><input {...text('christianName')} /></Field>
            <Field label="Gender">
              <select {...text('gender')}><option value="">Select…</option><option value="MALE">Male</option><option value="FEMALE">Female</option></select>
            </Field>
            <Field label="Age"><input {...text('age')} type="number" min={1} max={120} /></Field>
            <Field label="Date of birth" optional><input {...text('dateOfBirth')} type="date" /></Field>
            <Field label="Mother's name" optional><input {...text('motherName')} /></Field>
            <div className="sm:col-span-2"><Field label="School or occupation" optional><input {...text('schoolOrOccupation')} /></Field></div>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Confession father"><input {...text('confessionFather')} /></Field>
            <Field label="Confession church" optional><input {...text('confessionChurch')} /></Field>
            <div className="sm:col-span-2"><Field label="Confession father's address" optional><input {...text('confessionAddress')} /></Field></div>
            <div className="sm:col-span-2"><Field label="Your address"><input {...text('address')} placeholder="City / town" /></Field></div>
            <Field label="Kebele" optional><input {...text('kebele')} /></Field>
            <Field label="House number" optional><input {...text('houseNumber')} /></Field>
            <Field label="Preferred department" optional><input {...text('preferredDepartment')} placeholder="e.g. Mezmur" /></Field>
            <Field label="Talent or skills" optional><input {...text('talentSkills')} /></Field>
          </>
        )}

        {step === 2 && (
          <>
            <div className="sm:col-span-2"><Field label="Your phone number" optional><input {...text('phoneNumber')} type="tel" placeholder="+251 9…" /></Field></div>
            <Field label="Emergency contact name"><input {...text('emergencyContactName')} /></Field>
            <Field label="Relationship" optional><input {...text('emergencyRelationship')} placeholder="e.g. Father" /></Field>
            <div className="sm:col-span-2"><Field label="Emergency contact phone"><input {...text('emergencyContactPhone')} type="tel" placeholder="+251 9…" /></Field></div>
          </>
        )}

        {step === 3 && (
          <>
            <Field label="Create a password"><input {...text('password')} type="password" autoComplete="new-password" placeholder="At least 6 characters" /></Field>
            <Field label="Confirm password"><input {...text('confirm')} type="password" autoComplete="new-password" /></Field>

            <div className="rounded-xl border border-[#e4d3ad] bg-[#f6efe0] p-4 sm:col-span-2">
              {isYouth ? (
                <label className="flex items-start gap-3 font-['Crimson_Text',Georgia,serif] text-[16px] text-[#1c2740]">
                  <input type="checkbox" checked={f.youthCovenantAccepted} onChange={(e) => set('youthCovenantAccepted', e.target.checked)} className="mt-1 size-4 accent-[#b9852a]" />
                  I accept the Sunday School youth covenant.
                </label>
              ) : (
                <div className="space-y-3">
                  <Field label="Parent or guardian name"><input {...text('parentName')} /></Field>
                  <label className="flex items-start gap-3 font-['Crimson_Text',Georgia,serif] text-[16px] text-[#1c2740]">
                    <input type="checkbox" checked={f.parentConsent} onChange={(e) => set('parentConsent', e.target.checked)} className="mt-1 size-4 accent-[#b9852a]" />
                    My parent or guardian agrees to this registration.
                  </label>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {errors.length > 0 && (
        <ul role="alert" className="mt-5 list-inside list-disc rounded-lg border border-[#f0c9c4] bg-[#fdf1ef] px-4 py-3 font-sans text-[12.5px] text-[#a03a2c]">
          {errors.map((m) => <li key={m}>{m}</li>)}
        </ul>
      )}

      <div className="mt-7 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button type="button" onClick={() => { setErrors([]); setStep((s) => s - 1); }} className="rounded-full border-[1.5px] border-[#dcc08a] bg-[#fffbf1] px-6 py-2.5 font-sans text-[13px] font-semibold text-[#b9852a]">Back</button>
        ) : <span />}

        {step < STEPS.length - 1 ? (
          <button type="button" onClick={next} className="rounded-full bg-gradient-to-b from-[#d3a03c] to-[#b9852a] px-8 py-2.5 font-sans text-[13px] font-semibold text-white shadow-[0_3px_10px_rgba(185,133,42,.35)]">Next</button>
        ) : (
          <button type="submit" disabled={loading} className="rounded-full bg-gradient-to-b from-[#d3a03c] to-[#b9852a] px-8 py-2.5 font-sans text-[13px] font-semibold text-white shadow-[0_3px_10px_rgba(185,133,42,.35)] disabled:opacity-60">
            {loading ? 'Submitting…' : 'Submit Registration'}
          </button>
        )}
      </div>

      <p className="mt-5 text-center font-['Crimson_Text',Georgia,serif] text-[15px] text-[#35609a]">
        Already registered? <Link href="/login" className="font-semibold text-[#b9852a] underline">Sign in</Link>
      </p>
    </form>
  );
}