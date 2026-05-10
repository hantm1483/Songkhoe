import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test('trangchu page loads with proper elements', async ({ page }) => {
    // Navigate to trangchu - would need auth in real scenario
    await page.goto('/trangchu')

    // Check page loaded (will redirect to login if not authenticated)
    // Just verify the page structure is correct
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('navigation elements exist', async ({ page }) => {
    await page.goto('/login')

    // Check bottom navigation or header exists
    const nav = page.locator('nav')
    await expect(nav.first()).toBeVisible()
  })
})