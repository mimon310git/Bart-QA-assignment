// @ts-check
const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: 'Login' });
    // Scope actions to the login panel to avoid clicking the navbar "Login" button again.
    this.panel = this.heading.locator('..');

    this.email = this.panel.getByLabel('Email');
    this.password = this.panel.getByLabel('Password');
    this.loginButton = this.panel.getByRole('button', { name: 'Login' });
  }

  async waitForLoaded() {
    await expect(this.heading).toBeVisible();
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);

    await Promise.all([
      this.page.waitForURL('**/mypage.html'),
      this.loginButton.click(),
    ]);
  }
}

module.exports = { LoginPage };
