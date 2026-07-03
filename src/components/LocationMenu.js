import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOCATIONS, LOCATION_PRODUCT_MAP, COUNTRY_LANGUAGE, useLocation } from "../context/LocationContext";

const LANG_META = {
  en: { label: "English",  native: "English",   flag: "🌐" },
  hi: { label: "Hindi",    native: "हिंदी",      flag: "🇮🇳" },
  ru: { label: "Russian",  native: "Русский",    flag: "🇷🇺" },
  de: { label: "German",   native: "Deutsch",    flag: "🇩🇪" },
  ar: { label: "Arabic",   native: "العربية",    flag: "🇦🇪" },
};

// Steps:
//   0 = Country
//   1 = Language  (only if country has secondary lang, else skip to 2)
//   2 = City
//   3 = Area

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
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setStep(0); }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  function openMenu() {
    setOpen(true); setStep(0);
    setSelCountry(null); setSelState(null); setSelCity(null);
    setSelLang("en");
  }

  // Step 0 → pick country → go to lang (1) or city (2)
  function pickCountry(loc) {
    setSelCountry(loc);
    setSelLang("en");
    const lInfo = COUNTRY_LANGUAGE[loc.country];
    if (lInfo && lInfo.primary !== "en") {
      setStep(1); // show language picker
    } else {
      setStep(2); // skip to city
    }
  }

  // Step 1 → language chosen → go to city
  function confirmLang() { setStep(2); }

  // Step 2 → pick city → go to area
  function pickCity(st, city) { setSelState(st); setSelCity(city); setStep(3); }

  // Step 3 → pick area → confirm & close
  function pickArea(area) {
    setLocation({
      country: selCountry.country,
      flag:    selCountry.flag,
      state:   selState.state,
      city:    selCity.city,
      area,
      type:    selCity.type,
    });
    setLang(selLang);
    setOpen(false); setStep(0);
  }

  function goBack() {
    if (step === 2) {
      // going back from city
      const lInfo = COUNTRY_LANGUAGE[selCountry?.country];
      setStep(lInfo && lInfo.primary !== "en" ? 1 : 0);
    } else {
      setStep(s => Math.max(0, s - 1));
    }
  }

  const typeInfo   = LOCATION_PRODUCT_MAP[location.type];
  const lInfo      = COUNTRY_LANGUAGE[selCountry?.country];
  const hasLang    = lInfo && lInfo.primary !== "en";
  const langsList  = hasLang ? ["en", lInfo.primary] : ["en"];

  // Build visible step labels dynamically
  const STEPS = hasLang
    ? ["Country", "Language", "City", "Area"]
    : ["Country", "City", "Area"];

  // Map real step number → display index for the indicator
  const stepDisplayIndex = hasLang ? step : (step === 0 ? 0 : step - 1);

  const slideVariants = {
    enter:  { x: 60, opacity: 0 },
    center: { x: 0,  opacity: 1 },
    exit:   { x: -60, opacity: 0 },
  };

  const headerLabel = {
    0: "Select Country",
    1: `${selCountry?.flag} ${selCountry?.country} — Choose Language`,
    2: `${selCountry?.flag} ${selCountry?.country} — Select City`,
    3: `${selCity?.city} — Select Area`,
  }[step] || "";

  return (
    <div ref={ref} className="relative">

      {/* ── Trigger ── */}
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={openMenu}
        className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{ background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.15)" }}
      >
        <span className="text-base leading-none">{location.flag}</span>
        <div className="hidden sm:block text-left">
          <p className="text-[10px] font-bold uppercase tracking-widest leading-none" style={{ color: "var(--gold)" }}>
            {location.city}
          </p>
          <p className="text-[9px] mt-0.5" style={{ color: "rgba(242,232,217,0.4)" }}>
            {typeInfo?.badge} · {LANG_META[lang]?.flag} {LANG_META[lang]?.label}
          </p>
        </div>
        <svg className="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </motion.button>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full mt-2 z-[200] rounded-2xl overflow-hidden"
            style={{
              width: "300px",
              right: 0,
              background: "rgba(20,15,10,0.98)",
              border: "1px solid rgba(212,168,67,0.14)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5"
              style={{ borderBottom: "1px solid rgba(212,168,67,0.08)" }}>
              {step > 0 && (
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={goBack}
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.2)" }}>
                  <svg className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                  </svg>
                </motion.button>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.3em] truncate" style={{ color: "rgba(212,168,67,0.5)" }}>
                  {headerLabel}
                </p>
              </div>
              <button onClick={() => { setOpen(false); setStep(0); }}
                className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                style={{ color: "rgba(242,232,217,0.3)" }}>✕</button>
            </div>

            {/* Content */}
            <div className="overflow-hidden" style={{ minHeight: 200 }}>
              <AnimatePresence mode="wait">

                {/* Step 0 — Country */}
                {step === 0 && (
                  <motion.div key="country" variants={slideVariants} initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="p-3 space-y-1">
                    {LOCATIONS.map(loc => {
                      const li = COUNTRY_LANGUAGE[loc.country];
                      const langLabel = li && li.primary !== "en" ? li.label : "English only";
                      return (
                        <motion.button key={loc.country}
                          whileHover={{ x: 3, background: "rgba(212,168,67,0.08)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => pickCountry(loc)}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all">
                          <span className="text-2xl">{loc.flag}</span>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-semibold" style={{ color: "var(--ivory)" }}>{loc.country}</p>
                            <p className="text-[10px]" style={{ color: "rgba(242,232,217,0.35)" }}>
                              {loc.states.reduce((a, s) => a + s.cities.length, 0)} cities · 🗣 {langLabel}
                            </p>
                          </div>
                          <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                          </svg>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}

                {/* Step 1 — Language (only for countries with secondary lang) */}
                {step === 1 && (
                  <motion.div key="language" variants={slideVariants} initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="p-5">

                    <p className="text-xs text-center mb-5" style={{ color: "rgba(242,232,217,0.4)" }}>
                      Choose your preferred language for this session
                    </p>

                    <div className="space-y-3 mb-5">
                      {langsList.map((l) => {
                        const meta = LANG_META[l];
                        const isSelected = selLang === l;
                        return (
                          <motion.button
                            key={l}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setSelLang(l)}
                            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all"
                            style={{
                              background: isSelected ? "rgba(212,168,67,0.1)" : "rgba(255,255,255,0.04)",
                              border: isSelected
                                ? "1.5px solid rgba(212,168,67,0.5)"
                                : "1px solid rgba(255,255,255,0.07)",
                            }}
                          >
                            <span className="text-3xl">{meta?.flag}</span>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-bold" style={{ color: isSelected ? "var(--gold)" : "var(--ivory)" }}>
                                {meta?.label}
                              </p>
                              <p className="text-xs mt-0.5" style={{ color: "rgba(242,232,217,0.35)" }}>
                                {meta?.native}
                              </p>
                            </div>
                            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                              style={{
                                background: isSelected ? "linear-gradient(135deg,#D4A843,#8B6914)" : "rgba(255,255,255,0.08)",
                                border: isSelected ? "none" : "1px solid rgba(255,255,255,0.15)",
                              }}>
                              {isSelected && (
                                <svg className="w-3 h-3" fill="none" stroke="#0a0800" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                                </svg>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(212,168,67,0.2)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={confirmLang}
                      className="w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest"
                      style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}
                    >
                      Continue →
                    </motion.button>

                    <p className="text-center text-[10px] mt-3" style={{ color: "rgba(242,232,217,0.2)" }}>
                      You can change this anytime from the location menu
                    </p>
                  </motion.div>
                )}

                {/* Step 2 — City */}
                {step === 2 && (
                  <motion.div key="city" variants={slideVariants} initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="p-3 max-h-72 overflow-y-auto scrollbar-hide">
                    {selCountry?.states.map(st => (
                      <div key={st.state}>
                        <p className="text-[9px] uppercase tracking-widest px-3 py-1.5 mt-1"
                          style={{ color: "rgba(212,168,67,0.4)" }}>{st.state}</p>
                        {st.cities.map(city => {
                          const info = LOCATION_PRODUCT_MAP[city.type];
                          return (
                            <motion.button key={city.city}
                              whileHover={{ x: 3, background: "rgba(212,168,67,0.06)" }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => pickCity(st, city)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all">
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium" style={{ color: "var(--ivory)" }}>{city.city}</p>
                                <p className="text-[10px]" style={{ color: "rgba(242,232,217,0.35)" }}>
                                  {info?.deliveryTime} · {info?.canDeliver.length} categories
                                </p>
                              </div>
                              <span className="text-[9px] px-2 py-1 rounded-full font-semibold shrink-0"
                                style={{
                                  background: city.type === "nearby" ? "rgba(34,197,94,0.12)" :
                                              city.type === "semi"   ? "rgba(234,179,8,0.12)"  :
                                              city.type === "far"    ? "rgba(249,115,22,0.12)" : "rgba(99,102,241,0.12)",
                                  color: city.type === "nearby" ? "#4ade80" :
                                         city.type === "semi"   ? "#fbbf24" :
                                         city.type === "far"    ? "#fb923c" : "#818cf8",
                                }}>
                                {info?.badge}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Step 3 — Area */}
                {step === 3 && (
                  <motion.div key="area" variants={slideVariants} initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="p-3">

                    <div className="grid grid-cols-2 gap-1.5 mb-4">
                      {selCity?.areas.map(area => (
                        <motion.button key={area}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          onClick={() => pickArea(area)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}>
                          <span className="text-[10px]">📍</span>
                          <span className="text-[11px] font-medium" style={{ color: "var(--ivory)" }}>{area}</span>
                        </motion.button>
                      ))}
                    </div>

                    {/* delivery info */}
                    <div className="rounded-xl overflow-hidden"
                      style={{ border: "1px solid rgba(212,168,67,0.1)" }}>
                      <div className="px-3 py-2.5"
                        style={{ background: "rgba(212,168,67,0.06)", borderBottom: "1px solid rgba(212,168,67,0.08)" }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--gold)" }}>
                          {LOCATION_PRODUCT_MAP[selCity?.type]?.label} · {LOCATION_PRODUCT_MAP[selCity?.type]?.deliveryTime}
                        </p>
                        <p className="text-[9px] mt-0.5" style={{ color: "rgba(242,232,217,0.4)" }}>
                          {LOCATION_PRODUCT_MAP[selCity?.type]?.note}
                        </p>
                      </div>
                      <div className="px-3 py-2.5">
                        <p className="text-[9px] font-semibold mb-1.5" style={{ color: "#4ade80" }}>✅ We deliver:</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {LOCATION_PRODUCT_MAP[selCity?.type]?.canDeliver.map(cat => (
                            <motion.button key={cat}
                              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => { pickArea(selCity.areas[0]); onCategoryClick?.(cat); }}
                              className="text-[9px] px-2 py-1 rounded-full cursor-pointer transition-all"
                              style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}>
                              {cat} →
                            </motion.button>
                          ))}
                        </div>
                        {LOCATION_PRODUCT_MAP[selCity?.type]?.cannotDeliver.length > 0 && (
                          <>
                            <p className="text-[9px] font-semibold mb-1.5" style={{ color: "rgba(242,232,217,0.3)" }}>
                              🚫 Not available here:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {LOCATION_PRODUCT_MAP[selCity?.type]?.cannotDeliver.map(cat => (
                                <span key={cat} className="text-[9px] px-2 py-1 rounded-full"
                                  style={{ background: "rgba(255,255,255,0.04)", color: "rgba(242,232,217,0.25)", border: "1px solid rgba(255,255,255,0.06)", textDecoration: "line-through" }}>
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
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
