import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterOption from './FilterOption';

// Mock del componente Checkbox usando ruta relativa
jest.mock('../../atoms/Checkbox/Checkbox', () => ({
  __esModule: true,
  default: function MockCheckbox({ 
    checked, 
    onChange, 
    className 
  }: { 
    checked: boolean; 
    onChange: () => void; 
    className?: string;
  }) {
    return (
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={className}
        data-testid="mock-checkbox"
      />
    );
  }
}));

describe('FilterOption Component', () => {
  const defaultProps = {
    label: 'Test Option',
    checked: false,
    onChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct label', () => {
    render(<FilterOption {...defaultProps} />);
    
    expect(screen.getByText('Test Option')).toBeInTheDocument();
  });

  it('renders checkbox with correct props', () => {
    render(<FilterOption {...defaultProps} />);
    
    const checkbox = screen.getByTestId('mock-checkbox');
    expect(checkbox).toHaveClass('filterCheckbox');
    expect(checkbox).not.toBeChecked();
  });

  it('renders checked checkbox when checked prop is true', () => {
    render(<FilterOption {...defaultProps} checked={true} />);
    
    const checkbox = screen.getByTestId('mock-checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onChange when clicked', async () => {
    const handleChange = jest.fn();
    render(<FilterOption {...defaultProps} onChange={handleChange} />);
    
    const checkbox = screen.getByTestId('mock-checkbox');
    await userEvent.click(checkbox);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('has correct CSS classes', () => {
    render(<FilterOption {...defaultProps} />);
    
    const label = screen.getByText('Test Option').parentElement;
    expect(label).toHaveClass('filterOption');
    
    const text = screen.getByText('Test Option');
    expect(text).toHaveClass('filterOptionText');
  });

  it('maintains label-checkbox association', () => {
    render(<FilterOption {...defaultProps} />);
    
    const label = screen.getByText('Test Option').parentElement;
    expect(label?.tagName.toLowerCase()).toBe('label');
    expect(label).toContainElement(screen.getByTestId('mock-checkbox'));
  });

  it('handles keyboard interaction', async () => {
    const handleChange = jest.fn();
    render(<FilterOption {...defaultProps} onChange={handleChange} />);
    
    const checkbox = screen.getByTestId('mock-checkbox');
    checkbox.focus();
    await userEvent.keyboard('[Space]');
    
    expect(handleChange).toHaveBeenCalled();
  });
});