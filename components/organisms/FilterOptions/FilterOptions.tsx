import React from "react";
import { Filters } from "@models/transaction.model";
import FilterOption from "@components/molecules/FilterOption/FilterOption";

type FilterOptionsProps = {
  localFilters: Filters;
  handleFilterChange: (filter: keyof Filters) => void;
};

const FilterOptions = ({
  localFilters,
  handleFilterChange,
}: FilterOptionsProps) => {
  const filterOptions = [
    { key: "paymentTerminal", label: "Cobro con datáfono" },
    { key: "linkPayment", label: "Cobro con link de pago" },
    { key: "viewAll", label: "Ver todos" },
  ];

  return (
    <div className="filterOptions">
      {filterOptions.map((option) => (
        <FilterOption
          key={option.key}
          label={option.label}
          checked={localFilters[option.key as keyof Filters]}
          onChange={() => handleFilterChange(option.key as keyof Filters)}
        />
      ))}
    </div>
  );
};

export default FilterOptions;
