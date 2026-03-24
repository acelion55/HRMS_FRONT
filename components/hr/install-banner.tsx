"use client"

import { useState, useEffect } from "react"
import { Download, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }
    function handler(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") setIsInstalled(true)
    setDeferredPrompt(null)
  }

  function handleDismiss() {
    setDismissed(true)
    localStorage.setItem("install-banner-dismissed", "1")
  }

  // Don't render until mounted (avoids SSR mismatch)
  if (!mounted) return null
  if (isInstalled) return null
  if (dismissed) return null
  // Check localStorage after mount
  if (typeof window !== "undefined" && localStorage.getItem("install-banner-dismissed")) return null

  return (
    <div className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-2.5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <Download className="h-4 w-4 text-white shrink-0" />
        <p className="text-xs font-semibold text-white truncate">
          Install HR Ticket App — access it anytime from your home screen
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {deferredPrompt && (
          <button
            onClick={handleInstall}
            className="text-xs font-bold text-yellow-700 bg-white px-3 py-1 rounded-lg hover:bg-yellow-50 transition-colors"
          >
            Install
          </button>
        )}
        <button onClick={handleDismiss} className="text-white/70 hover:text-white transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
