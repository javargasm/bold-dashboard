import { render } from '@testing-library/react';
import BlockUI from './BlockUI';

describe('BlockUI Component', () => {
  it('should render when isVisible is true', () => {
    const { container } = render(<BlockUI isVisible={true} />);
    const blockElement = container.firstChild;
    
    expect(blockElement).toBeTruthy();
    expect(blockElement).toHaveClass('blockUI');
    expect(blockElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('should not render when isVisible is false', () => {
    const { container } = render(<BlockUI isVisible={false} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should apply correct styles', () => {
    const { container } = render(<BlockUI isVisible={true} />);
    
    expect(container.firstChild).toHaveClass('blockUI');
  });

  it('should have correct accessibility attributes', () => {
    const { container } = render(<BlockUI isVisible={true} />);
    
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});