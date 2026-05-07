import { SlidersHorizontal, Trash2 } from "lucide-react"
import type { BuilderElement } from "./types"
import {
  NumberField,
  ColorField,
  TextField,
  TextArea,
  SelectField,
} from "./fields"

type HotspotZone = {
  id: string
  xMin: number
  yMin: number
  xMax: number
  yMax: number
  label?: string
}

export function RightSidebar({
  selectedElement,
  onUpdatePosition,
  onUpdateStyle,
  onUpdateData,
  onDeleteSelected,
}: {
  selectedElement: BuilderElement | null
  onUpdatePosition: (patch: Partial<BuilderElement["position"]>) => void
  onUpdateStyle: (patch: Record<string, unknown>) => void
  onUpdateData: (patch: Record<string, unknown>) => void
  onDeleteSelected: () => void
}) {
  return (
    <aside className="flex w-72 flex-shrink-0 flex-col border-l border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
        <SlidersHorizontal className="h-4 w-4 text-slate-500" />
        <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
          Thuộc tính
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedElement ? (
          <div className="space-y-5 p-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Loại
              </label>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                {selectedElement.type}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                Vị trí & Kích thước
              </label>
              <div className="grid grid-cols-2 gap-2">
                <NumberField
                  label="X (%)"
                  value={selectedElement.position.x}
                  onChange={(v) => onUpdatePosition({ x: v })}
                />
                <NumberField
                  label="Y (%)"
                  value={selectedElement.position.y}
                  onChange={(v) => onUpdatePosition({ y: v })}
                />
                <NumberField
                  label="Rộng (%)"
                  value={selectedElement.position.w}
                  onChange={(v) => onUpdatePosition({ w: v })}
                />
                <NumberField
                  label="Cao (%)"
                  value={selectedElement.position.h}
                  onChange={(v) => onUpdatePosition({ h: v })}
                />
              </div>
            </div>

            {selectedElement.type === "TEXT" && (
              <div className="space-y-3">
                <label className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Nội dung
                </label>
                <TextArea
                  rows={3}
                  value={
                    ((selectedElement.data as unknown as { content?: string })
                      ?.content as string) || ""
                  }
                  onChange={(v) => onUpdateData({ content: v })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <NumberField
                    label="Cỡ chữ (px)"
                    value={Number(
                      ((
                        selectedElement.style as unknown as {
                          fontSize?: number | string
                        }
                      )?.fontSize as number | string) ?? 16
                    )}
                    onChange={(v) => onUpdateStyle({ fontSize: v })}
                  />
                  <ColorField
                    label="Màu chữ"
                    value={
                      ((selectedElement.style as unknown as { color?: string })
                        ?.color as string) || "#333333"
                    }
                    onChange={(v) => onUpdateStyle({ color: v })}
                  />
                  <ColorField
                    label="Màu nền"
                    value={
                      ((
                        selectedElement.style as unknown as {
                          backgroundColor?: string
                        }
                      )?.backgroundColor as string) || "#ffffff"
                    }
                    onChange={(v) => onUpdateStyle({ backgroundColor: v })}
                  />
                  <NumberField
                    label="Border radius"
                    value={Number(
                      ((
                        selectedElement.style as unknown as {
                          borderRadius?: number | string
                        }
                      )?.borderRadius as number | string) ?? 0
                    )}
                    onChange={(v) => onUpdateStyle({ borderRadius: v })}
                  />
                </div>
                <SelectField
                  label="Căn lề"
                  value={
                    ((
                      selectedElement.style as unknown as {
                        textAlign?: string
                      }
                    )?.textAlign as string) || "left"
                  }
                  options={[
                    { value: "left", label: "Trái" },
                    { value: "center", label: "Giữa" },
                    { value: "right", label: "Phải" },
                    { value: "justify", label: "Đều" },
                  ]}
                  onChange={(v) => onUpdateStyle({ textAlign: v })}
                />
              </div>
            )}

            {selectedElement.type === "VIDEO" && (
              <div className="space-y-3">
                <label className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Nguồn
                </label>
                <TextField
                  label="URL Video"
                  value={
                    ((selectedElement.data as unknown as { src?: string })
                      ?.src as string) || ""
                  }
                  onChange={(v) => onUpdateData({ src: v })}
                />
                <TextField
                  label="Poster URL"
                  value={
                    ((selectedElement.data as unknown as { poster?: string })
                      ?.poster as string) || ""
                  }
                  onChange={(v) => onUpdateData({ poster: v })}
                />
              </div>
            )}

            {selectedElement.type === "QUIZ" && (
              <div className="space-y-3">
                <label className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Câu hỏi
                </label>
                <TextArea
                  value={
                    ((selectedElement.data as unknown as { question?: string })
                      ?.question as string) || ""
                  }
                  onChange={(v) => onUpdateData({ question: v })}
                />
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
            )}

            {selectedElement.type === "HOTSPOT" && (
              <div className="space-y-3">
                <label className="text-xs font-bold tracking-wider text-slate-400 uppercase">
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
                    <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      Zones
                    </div>
                    <button
                      type="button"
                      className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                      onClick={() => {
                        const prev =
                          ((
                            selectedElement.data as unknown as {
                              zones?: HotspotZone[]
                            }
                          )?.zones as HotspotZone[]) || []
                        const next: HotspotZone = {
                          id: `zone-${Math.random().toString(16).slice(2, 8)}`,
                          xMin: 10,
                          yMin: 10,
                          xMax: 30,
                          yMax: 30,
                          label: "",
                        }
                        onUpdateData({ zones: [...prev, next] })
                      }}
                    >
                      + Thêm zone
                    </button>
                  </div>

                  {(
                    ((
                      selectedElement.data as unknown as {
                        zones?: HotspotZone[]
                      }
                    )?.zones as HotspotZone[]) || []
                  ).length === 0 ? (
                    <div className="text-xs text-slate-400">Chưa có zone</div>
                  ) : (
                    <div className="space-y-3">
                      {(
                        ((
                          selectedElement.data as unknown as {
                            zones?: HotspotZone[]
                          }
                        )?.zones as HotspotZone[]) || []
                      ).map((z, idx) => {
                        const zones =
                          ((
                            selectedElement.data as unknown as {
                              zones?: HotspotZone[]
                            }
                          )?.zones as HotspotZone[]) || []
                        const correctZoneId =
                          ((
                            selectedElement.data as unknown as {
                              correctZoneId?: string
                            }
                          )?.correctZoneId as string) || ""

                        const updateZone = (patch: Partial<HotspotZone>) => {
                          const nextZones = zones.map((it) =>
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
                                <div className="truncate text-xs font-medium text-slate-700">
                                  {z.id}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  #{idx + 1}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className={`rounded-md px-2 py-1 text-[11px] font-medium ${
                                    correctZoneId === z.id
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                  }`}
                                  onClick={() =>
                                    onUpdateData({ correctZoneId: z.id })
                                  }
                                  title="Đặt làm đáp án đúng"
                                >
                                  Đúng
                                </button>
                                <button
                                  type="button"
                                  className="rounded-md bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-100"
                                  onClick={() => {
                                    const nextZones = zones.filter(
                                      (it) => it.id !== z.id
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
                                  Xóa
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <TextField
                                label="Label"
                                value={(z.label || "") as string}
                                onChange={(v) => updateZone({ label: v })}
                              />
                              <TextField
                                label="ID"
                                value={z.id}
                                onChange={(v) => updateZone({ id: v })}
                              />
                              <NumberField
                                label="xMin (%)"
                                value={Number(z.xMin) || 0}
                                onChange={(v) => updateZone({ xMin: v })}
                              />
                              <NumberField
                                label="yMin (%)"
                                value={Number(z.yMin) || 0}
                                onChange={(v) => updateZone({ yMin: v })}
                              />
                              <NumberField
                                label="xMax (%)"
                                value={Number(z.xMax) || 0}
                                onChange={(v) => updateZone({ xMax: v })}
                              />
                              <NumberField
                                label="yMax (%)"
                                value={Number(z.yMax) || 0}
                                onChange={(v) => updateZone({ yMax: v })}
                              />
                            </div>
                          </div>
                        )
                      })}

                      <TextField
                        label="correctZoneId"
                        value={
                          ((
                            selectedElement.data as unknown as {
                              correctZoneId?: string
                            }
                          )?.correctZoneId as string) || ""
                        }
                        onChange={(v) => onUpdateData({ correctZoneId: v })}
                      />
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
            )}

            <div className="space-y-3">
              <label className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Hiển thị
              </label>
              <div className="flex items-center gap-3">
                <label className="text-xs text-slate-600">Độ mờ</label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={
                    parseFloat(
                      ((
                        selectedElement.style as unknown as {
                          opacity?: number | string
                        }
                      )?.opacity as string) ?? "1"
                    ) || 1
                  }
                  onChange={(e) =>
                    onUpdateStyle({
                      opacity: parseFloat(e.target.value),
                    })
                  }
                  className="flex-1 accent-blue-500"
                />
                <span className="w-10 text-right text-xs text-slate-600 tabular-nums">
                  {(
                    parseFloat(
                      (
                        selectedElement.style as unknown as {
                          opacity?: number | string
                        }
                      )?.opacity as string
                    ) ?? 1
                  ).toFixed(2)}
                </span>
              </div>
              <NumberField
                label="Z-Index"
                value={Number(
                  ((
                    selectedElement.style as unknown as {
                      zIndex?: number | string
                    }
                  )?.zIndex as number | string) ?? 0
                )}
                onChange={(v) => onUpdateStyle({ zIndex: v })}
              />
            </div>

            <button
              onClick={onDeleteSelected}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" /> Xóa thành phần
            </button>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center px-6 text-center text-sm text-slate-400">
            Chọn một thành phần trên canvas để chỉnh sửa thuộc tính
          </div>
        )}
      </div>
    </aside>
  )
}
