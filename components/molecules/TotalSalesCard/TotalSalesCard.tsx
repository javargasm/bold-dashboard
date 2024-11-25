'use client';

import { FiInfo } from "react-icons/fi";
import Card from "@components/atoms/Card/Card";
import Button from "@components/atoms/Button/Button";
import { useFiltersContext } from "@context/FilterContext";
import { useTransactionsContext } from "@context/TransactionsContext";
import './TotalSalesCard.styles.css';
import { useEffect, useState } from "react";
import { TotalSalesCardLoading } from "./TotalSalesCard.loading";
import { getTableTitle } from "@utils/get-table-title";

const TotalSalesCard = () => {
  const { activePeriod } = useFiltersContext();
  const { totalAmount, loading } = useTransactionsContext(); // Asumiendo que tienes un estado loading en el context
  const [displayAmount, setDisplayAmount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!loading && totalAmount !== undefined) {
      const duration = 1000; // 1 segundo
      const steps = 20;
      const increment = (totalAmount - displayAmount) / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;

      const timer = setInterval(() => {
        if (currentStep < steps) {
          setDisplayAmount(prev => prev + increment);
          currentStep++;
        } else {
          setDisplayAmount(totalAmount);
          clearInterval(timer);
        }
      }, stepDuration);

      setIsInitialLoad(false);
      return () => clearInterval(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalAmount, loading]);

  const getPeriodLabel = () => {
    switch (activePeriod) {
      case "today":
        return new Date().toLocaleDateString("es-ES", { dateStyle: "long" });
      case "week":
        const endDate = new Date().toLocaleDateString("es-ES", { dateStyle: "medium" });
        const startDate = new Date(
          new Date().setDate(new Date().getDate() - 7)
        ).toLocaleDateString("es-ES", { dateStyle: "medium" });
        return `${startDate} - ${endDate}`;
      case "month":
        const month = new Date().toLocaleString("es-ES", { month: "long" });
        return `${month.charAt(0).toUpperCase() + month.slice(1)}, ${new Date().getFullYear()}`;
      default:
        return "";
    }
  };

  const periodLabel = getPeriodLabel();

  if (loading || isInitialLoad) {
    return <TotalSalesCardLoading/>
  }

  return (
    <Card
      header={
        <div className="salesHeader">
          <span>{getTableTitle(activePeriod)}</span>
          <Button
            tooltip="Este es el total de ventas para el período seleccionado."
            variant="outline"
            size="sm"
            aria-label="Más información"
            className="infoButton"
          >
            <FiInfo size={24} />
          </Button>
        </div>
      }
    >
      <p className="totalSales fade-in">
        ${Math.round(displayAmount).toLocaleString("es-CO")}
      </p>
      <p className="period fade-in">{periodLabel}</p>
    </Card>
  );
};

export default TotalSalesCard;