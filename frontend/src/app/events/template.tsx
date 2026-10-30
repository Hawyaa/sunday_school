/**
 * app/events/template.tsx
 * A template (unlike a layout) is re-created on every navigation into /events,
 * including browser back/forward, so this fade plays each time.
 * Opacity only, so it never creates a containing block for a fixed/sticky Header.
 */
export default function EventsTemplate({ children }: { children: React.ReactNode }) {
  return <div className="ev-route">{children}</div>;
}
