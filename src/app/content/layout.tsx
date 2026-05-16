import Link from "next/link";
import { tree } from "@/components/content/registry";

function ChevronRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" className="shrink-0 transition-transform group-open:rotate-90">
      <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" className="shrink-0 text-lifesg-icon-primary">
      <path d="M1.5 3.5h4.5l1.5 1.5h7v7.5h-13z" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" className="shrink-0 text-lifesg-warning-60">
      <path d="M3.5 1.5h6.5l3 3v10h-9.5z" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

const linkCx =
  "flex items-center gap-2 rounded px-2 py-1.5 hover:bg-lifesg-bg-hover hover:text-lifesg-text-hover aria-[current=page]:bg-lifesg-bg-selected aria-[current=page]:text-lifesg-text-selected";

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-72 shrink-0 border-r border-border bg-lifesg-bg-strong p-6">
        <Link
          href="/"
          className="block text-xs text-muted-foreground hover:text-lifesg-text-hover mb-3"
        >
          ← Pilot home
        </Link>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Content
        </div>
        <nav className="flex flex-col gap-0.5 text-sm">
          {tree.map((node) => {
            if (node.kind === "leaf") {
              return (
                <Link key={node.slug} href={`/content/${node.slug}`} className={linkCx}>
                  <FileIcon />
                  <span>{node.title}</span>
                </Link>
              );
            }
            return (
              <details key={node.slug} className="group">
                <summary className="flex items-center gap-2 rounded px-2 py-1.5 cursor-pointer hover:bg-lifesg-bg-hover list-none [&::-webkit-details-marker]:hidden">
                  <ChevronRight />
                  <FolderIcon />
                  <span>{node.title}</span>
                </summary>
                <div className="flex flex-col gap-0.5 ml-6 mt-0.5">
                  {node.children.map((child) => (
                    <Link
                      key={child.slug}
                      href={`/content/${node.slug}/${child.slug}`}
                      className={linkCx}
                    >
                      <FileIcon />
                      <span>{child.title}</span>
                    </Link>
                  ))}
                </div>
              </details>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
