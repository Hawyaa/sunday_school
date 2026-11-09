'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/lib/store';
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

  const [isSubmitted, setIsSubmitted] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const contactInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
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

    // Success state
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFullName('');
    setContactInfo('');
    setTopic('General question');
    setMessage('');
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <div className="contact-page">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="w">
            <div className="crumb">
              <Link href="/">{isAm ? 'መነሻ' : 'Home'}</Link> › <b>{isAm ? 'ያግኙን' : 'Contact'}</b>
            </div>

            <div className="hg">
              <div>
                <span className="kick">{isAm ? 'አግኙን' : 'GET IN TOUCH'}</span>
                <h1>
                  <em>Contact</em>
                </h1>
                <span className="am sub">ያግኙን</span>
                <p className="l">
                  {isAm
                    ? 'ጥያቄዎች፣ የጸሎት ጥያቄዎች ወይም አስተያየቶች አሎት? በማህበራዊ ገጾቻችን ያግኙን ወይም ከታች መልዕክት ይላኩ።'
                    : 'Questions, prayer requests or ideas? Reach us on our channels or send a message below.'}
                </p>
              </div>

              {/* Channels Panel */}
              <div className="ch">
                <small>{isAm ? 'ይከተሉንና መልዕክት ይላኩ' : 'FOLLOW & MESSAGE US'}</small>
                <h2>{isAm ? 'በማህበራዊ ሚዲያ ያግኙን' : 'Find us online'}</h2>

                {/* Telegram */}
                <a
                  className="cr"
                  style={{ '--i': 0 } as React.CSSProperties}
                  href="https://t.me/abune_media"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ic">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M21.5 3.5 2.8 10.8c-.8.3-.8 1.4 0 1.7l4.6 1.5 1.8 5.6c.2.7 1.1.9 1.6.4l2.6-2.5 4.7 3.4c.6.4 1.4.1 1.6-.6L22.9 4.7c.2-.9-.7-1.5-1.4-1.2zM9.1 13.6l8.5-5.2-6.6 6.3-.3 3z" />
                    </svg>
                  </span>
                  <div>
                    <b>Telegram</b>
                    <span>t.me/abune_media</span>
                  </div>
                  <em>{isAm ? 'ክፈት →' : 'Open →'}</em>
                </a>

                {/* YouTube */}
                <a
                  className="cr"
                  style={{ '--i': 1 } as React.CSSProperties}
                  href="https://youtube.com/@abune_media"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ic">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <rect x="1.5" y="4.5" width="21" height="15" rx="4.5" />
                      <path className="cut" d="M10 8.8v6.4l5.4-3.2z" />
                    </svg>
                  </span>
                  <div>
                    <b>YouTube</b>
                    <span>youtube.com/@abune_media</span>
                  </div>
                  <em>{isAm ? 'ሰብስክራይብ →' : 'Subscribe →'}</em>
                </a>

                {/* TikTok */}
                <a
                  className="cr"
                  style={{ '--i': 2 } as React.CSSProperties}
                  href="https://tiktok.com/@abune_media"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M14.5 3v11.2a3.7 3.7 0 1 1-3.7-3.7M14.5 3c.4 2.7 2.1 4.2 5 4.4" />
                    </svg>
                  </span>
                  <div>
                    <b>TikTok</b>
                    <span>@abune_media</span>
                  </div>
                  <em>{isAm ? 'ይከተሉ →' : 'Follow →'}</em>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Message Form & Marginalia Section */}
        <section className="fs" id="msg">
          <div className="w fg">
            <div>
              <h2>{isAm ? 'መልዕክት ይላኩልን' : 'Send us a message'}</h2>
              <p className="in">
                {isAm
                  ? 'እንዴት ልንረዳዎ እንደምንችል ያሳውቁን። በተቻለ ፍጥነት ምላሽ እንሰጣለን።'
                  : 'Tell us how we can help. We’ll reply as soon as we can.'}
              </p>

              <div id="box" className={isSubmitted ? 'sent' : ''}>
                <form id="f" noValidate onSubmit={handleSubmit}>
                  <div className="row2">
                    <div className={`fl ${errors.name ? 'err' : ''}`}>
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
                      <span className="er">
                        {isAm ? 'እባክዎ ሙሉ ስምዎን ያስገቡ።' : 'Please enter your name.'}
                      </span>
                    </div>

                    <div className={`fl ${errors.contact ? 'err' : ''}`}>
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
                      <span className="er">
                        {isAm
                          ? 'እባክዎ ስልክ ቁጥር ወይም ኢሜይል ያስገቡ።'
                          : 'Please enter a phone number or email.'}
                      </span>
                    </div>
                  </div>

                  <div className="fl">
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

                  <div className={`fl ${errors.message ? 'err' : ''}`}>
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
                    <span className="er">
                      {isAm ? 'እባክዎ አጭር መልዕክት ይጻፉ።' : 'Please write a short message.'}
                    </span>
                  </div>

                  <button className="btn bn" type="submit">
                    {isAm ? 'መልዕክት ላክ →' : 'Send message →'}
                  </button>
                </form>

                {/* Confirmation Box */}
                <div className="ok" role="status">
                  <h3>{isAm ? 'እናመሰግናለን።' : 'Thank you.'}</h3>
                  <p>
                    {isAm
                      ? 'መልዕክትዎ በተሳካ ሁኔታ ደርሶናል። በቅርቡ ምላሽ እንሰጣለን።'
                      : 'Your message has been sent. We’ll get back to you soon.'}
                  </p>
                  <button
                    className="btn bg"
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
            <aside className="nt">
              <span className="x">✛</span>
              <h3>{isAm ? 'ሌሎች የመገናኛ መንገዶች' : 'Other ways to reach us'}</h3>
              <dl>
                <div>
                  <dt>{isAm ? 'አድራሻ' : 'Visit'}</dt>
                  <dd>{isAm ? 'አዲስ አበባ፣ አቡነ ወረዳ' : 'Addis Ababa, Abune Wereda'}</dd>
                  <a
                    className="l"
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
        <section className="vb">
          <div className="w">
            <div>
              <h2>{isAm ? 'ሁልጊዜም እንኳን በደህና መጡ።' : 'You are always welcome.'}</h2>
              <p>{isAm ? 'አዲስ አበባ፣ አቡነ ወረዳ' : 'Addis Ababa, Abune Wereda'}</p>
            </div>
            <a
              className="btn bg"
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
