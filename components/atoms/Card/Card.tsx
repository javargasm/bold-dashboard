import React from "react";
import "./Card.styles.css";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  children: React.ReactNode;
  classNameContent?: string;
}

const Card = ({
  header,
  children,
  className = "",
  classNameContent = "",
  ...props
}: CardProps) => {
  return (
    <div className={`card ${className}`} {...props}>
      {header && <div className="card-header">{header}</div>}
      <div className={`card-content ${classNameContent}`}>{children}</div>
    </div>
  );
};

export default Card;
