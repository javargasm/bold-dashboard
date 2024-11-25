// Header.test.tsx

import { render, screen } from '@testing-library/react';
import Header from './Header';
import React from 'react';

// Mock de los componentes de loading
jest.mock('../../molecules/TotalSalesCard/TotalSalesCard.loading', () => ({
  __esModule: true,
  TotalSalesCardLoading: () => <div data-testid="total-sales-loading">Loading Sales Card...</div>,
  FilterTabsLoading: () => <div data-testid="filter-tabs-loading">Loading Tabs...</div>,
  FilterButtonLoading: () => <div data-testid="filter-button-loading">Loading Filter Button...</div>
}));

// Mock de next/dynamic para renderizar los componentes inmediatamente
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (importFn, options) => {
    const key = importFn.toString();

    if (key.includes('TotalSalesCard')) {
      return function MockTotalSalesCard() {
        return <div data-testid="total-sales-card">TotalSalesCard Content</div>;
      };
    }

    if (key.includes('FilterPeriodButtons')) {
      return function MockFilterPeriodButtons() {
        return <div data-testid="filter-period-buttons">FilterPeriodButtons Content</div>;
      };
    }

    if (key.includes('FilterButton')) {
      return function MockFilterButton() {
        return <div data-testid="filter-button">FilterButton Content</div>;
      };
    }

    // Renderizar el componente de loading si está disponible
    if (options?.loading) {
      const LoadingComponent = options.loading;
      return LoadingComponent;
    }

    // Si no se encuentra un mock específico, retornar un componente por defecto
    return function DefaultDynamicComponent(props) {
      return <div {...props} />;
    };
  }
}));

describe('Header Component', () => {
  it('renders with correct structure', () => {
    const { container } = render(<Header />);

    // Verificar elementos principales
    expect(container.querySelector('header')).toHaveClass('header');
    expect(container.querySelector('.container')).toBeInTheDocument();
    expect(container.querySelector('.headerContent')).toBeInTheDocument();
  });

  it('renders all dynamic components', () => {
    render(<Header />);

    // Verificar que se renderizan los componentes dinámicos
    expect(screen.getByTestId('total-sales-card')).toBeInTheDocument();
    expect(screen.getByTestId('filter-period-buttons')).toBeInTheDocument();
    expect(screen.getByTestId('filter-button')).toBeInTheDocument();
  });

  it('has correct layout structure', () => {
    const { container } = render(<Header />);

    // Verificar estructura del layout
    const filterSection = container.querySelector('.filterSection');
    expect(filterSection).toBeInTheDocument();
    expect(filterSection?.querySelector('.filterButtonWrapper')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<Header />);

    // Verificar todas las clases CSS
    expect(container.querySelector('.header')).toBeInTheDocument();
    expect(container.querySelector('.container')).toBeInTheDocument();
    expect(container.querySelector('.headerContent')).toBeInTheDocument();
    expect(container.querySelector('.filterSection')).toBeInTheDocument();
    expect(container.querySelector('.filterButtonWrapper')).toBeInTheDocument();
  });

  describe('Layout Organization', () => {
    it('maintains correct component order', () => {
      const { container } = render(<Header />);

      const headerContent = container.querySelector('.headerContent');
      const children = Array.from(headerContent?.children || []);

      // Verificar orden de los componentes
      expect(children[0]).toContainElement(screen.getByTestId('total-sales-card'));
      expect(children[1]).toHaveClass('filterSection');
    });

    it('properly nests filter components', () => {
      const { container } = render(<Header />);

      const filterSection = container.querySelector('.filterSection');
      expect(filterSection).toContainElement(screen.getByTestId('filter-period-buttons'));
      expect(filterSection).toContainElement(container.querySelector('.filterButtonWrapper'));
    });
  });

  describe('Responsive Design', () => {
    it('maintains container structure', () => {
      const { container } = render(<Header />);

      const header = container.querySelector('header');
      const mainContainer = header?.querySelector('.container');

      expect(header).toContainElement(mainContainer as HTMLElement);
      expect(mainContainer).toContainElement(container.querySelector('.headerContent'));
    });
  });

  describe('Component Loading States', () => {
    beforeAll(() => {
      // Restablecer los módulos para aplicar un nuevo mock
      jest.resetModules();

      // Mock de next/dynamic para simular el estado de carga
      jest.doMock('next/dynamic', () => ({
        __esModule: true,
        default: (importFn, options) => {
          // Siempre renderizar el componente de loading
          if (options?.loading) {
            const LoadingComponent = options.loading;
            return LoadingComponent;
          }

          // No renderizar nada si no hay loading
          return () => null;
        }
      }));
    });

    afterAll(() => {
      // Restaurar los mocks originales después de las pruebas de carga
      jest.resetModules();
      jest.unmock('next/dynamic');
    });

    it('has correct loading component references', () => {
      // Importar Header después de aplicar el nuevo mock
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Header = require('./Header').default;

      render(<Header />);

      // Verificar que los componentes de loading están disponibles
      expect(screen.getByTestId('total-sales-loading')).toBeInTheDocument();
      expect(screen.getByTestId('filter-tabs-loading')).toBeInTheDocument();
      expect(screen.getByTestId('filter-button-loading')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses semantic header tag', () => {
      const { container } = render(<Header />);

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      expect(header?.tagName.toLowerCase()).toBe('header');
    });
  });
});