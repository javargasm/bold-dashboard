/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterPanel from './FilterPanel';
import { Filters } from '@models/transaction.model';

// Mock de componentes
jest.mock('@components/organisms/FilterPanelHeader/FilterPanelHeader', () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="filter-panel-header">
      <button onClick={onClose} data-testid="close-button">
        Close
      </button>
    </div>
  )
}));

jest.mock('../FilterOptions/FilterOptions', () => ({
  __esModule: true,
  default: ({ localFilters, handleFilterChange }: any) => (
    <div data-testid="filter-options">
      {Object.entries(localFilters).map(([key, value]) => (
        <label key={key} data-testid={`filter-option-${key}`}>
          <input
            type="checkbox"
            checked={value}
            onChange={() => handleFilterChange(key)}
            data-testid={`checkbox-${key}`}
          />
          {key}
        </label>
      ))}
    </div>
  )
}));

jest.mock('@components/atoms/Button/Button', () => ({
  __esModule: true,
  default: ({ children, onClick, disabled, className }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-testid="apply-button"
    >
      {children}
    </button>
  )
}));

describe('FilterPanel Component', () => {
  const mockFilters: Filters = {
    paymentTerminal: false,
    linkPayment: false,
    viewAll: false
  };

  const defaultProps = {
    localFilters: mockFilters,
    handleFilterChange: jest.fn(),
    handleApply: jest.fn(),
    onClose: jest.fn(),
    isAnyFilterSelected: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all components correctly', () => {
    render(<FilterPanel {...defaultProps} />);
    
    expect(screen.getByTestId('filter-panel-header')).toBeInTheDocument();
    expect(screen.getByTestId('filter-options')).toBeInTheDocument();
    expect(screen.getByTestId('apply-button')).toBeInTheDocument();
    expect(screen.getByText('Aplicar')).toBeInTheDocument();
  });

  it('applies correct container class', () => {
    const { container } = render(<FilterPanel {...defaultProps} />);
    expect(container.firstChild).toHaveClass('filterPanelContent');
  });

  it('disables apply button when no filter is selected', () => {
    render(<FilterPanel {...defaultProps} isAnyFilterSelected={false} />);
    
    const applyButton = screen.getByTestId('apply-button');
    expect(applyButton).toBeDisabled();
    expect(applyButton).toHaveClass('applyButton', 'applyButtonDisabled');
  });

  it('enables apply button when at least one filter is selected', () => {
    render(<FilterPanel {...defaultProps} isAnyFilterSelected={true} />);
    
    const applyButton = screen.getByTestId('apply-button');
    expect(applyButton).not.toBeDisabled();
    expect(applyButton).toHaveClass('applyButton');
    expect(applyButton).not.toHaveClass('applyButtonDisabled');
  });

  it('calls handleApply when apply button is clicked', async () => {
    const handleApply = jest.fn();
    render(
      <FilterPanel 
        {...defaultProps} 
        handleApply={handleApply}
        isAnyFilterSelected={true}
      />
    );
    
    await userEvent.click(screen.getByTestId('apply-button'));
    expect(handleApply).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = jest.fn();
    render(<FilterPanel {...defaultProps} onClose={onClose} />);
    
    await userEvent.click(screen.getByTestId('close-button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('handles filter changes correctly', async () => {
    const handleFilterChange = jest.fn();
    render(
      <FilterPanel 
        {...defaultProps}
        handleFilterChange={handleFilterChange}
      />
    );

    // Probar cambio en filtro de terminal
    const terminalCheckbox = screen.getByTestId('checkbox-paymentTerminal');
    await userEvent.click(terminalCheckbox);
    expect(handleFilterChange).toHaveBeenCalledWith('paymentTerminal');

    // Probar cambio en filtro de link
    const linkCheckbox = screen.getByTestId('checkbox-linkPayment');
    await userEvent.click(linkCheckbox);
    expect(handleFilterChange).toHaveBeenCalledWith('linkPayment');

    // Probar cambio en ver todos
    const viewAllCheckbox = screen.getByTestId('checkbox-viewAll');
    await userEvent.click(viewAllCheckbox);
    expect(handleFilterChange).toHaveBeenCalledWith('viewAll');
  });

  it('reflects filter states correctly', () => {
    const activeFilters: Filters = {
      paymentTerminal: true,
      linkPayment: true,
      viewAll: false
    };

    render(
      <FilterPanel 
        {...defaultProps}
        localFilters={activeFilters}
      />
    );

    expect(screen.getByTestId('checkbox-paymentTerminal')).toBeChecked();
    expect(screen.getByTestId('checkbox-linkPayment')).toBeChecked();
    expect(screen.getByTestId('checkbox-viewAll')).not.toBeChecked();
  });

  describe('Interaction Flows', () => {
    it('completes full filter and apply flow', async () => {
      const handleFilterChange = jest.fn();
      const handleApply = jest.fn();

      const { rerender } = render(
        <FilterPanel 
          {...defaultProps}
          handleFilterChange={handleFilterChange}
          handleApply={handleApply}
          isAnyFilterSelected={false}
        />
      );

      // Verificar estado inicial
      const applyButton = screen.getByTestId('apply-button');
      expect(applyButton).toBeDisabled();

      // Seleccionar un filtro
      await userEvent.click(screen.getByTestId('checkbox-paymentTerminal'));
      expect(handleFilterChange).toHaveBeenCalledWith('paymentTerminal');

      // Simular que los filtros están activos
      rerender(
        <FilterPanel 
          {...defaultProps}
          handleFilterChange={handleFilterChange}
          handleApply={handleApply}
          isAnyFilterSelected={true}
        />
      );

      // Aplicar filtros
      await userEvent.click(applyButton);
      expect(handleApply).toHaveBeenCalledTimes(1);
    });
  });
});