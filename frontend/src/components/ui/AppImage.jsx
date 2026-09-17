import Image from "next/image";

const optimizedHosts = new Set(["res.cloudinary.com", "images.unsplash.com"]);

export default function AppImage({ src, alt = "", width = 800, height = 800, sizes, ...props }) {
  if (!src || (typeof src !== "string" && typeof src?.src !== "string")) {
    return <span role="img" aria-label={alt || "Image unavailable"} className={props.className}/>;
  }
  let unoptimized = false;
  if (typeof src === "string") {
    if (src.startsWith("blob:") || src.startsWith("data:")) unoptimized = true;
    else if (src.startsWith("http")) {
      try { unoptimized = !optimizedHosts.has(new URL(src).hostname); }
      catch { unoptimized = true; }
    }
  }
  return <Image src={src} alt={alt} width={width} height={height} sizes={sizes || "(max-width: 768px) 100vw, 50vw"} unoptimized={unoptimized} {...props}/>;
}
