import React, { useState } from "react";
import "./index.css";

function App() {
  const [result, setResult] = useState("Prediction will appear here");

  const handleSubmit = (e) => {
    e.preventDefault();
    const hp = e.target.hp.value;
    const type = e.target.types.value;
    const retreat = e.target.retreat.value;

    setResult(`Predicted Rarity: ${type} | HP: ${hp} | Retreat: ${retreat}`);
  };

  return (
    <div className="min-h-screen font-[Poppins] text-[#333] leading-relaxed bg-grid">
      <div className="max-w-[900px] mx-auto p-8">
        <header className="text-center mb-12">
          <h1 className="text-[2.5rem] mb-2 text-[#e3350d] font-bold drop-shadow-md">
            Pokémon TCG Rarity Predictor
          </h1>
          <p className="text-[1.1rem] text-gray-600">
            Enter your card details to predict its rarity!
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-8 bg-white rounded-xl p-8 shadow-[0_8px_16px_rgba(0,0,0,0.1)]">
          <form id="cardForm" onSubmit={handleSubmit} className="flex-1">
            <div className="mb-6">
              <label htmlFor="hp" className="block font-semibold mb-2">
                HP:
              </label>
              <input
                id="hp"
                type="number"
                min="10"
                max="340"
                placeholder="Card HP (10-340)"
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
              <label htmlFor="retreat" className="block font-semibold mb-2">
                Retreat Cost:
              </label>
              <input
                id="retreat"
                type="number"
                min="0"
                max="5"
                placeholder="Retreat Cost (0-5)"
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
              className="reveal bg-gradient-to-br from-[#ffcc33] to-[#f7e279] rounded-lg p-8 min-h-[200px] w-full flex justify-center items-center text-center font-bold text-xl text-[#333] shadow-md border-[8px] border-white outline outline-2 outline-gray-300"
            >
              {result}
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Pokémon TCG Project | Built with ❤️ by CPP and SJSU Students</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
