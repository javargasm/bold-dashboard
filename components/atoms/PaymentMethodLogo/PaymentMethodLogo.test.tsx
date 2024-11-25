import { render } from '@testing-library/react';
import PaymentMethodLogo from './PaymentMethodLogo';
import { PaymentMethod } from "@models/transaction.model";

// Mock del componente Image de Next.js
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe('PaymentMethodLogo Component', () => {
  // Pruebas para métodos de pago sin franquicia
  describe('Non-card payment methods', () => {
    const nonCardMethods: PaymentMethod[] = ['PSE', 'BANCOLOMBIA', 'DAVIPLATA', 'NEQUI'];

    test.each(nonCardMethods)('renders %s method correctly', (method) => {
      const { container } = render(<PaymentMethodLogo method={method} />);
      
      const image = container.querySelector('img');
      const text = container.querySelector('.payment-method-text');
      
      expect(image).toHaveAttribute('src', `./assets/icons/${method.toLowerCase()}.svg`);
    expect(text).toHaveTextContent(new RegExp(`${method}$`, 'i'));
    });
  });

  // Pruebas para tarjetas de crédito
  describe('Card payment methods', () => {
    it('renders VISA card correctly', () => {
      const { container } = render(
        <PaymentMethodLogo method="CARD" franchise="VISA" />
      );
      
      const image = container.querySelector('img');
      const text = container.querySelector('.payment-method-text');
      
      expect(image).toHaveAttribute('src', './assets/icons/visa.svg');
      expect(image).toHaveAttribute('alt', 'Visa');
      expect(text).toHaveTextContent('**** 4324');
    });

    it('renders MASTERCARD correctly', () => {
      const { container } = render(
        <PaymentMethodLogo method="CARD" franchise="MASTERCARD" />
      );
      
      const image = container.querySelector('img');
      const text = container.querySelector('.payment-method-text');
      
      expect(image).toHaveAttribute('src', './assets/icons/mastercard.svg');
      expect(image).toHaveAttribute('alt', 'Mastercard');
      expect(text).toHaveTextContent('**** 1214');
    });

    it('renders default card when no franchise is provided', () => {
      const { container } = render(
        <PaymentMethodLogo method="CARD" />
      );
      
      const image = container.querySelector('img');
      const text = container.querySelector('.payment-method-text');
      
      expect(image).toHaveAttribute('class', 'payment-method-icon');
      expect(text).toHaveTextContent('');
    });
  });

  // Prueba del método por defecto
  it('renders default payment method for unknown method', () => {
    const { container } = render(
      <PaymentMethodLogo method="default"/>
    );
    
    const image = container.querySelector('img');
    const text = container.querySelector('.payment-method-text');
    
    expect(image).toHaveAttribute('src', './assets/icons/default.svg');
    expect(image).toHaveAttribute('alt', 'Unknown');
    expect(text).toHaveTextContent('Unknown Method');
  });

  // Pruebas de estructura y estilos
  describe('Component structure and styling', () => {
    it('has correct base structure', () => {
      const { container } = render(<PaymentMethodLogo method="PSE" />);
      
      expect(container.querySelector('.payment-method')).toBeInTheDocument();
      expect(container.querySelector('.payment-method-icon')).toBeInTheDocument();
      expect(container.querySelector('.payment-method-text')).toBeInTheDocument();
    });

    it('applies correct image dimensions', () => {
      const { container } = render(<PaymentMethodLogo method="PSE" />);
      const image = container.querySelector('img');
      
      expect(image).toHaveAttribute('width', '50');
      expect(image).toHaveAttribute('height', '50');
    });
  });

  // Pruebas de accesibilidad
  describe('Accessibility', () => {
    it('includes alt text for all payment methods', () => {
      const methods: PaymentMethod[] = ['PSE', 'BANCOLOMBIA', 'DAVIPLATA', 'NEQUI'];
      
      methods.forEach(method => {
        const { container } = render(<PaymentMethodLogo method={method} />);
        const image = container.querySelector('img');
        expect(image).toHaveAttribute('alt');
        expect(image?.getAttribute('alt')).not.toBe('');
      });
    });
  });

  // Pruebas de manejo de errores
  describe('Error handling', () => {
    it('handles missing franchise for CARD type gracefully', () => {
      const { container } = render(<PaymentMethodLogo method="CARD" />);
      
      const image = container.querySelector('img');
      expect(image).toHaveAttribute('class', 'payment-method-icon');
    });
    it('handles invalid franchise for CARD type', () => {
      const { container } = render(
        <PaymentMethodLogo method="CARD" franchise="INVALID" />
      );
      
      const image = container.querySelector('img');
      expect(image).toHaveAttribute('src',  './assets/icons/card.svg');
    });
  });
});