import React, { useState, useEffect } from 'react';
import { translations } from '../data/translations';

export default function BusQuotesTicker({ lang }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const t = translations[lang] || translations.or;
  const quotesList = t.quotes || [];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setQuoteIndex(prev => (prev + 1) % quotesList.length);
        setFade(true);
      }, 300);
    }, 6000);
    return () => clearInterval(interval);
  }, [quotesList.length]);

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none max-w-lg w-full px-4 text-center font-odia">
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/70 border border-amber-500/30 text-amber-200 font-bold text-xs sm:text-sm shadow-2xl backdrop-blur-md transition-opacity duration-300 ${fade ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        {/* <span className="text-amber-400"></span> */}
        <span>{quotesList[quoteIndex] || quotesList[0]}</span>
        {/* <span className="text-amber-400"></span> */}
      </div>
    </div>
  );
}
