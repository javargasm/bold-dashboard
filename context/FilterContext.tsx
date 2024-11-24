"use client";

import { FilterPeriod, Filters } from "@models/transaction.model";
import { createContext, useContext, useState } from "react";

type FiltersContextType = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  activePeriod: FilterPeriod;
  setActivePeriod: (period: FilterPeriod) => void;
};

const FiltersContextDefaultValues: FiltersContextType = {
  filters: { paymentTerminal: true, linkPayment: true, viewAll: true },
  setFilters: () => {},
  activePeriod: "month",
  setActivePeriod: () => {},
};

const FiltersContext = createContext<FiltersContextType>(
  FiltersContextDefaultValues
);

export const useFiltersContext = () => {
  return useContext(FiltersContext);
};

export const FiltersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [filters, setFilters] = useState<Filters>({
    paymentTerminal: true,
    linkPayment: true,
    viewAll: true,
  });

  const [activePeriod, setActivePeriod] = useState<FilterPeriod>("month");



  return (
    <FiltersContext.Provider value={{ filters, setFilters, activePeriod, setActivePeriod }}>
      {children}
    </FiltersContext.Provider>
  );
};
