import type { BuilderElement } from "@/pages/builder/model/types"
import { Plus, X } from "lucide-react"
import { TextField, NumberField } from "@/shared/ui/fields"

interface LabelImageZone {
  id: string
  xMin: number
  yMin: number
  xMax: number
  yMax: number
  correctLabelId: string
}

interface LabelImageLabel {
  id: string
  content: string
}

interface LabelImageEditorProps {
  selectedElement: BuilderElement
  onUpdateData: (patch: Record<string, unknown>) => void
  onUpdateStyle: (patch: Record<string, unknown>) => void
}

export function LabelImageEditor({
  selectedElement,
  onUpdateData,
  onUpdateStyle,
}: LabelImageEditorProps) {
  const labelImageData = (selectedElement.data || {}) as unknown as {
    imageUri?: string
    zones?: LabelImageZone[]
    labels?: LabelImageLabel[]
  }

  const imageUri = labelImageData.imageUri ?? ""
  const zones = labelImageData.zones ?? []
  const labels = labelImageData.labels ?? []

  return (
    <div className="space-y-4 border-t border-slate-100 pt-3.5">
      <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
        Cấu hình Dán Nhãn Ảnh (Label Image)
      </div>

      <TextField
        label="Địa chỉ hình nền (Image URL)"
        value={imageUri}
        onChange={(v) => onUpdateData({ imageUri: v })}
      />

      {/* Labels Manager */}
      <div className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/50 p-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Danh sách Nhãn ({labels.length})
          </label>
          <button
            type="button"
            onClick={() => {
              const labelId = `lbl-${Date.now().toString(16).slice(-4)}`
              const nextLabels = [
                ...labels,
                { id: labelId, content: `Nhãn mới` },
              ]
              onUpdateData({ labels: nextLabels })
            }}
            className="flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 hover:bg-blue-100"
          >
            <Plus className="h-3 w-3" /> Thêm nhãn
          </button>
        </div>

        {labels.length === 0 ? (
          <div className="py-2 text-center text-xs text-slate-400">
            Chưa có nhãn dán nào
          </div>
        ) : (
          <div className="max-h-36 space-y-2 overflow-y-auto">
            {labels.map((lbl) => {
              const updateLabelText = (txt: string) => {
                const nextLabels = labels.map((l) =>
                  l.id === lbl.id ? { ...l, content: txt } : l
                )
                onUpdateData({ labels: nextLabels })
              }

              const deleteLabel = () => {
                const nextLabels = labels.filter((l) => l.id !== lbl.id)
                // Remove reference in zones too
                const nextZones = zones.map((z) =>
                  z.correctLabelId === lbl.id ? { ...z, correctLabelId: "" } : z
                )
                onUpdateData({ labels: nextLabels, zones: nextZones })
              }

              return (
                <div key={lbl.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={lbl.content}
                    onChange={(e) => updateLabelText(e.target.value)}
                    className="flex-1 rounded border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={deleteLabel}
                    className="shrink-0 rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Zones Manager */}
      <div className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/50 p-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Vùng thả Nhãn ({zones.length})
          </label>
          <button
            type="button"
            onClick={() => {
              const zoneId = `zone-${Date.now().toString(16).slice(-4)}`
              const nextZones = [
                ...zones,
                {
                  id: zoneId,
                  xMin: 15,
                  yMin: 15,
                  xMax: 40,
                  yMax: 30,
                  correctLabelId: "",
                },
              ]
              onUpdateData({ zones: nextZones })
            }}
            className="flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 hover:bg-blue-100"
          >
            + Thêm Vùng
          </button>
        </div>

        {zones.length === 0 ? (
          <div className="py-2 text-center text-xs text-slate-400">
            Chưa vẽ vùng thả nhãn
          </div>
        ) : (
          <div className="max-h-[220px] space-y-3 overflow-y-auto pr-1">
            {zones.map((z) => {
              const updateZone = (zPatch: Partial<LabelImageZone>) => {
                const nextZones = zones.map((it) =>
                  it.id === z.id ? { ...it, ...zPatch } : it
                )
                onUpdateData({ zones: nextZones })
              }

              const deleteZone = () => {
                const nextZones = zones.filter((it) => it.id !== z.id)
                onUpdateData({ zones: nextZones })
              }

              return (
                <div
                  key={z.id}
                  className="relative space-y-2 rounded-lg border border-slate-200 bg-white p-2.5"
                >
                  {/* Zone Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-[10px] font-bold text-slate-500">
                      VÙNG ID: {z.id}
                    </span>
                    <button
                      type="button"
                      onClick={deleteZone}
                      className="rounded p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>

                  {/* ID & Correct Label Map */}
                  <div className="grid grid-cols-2 gap-2">
                    <TextField
                      label="Mã Vùng ID"
                      value={z.id}
                      onChange={(v) => updateZone({ id: v.trim() })}
                    />

                    <div className="space-y-1">
                      <label className="mb-1 block text-[9px] font-bold text-slate-400 uppercase">
                        Đáp án Nhãn đúng
                      </label>
                      <select
                        value={z.correctLabelId}
                        onChange={(e) =>
                          updateZone({ correctLabelId: e.target.value })
                        }
                        className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-blue-500"
                      >
                        <option value="">Chọn nhãn đúng...</option>
                        {labels.map((lbl) => (
                          <option key={lbl.id} value={lbl.id}>
                            {lbl.content}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Zone Rect coordinates */}
                  <div className="grid grid-cols-4 gap-1.5 border-t border-slate-100 pt-1.5">
                    <NumberField
                      label="xMin (%)"
                      value={z.xMin}
                      onChange={(v) => updateZone({ xMin: v })}
                    />
                    <NumberField
                      label="yMin (%)"
                      value={z.yMin}
                      onChange={(v) => updateZone({ yMin: v })}
                    />
                    <NumberField
                      label="xMax (%)"
                      value={z.xMax}
                      onChange={(v) => updateZone({ xMax: v })}
                    />
                    <NumberField
                      label="yMax (%)"
                      value={z.yMax}
                      onChange={(v) => updateZone({ yMax: v })}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Style settings */}
      <NumberField
        label="Bo góc viền (Radius)"
        value={Number(
          ((
            selectedElement.style as unknown as {
              borderRadius?: number | string
            }
          )?.borderRadius as number | string) ?? 16
        )}
        onChange={(v) => onUpdateStyle({ borderRadius: v })}
      />
    </div>
  )
}
