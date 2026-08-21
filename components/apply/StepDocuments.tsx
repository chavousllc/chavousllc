"use client";

import { useState } from "react";
import { FileInput } from "@/components/form/FileInput";
import { DOCUMENT_TYPES } from "@/lib/schemas";
import { uploadApplicationDocument, deleteApplicationDocument } from "@/actions/apply-draft";

export type UploadedDocument = { id: string; type: string; fileName: string; size: number };

export function StepDocuments({
  resumeToken,
  documents,
  onDocumentsChange,
}: {
  resumeToken: string;
  documents: UploadedDocument[];
  onDocumentsChange: (documents: UploadedDocument[]) => void;
}) {
  const [uploading, setUploading] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSelect(type: string, file: File) {
    setUploading(type);
    setErrors((prev) => ({ ...prev, [type]: "" }));
    const formData = new FormData();
    formData.set("type", type);
    formData.set("file", file);
    const result = await uploadApplicationDocument(resumeToken, formData);
    setUploading(null);
    if (!result.success) {
      setErrors((prev) => ({ ...prev, [type]: result.error }));
      return;
    }
    // Required document types are single-slot (a new upload replaces the old
    // one); "Additional Document" (OTHER) allows multiple.
    const withoutReplaced = documents.filter((d) => !(d.type === type && type !== "OTHER"));
    onDocumentsChange([...withoutReplaced, result.document]);
  }

  async function handleRemove(doc: UploadedDocument) {
    onDocumentsChange(documents.filter((d) => d.id !== doc.id));
    await deleteApplicationDocument(resumeToken, doc.id);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink-900">Documents</h2>
      <p className="mt-2 text-sm text-ink-500">Upload clear photos or scans (PDF, JPG, or PNG).</p>
      <div className="mt-6 space-y-5">
        {DOCUMENT_TYPES.map((docType) => {
          const existing = documents.find((d) => d.type === docType.value && docType.value !== "OTHER");
          return (
            <FileInput
              key={docType.value}
              label={docType.label}
              required={docType.required}
              fileName={existing?.fileName}
              uploading={uploading === docType.value}
              error={errors[docType.value]}
              onSelect={(file) => handleSelect(docType.value, file)}
              onRemove={existing ? () => handleRemove(existing) : undefined}
            />
          );
        })}
        {documents
          .filter((d) => d.type === "OTHER")
          .map((doc) => (
            <FileInput
              key={doc.id}
              label="Additional Document"
              fileName={doc.fileName}
              onRemove={() => handleRemove(doc)}
            />
          ))}
      </div>
    </div>
  );
}
