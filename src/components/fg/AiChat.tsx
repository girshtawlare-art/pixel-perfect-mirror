import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { chatReply, type BasketItem } from "@/services/ai";
import { store, useStore } from "@/store/store";
import { BasketList, Thinking } from "./AiStrip";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "bot"; text: string; items?: BasketItem[] };
const QUICK = ["Dinner for 2 tonight", "Any offers today?", "High-protein snacks", "Track my order"];

export function AiChat() {
  const open = useStore((s) => s.ui.chatOpen);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "bot", text: "Hi! I'm Genie 🧞 Tell me what you need and I'll fill your cart." }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const send = async (text: string) => {
    if (!text.trim() || typing) return;
    setMsgs((m) => [...m, { role: "user", text }]); setInput(""); setTyping(true);
    const r = await chatReply(text); // TODO(real AI): stream from a server function
    setTyping(false); setMsgs((m) => [...m, { role: "bot", ...r }]);
  };

  return (
    <>
      <button onClick={() => store.ui({ chatOpen: !open })} aria-label={open ? "Close assistant" : "Open FreshGenie assistant"}
        className="press fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-highlight text-2xl shadow-xl ring-4 ring-background transition-transform hover:scale-105">
        {open ? <X className="size-6 text-highlight-foreground" /> : "🧞"}
      </button>
      {open && (
        <div role="dialog" aria-label="FreshGenie assistant" className="animate-slide-up fixed bottom-24 right-3 z-40 flex h-[min(560px,75vh)] w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-3xl border bg-background shadow-2xl sm:right-5 sm:w-96">
          <div className="flex items-center gap-3 bg-brand px-4 py-3 text-brand-foreground">
            <span className="grid size-9 place-items-center rounded-full bg-highlight text-lg">🧞</span>
            <div><div className="font-extrabold">Genie</div><div className="text-xs opacity-80">Your grocery assistant · online</div></div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-3" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={cn("animate-fade-up flex", m.role === "user" && "justify-end")}>
                <div className={cn("max-w-[88%] rounded-2xl px-3 py-2 text-sm", m.role === "user" ? "rounded-br-sm bg-foreground text-background" : "rounded-bl-sm bg-muted")}>
                  {m.text}
                  {m.items && m.items.length > 0 && <div className="mt-2"><BasketList items={m.items} compact /></div>}
                </div>
              </div>
            ))}
            {typing && <div className="w-fit rounded-2xl bg-muted px-3 py-2"><Thinking label="Genie is typing" /></div>}
            <div ref={end} />
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 pb-2">
            {QUICK.map((q) => <button key={q} onClick={() => send(q)} className="press shrink-0 rounded-full border px-3 py-1 text-xs font-semibold hover:border-brand">{q}</button>)}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 border-t p-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Genie anything…" aria-label="Message Genie" className="h-10 flex-1 rounded-full border bg-muted/50 px-4 text-sm outline-none focus:border-brand" />
            <button aria-label="Send" className="press grid size-10 place-items-center rounded-full bg-brand text-brand-foreground"><Send className="size-4" /></button>
          </form>
        </div>
      )}
    </>
  );
}
