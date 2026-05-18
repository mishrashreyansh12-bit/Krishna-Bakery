function Hero({ onOrderClick }) {
  return (
    <header className="h-screen hero-gradient flex items-center justify-center text-center text-white px-4">
      <div className="max-w-4xl">
        <span className="uppercase tracking-[0.3em] text-sm mb-4 block">
          Est. 2026 | Pure Craftsmanship
        </span>
        <h1 className="text-6xl md:text-8xl mb-6">Art of the Bake</h1>
        <p className="text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto">
          From rustic non-frosting cakes to elegant cheesecakes, we redefine
          premium desserts for the modern palate.
        </p>
        <button
          onClick={onOrderClick}
          className="inline-block border border-white px-10 py-4 hover:bg-white hover:text-black transition uppercase text-xs tracking-widest"
        >
          Order Now
        </button>
      </div>
    </header>
  );
}

export default Hero;
