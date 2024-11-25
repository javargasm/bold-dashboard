import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterPanelHeader from './FilterPanelHeader';

// Mocks de componentes
jest.mock('@components/atoms/Button/Button', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children, onClick, className, ...props }: any) => (
    <button 
      onClick={onClick} 
      className={className}
      data-testid="close-button"
      {...props}
    >
      {children}
    </button>
  )
}));

jest.mock('@components/atoms/Icon/Icon', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ name, className }: any) => (
    <span 
      data-testid={`icon-${name}`}
      className={className}
    >
      {name}
    </span>
  )
}));

describe('FilterPanelHeader Component', () => {
  const defaultProps = {
    onClose: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header with correct title', () => {
    render(<FilterPanelHeader {...defaultProps} />);
    
    expect(screen.getByText('Filtrar')).toBeInTheDocument();
    expect(screen.getByText('Filtrar').tagName.toLowerCase()).toBe('h3');
  });

  it('renders close button with correct props', () => {
    render(<FilterPanelHeader {...defaultProps} />);
    
    const closeButton = screen.getByTestId('close-button');
    expect(closeButton).toHaveClass('closeButton');
    expect(closeButton).toHaveAttribute('aria-label', 'Cerrar');
  });

  it('renders close icon with correct props', () => {
    render(<FilterPanelHeader {...defaultProps} />);
    
    const closeIcon = screen.getByTestId('icon-FiX');
    expect(closeIcon).toHaveClass('closeIcon');
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = jest.fn();
    render(<FilterPanelHeader onClose={onClose} />);
    
    const closeButton = screen.getByTestId('close-button');
    await userEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has correct structure and classes', () => {
    const { container } = render(<FilterPanelHeader {...defaultProps} />);
    
    expect(container.firstChild).toHaveClass('filterPanelHeader');
    expect(screen.getByText('Filtrar')).toHaveClass('filterPanelTitle');
  });

  it('maintains accessibility attributes', () => {
    render(<FilterPanelHeader {...defaultProps} />);
    
    const closeButton = screen.getByTestId('close-button');
    expect(closeButton).toHaveAttribute('aria-label', 'Cerrar');
  });

  describe('Component Layout', () => {
    it('has correct layout structure', () => {
      const { container } = render(<FilterPanelHeader {...defaultProps} />);
      
      const header = container.firstChild as HTMLElement;
      const title = screen.getByText('Filtrar');
      const closeButton = screen.getByTestId('close-button');
      
      // Verificar que los elementos estén en el orden correcto
      expect(header.firstChild).toBe(title);
      expect(header.lastChild).toBe(closeButton);
    });
  });

  describe('Interaction Behavior', () => {
    it('handles multiple clicks correctly', async () => {
      const onClose = jest.fn();
      render(<FilterPanelHeader onClose={onClose} />);
      
      const closeButton = screen.getByTestId('close-button');
      await userEvent.click(closeButton);
      await userEvent.click(closeButton);
      await userEvent.click(closeButton);
      
      expect(onClose).toHaveBeenCalledTimes(3);
    });

    it('handles keyboard interaction', async () => {
      const onClose = jest.fn();
      render(<FilterPanelHeader onClose={onClose} />);
      
      const closeButton = screen.getByTestId('close-button');
      closeButton.focus();
      
      await userEvent.keyboard('{Enter}');
      expect(onClose).toHaveBeenCalledTimes(1);
      
      await userEvent.keyboard(' ');
      expect(onClose).toHaveBeenCalledTimes(2);
    });
  });

  describe('Visual Elements', () => {
    it('renders all visual elements correctly', () => {
      render(<FilterPanelHeader {...defaultProps} />);
      
      // Verificar título
      const title = screen.getByText('Filtrar');
      expect(title).toHaveClass('filterPanelTitle');
      
      // Verificar botón de cierre
      const closeButton = screen.getByTestId('close-button');
      expect(closeButton).toHaveClass('closeButton');
      
      // Verificar icono
      const closeIcon = screen.getByTestId('icon-FiX');
      expect(closeIcon).toHaveClass('closeIcon');
    });
  });
});