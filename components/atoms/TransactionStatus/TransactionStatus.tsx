import { FiLink } from "react-icons/fi";
import { PiDevicesBold } from "react-icons/pi";


export type TransactionStatusProps = {
  status: string;
  salesType: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TransactionStatus = ({ status, salesType }: TransactionStatusProps) => {
  const getPaymentIcon = (type: string) => {
    return type === "TERMINAL" ? (
      <PiDevicesBold className="payment-icon" />
    ) : (
      <FiLink className="payment-icon" />
    );
  };

  return (
    <div className="transactions-table-cell">
      {getPaymentIcon(salesType)}
      <span className="transaction-status">
        {status === "SUCCESSFUL" ? "Cobro exitoso" : "Cobro no realizado"}
      </span>
    </div>
  );
};

export default TransactionStatus;