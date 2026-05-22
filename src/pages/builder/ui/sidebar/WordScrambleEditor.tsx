import type { BuilderElement } from "@/pages/builder/model/types"
import { Sparkles } from "lucide-react"
import { NumberField } from "@/shared/ui/fields"

interface WordScrambleEditorProps {
  selectedElement: BuilderElement
  onUpdateData: (patch: Record<string, unknown>) => void
  onUpdateStyle: (patch: Record<string, unknown>) => void
}

export function WordScrambleEditor({
  selectedElement,
  onUpdateData,
  onUpdateStyle,
}: WordScrambleEditorProps) {
  const scrambleData = (selectedElement.data || {}) as unknown as {
    correctWord?: string
    scrambledWord?: string
    caseSensitive?: boolean
  }
  const correctWord = scrambleData.correctWord || ""
  const scrambledWord = scrambleData.scrambledWord || ""
  const caseSensitive = scrambleData.caseSensitive ?? false

  const handleAutoScramble = () => {
    const trimmedWord = correctWord.trim()
    if (!trimmedWord) return

    const chars = trimmedWord.split("")
    // Fisher-Yates shuffle
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]]
    }

    let scrambled = chars.join("")
    // Ensure it is actually scrambled if length > 1
    if (scrambled === trimmedWord && trimmedWord.length > 1) {
      scrambled = trimmedWord.slice(1) + trimmedWord[0]
    }

    onUpdateData({ scrambledWord: scrambled })
  }

  return (
    <div className="space-y-4 border-t border-slate-100 pt-3.5">
      {/* Correct Word Input */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Từ Đúng (Lời giải)
        </label>
        <input
          type="text"
          value={correctWord}
          onChange={(e) => onUpdateData({ correctWord: e.target.value })}
          placeholder="Ví dụ: LONDON"
          className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-blue-500"
        />
      </div>

      {/* Scrambled Word Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Từ Xáo trộn (Đố chữ)
          </label>
          <button
            type="button"
            onClick={handleAutoScramble}
            disabled={!correctWord.trim()}
            className="flex items-center gap-1 rounded bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-600 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="Đảo ngẫu nhiên các chữ cái từ Lời giải"
          >
            <Sparkles className="h-3 w-3" /> Tự động đảo chữ
          </button>
        </div>
        <input
          type="text"
          value={scrambledWord}
          onChange={(e) => onUpdateData({ scrambledWord: e.target.value })}
          placeholder="Ví dụ: NLOODN"
          className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-blue-500"
        />
      </div>

      {/* Case Sensitive Toggle */}
      <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
        <input
          type="checkbox"
          id="ws-case-sensitive"
          checked={caseSensitive}
          onChange={(e) => onUpdateData({ caseSensitive: e.target.checked })}
          className="h-3.5 w-3.5 accent-blue-500 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
        />
        <label
          htmlFor="ws-case-sensitive"
          className="text-xs font-semibold text-slate-600 select-none cursor-pointer"
        >
          Phân biệt chữ hoa / thường
        </label>
      </div>

      {/* Border Radius Style */}
      <NumberField
        label="Border radius"
        value={Number(
          ((
            selectedElement.style as unknown as {
              borderRadius?: number | string
            }
          )?.borderRadius as number | string) ?? 12
        )}
        onChange={(v) => onUpdateStyle({ borderRadius: v })}
      />
    </div>
  )
}
