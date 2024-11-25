import { render, screen } from '@testing-library/react';
import TransactionStatus from './TransactionStatus';

// Mock de los iconos
jest.mock('react-icons/fi', () => ({
  FiLink: ({ className }: { className: string }) => (
    <span data-testid="link-icon" className={className}>LinkIcon</span>
  )
}));

jest.mock('react-icons/pi', () => ({
  PiDevicesBold: ({ className }: { className: string }) => (
    <span data-testid="device-icon" className={className}>DeviceIcon</span>
  )
}));

describe('TransactionStatus Component', () => {
  // Prueba básica de renderizado exitoso
  it('renders successful status correctly', () => {
    render(<TransactionStatus status="SUCCESSFUL" salesType="LINK" />);
    
    expect(screen.getByText('Cobro exitoso')).toBeInTheDocument();
    const statusContainer = screen.getByText('Cobro exitoso').parentElement;
    expect(statusContainer).toHaveClass('transactions-table-cell');
  });

  // Prueba de estado no exitoso
  it('renders unsuccessful status correctly', () => {
    render(<TransactionStatus status="FAILED" salesType="LINK" />);
    
    expect(screen.getByText('Cobro no realizado')).toBeInTheDocument();
  });

  // Prueba de icono de Link
  it('renders link icon when salesType is not TERMINAL', () => {
    render(<TransactionStatus status="SUCCESSFUL" salesType="LINK" />);
    
    const linkIcon = screen.getByTestId('link-icon');
    expect(linkIcon).toBeInTheDocument();
    expect(linkIcon).toHaveClass('payment-icon');
    expect(screen.queryByTestId('device-icon')).not.toBeInTheDocument();
  });

  // Prueba de icono de Terminal
  it('renders terminal icon when salesType is TERMINAL', () => {
    render(<TransactionStatus status="SUCCESSFUL" salesType="TERMINAL" />);
    
    const deviceIcon = screen.getByTestId('device-icon');
    expect(deviceIcon).toBeInTheDocument();
    expect(deviceIcon).toHaveClass('payment-icon');
    expect(screen.queryByTestId('link-icon')).not.toBeInTheDocument();
  });

  // Prueba de estructura del componente
  it('renders with correct structure', () => {
    const { container } = render(
      <TransactionStatus status="SUCCESSFUL" salesType="LINK" />
    );
    
    const cellDiv = container.querySelector('.transactions-table-cell');
    expect(cellDiv).toBeInTheDocument();
    expect(cellDiv?.children).toHaveLength(2); // Icon and status text
  });

  // Pruebas de diferentes combinaciones de estado y tipo
  describe('status and type combinations', () => {
    const testCases = [
      {
        status: 'SUCCESSFUL',
        salesType: 'TERMINAL',
        expectedText: 'Cobro exitoso',
        expectedIcon: 'device-icon'
      },
      {
        status: 'FAILED',
        salesType: 'TERMINAL',
        expectedText: 'Cobro no realizado',
        expectedIcon: 'device-icon'
      },
      {
        status: 'SUCCESSFUL',
        salesType: 'LINK',
        expectedText: 'Cobro exitoso',
        expectedIcon: 'link-icon'
      },
      {
        status: 'FAILED',
        salesType: 'LINK',
        expectedText: 'Cobro no realizado',
        expectedIcon: 'link-icon'
      }
    ];

    test.each(testCases)(
      'renders correctly for status=$status and salesType=$salesType',
      ({ status, salesType, expectedText, expectedIcon }) => {
        render(<TransactionStatus status={status} salesType={salesType} />);
        
        expect(screen.getByText(expectedText)).toBeInTheDocument();
        expect(screen.getByTestId(expectedIcon)).toBeInTheDocument();
      }
    );
  });

  // Prueba de clases CSS
  describe('CSS classes', () => {
    it('applies correct classes to container', () => {
      const { container } = render(
        <TransactionStatus status="SUCCESSFUL" salesType="LINK" />
      );
      
      expect(container.firstChild).toHaveClass('transactions-table-cell');
    });

    it('applies correct classes to status text', () => {
      render(<TransactionStatus status="SUCCESSFUL" salesType="LINK" />);
      
      const statusText = screen.getByText('Cobro exitoso');
      expect(statusText).toHaveClass('transaction-status');
    });

    it('applies correct classes to icons', () => {
      const { rerender } = render(
        <TransactionStatus status="SUCCESSFUL" salesType="LINK" />
      );
      
      expect(screen.getByTestId('link-icon')).toHaveClass('payment-icon');
      
      rerender(<TransactionStatus status="SUCCESSFUL" salesType="TERMINAL" />);
      expect(screen.getByTestId('device-icon')).toHaveClass('payment-icon');
    });
  });
});