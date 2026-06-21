import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-white pt-20">
      <div className="container text-center">
        <p className="font-serif text-6xl font-bold text-accent-dark">404</p>
        <h1 className="display-heading mt-4 text-3xl">Page not found</h1>
        <p className="mt-3 text-ink/70">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Button asChild className="mt-8">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </section>
  );
}
