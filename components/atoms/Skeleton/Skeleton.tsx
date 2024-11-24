import React from "react";
import "./Skeleton.styles.css";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  animation?: "pulse" | "wave";
  style?: React.CSSProperties;
}

const Skeleton = ({
  className = "",
  width = "100%",
  height = "1rem",
  borderRadius = "0.25rem",
  animation = "wave",
  style = {},
}: SkeletonProps) => {
  return (
    <div
      className={`skeleton skeleton--${animation} ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius:
          typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
        ...style,
      }}
    />
  );
};

export default Skeleton;

