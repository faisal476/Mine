import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, Copy, Download, Link2 } from "lucide-react";
import { useState } from "react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDialog({ open, onOpenChange }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://rork.app/mine-operations";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Share Mine Terminal
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Copy the link or download the site shortcut to send it to anyone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 py-2">
          <Input readOnly value={shareUrl} className="border-border bg-secondary font-mono text-xs" />
          <Button
            size="icon"
            variant="outline"
            className="shrink-0 border-border"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="border-border"
            onClick={() => {
              const a = document.createElement("a");
              a.href = shareUrl;
              a.download = "Mine Operations.html";
              a.click();
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Page
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              const shareData = {
                title: "Mine Operations Dashboard",
                text: "Check the live mine operations dashboard.",
                url: shareUrl,
              };
              if (navigator.share) {
                navigator.share(shareData).catch(() => undefined);
              } else {
                handleCopy();
              }
            }}
          >
            {copied ? "Copied!" : "Share Link"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
