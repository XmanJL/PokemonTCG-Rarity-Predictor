import React, { useState } from "react";
import bg from "/src/assets/Pokemon-bg.jpg";
import Credit from "./Credit.jsx";
import "../index.css";
import "./App.css";

export default function App() {
  // state managements
  const [result, setResult] = useState("Prediction will appear here");
  const [rarity, setRarity] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  // label mapping
  const RARITY_MAP = ["Common", "Rare Base", "Special Rare", "Premium Rare"];

  // Renders different UI based on rarity 0..3 or default
  const renderRarity = (r) => {
    const base =
      "reveal rounded-lg p-8 min-h-[200px] w-full flex justify-center items-center text-center font-bold text-xl shadow-md border-[8px] border-white outline outline-2 outline-gray-300";

    if (r === null) {
      // default container with original orange gradient
      return (
        <div
          className={`${base} bg-gradient-to-br from-[#ffcc33] to-[#f7e279] text-[#333]`}
        >
          {result}
        </div>
      );
    }

    switch (r) {
      case 0: // common
        return (
          <div className={`${base} bg-white/90 text-gray-800 border-gray-200`}>
            ⭐ Common
          </div>
        );
      case 1: // rare base
        return (
          <div className={`${base} bg-blue-50 text-blue-800 border-blue-200`}>
            💠 Rare Base
          </div>
        );
      case 2: // special rare
        return (
          <div
            className={`${base} bg-purple-50 text-purple-800 border-purple-200`}
          >
            ✨ Special Rare
          </div>
        );
      case 3: // premium rare
        return (
          <div
            className={`${base} bg-gradient-to-br from-yellow-200 to-amber-300 text-amber-900 border-yellow-100`}
          >
            🏆 Premium Rare
          </div>
        );
      default:
        return (
          <div
            className={`${base} bg-gradient-to-br from-[#ffcc33] to-[#f7e279] text-[#333]`}
          >
            {result}
          </div>
        );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hp = Number(e.target.hp.value);
    const retreat_cost = Number(e.target.retreat.value);
    const max_damage = Number(e.target.max_damage.value);
    const num_attacks = Number(e.target.num_attacks.value);
    const type = e.target.types.value;
    const series = e.target.series.value;

    // Talking to backend
    const prediction = await predictRarity({
      hp,
      retreat_cost,
      max_damage,
      num_attacks,
      type,
      series,
    });

    // update both: UI selector + human-readable text + animation
    setRarity(prediction);
    setResult(`Predicted Rarity: ${RARITY_MAP[prediction] ?? prediction}`);
    setAnimKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen font-[Poppins] text-[#333] leading-relaxed relative overflow-hidden">
      {/* Background Image (behind everything) */}
      <img
        src={bg}
        alt="Pokemon Stadium"
        className="absolute inset-0 w-full h-full object-cover -z-20"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 -z-10" />

      {/* Page content */}
      <div className="relative max-w-[900px] mx-auto p-8">
        <header className="text-center mb-6">
          <h1 className="text-[3rem] text-[#e3350d] font-bold drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
            Pokémon TCG Rarity Predictor
          </h1>

          <p className="text-[1.3rem] text-gray-100 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
            Enter the card details for your custom pokemon to predict its
            rarity!
          </p>
          <p className="text-[1.3rem] text-gray-100 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
            Pokémon TCG Project | Built with ❤️ by CPP and SJSU Students
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-8 bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-[0_8px_16px_rgba(0,0,0,0.1)]">
          <form id="cardForm" onSubmit={handleSubmit} className="flex-1">
            <div className="mb-6">
              <label htmlFor="hp" className="block font-semibold mb-2">
                HP:
              </label>
              <input
                id="hp"
                type="number"
                min="10"
                max="200"
                placeholder="Card HP (10-200)"
                required
                className="w-full p-2.5 border-2 border-gray-300 rounded-md text-base focus:border-[#0075be] outline-none transition"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="types" className="block font-semibold mb-2">
                Type:
              </label>
              <select
                id="types"
                required
                className="w-full p-2.5 border-2 border-gray-300 rounded-md text-base focus:border-[#0075be] outline-none transition"
              >
                <option value="">Select Type</option>
                <option value="Colorless">Colorless</option>
                <option value="Darkness">Darkness</option>
                <option value="Dragon">Dragon</option>
                <option value="Fairy">Fairy</option>
                <option value="Fighting">Fighting</option>
                <option value="Fire">Fire</option>
                <option value="Grass">Grass</option>
                <option value="Lightning">Lightning</option>
                <option value="Metal">Metal</option>
                <option value="Psychic">Psychic</option>
                <option value="Water">Water</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="series" className="block font-semibold mb-2">
                Series:
              </label>
              <select
                id="series"
                required
                className="w-full p-2.5 border-2 border-gray-300 rounded-md text-base focus:border-[#0075be] outline-none transition"
              >
                <option value="">Select Series</option>
                <option value="Base">Base</option>
                <option value="Black & White">Black & White</option>
                <option value="Diamond & Pearl">Diamond & Pearl</option>
                <option value="E-Card">E-Card</option>
                <option value="EX">EX</option>
                <option value="Gym">Gym</option>
                <option value="HeartGold & SoulSilver">
                  HeartGold & SoulSilver
                </option>
                <option value="NP">NP</option>
                <option value="Neo">Neo</option>
                <option value="Other">Other</option>
                <option value="POP">POP</option>
                <option value="Platinum">Platinum</option>
                <option value="Scarlet & Violet">Scarlet & Violet</option>
                <option value="Sun & Moon">Sun & Moon</option>
                <option value="Sword & Shield">Sword & Shield</option>
                <option value="XY">XY</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="retreat" className="block font-semibold mb-2">
                Retreat Cost:
              </label>
              <input
                id="retreat"
                type="number"
                min="0"
                max="4"
                placeholder="Retreat Cost (0-4)"
                required
                className="w-full p-2.5 border-2 border-gray-300 rounded-md text-base focus:border-[#0075be] outline-none transition"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="max_damage" className="block font-semibold mb-2">
                Max Damage:
              </label>
              <input
                id="max_damage"
                type="number"
                min="0"
                max="150"
                placeholder="Max Damage (0-150)"
                required
                className="w-full p-2.5 border-2 border-gray-300 rounded-md text-base focus:border-[#0075be] outline-none transition"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="num_attacks" className="block font-semibold mb-2">
                Number of Attacks:
              </label>
              <input
                id="num_attacks"
                type="number"
                min="1"
                max="4"
                placeholder="Number of Attacks (1-4)"
                required
                className="w-full p-2.5 border-2 border-gray-300 rounded-md text-base focus:border-[#0075be] outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0075be] text-white font-semibold text-base py-3 px-6 rounded-md shadow transition transform hover:bg-[#005fa0] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Predict Rarity
            </button>
          </form>

          <div className="flex-1 flex justify-center items-center">
            <div
              id="result"
              key={animKey} /* re-trigger CSS animation on change */
              className="reveal w-full"
            >
              {renderRarity(rarity)}
            </div>
          </div>
        </div>

        {/* <Credit /> */}
        <Credit />
      </div>
    </div>
  );
}

// DO NOT break your logic or comments — only returns the numeric rarity
async function predictRarity(cardData) {
  try {
    const res = await fetch(
      "https://pokemontcg-rarity-predictor.onrender.com/predict-rarity",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardData),
      }
    );

    if (!res.ok) throw new Error("Failed to fetch prediction");

    const data = await res.json();
    return data.rarity; // 0 | 1 | 2 | 3
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
}
