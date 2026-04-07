"use client";

type Props = { temp: number };

function isCold(t: number) { return t < 8; }

function Scarf({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={9} rx={4} fill="#FF5252" />
      {[8, 20, 32].map((o) => (
        <rect key={o} x={x + o} y={y} width={5} height={9} fill="white" opacity={0.35} />
      ))}
      <rect x={x + w - 11} y={y + 5} width={8} height={15} rx={4} fill="#FF5252" />
      <rect x={x + w - 10} y={y + 5} width={2.5} height={15} rx={1} fill="white" opacity={0.35} />
    </g>
  );
}

function Beanie({ cx, topY, id }: { cx: number; topY: number; id: string }) {
  const domePath = `M${cx - 20} ${topY + 14} C${cx - 22} ${topY + 4} ${cx - 10} ${topY - 3} ${cx} ${topY - 3} C${cx + 10} ${topY - 3} ${cx + 22} ${topY + 4} ${cx + 20} ${topY + 14} Z`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={domePath} />
        </clipPath>
      </defs>
      {/* Dome — clipped so stripe can't overflow */}
      <g clipPath={`url(#${id})`}>
        <path d={domePath} fill="#FF5252" />
        <rect x={cx - 20} y={topY + 2} width={40} height={6} fill="white" opacity={0.22} />
      </g>
      {/* Brim */}
      <rect x={cx - 20} y={topY + 11} width={40} height={7} rx={3} fill="#CC3333" />
      {/* Pompom */}
      <circle cx={cx} cy={topY - 10} r={8} fill="white" />
      <circle cx={cx - 2} cy={topY - 12} r={2.5} fill="#FF8A80" opacity={0.5} />
    </g>
  );
}

// Sun character — clear sky
export function SunCharacter({ temp }: Props) {
  const cold = isCold(temp);
  const cy = cold ? 52 : 55;
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const r = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={50 + 31 * Math.cos(r)} y1={cy + 31 * Math.sin(r)}
            x2={50 + 43 * Math.cos(r)} y2={cy + 43 * Math.sin(r)}
            stroke="#FFB300" strokeWidth={4.5} strokeLinecap="round"
          />
        );
      })}
      <circle cx={50} cy={cy} r={26} fill="#FFD740" stroke="#FFB300" strokeWidth={2.5} />
      <circle cx={37} cy={cy + 6} r={6} fill="#FF8A65" opacity={0.45} />
      <circle cx={63} cy={cy + 6} r={6} fill="#FF8A65" opacity={0.45} />
      {/* Eyes */}
      <circle cx={43} cy={cy - 3} r={4} fill="#4E342E" />
      <circle cx={57} cy={cy - 3} r={4} fill="#4E342E" />
      <circle cx={44.5} cy={cy - 5} r={1.5} fill="white" />
      <circle cx={58.5} cy={cy - 5} r={1.5} fill="white" />
      {/* Mouth */}
      {cold
        ? <path d={`M43 ${cy + 8} Q50 ${cy + 5} 57 ${cy + 8}`} stroke="#4E342E" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        : <path d={`M43 ${cy + 7} Q50 ${cy + 15} 57 ${cy + 7}`} stroke="#4E342E" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      }
      {cold && <Scarf x={25} y={cy + 18} w={50} />}
      {cold && <Beanie cx={50} topY={cy - 29} id="beanie-sun" />}
    </svg>
  );
}

// Cloud body helper — no inner strokes
function CloudBody({ cx, cy, fill }: { cx: number; cy: number; fill: string }) {
  return (
    <g>
      <circle cx={cx - 17} cy={cy + 8} r={16} fill={fill} />
      <circle cx={cx + 17} cy={cy + 8} r={16} fill={fill} />
      <circle cx={cx} cy={cy - 2} r={20} fill={fill} />
      <circle cx={cx - 9} cy={cy + 5} r={15} fill={fill} />
      <circle cx={cx + 9} cy={cy + 5} r={15} fill={fill} />
      <rect x={cx - 33} y={cy + 8} width={66} height={20} rx={10} fill={fill} />
    </g>
  );
}

// Cloud character — overcast/cloudy
export function CloudCharacter({ temp }: Props) {
  const cold = isCold(temp);
  const fill = cold ? "#B8CCE4" : "#DCE9FF";
  const textCol = "#3D4F6B";
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <CloudBody cx={50} cy={cold ? 43 : 46} fill={fill} />
      {/* Eyes */}
      <circle cx={43} cy={cold ? 47 : 50} r={4} fill={textCol} />
      <circle cx={57} cy={cold ? 47 : 50} r={4} fill={textCol} />
      <circle cx={44.5} cy={cold ? 45 : 48} r={1.5} fill="white" />
      <circle cx={58.5} cy={cold ? 45 : 48} r={1.5} fill="white" />
      {cold ? (
        <>
          <path d={`M39 43 Q43 40 47 43`} stroke={textCol} strokeWidth={2} strokeLinecap="round" />
          <path d={`M53 43 Q57 40 61 43`} stroke={textCol} strokeWidth={2} strokeLinecap="round" />
          <path d={`M42 57 Q50 53 58 57`} stroke={textCol} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <Scarf x={17} y={61} w={66} />
          <Beanie cx={50} topY={20} id="beanie-cloud" />
        </>
      ) : (
        <path d={`M42 60 Q50 66 58 60`} stroke={textCol} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

// Partly cloudy — sun peeking behind cloud
export function PartlyCloudyCharacter({ temp }: Props) {
  const cold = isCold(temp);
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sun behind */}
      {[315, 0, 45, 90].map((deg) => {
        const r = (deg * Math.PI) / 180;
        return (
          <line key={deg}
            x1={62 + 24 * Math.cos(r)} y1={38 + 24 * Math.sin(r)}
            x2={62 + 33 * Math.cos(r)} y2={38 + 33 * Math.sin(r)}
            stroke="#FFB300" strokeWidth={4} strokeLinecap="round"
          />
        );
      })}
      <circle cx={62} cy={38} r={19} fill="#FFD740" stroke="#FFB300" strokeWidth={2} />
      {/* Cloud in front */}
      <CloudBody cx={44} cy={56} fill={cold ? "#B8CCE4" : "#DCE9FF"} />
      {/* Face on cloud */}
      <circle cx={38} cy={61} r={3.5} fill="#3D4F6B" />
      <circle cx={50} cy={61} r={3.5} fill="#3D4F6B" />
      <circle cx={39.2} cy={59.2} r={1.2} fill="white" />
      <circle cx={51.2} cy={59.2} r={1.2} fill="white" />
      <path d="M35 68 Q44 73 53 68" stroke="#3D4F6B" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {cold && <Scarf x={11} y={70} w={66} />}
    </svg>
  );
}

// Rain character — sad cloud with drops
export function RainCharacter({ temp }: Props) {
  const cold = isCold(temp);
  const fill = "#8BAFC8";
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <CloudBody cx={50} cy={36} fill={fill} />
      {/* Worried brows */}
      <path d="M39 33 Q43 30 47 33" stroke="#1E3A5F" strokeWidth={2.2} strokeLinecap="round" />
      <path d="M53 33 Q57 30 61 33" stroke="#1E3A5F" strokeWidth={2.2} strokeLinecap="round" />
      {/* Eyes */}
      <circle cx={43} cy={38} r={3.5} fill="#1E3A5F" />
      <circle cx={57} cy={38} r={3.5} fill="#1E3A5F" />
      <circle cx={44.2} cy={36.2} r={1.2} fill="white" />
      <circle cx={58.2} cy={36.2} r={1.2} fill="white" />
      {/* Frown */}
      <path d="M42 46 Q50 42 58 46" stroke="#1E3A5F" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {/* Raindrops */}
      {[[33, 62], [50, 67], [67, 62]].map(([x, y]) => (
        <g key={x}>
          <line x1={x} y1={y - 7} x2={x} y2={y - 3} stroke="#5B9FD4" strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
          <ellipse cx={x} cy={y + 2} rx={4} ry={5.5} fill="#5B9FD4" opacity={0.8} />
        </g>
      ))}
      {cold && <Scarf x={17} y={50} w={66} />}
    </svg>
  );
}

// Snow character — a snowman
export function SnowCharacter({ temp: _ }: Props) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <circle cx={50} cy={75} r={19} fill="white" stroke="#C8D8E8" strokeWidth={2} />
      {/* Head */}
      <circle cx={50} cy={46} r={16} fill="white" stroke="#C8D8E8" strokeWidth={2} />
      {/* Eyes */}
      <circle cx={44} cy={42} r={2.8} fill="#2D3748" />
      <circle cx={56} cy={42} r={2.8} fill="#2D3748" />
      {/* Carrot nose */}
      <path d="M50 45 L58 47 L50 49 Z" fill="#FF8C42" />
      {/* Smile */}
      {[44, 50, 56].map((x) => <circle key={x} cx={x} cy={52} r={1.8} fill="#2D3748" />)}
      {/* Body buttons */}
      {[65, 74, 83].map((y) => <circle key={y} cx={50} cy={y} r={2} fill="#94A3B8" />)}
      {/* Scarf */}
      <Scarf x={34} y={56} w={32} />
      {/* Stick arms */}
      <line x1={31} y1={70} x2={18} y2={62} stroke="#92400E" strokeWidth={3} strokeLinecap="round" />
      <line x1={69} y1={70} x2={82} y2={62} stroke="#92400E" strokeWidth={3} strokeLinecap="round" />
      {/* Top hat */}
      <rect x={37} y={27} width={26} height={4} rx={2} fill="#2D3748" />
      <rect x={40} y={13} width={20} height={15} rx={3} fill="#2D3748" />
      <rect x={40} y={20} width={20} height={4} fill="#FF5252" opacity={0.75} />
    </svg>
  );
}

// Storm character — angry dark cloud with lightning
export function StormCharacter({ temp: _ }: Props) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <CloudBody cx={50} cy={38} fill="#5A6478" />
      {/* Angry brows */}
      <path d="M37 36 Q42 31 48 35" stroke="#1A202C" strokeWidth={3} strokeLinecap="round" />
      <path d="M52 35 Q58 31 63 36" stroke="#1A202C" strokeWidth={3} strokeLinecap="round" />
      {/* Eyes */}
      <circle cx={43} cy={41} r={4} fill="#1A202C" />
      <circle cx={57} cy={41} r={4} fill="#1A202C" />
      <circle cx={44.5} cy={39.2} r={1.5} fill="#7B8EA6" />
      <circle cx={58.5} cy={39.2} r={1.5} fill="#7B8EA6" />
      {/* Frown */}
      <path d="M41 50 Q50 46 59 50" stroke="#1A202C" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {/* Lightning bolt */}
      <path d="M57 54 L47 68 L54 68 L43 83" stroke="#FFD740" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M57 54 L47 68 L54 68 L43 83" stroke="#FFF9C4" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Fog character — sleepy wispy ghost
export function FogCharacter({ temp }: Props) {
  const cold = isCold(temp);
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[25, 40, 55, 70].map((y, i) => (
        <path
          key={y}
          d={`M${14 + i} ${y} Q30 ${y - 9} 50 ${y} Q70 ${y + 9} ${86 - i} ${y}`}
          stroke="#94A3B8"
          strokeWidth={i === 1 || i === 2 ? 10 : 7}
          fill="none"
          strokeLinecap="round"
          opacity={i === 0 || i === 3 ? 0.35 : 0.6}
        />
      ))}
      {/* Sleepy eyes */}
      <path d="M38 44 Q42 40 46 44" stroke="#475569" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d="M54 44 Q58 40 62 44" stroke="#475569" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {/* Zzz */}
      <text x="65" y="36" fontSize="9" fill="#94A3B8" fontWeight="bold" fontFamily="sans-serif">z</text>
      <text x="71" y="28" fontSize="12" fill="#94A3B8" fontWeight="bold" fontFamily="sans-serif">z</text>
      <text x="78" y="19" fontSize="15" fill="#94A3B8" fontWeight="bold" fontFamily="sans-serif">Z</text>
      <path d="M43 52 Q50 56 57 52" stroke="#475569" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {cold && <Scarf x={28} y={62} w={44} />}
    </svg>
  );
}
