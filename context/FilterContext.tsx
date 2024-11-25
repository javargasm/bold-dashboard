"use client";

import { FilterPeriod, Filters } from "@models/transaction.model";
import { createContext, useContext, useState } from "react";
import { Cookies } from "react-cookie";

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
  const [filters, setFilters] = useState<Filters>(() => {
    const filterCookies = new Cookies().get("FILTERS");
    if (filterCookies) {
      return filterCookies;
    }
    return { paymentTerminal: true, linkPayment: true, viewAll: true };
  });

  const [activePeriod, setActivePeriod] = useState<FilterPeriod>(() => {
    const period = new Cookies().get("PERIOD");
    if (period) {
      return period;
    }
    return "month";
  });

  return (
    <FiltersContext.Provider
      value={{ filters, setFilters, activePeriod, setActivePeriod }}
    >
      {children}
    </FiltersContext.Provider>
  );
};
