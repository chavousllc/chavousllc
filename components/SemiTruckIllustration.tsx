export function SemiTruckIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 620 300"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {/* speed lines */}
      <g stroke="#ef4444" strokeWidth="4" strokeLinecap="round" opacity="0.55">
        <line className="truck-speed-line" style={{ animationDelay: "0s" }} x1="0" y1="90" x2="90" y2="90" />
        <line className="truck-speed-line" style={{ animationDelay: "0.3s" }} x1="20" y1="115" x2="130" y2="115" />
        <line className="truck-speed-line" style={{ animationDelay: "0.6s" }} x1="0" y1="140" x2="70" y2="140" />
      </g>
      <g stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.18">
        <line className="truck-speed-line" style={{ animationDelay: "0.15s" }} x1="40" y1="70" x2="110" y2="70" />
        <line className="truck-speed-line" style={{ animationDelay: "0.45s" }} x1="0" y1="165" x2="60" y2="165" />
      </g>

      {/* ground line (dashed, streams past to sell forward motion) */}
      <line
        className="truck-road"
        x1="60"
        y1="248"
        x2="620"
        y2="248"
        stroke="#ffffff"
        strokeOpacity="0.12"
        strokeWidth="2"
        strokeDasharray="16 16"
      />

      {/* vehicle body — bounces gently on its suspension */}
      <g className="truck-bounce">
        {/* 53' dry van trailer */}
        <rect x="255" y="95" width="330" height="130" rx="8" fill="#f4f4f5" />
        <rect x="255" y="95" width="330" height="130" rx="8" stroke="#d4d4d8" strokeWidth="2" />
        <rect x="272" y="150" width="296" height="10" rx="3" fill="#ef4444" />
        <text
          x="420"
          y="140"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="800"
          fontSize="22"
          fill="#18181b"
          letterSpacing="0.5"
        >
          CHAVOUS
        </text>
        <text
          x="568"
          y="212"
          textAnchor="end"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
          fontSize="10"
          fill="#a1a1aa"
          letterSpacing="0.5"
        >
          53&apos; TRAILER
        </text>

        {/* rear door jamb + hinges */}
        <line x1="573" y1="97" x2="573" y2="223" stroke="#d4d4d8" strokeWidth="2" />
        {[112, 160, 208].map((y) => (
          <rect key={y} x="577" y={y} width="6" height="5" rx="1.5" fill="#a1a1aa" />
        ))}

        {/* kingpin / fifth-wheel coupling, sits over the tractor's drive tandem */}
        <rect x="238" y="206" width="30" height="9" rx="2" fill="#52525b" />

        {/* frame rail — spans the underbody from the coupling back to the tandem, so the trailer reads as one connected chassis instead of floating */}
        <rect x="255" y="219" width="205" height="5" rx="2" fill="#71717a" opacity="0.55" />

        {/* rear underride (ICC) bumper, hangs below the trailer floor */}
        <rect x="540" y="221" width="42" height="9" rx="2" fill="#3f3f46" />

        {/* mudflap trailing the rear tandem axle */}
        <rect x="526" y="248" width="16" height="20" rx="2" fill="#27272a" opacity="0.85" />

        {/* exhaust stack, anchored behind the sleeper roofline */}
        <rect x="238" y="62" width="10" height="42" rx="3" fill="#71717a" />
        <rect x="236" y="58" width="14" height="8" rx="2" fill="#52525b" />

        {/* cab — upright sleeper box at the back */}
        <rect x="205" y="100" width="50" height="125" rx="4" fill="#dc2626" />

        {/* hood — long sloped nose typical of a conventional tractor */}
        <path d="M205 140 H150 L100 160 L92 225 H205 Z" fill="#dc2626" />

        {/* windshield, raked forward from the roofline down to the hood */}
        <path d="M205 104 H168 L150 138 H205 Z" fill="#bfe3f7" opacity="0.9" />

        {/* side mirror */}
        <line x1="208" y1="108" x2="198" y2="94" stroke="#3f3f46" strokeWidth="3" strokeLinecap="round" />
        <rect x="189" y="88" width="12" height="16" rx="3" fill="#27272a" />

        {/* door line + handle */}
        <line x1="215" y1="140" x2="215" y2="225" stroke="#991b1b" strokeWidth="2" />
        <rect x="221" y="175" width="14" height="4" rx="2" fill="#fecaca" />

        {/* fuel tank, mounted along the frame below the cab */}
        <rect x="205" y="197" width="50" height="20" rx="10" fill="#a1a1aa" />
        <circle cx="205" cy="207" r="10" fill="#71717a" />

        {/* front bumper + headlight */}
        <rect x="80" y="195" width="14" height="30" rx="3" fill="#27272a" />
        <circle cx="95" cy="178" r="6" fill="#fef08a" />

        {/* grille accent line along the hood slope */}
        <line x1="96" y1="168" x2="108" y2="225" stroke="#f4a5a5" strokeWidth="1.5" opacity="0.6" />
      </g>

      {/* wheels — steer axle, drive tandem, and trailer tandem; spin in place, stay grounded independent of the body bounce */}
      {[120, 205, 255, 470, 520].map((cx) => (
        <g key={cx} className="truck-wheel" style={{ transformOrigin: `${cx}px 230px` }}>
          <circle cx={cx} cy="230" r="24" fill="#18181b" />
          <circle cx={cx} cy="230" r="3.5" fill="#3f3f46" />
          {[0, 60, 120, 180, 240, 300].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x2 = cx + 9 * Math.cos(rad);
            const y2 = 230 + 9 * Math.sin(rad);
            return (
              <line
                key={angle}
                x1={cx}
                y1="230"
                x2={x2}
                y2={y2}
                stroke="#71717a"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={cx} cy="230" r="10" fill="none" stroke="#52525b" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}
