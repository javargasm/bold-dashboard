import FilterPanelHeader from "@components/organisms/FilterPanelHeader/FilterPanelHeader";
import { Filters } from "@models/transaction.model";
import React from "react";
import FilterOptions from "../FilterOptions/FilterOptions";
import Button from "@components/atoms/Button/Button";


type FilterPanelProps = {
  localFilters: Filters;
  handleFilterChange: (filter: keyof Filters) => void;
  handleApply: () => void;
  onClose: () => void;
  isAnyFilterSelected: boolean;
};

const FilterPanel = ({
  localFilters,
  handleFilterChange,
  handleApply,
  onClose,
  isAnyFilterSelected,
}: FilterPanelProps) => {
  return (
    <div className="filterPanelContent">
      <FilterPanelHeader onClose={onClose} />
      <FilterOptions
        localFilters={localFilters}
        handleFilterChange={handleFilterChange}
      />
      <Button
        onClick={handleApply}
        disabled={!isAnyFilterSelected}
        className={`applyButton ${
          !isAnyFilterSelected ? "applyButtonDisabled" : ""
        }`}
      >
        Aplicar
      </Button>
    </div>
  );
};

export default FilterPanel;
