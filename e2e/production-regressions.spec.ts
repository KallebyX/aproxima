import { test, expect } from '@playwright/test';

test('accessibility panel supports keyboard and invalid saved preferences', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('accessibility-settings', '{invalid'));
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Abrir painel de acessibilidade' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Acessibilidade' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Fechar painel de acessibilidade' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect.poll(() => dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator('footer').getByRole('link', { name: 'Oryum Tech', exact: true })).toHaveAttribute('href', 'https://www.oryumtech.com.br/');
  await expect(page.locator('footer').getByRole('link', { name: 'Universidade Franciscana', exact: true })).toHaveAttribute('href', 'https://site.ufn.edu.br/');
});

test('opens and navigates with legacy browser storage corrupted', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem('preloader-behavior-patterns', '{invalid');
    localStorage.setItem('preloader-route-predictions', 'null');
  });
  await page.clock.setFixedTime(new Date('2030-01-01T12:00:00Z'));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Abrir menu de navegação' })).toBeVisible();
  await page.getByRole('button', { name: 'Abrir menu de navegação' }).click();
  await page.locator('#mobile-menu a[href="/gestante"]').click();
  await expect(page).toHaveURL(/\/gestante$/);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('footer')).toContainText('2030');
  await page.getByRole('button', { name: 'Abrir painel de acessibilidade' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  expect(errors).toEqual([]);
});

test('privacy center opens without prompts and looks up only a private protocol', async ({ page }) => {
  const id = 'd388fdd3-9454-4464-afdf-2eb29fbcfe23';
  const dialogs: string[] = [];
  page.on('dialog', async dialog => { dialogs.push(dialog.type()); await dialog.dismiss(); });
  await page.route('**/api/lgpd/data-request?requestId=*', route => route.fulfill({ json: { success: true, request: { id, type: 'access', status: 'pending', createdAt: '2026-11-23T12:00:00.000Z', reference: 'LGPD-TEST' } } }));
  await page.goto('/central-privacidade');
  await expect(page.getByRole('heading', { name: 'Central de Privacidade' })).toBeVisible();
  await page.getByRole('button', { name: 'Solicitações de dados', exact: true }).click();
  await page.getByLabel('ID da solicitação', { exact: true }).fill(id);
  await page.getByRole('button', { name: 'Consultar', exact: true }).click();
  await expect(page.getByText('Referência: LGPD-TEST')).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('aproxima-data-request-ids'))).toContain(id);
  expect(dialogs).toEqual([]);
});

test('legal pages use stable editorial dates after the build year', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.clock.setFixedTime(new Date('2030-01-01T12:00:00Z'));
  for (const path of ['/politica-privacidade', '/termos-de-uso', '/declaracao-acessibilidade']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText('Última atualização:', { exact: false })).toContainText('02/10/2025');
  }
  expect(errors).toEqual([]);
});
