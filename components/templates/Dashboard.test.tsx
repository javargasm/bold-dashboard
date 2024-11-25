import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

// Mock de next/dynamic
jest.mock('next/dynamic', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function mockDynamic(dynamicImport: () => Promise<any>, options?: { loading?: () => JSX.Element }) {
    if (options?.loading) {
      return options.loading;
    }
    return function MockComponent() {
      return <div>Mock Dynamic Component</div>;
    };
  };
});

// Mock de los componentes
jest.mock('@components/atoms/Skeleton/Skeleton', () => {
  return function MockSkeleton({ className }: { className?: string }) {
    const testId = className?.includes('table') ? 'table-skeleton' : 'header-skeleton';
    return (
      <div data-testid={testId} className={className}>
        Skeleton
      </div>
    );
  };
});

jest.mock('@components/organisms/Navbar/Navbar.loading', () => {
  return function MockNavbarLoading() {
    return <div data-testid="navbar-loading">Navbar Loading</div>;
  };
});

jest.mock('@components/organisms/Navbar/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar Component</div>;
  };
});

jest.mock('@components/organisms/Header/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header Component</div>;
  };
});

jest.mock('@components/organisms/TransactionsTable/TransactionsTable', () => {
  return function MockTransactionsTable() {
    return <div data-testid="transactions-table">Transactions Table Component</div>;
  };
});

describe('Dashboard Component', () => {
  it('renders all loading components correctly', () => {
    render(<Dashboard />);
    
    expect(screen.getByTestId('navbar-loading')).toBeInTheDocument();
    expect(screen.getByTestId('header-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
  });

  it('renders with correct layout structure', () => {
    render(<Dashboard />);
    
    // Verificar estructura y estilos del contenedor principal
    const rootContainer = screen.getByTestId('navbar-loading').parentElement;
    expect(rootContainer).toHaveStyle({ overflowX: 'hidden' });

    // Verificar contenedor del contenido
    const contentContainer = screen.getByTestId('header-skeleton').parentElement;
    expect(contentContainer).toHaveStyle({ padding: '0 calc(5% - 10px)' });
  });

  it('renders table skeleton with correct class', () => {
    render(<Dashboard />);
    
    const tableSkeleton = screen.getByTestId('table-skeleton');
    expect(tableSkeleton).toHaveClass('table-skeleton');
  });

  it('renders components in correct order', () => {
    const { container } = render(<Dashboard />);
    
    // Obtener elementos principales
    const navbar = screen.getByTestId('navbar-loading');
    const headerSkeleton = screen.getByTestId('header-skeleton');
    const tableSkeleton = screen.getByTestId('table-skeleton');
    
    // Verificar orden jerárquico
    const mainContainer = container.querySelector('.container');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass('mx-auto px-4 mt-8');
    
    // Verificar que los componentes están en el orden correcto
    const rootDiv = container.firstChild as HTMLElement;
    expect(rootDiv.firstChild).toBe(navbar);
    
    const contentDiv = navbar.nextElementSibling;
    expect(contentDiv?.contains(headerSkeleton)).toBeTruthy();
    expect(contentDiv?.contains(tableSkeleton)).toBeTruthy();
  });

  it('maintains correct container hierarchy', () => {
    const { container } = render(<Dashboard />);
    
    // Verificar estructura del DOM
    const structure = {
      root: container.firstChild as HTMLElement,
      navbar: screen.getByTestId('navbar-loading'),
      header: screen.getByTestId('header-skeleton'),
      table: screen.getByTestId('table-skeleton')
    };
    
    // Verificar jerarquía
    expect(structure.root).toContainElement(structure.navbar);
    expect(structure.root).toContainElement(structure.header);
    expect(container.querySelector('.container')).toContainElement(structure.table);
  });

  it('applies correct styles to containers', () => {
    render(<Dashboard />);
    
    // Verificar estilos del contenedor principal
    const rootContainer = screen.getByTestId('navbar-loading').parentElement;
    expect(rootContainer).toHaveStyle({ overflowX: 'hidden' });
    
    // Verificar estilos del contenedor de contenido
    const contentContainer = screen.getByTestId('header-skeleton').parentElement;
    expect(contentContainer).toHaveStyle({ padding: '0 calc(5% - 10px)' });
    
    // Obtener el contenedor principal
    const mainContainer = screen.getByTestId('navbar-loading').parentElement?.querySelector('.container');
    expect(mainContainer).toHaveClass('mx-auto', 'px-4', 'mt-8');
  });
});