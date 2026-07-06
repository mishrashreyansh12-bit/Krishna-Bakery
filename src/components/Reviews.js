import { useState } from "react";

const REVIEWS = [
  { id: 1, name: "Priya Sharma", location: "Delhi", avatar: "https://randomuser.me/api/portraits/women/44.jpg", rating: 5, date: "12 May 2025", product: "Classic English Cake", text: "Absolutely divine! The sponge was so light and fresh — nothing like the over-sweetened cakes you get elsewhere. Ordered for my mom's birthday and she was in tears. Will order every month now!", images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80","https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80"], video: null, verified: true, helpful: 42 },
  { id: 2, name: "Rahul Mehta", location: "Noida", avatar: "https://randomuser.me/api/portraits/men/32.jpg", rating: 5, date: "3 May 2025", product: "Chocolate Truffle Cake", text: "Best chocolate cake in the NCR, hands down. The ganache was thick and glossy, layers were perfectly even. My office team finished it in 10 minutes flat. Already placed the next order!", images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80"], video: null, verified: true, helpful: 38 },
  { id: 3, name: "Ananya Gupta", location: "Gurgaon", avatar: "https://randomuser.me/api/portraits/women/68.jpg", rating: 5, date: "28 Apr 2025", product: "Velvet Cheesecake", text: "I've had cheesecakes from 5-star hotels and this one beats them all. The texture is silky, not too dense, not too light. The crust is buttery perfection. Packaging was also super premium.", images: ["https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=400&q=80","https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&q=80"], video: null, verified: true, helpful: 61 },
  { id: 4, name: "Vikram Singh", location: "Jaipur", avatar: "https://randomuser.me/api/portraits/men/75.jpg", rating: 4, date: "20 Apr 2025", product: "Classic Fudge Brownie", text: "The brownies are genuinely fudgy — not cakey at all. Crinkle top was perfect. Only wish the box had more pieces! Delivery was on time and everything was intact.", images: ["https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80"], video: null, verified: true, helpful: 29 },
  { id: 5, name: "Sneha Kapoor", location: "Lucknow", avatar: "https://randomuser.me/api/portraits/women/12.jpg", rating: 5, date: "15 Apr 2025", product: "Mango Mousse Cake", text: "Seasonal special and it truly felt special! Real mango flavour, not artificial at all. The mousse layers were cloud-like. Got so many compliments at my daughter's birthday party.", images: ["https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&q=80","https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=400&q=80"], video: null, verified: true, helpful: 55 },
  { id: 6, name: "Arjun Nair", location: "Chandigarh", avatar: "https://randomuser.me/api/portraits/men/18.jpg", rating: 5, date: "8 Apr 2025", product: "Pain au Chocolat", text: "Woke up early just to get these fresh. The layers were so flaky they shattered when I bit in. Dark chocolate inside was rich and not too sweet. This is proper French bakery quality.", images: ["https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=400&q=80"], video: null, verified: false, helpful: 17 },
  { id: 7, name: "Meera Joshi", location: "Delhi", avatar: "https://randomuser.me/api/portraits/women/90.jpg", rating: 4, date: "1 Apr 2025", product: "Hot Chocolate", text: "Thick, rich, and not too sweet. You can actually taste the Belgian chocolate. Perfect for cold evenings. Wish they had a larger size option though!", images: [], video: null, verified: true, helpful: 23 },
  { id: 8, name: "Kabir Malhotra", location: "Noida", avatar: "https://randomuser.me/api/portraits/men/55.jpg", rating: 5, date: "25 Mar 2025", product: "Butterscotch Cake", text: "Nostalgia in every bite. This is exactly how butterscotch cake should taste — caramel notes, soft crumb, and that drizzle on top. Ordered twice in the same week!", images: ["https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=400&q=80"], video: null, verified: true, helpful: 34 },
  { id: 9, name: "Divya Rawat", location: "Dehradun", avatar: "https://randomuser.me/api/portraits/women/33.jpg", rating: 5, date: "18 Mar 2025", product: "Classic Fudge Brownie", text: "I literally filmed the unboxing because I couldn't believe how perfectly packed everything was. The brownie was exactly as described — dense, fudgy, crinkle top. 10/10 would recommend!", images: ["https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80"], video: null, verified: true, helpful: 47 },
];

const RATING_SUMMARY = { 5: 78, 4: 14, 3: 5, 2: 2, 1: 1 };
const AVG_RATING = 4.8;
const TOTAL_REVIEWS = 1240;

// Instagram Reels — teri 3 real reels
const REELS = [
  { shortcode: "DMFv-IrxTUH", poster: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80", label: "Classic English Cake · Unboxing", reviewer: { name: "Priya Sharma", img: "women/44.jpg" }, location: "Delhi" },
  { shortcode: "DW08hL6CODn", poster: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80", label: "Chocolate Truffle · First Bite", reviewer: { name: "Rahul Mehta", img: "men/32.jpg" }, location: "Noida" },
  { shortcode: "DQ4RdgdkjZx", poster: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80", label: "Fudge Brownie · Box Reveal", reviewer: { name: "Divya Rawat", img: "women/33.jpg" }, location: "Dehradun" },
];

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating, size = "sm" }) {
  const sz = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`${sz} ${s <= rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  );
}

// ─── Instagram Reel Card — click opens reel in new tab, no embed ──────────────
function InstaCard({ shortcode, poster, label, reviewer, location }) {
  const reelUrl = `https://www.instagram.com/reel/${shortcode}/`;
  return (
    <div className="flex flex-col">
      <a href={reelUrl} target="_blank" rel="noopener noreferrer"
        className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-md block group"
        style={{ aspectRatio: "9/16", maxHeight: "420px" }}>
        <img src={poster} alt={label}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {/* play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-200"
            style={{ background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
            <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        {/* Instagram badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span className="text-white text-[10px] font-semibold">Reel</span>
        </div>
        {/* label */}
        <div className="absolute bottom-3 left-3 right-3">
          <span className="text-[11px] bg-black/70 text-white px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 backdrop-blur-sm w-fit">
            <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse shrink-0" />
            {label}
          </span>
        </div>
      </a>
      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={`https://randomuser.me/api/portraits/${reviewer.img}`} alt="" className="w-7 h-7 rounded-full ring-2 ring-pink-200" />
          <div>
            <p className="text-xs font-semibold text-gray-800">{reviewer.name}</p>
            <p className="text-[10px] text-gray-400">{location} · ⭐⭐⭐⭐⭐</p>
          </div>
        </div>
        <a href={reelUrl} target="_blank" rel="noopener noreferrer"
          className="text-[10px] text-pink-600 hover:text-pink-700 font-semibold transition">
          Watch Reel ↗
        </a>
      </div>
    </div>
  );
}

// ─── Single Review Card ───────────────────────────────────────────────────────
function ReviewCard({ review }) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted, setVoted] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <img src={review.avatar} alt={review.name} loading="lazy" className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-100" />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-gray-900">{review.name}</p>
              {review.verified && (
                <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full font-semibold">✓ Verified</span>
              )}
            </div>
            <p className="text-xs text-gray-400">{review.location} · {review.date}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <Stars rating={review.rating} />
          <p className="text-[10px] text-amber-700 font-medium mt-1">{review.product}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">{review.text}</p>
      {review.images.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {review.images.map((img, i) => (
            <div key={i} className="w-20 h-20 rounded-xl overflow-hidden cursor-pointer border border-gray-100 hover:border-amber-300 transition"
              onClick={() => setLightbox(img)}>
              <img src={img} alt="review" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between border-t border-gray-50 pt-3">
        <p className="text-xs text-gray-400">Was this helpful?</p>
        <button onClick={() => { if (!voted) { setHelpful(h => h + 1); setVoted(true); } }}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition ${voted ? "bg-amber-50 border-amber-300 text-amber-800" : "border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-700"}`}>
          👍 {helpful}
        </button>
      </div>
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center px-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="full" className="max-w-lg w-full rounded-2xl shadow-2xl" />
          <button className="absolute top-4 right-4 text-white text-3xl leading-none">&times;</button>
        </div>
      )}
    </div>
  );
}

// ─── Subscribe Form ───────────────────────────────────────────────────────────
function SubscribeForm() {
  const [email,     setEmail]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [done,      setDone]      = useState(false);
  const [error,     setError]     = useState("");

  async function handleSubscribe() {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 900)); // simulate API
    setLoading(false);
    setDone(true);
  }

  if (done) return (
    <div className="flex flex-col items-center gap-3 relative z-10">
      <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
        style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
        ✅
      </div>
      <p className="text-sm font-semibold" style={{ color: "#86efac" }}>You're in! Welcome to the club 🎉</p>
      <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Exclusive updates coming your way.</p>
    </div>
  );

  return (
    <div className="relative z-10 max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && handleSubscribe()}
          className="flex-1 rounded-2xl px-5 py-3.5 text-sm outline-none transition-all"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: error ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
            color: "rgba(242,232,217,0.9)",
          }}
          onFocus={e => e.target.style.borderColor = "rgba(212,168,67,0.5)"}
          onBlur={e => e.target.style.borderColor = error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}
        />
        <button
          onClick={handleSubscribe}
          disabled={loading || !email.trim()}
          className="px-6 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all disabled:opacity-40 whitespace-nowrap"
          style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}
        >
          {loading ? (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : "Subscribe →"}
        </button>
      </div>
      {error && (
        <p className="text-xs mt-2 text-left" style={{ color: "#fca5a5" }}>{error}</p>
      )}
      <p className="text-[10px] mt-3" style={{ color: "rgba(255,255,255,0.2)" }}>
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}

// ─── Write Review Modal ───────────────────────────────────────────────────────
function WriteReviewModal({ onClose }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-10 max-w-sm w-full text-center shadow-2xl">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-sm text-gray-500 mb-6">Your review has been submitted and will appear after verification.</p>
        <button onClick={onClose} className="bg-amber-900 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-amber-800 transition">Done</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-amber-900 px-6 py-5 flex items-center justify-between">
          <h3 className="text-white font-bold text-base">Write a Review</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Your Rating</p>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(s => (
                <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)}>
                  <svg className={`w-8 h-8 transition ${s <= (hover || rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500 self-center">{["","Poor","Fair","Good","Great","Excellent"][hover || rating] || "Tap to rate"}</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Name</p>
            <input type="text" placeholder="Your name" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400 transition" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Product</p>
            <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400 transition bg-white">
              <option value="">Select a product</option>
              {["Classic English Cake","Velvet Cheesecake","Chocolate Truffle Cake","Mango Mousse Cake","Butterscotch Cake","Croissant","Pain au Chocolat","Classic Fudge Brownie","Hot Chocolate"].map(p => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Your Review</p>
            <textarea rows={3} placeholder="Tell us about your experience..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400 transition resize-none" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Add Photos / Video</p>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-4 cursor-pointer hover:border-amber-400 transition text-sm text-gray-400 hover:text-amber-700">
              <span className="text-xl">📷</span> Click to upload
              <input type="file" accept="image/*,video/*" multiple className="hidden" />
            </label>
          </div>
          <button onClick={() => setSubmitted(true)} disabled={!rating}
            className="w-full bg-amber-900 hover:bg-amber-800 text-white py-3 rounded-xl text-sm font-bold transition disabled:opacity-40 disabled:cursor-not-allowed">
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Reviews Section ─────────────────────────────────────────────────────
export default function Reviews() {
  const [filter, setFilter] = useState("All");
  const [showWrite, setShowWrite] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  const filterOptions = ["All", "5 ★", "4 ★", "With Photos"];

  const filtered = REVIEWS.filter((r) => {
    if (filter === "5 ★") return r.rating === 5;
    if (filter === "4 ★") return r.rating === 4;
    if (filter === "With Photos") return r.images.length > 0;
    return true;
  });

  return (
    <section id="reviews" className="py-12 md:py-24 px-4 sm:px-6" style={{ background: "#0a0804" }}>
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.4em] font-semibold mb-3" style={{ color: "rgba(212,168,67,0.6)" }}>What People Say</p>
          <h2 className="text-3xl md:text-5xl mb-4 font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Real <em className="font-bold italic" style={{ background: "linear-gradient(135deg,#C9973A,#F0CC6E)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Reviews</em>
          </h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.3)" }}>From our customers — unfiltered, unedited, and straight from the heart.</p>
        </div>

        {/* Rating Summary */}
        <div className="rounded-2xl p-4 md:p-8 mb-10 flex flex-col md:flex-row items-center gap-5 md:gap-8"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-center shrink-0">
            <p className="text-5xl md:text-7xl font-bold" style={{ background: "linear-gradient(135deg,#D4A843,#F5D78E)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{AVG_RATING}</p>
            <Stars rating={5} size="lg" />
            <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>{TOTAL_REVIEWS.toLocaleString()} reviews</p>
          </div>
          <div className="flex-1 w-full space-y-2">
            {[5,4,3,2,1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs w-4 text-right" style={{ color: "rgba(255,255,255,0.4)" }}>{star}</span>
                <svg className="w-3 h-3 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <div className="flex-1 rounded-full h-1.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full" style={{ width: `${RATING_SUMMARY[star]}%`, background: "linear-gradient(to right, #C9973A, #F0CC6E)" }} />
                </div>
                <span className="text-xs text-gray-400 w-8">{RATING_SUMMARY[star]}%</span>
              </div>
            ))}
          </div>
          <div className="shrink-0 text-center">
            <p className="text-sm text-gray-500 mb-3">Tried our products?</p>
            <button onClick={() => setShowWrite(true)}
              className="bg-amber-900 hover:bg-amber-800 text-white px-6 py-3 rounded-xl text-sm font-bold transition">
              ✍️ Write a Review
            </button>
          </div>
        </div>

        {/* Instagram Reels Strip */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Customer Reels</h3>
              <p className="text-xs text-gray-400 mt-0.5">Real unboxings · Honest reactions · Straight from Instagram</p>
            </div>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-pink-200 text-pink-600 hover:bg-pink-50 transition">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow us
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {REELS.map((r) => (
              <InstaCard key={r.shortcode} {...r} />
            ))}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {filterOptions.map((f) => (
            <button key={f} onClick={() => { setFilter(f); setVisibleCount(4); }}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${filter === f ? "bg-amber-900 text-white border-amber-900" : "bg-white text-gray-600 border-gray-200 hover:border-amber-400"}`}>
              {f}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400 self-center">{filtered.length} reviews</span>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {filtered.slice(0, visibleCount).map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm">No reviews match this filter.</p>
          </div>
        )}

        {visibleCount < filtered.length && (
          <div className="text-center">
            <button onClick={() => setVisibleCount(v => v + 4)}
              className="border border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-800 px-8 py-3 rounded-xl text-sm font-semibold transition">
              Load More Reviews ({filtered.length - visibleCount} remaining)
            </button>
          </div>
        )}

        {/* ── Subscribe Section ── */}
        <div className="mt-20 relative overflow-hidden rounded-3xl px-8 py-14 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(212,168,67,0.08) 0%, rgba(139,105,20,0.12) 50%, rgba(212,168,67,0.06) 100%)",
            border: "1px solid rgba(212,168,67,0.18)",
          }}>

          {/* ambient glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212,168,67,0.07) 0%, transparent 70%)" }} />

          {/* floating cake emoji */}
          <div className="text-5xl mb-5 relative z-10">🎂</div>

          <p className="text-[10px] uppercase tracking-[0.4em] mb-3 relative z-10"
            style={{ color: "rgba(212,168,67,0.6)" }}>
            Stay in the Loop
          </p>

          <h3 className="text-3xl md:text-4xl font-light text-white mb-3 relative z-10"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Join the{" "}
            <em className="font-bold italic" style={{
              background: "linear-gradient(135deg,#D4A843,#F5D78E)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>Bakery Club</em>
          </h3>

          <p className="text-sm max-w-sm mx-auto mb-8 relative z-10"
            style={{ color: "rgba(255,255,255,0.35)" }}>
            Get exclusive cake launches, festive offers & early access to seasonal specials.
          </p>

          <SubscribeForm />
        </div>
      </div>

      {showWrite && <WriteReviewModal onClose={() => setShowWrite(false)} />}
    </section>
  );
}
