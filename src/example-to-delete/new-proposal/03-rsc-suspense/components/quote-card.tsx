"use client";

export default function QuoteCard({
  quote,
  author,
}: {
  quote: string;
  author: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-800/90 shadow-lg px-5 py-3 w-full max-w-md text-center border border-slate-700/80 backdrop-blur-sm flex flex-col justify-center h-[105px] min-h-[105px] max-h-[105px] overflow-hidden font-sans">
      <blockquote className="text-sm sm:text-[14px] font-medium text-slate-100 mb-1.5 italic leading-snug line-clamp-2 font-sans">
        “{quote}”
      </blockquote>
      <p className="text-[11px] text-cyan-400 font-semibold tracking-wide">— {author}</p>
    </div>
  );
}
