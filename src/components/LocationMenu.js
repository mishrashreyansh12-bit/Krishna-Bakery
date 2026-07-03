import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOCATIONS, LOCATION_PRODUCT_MAP, COUNTRY_LANGUAGE, useLocation } from "../context/LocationContext";

const LANG_META = {
  en: { label: "English",  native: "English",  flag: "🌐" },
  hi: { label: "Hindi",    native: "हिंदी",     flag: "🇮🇳" },
  ru: { label: "Russian",  native: "Русский",   flag: "🇷🇺" },
  de: { label: "German",   native: "Deutsch",   flag: "🇩🇪" },
  ar: { label: "Arabic",   native: "العربية",   flag: "🇦🇪" },
};

export default function LocationMenu({ onCategoryClick }) {
  const { location, setLocation, lang, setLang } = useLocation();
  const [open,       setOpen]       = useState(false);
  const [step,       setStep]       = useState(0);
  const [selCountry, setSelCountry] = useState(null);
  const [selState,   setSelState]   = useState(null);
  const [selCity,    setSelCity]    = useState(null);
  const [selLang,    setSelLang]    = useState("en");
  const ref = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setStep(0); } };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  function openMenu() { setOpen(true); setStep(0); setSelCountry(null); setSelState(null); setSelCity(null); setSelLang("en"); }

  function pickCountry(loc) {
    setSelCountry(loc); setSelLang("en");
    const lInfo = COUNTRY_LANGUAGE[loc.country];
    setStep(lInfo && lInfo.primary !== "en" ? 1 : 2);
  }
  function confirmLang() { setStep(2); }
  function pickCity(st, city) { setSelState(st); setSelCity(city); setStep(3); }
  function pickArea(area) {
    setLocation({ country: selCountry.country, flag: selCountry.flag, state: selState.state, city: selCity.city, area, type: selCity.type });
    setLang(selLang);
    setOpen(false); setStep(0);
  }
  function goBack() {
    if (step === 2) { const lInfo = COUNTRY_LANGUAGE[selCountry?.country]; setStep(lInfo && lInfo.primary !== "en" ? 1 : 0); }
    else setStep(s => Math.max(0, s - 1));
  }

  const typeInfo  = LOCATION_PRODUCT_MAP[location.type];
  const lInfo     = COUNTRY_LANGUAGE[selCountry?.country];
  const hasLang   = lInfo && lInfo.primary !== "en";
  const langsList = hasLang ? ["en", lInfo.primary] : ["en"];

  const TITLE = { 0: "Select Country", 1: "Choose Language", 2: "Select City", 3: "Select Area" }[step] || "";

  const slide = { enter: { x: 40, opacity: 0 }, center: { x: 0, opacity: 1 }, exit: { x: -40, opacity: 0 } };

  return (
    <div ref={ref} className="relative">

      {/* Trigger */}
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={openMenu}
        className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{ background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.15)" }}>
        <span className="text-base">{location.flag}</span>
        <div className="hidden sm:block text-left">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--gold)" }}>{location.city}</p>
          <p className="text-[9px]" style={{ color: "rgba(242,232,217,0.4)" }}>{typeInfo?.badge} · {LANG_META[lang]?.flag} {LANG_META[lang]?.label}</p>
        </div>
        <svg className="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 z-[200] rounded-2xl overflow-hidden"
            style={{
              width: "320px",
              right: 0,
              background: "rgba(18,13,8,0.98)",
              border: "1px solid rgba(212,168,67,0.18)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: "1px solid rgba(212,168,67,0.08)" }}>
              {step > 0 && (
                <button onClick={goBack}
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition"
                  style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.2)" }}>
                  <svg className="w-3.5 h-3.5" style={{ color: "#D4A843" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
              )}
              <div className="flex-1">
                <p className="text-[11px] font-semibold" style={{ color: "rgba(212,168,67,0.8)" }}>
                  {selCountry && step > 0 ? `${selCountry.flag} ${selCountry.country}` : "📍 Location"}
                </p>
                <p className="text-[9px]" style={{ color: "rgba(242,232,217,0.35)" }}>{TITLE}</p>
              </div>
              <button onClick={() => { setOpen(false); setStep(0); }}
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm transition"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,232,217,0.4)" }}>✕</button>
            </div>

            {/* Content */}
            <div style={{ maxHeight: "360px", overflowY: "auto" }}>
              <AnimatePresence mode="wait">

                {/* Step 0 — Country */}
                {step === 0 && (
                  <motion.div key="country" variants={slide} initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.2 }} className="p-2">
                    {LOCATIONS.map(loc => {
                      const li = COUNTRY_LANGUAGE[loc.country];
                      const langLabel = li && li.primary !== "en" ? li.label : "English";
                      const cityCount = loc.states.reduce((a, s) => a + s.cities.length, 0);
                      return (
                        <button key={loc.country} onClick={() => pickCountry(loc)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left hover:bg-amber-900/20">
                          <span className="text-xl shrink-0">{loc.flag}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: "rgba(242,232,217,0.9)" }}>{loc.country}</p>
                            <p className="text-[10px] truncate" style={{ color: "rgba(242,232,217,0.4)" }}>{cityCount} cities · {langLabel}</p>
                          </div>
                          <svg className="w-4 h-4 shrink-0 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                          </svg>
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {/* Step 1 — Language */}
                {step === 1 && (
                  <motion.div key="language" variants={slide} initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.2 }} className="p-4 space-y-3">
                    <p className="text-xs text-center pb-2" style={{ color: "rgba(242,232,217,0.4)" }}>
                      Choose your preferred language
                    </p>
                    {langsList.map(l => {
                      const meta = LANG_META[l];
                      const isSel = selLang === l;
                      return (
                        <button key={l} onClick={() => setSelLang(l)}
                          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all"
                          style={{
                            background: isSel ? "rgba(212,168,67,0.12)" : "rgba(255,255,255,0.04)",
                            border: `1.5px solid ${isSel ? "rgba(212,168,67,0.5)" : "rgba(255,255,255,0.07)"}`,
                          }}>
                          <span className="text-2xl">{meta?.flag}</span>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-bold" style={{ color: isSel ? "#D4A843" : "rgba(242,232,217,0.85)" }}>{meta?.label}</p>
                            <p className="text-[11px]" style={{ color: "rgba(242,232,217,0.4)" }}>{meta?.native}</p>
                          </div>
                          {isSel && (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                              style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)" }}>
                              <svg className="w-3 h-3" fill="none" stroke="#0a0800" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                    <button onClick={confirmLang}
                      className="w-full py-3 rounded-xl text-sm font-bold mt-2"
                      style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}>
                      Continue →
                    </button>
                  </motion.div>
                )}

                {/* Step 2 — City */}
                {step === 2 && (
                  <motion.div key="city" variants={slide} initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.2 }} className="p-2">
                    {selCountry?.states.map(st => (
                      <div key={st.state}>
                        <p className="text-[9px] uppercase tracking-widest px-3 py-2 mt-1 font-semibold"
                          style={{ color: "rgba(212,168,67,0.5)" }}>{st.state}</p>
                        {st.cities.map(city => {
                          const info = LOCATION_PRODUCT_MAP[city.type];
                          return (
                            <button key={city.city} onClick={() => pickCity(st, city)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left hover:bg-amber-900/20">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate" style={{ color: "rgba(242,232,217,0.85)" }}>{city.city}</p>
                                <p className="text-[10px]" style={{ color: "rgba(242,232,217,0.4)" }}>{info?.deliveryTime} · {info?.canDeliver.length} items</p>
                              </div>
                              <span className="text-[9px] px-2 py-1 rounded-full font-semibold shrink-0"
                                style={{
                                  background: city.type === "nearby" ? "rgba(34,197,94,0.12)" : city.type === "semi" ? "rgba(234,179,8,0.12)" : city.type === "far" ? "rgba(249,115,22,0.12)" : "rgba(99,102,241,0.12)",
                                  color: city.type === "nearby" ? "#4ade80" : city.type === "semi" ? "#fbbf24" : city.type === "far" ? "#fb923c" : "#818cf8",
                                }}>{info?.badge}</span>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Step 3 — Area */}
                {step === 3 && (
                  <motion.div key="area" variants={slide} initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.2 }} className="p-3">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {selCity?.areas.map(area => (
                        <button key={area} onClick={() => pickArea(area)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(212,168,67,0.35)"}
                          onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
                          <span className="text-[10px]">📍</span>
                          <span className="text-[11px] font-medium truncate" style={{ color: "rgba(242,232,217,0.85)" }}>{area}</span>
                        </button>
                      ))}
                    </div>
                    {/* delivery info */}
                    <div className="rounded-xl p-3" style={{ background: "rgba(212,168,67,0.06)", border: "1px solid rgba(212,168,67,0.15)" }}>
                      <p className="text-[10px] font-bold mb-1" style={{ color: "#D4A843" }}>
                        {LOCATION_PRODUCT_MAP[selCity?.type]?.label} · {LOCATION_PRODUCT_MAP[selCity?.type]?.deliveryTime}
                      </p>
                      <p className="text-[9px]" style={{ color: "rgba(242,232,217,0.4)" }}>{LOCATION_PRODUCT_MAP[selCity?.type]?.note}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {LOCATION_PRODUCT_MAP[selCity?.type]?.canDeliver.map(cat => (
                          <button key={cat}
                            onClick={() => { pickArea(selCity.areas[0]); onCategoryClick?.(cat); }}
                            className="text-[9px] px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}>
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
