import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function SubscribeBar() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="bg-cream">
      <div className="container py-12">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <h2 className="display-heading text-4xl text-ink md:text-5xl">
            Subscribe
          </h2>
          <form
            className="flex w-full max-w-xl items-center gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setDone(true);
            }}
          >
            <Input
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 flex-1 bg-white/90"
              aria-label="Email Address"
            />
            <Button type="submit" size="lg" className="shrink-0">
              {done ? "Thank you!" : "I'm Interested"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
