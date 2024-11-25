import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchInput from './SearchInput';

// Mock del componente Input
jest.mock('../Input/Input', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => <input {...props} data-testid="input-component" />,
}));

// Mock de react-icons/fi
jest.mock('react-icons/fi', () => ({
  FiSearch: () => <span data-testid="search-icon">SearchIcon</span>,
}));

describe('SearchInput Component', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    placeholder: 'Search...',
  };

  // Prueba de renderizado básico
  it('renders all components correctly', () => {
    render(<SearchInput {...defaultProps} />);
    
    expect(screen.getByTestId('input-component')).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  // Prueba de la estructura del componente
  it('has correct wrapper class', () => {
    const { container } = render(<SearchInput {...defaultProps} />);
    
    expect(container.firstChild).toHaveClass('transactions-table-search-input');
  });

  // Prueba del icono de búsqueda
  it('renders search icon with correct class', () => {
    render(<SearchInput {...defaultProps} />);
    
    const icon = screen.getByTestId('search-icon');
    const iconWrapper = icon.parentElement;
    expect(iconWrapper).toHaveClass('transactions-table-search-input');
  });

  // Prueba del Input
  it('renders input with correct props', () => {
    const testValue = 'test value';
    const handleChange = jest.fn();
    const testPlaceholder = 'Search transactions';
    
    render(
      <SearchInput
        value={testValue}
        onChange={handleChange}
        placeholder={testPlaceholder}
      />
    );
    
    const input = screen.getByTestId('input-component');
    expect(input).toHaveValue(testValue);
    expect(input).toHaveAttribute('placeholder', testPlaceholder);
    expect(input).toHaveClass('transactions-table-input');
  });

  // Prueba del evento onChange
  it('calls onChange when input value changes', async () => {
    const handleChange = jest.fn();
    render(<SearchInput {...defaultProps} onChange={handleChange} />);
    
    const input = screen.getByTestId('input-component');
    await userEvent.type(input, 'test');
    
    expect(handleChange).toHaveBeenCalled();
  });

  // Prueba sin placeholder
  it('renders without placeholder when not provided', () => {
    const { value, onChange } = defaultProps;
    render(<SearchInput value={value} onChange={onChange} />);
    
    const input = screen.getByTestId('input-component');
    expect(input).not.toHaveAttribute('placeholder');
  });

  // Prueba de valor controlado
  it('updates value when prop changes', () => {
    const { rerender } = render(<SearchInput {...defaultProps} value="initial" />);
    
    let input = screen.getByTestId('input-component');
    expect(input).toHaveValue('initial');
    
    rerender(<SearchInput {...defaultProps} value="updated" />);
    input = screen.getByTestId('input-component');
    expect(input).toHaveValue('updated');
  });

  // Prueba de manejo de eventos múltiples
  it('handles multiple input changes', async () => {
    const handleChange = jest.fn();
    render(<SearchInput {...defaultProps} onChange={handleChange} />);
    
    const input = screen.getByTestId('input-component');
    await userEvent.type(input, 'test');
    
    expect(handleChange).toHaveBeenCalledTimes(4); // Una vez por cada letra
  });

  // Prueba de accesibilidad básica
  it('maintains accessibility features', () => {
    render(<SearchInput {...defaultProps} />);
    
    const input = screen.getByTestId('input-component');
    expect(input).toBeEnabled();
    expect(input).not.toHaveAttribute('aria-disabled');
  });
});