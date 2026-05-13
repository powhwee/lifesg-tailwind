import * as React from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type LinkAttrs = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export interface FooterDisclaimerLinks {
  privacy?: Omit<LinkAttrs, "children">;
  termsOfUse?: Omit<LinkAttrs, "children">;
  reportVulnerability?: Omit<LinkAttrs, "children">;
}

export interface FooterProps {
  /** Multi-array for column layout. Outer = column, inner = link list. */
  links?: LinkAttrs[][];
  disclaimerLinks?: FooterDisclaimerLinks;
  copyrightInfo?: string;
  lastUpdated?: Date;
  logoSrc?: string;
  hideLogo?: boolean;
  className?: string;
}

const defaultDisclaimerLinks: Required<{ [K in keyof FooterDisclaimerLinks]: Omit<LinkAttrs, "children"> }> = {
  privacy: { href: "#privacy" },
  termsOfUse: { href: "#terms" },
  reportVulnerability: { href: "#report-vulnerability" },
};

const linkCx =
  "text-[var(--footer-link)] hover:underline underline-offset-4 outline-none focus-visible:underline";

function Footer({
  links,
  disclaimerLinks,
  copyrightInfo,
  lastUpdated,
  logoSrc,
  hideLogo,
  className,
}: FooterProps) {
  const disclaimer = { ...defaultDisclaimerLinks, ...disclaimerLinks };
  return (
    <footer className={cn("w-full bg-[var(--footer-bg)] text-[var(--footer-text)]", className)}>
      <div className="max-w-screen-xl mx-auto px-6 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-12 gap-y-8 mb-8">
          {!hideLogo && (
            <div className="shrink-0">
              {logoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoSrc} alt="" className="h-16 w-auto" />
              ) : (
                <div aria-hidden="true" className="h-16 w-16 rounded-md bg-[var(--lifesg-bg-primary)]" />
              )}
            </div>
          )}

          {links && links.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-base">
              {links.map((column, i) => (
                <ul key={i} className="list-none m-0 p-0 flex flex-col gap-3">
                  {column.map((link, j) => {
                    const { className: linkClassName, children, ...rest } = link;
                    return (
                      <li key={j}>
                        <a className={cn(linkCx, "font-semibold", linkClassName)} {...rest}>
                          {children}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 text-sm text-[var(--lifesg-text)]">
          <ul className="flex items-center gap-x-8 list-none m-0 p-0">
            <li><a className={linkCx} {...disclaimer.privacy}>Privacy Statement</a></li>
            <li><a className={linkCx} {...disclaimer.termsOfUse}>Terms of Use</a></li>
            <li>
              <a className={cn(linkCx, "inline-flex items-center gap-1")} {...disclaimer.reportVulnerability}>
                Report Vulnerability
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            </li>
          </ul>
          <div className="flex items-center gap-4 text-[var(--lifesg-text-subtle)] shrink-0">
            {copyrightInfo && <span>{copyrightInfo}</span>}
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
