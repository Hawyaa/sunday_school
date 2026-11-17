'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/lib/store';
import { submitContactMessage } from '@/services/contact';
import './contact.css';

export default function ContactPage() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  const [fullName, setFullName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [topic, setTopic] = useState('General question');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<{
    name?: boolean;
    contact?: boolean;
    message?: boolean;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const contactInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: boolean; contact?: boolean; message?: boolean } = {};
    let firstInvalid: HTMLElement | null = null;

    if (!fullName.trim()) {
      newErrors.name = true;
      if (!firstInvalid) firstInvalid = nameInputRef.current;
    }

    if (!contactInfo.trim()) {
      newErrors.contact = true;
      if (!firstInvalid) firstInvalid = contactInputRef.current;
    }

    if (!message.trim()) {
      newErrors.message = true;
      if (!firstInvalid) firstInvalid = messageInputRef.current;
    }

    setErrors(newErrors);

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitContactMessage({
        fullName: fullName.trim(),
        contactInfo: contactInfo.trim(),
        topic,
        message: message.trim(),
      });
      setIsSubmitted(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to send message. Please try again.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFullName('');
    setContactInfo('');
    setTopic('General question');
    setMessage('');
    setErrors({});
    setSubmitError(null);
    setIsSubmitted(false);
  };

  return (
    <div className="contact-page">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="cp-hero">
          <div className="cp-container">
            <div className="cp-crumb">
              <Link href="/">{isAm ? 'መነሻ' : 'Home'}</Link> › <b>{isAm ? 'ያግኙን' : 'Contact'}</b>
            </div>

            <div className="cp-hero-grid">
              <div className="cp-hero-info">
                <span className="cp-kick">{isAm ? 'አግኙን' : 'GET IN TOUCH'}</span>
                <h1 className="cp-hero-title">
                  <em>Contact</em>
                </h1>
                <span className="am cp-sub">ያግኙን</span>
                <p className="cp-lead">
                  {isAm
                    ? 'ጥያቄዎች፣ የጸሎት ጥያቄዎች ወይም አስተያየቶች አሎት? በማህበራዊ ገጾቻችን ያግኙን ወይም ከታች መልዕክት ይላኩ።'
                    : 'Questions, prayer requests or ideas? Reach us on our channels or send a message below.'}
                </p>
              </div>

              {/* Channels Panel Card */}
              <div className="cp-channels-card">
                <small className="cp-channels-subtitle">{isAm ? 'ይከተሉንና መልዕክት ይላኩ' : 'FOLLOW & MESSAGE US'}</small>
                <h2 className="cp-channels-heading">{isAm ? 'በማህበራዊ ሚዲያ ያግኙን' : 'Find us online'}</h2>

                {/* Telegram */}
                <a
                  className="cp-channel-row"
                  style={{ '--i': 0 } as React.CSSProperties}
                  href="https://t.me/abune_media"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="cp-channel-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.674c.458 0 .66-.21.916-.457l2.199-2.138 4.574 3.379c.843.465 1.45.225 1.66-.782l2.997-14.122c.307-1.23-.467-1.785-1.209-1.42z" />
                    </svg>
                  </span>
                  <div className="cp-channel-meta">
                    <b>Telegram</b>
                    <span>t.me/abune_media</span>
                  </div>
                  <em className="cp-channel-arrow">{isAm ? 'ክፈት →' : 'Open →'}</em>
                </a>

                {/* YouTube */}
                <a
                  className="cp-channel-row"
                  style={{ '--i': 1 } as React.CSSProperties}
                  href="https://youtube.com/@abune_media"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="cp-channel-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                      />
                    </svg>
                  </span>
                  <div className="cp-channel-meta">
                    <b>YouTube</b>
                    <span>youtube.com/@abune_media</span>
                  </div>
                  <em className="cp-channel-arrow">{isAm ? 'ሰብስክራይብ →' : 'Subscribe →'}</em>
                </a>

                {/* TikTok */}
                <a
                  className="cp-channel-row"
                  style={{ '--i': 2 } as React.CSSProperties}
                  href="https://tiktok.com/@abune_media"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="cp-channel-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.72 1.35-.07 2.54-.97 2.89-2.27.13-.5.17-1.02.16-1.54V.02z" />
                    </svg>
                  </span>
                  <div className="cp-channel-meta">
                    <b>TikTok</b>
                    <span>@abune_media</span>
                  </div>
                  <em className="cp-channel-arrow">{isAm ? 'ይከተሉ →' : 'Follow →'}</em>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Message Form & Marginalia Section */}
        <section className="cp-form-section" id="msg">
          <div className="cp-container cp-form-grid">
            <div className="cp-form-column">
              <h2 className="cp-form-title">{isAm ? 'መልዕክት ይላኩልን' : 'Send us a message'}</h2>
              <p className="cp-form-intro">
                {isAm
                  ? 'እንዴት ልንረዳዎ እንደምንችል ያሳውቁን። በተቻለ ፍጥነት ምላሽ እንሰጣለን።'
                  : 'Tell us how we can help. We’ll reply as soon as we can.'}
              </p>

              <div id="box" className={`cp-box ${isSubmitted ? 'cp-sent' : ''}`}>
                <form className="cp-form" noValidate onSubmit={handleSubmit}>
                  <div className="cp-row2">
                    <div className={`cp-field ${errors.name ? 'cp-err' : ''}`}>
                      <label htmlFor="n">{isAm ? 'ሙሉ ስም *' : 'Full name *'}</label>
                      <input
                        id="n"
                        ref={nameInputRef}
                        name="name"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
                        }}
                      />
                      <span className="cp-error-msg">
                        {isAm ? 'እባክዎ ሙሉ ስምዎን ያስገቡ።' : 'Please enter your name.'}
                      </span>
                    </div>

                    <div className={`cp-field ${errors.contact ? 'cp-err' : ''}`}>
                      <label htmlFor="c">
                        {isAm ? 'ስልክ ወይም ኢሜይል *' : 'Phone or email *'}
                      </label>
                      <input
                        id="c"
                        ref={contactInputRef}
                        name="contact"
                        autoComplete="email"
                        value={contactInfo}
                        onChange={(e) => {
                          setContactInfo(e.target.value);
                          if (errors.contact) setErrors((prev) => ({ ...prev, contact: false }));
                        }}
                      />
                      <span className="cp-error-msg">
                        {isAm
                          ? 'እባክዎ ስልክ ቁጥር ወይም ኢሜይል ያስገቡ።'
                          : 'Please enter a phone number or email.'}
                      </span>
                    </div>
                  </div>

                  <div className="cp-field">
                    <label htmlFor="t">{isAm ? 'ጉዳይ / ርእስ' : 'Topic'}</label>
                    <select
                      id="t"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    >
                      <option value="General question">
                        {isAm ? 'አጠቃላይ ጥያቄ' : 'General question'}
                      </option>
                      <option value="Events">{isAm ? 'መርሐ ግብሮችና በዓላት' : 'Events'}</option>
                      <option value="Reports">{isAm ? 'ሪፖርቶች' : 'Reports'}</option>
                      <option value="Mezmur">{isAm ? 'መዝሙራት' : 'Mezmur'}</option>
                      <option value="Teachings">{isAm ? 'ትምህርቶች' : 'Teachings'}</option>
                      <option value="Other">{isAm ? 'ሌላ ጉዳይ' : 'Other'}</option>
                    </select>
                  </div>

                  <div className={`cp-field ${errors.message ? 'cp-err' : ''}`}>
                    <label htmlFor="m">{isAm ? 'መልዕክት *' : 'Message *'}</label>
                    <textarea
                      id="m"
                      ref={messageInputRef}
                      name="message"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors((prev) => ({ ...prev, message: false }));
                      }}
                    />
                    <span className="cp-error-msg">
                      {isAm ? 'እባክዎ አጭር መልዕክት ይጻፉ።' : 'Please write a short message.'}
                    </span>
                  </div>

                  {submitError && (
                    <div style={{ color: '#b91c1c', fontSize: '14px', marginBottom: '12px' }}>
                      {submitError}
                    </div>
                  )}

                  <button className="cp-btn cp-btn-navy" type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? isAm ? 'እየተላከ ነው...' : 'Sending...'
                      : isAm ? 'መልዕክት ላክ →' : 'Send message →'}
                  </button>
                </form>

                {/* Confirmation Box */}
                <div className="cp-success-box" role="status">
                  <h3>{isAm ? 'እናመሰግናለን።' : 'Thank you.'}</h3>
                  <p>
                    {isAm
                      ? 'መልዕክትዎ በተሳካ ሁኔታ ደርሶናል። በቅርቡ ምላሽ እንሰጣለን።'
                      : 'Your message has been sent. We’ll get back to you soon.'}
                  </p>
                  <button
                    className="cp-btn cp-btn-gold"
                    style={{ marginTop: '20px' }}
                    id="again"
                    type="button"
                    onClick={handleReset}
                  >
                    {isAm ? 'ሌላ መልዕክት ላክ' : 'Send another'}
                  </button>
                </div>
              </div>
            </div>

            {/* Sticky Marginalia Aside */}
            <aside className="cp-aside">
              <span className="cp-aside-symbol">✛</span>
              <h3 className="cp-aside-title">{isAm ? 'ሌሎች የመገናኛ መንገዶች' : 'Other ways to reach us'}</h3>
              <dl className="cp-aside-list">
                <div>
                  <dt>{isAm ? 'አድራሻ' : 'Visit'}</dt>
                  <dd>{isAm ? 'አዲስ አበባ፣ አቡነ ወረዳ' : 'Addis Ababa, Abune Wereda'}</dd>
                  <a
                    className="cp-aside-link"
                    href="https://www.google.com/maps/search/?api=1&query=Abune+Wereda+Addis+Ababa"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {isAm ? 'በካርታ እይ ↗' : 'Open in Maps ↗'}
                  </a>
                </div>

                <div>
                  <dt>{isAm ? 'ስልክ' : 'Call'}</dt>
                  <dd>
                    <a href="tel:+251911123456">+251 911 123 456</a>
                  </dd>
                </div>

                <div>
                  <dt>Telegram</dt>
                  <dd>
                    <a
                      href="https://t.me/abune_media"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      t.me/abune_media
                    </a>
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        {/* Visit Banner */}
        <section className="cp-visit-banner">
          <div className="cp-container cp-visit-row">
            <div>
              <h2>{isAm ? 'ሁልጊዜም እንኳን በደህና መጡ።' : 'You are always welcome.'}</h2>
              <p>{isAm ? 'አዲስ አበባ፣ አቡነ ወረዳ' : 'Addis Ababa, Abune Wereda'}</p>
            </div>
            <a
              className="cp-btn cp-btn-gold"
              href="https://www.google.com/maps/search/?api=1&query=Abune+Wereda+Addis+Ababa"
              target="_blank"
              rel="noopener noreferrer"
            >
              {isAm ? 'አቅጣጫ አሳየኝ' : 'Get directions'}
            </a>
          </div>
        </section>
      </main>

      <Footer compact={false} />
    </div>
  );
}
