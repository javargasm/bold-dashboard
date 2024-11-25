import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SortButton from './SortButton';

// Mock de los componentes de iconos
jest.mock('react-icons/fi', () => ({
  FiChevronUp: ({ className }: { className: string }) => (
    <span data-testid="chevron-up" className={className}>↑</span>
  ),
  FiChevronDown: ({ className }: { className: string }) => (
    <span data-testid="chevron-down" className={className}>↓</span>
  )
}));

// Mock del componente Button
jest.mock('../Button/Button', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className} data-testid="button">
      {children}
    </button>
  )
}));

describe('SortButton Component', () => {
  const defaultProps = {
    field: 'name',
    currentSort: '',
    currentOrder: 'asc' as const,
    onClick: jest.fn(),
    children: 'Sort by Name'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Prueba de renderizado básico
  it('renders button with children', () => {
    render(<SortButton {...defaultProps} />);
    
    const button = screen.getByTestId('button');
    expect(button).toHaveTextContent('Sort by Name');
    expect(button).toHaveClass('transactions-table-sort-button');
  });

  // Prueba del icono por defecto (no seleccionado)
  it('renders up chevron when field is not currently sorted', () => {
    render(<SortButton {...defaultProps} />);
    
    const upChevron = screen.getByTestId('chevron-up');
    expect(upChevron.className).toBe('sort-icon inactive');
  });

  // Prueba del icono cuando está ordenado ascendentemente
  it('renders up chevron when field is sorted ascending', () => {
    render(
      <SortButton 
        {...defaultProps} 
        currentSort="name"
        currentOrder="asc"
      />
    );
    
    const upChevron = screen.getByTestId('chevron-up');
    expect(upChevron.className).toBe('sort-icon active');
  });

  // Prueba del icono cuando está ordenado descendentemente
  it('renders down chevron when field is sorted descending', () => {
    render(
      <SortButton 
        {...defaultProps} 
        currentSort="name"
        currentOrder="desc"
      />
    );
    
    const downChevron = screen.getByTestId('chevron-down');
    expect(downChevron.className).toBe('sort-icon active');
  });

  // Prueba del evento onClick
  it('calls onClick when button is clicked', async () => {
    const handleClick = jest.fn();
    render(<SortButton {...defaultProps} onClick={handleClick} />);
    
    const button = screen.getByTestId('button');
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Prueba de diferentes campos
  it('handles different fields correctly', () => {
    const { rerender } = render(
      <SortButton 
        {...defaultProps}
        field="date"
        currentSort="date"
        currentOrder="asc"
      />
    );
    
    const upChevron = screen.getByTestId('chevron-up');
    expect(upChevron.className).toBe('sort-icon active');

    rerender(
      <SortButton 
        {...defaultProps}
        field="amount"
        currentSort="date"
        currentOrder="asc"
      />
    );
    
    const newUpChevron = screen.getByTestId('chevron-up');
    expect(newUpChevron.className).toBe('sort-icon inactive');
  });

  // Prueba de transición de estados
  it('transitions between states correctly', () => {
    const { rerender } = render(<SortButton {...defaultProps} />);
    
    // Estado inicial
    let chevron = screen.getByTestId('chevron-up');
    expect(chevron.className).toBe('sort-icon inactive');

    // Cambio a ordenado ascendente
    rerender(
      <SortButton 
        {...defaultProps}
        currentSort="name"
        currentOrder="asc"
      />
    );
    chevron = screen.getByTestId('chevron-up');
    expect(chevron.className).toBe('sort-icon active');

    // Cambio a ordenado descendente
    rerender(
      <SortButton 
        {...defaultProps}
        currentSort="name"
        currentOrder="desc"
      />
    );
    const downChevron = screen.getByTestId('chevron-down');
    expect(downChevron.className).toBe('sort-icon active');
  });

  // Prueba de contenido del botón
  it('renders complex children correctly', () => {
    render(
      <SortButton {...defaultProps}>
        <span data-testid="custom-content">Complex Content</span>
      </SortButton>
    );
    
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });

  // Prueba de múltiples clicks
  it('handles multiple clicks correctly', async () => {
    const handleClick = jest.fn();
    render(<SortButton {...defaultProps} onClick={handleClick} />);
    
    const button = screen.getByTestId('button');
    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(3);
  });
});