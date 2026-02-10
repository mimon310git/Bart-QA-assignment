// @ts-check
const { expect } = require('@playwright/test');

class HomePage {
  constructor(page) {
    this.page = page;

    this.appHeading = page.getByRole('heading', { name: 'Hotel Planisphere' });
    this.reserveLink = page.getByRole('link', { name: 'Reserve' });
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async waitForLoaded() {
    await expect(this.appHeading).toBeVisible();
  }

  async openPlans() {
    await this.reserveLink.click();
  }

  async openSignUp() {
    await this.signUpLink.click();
  }

  async openLogin() {
    await this.loginButton.click();
  }
}

module.exports = { HomePage };
