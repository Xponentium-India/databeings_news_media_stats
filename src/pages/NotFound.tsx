import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="grain relative flex min-h-screen items-center overflow-hidden bg-ink text-paper">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #F2C94C 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-flame/20 blur-[120px]" />
      <div className="container relative text-center">
        <p className="font-display text-[28vw] font-bold leading-none tracking-tighter text-white/10 md:text-[16rem]">
          404
        </p>
        <h1 className="-mt-6 font-display text-3xl font-bold tracking-tight md:-mt-12 md:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-paper/65">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Button asChild variant="flame" size="lg" className="mt-10">
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
        </Button>
      </div>
    </section>
  );
}
