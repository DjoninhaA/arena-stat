export function FootballPitch() {
  // SVG viewport (portrait)
  const svgW = 356;
  const svgH = 542;

  // Field boundaries (goals extend outside vertically)
  const fx = 25;   // field left edge
  const fy = 35;   // field top edge
  const fw = 306;  // field width  (≈ 68 m)
  const fh = 472;  // field height (≈ 105 m)
  const fxEnd = fx + fw; // 331
  const fyEnd = fy + fh; // 507

  // Center point
  const cx = fx + fw / 2; // 178
  const cy = fy + fh / 2; // 271

  // Scale: 472px / 105m ≈ 4.5 px/m
  const scale = fh / 105;

  // Key dimensions (in px) — goals at top & bottom
  const paL  = Math.round(16.5  * scale); // 74  – penalty area depth
  const paW  = Math.round(40.32 * scale); // 172 – penalty area width
  const gaL  = Math.round(5.5   * scale); // 25  – goal area depth
  const gaW  = Math.round(18.32 * scale); // 82  – goal area width
  const ccR  = Math.round(9.15  * scale); // 41  – centre circle radius
  const psD  = Math.round(11    * scale); // 50  – penalty spot distance
  const goalW = Math.round(7.32 * scale); // 33  – goal width
  const goalD = Math.round(2.44 * scale); // 11  – goal depth
  const cr   = Math.round(1     * scale); // 5   – corner arc radius

  // D-arc half-width at PA edge
  const dDist  = paL - psD;                                       // 24
  const dHalfW = Math.round(Math.sqrt(ccR * ccR - dDist * dDist)); // 33

  const line = { stroke: "rgba(255,255,255,0.92)", strokeWidth: 2 };

  // Grass stripe colours (horizontal stripes for vertical pitch)
  const g1 = "#1e6b32";
  const g2 = "#236038";
  const stripes = 10;
  const stripeH = fh / stripes;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Campo
        </span>
      </div>

      {/* Pitch */}
      <div className="flex justify-center bg-[#1e6b32] px-3 py-3">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full"
          style={{ display: "block" }}
        >
          {/* ── Grass stripes (horizontal) ── */}
          {Array.from({ length: stripes }, (_, i) => (
            <rect
              key={i}
              x={fx}
              y={fy + i * stripeH}
              width={fw}
              height={stripeH}
              fill={i % 2 === 0 ? g1 : g2}
            />
          ))}

          {/* ── Field border ── */}
          <rect x={fx} y={fy} width={fw} height={fh} fill="none" {...line} />

          {/* ── Centre line (horizontal) ── */}
          <line x1={fx} y1={cy} x2={fxEnd} y2={cy} {...line} />

          {/* ── Centre circle & spot ── */}
          <circle cx={cx} cy={cy} r={ccR} fill="none" {...line} />
          <circle cx={cx} cy={cy} r={3} fill="rgba(255,255,255,0.92)" />

          {/* ── Top penalty area ── */}
          <rect
            x={cx - paW / 2} y={fy}
            width={paW} height={paL}
            fill="none" {...line}
          />

          {/* ── Top goal area ── */}
          <rect
            x={cx - gaW / 2} y={fy}
            width={gaW} height={gaL}
            fill="none" {...line}
          />

          {/* ── Top penalty spot ── */}
          <circle cx={cx} cy={fy + psD} r={3} fill="rgba(255,255,255,0.92)" />

          {/* ── Top D-arc (bulges toward centre) ── */}
          <path
            d={`M ${cx - dHalfW} ${fy + paL} A ${ccR} ${ccR} 0 0 1 ${cx + dHalfW} ${fy + paL}`}
            fill="none" {...line}
          />

          {/* ── Top goal ── */}
          <rect
            x={cx - goalW / 2} y={fy - goalD}
            width={goalW} height={goalD}
            fill="rgba(0,0,0,0.25)" {...line}
          />

          {/* ── Bottom penalty area ── */}
          <rect
            x={cx - paW / 2} y={fyEnd - paL}
            width={paW} height={paL}
            fill="none" {...line}
          />

          {/* ── Bottom goal area ── */}
          <rect
            x={cx - gaW / 2} y={fyEnd - gaL}
            width={gaW} height={gaL}
            fill="none" {...line}
          />

          {/* ── Bottom penalty spot ── */}
          <circle cx={cx} cy={fyEnd - psD} r={3} fill="rgba(255,255,255,0.92)" />

          {/* ── Bottom D-arc (bulges toward centre) ── */}
          <path
            d={`M ${cx - dHalfW} ${fyEnd - paL} A ${ccR} ${ccR} 0 0 0 ${cx + dHalfW} ${fyEnd - paL}`}
            fill="none" {...line}
          />

          {/* ── Bottom goal ── */}
          <rect
            x={cx - goalW / 2} y={fyEnd}
            width={goalW} height={goalD}
            fill="rgba(0,0,0,0.25)" {...line}
          />

          {/* ── Corner arcs ── */}
          {/* Top-left */}
          <path d={`M ${fx + cr} ${fy} A ${cr} ${cr} 0 0 1 ${fx} ${fy + cr}`} fill="none" {...line} />
          {/* Top-right */}
          <path d={`M ${fxEnd - cr} ${fy} A ${cr} ${cr} 0 0 0 ${fxEnd} ${fy + cr}`} fill="none" {...line} />
          {/* Bottom-left */}
          <path d={`M ${fx} ${fyEnd - cr} A ${cr} ${cr} 0 0 0 ${fx + cr} ${fyEnd}`} fill="none" {...line} />
          {/* Bottom-right */}
          <path d={`M ${fxEnd - cr} ${fyEnd} A ${cr} ${cr} 0 0 1 ${fxEnd} ${fyEnd - cr}`} fill="none" {...line} />
        </svg>
      </div>
    </div>
  );
}
