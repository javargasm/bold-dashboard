import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TotalSalesCard from './TotalSalesCard';
import * as FilterContext from '@context/FilterContext';
import * as TransactionsContext from '@context/TransactionsContext';
import { getTableTitle } from '@utils/get-table-title';

// Mocks
jest.mock('@components/atoms/Card/Card', () => ({
  __esModule: true,
  default: ({ header, children }: { header: React.ReactNode; children: React.ReactNode }) => (
    <div data-testid="mock-card">
      <div data-testid="card-header">{header}</div>
      <div data-testid="card-content">{children}</div>
    </div>
  )
}));

jest.mock('@components/atoms/Button/Button', () => ({
  __esModule: true,
  default: ({ children, tooltip }: any) => (
    <button data-testid="info-button" title={tooltip}>
      {children}
    </button>
  )
}));

jest.mock('react-icons/fi', () => ({
  FiInfo: () => <span data-testid="info-icon">Info Icon</span>
}));

jest.mock('@utils/get-table-title', () => ({
  getTableTitle: jest.fn((period) => `Ventas ${period}`)
}));

// Mock del componente de loading
jest.mock('./TotalSalesCard.loading', () => ({
  TotalSalesCardLoading: () => <div data-testid="loading-component">Loading...</div>
}));

describe('TotalSalesCard Component', () => {
  const mockSetActivePeriod = jest.fn();
  const defaultAmount = 1000000;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(FilterContext, 'useFiltersContext').mockImplementation(() => ({
      activePeriod: 'today',
      setActivePeriod: mockSetActivePeriod
    }));
    
    jest.spyOn(TransactionsContext, 'useTransactionsContext').mockImplementation(() => ({
      totalAmount: defaultAmount,
      loading: false
    }));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    jest.spyOn(TransactionsContext, 'useTransactionsContext').mockImplementation(() => ({
      totalAmount: 0,
      loading: true
    }));

    render(<TotalSalesCard />);
    expect(screen.getByTestId('loading-component')).toBeInTheDocument();
  });

  it('displays total amount with animation', () => {
    render(<TotalSalesCard />);
    
    // Verificar valor inicial
    const totalSales = screen.getByText(/\$0/);
    expect(totalSales).toBeInTheDocument();
    
    // Avanzar la animación
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Verificar valor final
    expect(screen.getByText(`$${defaultAmount.toLocaleString('es-CO')}`)).toBeInTheDocument();
  });

  it('shows correct period label for today', () => {
    render(<TotalSalesCard />);
    
    const today = new Date().toLocaleDateString('es-ES', { dateStyle: 'long' });
    expect(screen.getByText(today)).toBeInTheDocument();
  });

  it('shows correct period label for week', () => {
    jest.spyOn(FilterContext, 'useFiltersContext').mockImplementation(() => ({
      activePeriod: 'week',
      setActivePeriod: mockSetActivePeriod
    }));

    render(<TotalSalesCard />);
    
    const endDate = new Date().toLocaleDateString('es-ES', { dateStyle: 'medium' });
    const startDate = new Date(
      new Date().setDate(new Date().getDate() - 7)
    ).toLocaleDateString('es-ES', { dateStyle: 'medium' });
    
    expect(screen.getByText(`${startDate} - ${endDate}`)).toBeInTheDocument();
  });

  it('shows correct period label for month', () => {
    jest.spyOn(FilterContext, 'useFiltersContext').mockImplementation(() => ({
      activePeriod: 'month',
      setActivePeriod: mockSetActivePeriod
    }));

    render(<TotalSalesCard />);
    
    const month = new Date().toLocaleString('es-ES', { month: 'long' });
    const expectedLabel = `${month.charAt(0).toUpperCase() + month.slice(1)}, ${new Date().getFullYear()}`;
    
    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
  });

  it('displays info button with tooltip', async () => {
    render(<TotalSalesCard />);
    
    const infoButton = screen.getByTestId('info-button');
    expect(infoButton).toHaveAttribute(
      'title',
      'Este es el total de ventas para el período seleccionado.'
    );
  });

  it('updates display when total amount changes', () => {
    const { rerender } = render(<TotalSalesCard />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText(`$${defaultAmount.toLocaleString('es-CO')}`)).toBeInTheDocument();

    // Simular cambio en el monto total
    const newAmount = 2000000;
    jest.spyOn(TransactionsContext, 'useTransactionsContext').mockImplementation(() => ({
      totalAmount: newAmount,
      loading: false
    }));

    rerender(<TotalSalesCard />);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText(`$${newAmount.toLocaleString('es-CO')}`)).toBeInTheDocument();
  });

  it('handles loading state changes', () => {
    const { rerender } = render(<TotalSalesCard />);

    // Cambiar a estado de carga
    jest.spyOn(TransactionsContext, 'useTransactionsContext').mockImplementation(() => ({
      totalAmount: defaultAmount,
      loading: true
    }));

    rerender(<TotalSalesCard />);
    expect(screen.getByTestId('loading-component')).toBeInTheDocument();

    // Volver a estado cargado
    jest.spyOn(TransactionsContext, 'useTransactionsContext').mockImplementation(() => ({
      totalAmount: defaultAmount,
      loading: false
    }));

    rerender(<TotalSalesCard />);
    expect(screen.queryByTestId('loading-component')).not.toBeInTheDocument();
  });
});