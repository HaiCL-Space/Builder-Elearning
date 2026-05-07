export function ElementTypeBadge({ type }: { type: string }) {
  return (
    <div className="pointer-events-none absolute top-0 left-1 text-[9px] font-bold tracking-wider text-slate-400 uppercase opacity-60">
      {type}
    </div>
  )
}
