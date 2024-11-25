"use client";
import React, { useEffect, useState } from "react";
import Button from "@components/atoms/Button/Button";
import { useFiltersContext } from "@context/FilterContext";
import "./FilterPeriodButtons.styles.css";
import { Cookies, withCookies } from "react-cookie";
import { expiresCookie } from "@utils/helpers";
import Skeleton from "@components/atoms/Skeleton/Skeleton";

export type FilterPeriod = "today" | "week" | "month";

const FilterPeriodButtons = ({ cookies }: { cookies: Cookies }) => {
  const { activePeriod, setActivePeriod } = useFiltersContext();

  const [tabs, setTabs] = useState<{ id: FilterPeriod; label: string }[]>([]);

  const handleFilterChange = (filter: FilterPeriod) => {
    console.log(filter);
    const cookiesPeriod = cookies.get("PERIOD");
    if (cookiesPeriod === filter) {
      setActivePeriod(cookiesPeriod);
    } else {
      cookies.set("PERIOD", filter, {
        path: "/",
        expires: expiresCookie(),
      });
      setActivePeriod(filter);
    }
  };

  useEffect(() => {
    const currentMonth = new Date().toLocaleString("es-ES", { month: "long" });
    const capitalizedMonth =
      currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
    setTabs([
      { id: "today", label: "Hoy" },
      { id: "week", label: "Esta semana" },
      { id: "month", label: capitalizedMonth },
    ]);
  }, [activePeriod]);

  return (
    <div className="filterTabs">
      <div className="tabsContainer">
        {tabs.length ? (
          tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange(tab.id)}
              className={`tab ${activePeriod === tab.id ? "activeTab" : ""}`}
            >
              {tab.label}
            </Button>
          ))
        ) : (
          <Skeleton height={33} />
        )}
      </div>
    </div>
  );
};

export default withCookies(FilterPeriodButtons);
