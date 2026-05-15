import { type VideoData } from "@broker/core-sdk"
import type { BuilderElement } from "@/pages/builder/model/types"
import { TextField } from "@/shared/ui/fields"

interface VideoEditorProps {
  selectedElement: BuilderElement
  onUpdateData: (patch: Partial<VideoData>) => void
}

export function VideoEditor({
  selectedElement,
  onUpdateData,
}: VideoEditorProps) {
  if (selectedElement.type !== "VIDEO") return null

  const data = selectedElement.data as VideoData

  return (
    <div className="space-y-3 border-t border-slate-100 pt-3.5">
      <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
        Cấu hình video / Livestream
      </label>
      <TextField
        label="Địa chỉ URL (Hỗ trợ .mp4, YouTube)"
        value={data.src || ""}
        onChange={(v) => onUpdateData({ src: v })}
      />
      <TextField
        label="Ảnh nền thu nhỏ (Poster URL)"
        value={data.poster || ""}
        onChange={(v) => onUpdateData({ poster: v })}
      />
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={!!data.isLive} 
            onChange={(e) => onUpdateData({ isLive: e.target.checked })}
            className="rounded border-slate-300 text-red-600 focus:ring-red-500 h-3.5 w-3.5 transition"
          />
          <span className="text-[11px] font-bold text-red-600 group-hover:text-red-700 transition">Chế độ Trực tiếp</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={!!data.autoPlay} 
            onChange={(e) => onUpdateData({ autoPlay: e.target.checked })}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 transition"
          />
          <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900 transition">Tự động phát</span>
        </label>
        
        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={!!data.muted} 
            onChange={(e) => onUpdateData({ muted: e.target.checked })}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 transition"
          />
          <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900 transition">Tắt tiếng</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={!!data.loop} 
            onChange={(e) => onUpdateData({ loop: e.target.checked })}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 transition"
          />
          <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900 transition">Lặp lại</span>
        </label>
      </div>

      <div className="mt-2 rounded-md bg-amber-50 p-2.5 text-[10px] text-amber-700 border border-amber-100 leading-relaxed">
        <p className="font-bold mb-1">💡 Mẹo phát trực tiếp:</p>
        <ul className="list-disc ml-3 space-y-1">
          <li>Dán link YouTube Live để phát trực tiếp từ YouTube.</li>
          <li>Sử dụng link .m3u8 (HLS) cho các luồng livestream trực tiếp.</li>
          <li>Bật "Chế độ Trực tiếp" để hiển thị nhãn LIVE trên video.</li>
        </ul>
      </div>
    </div>
  )
}
