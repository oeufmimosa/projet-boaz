"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ImageSpec, checkDimensions, getRatioTolerance } from "@/lib/imageSpecs";
import { suggestQueryForImageKey } from "@/lib/stock-images";
import { StockImagesPanel } from "./StockImagesPanel";

interface UploadResponse {
  ok: boolean;
  data?: { id: string; url: string; width: number; height: number; dimWarning?: string };
  error?: string;
}

type Tab = "upload" | "stock";

/**
 * Modale d'upload d'image avec deux onglets :
 *  - **Téléverser** (par défaut) : drop-zone classique, upload local
 *  - **Photos libres** : recherche Unsplash/Pexels via les API gratuites
 *    (sources LÉGALES uniquement). Si la clé d'API n'est pas configurée,
 *    le panneau affiche un guide de configuration au lieu de planter.
 */
export function ImageUploadModal({
  open,
  onClose,
  spec,
  imageKey,
  currentUrl,
  onUploaded,
}: {
  open: boolean;
  onClose: () => void;
  spec: ImageSpec;
  imageKey: string;
  currentUrl?: string | null;
  onUploaded: (newUrl: string) => void;
}) {
  const [tab, setTab] = useState<Tab>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [autoResize, setAutoResize] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setPreviewUrl(null);
      setDimensions(null);
      setError(null);
      setWarning(null);
      setTab("upload");
    }
  }, [open]);

  const acceptedMime = spec.acceptedFormats.map((f) =>
    f === "jpg" ? "image/jpeg" : f === "svg" ? "image/svg+xml" : `image/${f}`,
  ).join(",");

  const handleFile = (f: File) => {
    setError(null);
    setWarning(null);
    setFile(null);
    setPreviewUrl(null);
    setDimensions(null);

    const ext = (f.name.split(".").pop() ?? "").toLowerCase();
    const ok = spec.acceptedFormats.includes(ext as never)
      || (ext === "jpeg" && spec.acceptedFormats.includes("jpg"));
    if (!ok) {
      setError(`Format non accepté. Formats autorisés : ${spec.acceptedFormats.join(", ").toUpperCase()}`);
      return;
    }
    if (f.size > spec.maxSizeKb * 1024) {
      setError(`Fichier trop lourd (${Math.round(f.size / 1024)} Ko, max ${spec.maxSizeKb} Ko)`);
      return;
    }

    if (f.type === "image/svg+xml") {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
      return;
    }

    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setDimensions({ w: img.width, h: img.height });
      const dim = checkDimensions(spec, img.width, img.height);
      if (!dim.ok) {
        setWarning(dim.message ?? null);
      }
      setFile(f);
      setPreviewUrl(url);
    };
    img.onerror = () => {
      setError("Impossible de lire l'image.");
    };
    img.src = url;
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("imageKey", imageKey);
      fd.append("draft", "true");
      if (autoResize && warning) fd.append("autoResize", "true");
      const csrf = (typeof document !== "undefined")
        ? (document.cookie.match(/bz_csrf=([^;]+)/)?.[1] ?? "")
        : "";
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
        headers: { "x-csrf-token": csrf },
      });
      const body: UploadResponse = await res.json();
      if (!res.ok || !body.ok) {
        setError(body.error ?? "Erreur upload");
        return;
      }
      onUploaded(body.data!.url);
      onClose();
    } finally {
      setUploading(false);
    }
  };

  const tolerance = Math.round(getRatioTolerance(spec) * 100);
  const initialQuery = suggestQueryForImageKey(imageKey);

  return (
    <Modal open={open} onClose={onClose} title={`Image — ${spec.label}`}>
      <div className="p-6 space-y-5">
        <div>
          <h2 className="font-display text-display-sm">{spec.label}</h2>
          <p className="text-body-sm text-text-muted">
            Clé : <code>{imageKey}</code> — {spec.description}
          </p>
        </div>

        {/* Onglets */}
        <div role="tablist" aria-label="Sources d'images" className="flex border-b border-border">
          <TabButton active={tab === "upload"} onClick={() => setTab("upload")}>
            📁 Téléverser
          </TabButton>
          <TabButton active={tab === "stock"} onClick={() => setTab("stock")}>
            🌐 Photos libres
          </TabButton>
        </div>

        {tab === "upload" && (
          <UploadTab
            spec={spec}
            tolerance={tolerance}
            acceptedMime={acceptedMime}
            file={file}
            previewUrl={previewUrl}
            dimensions={dimensions}
            error={error}
            warning={warning}
            uploading={uploading}
            autoResize={autoResize}
            currentUrl={currentUrl ?? null}
            inputRef={inputRef}
            onFile={handleFile}
            onAutoResize={setAutoResize}
            onClose={onClose}
            onUpload={upload}
          />
        )}

        {tab === "stock" && (
          <StockImagesPanel
            initialQuery={initialQuery}
            spec={spec}
            imageKey={imageKey}
            onSelected={(url) => {
              onUploaded(url);
              onClose();
            }}
            onCancel={onClose}
          />
        )}
      </div>
    </Modal>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`px-4 py-2 -mb-px border-b-2 text-body-sm font-semibold transition-colors ${
        active
          ? "border-primary-700 text-primary-700"
          : "border-transparent text-text-muted hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}

function UploadTab({
  spec,
  tolerance,
  acceptedMime,
  file,
  previewUrl,
  dimensions,
  error,
  warning,
  uploading,
  autoResize,
  currentUrl,
  inputRef,
  onFile,
  onAutoResize,
  onClose,
  onUpload,
}: {
  spec: ImageSpec;
  tolerance: number;
  acceptedMime: string;
  file: File | null;
  previewUrl: string | null;
  dimensions: { w: number; h: number } | null;
  error: string | null;
  warning: string | null;
  uploading: boolean;
  autoResize: boolean;
  currentUrl: string | null;
  inputRef: React.RefObject<HTMLInputElement>;
  onFile: (f: File) => void;
  onAutoResize: (b: boolean) => void;
  onClose: () => void;
  onUpload: () => void;
}) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <SpecBlock icon="📐" label="Dimensions">
          <strong>{spec.width} × {spec.height} px</strong>
          <span className="text-body-sm text-text-muted">Tolérance ±{tolerance}%</span>
        </SpecBlock>
        <SpecBlock icon="📦" label="Formats">
          <strong>{spec.acceptedFormats.join(", ").toUpperCase()}</strong>
        </SpecBlock>
        <SpecBlock icon="⚖️" label="Poids max">
          <strong>{spec.maxSizeKb >= 1024 ? `${Math.round(spec.maxSizeKb / 1024)} Mo` : `${spec.maxSizeKb} Ko`}</strong>
        </SpecBlock>
      </div>

      <div
        className="rounded-md border-2 border-dashed border-primary-300 bg-primary-50/40 p-6 text-center cursor-pointer hover:bg-primary-50"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); }}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) onFile(f);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedMime}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
        <p className="font-display font-semibold text-primary-700">
          Glissez une image ou cliquez ici
        </p>
        <p className="mt-1 text-body-sm text-text-muted">
          {spec.acceptedFormats.join(" / ").toUpperCase()} — max {spec.maxSizeKb >= 1024 ? `${Math.round(spec.maxSizeKb / 1024)} Mo` : `${spec.maxSizeKb} Ko`}
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-md border border-error/40 bg-error/10 px-4 py-3 text-body-sm text-error">
          {error}
        </div>
      )}

      {warning && (
        <div role="status" className="rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-body-sm text-warning">
          ⚠️ {warning}
          <label className="mt-2 flex items-center gap-2 text-text">
            <input type="checkbox" checked={autoResize} onChange={(e) => onAutoResize(e.target.checked)} className="h-4 w-4" />
            Redimensionner automatiquement aux dimensions cibles à l'upload (recadrage `cover`)
          </label>
        </div>
      )}

      {previewUrl && (
        <div className="rounded-md border border-border bg-surface-2 p-4">
          <p className="mb-2 text-body-sm font-semibold text-text-muted">
            Aperçu {dimensions ? `(${dimensions.w}×${dimensions.h}px)` : ""}
          </p>
          <PreviewShape url={previewUrl} shape={spec.renderShape ?? "rect"} ratio={spec.width / spec.height} />
        </div>
      )}

      {currentUrl && !previewUrl && (
        <div className="rounded-md border border-border bg-surface-2 p-4">
          <p className="mb-2 text-body-sm font-semibold text-text-muted">Image actuelle</p>
          <PreviewShape url={currentUrl} shape={spec.renderShape ?? "rect"} ratio={spec.width / spec.height} />
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Annuler</Button>
        <Button variant="primary" onClick={onUpload} disabled={!file || uploading}>
          {uploading ? "Téléversement…" : "Utiliser cette image"}
        </Button>
      </div>
    </>
  );
}

function SpecBlock({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-surface p-3">
      <p className="text-body-sm text-text-muted">{icon} {label}</p>
      <p className="mt-1 flex flex-col">{children}</p>
    </div>
  );
}

function PreviewShape({ url, shape, ratio }: { url: string; shape: "rect" | "rounded" | "hexagon" | "circle"; ratio: number }) {
  const common = "max-w-full max-h-64";
  const aspect = `aspect-[${Math.round(ratio * 1000) / 1000}]`;
  const style = { aspectRatio: ratio } as React.CSSProperties;
  if (shape === "circle") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" className={`${common} ${aspect} rounded-full object-cover`} style={style} />;
  }
  if (shape === "rounded") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" className={`${common} ${aspect} rounded-lg object-cover`} style={style} />;
  }
  if (shape === "hexagon") {
    return (
      <div className="relative" style={{ width: 200, height: 230 }}>
        <svg viewBox="0 0 56 64" className="absolute inset-0 h-full w-full">
          <defs>
            <clipPath id="hex-clip"><path d="M28 2 52 16v32L28 62 4 48V16Z" /></clipPath>
          </defs>
          <image href={url} x="0" y="0" width="56" height="64" preserveAspectRatio="xMidYMid slice" clipPath="url(#hex-clip)" />
        </svg>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" className={`${common} object-cover`} style={style} />;
}
