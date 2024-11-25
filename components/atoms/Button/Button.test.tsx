import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button Component', () => {
  // Pruebas de renderizado básico
  it('renders button with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('button primary md button-wrapper');
    expect(button).toHaveTextContent('Click me');
    expect(button).not.toBeDisabled();
  });

  // Pruebas de variantes
  it.each([
    ['primary', 'primary'],
    ['secondary', 'secondary'],
    ['outline', 'outline'],
  ])('renders %s variant correctly', (variant, expectedClass) => {
    render(<Button variant={variant as "primary" | "secondary" | "outline"}>Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(expectedClass);
  });

  // Pruebas de tamaños
  it.each([
    ['xs', 'xs'],
    ['sm', 'sm'],
    ['md', 'md'],
    ['lg', 'lg'],
  ])('renders %s size correctly', (size, expectedClass) => {
    render(<Button size={size as "xs" | "sm" | "md" | "lg"}>Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(expectedClass);
  });

  // Prueba de fullWidth
  it('applies fullWidth class when fullWidth prop is true', () => {
    render(<Button fullWidth>Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('fullWidth');
  });

  // Pruebas de estado de carga
  it('shows loading state and disables button when isLoading is true', () => {
    render(<Button isLoading>Click me</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveTextContent('Cargando...');
    expect(button).toBeDisabled();
  });

  // Pruebas de tooltip
  it('renders tooltip when tooltip prop is provided', () => {
    render(<Button tooltip="Helpful tip">Button</Button>);
    const tooltip = screen.getByText('Helpful tip');
    
    expect(tooltip).toBeInTheDocument();
    expect(tooltip.parentElement).toHaveClass('tooltip');
  });

  // Pruebas de disabled
  it('can be disabled', () => {
    render(<Button disabled>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  // Pruebas de className personalizada
  it('accepts and applies custom className', () => {
    render(<Button className="custom-class">Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  // Pruebas de eventos
  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button');
    
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Prueba de que no se llama onClick cuando está deshabilitado
  it('does not call onClick when disabled', async () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button');
    
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Prueba de que no se llama onClick cuando está cargando
  it('does not call onClick when loading', async () => {
    const handleClick = jest.fn();
    render(<Button isLoading onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button');
    
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Prueba de propagación de atributos HTML nativos
  it('spreads additional HTML button attributes', () => {
    render(
      <Button 
        data-testid="custom-button"
        aria-label="Custom button"
        type="submit"
      >
        Button
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-testid', 'custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});