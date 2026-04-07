"use client";

import { useEffect, useState } from "react";

const WMO_MAP: Record<number, { emoji: string; label: string; bg: string }> = {
  0:  { emoji: "☀️",  label: "Sunny",          bg: "from-yellow-300 via-orange-300 to-amber-400" },
  1:  { emoji: "🌤️", label: "Mostly sunny",   bg: "from-yellow-200 via-sky-300 to-blue-400" },
  2:  { emoji: "⛅",  label: "Partly cloudy",  bg: "from-sky-300 via-blue-300 to-slate-400" },
  3:  { emoji: "☁️",  label: "Cloudy",         bg: "from-slate-300 via-slate-400 to-slate-500" },
  45: { emoji: "🌫️", label: "Foggy",          bg: "from-gray-300 via-gray-400 to-gray-500" },
  48: { emoji: "🌫️", label: "Foggy",          bg: "from-gray-300 via-gray-400 to-gray-500" },
  51: { emoji: "🌦️", label: "Drizzle",        bg: "from-blue-300 via-blue-400 to-teal-500" },
  53: { emoji: "🌦️", label: "Drizzle",        bg: "from-blue-300 via-blue-400 to-teal-500" },
  55: { emoji: "🌧️", label: "Rain",           bg: "from-blue-400 via-blue-500 to-blue-700" },
  61: { emoji: "🌧️", label: "Rain",           bg: "from-blue-400 via-blue-500 to-blue-700" },
  63: { emoji: "🌧️", label: "Rain",           bg: "from-blue-500 via-blue-600 to-blue-800" },
  65: { emoji: "⛈️",  label: "Heavy rain",    bg: "from-blue-600 via-slate-600 to-slate-800" },
  71: { emoji: "🌨️", label: "Snow",           bg: "from-blue-100 via-blue-200 to-indigo-300" },
  73: { emoji: "❄️",  label: "Snow",          bg: "from-blue-100 via-blue-200 to-indigo-300" },
  75: { emoji: "❄️",  label: "Heavy snow",    bg: "from-indigo-100 via-blue-200 to-blue-400" },
  77: { emoji: "🌨️", label: "Snow grains",   bg: "from-blue-100 via-blue-200 to-indigo-200" },
  80: { emoji: "🌧️", label: "Showers",       bg: "from-blue-400 via-blue-500 to-teal-600" },
  81: { emoji: "🌧️", label: "Showers",       bg: "from-blue-400 via-blue-500 to-teal-600" },
  82: { emoji: "⛈️",  label: "Heavy showers", bg: "from-blue-600 via-slate-600 to-slate-800" },
  85: { emoji: "🌨️", label: "Snow showers",  bg: "from-blue-200 via-blue-300 to-indigo-400" },
  86: { emoji: "🌨️", label: "Snow showers",  bg: "from-blue-200 via-blue-300 to-indigo-400" },
  95: { emoji: "⛈️",  label: "Thunderstorm", bg: "from-purple-600 via-slate-700 to-slate-900" },
  96: { emoji: "⛈️",  label: "Thunderstorm", bg: "from-purple-700 via-slate-700 to-slate-900" },
  99: { emoji: "⛈️",  label: "Thunderstorm", bg: "from-purple-800 via-slate-800 to-gray-900" },
};

function getWeather(code: number) {
  return WMO_MAP[code] ?? { emoji: "🌡️", label: "Weather", bg: "from-sky-300 to-blue-500" };
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

export default function Home() {
  const [time, setTime] = useState<Date | null>(null);
  const [temp, setTemp] = useState<number | null>(null);
  const [code, setCode] = useState<number | null>(null);
  const [error, setError] = useState(false);

  // tick the clock
  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // fetch weather
  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=50.0647&longitude=19.9450&current=temperature_2m,weather_code&timezone=Europe%2FWarsaw"
    )
      .then((r) => r.json())
      .then((d) => {
        setTemp(Math.round(d.current.temperature_2m));
        setCode(d.current.weather_code);
      })
      .catch(() => setError(true));
  }, []);

  const weather = code !== null ? getWeather(code) : null;
  const bg = weather?.bg ?? "from-sky-300 via-blue-400 to-blue-500";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div
        className={`relative w-80 h-80 rounded-3xl bg-gradient-to-br ${bg} shadow-2xl overflow-hidden flex flex-col justify-between p-6 transition-all duration-1000`}
      >
        {/* sparkle decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 right-16 text-white/20 text-5xl select-none">✦</div>
          <div className="absolute bottom-16 right-5 text-white/10 text-3xl select-none">✦</div>
          <div className="absolute top-20 left-4 text-white/10 text-2xl select-none">·</div>
        </div>

        {/* top row */}
        <div className="flex items-start justify-between relative z-10">
          <div className="text-white">
            {time ? (
              <>
                <div className="text-sm font-bold opacity-80">{formatDate(time)}</div>
                <div className="text-lg font-black">{formatTime(time)}</div>
              </>
            ) : (
              <div className="text-sm font-bold opacity-60">Loading…</div>
            )}
          </div>

          {/* temperature */}
          <div className="text-white text-6xl font-black leading-none drop-shadow-lg">
            {error ? "–" : temp !== null ? `${temp}°` : "…"}
          </div>
        </div>

        {/* big weather emoji */}
        <div className="flex justify-center items-center relative z-10 -mt-4">
          <span className="text-8xl drop-shadow-lg select-none leading-none">
            {error ? "❓" : weather ? weather.emoji : "⏳"}
          </span>
        </div>

        {/* bottom row */}
        <div className="text-white relative z-10">
          <div className="text-xl font-black leading-tight">Kraków</div>
          <div className="text-sm font-bold opacity-75">Poland</div>
        </div>
      </div>
    </div>
  );
}
