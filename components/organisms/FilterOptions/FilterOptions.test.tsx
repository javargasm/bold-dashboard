import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterOptions from './FilterOptions';
import { Filters } from '@models/transaction.model';

// Mock del componente FilterOption
jest.mock('@components/molecules/FilterOption/FilterOption', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ label, checked, onChange }: any) => (
    <label data-testid="filter-option">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        data-testid={`checkbox-${label}`}
      />
      <span>{label}</span>
    </label>
  )
}));

describe('FilterOptions Component', () => {
  const mockFilters: Filters = {
    paymentTerminal: false,
    linkPayment: false,
    viewAll: false
  };

  const defaultProps = {
    localFilters: mockFilters,
    handleFilterChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all filter options', () => {
    render(<FilterOptions {...defaultProps} />);
    
    expect(screen.getByText('Cobro con datáfono')).toBeInTheDocument();
    expect(screen.getByText('Cobro con link de pago')).toBeInTheDocument();
    expect(screen.getByText('Ver todos')).toBeInTheDocument();
  });

  it('reflects correct checked states', () => {
    const activeFilters: Filters = {
      paymentTerminal: true,
      linkPayment: false,
      viewAll: false
    };

    render(<FilterOptions {...defaultProps} localFilters={activeFilters} />);
    
    const terminalCheckbox = screen.getByTestId('checkbox-Cobro con datáfono');
    const linkCheckbox = screen.getByTestId('checkbox-Cobro con link de pago');
    const viewAllCheckbox = screen.getByTestId('checkbox-Ver todos');

    expect(terminalCheckbox).toBeChecked();
    expect(linkCheckbox).not.toBeChecked();
    expect(viewAllCheckbox).not.toBeChecked();
  });

  it('calls handleFilterChange with correct key when option is clicked', async () => {
    const handleFilterChange = jest.fn();
    render(
      <FilterOptions 
        {...defaultProps}
        handleFilterChange={handleFilterChange}
      />
    );
    
    // Click en opción de datáfono
    await userEvent.click(screen.getByTestId('checkbox-Cobro con datáfono'));
    expect(handleFilterChange).toHaveBeenCalledWith('paymentTerminal');

    // Click en opción de link de pago
    await userEvent.click(screen.getByTestId('checkbox-Cobro con link de pago'));
    expect(handleFilterChange).toHaveBeenCalledWith('linkPayment');

    // Click en Ver todos
    await userEvent.click(screen.getByTestId('checkbox-Ver todos'));
    expect(handleFilterChange).toHaveBeenCalledWith('viewAll');
  });

  it('renders correct number of options', () => {
    
    const options = screen.getAllByTestId('filter-option');
    expect(options).toHaveLength(3);
  });

  it('applies correct class to container', () => {
    const { container } = render(<FilterOptions {...defaultProps} />);
    
    expect(container.firstChild).toHaveClass('filterOptions');
  });

  it('handles all filter states correctly', () => {
    const { rerender } = render(<FilterOptions {...defaultProps} />);

    // Estado inicial
    const allOptions = screen.getAllByTestId('filter-option');
    allOptions.forEach(option => {
      const checkbox = option.querySelector('input');
      expect(checkbox).not.toBeChecked();
    });

    // Algunos filtros activos
    const partialFilters: Filters = {
      paymentTerminal: true,
      linkPayment: true,
      viewAll: false
    };

    rerender(
      <FilterOptions 
        {...defaultProps}
        localFilters={partialFilters}
      />
    );

    expect(screen.getByTestId('checkbox-Cobro con datáfono')).toBeChecked();
    expect(screen.getByTestId('checkbox-Cobro con link de pago')).toBeChecked();
    expect(screen.getByTestId('checkbox-Ver todos')).not.toBeChecked();

    // Todos los filtros activos
    const allFilters: Filters = {
      paymentTerminal: true,
      linkPayment: true,
      viewAll: true
    };

    rerender(
      <FilterOptions 
        {...defaultProps}
        localFilters={allFilters}
      />
    );

    screen.getAllByTestId('filter-option').forEach(option => {
      const checkbox = option.querySelector('input');
      expect(checkbox).toBeChecked();
    });
  });

  it('maintains consistent order of options', () => {
    render(<FilterOptions {...defaultProps} />);
    
    const options = screen.getAllByTestId('filter-option');
    const labels = options.map(option => option.textContent);
    
    expect(labels).toEqual([
      'Cobro con datáfono',
      'Cobro con link de pago',
      'Ver todos'
    ]);
  });

  it('preserves option keys for consistent rendering', () => {
    const { rerender } = render(<FilterOptions {...defaultProps} />);
    
    const getOptionKeys = () => 
      screen.getAllByTestId('filter-option').map(option => 
        option.querySelector('input')?.dataset.testid
      );
    
    const initialKeys = getOptionKeys();
    
    // Re-renderizar con diferentes props
    rerender(
      <FilterOptions 
        {...defaultProps}
        localFilters={{
          ...mockFilters,
          paymentTerminal: true
        }}
      />
    );
    
    const newKeys = getOptionKeys();
    expect(newKeys).toEqual(initialKeys);
  });
});