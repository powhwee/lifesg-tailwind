"use client";

import { useState } from "react";
import { FileUpload, type FileItemProps } from "@/components/ui/file-upload";
import { FileUpload as LifeSGFileUpload } from "@lifesg/react-design-system/file-upload";
import type { FileItemProps as LifeSGFileItem } from "@lifesg/react-design-system/file-upload";

const seed: FileItemProps[] = [
  {
    id: "1",
    name: "Photo of NRIC.jpg",
    type: "image/jpeg",
    size: 482_910,
    description: "Front side",
  },
  {
    id: "2",
    name: "Supporting document.pdf",
    type: "application/pdf",
    size: 1_192_004,
  },
];

export function OursPane() {
  const [items, setItems] = useState<FileItemProps[]>(seed);
  return (
    <div className="flex flex-col gap-8" data-testid="form-file-upload-ours">
      <section>
        <code className="text-xs text-muted-foreground">bordered &mdash; basic</code>
        <div className="mt-3">
          <FileUpload
            title="Upload your supporting documents"
            description="PDF, JPG or PNG · 10 MB max per file."
            fileItems={items}
            onChange={(files) => {
              const next = files.map((f, i) => ({
                id: `${Date.now()}-${i}`,
                name: f.name,
                type: f.type,
                size: f.size,
              }));
              setItems((s) => [...s, ...next]);
            }}
            onDelete={(item) => setItems((s) => s.filter((f) => f.id !== item.id))}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">no-border</code>
        <div className="mt-3">
          <FileUpload styleType="no-border" fileItems={seed} />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [items, setItems] = useState<LifeSGFileItem[]>(
    seed.map((s) => ({ ...s })) as LifeSGFileItem[],
  );
  return (
    <div className="flex flex-col gap-8" data-testid="form-file-upload-lifesg">
      <section>
        <code className="text-xs text-muted-foreground">bordered &mdash; basic</code>
        <div className="mt-3">
          <LifeSGFileUpload
            title="Upload your supporting documents"
            description="PDF, JPG or PNG · 10 MB max per file."
            fileItems={items}
            onChange={(files) => {
              const next: LifeSGFileItem[] = files.map((f, i) => ({
                id: `${Date.now()}-${i}`,
                name: f.name,
                type: f.type,
                size: f.size,
              }));
              setItems((s) => [...s, ...next]);
            }}
            onDelete={(item) => setItems((s) => s.filter((f) => f.id !== item.id))}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">no-border</code>
        <div className="mt-3">
          <LifeSGFileUpload styleType="no-border" fileItems={seed as LifeSGFileItem[]} />
        </div>
      </section>
    </div>
  );
}
