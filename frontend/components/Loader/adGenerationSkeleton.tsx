import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sparkles } from "lucide-react"

export function AdGenerationSkeleton() {
  return (
    <Dialog open={true}>
      <DialogContent className="!max-w-5xl !w-full max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
            Preparing Your Ad Campaigns...
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border rounded-lg p-4 bg-white shadow-sm animate-pulse space-y-4"
            >
              <div className="h-48 w-full bg-gray-200 rounded-md" />
              <div className="h-6 w-3/4 bg-gray-200 rounded-md" />
              <div className="h-4 w-full bg-gray-200 rounded-md" />
              <div className="h-4 w-5/6 bg-gray-200 rounded-md" />
              <div className="h-10 w-full bg-gray-200 rounded-md" />
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
