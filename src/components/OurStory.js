// ─── Our Story Section ────────────────────────────────────────────────────────

const milestones = [
  { year: "2019", title: "Where It All Began", desc: "Krishna Bakers opened its first tiny kitchen in the heart of the city. Just one oven, two bakers, and a dream to bake something honest.", icon: "🔥" },
  { year: "2020", title: "Survived & Thrived", desc: "Through the toughest year the world had seen, we kept baking. Home deliveries, late nights, and loyal customers kept us alive.", icon: "💪" },
  { year: "2021", title: "First 1000 Orders", desc: "Word spread fast. Our Classic English Cake became the city's favourite. We crossed 1000 orders and opened our second outlet.", icon: "🎉" },
  { year: "2022", title: "Expanding the Family", desc: "5 new locations across the region. A bigger team, a bigger kitchen, and the same original recipes that started it all.", icon: "📍" },
  { year: "2023", title: "Going Beyond the City", desc: "Krishna Bakers stepped into 3 new cities. Our Velvet Cheesecake won a regional bakery award. Humbled and grateful.", icon: "🏆" },
  { year: "2024–25", title: "20 Locations & Counting", desc: "Today we stand at 20+ outlets across 10 cities. Every single item is still baked fresh, every single day — just like day one.", icon: "🌟" },
];

const locations = [
  { city: "Delhi",     outlets: 4, flagship: true  },
  { city: "Noida",     outlets: 3, flagship: false },
  { city: "Gurgaon",   outlets: 2, flagship: false },
  { city: "Jaipur",    outlets: 2, flagship: false },
  { city: "Lucknow",   outlets: 2, flagship: false },
  { city: "Chandigarh",outlets: 2, flagship: false },
  { city: "Agra",      outlets: 1, flagship: false },
  { city: "Meerut",    outlets: 1, flagship: false },
  { city: "Dehradun",  outlets: 1, flagship: false },
  { city: "Mathura",   outlets: 1, flagship: false },
];

const stats = [
  { value: "6+",    label: "Years of Baking",    icon: "🎂" },
  { value: "20+",   label: "Outlets Nationwide",  icon: "📍" },
  { value: "10",    label: "Cities Covered",      icon: "🏙️" },
  { value: "50K+",  label: "Happy Customers",     icon: "❤️" },
];

function OurStory() {
  return (
    <section id="our-story" className="bg-[#FAF9F6]">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-stone-900 py-28 px-6 text-center">
        {/* background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=80')" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-amber-400 text-xs uppercase tracking-[0.4em] mb-4 font-semibold">Est. 2019</p>
          <h2 className="text-5xl md:text-7xl text-white mb-6" style={{ fontFamily: "Georgia, serif" }}>
            Our Story
          </h2>
          <p className="text-stone-300 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Six years ago, we started with a single oven and a belief — that great baking
            doesn't need shortcuts. That belief still drives every loaf, every cake,
            every croissant we make today.
          </p>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="bg-amber-900 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-amber-200 text-xs uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Journey Timeline ── */}
      <div className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-amber-700 text-xs uppercase tracking-[0.3em] font-semibold mb-3">The Journey</p>
          <h3 className="text-4xl text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
            6 Years, One Passion
          </h3>
        </div>

        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-amber-200 -translate-x-1/2" />

          <div className="space-y-12">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                className={`relative flex items-start gap-6 md:gap-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* dot on line */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-10 h-10 bg-amber-900 rounded-full flex items-center justify-center text-lg shadow-lg z-10 shrink-0">
                  {m.icon}
                </div>

                {/* card */}
                <div className={`ml-16 md:ml-0 md:w-[45%] ${i % 2 === 0 ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"}`}>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">{m.year}</span>
                    <h4 className="text-lg font-bold text-gray-900 mt-3 mb-2">{m.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Values Strip ── */}
      <div className="bg-stone-50 border-y border-gray-100 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {[
            { icon: "🌾", title: "Fresh Every Day",    desc: "Nothing is pre-made. Every item is baked fresh each morning before the shutters open." },
            { icon: "🤍", title: "No Shortcuts",       desc: "We use real butter, real chocolate, and real fruit. No artificial flavours, ever." },
            { icon: "👨‍🍳", title: "Trained Bakers",    desc: "Every baker at Krishna goes through a 3-month training programme before touching a single order." },
          ].map((v) => (
            <div key={v.title} className="flex flex-col items-center">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl mb-4">{v.icon}</div>
              <h4 className="font-bold text-gray-900 mb-2">{v.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Locations ── */}
      <div className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-amber-700 text-xs uppercase tracking-[0.3em] font-semibold mb-3">Find Us</p>
          <h3 className="text-4xl text-gray-900 mb-4" style={{ fontFamily: "Georgia, serif" }}>
            20+ Outlets Across India
          </h3>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            From our flagship store in Delhi to our newest outlet in Mathura — the same freshness, the same love, everywhere.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {locations.map((loc) => (
            <div
              key={loc.city}
              className={`relative rounded-2xl p-4 text-center border transition hover:shadow-md ${
                loc.flagship
                  ? "bg-amber-900 border-amber-900 text-white"
                  : "bg-white border-gray-100 text-gray-800 hover:border-amber-300"
              }`}
            >
              {loc.flagship && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] bg-amber-400 text-amber-900 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                  Flagship
                </span>
              )}
              <div className="text-2xl mb-2">📍</div>
              <p className={`font-bold text-sm ${loc.flagship ? "text-white" : "text-gray-900"}`}>{loc.city}</p>
              <p className={`text-xs mt-0.5 ${loc.flagship ? "text-amber-200" : "text-gray-400"}`}>
                {loc.outlets} outlet{loc.outlets > 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>

        {/* map placeholder */}
        <div className="mt-10 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <iframe
            title="Krishna Bakers Locations"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d224345.83923192776!2d77.06889754725782!3d28.52758200617607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1716000000000!5m2!1sen!2sin"
            width="100%"
            height="320"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* ── Closing Quote ── */}
      <div className="bg-amber-900 py-20 px-6 text-center">
        <p className="text-amber-200 text-xs uppercase tracking-[0.4em] mb-6">Our Promise</p>
        <blockquote className="text-white text-2xl md:text-4xl font-light max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
          "Every cake we bake carries six years of learning, love, and the relentless pursuit of the perfect bite."
        </blockquote>
        <p className="text-amber-300 text-sm mt-6">— Krishna Bakers, Since 2019</p>
      </div>

    </section>
  );
}

export default OurStory;
