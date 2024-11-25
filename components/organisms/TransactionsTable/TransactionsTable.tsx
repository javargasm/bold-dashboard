"use client";

import {
  useState,
  useMemo,
  useEffect,
  startTransition,
  useCallback,
} from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Button from "@components/atoms/Button/Button";
import { TransactionModal } from "../../molecules/TransactionModal/TransactionModal";
import { Transaction } from "@models/transaction.model";
import { useFiltersContext } from "@context/FilterContext";
import { useTransactionsContext } from "@context/TransactionsContext";
import { transactionsAction } from "@actions/transactionsAction";
import TransactionRow from "@components/molecules/TransactionRow/TransactionRow";
import SearchInput from "@components/atoms/SearchInput/SearchInput";
import SortButton from "@components/atoms/SortButton/SortButton";
import TransactionStatus from "@components/atoms/TransactionStatus/TransactionStatus";
import PaymentMethodLogo from "@components/atoms/PaymentMethodLogo/PaymentMethodLogo";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import LoadingTable from "@components/organisms/TransactionsTable/TransactionsTable.loading";
import { getTableTitle } from "@utils/get-table-title";
import "./TransactionsTable.styles.css";
import Skeleton from "@components/atoms/Skeleton/Skeleton";

export type SortOrder = "asc" | "desc";

const getStatusLabel = (status: string) => {
  return status === "SUCCESSFUL" ? "Cobro exitoso" : "Cobro no realizado";
};

export type SortField = "amount" | "createdAt";

interface ColumnConfig {
  key: string;
  label: string;
  sortable?: boolean;
  sortField?: SortField;
  render: (transaction: Transaction) => React.ReactNode;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const columns: ColumnConfig[] = [
  {
    key: "status",
    label: "Transacción",
    render: (transaction: Transaction) => (
      <TransactionStatus
        status={transaction.status}
        salesType={transaction.salesType}
      />
    ),
  },
  {
    key: "createdAt",
    label: "Fecha y hora",
    sortable: true,
    sortField: "createdAt",
    render: (transaction: Transaction) =>
      format(new Date(transaction.createdAt), "dd/MM/yyyy - HH:mm:ss", {
        locale: es,
      }),
  },
  {
    key: "paymentMethod",
    label: "Método de pago",
    render: (transaction: Transaction) => (
      <PaymentMethodLogo
        method={transaction.paymentMethod}
        franchise={transaction.franchise}
      />
    ),
  },
  {
    key: "id",
    label: "ID transacción Bold",
    render: (transaction: Transaction) => transaction.id,
  },
  {
    key: "amount",
    label: "Monto",
    sortable: true,
    sortField: "amount",
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
  },
];

const TransactionsTable = () => {
  const { activePeriod, filters } = useFiltersContext();
  const { setTotalAmount } = useTransactionsContext();
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState<string | null>(null);
  const itemsPerPage = 10; // Número fijo de elementos por página

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    startTransition(async () => {
      try {
        const data = await transactionsAction();
        setTransactions(data);
      } catch (error) {
        console.error("Error:", error);
      }
    });
  }, [setTransactions]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 767);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();

    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7
    ).getTime();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).getTime();

    return transactions?.filter((transaction) => {
      const matchesPeriod = (() => {
        switch (activePeriod) {
          case "today":
            return transaction.createdAt >= startOfDay;
          case "week":
            return transaction.createdAt >= startOfWeek;
          case "month":
          default:
            return transaction.createdAt >= startOfMonth;
        }
      })();

      const matchesPaymentType = (() => {
        if (filters.viewAll) return true;
        if (!filters.paymentTerminal && !filters.linkPayment) return true;
        if (filters.paymentTerminal && transaction.salesType === "TERMINAL")
          return true;
        if (filters.linkPayment && transaction.salesType === "PAYMENT_LINK")
          return true;
        return false;
      })();

      return matchesPeriod && matchesPaymentType;
    });
  }, [transactions, activePeriod, filters]);

  useEffect(() => {
    if (activePeriod) {
      setTitle(getTableTitle(activePeriod));
    }
  }, [activePeriod]);

  useEffect(() => {
    if (filteredTransactions) {
      setIsLoading(true);
      const totalAmount = filteredTransactions.reduce(
        (acc, transaction) => acc + transaction.amount,
        0
      );
      setTotalAmount(totalAmount);
      setTimeout(() => setIsLoading(false), 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTransactions]);

  const sortedAndFilteredTransactions = useMemo(() => {
    let result = [...(filteredTransactions ?? [])];

    // Apply search filter
    if (searchQuery.trim()) {
      const searchTerms = searchQuery
        .toLowerCase()
        .split(" ")
        .filter((term) => term.length > 0);
      result = result.filter((transaction) => {
        const searchableFields = [
          transaction.id.toLowerCase(),
          getStatusLabel(transaction.status).toLowerCase(),
          transaction.paymentMethod.toLowerCase(),
          transaction.salesType.toLowerCase(),
          format(new Date(transaction.createdAt), "dd/MM/yyyy - HH:mm:ss", {
            locale: es,
          }).toLowerCase(),
          transaction.amount.toString(),
          transaction.franchise?.toLowerCase() || "",
        ];
        return searchTerms.every((term) =>
          searchableFields.some((field) => field.includes(term))
        );
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortField) {
        case "amount":
          return sortOrder === "asc"
            ? a.amount - b.amount
            : b.amount - a.amount;
        case "createdAt":
          return sortOrder === "asc"
            ? a.createdAt - b.createdAt
            : b.createdAt - a.createdAt;
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, sortField, sortOrder, filteredTransactions]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredTransactions.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [sortedAndFilteredTransactions, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortedAndFilteredTransactions]);

  const totalPages = Math.ceil(
    sortedAndFilteredTransactions.length / itemsPerPage
  );

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  return (
    <div className="transactions-table">
      <div className="transactions-table-header">
        <div className="transactions-table-title">
          {title ? title : <Skeleton width={200} />}
        </div>
      </div>

      <div className="transactions-table-search">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar"
        />
      </div>

      <div className="transactions-table-content">
        {isMobile ? (
          <div className="transactions-table-mobile">
            {paginatedTransactions.length === 0 ? (
              <div className="transactions-table-empty">
                No se encontraron transacciones
              </div>
            ) : (
              paginatedTransactions.map((transaction, index) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  onClick={() => handleRowClick(transaction)}
                  isEven={index % 2 === 0}
                  rowHeight={100}
                  isMobile={true}
                />
              ))
            )}
          </div>
        ) : (
          <table className="transactions-table-table">
            <thead className="transactions-table-thead">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="transactions-table-th">
                    {column.sortable && column.sortField ? (
                      <SortButton
                        field={column.sortField}
                        currentSort={sortField}
                        currentOrder={sortOrder}
                        onClick={() => handleSort(column.sortField!)}
                      >
                        {column.label}
                      </SortButton>
                    ) : (
                      column.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            {isLoading ? (
              <LoadingTable isMobile={isMobile} rowCount={itemsPerPage} />
            ) : (
              <tbody>
                {paginatedTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="transactions-table-empty"
                    >
                      No se encontraron transacciones
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map((transaction, index) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                      onClick={() => handleRowClick(transaction)}
                      isEven={index % 2 === 0}
                      rowHeight={100}
                      isMobile={false}
                    />
                  ))
                )}
              </tbody>
            )}
          </table>
        )}
      </div>

      <div className="transactions-table-footer">
        <div className="transactions-table-pagination-info">
          Mostrando{" "}
          {Math.min(
            (currentPage - 1) * itemsPerPage + 1,
            sortedAndFilteredTransactions.length
          )}{" "}
          -{" "}
          {Math.min(
            currentPage * itemsPerPage,
            sortedAndFilteredTransactions.length
          )}{" "}
          de {sortedAndFilteredTransactions.length}
        </div>
        <div className="transactions-table-pagination-buttons">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            aria-label="Página anterior"
          >
            <FiChevronLeft className="pagination-icon" />
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            aria-label="Página siguiente"
          >
            <FiChevronRight className="pagination-icon" />
          </Button>
        </div>
      </div>

      <TransactionModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TransactionsTable;
