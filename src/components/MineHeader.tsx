import { HardHat, Share2, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ShareDialog } from "./ShareDialog";

export function MineHeader() {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border/60 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <HardHat className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-wider text-foreground">MINE OPERATIONS</span>
          <span className="text-xs font-medium tracking-widest text-muted-foreground">COMMAND TERMINAL</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-border/60 px-3 py-1.5 sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-semibold text-primary">ONLINE</span>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="border-border/60 text-muted-foreground hover:text-foreground"
          onClick={() => setShareOpen(true)}
        >
          <Share2 className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="border-border/60 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} />
    </header>
  );
}
