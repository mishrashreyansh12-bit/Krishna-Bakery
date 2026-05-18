import { useState } from "react";

const suggestions = [
  {
    mood: "summer",
    result:
      "🍋 Lemon Lavender Chiffon — Light sponge infused with fresh lemon zest and dried lavender, finished with a honey glaze. Perfect for warm afternoons.",
  },
  {
    mood: "winter",
    result:
      "🍫 Dark Chocolate Spice Cake — Rich cocoa layers with cinnamon, cardamom, and a hint of chili. Dusted with cocoa powder for a cozy finish.",
  },
  {
    mood: "cozy",
    result:
      "🍎 Brown Butter Apple Cake — Caramelized apple slices folded into a nutty brown butter batter. Topped with a crunchy oat crumble.",
  },
  {
    mood: "romantic",
    result:
      "🌹 Rose & Raspberry Cheesecake — Velvety cream cheese base with a rose-infused raspberry coulis. Garnished with edible rose petals.",
  },
  {
    mood: "tropical",
    result:
      "🥭 Mango Coconut Macaron Tower — Crisp shells filled with mango curd and coconut buttercream. A burst of the tropics in every bite.",
  },
];

function AICustomizer() {
  const [mood, setMood] = useState("");
  const [result, setResult] = useState("Wait for your custom bake profile...");
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!mood.trim()) return;

    setLoading(true);
    setResult("Crafting your perfect bake...");

    setTimeout(() => {
      const lower = mood.toLowerCase();
      const match = suggestions.find((s) => lower.includes(s.mood));
      setResult(
        match
          ? match.result
          : `✨ Custom Artisan Bake for "${mood}" — A unique blend of seasonal ingredients curated to match your vibe. Visit us to taste the creation!`
      );
      setLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleGenerate();
  };

  return (
    <section id="ai-customizer" className="py-24 bg-stone-900 text-white">
      <div className="max-w-5xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-5xl mb-6">
            Create Your <br />
            <span className="text-amber-400">Dream Dessert</span>
          </h2>
          <p className="text-stone-400 mb-8 italic">
            "Our AI assistant analyzes your taste preferences to suggest the
            perfect flavor profile, texture, and packaging."
          </p>
          <div className="space-y-4">
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your mood (e.g., Summer Sunset, Cozy Winter)..."
              className="w-full bg-stone-800 border border-stone-700 p-4 rounded-lg focus:outline-none focus:border-amber-400 transition text-white placeholder-stone-500"
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-amber-500 text-black font-bold py-4 rounded-lg hover:bg-amber-400 transition uppercase tracking-widest text-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate Custom Concept"}
            </button>
          </div>
        </div>

        <div className="border border-stone-800 p-8 rounded-2xl bg-stone-800/50">
          <p className="text-xs text-amber-500 uppercase mb-2">AI Suggestion</p>
          <p className="text-stone-300 leading-relaxed">{result}</p>
        </div>
      </div>
    </section>
  );
}

export default AICustomizer;
