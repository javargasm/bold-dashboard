import { FiSearch } from "react-icons/fi";
import Input from "../Input/Input";
import { ChangeEventHandler } from "react";

interface SearchInputProps {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
}
const SearchInput = ({ value, onChange, placeholder }: SearchInputProps) => (
  <div className="transactions-table-search-input">
    <FiSearch className="transactions-table-search-icon" />
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="transactions-table-input"
    />
  </div>
);

export default SearchInput;
