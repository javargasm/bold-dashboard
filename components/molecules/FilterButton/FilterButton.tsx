"use client";

import React, { useState } from "react";
import { Filters } from "@models/transaction.model";
import Icon from "@components/atoms/Icon/Icon";
import FilterPanel from "@components/organisms/FilterPanel/FilterPanel";
import { useFiltersContext } from "@context/FilterContext";
import Button from "@components/atoms/Button/Button";
import "./FilterButton.styles.css";
import { Cookies, withCookies } from "react-cookie";
import { expiresCookie } from "@utils/helpers";

const FilterButton = ({ cookies }: { cookies: Cookies }) => {
  const { filters, setFilters } = useFiltersContext();
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (filter: keyof Filters) => {
    if (filter === "viewAll") {
      setLocalFilters((prev) => {
        const newValue = !prev.viewAll;
        return {
          paymentTerminal: newValue,
          linkPayment: newValue,
          viewAll: newValue,
        };
      });
    } else {
      setLocalFilters((prev) => {
        const newFilters = {
          ...prev,
          [filter]: !prev[filter],
        };
        const allSelected = Object.keys(newFilters).every(
          (key) => key === "viewAll" || newFilters[key as keyof Filters]
        );
        return {
          ...newFilters,
          viewAll: allSelected,
        };
      });
    }
  };

  const isAnyFilterSelected =
    localFilters.viewAll || Object.values(localFilters).some(Boolean);

  const handleApply = () => {
    debugger;
    if (isAnyFilterSelected) {
      const cookiesFilters = cookies?.get("FILTERS");
      if (
        cookiesFilters &&
        JSON.stringify(cookiesFilters) === JSON.stringify(localFilters)
      ) {
        setFilters(cookiesFilters);
      } else {
        cookies.set("FILTERS", localFilters, {
          path: "/",
          expires: expiresCookie(),
        });
        setFilters(localFilters);
      }
      setIsOpen(false);
    }
  };

  return (
    <div className="filterButtonContainer">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="xs"
        className="filterButton"
      >
        <div className="buttonContent">
          <span></span>
          <span className="buttonText">Filtrar</span>
          <Icon name="FiSliders" className="buttonIcon" />
        </div>
      </Button>

      <div className={`filterPanel ${isOpen ? "open" : ""}`}>
        <FilterPanel
          localFilters={localFilters}
          handleFilterChange={handleFilterChange}
          handleApply={handleApply}
          onClose={() => setIsOpen(false)}
          isAnyFilterSelected={isAnyFilterSelected}
        />
      </div>
    </div>
  );
};

export default withCookies(FilterButton);
