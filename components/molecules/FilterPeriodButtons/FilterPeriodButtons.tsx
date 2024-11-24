"use client";
import React from "react";
import Button from "@components/atoms/Button/Button";
import { useFiltersContext } from "@context/FilterContext";
import "./FilterPeriodButtons.styles.css";

export type FilterPeriod = "today" | "week" | "month";

const FilterPeriodButtons = () => {
  const currentMonth = new Date().toLocaleString("es-ES", { month: "long" });
  const capitalizedMonth =
    currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

  const { activePeriod, setActivePeriod } = useFiltersContext();

  const tabs: { id: FilterPeriod; label: string }[] = [
    { id: "today", label: "Hoy" },
    { id: "week", label: "Esta semana" },
    { id: "month", label: capitalizedMonth },
  ];

  return (
    <div className="filterTabs">
      <div className="tabsContainer">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="outline"
            size="sm"
            onClick={() => setActivePeriod(tab.id)}
            className={`tab ${activePeriod === tab.id ? "activeTab" : ""}`}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FilterPeriodButtons;
