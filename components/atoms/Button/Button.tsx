import './Button.styles.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "xs" | "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  tooltip?: string;
}

const Button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  className = "",
  children,
  disabled,
  tooltip,
  ...props
}: ButtonProps) => {
  const classes = [
    "button",
    variant,
    size,
    fullWidth ? "fullWidth" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes + " button-wrapper"}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? "Cargando..." : children}
      {tooltip && (
        <div className="tooltip">
          <p>{tooltip}</p>
        </div>
      )}
    </button>
  );
};

export default Button;
