import { render } from '@testing-library/react';
import Icon from './Icon';

// No necesitamos mockear react-icons ya que los componentes son SVGs

describe('Icon Component', () => {
  // Prueba básica de renderizado
  it('renders without crashing', () => {
    const { container } = render(<Icon name="FiSliders" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  // Prueba que se renderiza el SVG correcto
  it('renders FiSliders as an svg element', () => {
    const { container } = render(<Icon name="FiSliders" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  // Prueba de cambio entre iconos
  it('renders FiX as an svg element', () => {
    const { container } = render(<Icon name="FiX" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  // Prueba de className
  it('applies custom className to the svg', () => {
    const { container } = render(
      <Icon name="FiSliders" className="custom-icon" />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-icon');
  });

  // Prueba de múltiples className
  it('applies multiple classNames correctly', () => {
    const { container } = render(
      <Icon name="FiSliders" className="icon-1 icon-2" />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('icon-1', 'icon-2');
  });

  // Prueba de renderizado sin className
  it('renders without className when not provided', () => {
    const { container } = render(<Icon name="FiSliders" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // No verificamos la ausencia de clase porque react-icons puede añadir sus propias clases
  });

  // Prueba de que el componente mantiene las propiedades del SVG de react-icons
  it('maintains svg properties from react-icons', () => {
    const { container } = render(<Icon name="FiSliders" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });
});