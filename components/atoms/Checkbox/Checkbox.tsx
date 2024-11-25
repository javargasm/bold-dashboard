

interface CheckboxProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean;
  onChange: () => void;
  className?: string;
}

const Checkbox = ({ checked, onChange, className }: CheckboxProps) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={className}
    />
  );
};

export default Checkbox;
