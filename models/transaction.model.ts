export type Transaction = {
  id: string;
  status: "SUCCESSFUL" | "REJECTED";
  paymentMethod: PaymentMethod;
  salesType: "PAYMENT_LINK" | "TERMINAL";
  createdAt: number;
  transactionReference: number;
  amount: number;
  deduction?: number;
  franchise?: "VISA" | "MASTERCARD";
};

export type PaymentMethod =
  | "CARD"
  | "PSE"
  | "BANCOLOMBIA"
  | "DAVIPLATA"
  | "NEQUI"
  | "default";

export type FilterPeriod = "today" | "week" | "month";

export type Filters = {
  paymentTerminal: boolean;
  linkPayment: boolean;
  viewAll: boolean;
};
