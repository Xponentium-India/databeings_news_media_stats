interface PageHeroProps {
  title: string;
  image: string;
}

/** Dark photo banner with a serif page title (Services / Contact). */
export function PageHero({ title, image }: PageHeroProps) {
  return (
    <section className="relative flex h-[42vh] min-h-[320px] items-center overflow-hidden">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" />
      <div className="container relative">
        <h1 className="display-heading text-4xl text-white sm:text-5xl md:text-6xl">
          {title}
        </h1>
      </div>
    </section>
  );
}
