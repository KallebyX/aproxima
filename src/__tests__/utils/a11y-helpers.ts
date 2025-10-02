/**
 * Utility functions for accessibility testing
 */
import { render, RenderResult } from '@testing-library/react';
import { axe, AxeResults } from 'jest-axe';
import userEvent from '@testing-library/user-event';

/**
 * Enhanced render function with accessibility testing
 */
export async function renderWithA11yCheck(
  component: React.ReactElement,
  options?: {
    axeOptions?: any;
    skipA11yCheck?: boolean;
  }
): Promise<{
  renderResult: RenderResult;
  a11yResults: AxeResults | null;
}> {
  const renderResult = render(component);
  
  if (options?.skipA11yCheck) {
    return { renderResult, a11yResults: null };
  }
  
  const a11yResults = await axe(renderResult.container, {
    rules: {
      // Enable AAA level checks
      'color-contrast-enhanced': { enabled: true },
      ...options?.axeOptions?.rules,
    },
    ...options?.axeOptions,
  });
  
  return { renderResult, a11yResults };
}

/**
 * Test keyboard navigation through all interactive elements
 */
export async function testKeyboardNavigation(container: HTMLElement): Promise<void> {
  const user = userEvent.setup();
  
  // Get all interactive elements
  const interactiveElements = container.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (interactiveElements.length === 0) {
    return; // No interactive elements to test
  }
  
  // Focus first element
  const firstElement = interactiveElements[0] as HTMLElement;
  firstElement.focus();
  expect(document.activeElement).toBe(firstElement);
  
  // Tab through all elements
  for (let i = 1; i < interactiveElements.length; i++) {
    await user.tab();
    expect(document.activeElement).toBe(interactiveElements[i]);
  }
  
  // Test shift+tab backwards
  for (let i = interactiveElements.length - 2; i >= 0; i--) {
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(interactiveElements[i]);
  }
}

/**
 * Test screen reader announcements
 */
export function testAriaLiveRegions(container: HTMLElement): void {
  const liveRegions = container.querySelectorAll('[aria-live]');
  
  liveRegions.forEach(region => {
    const liveValue = region.getAttribute('aria-live');
    expect(['polite', 'assertive', 'off']).toContain(liveValue);
  });
}

/**
 * Test heading hierarchy
 */
export function testHeadingHierarchy(container: HTMLElement): void {
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  if (headings.length === 0) {
    return; // No headings to test
  }
  
  const levels = Array.from(headings).map(heading => 
    parseInt(heading.tagName.charAt(1))
  );
  
  // Should start with h1
  expect(levels[0]).toBe(1);
  
  // Check for proper hierarchy (no skipping levels)
  for (let i = 1; i < levels.length; i++) {
    const current = levels[i];
    const previous = levels[i - 1];
    
    // Can stay same, go one level deeper, or go to any shallower level
    if (current > previous) {
      expect(current - previous).toBeLessThanOrEqual(1);
    }
  }
}

/**
 * Test color contrast
 */
export async function testColorContrast(container: HTMLElement): Promise<void> {
  const results = await axe(container, {
    rules: {
      'color-contrast': { enabled: true },
      'color-contrast-enhanced': { enabled: true },
    },
  });
  
  expect(results.violations).toHaveLength(0);
}

/**
 * Test form accessibility
 */
export function testFormAccessibility(container: HTMLElement): void {
  const inputs = container.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');
    
    if (id) {
      // Should have an associated label
      const label = container.querySelector(`label[for="${id}"]`);
      expect(label || ariaLabel || ariaLabelledBy).toBeTruthy();
    } else {
      // Should have aria-label or aria-labelledby
      expect(ariaLabel || ariaLabelledBy).toBeTruthy();
    }
    
    // Required fields should be marked
    if (input.hasAttribute('required')) {
      const ariaRequired = input.getAttribute('aria-required');
      expect(ariaRequired).toBe('true');
    }
  });
}

/**
 * Test focus management
 */
export async function testFocusManagement(container: HTMLElement): Promise<void> {
  const user = userEvent.setup();
  
  // Test that focus is visible
  const focusableElements = container.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  for (const element of focusableElements) {
    (element as HTMLElement).focus();
    
    // Focus should be visible (not hidden with outline: none without alternative)
    const styles = window.getComputedStyle(element);
    if (styles.outline === 'none' || styles.outlineWidth === '0px') {
      // Should have alternative focus indicator
      const hasBoxShadow = styles.boxShadow !== 'none';
      const hasBorder = styles.borderStyle !== 'none';
      const hasBackground = styles.backgroundColor !== 'transparent';
      
      expect(hasBoxShadow || hasBorder || hasBackground).toBe(true);
    }
  }
}

/**
 * Test ARIA attributes
 */
export function testAriaAttributes(container: HTMLElement): void {
  // Test buttons
  const buttons = container.querySelectorAll('button, [role="button"]');
  buttons.forEach(button => {
    if (button.textContent?.trim() === '') {
      // Empty buttons should have aria-label
      expect(button.getAttribute('aria-label')).toBeTruthy();
    }
  });
  
  // Test links
  const links = container.querySelectorAll('a, [role="link"]');
  links.forEach(link => {
    if (link.textContent?.trim() === '') {
      // Empty links should have aria-label
      expect(link.getAttribute('aria-label')).toBeTruthy();
    }
  });
  
  // Test images
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    const alt = img.getAttribute('alt');
    const ariaLabel = img.getAttribute('aria-label');
    const ariaHidden = img.getAttribute('aria-hidden');
    
    // Images should have alt text or be marked as decorative
    expect(alt !== null || ariaLabel || ariaHidden === 'true').toBe(true);
  });
}

/**
 * Comprehensive accessibility test suite
 */
export async function runA11yTestSuite(
  component: React.ReactElement,
  options?: {
    skipTests?: string[];
    axeOptions?: any;
  }
): Promise<void> {
  const { renderResult, a11yResults } = await renderWithA11yCheck(component, {
    axeOptions: options?.axeOptions,
  });
  
  const { container } = renderResult;
  const skipTests = options?.skipTests || [];
  
  // Run axe accessibility check
  if (!skipTests.includes('axe') && a11yResults) {
    expect(a11yResults).toHaveNoViolations();
  }
  
  // Test keyboard navigation
  if (!skipTests.includes('keyboard')) {
    await testKeyboardNavigation(container);
  }
  
  // Test heading hierarchy
  if (!skipTests.includes('headings')) {
    testHeadingHierarchy(container);
  }
  
  // Test ARIA live regions
  if (!skipTests.includes('liveRegions')) {
    testAriaLiveRegions(container);
  }
  
  // Test form accessibility
  if (!skipTests.includes('forms')) {
    testFormAccessibility(container);
  }
  
  // Test focus management
  if (!skipTests.includes('focus')) {
    await testFocusManagement(container);
  }
  
  // Test ARIA attributes
  if (!skipTests.includes('aria')) {
    testAriaAttributes(container);
  }
}

export default {
  renderWithA11yCheck,
  testKeyboardNavigation,
  testAriaLiveRegions,
  testHeadingHierarchy,
  testColorContrast,
  testFormAccessibility,
  testFocusManagement,
  testAriaAttributes,
  runA11yTestSuite,
};