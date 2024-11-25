import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionModal } from './TransactionModal';

// Mocks
jest.mock('react-icons/fi', () => ({
  FiX: () => <div data-testid="close-icon">X</div>,
  FiLink: () => <div data-testid="link-icon">Link</div>,
}));

jest.mock('react-icons/pi', () => ({
  PiDevicesBold: () => <div data-testid="device-icon">Device</div>,
}));

jest.mock('lucide-react', () => ({
  CheckCircle2: () => <div data-testid="check-circle-icon">Check</div>,
  XCircle: () => <div data-testid="x-circle-icon">X Circle</div>,
}));

jest.mock('@components/atoms/Button/Button', () => ({
  __esModule: true,
  default: ({ children, onClick, className, ...props }: any) => (
    <button 
      onClick={onClick} 
      className={className} 
      data-testid="modal-button"
      {...props}
    >
      {children}
    </button>
  )
}));

jest.mock('@components/atoms/PaymentMethodLogo/PaymentMethodLogo', () => ({
  __esModule: true,
  default: ({ method, franchise }: any) => (
    <div data-testid="payment-logo">
      {method} {franchise}
    </div>
  )
}));

jest.mock('@components/atoms/BlockUI/BlockUI', () => ({
  __esModule: true,
  default: ({ isVisible }: any) => (
    isVisible ? <div data-testid="block-ui">Block UI</div> : null
  )
}));

describe('TransactionModal Component', () => {
    const mockTransaction = {
        id: '123456',
        status: 'SUCCESSFUL' as const,
        paymentMethod: 'CARD' as const,
        salesType: 'TERMINAL',
        createdAt: new Date('2024-02-23T16:20:00').getTime(),
        transactionReference: 789012,
        amount: 150000,
        deduction: 5000,
        franchise: 'VISA' as const
      };
    
      const defaultProps = {
        transaction: mockTransaction,
        onClose: jest.fn(),
        isOpen: true
      };
    
      beforeEach(() => {
        jest.useFakeTimers();
      });
    
      afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
      });
  
    describe('Modal Animation and Visibility', () => {
      it('handles opening animation correctly', () => {
        const { container } = render(<TransactionModal {...defaultProps} />);
        
        // Estado inicial
        let modalContent = container.querySelector('.modal');
        expect(modalContent).toHaveClass('translateXFull');
        
        // Después del timeout
        act(() => {
          jest.advanceTimersByTime(0);
        });
  
        modalContent = container.querySelector('.modal');
        expect(modalContent).toHaveClass('translateX0');
      });
  
      it('handles closing animation correctly', () => {
        const { container, rerender } = render(<TransactionModal {...defaultProps} />);
        
        // Abrir el modal primero
        act(() => {
          jest.advanceTimersByTime(0);
        });
  
        // Verificar que está abierto
        const openModalContent = container.querySelector('.modal');
        expect(openModalContent).toHaveClass('translateX0');
        
        // Cerrar el modal
        rerender(<TransactionModal {...defaultProps} isOpen={false} />);
        
        // Verificar estado de cierre
        const closedModalContent = container.querySelector('.modal');
        expect(closedModalContent).toHaveClass('translateXFull');
      });
  
      it('shows and hides BlockUI correctly', () => {
        const { rerender } = render(<TransactionModal {...defaultProps} />);
        
        // Verificar que BlockUI está presente cuando el modal está abierto
        expect(screen.getByTestId('block-ui')).toBeInTheDocument();
        
        // Cerrar el modal
        rerender(<TransactionModal {...defaultProps} isOpen={false} />);
        
        act(() => {
          jest.advanceTimersByTime(500);
        });
        
        // Verificar que BlockUI no está presente cuando el modal está cerrado
        expect(screen.queryByTestId('block-ui')).not.toBeInTheDocument();
      });
  
      it('handles display state correctly', () => {
        const { container, rerender } = render(<TransactionModal {...defaultProps} isOpen={false} />);
        
        // Inicialmente no debería estar visible
        expect(container.querySelector('.modalOverlay')).not.toBeInTheDocument();
        
        // Abrir el modal
        rerender(<TransactionModal {...defaultProps} isOpen={true} />);
        
        act(() => {
          jest.advanceTimersByTime(0);
        });
        
        // Verificar que está visible
        const modalOverlay = container.querySelector('.modalOverlay');
        expect(modalOverlay).toHaveClass('modalOpen');
      });
    });
  
    it('handles close button interaction', () => {
      const onClose = jest.fn();
      render(<TransactionModal {...defaultProps} onClose={onClose} />);
      
      const closeButton = screen.getByTestId('modal-button');
      closeButton.click();
      
      expect(onClose).toHaveBeenCalled();
    });
  
    it('renders transaction details correctly', () => {
      const { container } = render(<TransactionModal {...defaultProps} />);
      
      expect(screen.getByText('ID transacción Bold')).toBeInTheDocument();
      expect(screen.getByText('123456')).toBeInTheDocument();
      expect(screen.getByText('-$ 5.000')).toBeInTheDocument();
      expect(container.querySelector('.paymentTypeContainer')).toBeInTheDocument();
    });
  
    it('does not render when transaction is null', () => {
      const { container } = render(
        <TransactionModal {...defaultProps} transaction={null} />
      );
      
      expect(container.querySelector('.modalOverlay')).not.toBeInTheDocument();
    });
  
    it('renders correct payment type icon', () => {
      // Probar con datáfono
      const { rerender } = render(<TransactionModal {...defaultProps} />);
      expect(screen.getByTestId('device-icon')).toBeInTheDocument();
      
      // Probar con link de pagos
      rerender(
        <TransactionModal 
          {...defaultProps} 
          transaction={{...mockTransaction, salesType: 'LINK'}}
        />
      );
      expect(screen.getByTestId('link-icon')).toBeInTheDocument();
    });
  
    describe('Accessibility', () => {
      it('has correct ARIA attributes', () => {
        const { container } = render(<TransactionModal {...defaultProps} />);
        
        const modalOverlay = container.querySelector('.modalOverlay');
        expect(modalOverlay).toHaveAttribute('role', 'dialog');
        expect(modalOverlay).toHaveAttribute('aria-modal', 'true');
        expect(modalOverlay).toHaveAttribute('aria-labelledby', 'modal-title');
        
        const closeButton = screen.getByTestId('modal-button');
        expect(closeButton).toHaveAttribute('aria-label', 'Cerrar');
      });
    });
  });
