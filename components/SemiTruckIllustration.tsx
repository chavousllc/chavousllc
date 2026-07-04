export function SemiTruckIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 300"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {/* speed lines */}
      <g stroke="#ef4444" strokeWidth="4" strokeLinecap="round" opacity="0.55">
        <line x1="0" y1="90" x2="90" y2="90" />
        <line x1="20" y1="115" x2="130" y2="115" />
        <line x1="0" y1="140" x2="70" y2="140" />
      </g>
      <g stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.18">
        <line x1="40" y1="70" x2="110" y2="70" />
        <line x1="0" y1="165" x2="60" y2="165" />
      </g>

      {/* ground line */}
      <line x1="60" y1="248" x2="560" y2="248" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="2" />

      {/* trailer */}
      <rect x="255" y="95" width="230" height="130" rx="8" fill="#f4f4f5" />
      <rect x="255" y="95" width="230" height="130" rx="8" stroke="#d4d4d8" strokeWidth="2" />
      <rect x="272" y="150" width="196" height="10" rx="3" fill="#ef4444" />
      <text
        x="370"
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

      {/* exhaust stack, anchored to the back of the cab roofline */}
      <rect x="243" y="58" width="10" height="74" rx="3" fill="#71717a" />
      <rect x="241" y="54" width="14" height="8" rx="2" fill="#52525b" />

      {/* cab */}
      <path d="M150 130 H255 V225 H150 Z" fill="#dc2626" />
      <path
        d="M150 130 C150 130 168 96 205 96 H225 C238 96 248 106 248 119 V130 Z"
        fill="#dc2626"
      />
      {/* windshield */}
      <path
        d="M188 108 C202 101 214 100 224 100 C232 100 238 105 239 113 L240 128 H188 Z"
        fill="#bfe3f7"
        opacity="0.9"
      />
      {/* door line + handle */}
      <line x1="205" y1="130" x2="205" y2="200" stroke="#991b1b" strokeWidth="2" />
      <rect x="212" y="160" width="14" height="4" rx="2" fill="#fecaca" />
      {/* fuel tank, tucked along the lower cab body */}
      <rect x="168" y="197" width="52" height="20" rx="10" fill="#a1a1aa" />
      <circle cx="168" cy="207" r="10" fill="#71717a" />
      {/* front bumper + headlight */}
      <rect x="141" y="195" width="11" height="30" rx="3" fill="#27272a" />
      <circle cx="146.5" cy="177" r="7" fill="#fef08a" />

      {/* wheels */}
      {[178, 300, 360, 430].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="230" r="24" fill="#18181b" />
          <circle cx={cx} cy="230" r="10" fill="#71717a" />
        </g>
      ))}
    </svg>
  );
}
