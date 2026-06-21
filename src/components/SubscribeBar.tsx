import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Reveal } from "./Reveal";

export function SubscribeBar() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="border-t border-ink/10 bg-paper-2">
      <div className="container py-16 md:py-20">
        <Reveal className="grid items-end gap-8 md:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="eyebrow">Newsletter</p>
            <h2 className="mt-4 font-display text-5xl font-bold tracking-tight text-ink md:text-6xl">
              Subscribe
            </h2>
          </div>

          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setDone(true);
            }}
          >
            <div className="flex items-center gap-4 border-b-2 border-ink/20 pb-1 focus-within:border-flame">
              <Input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 flex-1 border-0 text-lg"
                aria-label="Email Address"
              />
              <Button
                type="submit"
                variant="flame"
                size="icon"
                className="h-12 w-12 shrink-0"
                aria-label="Subscribe"
              >
                {done ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <ArrowRight className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p className="mt-3 font-mono text-xs uppercase tracking-wider text-ink/50">
              {done ? "Thank you!" : "I'm Interested — periodic insights on trends"}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
