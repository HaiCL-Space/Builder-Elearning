export function uid() {
  return `el-${Math.random().toString(36).slice(2, 9)}`
}
