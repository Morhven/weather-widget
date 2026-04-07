"use client";

import { useEffect, useState } from "react";
import {
  SunCharacter,
  PartlyCloudyCharacter,
  CloudCharacter,
  RainCharacter,
  SnowCharacter,
  StormCharacter,
  FogCharacter,
} from "./characters";

// ─── Sky based on hour ───────────────────────────────────────────────────────

type SkyConfig = {
  gradient: string;
  textColor: string;
  stars: boolean;
};

function getSky(hour: number): SkyConfig {
  if (hour >= 21 || hour < 5) {
    return {
      gradient: "linear-gradient(to bottom, #05082e, #0d1545, #111d3c)",
      textColor: "#ffffff",
      stars: true,
    };
  }
  if (hour < 7) {
    return {
      gradient: "linear-gradient(to bottom, #2d1b69, #c2553a, #f4a261)",
      textColor: "#ffffff",
      stars: false,
    };
  }
  if (hour < 11) {
    return {
      gradient: "linear-gradient(to bottom, #6dd5fa, #c8eefe, #fffde7)",
      textColor: "#1a3a5c",
      stars: false,
    };
  }
  if (hour < 17) {
    return {
      gradient: "linear-gradient(to bottom, #2196f3, #64b5f6, #b3e5fc)",
      textColor: "#ffffff",
      stars: false,
    };
  }
  if (hour < 20) {
    return {
      gradient: "linear-gradient(to bottom, #f4511e, #ff8a65, #ce93d8)",
      textColor: "#ffffff",
      stars: false,
    };
  }
  return {
    gradient: "linear-gradient(to bottom, #3a1c71, #1a1a4e, #0d1040)",
    textColor: "#ffffff",
    stars: true,
  };
}

// Fixed star positions so they don't jump around
const STARS = [
  { x: 12, y: 8, r: 1.2 }, { x: 28, y: 14, r: 0.8 }, { x: 45, y: 6, r: 1 },
  { x: 62, y: 11, r: 1.4 }, { x: 78, y: 5, r: 0.9 }, { x: 88, y: 16, r: 1.1 },
  { x: 20, y: 22, r: 0.7 }, { x: 55, y: 18, r: 1.3 }, { x: 72, y: 24, r: 0.8 },
  { x: 38, y: 28, r: 0.6 }, { x: 85, y: 30, r: 1 },  { x: 8,  y: 35, r: 0.9 },
];

// ─── Weather code → character ────────────────────────────────────────────────

function WeatherCharacter({ code, temp }: { code: number; temp: number }) {
  if (code === 0 || code === 1)         return <SunCharacter temp={temp} />;
  if (code === 2)                        return <PartlyCloudyCharacter temp={temp} />;
  if (code === 3)                        return <CloudCharacter temp={temp} />;
  if (code === 45 || code === 48)        return <FogCharacter temp={temp} />;
  if (code >= 51 && code <= 82)         return <RainCharacter temp={temp} />;
  if (code >= 71 && code <= 77)         return <SnowCharacter temp={temp} />;
  if (code === 85 || code === 86)        return <SnowCharacter temp={temp} />;
  if (code >= 95)                        return <StormCharacter temp={temp} />;
  return <CloudCharacter temp={temp} />;
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function Home() {
  const [time, setTime] = useState<Date | null>(null);
  const [temp, setTemp] = useState<number | null>(null);
  const [code, setCode] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

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

  const hour = time?.getHours() ?? 12;
  const sky = getSky(hour);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-200">
      <div
        className="relative w-80 h-80 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col justify-between p-6"
        style={{ background: sky.gradient, transition: "background 2s ease" }}
      >
        {/* Stars (night only) */}
        {sky.stars && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
          >
            {STARS.map((s, i) => (
              <circle
                key={i}
                cx={s.x} cy={s.y} r={s.r}
                fill="white"
                opacity={0.7 + (i % 3) * 0.1}
              />
            ))}
          </svg>
        )}

        {/* Top row */}
        <div
          className="flex items-start justify-between relative z-10"
          style={{ color: sky.textColor, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
        >
          <div>
            <div className="text-sm font-bold opacity-80">Today</div>
            <div className="text-lg font-black">{time ? formatTime(time) : "–:––"}</div>
          </div>
          <div className="text-6xl font-black leading-none">
            {error ? "–" : temp !== null ? `${temp}°` : "…"}
          </div>
        </div>

        {/* Character */}
        <div className="flex justify-center items-center relative z-10 -mt-2 -mb-2">
          <div className="w-44 h-44">
            {temp !== null && code !== null ? (
              <WeatherCharacter code={code} temp={temp} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl opacity-40">
                ⏳
              </div>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div
          className="relative z-10"
          style={{ color: sky.textColor, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
        >
          <div className="text-xl font-black">Kraków</div>
        </div>
      </div>
    </div>
  );
}
