import type { BuilderElement } from "@/pages/builder/model/types"
import { Plus, X, GitCommit } from "lucide-react"
import { TextField, TextArea, NumberField } from "@/shared/ui/fields"

interface BranchingChoice {
  id: string
  text: string
  nextNodeId: string
}

interface BranchingNode {
  id: string
  title?: string
  content: string
  choices: BranchingChoice[]
  isSuccessEnd?: boolean
  isFailureEnd?: boolean
}

interface BranchingEditorProps {
  selectedElement: BuilderElement
  onUpdateData: (patch: Record<string, unknown>) => void
  onUpdateStyle: (patch: Record<string, unknown>) => void
}

export function BranchingEditor({
  selectedElement,
  onUpdateData,
  onUpdateStyle,
}: BranchingEditorProps) {
  const branchingData = (selectedElement.data || {}) as unknown as {
    startNodeId?: string
    nodes?: BranchingNode[]
  }

  const startNodeId = branchingData.startNodeId ?? ""
  const nodes = branchingData.nodes ?? []

  return (
    <div className="space-y-4 border-t border-slate-100 pt-3.5">
      <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
        Cấu hình Kịch Bản Rẽ Nhánh (Branching)
      </div>

      {/* Start Node Selector */}
      <div className="space-y-1.5">
        <label className="mb-1 block text-[9px] font-bold text-slate-400 uppercase">
          Node Bắt đầu (Start Node)
        </label>
        {nodes.length === 0 ? (
          <div className="text-xs text-slate-400">
            Chưa có node nào được tạo
          </div>
        ) : (
          <select
            value={startNodeId}
            onChange={(e) => onUpdateData({ startNodeId: e.target.value })}
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-blue-500"
          >
            <option value="">Chọn node khởi đầu...</option>
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.id} {node.title ? `(${node.title})` : ""}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Nodes Manager */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Danh sách các Nodes ({nodes.length})
          </label>
          <button
            type="button"
            onClick={() => {
              const nextId = `node-${Date.now().toString(16).slice(-4)}`
              const nextNodes = [
                ...nodes,
                {
                  id: nextId,
                  title: `Quyết định mới`,
                  content: "Mô tả tình huống hoặc kịch bản cốt truyện ở đây...",
                  choices: [],
                },
              ]
              onUpdateData({
                nodes: nextNodes,
                startNodeId: startNodeId || nextId, // Auto select if first node
              })
            }}
            className="flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 hover:bg-blue-100"
          >
            <Plus className="h-3 w-3" /> Thêm Node
          </button>
        </div>

        {nodes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 py-4 text-center text-xs text-slate-400">
            Chưa có tình huống rẽ nhánh nào
          </div>
        ) : (
          <div className="max-h-[350px] space-y-3.5 overflow-y-auto pr-1">
            {nodes.map((node) => {
              const updateNode = (patch: Partial<BranchingNode>) => {
                const nextNodes = nodes.map((n) =>
                  n.id === node.id ? { ...n, ...patch } : n
                )
                onUpdateData({ nodes: nextNodes })
              }

              const deleteNode = () => {
                const nextNodes = nodes.filter((n) => n.id !== node.id)
                const nextStart =
                  startNodeId === node.id ? nextNodes[0]?.id || "" : startNodeId
                onUpdateData({ nodes: nextNodes, startNodeId: nextStart })
              }

              return (
                <div
                  key={node.id}
                  className="relative space-y-2.5 rounded-lg border border-slate-200 bg-slate-50/50 p-2.5"
                >
                  {/* Node Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                      <GitCommit className="h-3 w-3 text-purple-500" />
                      NODE ID: {node.id}
                    </span>
                    <button
                      type="button"
                      onClick={deleteNode}
                      className="rounded p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* ID & Title */}
                  <div className="grid grid-cols-2 gap-2">
                    <TextField
                      label="Mã Node ID"
                      value={node.id}
                      onChange={(v) => {
                        const cleanId = v.trim().replace(/\s+/g, "-")
                        // update node ID and all references in nextNodeId in other nodes!
                        const nextNodes = nodes.map((n) => {
                          let updatedChoices = n.choices
                          if (n.id === node.id) {
                            return { ...n, id: cleanId }
                          } else {
                            updatedChoices = n.choices.map((c) =>
                              c.nextNodeId === node.id
                                ? { ...c, nextNodeId: cleanId }
                                : c
                            )
                            return { ...n, choices: updatedChoices }
                          }
                        })
                        const nextStart =
                          startNodeId === node.id ? cleanId : startNodeId
                        onUpdateData({
                          nodes: nextNodes,
                          startNodeId: nextStart,
                        })
                      }}
                    />
                    <TextField
                      label="Tiêu đề Node"
                      value={node.title || ""}
                      onChange={(v) => updateNode({ title: v })}
                    />
                  </div>

                  {/* Content Narrative */}
                  <div className="space-y-1">
                    <label className="mb-1 block text-[9px] font-bold text-slate-400 uppercase">
                      Nội dung/Tình huống kịch bản
                    </label>
                    <TextArea
                      rows={2}
                      value={node.content}
                      onChange={(v) => updateNode({ content: v })}
                    />
                  </div>

                  {/* End node flags */}
                  <div className="flex gap-4 rounded border border-slate-100 bg-white p-2">
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        id={`success-${node.id}`}
                        checked={!!node.isSuccessEnd}
                        onChange={(e) =>
                          updateNode({
                            isSuccessEnd: e.target.checked,
                            isFailureEnd: e.target.checked
                              ? false
                              : node.isFailureEnd,
                          })
                        }
                        className="h-3.5 w-3.5 cursor-pointer accent-emerald-500"
                      />
                      <label
                        htmlFor={`success-${node.id}`}
                        className="cursor-pointer text-[10px] font-bold text-emerald-600 uppercase"
                      >
                        Kết thúc Đúng
                      </label>
                    </div>

                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        id={`failure-${node.id}`}
                        checked={!!node.isFailureEnd}
                        onChange={(e) =>
                          updateNode({
                            isFailureEnd: e.target.checked,
                            isSuccessEnd: e.target.checked
                              ? false
                              : node.isSuccessEnd,
                          })
                        }
                        className="h-3.5 w-3.5 cursor-pointer accent-red-500"
                      />
                      <label
                        htmlFor={`failure-${node.id}`}
                        className="cursor-pointer text-[10px] font-bold text-red-600 uppercase"
                      >
                        Kết thúc Sai
                      </label>
                    </div>
                  </div>

                  {/* Choices list for this node */}
                  {!node.isSuccessEnd && !node.isFailureEnd && (
                    <div className="space-y-1.5 border-t border-slate-100 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                          Lựa chọn Rẽ nhánh ({node.choices.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const choiceId = `choice-${Date.now().toString(16).slice(-4)}`
                            const nextChoices = [
                              ...node.choices,
                              {
                                id: choiceId,
                                text: "Lựa chọn mới",
                                nextNodeId: "",
                              },
                            ]
                            updateNode({ choices: nextChoices })
                          }}
                          className="text-[9px] font-bold text-purple-600 hover:underline"
                        >
                          + Thêm lựa chọn
                        </button>
                      </div>

                      {node.choices.length === 0 ? (
                        <div className="py-1 text-center text-[10px] text-slate-400 italic">
                          Chưa rẽ nhánh từ node này
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {node.choices.map((choice) => {
                            const updateChoice = (
                              cPatch: Partial<BranchingChoice>
                            ) => {
                              const nextChoices = node.choices.map((c) =>
                                c.id === choice.id ? { ...c, ...cPatch } : c
                              )
                              updateNode({ choices: nextChoices })
                            }

                            const deleteChoice = () => {
                              const nextChoices = node.choices.filter(
                                (c) => c.id !== choice.id
                              )
                              updateNode({ choices: nextChoices })
                            }

                            return (
                              <div
                                key={choice.id}
                                className="flex flex-col gap-1.5 rounded border border-slate-100 bg-white p-2"
                              >
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    placeholder="Nội dung nút bấm..."
                                    value={choice.text}
                                    onChange={(e) =>
                                      updateChoice({ text: e.target.value })
                                    }
                                    className="min-w-0 flex-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] outline-none focus:border-blue-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={deleteChoice}
                                    className="shrink-0 text-slate-400 hover:text-red-500"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <span className="shrink-0 text-[8px] font-bold text-slate-400 uppercase">
                                    Đến Node:
                                  </span>
                                  <select
                                    value={choice.nextNodeId}
                                    onChange={(e) =>
                                      updateChoice({
                                        nextNodeId: e.target.value,
                                      })
                                    }
                                    className="flex-1 rounded border border-slate-200 bg-white px-1 py-0.5 text-[10px] outline-none focus:border-blue-500"
                                  >
                                    <option value="">
                                      Chọn target node...
                                    </option>
                                    {nodes
                                      .filter((n) => n.id !== node.id)
                                      .map((n) => (
                                        <option key={n.id} value={n.id}>
                                          {n.id} {n.title ? `(${n.title})` : ""}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
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
