import './Input.styles.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
  isLoading?: boolean;
}

const Input = ({
  icon,
  error,
  className = "",
  ...props
}: InputProps) => {
  const inputClassName = [
    "input",
    icon ? "withIcon" : "",
    error ? "error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="inputWrapper">
      {icon && <div className="inputIcon">{icon}</div>}
      <input className={inputClassName} {...props} />
      {error && <span className="errorMessage">{error}</span>}
    </div>
  );
};

export default Input;
