"use client";

export function NewsThumb({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="news-thumb"
      src={src}
      alt=""
      loading="lazy"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}
