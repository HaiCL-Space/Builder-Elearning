import type { BuilderElement } from "../types"
import { X } from "lucide-react"
import { TextField, NumberField } from "../fields"

interface HotspotZone {
  id: string
  xMin: number
  yMin: number
  xMax: number
  yMax: number
  label?: string
}

interface HotspotEditorProps {
  selectedElement: BuilderElement
  onUpdateData: (patch: Record<string, unknown>) => void
  onUpdateStyle: (patch: Record<string, unknown>) => void
}

export function HotspotEditor({
  selectedElement,
  onUpdateData,
  onUpdateStyle,
}: HotspotEditorProps) {
  const hotspotData = (selectedElement.data || {}) as unknown as {
    zones?: HotspotZone[]
    correctZoneId?: string
  }
  const zones = hotspotData.zones || []
  const correctZoneId = hotspotData.correctZoneId || ""

  return (
    <div className="space-y-3 border-t border-slate-100 pt-3.5">
      <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
        Hotspot
      </label>

      <TextField
        label="Image URL"
        value={
          ((selectedElement.data as unknown as { imageUri?: string })
            ?.imageUri as string) || ""
        }
        onChange={(v) => onUpdateData({ imageUri: v })}
      />

      <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Zones ({zones.length})
          </div>
          <button
            type="button"
            className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 hover:bg-blue-100"
            onClick={() => {
              const prev = zones
              const next: HotspotZone = {
                id: `zone-${Math.random().toString(16).slice(2, 8)}`,
                xMin: 15,
                yMin: 15,
                xMax: 40,
                yMax: 40,
                label: "Vùng mới",
              }
              onUpdateData({ zones: [...prev, next] })
            }}
          >
            + Thêm zone
          </button>
        </div>

        {zones.length === 0 ? (
          <div className="text-xs text-slate-400 text-center py-2">Chưa có zone</div>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {zones.map((z: HotspotZone) => {
              const updateZone = (patch: Partial<HotspotZone>) => {
                const nextZones = zones.map((it: HotspotZone) =>
                  it.id === z.id ? { ...it, ...patch } : it
                )
                onUpdateData({ zones: nextZones })
              }

              return (
                <div
                  key={z.id}
                  className="rounded-md border border-slate-200 bg-white p-2"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold text-slate-700">
                        {z.label || z.id}
                      </div>
                      <div className="text-[9px] text-slate-400">
                        ID: {z.id}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          correctZoneId === z.id
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                        onClick={() =>
                          onUpdateData({ correctZoneId: z.id })
                        }
                      >
                        Đúng
                      </button>
                      <button
                        type="button"
                        className="rounded bg-red-50 p-1 text-red-600 hover:bg-red-100"
                        onClick={() => {
                          const nextZones = zones.filter(
                            (it: HotspotZone) => it.id !== z.id
                          )
                          const nextCorrect =
                            correctZoneId === z.id
                              ? ""
                              : correctZoneId
                          onUpdateData({
                            zones: nextZones,
                            correctZoneId: nextCorrect,
                          })
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 border-t border-slate-100 pt-2 mt-1">
                    <TextField
                      label="Tên hiển thị"
                      value={(z.label || "") as string}
                      onChange={(v) => updateZone({ label: v })}
                    />
                    <TextField
                      label="Mã ID"
                      value={z.id}
                      onChange={(v) => updateZone({ id: v })}
                    />
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

      <NumberField
        label="Border radius"
        value={Number(
          ((
            selectedElement.style as unknown as {
              borderRadius?: number | string
            }
          )?.borderRadius as number | string) ?? 8
        )}
        onChange={(v) => onUpdateStyle({ borderRadius: v })}
      />
    </div>
  )
}
