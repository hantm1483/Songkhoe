import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('login page renders correctly', async ({ page }) => {
    await page.goto('/login')

    // Check title
    await expect(page).toHaveTitle(/Đăng nhập/)

    // Check form elements exist
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/mật khẩu/i)).toBeVisible()

    // Check submit button
    await expect(page.getByRole('button', { name: /đăng nhập/i })).toBeVisible()
  })

  test('register page renders correctly', async ({ page }) => {
    await page.goto('/register')

    // Check form elements exist
    await expect(page.getByLabel(/họ và tên/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/mật khẩu/i)).toBeVisible()

    // Check submit button
    await expect(page.getByRole('button', { name: /đăng ký/i })).toBeVisible()
  })

  test('forgot password page renders', async ({ page }) => {
    await page.goto('/forgot-password')

    // Check form elements exist
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /gửi/i })).toBeVisible()
  })
})