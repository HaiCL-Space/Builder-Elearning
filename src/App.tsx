import SlidePreviewApp from "./components/slide-preview"

export function App() {
  return (
    // Thêm w-full để báo cho flexbox biết hãy bung rộng 100% màn hình
    <div className="flex min-h-svh w-full flex-col bg-gray-100 p-6">
      <SlidePreviewApp />
    </div>
  )
}
export default App
