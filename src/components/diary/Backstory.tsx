export function Backstory() {
  return (
    <section className="backstory-scene fixed inset-0 z-10 flex items-center justify-center overflow-hidden px-7" aria-labelledby="backstory-title">
      <div className="backstory-blackout" aria-hidden="true" />
      <div className="backstory-doorway" aria-hidden="true" />
      <div className="backstory-burn backstory-burn-one" aria-hidden="true" />
      <div className="backstory-burn backstory-burn-two" aria-hidden="true" />
      <div className="backstory-tracking backstory-tracking-one" aria-hidden="true" />
      <div className="backstory-tracking backstory-tracking-two" aria-hidden="true" />
      <div className="backstory-tape-noise" aria-hidden="true" />
      <div className="backstory-frame-tear" aria-hidden="true" />
      <div className="backstory-scratch backstory-scratch-one" aria-hidden="true" />
      <div className="backstory-scratch backstory-scratch-two" aria-hidden="true" />

      <div className="backstory-message-wrap max-w-4xl text-center">
        <span className="backstory-message-echo" aria-hidden="true">IT’S TOO EARLY</span>
        <h2
          id="backstory-title"
          className="backstory-message font-[family-name:var(--font-display)] text-4xl leading-tight font-light text-cream italic sm:text-5xl md:text-7xl"
          data-text="It’s too early for that, don’t you think?"
        >
          <span className="backstory-word backstory-word-one">It’s too early</span>{" "}
          <span className="backstory-word backstory-word-two">for that,</span>{" "}
          <span className="backstory-word backstory-word-three">don’t you think?</span>
        </h2>
      </div>
    </section>
  );
}