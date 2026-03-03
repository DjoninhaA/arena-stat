import type { Player, Position } from "@/lib/api";

// ── Base coordinates for each position (SVG portrait field) ───────────────────
// Field: fx=25 fy=35 fw=306 fh=472 cx=178 cy=271 fyEnd=507
const POS_BASE: Record<Position, { x: number; y: number }> = {
  GOALKEEPER:           { x: 178, y: 470 },
  LEFT_BACK:            { x: 80,  y: 230 },
  CENTER_BACK:          { x: 178, y: 400 },
  RIGHT_BACK:           { x: 280, y: 230 },
  DEFENSIVE_MIDFIELDER: { x: 178, y: 300 },
  MIDFIELDER:           { x: 178, y: 200 },
  STRIKER:              { x: 178, y: 110 },
};

// Horizontal step between overlapping player circles
const STACK_STEP = 20; // px between centers (circle radius=17, so ~3px gap visible)

interface PlacedPlayer {
  player: Player;
  x: number;
  y: number;
  isBack: boolean; // true = render first (behind)
}

function getPlayerPositions(players: Player[]): PlacedPlayer[] {
  const groups = new Map<Position, Player[]>();
  for (const p of players) {
    const list = groups.get(p.position) ?? [];
    list.push(p);
    groups.set(p.position, list);
  }

  const result: PlacedPlayer[] = [];
  for (const [pos, group] of groups) {
    const base = POS_BASE[pos];
    const n = group.length;
    // Spread horizontally, centred on base.x
    group.forEach((player, i) => {
      const startX = base.x - ((n - 1) * STACK_STEP) / 2;
      result.push({
        player,
        x: startX + i * STACK_STEP,
        y: base.y,
        // Right-most rendered first (behind); left-most rendered last (in front)
        isBack: i > 0,
      });
    });
  }
  // Painter's algorithm: back players first (isBack=true), front last
  result.sort((a, b) => (a.isBack === b.isBack ? 0 : a.isBack ? -1 : 1));
  return result;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

// ── Component ─────────────────────────────────────────────────────────────────

interface FootballPitchProps {
  players?: Player[];
}

export function FootballPitch({ players = [] }: FootballPitchProps) {
  // SVG viewport (portrait)
  const svgW = 356;
  const svgH = 542;

  // Field boundaries
  const fx = 25;
  const fy = 35;
  const fw = 306;
  const fh = 472;
  const fxEnd = fx + fw;
  const fyEnd = fy + fh;
  const cx = fx + fw / 2;
  const cy = fy + fh / 2;

  const scale = fh / 105;
  const paL  = Math.round(16.5  * scale);
  const paW  = Math.round(40.32 * scale);
  const gaL  = Math.round(5.5   * scale);
  const gaW  = Math.round(18.32 * scale);
  const ccR  = Math.round(9.15  * scale);
  const psD  = Math.round(11    * scale);
  const goalW = Math.round(7.32 * scale);
  const goalD = Math.round(2.44 * scale);
  const cr   = Math.round(1     * scale);
  const dDist  = paL - psD;
  const dHalfW = Math.round(Math.sqrt(ccR * ccR - dDist * dDist));

  const line = { stroke: "rgba(255,255,255,0.85)", strokeWidth: 2 };

  const g1 = "#1e6b32";
  const g2 = "#236038";
  const stripes = 10;
  const stripeH = fh / stripes;

  const placed = getPlayerPositions(players);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2.5 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Time em Campo
        </span>
      </div>

      {/* Pitch */}
      <div className="flex justify-center bg-[#1e6b32] px-4 py-4">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="h-full w-auto"
          style={{ display: "block", maxHeight: "460px" }}
        >
          {/* ── Grass stripes ── */}
          {Array.from({ length: stripes }, (_, i) => (
            <rect
              key={i}
              x={fx} y={fy + i * stripeH}
              width={fw} height={stripeH}
              fill={i % 2 === 0 ? g1 : g2}
            />
          ))}

          {/* ── Field border ── */}
          <rect x={fx} y={fy} width={fw} height={fh} fill="none" {...line} />

          {/* ── Centre line ── */}
          <line x1={fx} y1={cy} x2={fxEnd} y2={cy} {...line} />

          {/* ── Centre circle & spot ── */}
          <circle cx={cx} cy={cy} r={ccR} fill="none" {...line} />
          <circle cx={cx} cy={cy} r={3} fill="rgba(255,255,255,0.85)" />

          {/* ── Top penalty area ── */}
          <rect x={cx - paW / 2} y={fy} width={paW} height={paL} fill="none" {...line} />

          {/* ── Top goal area ── */}
          <rect x={cx - gaW / 2} y={fy} width={gaW} height={gaL} fill="none" {...line} />

          {/* ── Top penalty spot ── */}
          <circle cx={cx} cy={fy + psD} r={3} fill="rgba(255,255,255,0.85)" />

          {/* ── Top D-arc ── */}
          <path d={`M ${cx - dHalfW} ${fy + paL} A ${ccR} ${ccR} 0 0 1 ${cx + dHalfW} ${fy + paL}`} fill="none" {...line} />

          {/* ── Top goal ── */}
          <rect x={cx - goalW / 2} y={fy - goalD} width={goalW} height={goalD} fill="rgba(0,0,0,0.25)" {...line} />

          {/* ── Bottom penalty area ── */}
          <rect x={cx - paW / 2} y={fyEnd - paL} width={paW} height={paL} fill="none" {...line} />

          {/* ── Bottom goal area ── */}
          <rect x={cx - gaW / 2} y={fyEnd - gaL} width={gaW} height={gaL} fill="none" {...line} />

          {/* ── Bottom penalty spot ── */}
          <circle cx={cx} cy={fyEnd - psD} r={3} fill="rgba(255,255,255,0.85)" />

          {/* ── Bottom D-arc ── */}
          <path d={`M ${cx - dHalfW} ${fyEnd - paL} A ${ccR} ${ccR} 0 0 0 ${cx + dHalfW} ${fyEnd - paL}`} fill="none" {...line} />

          {/* ── Bottom goal ── */}
          <rect x={cx - goalW / 2} y={fyEnd} width={goalW} height={goalD} fill="rgba(0,0,0,0.25)" {...line} />

          {/* ── Corner arcs ── */}
          <path d={`M ${fx + cr} ${fy} A ${cr} ${cr} 0 0 1 ${fx} ${fy + cr}`} fill="none" {...line} />
          <path d={`M ${fxEnd - cr} ${fy} A ${cr} ${cr} 0 0 0 ${fxEnd} ${fy + cr}`} fill="none" {...line} />
          <path d={`M ${fx} ${fyEnd - cr} A ${cr} ${cr} 0 0 0 ${fx + cr} ${fyEnd}`} fill="none" {...line} />
          <path d={`M ${fxEnd - cr} ${fyEnd} A ${cr} ${cr} 0 0 1 ${fxEnd} ${fyEnd - cr}`} fill="none" {...line} />

          {/* ── Players ── */}
          {placed.map(({ player, x, y, isBack }) => (
            <g key={player.id}>
              {/* Shadow */}
              <circle cx={x} cy={y + 1} r={17} fill="rgba(0,0,0,0.35)" />
              {/* Avatar circle */}
              <circle cx={x} cy={y} r={17} fill="#00C853" />
              {/* White ring */}
              <circle cx={x} cy={y} r={17} fill="none" stroke="white" strokeWidth={2} />
              {/* Initials */}
              <text
                x={x} y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={11}
                fontWeight="700"
                fill="white"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                {initials(player.name)}
              </text>
              {/* Name label — only for the front player */}
              {!isBack && (
                <text
                  x={x} y={y + 24}
                  textAnchor="middle"
                  dominantBaseline="hanging"
                  fontSize={8.5}
                  fontWeight="600"
                  fill="white"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  {player.name.split(" ")[0]}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
