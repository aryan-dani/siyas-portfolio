"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { BrowserWindow } from "@/components/chrome/BrowserWindow";
import { useNavCurtain } from "@/components/chrome/NavCurtain";

type OpenArgs = {
  url: string;
  label: string;
  origin: HTMLElement;
};

type BrowserLaunchContextValue = {
  open: (args: OpenArgs) => void;
};

const BrowserLaunchContext = createContext<BrowserLaunchContextValue>({
  open: () => {},
});

export function useBrowserLaunch() {
  return useContext(BrowserLaunchContext);
}

/**
 * Instagram cannot be framed (X-Frame-Options / CSP). This provider opens a
 * designed profile preview that Flips from the clicked link; the real page
 * opens only when the visitor clicks "continue to instagram".
 */
export function BrowserLaunchProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<OpenArgs | null>(null);
  const busyRef = useRef(false);

  const open = useCallback((args: OpenArgs) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setSession(args);
  }, []);

  const handleClosed = useCallback(() => {
    setSession(null);
    busyRef.current = false;
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <BrowserLaunchContext.Provider value={value}>
      {children}
      {session ? (
        <BrowserWindow
          url={session.url}
          label={session.label}
          originEl={session.origin}
          onClosed={handleClosed}
        />
      ) : null}
    </BrowserLaunchContext.Provider>
  );
}

/**
 * Client anchor that keeps href for no-JS / middle-click / open-in-new-tab,
 * and intercepts plain left clicks to open the browser window.
 */
export function BrowserLaunchLink({
  href,
  label,
  className,
  children,
  "aria-label": ariaLabel,
  ...rest
}: {
  href: string;
  label: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children" | "className">) {
  const { open } = useBrowserLaunch();
  const { openOutbound } = useNavCurtain();
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const origin = e.currentTarget;
    /* End timing: Flip preview opens after the sheet clears. */
    openOutbound("opening instagram", () => {
      open({ url: href, label, origin });
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
      data-cursor="open"
      onClick={onClick}
      {...rest}
    >
      {children}
    </a>
  );
}
