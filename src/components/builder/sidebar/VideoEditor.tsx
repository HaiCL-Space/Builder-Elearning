import type { BuilderElement } from "../types"
import { TextField } from "../fields"

interface VideoEditorProps {
  selectedElement: BuilderElement
  onUpdateData: (patch: Record<string, unknown>) => void
}

export function VideoEditor({
  selectedElement,
  onUpdateData,
}: VideoEditorProps) {
  return (
    <div className="space-y-3 border-t border-slate-100 pt-3.5">
      <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
        Cấu hình video
      </label>
      <TextField
        label="Địa chỉ URL Video (.mp4)"
        value={
          ((selectedElement.data as unknown as { src?: string })
            ?.src as string) || ""
        }
        onChange={(v) => onUpdateData({ src: v })}
      />
      <TextField
        label="Ảnh nền thu nhỏ (Poster URL)"
        value={
          ((selectedElement.data as unknown as { poster?: string })
            ?.poster as string) || ""
        }
        onChange={(v) => onUpdateData({ poster: v })}
      />
    </div>
  )
}
