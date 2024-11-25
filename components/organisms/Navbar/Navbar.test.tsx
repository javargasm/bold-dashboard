/* eslint-disable @typescript-eslint/no-explicit-any */
// Navbar.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';

// ----------------------
// Global Mocks for General Tests
// ----------------------

// Mock the Skeleton component globally
jest.mock('@components/atoms/Skeleton/Skeleton', () => ({
  __esModule: true,
  default: () => <div data-testid="skeleton">Loading...</div>,
}));

// Mock the Button component globally
jest.mock('@components/atoms/Button/Button', () => ({
  __esModule: true,
  default: ({ children, isLoading, tooltip, ...props }: any) => (
    <button data-testid="button" {...props}>
      {isLoading ? 'Loading...' : children}
      {tooltip && <span data-testid="tooltip">{tooltip}</span>}
    </button>
  ),
}));

// Mock the Logo component to render synchronously
jest.mock('@components/atoms/Logo/Logo', () => ({
  __esModule: true,
  default: () => <div data-testid="logo">Mocked Logo</div>,
}));

describe('Navbar Component', () => {
  it('renders the Navbar with all elements', () => {
    render(<Navbar />);

    // Check for the nav element with the correct class
    const navElement = screen.getByRole('navigation');
    expect(navElement).toHaveClass('navbar');

    // Check for the container div
    const container = navElement.querySelector('.container.navbarContent');
    expect(container).toBeInTheDocument();


    // Check for buttons
    const buttons = screen.getAllByTestId('button');
    expect(buttons).toHaveLength(2);

    // Verify the first button text
    expect(buttons[0]).toHaveTextContent('Mi negocio');

    // Verify the second button text and icon
    expect(buttons[1]).toHaveTextContent('Ayuda');
    const helpIcon = buttons[1].querySelector('svg');
    expect(helpIcon).toBeInTheDocument();
    expect(helpIcon).toHaveClass('helpIcon');
  });

  it('displays loading state when isLoading is true', () => {
    render(<Navbar isLoading={true} />);

    // Check that buttons show loading state
    const buttons = screen.getAllByTestId('button');
    expect(buttons[0]).toHaveTextContent('Loading...');
    expect(buttons[1]).toHaveTextContent('Loading...');
  });

  it('renders tooltips correctly', () => {
    render(<Navbar />);

    // Find the Help button
    const helpButton = screen.getAllByTestId('button')[1];
    expect(helpButton).toHaveTextContent('Ayuda');

    // Check for the tooltip
    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('Contacta a alguien de soporte');
  });

  it('uses semantic HTML elements', () => {
    render(<Navbar />);

    // Check for the nav element
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();

    // Check for button roles
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });
});