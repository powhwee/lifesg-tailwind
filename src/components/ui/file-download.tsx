"use client";

import * as React from "react";
import {
  Download as DownloadIcon,
  AlertCircle,
  Loader2,
  File as FileIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types — mirrored from @lifesg/react-design-system/file-download
// ---------------------------------------------------------------------------

export interface FileItemDownloadProps {
  id: string;
  /** The name of the file */
  name: string;
  /** The MIME type of the file */
  mimeType: string;
  /** The size of the file in bytes */
  size?: number;
  /** The remote path of the file */
  filePath: string;
  /** A custom error message to display when file download fails */
  errorMessage?: string | React.ReactNode;
  /** The thumbnail of the file (data URL) */
  thumbnailImageDataUrl?: string;
  /** Indicates if text should be truncated */
  truncateText?: boolean;
  /** Indicates if file is ready for download. Defaults to true. */
  ready?: boolean;
}

export type FileDownloadStyle = "bordered" | "no-border";

export interface FileDownloadProps {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  fileItems: FileItemDownloadProps[];
  styleType?: FileDownloadStyle;
  className?: string;
  id?: string;
  "data-testid"?: string;
  /** Called when a file item is clicked. */
  onDownload?: (file: FileItemDownloadProps) => void | Promise<void>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatFileSize(bytes: number | undefined): string {
  if (bytes === undefined) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function isImageMime(mime: string): boolean {
  return mime.startsWith("image/");
}

// ---------------------------------------------------------------------------
// FileListCard — internal row component
// ---------------------------------------------------------------------------

interface FileListCardProps {
  fileItem: FileItemDownloadProps;
  onDownload: (item: FileItemDownloadProps) => Promise<void> | void;
}

function FileListCard({ fileItem, onDownload }: FileListCardProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | React.ReactNode | null>(
    fileItem.errorMessage ?? null,
  );
  const ready = fileItem.ready ?? true;

  // Sync external errorMessage prop changes into local state.
  React.useEffect(() => {
    setError(fileItem.errorMessage ?? null);
  }, [fileItem.errorMessage]);

  const handleDownload = async () => {
    if (!ready || loading) return;
    setError(null);
    setLoading(true);
    try {
      await onDownload(fileItem);
    } catch {
      setError("File could not be downloaded. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const hasError = !!error;

  return (
    <li
      className={cn(
        "mb-2 flex flex-col rounded-file-download-item border border-file-download-item-border bg-file-download-item-bg p-file-download-item-p transition-colors",
        "hover:border-file-download-item-border-hover",
        hasError && "border-lifesg-bg-error-strong",
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Thumbnail or generic icon */}
        <div className="size-12 shrink-0 overflow-hidden rounded">
          {fileItem.thumbnailImageDataUrl && isImageMime(fileItem.mimeType) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fileItem.thumbnailImageDataUrl}
              alt=""
              className="h-full w-full object-cover"
              aria-hidden="true"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-lifesg-bg-strong">
              <FileIcon
                className="size-6 text-file-download-item-icon"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        {/* Name + meta */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-component-body leading-component-body font-medium text-file-download-item-text">
            {fileItem.name}
          </p>
          {(fileItem.size !== undefined || fileItem.mimeType) && (
            <p className="text-sm text-file-download-item-text-meta">
              {[fileItem.mimeType.toUpperCase().replace(/^.+\//, ""), formatFileSize(fileItem.size)]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>

        {/* Action */}
        <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
          {!ready ? (
            <span className="text-sm text-file-download-item-text-meta">
              Not ready
            </span>
          ) : (
            <button
              type="button"
              onClick={handleDownload}
              aria-label={`Download ${fileItem.name}`}
              disabled={loading}
              className="inline-flex size-10 items-center justify-center rounded-full text-file-download-item-action transition-colors hover:bg-lifesg-bg-hover disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              ) : (
                <DownloadIcon className="size-5" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </div>

      {hasError && (
        <div className="mt-3 flex items-start gap-2 text-sm text-file-download-item-error-text">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </li>
  );
}

// ---------------------------------------------------------------------------
// FileDownload
// ---------------------------------------------------------------------------

export function FileDownload({
  id,
  fileItems,
  title,
  description,
  onDownload,
  className,
  styleType = "bordered",
  "data-testid": testId,
}: FileDownloadProps) {
  const handleDownloadItem = async (item: FileItemDownloadProps) => {
    if (onDownload) await onDownload(item);
  };

  return (
    <div
      id={id ? `${id}-file-download` : "file-download"}
      data-testid={testId}
      className={cn(
        "relative flex flex-col",
        styleType === "bordered" &&
          "rounded-file-container border-2 border-dashed border-file-container-border p-file-container-p sm:p-file-container-p",
        className,
      )}
    >
      {(title || description) && (
        <div className="mb-file-gap-text-list flex flex-col gap-file-gap-title-description">
          {typeof title === "string" ? (
            <p className="text-component-header leading-component-header font-bold text-file-text-title">
              {title}
            </p>
          ) : (
            title
          )}
          {typeof description === "string" ? (
            <p className="text-component-body leading-component-body text-file-text-description">
              {description}
            </p>
          ) : (
            description
          )}
        </div>
      )}
      <ul className="list-none m-0 p-0">
        {fileItems?.map((item) => (
          <FileListCard
            key={item.id}
            fileItem={item}
            onDownload={handleDownloadItem}
          />
        ))}
      </ul>
    </div>
  );
}
