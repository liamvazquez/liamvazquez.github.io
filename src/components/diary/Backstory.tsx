export function Backstory() {
  return (
    <section className="backstory-scene fixed inset-0 z-10 flex items-center justify-center overflow-hidden px-7" aria-labelledby="backstory-title">
      <div className="backstory-blackout" aria-hidden="true" />
      <div className="backstory-tracking backstory-tracking-one" aria-hidden="true" />
      <div className="backstory-tracking backstory-tracking-two" aria-hidden="true" />
      <div className="backstory-tape-noise" aria-hidden="true" />
      <div className="backstory-frame-tear" aria-hidden="true" />

      <h2
        id="backstory-title"
        className="backstory-message max-w-4xl text-center font-[family-name:var(--font-display)] text-4xl leading-tight font-light text-cream italic sm:text-5xl md:text-7xl"
        data-text="It’s too early for that, don’t you think?"
      >
        <span>It’s too early for that, don’t you think?</span>
      </h2>
    </section>
  );
}