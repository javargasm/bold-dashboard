import React from "react";
import { columns } from "./TransactionRow.constants";

interface LoadingRowProps {
  isMobile: boolean;
}

const LoadingRow: React.FC<LoadingRowProps> = ({ isMobile }) => {
  if (isMobile) {
    return (
      <div className="transaction-row loading-row">
        {columns.map((column) => (
          <div key={column.key} className="transaction-mobile-section">
            <div className="transaction-mobile-label">{column.label}</div>
            <div className="transaction-mobile-value">
              {column.renderLoading()}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <tr className="transaction-row" style={{ height: `100px` }}>
      {columns.map((column) => (
        <td
          key={column.key}
          style={{ width: column.width }}
          className="transactions-table-td"
        >
          {column.renderLoading()}
        </td>
      ))}
    </tr>
  );
};

export default LoadingRow;
