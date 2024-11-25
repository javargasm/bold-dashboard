import { render } from '@testing-library/react';
import Skeleton from './Skeleton';

describe('Skeleton Component', () => {
  // Prueba de renderizado por defecto
  it('renders with default props', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    
    expect(skeleton).toHaveClass('skeleton', 'skeleton--wave');
    expect(skeleton).toHaveStyle({
      width: '100%',
      height: '1rem',
      borderRadius: '0.25rem'
    });
  });

  // Prueba de className personalizada
  it('applies custom className', () => {
    const { container } = render(<Skeleton className="custom-skeleton" />);
    const skeleton = container.firstChild as HTMLElement;
    
    expect(skeleton).toHaveClass('skeleton', 'skeleton--wave', 'custom-skeleton');
  });

  // Pruebas de dimensiones numéricas
  it('handles numeric dimensions correctly', () => {
    const { container } = render(
      <Skeleton 
        width={200} 
        height={100} 
        borderRadius={8}
      />
    );
    const skeleton = container.firstChild as HTMLElement;
    
    expect(skeleton).toHaveStyle({
      width: '200px',
      height: '100px',
      borderRadius: '8px'
    });
  });

  // Pruebas de dimensiones en string
  it('handles string dimensions correctly', () => {
    const { container } = render(
      <Skeleton 
        width="50%" 
        height="5rem" 
        borderRadius="1rem"
      />
    );
    const skeleton = container.firstChild as HTMLElement;
    
    expect(skeleton).toHaveStyle({
      width: '50%',
      height: '5rem',
      borderRadius: '1rem'
    });
  });

  // Prueba de animaciones
  describe('animations', () => {
    it('applies pulse animation', () => {
      const { container } = render(<Skeleton animation="pulse" />);
      const skeleton = container.firstChild as HTMLElement;
      
      expect(skeleton).toHaveClass('skeleton--pulse');
      expect(skeleton).not.toHaveClass('skeleton--wave');
    });

    it('applies wave animation', () => {
      const { container } = render(<Skeleton animation="wave" />);
      const skeleton = container.firstChild as HTMLElement;
      
      expect(skeleton).toHaveClass('skeleton--wave');
      expect(skeleton).not.toHaveClass('skeleton--pulse');
    });
  });

  // Prueba de estilos personalizados
  it('applies custom styles', () => {
    const customStyle = {
      backgroundColor: 'red',
      margin: '10px',
      opacity: 0.5
    };

    const { container } = render(<Skeleton style={customStyle} />);
    const skeleton = container.firstChild as HTMLElement;
    
    expect(skeleton).toHaveStyle({
      backgroundColor: 'red',
      margin: '10px',
      opacity: '0.5'
    });
  });

  // Prueba de combinación de estilos
  it('combines default and custom styles correctly', () => {
    const customStyle = {
      margin: '10px',
      backgroundColor: 'blue'
    };

    const { container } = render(
      <Skeleton
        width={100}
        height="2rem"
        style={customStyle}
      />
    );
    const skeleton = container.firstChild as HTMLElement;
    
    expect(skeleton).toHaveStyle({
      width: '100px',
      height: '2rem',
      margin: '10px',
      backgroundColor: 'blue'
    });
  });

  // Pruebas de valores extremos
  describe('edge cases', () => {
    it('handles zero values', () => {
      const { container } = render(
        <Skeleton 
          width={0} 
          height={0} 
          borderRadius={0}
        />
      );
      const skeleton = container.firstChild as HTMLElement;
      
      expect(skeleton).toHaveStyle({
        width: '0px',
        height: '0px',
        borderRadius: '0px'
      });
    });

    it('handles large values', () => {
      const { container } = render(
        <Skeleton 
          width={10000} 
          height={10000} 
          borderRadius={1000}
        />
      );
      const skeleton = container.firstChild as HTMLElement;
      
      expect(skeleton).toHaveStyle({
        width: '10000px',
        height: '10000px',
        borderRadius: '1000px'
      });
    });
  });

  // Prueba de múltiples props
  it('handles multiple props correctly', () => {
    const { container } = render(
      <Skeleton
        className="custom-class"
        width="75%"
        height={200}
        borderRadius="50%"
        animation="pulse"
        style={{ margin: '1rem' }}
      />
    );
    const skeleton = container.firstChild as HTMLElement;
    
    expect(skeleton).toHaveClass('skeleton', 'skeleton--pulse', 'custom-class');
    expect(skeleton).toHaveStyle({
      width: '75%',
      height: '200px',
      borderRadius: '50%',
      margin: '1rem'
    });
  });

});