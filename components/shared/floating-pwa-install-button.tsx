"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

function isStandalone() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

function isIosSafari() {
  if (typeof window === "undefined") {
    return false;
  }

  const userAgent = window.navigator.userAgent;
  const isIosDevice = /iphone|ipad|ipod/i.test(userAgent);
  const isSafariBrowser =
    /safari/i.test(userAgent) && !/crios|fxios|edgios|opr\//i.test(userAgent);

  return isIosDevice && isSafariBrowser;
}

function canRegisterServiceWorker() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    "serviceWorker" in navigator &&
    (window.isSecureContext ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
  );
}

export function FloatingPwaInstallButton() {
  const [installPromptEvent, setInstallPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showInstalledNotice, setShowInstalledNotice] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (canRegisterServiceWorker()) {
      navigator.serviceWorker.register("/sw.js").catch((error: unknown) => {
        console.error("Service worker registration failed.", error);
      });
    }

    const displayModeQuery = window.matchMedia("(display-mode: standalone)");

    const syncInstallationState = () => {
      setIsInstalled(isStandalone());
    };

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallPromptEvent(null);
      setShowHelp(false);
      setShowInstalledNotice(true);
      syncInstallationState();
    };

    const handleDisplayModeChange = () => {
      syncInstallationState();
    };

    queueMicrotask(() => {
      syncInstallationState();
      setIsIos(isIosSafari());
      setIsReady(true);
    });

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    displayModeQuery.addEventListener("change", handleDisplayModeChange);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      displayModeQuery.removeEventListener("change", handleDisplayModeChange);
    };
  }, []);

  useEffect(() => {
    if (!showInstalledNotice) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setShowInstalledNotice(false);
    }, 2200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [showInstalledNotice]);

  async function handleInstall() {
    if (installPromptEvent) {
      await installPromptEvent.prompt();
      const { outcome } = await installPromptEvent.userChoice;

      if (outcome === "accepted") {
        setInstallPromptEvent(null);
        return;
      }

      setShowHelp(false);
      return;
    }

    setShowHelp((current) => !current);
  }

  if (!isReady) {
    return null;
  }

  if (isInstalled) {
    return null;
  }

  const helperText = isIos
    ? "On iPhone, tap Share and choose Add to Home Screen."
    : "If your browser does not prompt, use its menu to install this app.";

  return (
    <div className="pointer-events-auto relative flex flex-col items-end gap-2">
      {showHelp ? (
        <div className="max-w-[15rem] rounded-2xl border border-border/80 bg-card/95 px-3 py-3 text-right text-xs leading-5 text-muted shadow-[0_16px_40px_rgba(0,0,0,0.16)] backdrop-blur-md">
          {helperText}
        </div>
      ) : null}

      {showInstalledNotice ? (
        <div className="max-w-[13rem] rounded-2xl border border-success/25 bg-success-soft px-3 py-2 text-right text-xs leading-5 text-success shadow-[0_16px_40px_rgba(0,0,0,0.14)]">
          SplitTogether has been installed.
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleInstall}
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-card/90 text-foreground shadow-[0_20px_50px_rgba(0,0,0,0.16)] backdrop-blur-md transition-colors hover:bg-card",
        )}
        aria-label="Install app"
        title={isIos ? "Add to Home Screen" : "Install app"}
      >
        <Download className="h-5 w-5" />
      </button>
    </div>
  );
}
