import {
  CircleAlert,
  CircleCheck,
  Clock,
  CreditCard,
  Globe,
  Lock,
  LogOut,
  MapPinOff,
  PackageX,
  TriangleAlert,
  Unlink,
  Wrench,
} from "lucide-react"
import type { ComponentProps, ComponentType, HTMLAttributes, ImgHTMLAttributes, ReactNode, SVGProps } from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

type IconTone = "default" | "subtle" | "strong" | "primary" | "success" | "warning" | "error" | "info" | "inverse"

export type ErrorDisplayType =
  | "400" | "403" | "404" | "408" | "500" | "502" | "503" | "504"
  | "confirmation"
  | "inactivity"
  | "insufficient-credits"
  | "link-error"
  | "logout"
  | "warning"
  | "maintenance"
  | "no-item-found"
  | "payment-unsuccessful"
  | "transfer-unsuccessful"
  | "unsupported-browser"
  | "partially-supported-browser"

export interface MaintenanceAdditionalAttributes { dateString: string }
export interface InactivityAdditionalAttributes { secondsLeft: number; reminderInterval?: number }

interface BuiltIn {
  /** Asset basename in LifeSG's CDN bucket (https://assets.life.gov.sg/react-design-system/img/error/<basename>.png). */
  imgBase: string
  /** Lucide fallback icon when the CDN URL is overridden to `null` or fails. */
  icon: ComponentType<SVGProps<SVGSVGElement>>
  /** Semantic tone for the fallback disc — maps to icon-tokens.css. */
  tone: IconTone
  title: string
  description: ReactNode
  renderDescription?: (a: MaintenanceAdditionalAttributes | InactivityAdditionalAttributes | undefined) => ReactNode
}

const BUILTIN: Record<ErrorDisplayType, BuiltIn> = {
  "400": { imgBase: "400", icon: CircleAlert, tone: "error", title: "Something went wrong", description: "This could be a temporary problem, so please refresh the page or try again later." },
  "403": { imgBase: "403", icon: Lock, tone: "error", title: "Error loading page", description: "You may not have permission to view this page. If someone gave you this link, let them know about this error." },
  "404": { imgBase: "404", icon: MapPinOff, tone: "strong", title: "Page not found", description: "If you entered or pasted the URL, check that it’s correct. If someone gave you this link, let them know about this error." },
  "408": { imgBase: "408", icon: CircleAlert, tone: "warning", title: "Something went wrong", description: "This could be a temporary problem, so please refresh the page or try again later." },
  "500": { imgBase: "generic-error", icon: CircleAlert, tone: "error", title: "Something went wrong", description: "We’re working on a fix for the problem. Please try again later." },
  "502": { imgBase: "502", icon: CircleAlert, tone: "error", title: "Something went wrong", description: "This could be a temporary problem, so please refresh the page or try again later." },
  "503": { imgBase: "503", icon: Wrench, tone: "warning", title: "Service under maintenance", description: "This service is currently unavailable. Please try again later." },
  "504": { imgBase: "504", icon: CircleAlert, tone: "warning", title: "Something went wrong", description: "This could be a temporary problem, so please refresh the page or try again later." },
  "confirmation": { imgBase: "confirmation", icon: CircleCheck, tone: "success", title: "Leave and lose changes?", description: "You have unsaved changes. If you leave this page, you will lose the changes you’ve made." },
  "inactivity": {
    imgBase: "inactivity",
    icon: Clock,
    tone: "warning",
    title: "Are you still there?",
    description: "You’ve been inactive for a while. To protect your privacy, you’ll be logged out soon.\n\nIf you wish to stay on this page, let us know now.",
    renderDescription: (attrs) => {
      const a = attrs as InactivityAdditionalAttributes | undefined
      if (!a || typeof a.secondsLeft !== "number") return null
      const mins = Math.floor(a.secondsLeft / 60)
      const secs = a.secondsLeft % 60
      return (
        <>
          <p>You’ve been inactive for a while. To protect your privacy, you’ll be logged out in {mins} minutes {secs} seconds.</p>
          <p>If you wish to stay on this page, let us know now.</p>
        </>
      )
    },
  },
  "insufficient-credits": { imgBase: "insuffcient-credit", icon: CreditCard, tone: "warning", title: "Insufficient credits", description: "You do not have enough credits to make this transaction." },
  "link-error": { imgBase: "link-error", icon: Unlink, tone: "warning", title: "Link has expired", description: "If you entered or pasted the URL, check that it’s correct. If someone gave you this link, let them know it has expired." },
  "logout": { imgBase: "logout", icon: LogOut, tone: "strong", title: "You’ve been logged out", description: "It looks like you’ve left, so we logged you out to protect your privacy." },
  "warning": { imgBase: "warning", icon: TriangleAlert, tone: "warning", title: "Are you sure?", description: "You will lose your progress." },
  "maintenance": {
    imgBase: "503",
    icon: Wrench,
    tone: "warning",
    title: "Service under maintenance",
    description: "This service is currently unavailable. Please try again later.",
    renderDescription: (attrs) => {
      const a = attrs as MaintenanceAdditionalAttributes | undefined
      if (!a?.dateString) return null
      return <>This service is currently unavailable. Please try again after <strong>{a.dateString}</strong>.</>
    },
  },
  "no-item-found": { imgBase: "no-item-found", icon: PackageX, tone: "strong", title: "No results found", description: "Try adjusting your search or filters to find what you’re looking for." },
  "payment-unsuccessful": { imgBase: "payment-unsuccessful", icon: CreditCard, tone: "error", title: "Unsuccessful payment", description: "Your payment was unsuccessful. Please try again." },
  "transfer-unsuccessful": { imgBase: "transfer-unsuccessful", icon: CreditCard, tone: "error", title: "Unsuccessful transfer", description: "Your transfer was unsuccessful. Please try again." },
  "unsupported-browser": { imgBase: "generic-error", icon: Globe, tone: "warning", title: "Browser not supported", description: "Download the latest version of Chrome, Edge, Firefox or Safari." },
  "partially-supported-browser": { imgBase: "generic-error", icon: Globe, tone: "warning", title: "Browser version not supported", description: "Update to the latest version of Chrome, Edge, Firefox or Safari." },
}

const CDN_BASE = "https://assets.life.gov.sg/react-design-system/img/error"
function defaultImgProps(imgBase: string): ImgHTMLAttributes<HTMLImageElement> {
  return {
    src: `${CDN_BASE}/${imgBase}.png`,
    srcSet: `${CDN_BASE}/${imgBase}@2x.png 2x, ${CDN_BASE}/${imgBase}@3x.png 3x`,
    width: 400,
    height: 280,
    alt: "",
  }
}

export interface ErrorDisplayProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  type: ErrorDisplayType
  /**
   * Override the illustration. Pass an `<img>` props bag (LifeSG-compatible) or any ReactNode.
   * Default per `type` is the LifeSG CDN illustration. Pass `null` to render the tone-tinted
   * Lucide-icon fallback disc instead.
   */
  img?: ReactNode | ImgHTMLAttributes<HTMLImageElement>
  title?: ReactNode
  description?: ReactNode
  /** Renders a `<Button>` below the description. Pass any `<Button>` prop bag. */
  actionButton?: ComponentProps<typeof Button>
  /** Render only the illustration — used for compact inline states. */
  imageOnly?: boolean
  additionalProps?: MaintenanceAdditionalAttributes | InactivityAdditionalAttributes
}

function isImgProps(v: unknown): v is ImgHTMLAttributes<HTMLImageElement> {
  return typeof v === "object" && v !== null && !("$$typeof" in (v as Record<string, unknown>))
}

function Illustration({
  type, img,
}: { type: ErrorDisplayType; img?: ErrorDisplayProps["img"] }) {
  const builtIn = BUILTIN[type]

  /* Explicit null → render the Lucide-icon fallback disc. */
  if (img === null) {
    return <FallbackDisc type={type} />
  }
  /* Explicit override (props bag or ReactNode). */
  if (img !== undefined) {
    if (isImgProps(img) && img.src) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img alt="" {...img} />
    }
    return <>{img}</>
  }
  /* Default: LifeSG CDN illustration. */
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt="" {...defaultImgProps(builtIn.imgBase)} />
}

function FallbackDisc({ type }: { type: ErrorDisplayType }) {
  const { icon: SvgIcon, tone } = BUILTIN[type]
  return (
    <div
      data-slot="error-display-illustration"
      data-tone={tone}
      className="flex items-center justify-center rounded-full"
      style={{
        width: "var(--error-display-illus-size)",
        height: "var(--error-display-illus-size)",
        backgroundColor: `var(--error-display-tone-${tone}-bg)`,
        color: `var(--error-display-tone-${tone}-fg)`,
      }}
    >
      <Icon as={SvgIcon} size="xl" className="size-16" style={{ color: "inherit" }} />
    </div>
  )
}

function ErrorDisplay({
  type, img, title, description, actionButton, imageOnly, additionalProps,
  className, style, ...props
}: ErrorDisplayProps) {
  const data = BUILTIN[type]
  const resolvedTitle = title ?? data.title
  const resolvedDescription =
    description !== undefined ? description :
    data.renderDescription ? data.renderDescription(additionalProps) :
    data.description

  return (
    <section
      data-slot="error-display"
      data-type={type}
      role="alert"
      className={cn(
        "flex flex-col items-center text-center",
        "[gap:var(--error-display-gap)] [padding-block:var(--error-display-pad-y)]",
        className
      )}
      style={style}
      {...props}
    >
      <Illustration type={type} img={img} />
      {!imageOnly && (
        <div
          className="flex flex-col items-center"
          style={{ maxWidth: "var(--error-display-max-width)", gap: "var(--error-display-gap)" }}
        >
          <h1
            className="text-lifesg-font-heading-size-md leading-lifesg-font-heading-lh-md [letter-spacing:var(--lifesg-font-heading-ls-md)] [font-weight:var(--lifesg-font-weight-semibold)]"
            style={{ color: "var(--error-display-title-color)" }}
          >
            {resolvedTitle}
          </h1>
          <div
            className="text-lifesg-font-body-size-baseline leading-lifesg-font-body-lh-baseline whitespace-pre-wrap"
            style={{ color: "var(--error-display-desc-color)" }}
          >
            {resolvedDescription}
          </div>
          {actionButton && <Button {...actionButton} />}
        </div>
      )}
    </section>
  )
}

export { ErrorDisplay }
