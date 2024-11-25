import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input Component', () => {
  // Prueba de renderizado básico
  it('renders input element correctly', () => {
    render(<Input placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('input');
  });

  // Prueba con icono
  it('renders with icon', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;
    render(<Input icon={<TestIcon />} />);
    
    const icon = screen.getByTestId('test-icon');
    const input = screen.getByRole('textbox');
    
    expect(icon).toBeInTheDocument();
    expect(icon.parentElement).toHaveClass('inputIcon');
    expect(input).toHaveClass('withIcon');
  });

  // Prueba con mensaje de error
  it('renders error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    render(<Input error={errorMessage} />);
    
    const error = screen.getByText(errorMessage);
    const input = screen.getByRole('textbox');
    
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass('errorMessage');
    expect(input).toHaveClass('error');
  });

  // Prueba de className personalizada
  it('applies custom className', () => {
    render(<Input className="custom-input" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-input');
    expect(input).toHaveClass('input'); // Mantiene la clase base
  });

  // Prueba de múltiples clases y estados
  it('combines multiple classes correctly', () => {
    const TestIcon = () => <span>Icon</span>;
    render(
      <Input 
        icon={<TestIcon />}
        error="Error message"
        className="custom-input"
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('input', 'withIcon', 'error', 'custom-input');
  });

  // Prueba de manejo de eventos
  it('handles user input correctly', async () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test');
    
    expect(handleChange).toHaveBeenCalledTimes(4); // Una vez por cada letra
    expect(input).toHaveValue('test');
  });

  // Prueba de props HTML nativas
  it('spreads native input props correctly', () => {
    render(
      <Input
        type="email"
        placeholder="Enter email"
        required
        aria-label="Email input"
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Enter email');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-label', 'Email input');
  });

  // Prueba del wrapper
  it('renders with correct wrapper structure', () => {
    render(<Input />);
    
    const wrapper = screen.getByRole('textbox').parentElement;
    expect(wrapper).toHaveClass('inputWrapper');
  });

  // Prueba de disabled
  it('handles disabled state', () => {
    render(<Input disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  // Prueba de focus
  it('can receive focus', async () => {
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    await userEvent.click(input);
    
    expect(input).toHaveFocus();
  });

  // Prueba de valor controlado
  it('works as a controlled component', () => {
    const { rerender } = render(<Input value="initial" onChange={() => {}} />);
    
    let input = screen.getByRole('textbox');
    expect(input).toHaveValue('initial');
    
    rerender(<Input value="updated" onChange={() => {}} />);
    input = screen.getByRole('textbox');
    expect(input).toHaveValue('updated');
  });

  // Prueba de accesibilidad con error
  it('associates error message with input for accessibility', () => {
    render(<Input error="Error message" aria-label="Test input" />);
    
    const input = screen.getByRole('textbox');
    const errorMessage = screen.getByText('Error message');
    
    // Verifica que el error esté presente y visible
    expect(errorMessage).toBeVisible();
    expect(input).toHaveClass('error');
  });

  // Prueba de limpieza de clases
  it('filters out empty class names', () => {
    render(<Input className="" />);
    
    const input = screen.getByRole('textbox');
    expect(input.className).toBe('input'); // Solo debe tener la clase base
  });
});