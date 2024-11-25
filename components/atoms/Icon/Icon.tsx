import React from "react";
import { FiSliders, FiX } from "react-icons/fi";

type IconProps = {
  name: "FiSliders" | "FiX";
  className?: string;
};

const Icon = ({ name, className }: IconProps) => {
  const IconComponent = name === "FiSliders" ? FiSliders : FiX;
  return <IconComponent className={className} />;
};

export default Icon;
