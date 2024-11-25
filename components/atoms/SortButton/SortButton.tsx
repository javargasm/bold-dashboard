import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import Button from "../Button/Button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SortButton = ({ field, currentSort, currentOrder, onClick, children }: any) => {
  const renderIcon = () => {
    const iconClass = `sort-icon ${currentSort === field ? "active" : "inactive"}`;
    if (currentSort !== field) {
      return <FiChevronUp className={iconClass} />;
    }
    return currentOrder === "asc" ? (
      <FiChevronUp className={iconClass} />
    ) : (
      <FiChevronDown className={iconClass} />
    );
  };

  return (
    <Button onClick={onClick} className="transactions-table-sort-button">
      {children}
      {renderIcon()}
    </Button>
  );
};

export default SortButton;