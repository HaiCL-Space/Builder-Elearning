import type { BuilderElement } from "@/pages/builder/model/types"
import {
  TextArea,
  NumberField,
  ColorField,
  SelectField,
} from "@/shared/ui/fields"

interface TextEditorProps {
  selectedElement: BuilderElement
  onUpdateData: (patch: Record<string, unknown>) => void
  onUpdateStyle: (patch: Record<string, unknown>) => void
}

export function TextEditor({
  selectedElement,
  onUpdateData,
  onUpdateStyle,
}: TextEditorProps) {
  return (
    <div className="space-y-3.5 border-t border-slate-100 pt-3.5">
      <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
        Nội dung văn bản
      </label>
      <TextArea
        rows={3}
        value={
          ((selectedElement.data as unknown as { content?: string })
            ?.content as string) || ""
        }
        onChange={(v) => onUpdateData({ content: v })}
      />
      <div className="grid grid-cols-2 gap-3.5 bg-slate-50/50 p-3 rounded-lg border border-slate-100 items-start">
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
          showAlpha={true}
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
          )?.textAlign as string) || "center"
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
  )
}
