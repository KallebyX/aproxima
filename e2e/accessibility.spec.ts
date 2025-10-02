import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Homepage Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag21aaa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should be navigable with keyboard only', async ({ page }) => {
    // Start from the top of the page
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Continue tabbing through interactive elements
    let tabCount = 0;
    const maxTabs = 20; // Reasonable limit to prevent infinite loops
    
    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab');
      tabCount++;
      
      const currentFocus = await page.locator(':focus');
      if (await currentFocus.count() === 0) {
        break; // No more focusable elements
      }
      
      // Ensure focused element is visible
      await expect(currentFocus).toBeVisible();
    }
    
    expect(tabCount).toBeGreaterThan(0);
  });

  test('should have proper heading structure', async ({ page }) => {
    // Check for h1 presence
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Get all headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    
    if (headings.length > 1) {
      // Check heading hierarchy
      let previousLevel = 0;
      
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        const currentLevel = parseInt(tagName.charAt(1));
        
        if (previousLevel === 0) {
          // First heading should be h1
          expect(currentLevel).toBe(1);
        } else if (currentLevel > previousLevel) {
          // Can only increase by 1 level
          expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
        }
        
        previousLevel = currentLevel;
      }
    }
  });

  test('should have accessible images', async ({ page }) => {
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      const ariaHidden = await img.getAttribute('aria-hidden');
      
      // Images should have alt text or be marked as decorative
      expect(alt !== null || ariaLabel !== null || ariaHidden === 'true').toBe(true);
    }
  });

  test('should support screen reader navigation', async ({ page }) => {
    // Check for ARIA landmarks
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();
    
    // Check for skip links
    const skipLink = page.locator('a[href*="#main"], a[href*="#content"]').first();
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeVisible();
    }
    
    // Check for proper ARIA labeling
    const interactiveElements = await page.locator('button, a, input, select, textarea').all();
    
    for (const element of interactiveElements) {
      const textContent = await element.textContent();
      const ariaLabel = await element.getAttribute('aria-label');
      const ariaLabelledby = await element.getAttribute('aria-labelledby');
      
      // Interactive elements should have accessible names
      expect(
        (textContent && textContent.trim().length > 0) ||
        ariaLabel ||
        ariaLabelledby
      ).toBeTruthy();
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['color-contrast', 'color-contrast-enhanced'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should respect reduced motion preferences', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    
    // Check if animations are disabled or reduced
    const animatedElements = await page.locator('[style*="animation"], [style*="transition"]').all();
    
    for (const element of animatedElements) {
      const style = await element.getAttribute('style');
      if (style) {
        // Should have reduced or no animation
        expect(
          style.includes('animation: none') ||
          style.includes('transition: none') ||
          style.includes('animation-duration: 0.01ms')
        ).toBeTruthy();
      }
    }
  });

  test('should work with high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });
    await page.reload();
    
    // Page should still be functional
    await expect(page.locator('body')).toBeVisible();
    
    // Check for proper focus indicators in high contrast
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus');
    if (await focusedElement.count() > 0) {
      await expect(focusedElement).toBeVisible();
    }
  });

  test('should support zoom up to 200%', async ({ page }) => {
    // Test zoom functionality
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Zoom to 200%
    await page.evaluate(() => {
      document.body.style.zoom = '2';
    });
    
    // Page should still be usable
    await expect(page.locator('body')).toBeVisible();
    
    // Main content should be accessible
    const main = page.locator('main, [role="main"]');
    if (await main.count() > 0) {
      await expect(main).toBeVisible();
    }
    
    // Reset zoom
    await page.evaluate(() => {
      document.body.style.zoom = '1';
    });
  });

  test('should have proper form accessibility', async ({ page }) => {
    const forms = await page.locator('form').all();
    
    for (const form of forms) {
      const inputs = await form.locator('input, select, textarea').all();
      
      for (const input of inputs) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledby = await input.getAttribute('aria-labelledby');
        
        if (id) {
          // Check for associated label
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.count() > 0;
          
          expect(hasLabel || ariaLabel || ariaLabelledby).toBeTruthy();
        } else {
          // Should have aria-label or aria-labelledby
          expect(ariaLabel || ariaLabelledby).toBeTruthy();
        }
        
        // Check required field indication
        const isRequired = await input.getAttribute('required');
        if (isRequired !== null) {
          const ariaRequired = await input.getAttribute('aria-required');
          expect(ariaRequired).toBe('true');
        }
      }
    }
  });
});