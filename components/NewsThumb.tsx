"use client";

export function NewsThumb({ src, fit = "cover" }: { src: string; fit?: "cover" | "contain" }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={fit === "contain" ? "news-thumb news-thumb-contain" : "news-thumb"}
      src={src}
      alt=""
      loading="lazy"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}
