"use client";

import Image, { type ImageProps } from "next/image";
import { isCmsMediaUrl, resolveMediaUrl } from "@/lib/media-url";

type Props = Omit<ImageProps, "src"> & {
  src: string;
};

export default function CmsImage({ src, alt = "", unoptimized, ...props }: Props) {
  const resolved = resolveMediaUrl(src);
  const useUnoptimized =
    unoptimized ??
    (resolved.startsWith("http") || isCmsMediaUrl(resolved));

  return (
    <Image
      src={resolved}
      alt={alt}
      unoptimized={useUnoptimized}
      {...props}
    />
  );
}
