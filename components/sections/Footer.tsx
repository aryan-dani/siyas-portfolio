import Link from "next/link";
import { CONTENT } from "@/lib/content";
import { DrawLine } from "@/components/motion/Reveal";
import { BackToTop, FooterMark } from "@/components/sections/FooterParts";

export function Footer() {
  const { footer, profile } = CONTENT;

  return (
    <footer id="footer" data-theme-section="burgundy" className="footer">
      <div className="wrap">
        <DrawLine />
        <div className="footer__row type-label">
          <p>{footer.copyright}</p>
          <p className="footer__links">
            <Link href="/copyright" transitionTypes={["nav-forward"]} className="link-u">
              Copyright &amp; IP
            </Link>
          </p>
          <p>
            {footer.credit}{" "}
            <a href={profile.developerUrl} target="_blank" rel="noopener noreferrer" className="link-u">
              {profile.developerName} ↗
            </a>
          </p>
          <BackToTop />
        </div>
      </div>
      <FooterMark />
    </footer>
  );
}
