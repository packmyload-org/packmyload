import { Suspense, lazy, useEffect, useState } from "react";

const WhatsAppChat = lazy(() =>
  import("@/components/site/WhatsAppChat").then((m) => ({ default: m.WhatsAppChat })),
);

/**
 * Keeps the chat widget's JavaScript out of the critical path: it only loads
 * once the browser is idle or the visitor interacts with the page.
 */
export function DeferredChat() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let done = false;
    const load = () => {
      if (done) return;
      done = true;
      setShow(true);
    };
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, load, { once: true, passive: true }));
    const idle = window.setTimeout(load, 4000);
    return () => {
      window.clearTimeout(idle);
      events.forEach((event) => window.removeEventListener(event, load));
    };
  }, []);

  if (!show) return null;

  return (
    <Suspense fallback={null}>
      <WhatsAppChat />
    </Suspense>
  );
}
