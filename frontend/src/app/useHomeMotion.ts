'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, motionAllowed, EASE, DURATION, STAGGER } from '@/lib/motion/gsap';

export function useHomeMotion() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!motionAllowed() || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Next Session Card Animation (upward fade-in + subtle scale)
      const nextSession = containerRef.current?.querySelector('[data-anim="next-session"]');
      if (nextSession) {
        gsap.fromTo(
          nextSession,
          { opacity: 0, y: 35, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: DURATION.base,
            ease: EASE,
            scrollTrigger: {
              trigger: nextSession,
              start: 'top 92%',
              once: true,
            },
          }
        );
      }

      // 2. Upcoming Events (heading upward, staggered timeline rows)
      const eventsSection = containerRef.current?.querySelector('#events');
      if (eventsSection) {
        const heading = eventsSection.querySelector('[data-anim="events-heading"]');
        const rows = eventsSection.querySelectorAll('[data-anim="event-row"]');

        if (heading) {
          gsap.fromTo(
            heading,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: DURATION.base,
              ease: EASE,
              scrollTrigger: {
                trigger: eventsSection,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }

        if (rows.length > 0) {
          gsap.fromTo(
            rows,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: DURATION.base,
              stagger: 0.08,
              ease: EASE,
              scrollTrigger: {
                trigger: eventsSection,
                start: 'top 80%',
                once: true,
              },
            }
          );
        }
      }

      // 3. Teachings Section (split: image left-to-right, text right-to-left)
      const teachingsSection = containerRef.current?.querySelector('#teach');
      if (teachingsSection) {
        const imgSide = teachingsSection.querySelector('[data-anim="teachings-img"]');
        const textSide = teachingsSection.querySelector('[data-anim="teachings-text"]');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: teachingsSection,
            start: 'top 80%',
            once: true,
          },
        });

        if (imgSide) {
          tl.fromTo(
            imgSide,
            { opacity: 0, x: -40 },
            { opacity: 1, x: 0, duration: DURATION.slow, ease: EASE },
            0
          );
        }

        if (textSide) {
          tl.fromTo(
            textSide,
            { opacity: 0, x: 40 },
            { opacity: 1, x: 0, duration: DURATION.slow, ease: EASE },
            0.1
          );
        }
      }

      // 4. Announcements Section (heading upward, featured & side items staggered)
      const announcementsSection = containerRef.current?.querySelector('[data-anim="announcements-section"]');
      if (announcementsSection) {
        const heading = announcementsSection.querySelector('[data-anim="announcements-heading"]');
        const feat = announcementsSection.querySelector('[data-anim="announcement-feat"]');
        const side = announcementsSection.querySelector('[data-anim="announcement-side"]');

        if (heading) {
          gsap.fromTo(
            heading,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: DURATION.base,
              ease: EASE,
              scrollTrigger: {
                trigger: announcementsSection,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }

        if (feat) {
          gsap.fromTo(
            feat,
            { opacity: 0, y: 30, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: DURATION.base,
              ease: EASE,
              scrollTrigger: {
                trigger: feat,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }

        if (side) {
          gsap.fromTo(
            side,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: DURATION.base,
              delay: 0.15,
              ease: EASE,
              scrollTrigger: {
                trigger: side,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }
      }

      // 5. CTA Section (reveals upward)
      const ctaSection = containerRef.current?.querySelector('#contact');
      if (ctaSection) {
        const content = ctaSection.querySelector('[data-anim="cta-content"]');
        if (content) {
          gsap.fromTo(
            content,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: DURATION.base,
              ease: EASE,
              scrollTrigger: {
                trigger: ctaSection,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return containerRef;
}
