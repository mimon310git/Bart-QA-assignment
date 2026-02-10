// @ts-check
const { expect } = require('@playwright/test');

class ConfirmReservationPage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: 'Confirm Reservation' });
    this.submitButton = page.getByRole('button', { name: 'Submit Reservation' });

    // Result page shows "Thank you for reserving."
    this.thankYouHeading = page.getByRole('heading', { name: 'Thank you for reserving.' });
  }

  async waitForLoaded() {
    await expect(this.heading).toBeVisible();
  }

  async submit() {
    await this.submitButton.click();
  }

  async expectThankYou() {
    await expect(this.thankYouHeading).toBeVisible();
  }
}

module.exports = { ConfirmReservationPage };
