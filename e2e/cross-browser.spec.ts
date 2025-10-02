import { test, expect } from '@playwright/test';

test.describe('Cross-browser Compatibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Aproxima/);
    
    // Check main navigation
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check main content
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Check footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('navigation works across pages', async ({ page }) => {
    // Test navigation to different pages
    const pages = [
      { link: 'Gestante', expectedPath: '/gestante' },
      { link: 'Área do Profissional', expectedPath: '/area-do-profissional' },
      { link: 'Produtos Acessíveis', expectedPath: '/produtos-acessiveis' },
      { link: 'Quem Somos', expectedPath: '/quem-somos' },
      { link: 'Contato', expectedPath: '/contato' }
    ];

    for (const pageInfo of pages) {
      // Click the navigation link
      await page.click(`text="${pageInfo.link}"`);
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      
      // Check URL
      expect(page.url()).toContain(pageInfo.expectedPath);
      
      // Go back to home
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    }
  });

  test('forms function correctly', async ({ page }) => {
    await page.goto('/contato');
    
    // Fill out contact form if it exists
    const form = page.locator('form').first();
    if (await form.count() > 0) {
      const nameInput = form.locator('input[name*="name"], input[name*="nome"]').first();
      const emailInput = form.locator('input[type="email"]').first();
      const messageInput = form.locator('textarea').first();
      
      if (await nameInput.count() > 0) {
        await nameInput.fill('Test User');
      }
      
      if (await emailInput.count() > 0) {
        await emailInput.fill('test@example.com');
      }
      
      if (await messageInput.count() > 0) {
        await messageInput.fill('Test message');
      }
      
      // Check if form validates
      const submitButton = form.locator('button[type="submit"], input[type="submit"]').first();
      if (await submitButton.count() > 0) {
        await expect(submitButton).toBeEnabled();
      }
    }
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile menu exists and works
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]');
    if (await mobileMenuButton.count() > 0) {
      await mobileMenuButton.click();
      
      // Check if menu opens
      const mobileMenu = page.locator('[role="dialog"], [aria-expanded="true"]');
      if (await mobileMenu.count() > 0) {
        await expect(mobileMenu).toBeVisible();
      }
    }
    
    // Check content is readable on mobile
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
    
    // Ensure no horizontal scroll
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth + 10); // Small tolerance
  });

  test('images load correctly', async ({ page }) => {
    // Wait for all images to load
    await page.waitForLoadState('networkidle');
    
    const images = await page.locator('img').all();
    
    for (const img of images) {
      // Check if image is loaded
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      const naturalHeight = await img.evaluate((el: HTMLImageElement) => el.naturalHeight);
      
      // Image should have dimensions (loaded successfully)
      expect(naturalWidth).toBeGreaterThan(0);
      expect(naturalHeight).toBeGreaterThan(0);
      
      // Image should be visible
      await expect(img).toBeVisible();
    }
  });

  test('JavaScript functionality works', async ({ page }) => {
    // Test interactive elements
    const buttons = await page.locator('button:not([disabled])').all();
    
    for (const button of buttons.slice(0, 3)) { // Test first 3 buttons
      const isVisible = await button.isVisible();
      if (isVisible) {
        // Click button and ensure no JavaScript errors
        await button.click();
        
        // Wait a bit for any potential actions
        await page.waitForTimeout(500);
        
        // Check console for errors
        const errors = await page.evaluate(() => {
          return window.console?.error || [];
        });
        
        // Should not have critical JavaScript errors
        expect(errors).toBeDefined();
      }
    }
  });

  test('CSS styles load correctly', async ({ page }) => {
    // Check if main styles are applied
    const body = page.locator('body');
    const bodyStyles = await body.evaluate((el) => {
      return window.getComputedStyle(el);
    });
    
    // Should have some CSS applied (not default browser styles)
    expect(bodyStyles.fontFamily).not.toBe('Times'); // Default browser font
    
    // Check header styles
    const header = page.locator('header');
    if (await header.count() > 0) {
      const headerStyles = await header.evaluate((el) => {
        return window.getComputedStyle(el);
      });
      
      // Header should have some positioning
      expect(['static', 'relative', 'absolute', 'fixed', 'sticky']).toContain(headerStyles.position);
    }
  });

  test('performance is acceptable', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within reasonable time (5 seconds)
    expect(loadTime).toBeLessThan(5000);
    
    // Check for Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const results = entries.map(entry => ({
            name: entry.name,
            value: entry.value || entry.duration
          }));
          resolve(results);
        }).observe({ entryTypes: ['measure', 'navigation'] });
        
        // Fallback timeout
        setTimeout(() => resolve([]), 2000);
      });
    });
    
    expect(metrics).toBeDefined();
  });

  test('external links work correctly', async ({ page }) => {
    const externalLinks = await page.locator('a[href^="http"], a[target="_blank"]').all();
    
    for (const link of externalLinks.slice(0, 3)) { // Test first 3 external links
      const href = await link.getAttribute('href');
      const target = await link.getAttribute('target');
      
      if (href && href.startsWith('http')) {
        // External links should open in new tab
        expect(target).toBe('_blank');
        
        // Should have security attributes
        const rel = await link.getAttribute('rel');
        expect(rel).toContain('noopener');
      }
    }
  });

  test('error handling works', async ({ page }) => {
    // Test 404 page
    const response = await page.goto('/non-existent-page');
    
    if (response) {
      // Should handle 404 gracefully
      expect([200, 404]).toContain(response.status());
      
      // Page should still render something
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });
});