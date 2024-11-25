import React from "react";
import LoadingRow from "../../molecules/TransactionRow/TransactionRow.loading";

interface LoadingTableProps {
  isMobile: boolean;
  rowCount?: number;
}

const LoadingTable: React.FC<LoadingTableProps> = ({
  isMobile,
  rowCount = 5,
}) => {
  if (isMobile) {
    return (
      <div className="transactions-table-mobile">
        {Array.from({ length: rowCount }).map((_, index) => (
          <LoadingRow key={index} isMobile={true} />
        ))}
      </div>
    );
  }

  return (
    <tbody>
      {Array.from({ length: rowCount }).map((_, index) => (
        <LoadingRow key={index} isMobile={false} />
      ))}
    </tbody>
  );
};

export default LoadingTable;
