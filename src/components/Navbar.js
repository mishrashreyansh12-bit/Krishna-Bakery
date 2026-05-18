function Navbar({ onOrderClick }) {
  return (
    <nav className="fixed w-full z-50 px-8 py-6 flex justify-between items-center glass border-b border-gray-100">
      <div className="text-2xl font-bold tracking-tighter text-amber-900">
        KRISHNA BAKERS
      </div>
      <div className="hidden md:flex space-x-10 font-medium text-sm uppercase tracking-widest">
        <a href="#collection" className="hover:text-amber-700 transition">
          Collections
        </a>
        <a
          href="#ai-customizer"
          className="hover:text-amber-700 transition underline decoration-amber-500"
        >
          AI Customizer
        </a>
        <a href="#our-story" className="hover:text-amber-700 transition">
          Our Story
        </a>
        <a href="#reviews" className="hover:text-amber-700 transition">
          Reviews
        </a>
      </div>
      <button
        onClick={onOrderClick}
        className="bg-amber-900 text-white px-6 py-2 rounded-full text-sm hover:bg-amber-800 transition"
      >
        Order Online
      </button>
    </nav>
  );
}

export default Navbar;
