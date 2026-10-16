export function GrainOverlay() {
  return (
    <>
      <div
        aria-hidden="true"
        className="warm-vignette pointer-events-none fixed inset-0 z-[80]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] opacity-[0.036] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='siya-grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23siya-grain)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}
