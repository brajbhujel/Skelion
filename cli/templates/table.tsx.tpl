import { Skeleton } from "skelion";
import "skelion/styles.css";

export function {{name}}Skeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Header row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 12,
          padding: "12px 8px",
        }}
      >
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton.Text
            key={`header-${i}`}
            width="80%"
            height={14}
            animation="{{animation}}"
          />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }, (_, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: 12,
            padding: "10px 8px",
          }}
        >
          {Array.from({ length: columns }, (_, colIdx) => (
            <Skeleton.Text
              key={`cell-${rowIdx}-${colIdx}`}
              width={colIdx === 0 ? "60%" : "70%"}
              height={12}
              animation="{{animation}}"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
