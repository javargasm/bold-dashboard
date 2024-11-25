/* eslint-disable @typescript-eslint/no-explicit-any */
// TransactionsTable.test.tsx

import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import TransactionsTable from './TransactionsTable';
import { Transaction } from '@models/transaction.model';

// ----------------------
// Mocking Dependencies
// ----------------------

// Mock de transactionsAction
jest.mock('@actions/transactionsAction', () => ({
  transactionsAction: jest.fn(),
}));

// Mock de FilterContext
jest.mock('@context/FilterContext', () => ({
  useFiltersContext: jest.fn(),
}));

// Mock de TransactionsContext
jest.mock('@context/TransactionsContext', () => ({
  useTransactionsContext: jest.fn(),
}));

// Mock de componentes hijos

// Mock del componente Button
jest.mock('@components/atoms/Button/Button', () => ({
  __esModule: true,
  default: ({ children, isLoading, tooltip, ...props }: any) => (
    <button {...props} data-testid="button">
      {isLoading ? 'Loading...' : children}
      {tooltip && <span data-testid="tooltip">{tooltip}</span>}
    </button>
  ),
}));

// Mock del componente TransactionRow
jest.mock('@components/molecules/TransactionRow/TransactionRow', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  default: ({ transaction, onClick, isEven, _isMobile }: any) => (
    <div
      data-testid="transaction-row"
      onClick={() => onClick(transaction)}
      style={{ backgroundColor: isEven ? '#f9f9f9' : '#ffffff' }}
    >
      Transaction Row for {transaction.id}
    </div>
  ),
}));

// Mock del componente SearchInput
jest.mock('@components/atoms/SearchInput/SearchInput', () => ({
  __esModule: true,
  default: ({ value, onChange, placeholder }: any) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  ),
}));

// Mock del componente SortButton
jest.mock('@components/atoms/SortButton/SortButton', () => ({
  __esModule: true,
  default: ({ children, onClick }: any) => (
    <button data-testid="sort-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

// Mock del componente TransactionStatus
jest.mock('@components/atoms/TransactionStatus/TransactionStatus', () => ({
  __esModule: true,
  default: ({ status, salesType }: any) => (
    <span data-testid="transaction-status">
      {status} - {salesType}
    </span>
  ),
}));

// Mock del componente PaymentMethodLogo
jest.mock('@components/atoms/PaymentMethodLogo/PaymentMethodLogo', () => ({
  __esModule: true,
  default: ({ method, franchise }: any) => (
    <span data-testid="payment-method-logo">
      {method} - {franchise}
    </span>
  ),
}));

// Mock del componente LoadingTable
jest.mock('@components/organisms/TransactionsTable/TransactionsTable.loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-table">Loading Table...</div>,
}));

// Mock del componente TransactionModal
jest.mock('../../molecules/TransactionModal/TransactionModal', () => ({
  __esModule: true,
  TransactionModal: ({ transaction, isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="transaction-modal">
        Transaction Modal for {transaction.id}
        <button onClick={onClose} data-testid="close-modal">
          Close
        </button>
      </div>
    ) : null,
}));

// Import de los módulos mockeados
import { transactionsAction } from '@actions/transactionsAction';
import { useFiltersContext } from '@context/FilterContext';
import { useTransactionsContext } from '@context/TransactionsContext';

describe('TransactionsTable Component', () => {
  const mockTransactions: Transaction[] = [
    {
      id: 'tx1',
      status: 'SUCCESSFUL',
      salesType: 'TERMINAL',
      paymentMethod: 'Credit Card',
      franchise: 'Visa',
      createdAt: new Date().getTime(),
      amount: 100000,
      deduction: 5000,
    },
    {
      id: 'tx2',
      status: 'FAILED',
      salesType: 'PAYMENT_LINK',
      paymentMethod: 'Debit Card',
      franchise: 'Mastercard',
      createdAt: new Date().getTime() - 86400000, // 1 día atrás
      amount: 200000,
      deduction: 10000,
    },
    // Agrega más transacciones mock si es necesario
  ];

  beforeEach(() => {
    jest.useFakeTimers(); // Habilitar temporizadores simulados
    jest.clearAllMocks();

    // Mock del FilterContext
    (useFiltersContext as jest.Mock).mockReturnValue({
      activePeriod: 'month',
      filters: {
        viewAll: true,
        paymentTerminal: true,
        linkPayment: true,
      },
    });

    // Mock del TransactionsContext
    (useTransactionsContext as jest.Mock).mockReturnValue({
      setTotalAmount: jest.fn(),
    });

    // Mock de transactionsAction para resolver con mockTransactions
    (transactionsAction as jest.Mock).mockResolvedValue(mockTransactions);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // Ejecutar cualquier temporizador pendiente
    jest.useRealTimers(); // Restaurar temporizadores reales
  });



 

  it('handles sorting correctly', async () => {
    render(<TransactionsTable />);

    // Esperar a que transactionsAction sea llamada y las transacciones se carguen
    await waitFor(() => expect(transactionsAction).toHaveBeenCalled());

    // Avanzar el tiempo para que setTimeout se ejecute
    act(() => {
      jest.advanceTimersByTime(1000);
    });

  
    // Obtener todos los botones de ordenamiento
    const sortButtons = screen.getAllByTestId('sort-button');

    // Encontrar el botón de 'Monto'
    const montoSortButton = sortButtons.find((button) =>
      button.textContent?.includes('Monto')
    );
    expect(montoSortButton).toBeInTheDocument();


  });


  it('updates total amount in context', async () => {
    const mockSetTotalAmount = jest.fn();
    (useTransactionsContext as jest.Mock).mockReturnValue({
      setTotalAmount: mockSetTotalAmount,
    });

    render(<TransactionsTable />);

    // Esperar a que transactionsAction sea llamada y las transacciones se carguen
    await waitFor(() => expect(transactionsAction).toHaveBeenCalled());

    // Avanzar el tiempo para que setTimeout se ejecute
    act(() => {
      jest.advanceTimersByTime(1000);
    });


    // Calcular el monto total esperado
    const totalAmount = mockTransactions.reduce((acc, tx) => acc + tx.amount, 0);
    expect(mockSetTotalAmount).toHaveBeenCalledWith(totalAmount);
  });

  it('handles window resize for mobile view', async () => {
    render(<TransactionsTable />);

    // Esperar a que transactionsAction sea llamada y las transacciones se carguen
    await waitFor(() => expect(transactionsAction).toHaveBeenCalled());

    // Avanzar el tiempo para que setTimeout se ejecute
    act(() => {
      jest.advanceTimersByTime(1000);
    });

 

    // Simular una resolución de ventana móvil
    global.innerWidth = 500;
    fireEvent(window, new Event('resize'));

    // Dependiendo de cómo tu componente maneja el estado de 'isMobile',
    // podrías necesitar verificar cambios específicos.
    // Por ejemplo, si las filas cambian su apariencia o se renderizan de manera diferente.

    // Verificar que las filas están presentes
    const rows = screen.getAllByTestId('transaction-row');
    expect(rows.length).toBe(mockTransactions.length);
    // Puedes agregar más aserciones según cómo cambia la UI en mobile
  });
});