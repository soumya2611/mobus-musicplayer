import React from "react";

export default function BusGraphic({
  isPlaying,
  isHonking,
  busModel = "mobus",
  currentRoute,
  lang,
  quotes = [],
}) {
  // Dynamic route signboard text
  const fromCity =
    lang === "or"
      ? currentRoute?.orFrom
      : lang === "hi"
        ? currentRoute?.hiFrom
        : currentRoute?.enFrom;
  const toCity =
    lang === "or"
      ? currentRoute?.orTo
      : lang === "hi"
        ? currentRoute?.hiTo
        : currentRoute?.enTo;
  const routeText = `🚌 Mo Bus ★ ${fromCity} ➔ ${toCity} ★ HORN OK PLEASE`;

  const currentQuote = quotes[0] || "ମୋ ବସ୍ 🚌 — ସୁରକ୍ଷିତ ଯାତ୍ରା";

  // Palette definitions for 3 distinct bus models
  const themes = {
    mobus: {
      bodyGradStart: "#1e3a8a",
      bodyGradMid: "#2563eb",
      bodyGradEnd: "#1d4ed8",
      roofGradStart: "#86efac",
      roofGradEnd: "#16a34a",
      stripe: "#22c55e",
      stroke: "#1e3a8a",
      doorBadge: "#22c55e",
      quoteBorder: "#22c55e",
      quoteText: "#86efac",
    },
    classic: {
      bodyGradStart: "#7f1d1d",
      bodyGradMid: "#dc2626",
      bodyGradEnd: "#b91c1c",
      roofGradStart: "#fef08a",
      roofGradEnd: "#f59e0b",
      stripe: "#f59e0b",
      stroke: "#7f1d1d",
      doorBadge: "#f59e0b",
      quoteBorder: "#f59e0b",
      quoteText: "#fbbf24",
    },
    deluxe: {
      bodyGradStart: "#0891b2",
      bodyGradMid: "#06b6d4",
      bodyGradEnd: "#0e7490",
      roofGradStart: "#fdba74",
      roofGradEnd: "#f97316",
      stripe: "#f97316",
      stroke: "#0e7490",
      doorBadge: "#f97316",
      quoteBorder: "#f97316",
      quoteText: "#fdba74",
    },
  };

  const theme = themes[busModel] || themes.mobus;

  return (
    <div className="relative w-full max-w-4xl mx-auto flex justify-center items-end select-none pointer-events-none font-odia">
      {/* Headlight beam shining on asphalt */}
      <div
        className={`absolute bottom-6 right-[-140px] sm:right-[-320px] w-[260px] sm:w-[480px] h-[70px] sm:h-[100px] headlight-beam opacity-90 transition-opacity duration-300 ${isPlaying ? "opacity-90" : "opacity-60"}`}
      />

      {/* Bus Body Container */}
      <div
        className={`relative w-[270px] sm:w-[420px] md:w-[580px] transition-all duration-300 ${isPlaying ? "animate-bus-bounce" : "animate-bus-stopped"} ${isHonking ? "scale-105" : "scale-100"}`}
      >
        {/* Rear Exhaust Smoke Puffs */}
        {isPlaying && (
          <div className="absolute bottom-6 left-2 z-0">
            <div
              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-slate-400/40 blur-sm animate-exhaust"
              style={{ animationDelay: "0s" }}
            />
            <div
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-300/30 blur-sm animate-exhaust"
              style={{ animationDelay: "0.3s" }}
            />
            <div
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-200/20 blur-sm animate-exhaust"
              style={{ animationDelay: "0.6s" }}
            />
          </div>
        )}

        {/* BUS SVG ARTWORK */}
        <svg
          viewBox="0 0 700 320"
          className="w-full h-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Dynamic Bus Paint Gradient */}
            <linearGradient id="busBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={theme.bodyGradStart} />
              <stop offset="50%" stopColor={theme.bodyGradMid} />
              <stop offset="100%" stopColor={theme.bodyGradEnd} />
            </linearGradient>

            <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={theme.roofGradStart} />
              <stop offset="100%" stopColor={theme.roofGradEnd} />
            </linearGradient>

            <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>

          {/* Roof Luggage Carrier */}
          <g>
            <rect
              x="120"
              y="38"
              width="380"
              height="18"
              fill="url(#chromeGrad)"
              rx="3"
            />
            <rect x="125" y="42" width="370" height="4" fill="#1e293b" />

            {/* Luggage Bags & Tarpaulin Sheet */}
            <rect x="140" y="16" width="60" height="24" fill="#3b82f6" rx="4" />
            <rect x="210" y="12" width="80" height="28" fill="#16a34a" rx="5" />
            <rect x="300" y="14" width="90" height="26" fill="#eab308" rx="4" />
            <rect x="400" y="18" width="70" height="22" fill="#7c3aed" rx="4" />

            {/* Ropes tying luggage */}
            <line
              x1="170"
              y1="16"
              x2="170"
              y2="40"
              stroke="#fef08a"
              strokeWidth="2.5"
            />
            <line
              x1="250"
              y1="12"
              x2="250"
              y2="40"
              stroke="#fef08a"
              strokeWidth="2.5"
            />
            <line
              x1="345"
              y1="14"
              x2="345"
              y2="40"
              stroke="#fef08a"
              strokeWidth="2.5"
            />
            <line
              x1="435"
              y1="18"
              x2="435"
              y2="40"
              stroke="#fef08a"
              strokeWidth="2.5"
            />
          </g>

          {/* Main Bus Shell */}
          <path
            d="M 60,110 
               C 60,85 80,54 110,54 
               L 560,54 
               C 620,54 650,80 655,120 
               L 660,225 
               C 660,240 645,245 620,245 
               L 60,245 
               Z"
            fill="url(#busBodyGrad)"
            stroke={theme.stroke}
            strokeWidth="3"
          />

          {/* Roof Band */}
          <path
            d="M 60,100 C 60,80 80,54 110,54 L 560,54 C 610,54 640,75 650,100 Z"
            fill="url(#roofGrad)"
          />

          {/* Middle Body Stripe */}
          <rect x="60" y="152" width="595" height="22" fill={theme.stripe} />

          {/* Side Windows with Passengers */}
          <g>
            {/* Front Driver Windshield */}
            <path
              d="M 540,68 L 625,68 C 640,82 645,100 645,140 L 540,140 Z"
              fill="url(#glassGrad)"
              stroke="#0f172a"
              strokeWidth="3"
            />
            {/* Driver Silhouette */}
            <circle cx="585" cy="110" r="11" fill="#020617" />
            <path
              d="M 570,135 Q 585,120 600,135"
              stroke="#020617"
              strokeWidth="6"
              fill="none"
            />
            {/* Steering wheel */}
            {/* <circle
              cx="612"
              cy="118"
              r="14"
              stroke="#e2e8f0"
              strokeWidth="3"
              fill="none"
            /> */}

            {/* Passenger Windows */}
            {Array.from({ length: 6 }).map((_, i) => {
              const xPos = 120 + i * 66;
              return (
                <g key={i}>
                  <rect
                    x={xPos}
                    y="68"
                    width="54"
                    height="72"
                    fill="url(#glassGrad)"
                    rx="8"
                    stroke="#0f172a"
                    strokeWidth="3"
                  />
                  {/* Passenger silhouette inside */}
                  {i % 2 === 0 ? (
                    <g opacity="0.8">
                      <circle cx={xPos + 27} cy="104" r="10" fill="#0f172a" />
                      <path
                        d={`M ${xPos + 12},135 Q ${xPos + 27},120 ${xPos + 42},135`}
                        fill="#0f172a"
                      />
                    </g>
                  ) : (
                    <g opacity="0.6">
                      <circle cx={xPos + 20} cy="106" r="9" fill="#1e293b" />
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Passenger Door */}
          <rect
            x="475"
            y="148"
            width="50"
            height="92"
            fill="#1e293b"
            rx="4"
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <line
            x1="500"
            y1="148"
            x2="500"
            y2="240"
            stroke="#475569"
            strokeWidth="2"
          />
          <circle cx="490" cy="195" r="3" fill={theme.doorBadge} />

          {/* Bumper Quotes & Stickers */}
          <g>
            {/* Side Quote Badge */}
            {/* <rect x="150" y="180" width="280" height="34" fill="#0f172a" rx="6" stroke={theme.quoteBorder} strokeWidth="2" />
            <text
              x="290"
              y="203"
              fill={theme.quoteText}
              fontSize="15"
              fontWeight="bold"
              fontFamily="Noto Sans Oriya, Rozha One, sans-serif"
              textAnchor="middle"
            >
              {currentQuote}
            </text> */}
          </g>

          {/* Headlights & Tail Lights */}
          <g>
            <circle
              cx="654"
              cy="195"
              r="12"
              fill="#fef08a"
              className={isPlaying ? "animate-pulse" : ""}
            />
            <circle cx="654" cy="195" r="16" fill="#fde047" opacity="0.5" />
            <circle cx="654" cy="220" r="10" fill="#fef08a" />

            <rect
              x="58"
              y="180"
              width="8"
              height="35"
              fill="#ef4444"
              rx="3"
              className="animate-pulse"
            />
            <rect
              x="54"
              y="175"
              width="12"
              height="45"
              fill="#dc2626"
              opacity="0.3"
              rx="4"
            />
          </g>

          {/* Chrome Front & Rear Bumpers */}
          <rect
            x="648"
            y="228"
            width="18"
            height="20"
            fill="url(#chromeGrad)"
            rx="3"
          />
          <rect
            x="50"
            y="232"
            width="18"
            height="16"
            fill="url(#chromeGrad)"
            rx="3"
          />

          {/* WHEELS */}
          <g transform="translate(195, 245)">
            <circle
              cx="0"
              cy="0"
              r="40"
              fill="#1e293b"
              stroke="#0f172a"
              strokeWidth="6"
            />
            <circle cx="0" cy="0" r="28" fill="url(#chromeGrad)" />
            <g className={isPlaying ? "animate-spin-fast" : ""}>
              <circle cx="0" cy="0" r="14" fill="#0f172a" />
              <line
                x1="-24"
                y1="0"
                x2="24"
                y2="0"
                stroke="#e2e8f0"
                strokeWidth="5"
              />
              <line
                x1="0"
                y1="-24"
                x2="0"
                y2="24"
                stroke="#e2e8f0"
                strokeWidth="5"
              />
              <circle cx="0" cy="0" r="7" fill={theme.stripe} />
            </g>
          </g>

          <g transform="translate(565, 245)">
            <circle
              cx="0"
              cy="0"
              r="40"
              fill="#1e293b"
              stroke="#0f172a"
              strokeWidth="6"
            />
            <circle cx="0" cy="0" r="28" fill="url(#chromeGrad)" />
            <g className={isPlaying ? "animate-spin-fast" : ""}>
              <circle cx="0" cy="0" r="14" fill="#0f172a" />
              <line
                x1="-24"
                y1="0"
                x2="24"
                y2="0"
                stroke="#e2e8f0"
                strokeWidth="5"
              />
              <line
                x1="0"
                y1="-24"
                x2="0"
                y2="24"
                stroke="#e2e8f0"
                strokeWidth="5"
              />
              <circle cx="0" cy="0" r="7" fill={theme.stripe} />
            </g>
          </g>
        </svg>

        {/* Bus Route Signboard Header on Roof */}
        <div className="absolute top-[45%] left-[12%] right-[38%] px-2 py-0.5 text-center  z-20 overflow-hidden">
          <div className="text-[9px] sm:text-xs font-odia text-black font-bold whitespace-nowrap animate-marquee">
            {routeText}
          </div>
        </div>
      </div>
    </div>
  );
}
