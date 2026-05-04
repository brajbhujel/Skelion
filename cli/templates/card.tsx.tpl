import { Skeleton } from "skelion";
import "skelion/styles.css";

export function {{name}}Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Skeleton.Block width="100%" height={160} animation="{{animation}}" />
      <Skeleton.Text width="70%" height={18} animation="{{animation}}" />
      <Skeleton.Text width="100%" height={14} animation="{{animation}}" />
      <Skeleton.Text width="85%" height={14} animation="{{animation}}" />
    </div>
  );
}
