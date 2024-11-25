/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionRow from './TransactionRow';
import { Transaction } from '@models/transaction.model';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Mocks de componentes
jest.mock('@components/atoms/PaymentMethodLogo/PaymentMethodLogo', () => ({
  __esModule: true,
  default: ({ method, franchise }: any) => (
    <div data-testid="payment-method-logo">
      {method} {franchise}
    </div>
  )
}));

jest.mock('@components/atoms/TransactionStatus/TransactionStatus', () => ({
  __esModule: true,
  default: ({ status, salesType }: any) => (
    <div data-testid="transaction-status">
      {status} {salesType}
    </div>
  )
}));

jest.mock('@components/atoms/Skeleton/Skeleton', () => ({
  __esModule: true,
  default: ({ width, height }: any) => (
    <div data-testid="skeleton" style={{ width, height }}>
      Loading...
    </div>
  )
}));

describe('TransactionRow Component', () => {
  const mockTransaction: Transaction = {
    id: 'TRANS123',
    status: 'SUCCESSFUL',
    paymentMethod: 'CARD',
    salesType: 'TERMINAL',
    createdAt: new Date('2024-02-23T16:20:00').getTime(),
    transactionReference: 123456,
    amount: 150000,
    deduction: 5000,
    franchise: 'VISA'
  };

  const defaultProps = {
    transaction: mockTransaction,
    onClick: jest.fn(),
    isEven: true,
    rowHeight: 80,
    isMobile: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Desktop Version', () => {
    it('renders transaction row correctly', () => {
      const { container } = render(
        <table><tbody><TransactionRow {...defaultProps} /></tbody></table>
      );
      
      expect(screen.getByTestId('transaction-status')).toBeInTheDocument();
      expect(screen.getByTestId('payment-method-logo')).toBeInTheDocument();
      expect(screen.getByText('TRANS123')).toBeInTheDocument();
      expect(screen.getByText(/150.000/)).toBeInTheDocument();
      
      // Verificar estructura de la tabla
      expect(container.querySelector('tr')).toBeInTheDocument();
      expect(container.querySelectorAll('td')).toHaveLength(5);
    });

    it('applies correct even/odd classes', () => {
      const { container, rerender } = render(
        <table><tbody><TransactionRow {...defaultProps} isEven={true} /></tbody></table>
      );
      
      let row = container.querySelector('tr');
      expect(row).toHaveClass('transaction-row--even');
      
      rerender(
        <table><tbody><TransactionRow {...defaultProps} isEven={false} /></tbody></table>
      );
      
      row = container.querySelector('tr');
      expect(row).toHaveClass('transaction-row--odd');
    });

    it('handles click event', async () => {
      const onClick = jest.fn();
      const { container } = render(
        <table><tbody>
          <TransactionRow {...defaultProps} onClick={onClick} />
        </tbody></table>
      );
      
      const row = container.querySelector('tr');
      await userEvent.click(row!);
      expect(onClick).toHaveBeenCalled();
    });

    it('displays correct amount format', () => {
      render(
        <table><tbody><TransactionRow {...defaultProps} /></tbody></table>
      );
      
      const amountText = screen.getByText(/150.000/);
      const deductionText = screen.getByText(/5.000/);
      expect(amountText).toBeInTheDocument();
      expect(deductionText).toBeInTheDocument();
    });
  });

  describe('Mobile Version', () => {
    it('renders mobile layout correctly', () => {
      const { container } = render(
        <TransactionRow {...defaultProps} isMobile={true} />
      );
      
      // Verificar la estructura móvil
      expect(container.querySelector('.transaction-row')).toBeInTheDocument();
      const mobileSections = container.querySelectorAll('.transaction-mobile-section');
      expect(mobileSections.length).toBe(5);
      
      // Verificar contenido
      expect(screen.getByTestId('transaction-status')).toBeInTheDocument();
      expect(screen.getByTestId('payment-method-logo')).toBeInTheDocument();
      expect(screen.getByText('TRANS123')).toBeInTheDocument();
    });

    it('applies correct mobile styles', () => {
      const { container } = render(
        <TransactionRow {...defaultProps} isMobile={true} rowHeight={120} />
      );
      
      const mobileRow = container.querySelector('.transaction-row');
      expect(mobileRow).toHaveStyle({ minHeight: '120px' });
      
      // Verificar clases de las secciones móviles
      expect(container.querySelectorAll('.transaction-mobile-section')).toHaveLength(5);
      expect(container.querySelectorAll('.transaction-mobile-label')).toHaveLength(5);
      expect(container.querySelectorAll('.transaction-mobile-value')).toHaveLength(5);
    });

    it('handles mobile click event', async () => {
      const onClick = jest.fn();
      const { container } = render(
        <TransactionRow {...defaultProps} isMobile={true} onClick={onClick} />
      );
      
      const mobileRow = container.querySelector('.transaction-row');
      await userEvent.click(mobileRow!);
      expect(onClick).toHaveBeenCalled();
    });

    it('displays correct date format', () => {
      render(<TransactionRow {...defaultProps} isMobile={true} />);
      
      const formattedDate = format(
        new Date(mockTransaction.createdAt),
        'dd/MM/yyyy - HH:mm:ss',
        { locale: es }
      );
      expect(screen.getByText(formattedDate)).toBeInTheDocument();
    });
  });

  describe('Shared Functionality', () => {
    it('handles undefined deduction', () => {
      const transactionWithoutDeduction = {
        ...mockTransaction,
        deduction: undefined
      };
      
      render(
        <table><tbody>
          <TransactionRow 
            {...defaultProps} 
            transaction={transactionWithoutDeduction}
          />
        </tbody></table>
      );
      
      expect(screen.queryByText('Deducción Bold:')).not.toBeInTheDocument();
    });

    it('formats amounts correctly', () => {
      const { container } = render(
        <table><tbody><TransactionRow {...defaultProps} /></tbody></table>
      );
      
      const amountContainer = container.querySelector('.transaction-amount');
      expect(amountContainer).toBeInTheDocument();
      expect(amountContainer?.textContent).toMatch(/150.000/);
      
      const deductionContainer = container.querySelector('.transaction-deduction');
      expect(deductionContainer?.textContent).toMatch(/5.000/);
    });
  });
});