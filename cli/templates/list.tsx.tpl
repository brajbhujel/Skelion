import { Skeleton } from "skelion";
import "skelion/styles.css";

export function {{name}}Skeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <Skeleton.Circle size={40} animation="{{animation}}" />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <Skeleton.Text width="60%" height={14} animation="{{animation}}" />
            <Skeleton.Text width="40%" height={12} animation="{{animation}}" />
          </div>
          <Skeleton.Block width={60} height={28} animation="{{animation}}" />
        </div>
      ))}
    </div>
  );
}
