import { render } from '@testing-library/react';
import Logo from './Logo';

// Mock del componente Image de Next.js
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe('Logo Component', () => {
  // Prueba de renderizado básico
  it('renders logo component', () => {
    const { container } = render(<Logo />);
    const logoWrapper = container.querySelector('.logo');
    expect(logoWrapper).toBeInTheDocument();
  });

  // Prueba de la imagen
  it('renders image with correct props', () => {
    const { container } = render(<Logo />);
    const image = container.querySelector('img');
    
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', './assets/logo.svg');
    expect(image).toHaveAttribute('alt', 'Logo');
    expect(image).toHaveAttribute('width', '120');
    expect(image).toHaveAttribute('height', '100');
  });

  // Prueba de la estructura del componente
  it('maintains correct DOM structure', () => {
    const { container } = render(<Logo />);
    const logoWrapper = container.querySelector('.logo');
    const image = container.querySelector('img');
    
    expect(logoWrapper).toContainElement(image);
  });

  // Prueba de accesibilidad básica
  it('has accessible image attributes', () => {
    const { container } = render(<Logo />);
    const image = container.querySelector('img');
    
    expect(image).toHaveAttribute('alt', 'Logo');
    // El rol 'img' es implícito para elementos <img>
  });

  // Prueba de las dimensiones de la imagen
  it('has correct image dimensions', () => {
    const { container } = render(<Logo />);
    const image = container.querySelector('img');
    
    expect(image).toHaveAttribute('width', '120');
    expect(image).toHaveAttribute('height', '100');
  });

  // Prueba del contenedor
  it('has correct wrapper class', () => {
    const { container } = render(<Logo />);
    const logoWrapper = container.querySelector('.logo');
    
    expect(logoWrapper).toHaveClass('logo');
  });

  // Prueba de que la imagen está dentro del contenedor correcto
  it('renders image inside logo wrapper', () => {
    const { container } = render(<Logo />);
    const logoWrapper = container.querySelector('.logo');
    const image = container.querySelector('img');
    
    expect(logoWrapper?.firstChild).toBe(image);
  });
});