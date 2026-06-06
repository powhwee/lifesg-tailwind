"use client";

import { FileDownload, type FileItemDownloadProps } from "@/components/ui/file-download";
import { FileDownload as LifeSGFileDownload } from "@lifesg/react-design-system/file-download";

const sample: FileItemDownloadProps[] = [
  {
    id: "1",
    name: "Application form.pdf",
    mimeType: "application/pdf",
    size: 348_204,
    filePath: "/files/application.pdf",
  },
  {
    id: "2",
    name: "Proof of address.jpg",
    mimeType: "image/jpeg",
    size: 1_482_910,
    filePath: "/files/proof.jpg",
  },
  {
    id: "3",
    name: "Salary slip — January.pdf",
    mimeType: "application/pdf",
    size: 92_341,
    filePath: "/files/salary.pdf",
  },
];

export function OursPane() {
  return (
    <div className="flex flex-col gap-8" data-testid="form-file-download-ours">
      <section>
        <code className="text-xs text-muted-foreground">bordered</code>
        <div className="mt-3">
          <FileDownload
            title="Reference documents"
            description="Download the materials you need to complete your application."
            fileItems={sample}
            onDownload={async () => {
              await new Promise((r) => setTimeout(r, 200));
            }}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">no-border</code>
        <div className="mt-3">
          <FileDownload
            styleType="no-border"
            title="Reference documents"
            fileItems={sample}
            onDownload={async () => {
              await new Promise((r) => setTimeout(r, 200));
            }}
          />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-8" data-testid="form-file-download-lifesg">
      <section>
        <code className="text-xs text-muted-foreground">bordered</code>
        <div className="mt-3">
          <LifeSGFileDownload
            title="Reference documents"
            description="Download the materials you need to complete your application."
            fileItems={sample}
            onDownload={async () => {
              await new Promise((r) => setTimeout(r, 200));
            }}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">no-border</code>
        <div className="mt-3">
          <LifeSGFileDownload
            styleType="no-border"
            title="Reference documents"
            fileItems={sample}
            onDownload={async () => {
              await new Promise((r) => setTimeout(r, 200));
            }}
          />
        </div>
      </section>
    </div>
  );
}
