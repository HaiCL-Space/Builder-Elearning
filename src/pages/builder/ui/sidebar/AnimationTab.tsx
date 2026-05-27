import type { BuilderElement } from "@/pages/builder/model/types"
import { Sparkles, Play } from "lucide-react"
import { SelectField, NumberField } from "@/shared/ui/fields"
import { useBuilderStore } from "@/pages/builder/model/use-builder-store"

interface AnimationTabProps {
  selectedElement: BuilderElement
  onUpdateAnimations?: (patch: {
    enterAnimation?: BuilderElement["enterAnimation"]
    exitAnimation?: BuilderElement["exitAnimation"]
  }) => void
}

export function AnimationTab({
  selectedElement,
  onUpdateAnimations,
}: AnimationTabProps) {
  return (
    <div className="space-y-4">
      {/* ENTER ANIMATION */}
      <div className="rounded-lg border border-slate-200/80 bg-slate-50 p-3">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-blue-600">
          <Sparkles className="h-4 w-4" />
          <span>HIỆU ỨNG VÀO (ENTER)</span>
        </div>

        <div className="space-y-3">
          <SelectField
            label="Kiểu hiệu ứng"
            value={selectedElement.enterAnimation?.type || "none"}
            options={[
              { value: "none", label: "Không có" },
              { value: "fade-in", label: "Fade In (Mờ dần)" },
              { value: "slide-up", label: "Slide Up (Bay từ dưới)" },
              { value: "zoom-in", label: "Zoom In (Phóng to)" },
              { value: "bounce", label: "Bounce (Đẩy nảy)" },
            ]}
            onChange={(val) => {
              if (val === "none") {
                onUpdateAnimations?.({ enterAnimation: undefined })
              } else {
                onUpdateAnimations?.({
                  enterAnimation: {
                    type: val as NonNullable<
                      BuilderElement["enterAnimation"]
                    >["type"],
                    duration: selectedElement.enterAnimation?.duration || 500,
                    delay: selectedElement.enterAnimation?.delay || 0,
                  },
                })
              }
            }}
          />

          {selectedElement.enterAnimation && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <NumberField
                label="Thời gian (ms)"
                value={selectedElement.enterAnimation.duration}
                onChange={(val) => {
                  onUpdateAnimations?.({
                    enterAnimation: {
                      ...selectedElement.enterAnimation,
                      duration: val,
                    } as BuilderElement["enterAnimation"],
                  })
                }}
              />
              <NumberField
                label="Độ trễ (ms)"
                value={selectedElement.enterAnimation.delay}
                onChange={(val) => {
                  onUpdateAnimations?.({
                    enterAnimation: {
                      ...selectedElement.enterAnimation,
                      delay: val,
                    } as BuilderElement["enterAnimation"],
                  })
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* EXIT ANIMATION */}
      <div className="rounded-lg border border-slate-200/80 bg-slate-50 p-3">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-pink-600">
          <Sparkles className="h-4 w-4" />
          <span>HIỆU ỨNG RA (EXIT)</span>
        </div>

        <div className="space-y-3">
          <SelectField
            label="Kiểu hiệu ứng"
            value={selectedElement.exitAnimation?.type || "none"}
            options={[
              { value: "none", label: "Không có" },
              { value: "fade-in", label: "Fade In (Mờ dần)" },
              { value: "slide-up", label: "Slide Up (Bay xuống)" },
              { value: "zoom-in", label: "Zoom Out (Thu nhỏ)" },
              { value: "bounce", label: "Bounce (Nảy tắt)" },
            ]}
            onChange={(val) => {
              if (val === "none") {
                onUpdateAnimations?.({ exitAnimation: undefined })
              } else {
                onUpdateAnimations?.({
                  exitAnimation: {
                    type: val as NonNullable<
                      BuilderElement["exitAnimation"]
                    >["type"],
                    duration: selectedElement.exitAnimation?.duration || 500,
                    delay: selectedElement.exitAnimation?.delay || 0,
                  },
                })
              }
            }}
          />

          {selectedElement.exitAnimation && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <NumberField
                label="Thời gian (ms)"
                value={selectedElement.exitAnimation.duration}
                onChange={(val) => {
                  onUpdateAnimations?.({
                    exitAnimation: {
                      ...selectedElement.exitAnimation,
                      duration: val,
                    } as BuilderElement["exitAnimation"],
                  })
                }}
              />
              <NumberField
                label="Độ trễ (ms)"
                value={selectedElement.exitAnimation.delay}
                onChange={(val) => {
                  onUpdateAnimations?.({
                    exitAnimation: {
                      ...selectedElement.exitAnimation,
                      delay: val,
                    } as BuilderElement["exitAnimation"],
                  })
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Test animation button */}
      <button
        type="button"
        onClick={() => {
          useBuilderStore.getState().triggerTestAnimation(selectedElement.id)
        }}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100"
      >
        <Play className="h-3.5 w-3.5 fill-blue-600" />
        Chạy thử hiệu ứng
      </button>
    </div>
  )
}
