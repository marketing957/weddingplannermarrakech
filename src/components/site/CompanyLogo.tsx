"use client";

import { useEffect, useRef, useState } from "react";
import { initials } from "@/lib/format";

const MAX_RATIO = 2.6;

export function CompanyLogo({
  name,
  src,
  size = 40,
  className = "",
}: {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [ratio, setRatio] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const showImg = Boolean(src) && !failed;

  function measure(img: HTMLImageElement) {
    if (!img.naturalWidth || !img.naturalHeight) return;
    const r = img.naturalWidth / img.naturalHeight;
    setRatio(r > 1.25 ? Math.min(r, MAX_RATIO) : 1);
  }

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) measure(img);
  }, [src]);

  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center overflow-hidden border border-sand-deep bg-white ${className}`}
      style={{ width: Math.round(size * ratio), height: size }}
      title={name}
    >
      {showImg ? (
        // Local + favicon CDNs; keep native img so SVG and onError both work.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src!}
          alt={`${name} logo`}
          className="h-full w-full object-contain p-0.5"
          onLoad={(e) => measure(e.currentTarget)}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="grid h-[85%] w-[85%] place-items-center rounded-full border border-saffron/80 font-display text-[10px] font-medium leading-none text-ink">
          {initials(name)}
        </span>
      )}
    </span>
  );
}
