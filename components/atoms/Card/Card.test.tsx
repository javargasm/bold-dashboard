import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card Component', () => {
  // Prueba de renderizado básico
  it('renders card with children', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );

    const content = screen.getByText('Card content');
    const cardElement = content.parentElement;
    
    expect(cardElement).toHaveClass('card-content');
    expect(cardElement?.parentElement).toHaveClass('card');
  });

  // Prueba del header
  it('renders header when provided', () => {
    render(
      <Card header={<h2>Card Title</h2>}>
        <p>Card content</p>
      </Card>
    );

    const header = screen.getByText('Card Title');
    expect(header.parentElement).toHaveClass('card-header');
  });

  // Prueba sin header
  it('does not render header when not provided', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );

    const header = document.querySelector('.card-header');
    expect(header).not.toBeInTheDocument();
  });

  // Prueba de className personalizada para el contenedor
  it('accepts and applies custom className to container', () => {
    render(
      <Card className="custom-card">
        <p>Card content</p>
      </Card>
    );

    const card = document.querySelector('.card');
    expect(card).toHaveClass('custom-card');
  });

  // Prueba de className personalizada para el contenido
  it('accepts and applies custom className to content', () => {
    render(
      <Card classNameContent="custom-content">
        <p>Card content</p>
      </Card>
    );

    const content = document.querySelector('.card-content');
    expect(content).toHaveClass('custom-content');
  });

  // Prueba de múltiples children
  it('renders multiple children correctly', () => {
    render(
      <Card>
        <p>First paragraph</p>
        <p>Second paragraph</p>
        <button>Click me</button>
      </Card>
    );

    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  // Prueba de header complejo
  it('renders complex header content correctly', () => {
    render(
      <Card
        header={
          <div>
            <h2>Main Title</h2>
            <p>Subtitle</p>
          </div>
        }
      >
        <p>Card content</p>
      </Card>
    );

    expect(screen.getByText('Main Title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  // Prueba de propagación de propiedades HTML
  it('spreads additional HTML attributes to container', () => {
    render(
      <Card data-testid="custom-card" aria-label="Test Card">
        <p>Card content</p>
      </Card>
    );

    const card = screen.getByTestId('custom-card');
    expect(card).toHaveAttribute('aria-label', 'Test Card');
  });

  // Prueba de estructura DOM
  it('maintains correct DOM hierarchy', () => {
    render(
      <Card header={<h2>Title</h2>}>
        <p>Content</p>
      </Card>
    );

    const card = document.querySelector('.card');
    const header = document.querySelector('.card-header');
    const content = document.querySelector('.card-content');

    expect(card).toContainElement(header as HTMLElement);
    expect(card).toContainElement(content as HTMLElement);
    expect(header).toContainElement(screen.getByText('Title'));
    expect(content).toContainElement(screen.getByText('Content'));
  });

  // Prueba de eventos
  it('handles events correctly', () => {
    const handleClick = jest.fn();
    
    render(
      <Card onClick={handleClick}>
        <p>Card content</p>
      </Card>
    );

    const card = document.querySelector('.card');
    (card as HTMLElement)?.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Prueba de estilos dinámicos
  it('combines multiple class names correctly', () => {
    render(
      <Card 
        className="custom-card theme-dark" 
        classNameContent="custom-content padding-large"
      >
        <p>Content</p>
      </Card>
    );

    const card = document.querySelector('.card');
    const content = document.querySelector('.card-content');

    expect(card).toHaveClass('card', 'custom-card', 'theme-dark');
    expect(content).toHaveClass('card-content', 'custom-content', 'padding-large');
  });
});