interface WatchItem {
  date: string;
  label: string;
}

export function WhatToWatch({ items }: { items: WatchItem[] }) {
  return (
    <section className="section">
      <div className="section-label">What to Watch</div>
      <div className="card">
        <ul className="watch-list">
          {items.map((item) => (
            <li className="watch-item" key={item.label}>
              <div className="watch-date">{item.date}</div>
              <div className="watch-label">{item.label}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
