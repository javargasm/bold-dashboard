"use client";

import React, { useEffect, useRef, useState } from "react";
import { FiX, FiLink } from "react-icons/fi";
import { CheckCircle2, XCircle } from "lucide-react";
import { PiDevicesBold } from "react-icons/pi";
import Button from "@components/atoms/Button/Button";
import { PaymentMethod } from "@models/transaction.model";
import PaymentMethodLogo from "@components/atoms/PaymentMethodLogo/PaymentMethodLogo";
import BlockUI from "@components/atoms/BlockUI/BlockUI";

import "./TransactionModal.styles.css";

interface Transaction {
  id: string;
  status: "SUCCESSFUL" | "REJECTED";
  paymentMethod: PaymentMethod;
  salesType: string;
  createdAt: number;
  transactionReference: number;
  amount: number;
  deduction?: number;
  franchise?: "VISA" | "MASTERCARD";
}

interface TransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  isOpen: boolean;
}

export const TransactionModal = ({
  transaction,
  onClose,
  isOpen,
}: TransactionModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);
  const [display, setDisplay] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setDisplay(true);
      setTimeout(() => {
        setVisible(true);
      }, 0);
    } else {
      setVisible(false);
      const timer = setTimeout(() => {
        setDisplay(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!transaction || !display) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: number) => {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date(date));
  };

  const detailRows = [
    {
      label: "ID transacción Bold",
      value: <span className="typeTextStrong">{transaction.id}</span>,
    },
    transaction.deduction && {
      label: "Deducción Bold",
      value: (
        <span className="deductionValue">
          -{formatCurrency(transaction.deduction)}
        </span>
      ),
    },
    {
      label: "Método de pago",
      value: (
        <>
        <hr className="separador" />
        <PaymentMethodLogo
        method={transaction.paymentMethod}
        franchise={transaction.franchise}
      />
        </>
      ),
    },
    {
      label: "Tipo de pago",
      value: (
        <div className="paymentTypeContainer">
          {transaction.salesType === "TERMINAL" ? (
            <>
              <PiDevicesBold className="paymentTypeIcon" />
              <span className="typeTextStrong">Datáfono</span>
            </>
          ) : (
            <>
              <FiLink className="paymentTypeIcon" />
              <span className="typeTextStrong">Link de pagos</span>
            </>
          )}
        </div>
      ),
    },
  ].filter(Boolean) as { label: string; value: JSX.Element }[];

  return (
    <>
      <BlockUI isVisible={isOpen} />
      <div
        className={`modalOverlay ${isOpen ? "modalOpen" : ""}`}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="modalContainer">
          <div
            ref={modalRef}
            className={`modal ${visible ? "translateX0" : "translateXFull"}`}
          >
            <div className="modalContent">
              <div className="modalHeader">
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="sm"
                  className="closeButton"
                  aria-label="Cerrar"
                >
                  <FiX className="closeIcon" />
                </Button>

                <div className="modalHeaderContent">
                  {transaction.status === "SUCCESSFUL" ? (
                    <>
                      <CheckCircle2 className="statusIcon successIcon" />
                      <span id="modal-title" className="modalTitle">
                        ¡Cobro exitoso!
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="statusIcon failureIcon" />
                      <span id="modal-title" className="modalTitle">
                        Cobro no realizado
                      </span>
                    </>
                  )}

                  <span className="transactionAmount">
                    {formatCurrency(transaction.amount)}
                  </span>
                  <span className="transactionDate">
                    {formatDate(transaction.createdAt)}
                  </span>
                </div>

                <div className="transactionDetails">
                  {detailRows.map((row, index) => (
                    <span className="detailRow" key={index}>
                      <span className="detailLabel">{row.label}</span>
                      {row.value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
