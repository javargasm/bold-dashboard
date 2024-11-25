import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterPeriodButtons from './FilterPeriodButtons';
import * as FilterContext from '@context/FilterContext';
import React from 'react';

// Mocks de componentes
jest.mock('@components/atoms/Button/Button', () => ({
  __esModule: true,
  default: function MockButton({ 
    children, 
    onClick, 
    className 
  }: { 
    children: React.ReactNode; 
    onClick?: () => void; 
    className?: string;
  }) {
    return (
      <button 
        onClick={onClick} 
        className={className}
        data-testid="period-button"
      >
        {children}
      </button>
    );
  }
}));

jest.mock('@components/atoms/Skeleton/Skeleton', () => ({
  __esModule: true,
  default: function MockSkeleton({ height }: { height: number }) {
    return <div data-testid="skeleton" style={{ height: `${height}px` }} />;
  }
}));

jest.mock('react-cookie', () => ({
  withCookies: (component: any) => component,
  Cookies: class MockCookies {
    get = jest.fn()
    set = jest.fn()
  }
}));

describe('FilterPeriodButtons Component', () => {
  const mockCookies = {
    get: jest.fn(),
    set: jest.fn()
  };

  const mockSetActivePeriod = jest.fn();
  
  // Función helper para obtener el nombre del mes actual
  const getCurrentMonthName = () => {
    const date = new Date();
    const month = date.toLocaleString('es-ES', { month: 'long' });
    return month.charAt(0).toUpperCase() + month.slice(1);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock del hook useFiltersContext
    jest.spyOn(FilterContext, 'useFiltersContext').mockImplementation(() => ({
      activePeriod: 'today',
      setActivePeriod: mockSetActivePeriod
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders period buttons correctly', () => {
    render(<FilterPeriodButtons cookies={mockCookies} />);
    
    const buttons = screen.getAllByTestId('period-button');
    expect(buttons).toHaveLength(3);
    expect(screen.getByText('Hoy')).toBeInTheDocument();
    expect(screen.getByText('Esta semana')).toBeInTheDocument();
    expect(screen.getByText(getCurrentMonthName())).toBeInTheDocument();
  });

  it('marks active period button correctly', () => {
    jest.spyOn(FilterContext, 'useFiltersContext').mockImplementation(() => ({
      activePeriod: 'week',
      setActivePeriod: mockSetActivePeriod
    }));

    render(<FilterPeriodButtons cookies={mockCookies} />);
    
    const weekButton = screen.getByText('Esta semana');
    expect(weekButton).toHaveClass('tab', 'activeTab');
  });

  it('handles period change correctly', async () => {
    mockCookies.get.mockReturnValue(null);
    render(<FilterPeriodButtons cookies={mockCookies} />);
    
    const weekButton = screen.getByText('Esta semana');
    await userEvent.click(weekButton);
    
    expect(mockCookies.set).toHaveBeenCalledWith(
      'PERIOD',
      'week',
      expect.any(Object)
    );
    expect(mockSetActivePeriod).toHaveBeenCalledWith('week');
  });

  it('reuses existing cookie value when period matches', async () => {
    mockCookies.get.mockReturnValue('week');
    render(<FilterPeriodButtons cookies={mockCookies} />);
    
    const weekButton = screen.getByText('Esta semana');
    await userEvent.click(weekButton);
    
    expect(mockSetActivePeriod).toHaveBeenCalledWith('week');
  });

  it('applies correct CSS classes', () => {
    render(<FilterPeriodButtons cookies={mockCookies} />);
    
    const container = screen.getByText('Hoy').closest('.filterTabs');
    expect(container).toHaveClass('filterTabs');
    expect(container?.querySelector('.tabsContainer')).toBeInTheDocument();
    
    const activeButton = screen.getByText('Hoy');
    expect(activeButton).toHaveClass('tab', 'activeTab');
  });

  describe('period button interactions', () => {
    it('updates active period on month click', async () => {
      render(<FilterPeriodButtons cookies={mockCookies} />);
      
      const monthButton = screen.getByText(getCurrentMonthName());
      await userEvent.click(monthButton);
      
      expect(mockSetActivePeriod).toHaveBeenCalledWith('month');
    });

    it('handles multiple period changes', async () => {
      render(<FilterPeriodButtons cookies={mockCookies} />);
      
      const todayButton = screen.getByText('Hoy');
      const weekButton = screen.getByText('Esta semana');
      
      await userEvent.click(weekButton);
      expect(mockSetActivePeriod).toHaveBeenCalledWith('week');
      
      await userEvent.click(todayButton);
      expect(mockSetActivePeriod).toHaveBeenCalledWith('today');
    });
  });

  it('handles cookie interactions correctly', async () => {
    mockCookies.get.mockReturnValue('week');
    render(<FilterPeriodButtons cookies={mockCookies} />);
    
    const weekButton = screen.getByText('Esta semana');
    await userEvent.click(weekButton);
    
    expect(mockCookies.get).toHaveBeenCalledWith('PERIOD');
    expect(mockSetActivePeriod).toHaveBeenCalledWith('week');
    expect(mockCookies.set).not.toHaveBeenCalled();
  });
});