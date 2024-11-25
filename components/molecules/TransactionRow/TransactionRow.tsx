import { Transaction } from "@models/transaction.model";
import { columns } from "./TransactionRow.constants";

interface TransactionRowProps {
  transaction: Transaction;
  onClick: () => void;
  isEven: boolean;
  rowHeight: number;
  isMobile: boolean;
}

const TransactionRow = ({
  transaction,
  onClick,
  isEven,
  rowHeight,
  isMobile,
}: TransactionRowProps) => {
  const rowClass = `transaction-row ${
    isEven ? "transaction-row--even" : "transaction-row--odd"
  }`;

  if (isMobile) {
    return (
      <div
        className={rowClass}
        onClick={onClick}
        style={{ minHeight: `${rowHeight}px` }}
      >
        {columns.map((column) => (
          <div key={column.key} className="transaction-mobile-section">
            <div className="transaction-mobile-label">{column.label}</div>
            <div className="transaction-mobile-value">
              {column.render(transaction)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <tr
      className={rowClass}
      onClick={onClick}
      style={{ height: `${rowHeight}px` }}
    >
      {columns.map((column) => (
        <td
          key={column.key}
          style={{
            width: column.width,
            verticalAlign: transaction.deduction ? "baseline" : "inherit",
          }}
          className="transactions-table-td"
        >
          {column.render(transaction)}
        </td>
      ))}
    </tr>
  );
};

export default TransactionRow;
