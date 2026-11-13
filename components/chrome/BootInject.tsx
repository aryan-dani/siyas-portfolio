"use client";

import { useRef } from "react";
import { useServerInsertedHTML } from "next/navigation";

/* Runs in the SSR HTML stream (outside the client React tree) so React 19
   never sees a <script> during hydration — which would throw the overlay
   error. Decides, with no flash:
   - whether reveal animations are allowed (js-motion)
   - whether the intro plays (once per session, home page only, never with
     reduced motion)
   - a failsafe: if the app hasn't started after 6s, show everything. */
const BOOT_SCRIPT = `(function(){var d=document.documentElement;try{var rm=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(!rm){d.classList.add("js-motion");}var seen=false;try{seen=sessionStorage.getItem("siya:intro")==="1";}catch(e){}var home=location.pathname==="/";d.setAttribute("data-intro",(rm||seen||!home)?"done":"pending");setTimeout(function(){if(!window.__siyaReady){d.classList.add("motion-failsafe");d.setAttribute("data-intro","done");}},6000);}catch(e){d.setAttribute("data-intro","done");}})();`;

/**
 * Injects the pre-hydration boot script + JSON-LD into the SSR stream.
 * Renders nothing into the client tree.
 */
export function BootInject({ jsonLd }: { jsonLd: string }) {
  const inserted = useRef(false);

  useServerInsertedHTML(() => {
    if (inserted.current) return null;
    inserted.current = true;
    return (
      <>
        <script id="siya-boot" dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <script
          id="siya-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      </>
    );
  });

  return null;
}
