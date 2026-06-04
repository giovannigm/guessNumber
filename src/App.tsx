import { useState } from "react";
import { useCreacionDeRitmo } from "./components/CreacionDeRitmo";

type Estado =
  | "bienvenida"
  | "configuracion"
  | "pensandoNumero"
  | "jugar"
  | "final";

function App() {
  const { musicaActiva, setMusicaActiva, iniciarMusica, alternarMusica } =
    useCreacionDeRitmo();

  const [estado, setEstado] = useState<Estado>("bienvenida");
  const [maxNumber, setMaxNumber] = useState(100);
  const [maxNumberInput, setMaxNumberInput] = useState("100");
  const [secretNumber, setSecretNumber] = useState<number | null>(null);
  const [guessInput, setGuessInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [configError, setConfigError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [gameMessage, setGameMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [feedback, setFeedback] = useState("");

  const iniciar = async () => {
    if (!musicaActiva) {
      await iniciarMusica();
      setMusicaActiva(true);
    }
    setEstado("configuracion");
  };

  const comenzarJuego = () => {
    const parsedValue = Number(maxNumberInput);

    if (maxNumberInput.trim() === "" || Number.isNaN(parsedValue)) {
      setConfigError("Introduce un número válido.");
      setStatusMessage("");
      return;
    }

    if (parsedValue < 5) {
      setConfigError("El rango debe ser al menos 5 para que sea divertido.");
      setStatusMessage("");
      return;
    }

    const randomNumber = Math.floor(Math.random() * (parsedValue + 1));

    setMaxNumber(parsedValue);
    setSecretNumber(randomNumber);
    setGuessInput("");
    setAttempts(0);
    setFeedback("");
    setHint("");
    setConfigError("");
    setProgress(0);
    setGameMessage(`Estoy pensando en un número entre 0 y ${parsedValue}...`);
    setEstado("pensandoNumero");

    const intervalId = window.setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + 10, 100);
        if (next === 100) {
          window.clearInterval(intervalId);
          setGameMessage(`Ya elegí un número entre 0 y ${parsedValue}. ¡Adivina!`);
          setEstado("jugar");
        }
        return next;
      });
    }, 500);
  };

  const comprobarAdivinanza = () => {
    if (secretNumber === null) return;

    setHint("");
    const guess = Number(guessInput);
    if (guessInput.trim() === "" || Number.isNaN(guess)) {
      setFeedback("Introduce un número válido para adivinar.");
      return;
    }

    setAttempts((prev) => prev + 1);

    if (guess === secretNumber) {
      setFeedback(
        `¡Acertaste! El número era ${secretNumber}. Lo lograste en ${attempts + 1} intentos.`,
      );
      setSecretNumber(null);
      setHasWon(true);
      return;
    }

    if (guess === secretNumber - 1) {
      setFeedback("¡Estás cerca! Necesitas un número más grande.");
      return;
    }

    if (guess === secretNumber + 1) {
      setFeedback("¡Estás cerca! Necesitas un número más pequeño.");
      return;
    }

    if (guess < secretNumber) {
      setFeedback("Demasiado bajo. Intenta un número más alto.");
      return;
    }

    setFeedback("Demasiado alto. Intenta un número más bajo.");
  };

  const [hint, setHint] = useState("");

  const darPista = () => {
    if (secretNumber === null) return;

    const delta = 4;
    const minHint = Math.max(1, secretNumber - delta);
    const maxHint = Math.min(maxNumber, secretNumber + delta);

    setHint(`Pista: el número está entre ${minHint} y ${maxHint}.`);
  };

  const reiniciarJuego = () => {
    setEstado("configuracion");
    setConfigError("");
    setStatusMessage("");
    setGameMessage("");
    setFeedback("");
    setHint("");
    setHasWon(false);
    setProgress(0);
    setGuessInput("");
    setSecretNumber(null);
    setAttempts(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 flex items-center justify-center p-4 font-sans text-white">
      <button
        className="fixed top-4 right-4 z-20 rounded-xl bg-white/15 border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/25 transition"
        onClick={() => {
          void alternarMusica();
        }}
      >
        {musicaActiva ? "🔊 Música: ON" : "🔈 Música: OFF"}
      </button>

      {estado === "bienvenida" && (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-xl text-center animate-[fadeIn_0.4s_ease-in-out]">
          <div className="text-7xl mb-4 animate-bounce">✨🎮</div>
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
            Adivina el Número
          </h1>
          <p className="text-white/70 mb-8 leading-relaxed">
            Bienvenido a una experiencia rápida y divertida: adivina el número,
            gana rondas y demuestra tu intuición.
          </p>
          <button
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xl shadow-lg shadow-purple-900/50 transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={iniciar}
          >
            ¡Jugar!
          </button>
        </div>
      )}

      {estado === "configuracion" && (
        <div className="relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-xl text-center animate-[fadeIn_0.4s_ease-in-out]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_55%)]" />
          <div className="relative">
            <div className="text-5xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold mb-3 tracking-tight">
              ¿Hasta qué número quieres que abarque el juego?
            </h2>
            <p className="text-sm text-white/60 mb-8">
              Ajusta el límite para crear un desafío a tu medida.
            </p>
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                <label
                  className="block text-sm font-medium text-white/80 mb-2"
                  htmlFor="max-number"
                >
                  Límite máximo
                </label>
                <input
                  id="max-number"
                  type="number"
                  min={5}
                  inputMode="numeric"
                  value={maxNumberInput}
                  onChange={(event) => {
                    setMaxNumberInput(event.target.value);
                  }}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-400 transition"
                  placeholder="Ej: 100, 50, etc"
                />
              </div>
              <button
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-lg shadow-lg shadow-purple-900/50 transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={comenzarJuego}
              >
                Listo, jugar
              </button>
            </div>
            <div className="mt-5 text-left">
              <p className="text-sm text-white/60">
                El juego irá de{" "}
                <span className="font-semibold text-white">0</span> hasta{" "}
                <span className="font-semibold text-white">
                  {maxNumberInput.trim() === "" ? maxNumber : maxNumberInput}
                </span>
                .
              </p>
              {configError ? (
                <p className="mt-3 text-sm text-rose-300">{configError}</p>
              ) : statusMessage ? (
                <p className="mt-3 text-sm text-emerald-300">{statusMessage}</p>
              ) : null}
            </div>
          </div>
        </div>
      )}
      {estado === "pensandoNumero" && (
        <div className="relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-xl text-center animate-[fadeIn_0.4s_ease-in-out]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_55%)]" />
          <div className="relative">
            <div className="text-6xl mb-4 animate-bounce">💭</div>
            <h2 className="text-2xl font-bold mb-3 tracking-tight">
              Pensando un número...
            </h2>
            <p className="text-base sm:text-sm text-violet-200 mb-8 animate-pulse">
              Estoy eligiendo el número perfecto entre 0 y {maxNumber}. Un momento...
            </p>
            <div className="mx-auto h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 text-sm text-white/70">
              Cargando pista... {progress}%
            </div>
          </div>
        </div>
      )}
      {estado === "jugar" && (
        <div className="relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-xl text-center animate-[fadeIn_0.4s_ease-in-out]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_55%)]" />
          <div className="relative">
            <div className="text-5xl mb-4">🕹️</div>
            <h2 className="text-2xl font-bold mb-3 tracking-tight">
              Adivina el número
            </h2>
            <p className="text-sm text-white/60 mb-8">
              {gameMessage ||
                `Ya elegí un número entre 0 y ${maxNumber}. ¡Adivina!`}
            </p>
            <div className="flex flex-col gap-4">
              <input
                type="number"
                min={0}
                max={maxNumber}
                inputMode="numeric"
                value={guessInput}
                onChange={(event) => setGuessInput(event.target.value)}
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-400 transition"
                placeholder={`Escribe un número entre 0 y ${maxNumber}`}
              />
              <button
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-lg shadow-lg shadow-purple-900/50 transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={comprobarAdivinanza}
              >
                Comprobar
              </button>
            </div>

            {feedback ? (
              <div className="mt-5 rounded-3xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 shadow-sm shadow-emerald-500/15">
                {feedback}
              </div>
            ) : null}
            {hasWon ? (
              <div className="mt-4">
                <button
                  className="w-full py-3 rounded-3xl bg-gradient-to-r from-emerald-500 to-lime-500 text-white font-bold shadow-lg shadow-emerald-500/30 hover:scale-[1.02] transition-transform duration-200"
                  onClick={reiniciarJuego}
                >
                  Volver a jugar
                </button>
              </div>
            ) : null}
            {hint ? (
              <div className="mt-3 rounded-3xl border border-sky-300/20 bg-sky-500/10 px-5 py-4 text-base text-sky-100 shadow-sm shadow-sky-500/15 text-left break-words">
                {hint}
              </div>
            ) : null}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white font-bold text-base shadow-lg shadow-purple-900/40 hover:from-purple-400 hover:to-indigo-400 hover:-translate-y-0.5 transition-transform duration-200"
                onClick={darPista}
              >
                🎯 Pista
              </button>
            </div>
            <div className="mt-4 flex items-center justify-center gap-3 text-sm text-white/70">
              <span className="font-semibold">Intentos:</span>
              <span className="font-medium text-indigo-200">{attempts}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
