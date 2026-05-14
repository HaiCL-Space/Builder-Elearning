import { parseColor, toRgbaString, rgbToHex } from "@/shared/lib/color"

// React import not required with the new JSX transform

export function NumberField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-medium text-slate-500">
        {label}
      </label>
      <input
        type="number"
        step="0.1"
        value={Number.isFinite(value) ? Number(value.toFixed(1)) : 0}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm transition outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}



export function ColorField({
  label,
  value,
  onChange,
  showAlpha = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  showAlpha?: boolean
}) {
  const { r, g, b, a } = parseColor(value)
  const hex = rgbToHex(r, g, b)

  return (
    <div className="flex flex-col gap-1 min-w-0">
      <label className="text-[11px] font-medium text-slate-500">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={hex}
          onChange={(e) => {
            const newRgb = parseColor(e.target.value)
            onChange(toRgbaString(newRgb.r, newRgb.g, newRgb.b, a))
          }}
          className="h-7 w-7 cursor-pointer rounded border border-slate-300 p-0.5 shrink-0"
        />
        <div className="flex-1 flex flex-col gap-0.5 min-w-0">
          {showAlpha ? (
            <>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={a}
                onChange={(e) => {
                  onChange(toRgbaString(r, g, b, parseFloat(e.target.value)))
                }}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span className="truncate">{value.length > 7 ? "RGBA" : value}</span>
                <span>{Math.round(a * 100)}%</span>
              </div>
            </>
          ) : (
            <span className="truncate text-xs text-slate-500 font-mono">{value}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export function TextField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-medium text-slate-500">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm transition outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}

export function TextArea({
  rows = 3,
  value,
  onChange,
}: {
  rows?: number
  value: string
  onChange: (v: string) => void
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm transition outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    />
  )
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-medium text-slate-500">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm transition outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
