import Checkbox from "@components/atoms/Checkbox/Checkbox";


type FilterOptionProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
};

const FilterOption = ({
  label,
  checked,
  onChange,
}: FilterOptionProps) => {
  return (
    <label className="filterOption">
      <Checkbox
        checked={checked}
        onChange={onChange}
        className="filterCheckbox"
      />
      <span className="filterOptionText">{label}</span>
    </label>
  );
};

export default FilterOption;
