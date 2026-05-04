import { Skeleton } from "skelion";
import "skelion/styles.css";

export function {{name}}Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: 24 }}>
      <Skeleton.Circle size={96} animation="{{animation}}" />
      <Skeleton.Text width={180} height={20} animation="{{animation}}" />
      <Skeleton.Text width={120} height={14} animation="{{animation}}" />
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
        <Skeleton.Text width="100%" height={14} animation="{{animation}}" />
        <Skeleton.Text width="90%" height={14} animation="{{animation}}" />
        <Skeleton.Text width="75%" height={14} animation="{{animation}}" />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <Skeleton.Block width={100} height={36} animation="{{animation}}" />
        <Skeleton.Block width={100} height={36} animation="{{animation}}" />
      </div>
    </div>
  );
}
