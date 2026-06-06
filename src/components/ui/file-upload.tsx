"use client";

import * as React from "react";
import {
  Upload as UploadIcon,
  Trash2,
  CloudUpload,
  AlertCircle,
  GripVertical,
  Pencil,
} from "lucide-react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Types — mirrored from @lifesg/react-design-system/file-upload
// ---------------------------------------------------------------------------

export interface FileItemProps {
  id: string;
  name: string;
  type: string;
  size: number;
  description?: string;
  /** Upload progress 0–1 */
  progress?: number;
  errorMessage?: string | React.ReactNode;
  thumbnailImageDataUrl?: string;
  truncateText?: boolean;
}

export type FileUploadStyle = "bordered" | "no-border";

export interface FileUploadProps {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  styleType?: FileUploadStyle;
  fileItems?: FileItemProps[];
  maxFiles?: number;
  warning?: string | React.ReactNode;
  errorMessage?: string | React.ReactNode;
  readOnly?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  capture?: boolean | "user" | "environment";
  name?: string;
  className?: string;
  id?: string;
  "data-testid"?: string;
  /** If set, image file items will have editable descriptions. */
  editableFileItems?: boolean;
  /** Max length of the description (only image files when editableFileItems). */
  fileDescriptionMaxLength?: number;
  /** Enables drag-and-drop reordering of the file list. */
  sortable?: boolean;
  customLabels?: { uploadButtonLabel?: string };
  onChange?: (files: File[]) => void;
  onEdit?: (item: FileItemProps) => void;
  onDelete?: (item: FileItemProps) => void;
  onSort?: (items: FileItemProps[]) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function isImageMime(mime: string): boolean {
  return mime.startsWith("image/");
}

// ---------------------------------------------------------------------------
// FileItemRow — internal row
// ---------------------------------------------------------------------------

interface FileItemRowProps {
  item: FileItemProps;
  sortable: boolean;
  editableFileItems: boolean;
  fileDescriptionMaxLength?: number;
  readOnly?: boolean;
  disabled?: boolean;
  onDelete?: (item: FileItemProps) => void;
  onEdit?: (item: FileItemProps) => void;
}

function FileItemRow({
  item,
  sortable,
  editableFileItems,
  fileDescriptionMaxLength,
  readOnly,
  disabled,
  onDelete,
  onEdit,
}: FileItemRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: !sortable || disabled || readOnly });

  const [editing, setEditing] = React.useState(false);
  const [draftDescription, setDraftDescription] = React.useState(item.description ?? "");

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const hasError = !!item.errorMessage;
  const isImage = isImageMime(item.type);
  const canEdit = editableFileItems && isImage && !readOnly && !disabled;

  const saveDescription = () => {
    setEditing(false);
    if (onEdit && draftDescription !== item.description) {
      onEdit({ ...item, description: draftDescription });
    }
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "mb-2 flex flex-col rounded-file-upload-item border border-file-upload-item-border bg-file-upload-item-bg p-file-upload-item-p",
        hasError && "border-file-upload-item-border-error bg-file-upload-item-bg-error",
      )}
    >
      <div className="flex items-start gap-3">
        {sortable && !readOnly && (
          <button
            type="button"
            className="mt-1 inline-flex size-6 shrink-0 cursor-grab items-center justify-center text-file-upload-item-icon disabled:cursor-not-allowed disabled:opacity-40 active:cursor-grabbing"
            aria-label={`Reorder ${item.name}`}
            disabled={disabled}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" aria-hidden="true" />
          </button>
        )}

        {/* Thumbnail */}
        <div className="size-12 shrink-0 overflow-hidden rounded">
          {item.thumbnailImageDataUrl && isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.thumbnailImageDataUrl}
              alt=""
              className="h-full w-full object-cover"
              aria-hidden="true"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-lifesg-bg-strong">
              <UploadIcon className="size-5 text-file-upload-item-icon" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Name + meta */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-component-body leading-component-body font-medium text-file-upload-item-text">
            {item.name}
          </p>
          <p className="text-sm text-file-upload-item-text-meta">
            {[item.type.toUpperCase().replace(/^.+\//, ""), formatFileSize(item.size)]
              .filter(Boolean)
              .join(" · ")}
          </p>

          {item.progress !== undefined && item.progress < 1 && (
            <div
              className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-file-upload-item-progress-bg"
              role="progressbar"
              aria-label={`${item.name} upload progress`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(item.progress * 100)}
            >
              <div
                className="h-full bg-file-upload-item-progress-fill transition-[width] duration-200"
                style={{ width: `${Math.round(item.progress * 100)}%` }}
              />
            </div>
          )}

          {canEdit && (
            <div className="mt-2">
              {editing ? (
                <div className="flex flex-col gap-1">
                  <textarea
                    autoFocus
                    value={draftDescription}
                    maxLength={fileDescriptionMaxLength}
                    onChange={(e) => setDraftDescription(e.target.value)}
                    onBlur={saveDescription}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        saveDescription();
                      } else if (e.key === "Escape") {
                        setEditing(false);
                        setDraftDescription(item.description ?? "");
                      }
                    }}
                    className="w-full resize-none rounded border border-input-border bg-input-bg px-2 py-1 text-sm focus:border-input-border-focus focus:outline-none"
                    rows={2}
                    aria-label={`Edit description for ${item.name}`}
                  />
                  {fileDescriptionMaxLength !== undefined && (
                    <span className="text-xs text-file-upload-item-text-meta">
                      {draftDescription.length} / {fileDescriptionMaxLength}
                    </span>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1 text-sm text-lifesg-text-primary hover:underline"
                >
                  <Pencil className="size-3" aria-hidden="true" />
                  {item.description || "Add description"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Delete */}
        {!readOnly && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(item)}
            aria-label={`Remove ${item.name}`}
            disabled={disabled}
            className="inline-flex size-10 items-center justify-center rounded-full text-file-upload-item-icon transition-colors hover:bg-lifesg-bg-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {hasError && (
        <div className="mt-3 flex items-start gap-2 text-sm text-lifesg-text-error">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{item.errorMessage}</span>
        </div>
      )}
    </li>
  );
}

// ---------------------------------------------------------------------------
// FileUpload
// ---------------------------------------------------------------------------

export function FileUpload({
  styleType = "bordered",
  fileItems = [],
  title,
  description,
  maxFiles,
  warning,
  errorMessage,
  readOnly = false,
  disabled = false,
  multiple = true,
  accept,
  capture,
  name,
  className,
  id,
  "data-testid": testId,
  editableFileItems = false,
  fileDescriptionMaxLength,
  sortable = false,
  customLabels,
  onChange,
  onEdit,
  onDelete,
  onSort,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const dragCounter = React.useRef(0);

  const reachedMaxFiles = maxFiles !== undefined && fileItems.length >= maxFiles;
  const interactionDisabled = disabled || readOnly || reachedMaxFiles;

  const handleFiles = (files: FileList | File[] | null) => {
    if (!files || interactionDisabled || !onChange) return;
    const arr = Array.from(files);
    if (arr.length === 0) return;
    onChange(arr);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    // Reset value so the same file can be re-selected.
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUploadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (interactionDisabled) return;
    inputRef.current?.click();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (interactionDisabled) return;
    dragCounter.current++;
    if (event.dataTransfer.types.includes("Files")) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragOver(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounter.current = 0;
    setIsDragOver(false);
    if (interactionDisabled) return;
    handleFiles(event.dataTransfer.files);
  };

  // ---- sortable wiring -----------------------------------------------------

  const sensors = useSensors(useSensor(MouseSensor), useSensor(KeyboardSensor));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleSortEnd = (event: DragEndEvent) => {
    setActiveId(null);
    if (!onSort) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = fileItems.findIndex((f) => f.id === active.id);
    const newIndex = fileItems.findIndex((f) => f.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onSort(arrayMove(fileItems, oldIndex, newIndex));
  };

  const uploadButtonLabel = customLabels?.uploadButtonLabel ?? "Upload files";

  return (
    <div
      id={id ? `${id}-dropzone` : "dropzone"}
      data-testid={testId}
      className={cn(
        "relative flex flex-col",
        styleType === "bordered" &&
          "rounded-file-container border-2 border-dashed border-file-container-border p-file-container-p",
        className,
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        capture={capture}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
        data-testid={testId ? `${testId}-input` : "dropzone-input"}
      />

      {/* Drag overlay */}
      {isDragOver && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-file-container border-2 border-dashed border-file-upload-overlay-border bg-file-upload-overlay-bg"
          aria-hidden="true"
        >
          <CloudUpload className="size-file-upload-overlay-icon-size text-file-upload-overlay-icon" />
          <p className="mt-2 text-component-body leading-component-body font-semibold text-file-upload-overlay-text">
            Drop files here
          </p>
        </div>
      )}

      {(title || description) && (
        <div className="mb-file-gap-text-list flex flex-col gap-file-gap-title-description">
          {typeof title === "string" ? (
            <p className="text-component-body leading-component-body font-semibold text-file-text-title">
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

      {warning && (
        <div
          role="status"
          className="mb-file-gap-text-list flex items-start gap-2 rounded border border-lifesg-bg-warning-strong bg-lifesg-bg-warning p-3 text-sm text-lifesg-text"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-lifesg-icon-warning" aria-hidden="true" />
          <span>{warning}</span>
        </div>
      )}

      {fileItems.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleSortEnd}
        >
          <SortableContext
            items={fileItems.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="list-none m-0 p-0">
              {fileItems.map((item) => (
                <FileItemRow
                  key={item.id}
                  item={item}
                  sortable={sortable}
                  editableFileItems={editableFileItems}
                  fileDescriptionMaxLength={fileDescriptionMaxLength}
                  readOnly={readOnly}
                  disabled={disabled}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </ul>
          </SortableContext>
          <DragOverlay>
            {activeId
              ? (() => {
                  const active = fileItems.find((f) => f.id === activeId);
                  if (!active) return null;
                  return (
                    <div className="rounded-file-upload-item border border-file-upload-item-border bg-file-upload-item-active-bg p-file-upload-item-p shadow-md">
                      <p className="truncate text-component-body leading-component-body font-medium text-file-upload-item-text">
                        {active.name}
                      </p>
                    </div>
                  );
                })()
              : null}
          </DragOverlay>
        </DndContext>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="mt-file-gap-text-list flex items-start gap-2 rounded border border-lifesg-bg-error-strong bg-lifesg-bg-error p-3 text-sm text-lifesg-text-error"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!readOnly && (
        <div className="mt-4 flex w-full flex-col items-end md:items-end">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={disabled || reachedMaxFiles}
            onClick={handleUploadClick}
            className="w-file-upload-button-w max-md:w-full"
          >
            {uploadButtonLabel}
          </Button>
          <p className="mt-2 w-file-upload-button-w text-center text-sm text-file-upload-helper-text max-md:hidden">
            or drop them here
          </p>
        </div>
      )}
    </div>
  );
}
