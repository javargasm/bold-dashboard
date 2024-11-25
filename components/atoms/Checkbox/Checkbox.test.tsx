import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkbox from './Checkbox';

describe('Checkbox Component', () => {
  // Prueba de renderizado básico
  it('renders checkbox with correct type', () => {
    const onChange = jest.fn();
    render(<Checkbox checked={false} onChange={onChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('type', 'checkbox');
  });

  // Prueba del estado checked
  it('renders in checked state when checked prop is true', () => {
    const onChange = jest.fn();
    render(<Checkbox checked={true} onChange={onChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  // Prueba del estado unchecked
  it('renders in unchecked state when checked prop is false', () => {
    const onChange = jest.fn();
    render(<Checkbox checked={false} onChange={onChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  // Prueba del evento onChange
  it('calls onChange handler when clicked', async () => {
    const onChange = jest.fn();
    render(<Checkbox checked={false} onChange={onChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);
    
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  // Prueba de className personalizada
  it('applies custom className when provided', () => {
    const onChange = jest.fn();
    render(
      <Checkbox 
        checked={false} 
        onChange={onChange} 
        className="custom-checkbox"
      />
    );
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('custom-checkbox');
  });

  // Prueba de comportamiento controlado
  it('maintains controlled behavior', async () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <Checkbox checked={false} onChange={onChange} />
    );
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    
    // Simular cambio desde el padre
    rerender(<Checkbox checked={true} onChange={onChange} />);
    expect(checkbox).toBeChecked();
    
    // El click debe llamar a onChange pero no cambiar el estado directamente
    await userEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(checkbox).toBeChecked(); // El estado sigue siendo el de las props
  });

  // Prueba de accesibilidad básica
  it('is accessible via keyboard', async () => {
    const onChange = jest.fn();
    render(<Checkbox checked={false} onChange={onChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    
    // Verificar que se puede enfocar
    checkbox.focus();
    expect(checkbox).toHaveFocus();
    
    // Simular uso del teclado (space)
    await userEvent.type(checkbox, '{space}');
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});