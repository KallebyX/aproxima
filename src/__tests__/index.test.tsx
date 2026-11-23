/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import HomePage from '../pages/index';

// The external VLibras script is covered by browser checks, not this DOM unit test.
jest.mock('../components/VLibras', () => () => null);

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<HomePage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('has accessible heading structure', () => {
    render(<HomePage />);
    
    // Check for main heading
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();
    expect(mainHeading).toHaveTextContent(/caderneta da gestante/i);
  });

  it('has proper landmark structure', () => {
    render(<HomePage />);
    
    // Check for main landmark
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    // Check for navigation (if present)
    const nav = screen.queryByRole('navigation');
    if (nav) {
      expect(nav).toBeInTheDocument();
    }
  });

  it('meets WCAG accessibility standards', async () => {
    const { container } = render(<HomePage />);
    
    const results = await axe(container, {
      rules: {
        // jsdom has no layout engine; contrast is checked in the real browser.
        'color-contrast': { enabled: false },
        'color-contrast-enhanced': { enabled: false },
      },
    });
    
    expect(results).toHaveNoViolations();
  });

  it('has proper document structure', () => {
    render(<HomePage />);
    
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('main')).toContainElement(screen.getByRole('heading', { level: 1 }));
  });

  it('supports keyboard navigation', () => {
    render(<HomePage />);
    
    // Get all interactive elements
    const interactiveElements = ['button', 'link', 'textbox', 'checkbox', 'radio']
      .flatMap(role => screen.queryAllByRole(role));
    
    // Each interactive element should be focusable
    interactiveElements.forEach(element => {
      expect(element).not.toHaveAttribute('tabindex', '-1');
    });
  });

  it('has appropriate ARIA attributes', () => {
    render(<HomePage />);
    
    // Check for ARIA landmarks
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    
    // Check for proper ARIA labeling on interactive elements
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      // Links should have accessible names
      expect(link).toHaveAccessibleName();
    });
  });

  it('provides alternative text for images', () => {
    render(<HomePage />);
    
    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAccessibleName();
    });
  });

  it('has valid accessible roles', async () => {
    const { container } = render(<HomePage />);
    
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: false },
        'color-contrast-enhanced': { enabled: false },
      },
    });
    
    expect(results).toHaveNoViolations();
  });

  it('supports screen readers', () => {
    render(<HomePage />);
    
    // Check for screen reader friendly content
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
    
    // Check that headings have text content
    headings.forEach(heading => {
      expect(heading).toHaveTextContent(/.+/);
    });
  });
});
