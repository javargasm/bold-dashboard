"use client";

import { createContext, useContext, useState } from "react";

type TransactionsContextType = {
  totalAmount: number;
  setTotalAmount: (totalAmount: number) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const TransactionsContextDefaultValues: TransactionsContextType = {
  totalAmount: 0,
  setTotalAmount: () => {},
  loading: false,
  setLoading: () => {},
};

const TransactionsContext = createContext<TransactionsContextType>(
  TransactionsContextDefaultValues
);

export const useTransactionsContext = () => {
  return useContext(TransactionsContext);
};

export const TransactionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <TransactionsContext.Provider
      value={{ totalAmount, setTotalAmount, loading, setLoading }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
