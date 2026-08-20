import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const WHATSAPP_NUMBER = "2347007225776";
const GREETING = "Hi PackMyLoad, I'd like to get a quote for a move.";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(GREETING)}`;

type FieldKey =
  | "full_name"
  | "email"
  | "phone"
  | "pickup_address"
  | "destination_address"
  | "pickup_floor"
  | "destination_floor"
  | "moving_date";

const questions: {
  key: FieldKey;
  prompt: string;
  placeholder: string;
  type?: string;
}[] = [
  { key: "full_name", prompt: "What's your full name?", placeholder: "e.g. Amaka Obi" },
  {
    key: "email",
    prompt: "Thanks! What email should we send your quote to?",
    placeholder: "you@email.com",
    type: "email",
  },
  { key: "phone", prompt: "And your mobile number?", placeholder: "0803 000 0000", type: "tel" },
  {
    key: "pickup_address",
    prompt: "Where are we picking up from?",
    placeholder: "Pick-up address",
  },
  {
    key: "destination_address",
    prompt: "And where are we moving to?",
    placeholder: "Destination address",
  },
  {
    key: "pickup_floor",
    prompt: "What floor is the pick-up on? (e.g. Ground Floor, 2nd Floor, elevator available)",
    placeholder: "Pick-up floor",
  },
  {
    key: "destination_floor",
    prompt: "And the destination floor?",
    placeholder: "Destination floor",
  },
  {
    key: "moving_date",
    prompt: "Last one — what's your preferred moving date?",
    placeholder: "Preferred date",
    type: "date",
  },
];

type Message = { from: "bot" | "user"; text: string };

/** Agents are online Mon–Sat, 08:00–18:00 Lagos time (UTC+1). */
function useAgentOnline() {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const check = () => {
      const lagos = new Date(Date.now() + 60 * 60 * 1000);
      const day = lagos.getUTCDay();
      const hour = lagos.getUTCHours();
      setOnline(day >= 1 && day <= 6 && hour >= 8 && hour < 18);
    };
    check();
    const id = window.setInterval(check, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return online;
}

export function WhatsAppChat() {
  const [open, setOpen] = useState(false);
  const online = useAgentOnline();
  const [step, setStep] = useState(0);
  const [value, setValue] = useState("");
  const [answers, setAnswers] = useState<Partial<Record<FieldKey, string>>>({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = useMemo<Message[]>(() => {
    const list: Message[] = [
      {
        from: "bot",
        text: "Hi there! I'm the PackMyLoad assistant. Our team is offline right now, but I can take your move details and a consultant will get back to you.",
      },
    ];
    questions.forEach((q, index) => {
      if (index > step) return;
      list.push({ from: "bot", text: q.prompt });
      const answer = answers[q.key];
      if (answer) list.push({ from: "user", text: answer });
    });
    if (done) {
      list.push({
        from: "bot",
        text: "Thank you! A moving consultant will review your details and reach out shortly.",
      });
    }
    return list;
  }, [answers, step, done]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, saving]);

  const current = questions[step];

  async function submit(final: Record<string, string>) {
    setSaving(true);
    setError(null);
    const { error: insertError } = await supabase.from("lead_inquiries").insert({
      full_name: final['full_name'] ?? "",
      email: final['email'] ?? "",
      phone: final['phone'] ?? "",
      pickup_address: final['pickup_address'] ?? "",
      destination_address: final['destination_address'] ?? "",
      pickup_floor: final['pickup_floor'] ?? null,
      destination_floor: final['destination_floor'] ?? null,
      moving_date: final['moving_date'] ?? null,
    });
    setSaving(false);
    if (insertError) {
      setError("We couldn't save your details. Please try again or message us on WhatsApp.");
      return;
    }
    setDone(true);
  }

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || !current) return;
    const next = { ...answers, [current.key]: trimmed };
    setAnswers(next);
    setValue("");
    if (step === questions.length - 1) {
      void submit(next as Record<string, string>);
    } else {
      setStep((s) => s + 1);
    }
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setValue("");
    setDone(false);
    setError(null);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close WhatsApp chat" : "Open WhatsApp chat"}
        aria-expanded={open}
        className="fixed right-4 bottom-4 z-50 inline-flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:right-6 sm:bottom-6"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-7" />}
        {!open ? (
          <span className="absolute -top-0.5 -right-0.5 size-3.5 rounded-full border-2 border-background bg-accent" />
        ) : null}
      </button>

      {open ? (
        <div className="fixed inset-x-4 bottom-22 z-50 flex max-h-[70vh] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-lift sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-[22rem]">
          <div className="bg-brand-gradient px-4 py-3.5 text-primary-foreground">
            <p className="text-base font-semibold">Chat with PackMyLoad</p>
            <p className="mt-1 flex items-center gap-2 text-xs text-primary-foreground/85">
              <span
                className={cn(
                  "size-2 rounded-full",
                  online ? "bg-[#25D366]" : "bg-primary-foreground/50",
                )}
                aria-hidden="true"
              />
              {online ? "Agent online — we reply in minutes" : "Agents offline — leave your details"}
            </p>
          </div>

          {online ? (
            <div className="space-y-4 p-5 text-sm">
              <p className="text-muted-foreground">
                A moving consultant is available on WhatsApp right now. Tap below and we'll pick up
                your chat with your quote request already typed out.
              </p>
              <Button
                asChild
                size="lg"
                className="w-full rounded-full bg-[#25D366] text-white hover:bg-[#25D366]/90"
              >
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-surface p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm",
                      message.from === "bot"
                        ? "bg-card text-card-foreground shadow-soft"
                        : "ml-auto bg-primary text-primary-foreground",
                    )}
                  >
                    {message.text}
                  </div>
                ))}
                {saving ? (
                  <p className="text-xs text-muted-foreground">Saving your details…</p>
                ) : null}
                {error ? <p className="text-xs text-destructive">{error}</p> : null}
              </div>

              {done ? (
                <div className="flex items-center justify-between gap-2 border-t border-border p-3">
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="size-4 text-accent" aria-hidden="true" />
                    Request received
                  </span>
                  <Button variant="outline" size="sm" className="rounded-full" onClick={reset}>
                    Start again
                  </Button>
                </div>
              ) : (
                <form
                  className="flex items-center gap-2 border-t border-border p-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleSend();
                  }}
                >
                  <label className="sr-only" htmlFor="pml-chat-input">
                    {current?.prompt ?? "Your answer"}
                  </label>
                  <Input
                    id="pml-chat-input"
                    type={current?.type ?? "text"}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder={current?.placeholder ?? ""}
                    disabled={saving}
                    className="rounded-full"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={saving || !value.trim()}
                    className="shrink-0 rounded-full"
                    aria-label="Send answer"
                  >
                    <Send className="size-4" aria-hidden="true" />
                  </Button>
                </form>
              )}
            </>
          )}
        </div>
      ) : null}
    </>
  );
}
