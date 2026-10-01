import Image from "next/image";

function canOptimize(src: string) {
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export function CoverImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "object-cover",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) return null;
  if (canOptimize(src)) {
    return <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={className} />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      loader={({ src: imageSrc }) => imageSrc}
      sizes={sizes}
      className={className}
    />
  );
}
