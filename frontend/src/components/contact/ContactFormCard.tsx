'use client';

/**
 * ContactFormCard.tsx
 *
 * Interactive contact message form with client validation and submission feedback.
 */

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';

export function ContactFormCard() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'general',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage(
        isAm ? 'እባክዎ ሁሉንም አስፈላጊ መረጃዎች ያስገቡ።' : 'Please fill in all required fields.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Simulate API submit or post to backend
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        subject: 'general',
        message: '',
      });
    } catch {
      setErrorMessage(
        isAm
          ? 'መልዕክቱን መላክ አልተቻለም። እባክዎ ትንሽ ቆይተው እንደገና ይሞክሩ።'
          : 'Failed to send message. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E3EEF8] p-6 sm:p-8 md:p-10 shadow-[0_4px_16px_rgba(30,42,94,0.04)]">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E2A5E] mb-2">
          {isAm ? 'መልዕክት ይላኩልን' : 'Send Us a Message'}
        </h2>
        <p className="text-sm text-[#44506B]">
          {isAm
            ? 'ጥያቄዎን ወይም አስተያየትዎን ከታች ባለው ቅጽ ይላኩ። በተቻለ ፍጥነት ምላሽ እንሰጣለን።'
            : 'Fill out the form below and our team will get back to you promptly.'}
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-[#E3EEF8]/60 border-2 border-[#C99A3B] rounded-xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#1E2A5E] text-[#C99A3B] text-3xl mx-auto flex items-center justify-center">
            ✓
          </div>
          <h3 className="text-lg font-bold text-[#1E2A5E]">
            {isAm ? 'መልዕክትዎ በተሳካ ሁኔታ ደርሶናል!' : 'Message Sent Successfully!'}
          </h3>
          <p className="text-sm text-[#44506B] max-w-md mx-auto">
            {isAm
              ? 'ስላነጋገሩን እናመሰግናለን። የቤተክርስቲያናችን አገልጋዮች በቅርቡ ምላሽ ይሰጡዎታል።'
              : 'Thank you for reaching out. We will review your message and reply as soon as possible.'}
          </p>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="mt-2 px-6 py-2.5 rounded-lg bg-[#1E2A5E] text-white text-xs font-bold hover:bg-[#2F5D9E] transition"
          >
            {isAm ? 'ሌላ መልዕክት ላክ' : 'Send Another Message'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-[#B4232C]">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#1E2A5E] uppercase tracking-wider mb-2">
                {isAm ? 'ሙሉ ስም *' : 'Full Name *'}
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder={isAm ? 'የእርስዎን ስም ያስገቡ' : 'e.g. Yohannes Tekle'}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#E3EEF8] bg-[#FBF7F0]/40 text-sm text-[#1E2A5E] focus:outline-hidden focus:border-[#C99A3B] focus:bg-white transition"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-[#1E2A5E] uppercase tracking-wider mb-2">
                {isAm ? 'ኢሜይል አድራሻ *' : 'Email Address *'}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@mail.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-[#E3EEF8] bg-[#FBF7F0]/40 text-sm text-[#1E2A5E] focus:outline-hidden focus:border-[#C99A3B] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Subject Category */}
          <div>
            <label className="block text-xs font-bold text-[#1E2A5E] uppercase tracking-wider mb-2">
              {isAm ? 'የመልዕክቱ ርዕስ' : 'Subject / Department'}
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#E3EEF8] bg-[#FBF7F0]/40 text-sm text-[#1E2A5E] focus:outline-hidden focus:border-[#C99A3B] focus:bg-white transition"
            >
              <option value="general">
                {isAm ? 'አጠቃላይ ጥያቄ' : 'General Inquiry'}
              </option>
              <option value="spiritual">
                {isAm ? 'መንፈሳዊ ምክርና የጸሎት ጥያቄ' : 'Spiritual Guidance & Prayer Request'}
              </option>
              <option value="media">
                {isAm ? 'የሚዲያና ዝግጅት ጥያቄ' : 'Media & Content Cooperation'}
              </option>
              <option value="support">
                {isAm ? 'የአገልግሎት አስተዋጽዖ እና በጎ አድራጎት' : 'Donations & Sunday School Fellowship'}
              </option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-bold text-[#1E2A5E] uppercase tracking-wider mb-2">
              {isAm ? 'መልዕክት *' : 'Your Message *'}
            </label>
            <textarea
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder={
                isAm
                  ? 'መልዕክትዎን ወይም ጥያቄዎን በዝርዝር እዚህ ይጻፉ...'
                  : 'Write your message or inquiry here...'
              }
              required
              className="w-full px-4 py-3 rounded-xl border border-[#E3EEF8] bg-[#FBF7F0]/40 text-sm text-[#1E2A5E] focus:outline-hidden focus:border-[#C99A3B] focus:bg-white transition resize-y"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1E2A5E] hover:bg-[#2F5D9E] text-white border-2 border-[#C99A3B] text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin text-base">⏳</span>
                  <span>{isAm ? 'በመላክ ላይ...' : 'Sending...'}</span>
                </>
              ) : (
                <>
                  <span>✉️</span>
                  <span>{isAm ? 'መልዕክት ላክ' : 'Send Message'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
