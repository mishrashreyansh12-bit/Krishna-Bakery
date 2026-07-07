import { useState, useEffect, useRef } from "react";
import { useLocation, TRANSLATIONS } from "../context/LocationContext";

function OrderModal({ onClose, onProceed }) {
  const { lang } = useLocation();
  const t = TRANSLATIONS[lang] || TRANSLATIONS["en"];
  const [name,  setName]  = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [type,  setType]  = useState("delivery");
  const [query, setQuery] = useState("");
  const [address, setAddress] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [loadingSug,  setLoadingSug]  = useState(false);
  const [showSug,     setShowSug]     = useState(false);
  const [gpsLoading,  setGpsLoading]  = useState(false);

  const debounceRef = useRef(null);
  const dropRef     = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    const fn = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setShowSug(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // search suggestions
  useEffect(() => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      setShowSug(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoadingSug(true);
      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`,
          { headers: { "Accept-Language": "en" } }
        );
        const d = await r.json();
        setSuggestions(d);
        setShowSug(d.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSug(false);
      }
    }, 450);
  }, [query]);

  function pickSuggestion(place) {
    setAddress(place.display_name);
    setQuery(place.display_name);
    setSuggestions([]);
    setShowSug(false);
  }

  function handleGPS() {
    if (!navigator.geolocation) { alert("GPS not supported"); return; }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { "Accept-Language": "en" } }
          );
          const d = await r.json();
          const loc = d.display_name || "Current Location";
          setAddress(loc);
          setQuery(loc);
        } catch {
          setAddress("Current Location");
          setQuery("Current Location");
        } finally {
          setGpsLoading(false);
        }
      },
      () => {
        setGpsLoading(false);
        alert("Location access denied.");
      }
    );
  }

  function handleProceed() {
    // use address state OR query text as fallback
    const finalAddress = address.trim() || query.trim();
    const needsAddress = type === "delivery";

    if (!finalAddress && needsAddress) {
      alert("Please enter or select a delivery address.");
      return;
    }

    onProceed({
      orderType:    type,
      address:      needsAddress ? finalAddress : "Store Pickup",
      customerName: name.trim(),
      contact:      `+91 ${phone.trim()}`,
      email:        email.trim(),
    });
  }

  // phone is valid if it's 10 digits
  const phoneClean = phone.replace(/\D/g, "");
  const phoneOk    = phoneClean.length === 10;
  const emailOk    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const nameOk     = name.trim().length >= 2;
  const addrOk     = type === "pickup" || address.trim().length > 0 || query.trim().length > 0;

  const canGo = nameOk && phoneOk && emailOk && addrOk;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden mx-2">

        {/* header */}
        <div className="bg-amber-900 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-base">{t.modalTitle}</h2>
            <p className="text-amber-300 text-xs mt-0.5">{t.modalSubtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-amber-200 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-amber-800 transition leading-none"
          >
            &times;
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[78vh]">

          {/* Name + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">
                {t.modalFullName} *
              </label>
              <input
                type="text"
                placeholder="Shivam Mishra"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 focus:border-amber-600 rounded-xl px-3 py-2.5 text-sm outline-none transition text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">
                {t.modalMobile} *
              </label>
              <div className="flex gap-1">
                <span className="bg-gray-50 border border-gray-200 rounded-xl px-2 py-2.5 text-xs text-gray-500 font-semibold shrink-0">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  maxLength={10}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 border border-gray-200 focus:border-amber-600 rounded-xl px-3 py-2.5 text-sm outline-none transition text-gray-900 bg-white"
                />
              </div>
              {phone.length > 0 && !phoneOk && (
                <p className="text-[10px] text-red-500 mt-0.5">{t.modalEnter10Digit}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">
              {t.modalEmail} *
            </label>
            <input
              type="email"
              placeholder="shivam@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 focus:border-amber-600 rounded-xl px-3 py-2.5 text-sm outline-none transition text-gray-900 bg-white"
            />
          </div>

          {/* Order Type */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">
              {t.modalOrderType} *
            </label>
            <div className="flex gap-2">
              {["delivery", "pickup"].map((tp) => (
                <button
                  key={tp}
                  onClick={() => setType(tp)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition ${
                    type === tp
                      ? "bg-amber-900 text-white border-amber-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-amber-500"
                  }`}
                >
                  {tp === "delivery" ? t.modalDelivery : t.modalPickup}
                </button>
              ))}
            </div>
          </div>

          {/* Address — only for delivery */}
          {type === "delivery" && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">
                {t.modalDeliveryAddr} *
              </label>
              <button
                onClick={handleGPS}
                disabled={gpsLoading}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border-2 transition mb-2 ${
                  address
                    ? "border-amber-600 bg-amber-50 text-amber-900"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-amber-400"
                }`}
              >
                {gpsLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-amber-700" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {t.modalDetecting}
                  </>
                ) : (
                  <><span>📍</span> {t.modalUseLocation}</>
                )}
              </button>
              <div className="flex items-center gap-2 my-2">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">{t.modalOrSearch}</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="relative" ref={dropRef}>
                <input
                  type="text"
                  placeholder={t.modalSearchPlaceholder}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (e.target.value !== address) setAddress("");
                  }}
                  onFocus={() => suggestions.length > 0 && setShowSug(true)}
                  className="w-full border border-gray-200 focus:border-amber-600 rounded-xl px-3 py-2.5 pr-8 text-sm outline-none transition text-gray-900 bg-white"
                />
                {loadingSug && (
                  <svg className="animate-spin w-4 h-4 text-amber-500 absolute right-3 top-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                )}
                {query && !loadingSug && (
                  <button
                    onMouseDown={() => { setQuery(""); setAddress(""); setSuggestions([]); }}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-lg leading-none"
                  >
                    ×
                  </button>
                )}

                {/* dropdown */}
                {showSug && suggestions.length > 0 && (
                  <ul className="absolute z-30 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-2xl overflow-hidden max-h-44 overflow-y-auto">
                    {suggestions.map((place) => {
                      const parts = place.display_name.split(", ");
                      return (
                        <li
                          key={place.place_id}
                          onMouseDown={() => pickSuggestion(place)}
                          className="flex items-start gap-2 px-4 py-2.5 hover:bg-amber-50 cursor-pointer border-b border-gray-50 last:border-0 transition"
                        >
                          <span className="text-amber-600 text-xs shrink-0 mt-0.5">📍</span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">{parts.slice(0, 2).join(", ")}</p>
                            <p className="text-[10px] text-gray-400 truncate">{parts.slice(2, 5).join(", ")}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* confirmed address */}
              {address && (
                <div className="mt-2 flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                  <span className="text-green-600 text-xs shrink-0 mt-0.5">✅</span>
                  <p className="text-[11px] text-green-800 leading-relaxed line-clamp-2 flex-1">{address}</p>
                  <button
                    onMouseDown={() => { setAddress(""); setQuery(""); }}
                    className="text-gray-400 hover:text-red-400 text-sm leading-none shrink-0"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          )}

          {type === "pickup" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 flex items-center gap-2">
              <span>🏪</span>
              <span>{t.modalPickupNote}</span>
            </div>
          )}

          {/* See Menu button — always clickable, validates on click */}
          <button
            onClick={handleProceed}
            disabled={!canGo}
            className={`w-full py-3 rounded-xl text-sm font-bold transition mt-1 ${
              canGo
                ? "bg-amber-900 hover:bg-amber-800 text-white cursor-pointer"
                : "bg-amber-200 text-amber-400 cursor-not-allowed"
            }`}
          >
            {t.modalSeeMenu}
          </button>

          <p className="text-[10px] text-gray-400 text-center pb-1">
            {t.modalPoweredBy}
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderModal;
