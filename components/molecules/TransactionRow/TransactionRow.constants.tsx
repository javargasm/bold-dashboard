import { format } from "date-fns";
import { es } from "date-fns/locale";
import PaymentMethodLogo from "@components/atoms/PaymentMethodLogo/PaymentMethodLogo";
import TransactionStatus from "@components/atoms/TransactionStatus/TransactionStatus";
import { Transaction } from "@models/transaction.model";
import Skeleton from "@components/atoms/Skeleton/Skeleton";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const columns = [
  {
    key: "status",
    label: "Estado",
    width: "20%",
    render: (transaction: Transaction) => (
      <TransactionStatus
        status={transaction.status}
        salesType={transaction.salesType}
      />
    ),
    renderLoading: () => (
      <Skeleton
        width={120}
        height={24}
        animation="wave"
        style={{ marginBottom: "0.5rem" }}
      />
    ),
  },
  {
    key: "createdAt",
    label: "Fecha y hora",
    width: "20%",
    render: (transaction: Transaction) =>
      format(new Date(transaction.createdAt), "dd/MM/yyyy - HH:mm:ss", {
        locale: es,
      }),
    renderLoading: () => (
      <Skeleton
        width={180}
        height={20}
        animation="wave"
        style={{ marginBottom: "0.5rem" }}
      />
    ),
  },
  {
    key: "paymentMethod",
    label: "Método de pago",
    width: "20%",
    render: (transaction: Transaction) => (
      <PaymentMethodLogo
        method={transaction.paymentMethod}
        franchise={transaction.franchise}
      />
    ),
    renderLoading: () => (
      <Skeleton
        width={150}
        height={32}
        animation="wave"
        style={{ marginBottom: "0.5rem" }}
      />
    ),
  },
  {
    key: "id",
    label: "ID transacción",
    width: "20%",
    render: (transaction: Transaction) => transaction.id,
    renderLoading: () => (
      <Skeleton
        width="90%"
        height={20}
        animation="wave"
        style={{ marginBottom: "0.5rem" }}
      />
    ),
  },
  {
    key: "amount",
    label: "Monto",
    width: "20%",
    render: (transaction: Transaction) => (
      <div className="transaction-amount">
        {formatCurrency(transaction.amount)}
        {transaction.deduction && (
          <div className="transaction-deduction">
            <span className="label-deduction">Deducción Bold: </span>
            <span>{formatCurrency(transaction.deduction)}</span>
          </div>
        )}
      </div>
    ),
    renderLoading: () => (
      <>
        <Skeleton
          width={140}
          height={24}
          animation="wave"
          style={{ marginBottom: "0.25rem" }}
        />
        <Skeleton
          width={100}
          height={16}
          animation="wave"
          style={{ opacity: 0.7 }}
        />
         <Skeleton
          width={80}
          height={16}
          animation="wave"
          style={{ opacity: 0.7 }}
        />
      </>
    ),
  },
];
