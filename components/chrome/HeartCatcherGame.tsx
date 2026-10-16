"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CONTENT } from "@/lib/content";
import { HeartSvg } from "@/components/motion/Primitives";

type FlyingHeart = {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
};

type SpawnedHeart = {
  id: string;
  xPercent: number;
  yPercent: number;
  size: number;
  tone: "cranberry" | "marigold" | "cream";
};

type HeartGameContextValue = {
  caughtCount: number;
  targetCount: number;
  catchHeartAt: (clientX: number, clientY: number) => void;
  isComplete: boolean;
  openRewardModal: () => void;
};

const HeartGameContext = createContext<HeartGameContextValue>({
  caughtCount: 0,
  targetCount: CONTENT.miniGame.targetCount,
  catchHeartAt: () => {},
  isComplete: false,
  openRewardModal: () => {},
});

export function useHeartGame() {
  return useContext(HeartGameContext);
}

export function HeartCatcherProvider({
  children,
  onApplyPerk,
}: {
  children: React.ReactNode;
  onApplyPerk: (perkCode: string) => void;
}) {
  const targetCount = CONTENT.miniGame.targetCount;
  const [caughtCount, setCaughtCount] = useState(0);
  const [flyingHearts, setFlyingHearts] = useState<FlyingHeart[]>([]);
  const [spawnedHearts, setSpawnedHearts] = useState<SpawnedHeart[]>([]);
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [pillBounce, setPillBounce] = useState(false);
  const pillRef = useRef<HTMLDivElement | null>(null);

  const isComplete = caughtCount >= targetCount;

  const triggerPillBounce = useCallback(() => {
    setPillBounce(true);
    window.setTimeout(() => setPillBounce(false), 320);
  }, []);

  const catchHeartAt = useCallback(
    (clientX: number, clientY: number) => {
      const pillRect = pillRef.current?.getBoundingClientRect();
      const targetX = pillRect
        ? pillRect.left + pillRect.width * 0.25
        : window.innerWidth / 2;
      const targetY = pillRect
        ? pillRect.top + pillRect.height * 0.5
        : window.innerHeight - 36;

      const id = `fly-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      setFlyingHearts((prev) => [
        ...prev,
        { id, startX: clientX, startY: clientY, targetX, targetY },
      ]);

      window.setTimeout(() => {
        setFlyingHearts((prev) => prev.filter((h) => h.id !== id));
        triggerPillBounce();
        setCaughtCount((prev) => {
          const next = Math.min(targetCount, prev + 1);
          if (next === targetCount && prev < targetCount) {
            window.setTimeout(() => setRewardModalOpen(true), 420);
          }
          return next;
        });
      }, 520);
    },
    [targetCount, triggerPillBounce]
  );

  // Spawn interactive floating hearts when user clicks the pill before 16/16
  const spawnHeartCluster = () => {
    if (isComplete) {
      setRewardModalOpen(true);
      return;
    }

    const remaining = targetCount - caughtCount;
    const countToSpawn = Math.min(6, Math.max(3, remaining));
    const tones: Array<"cranberry" | "marigold" | "cream"> = [
      "cranberry",
      "marigold",
      "cream",
    ];

    const batch: SpawnedHeart[] = Array.from({ length: countToSpawn }).map(
      (_, idx) => ({
        id: `sp-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 5)}`,
        xPercent: 14 + Math.random() * 72,
        yPercent: 22 + Math.random() * 54,
        size: 28 + Math.round(Math.random() * 14),
        tone: tones[idx % tones.length],
      })
    );

    setSpawnedHearts((prev) => [...prev.slice(-8), ...batch]);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && rewardModalOpen) {
        setRewardModalOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [rewardModalOpen]);

  const formattedCount = String(caughtCount).padStart(2, "0");
  const formattedTarget = String(targetCount).padStart(2, "0");

  return (
    <HeartGameContext.Provider
      value={{
        caughtCount,
        targetCount,
        catchHeartAt,
        isComplete,
        openRewardModal: () => setRewardModalOpen(true),
      }}
    >
      {children}

      {/* Interactive Spawned Hearts Layer */}
      <div className="pointer-events-none fixed inset-0 z-[85] overflow-hidden">
        <AnimatePresence>
          {spawnedHearts.map((heart) => {
            const colorClass =
              heart.tone === "cranberry"
                ? "text-cranberry"
                : heart.tone === "marigold"
                ? "text-marigold"
                : "text-cream";

            return (
              <motion.button
                key={heart.id}
                type="button"
                data-cursor="catch"
                aria-label="Catch floating heart"
                initial={{ opacity: 0, scale: 0.3, y: 30 }}
                animate={{
                  opacity: 0.92,
                  scale: [1, 1.1, 1],
                  y: [0, -18, 0],
                }}
                exit={{ opacity: 0, scale: 0.2 }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const cx = rect.left + rect.width / 2;
                  const cy = rect.top + rect.height / 2;
                  setSpawnedHearts((prev) =>
                    prev.filter((item) => item.id !== heart.id)
                  );
                  catchHeartAt(cx, cy);
                }}
                style={{
                  left: `${heart.xPercent}%`,
                  top: `${heart.yPercent}%`,
                  width: `${heart.size}px`,
                  height: `${heart.size}px`,
                }}
                className={`pointer-events-auto absolute flex items-center justify-center rounded-full bg-espresso/60 p-2 shadow-[0_8px_24px_rgba(30,18,16,0.5)] backdrop-blur-sm transition-transform hover:scale-125 ${colorClass}`}
              >
                <HeartSvg className="h-full w-full" />
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Spring-Physics Flying Hearts Trajectory Layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[110] overflow-hidden"
      >
        <AnimatePresence>
          {flyingHearts.map((fh) => (
            <motion.div
              key={fh.id}
              initial={{
                x: fh.startX - 12,
                y: fh.startY - 12,
                scale: 1.35,
                rotate: -14,
                opacity: 1,
              }}
              animate={{
                x: fh.targetX - 8,
                y: fh.targetY - 8,
                scale: 0.55,
                rotate: 12,
                opacity: 0.95,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 210,
                damping: 18,
                mass: 0.75,
              }}
              className="fixed top-0 left-0 text-cranberry drop-shadow-[0_4px_12px_rgba(242,169,59,0.65)]"
            >
              <HeartSvg className="h-6 w-6" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom Floating Mini-Game Pill: "catch the hearts 00/16" */}
      <div
        ref={pillRef}
        className="fixed bottom-4 left-1/2 z-[88] -translate-x-1/2 px-2 sm:bottom-5"
      >
        <motion.div
          animate={pillBounce ? { scale: [1, 1.12, 0.96, 1] } : { scale: 1 }}
          transition={{ duration: 0.32 }}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-cream/15 bg-espresso/92 p-1 pl-3 text-cream shadow-[0_14px_36px_rgba(15,8,7,0.68)] backdrop-blur-md sm:pl-3.5"
        >
          <button
            type="button"
            onClick={spawnHeartCluster}
            data-cursor={isComplete ? "open" : "hearts"}
            className="inline-flex shrink-0 items-center gap-1.5 py-1 pr-1.5 text-xs whitespace-nowrap lowercase transition-colors hover:text-marigold sm:gap-2 sm:pr-2"
          >
            <HeartSvg
              className={`h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${
                isComplete
                  ? "scale-110 text-marigold"
                  : "text-cranberry"
              }`}
            />
            <span className="font-mono text-[10px] tracking-tight whitespace-nowrap sm:text-[11px]">
              {isComplete ? (
                <span className="text-marigold">
                  16/16 unlocked · open note
                </span>
              ) : (
                <>
                  {CONTENT.miniGame.pillLabel}{" "}
                  <strong className="font-semibold text-marigold">
                    {formattedCount}/{formattedTarget}
                  </strong>
                </>
              )}
            </span>
          </button>

          {!isComplete ? (
            <button
              type="button"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                catchHeartAt(rect.left + rect.width / 2, rect.top - 18);
              }}
              data-cursor="catch"
              aria-label="Catch a heart now"
              title="Tap to catch a heart or spawn floating hearts"
              className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-cranberry/90 px-2.5 font-mono text-[10px] whitespace-nowrap text-cream transition-all hover:bg-marigold hover:text-espresso"
            >
              <span>+1</span>
              <HeartSvg className="h-2.5 w-2.5" />
            </button>
          ) : null}
        </motion.div>
      </div>

      {/* 16/16 Reward Keepsake Modal */}
      <AnimatePresence>
        {rewardModalOpen ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="heart-reward-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[115] flex items-center justify-center bg-espresso/85 p-4 backdrop-blur-md"
            onClick={() => setRewardModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.94, rotate: -1 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] border border-espresso/15 bg-cream p-6 text-espresso shadow-[0_32px_90px_rgba(0,0,0,0.65)] sm:p-8"
            >
              {/* Masking tape strip at top */}
              <div
                aria-hidden="true"
                className="polaroid-tape mx-auto -mt-9 mb-5 h-7 w-32 -rotate-2 rounded-sm"
              />

              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cranberry/12 px-3 py-1 font-mono text-[11px] text-cranberry">
                  <HeartSvg className="h-3 w-3" />
                  <span>16 / 16 hearts collected</span>
                </span>
                <button
                  type="button"
                  onClick={() => setRewardModalOpen(false)}
                  className="rounded-full border border-espresso/15 px-3 py-1 font-mono text-xs text-espresso/70 transition-colors hover:border-espresso hover:text-espresso"
                >
                  close [esc]
                </button>
              </div>

              <h3
                id="heart-reward-title"
                className="mt-4 font-display text-3xl font-bold tracking-[-0.04em] lowercase sm:text-4xl"
              >
                you caught all{" "}
                <em className="font-serif font-normal italic text-cranberry">
                  sixteen
                </em>{" "}
                hearts.
              </h3>
              <p className="mt-1.5 text-sm text-espresso/75 lowercase">
                {CONTENT.miniGame.rewardSubtitle}
              </p>

              {/* Handwritten Note Card */}
              <div className="mt-5 rounded-2xl border border-espresso/10 bg-espresso p-5 text-cream">
                <p className="font-mono text-[10px] tracking-wider text-marigold uppercase">
                  handwritten note from siya
                </p>
                <p className="mt-2.5 font-serif text-xl leading-relaxed italic text-cream/95">
                  “{CONTENT.miniGame.handwrittenNote}”
                </p>
                <p className="mt-3 text-right font-serif text-lg italic text-marigold">
                  — hearts, siya
                </p>
              </div>

              {/* Media-Kit Perk Unlock */}
              <div className="mt-4 rounded-2xl border border-cranberry/25 bg-cranberry/8 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold text-cranberry">
                    media-kit perk unlocked
                  </span>
                  <span className="rounded-full bg-espresso px-2.5 py-0.5 font-mono text-[11px] text-marigold">
                    code: {CONTENT.miniGame.perkCode}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-espresso/85 lowercase">
                  {CONTENT.miniGame.perkDescription}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRewardModalOpen(false);
                    onApplyPerk(CONTENT.miniGame.perkCode);
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-cranberry px-5 py-3 text-xs font-medium text-cream lowercase transition-colors hover:bg-espresso"
                >
                  <span>attach perk &amp; request media kit</span>
                  <span>→</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </HeartGameContext.Provider>
  );
}
