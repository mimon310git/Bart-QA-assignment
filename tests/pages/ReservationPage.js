// @ts-check
const { expect } = require('@playwright/test');

class ReservationPage {
  constructor(page) {
    this.page = page;

    // Use a stable click target for blurring/hiding widgets.
    this.blurTarget = page.locator('body');

    this.date = page.locator('#date');
    this.datePicker = page.locator('#ui-datepicker-div');

    this.breakfast = page.getByRole('checkbox', { name: 'Breakfast' });
    this.name = page.getByLabel('Name required');
    this.confirmation = page.getByLabel('Confirmation required');
    this.email = page.getByLabel('Email required');

    this.confirmReservationButton = page.getByRole('button', { name: 'Confirm Reservation' });
  }

  /**
   * @param {string} planName
   */
  async waitForLoaded(planName) {
    // The plan name is displayed as a heading, but the level can vary.
    await expect(this.page.getByRole('heading', { name: planName })).toBeVisible();
    await expect(this.date).toBeVisible();
  }

  async setCheckInDate(mmddyyyy) {
    await this.date.fill(mmddyyyy);
    await expect(this.date).toHaveValue(mmddyyyy);

    // The jQuery datepicker can remain open and intercept clicks.
    await this.page.keyboard.press('Escape');
    try {
      await this.datePicker.waitFor({ state: 'hidden', timeout: 1500 });
    } catch {
      // Fallback: click anywhere to blur the input.
      await this.blurTarget.click({ force: true });
      await this.datePicker.waitFor({ state: 'hidden', timeout: 1500 }).catch(() => {});
    }
  }

  async chooseBreakfast() {
    await this.breakfast.check();
  }

  /**
   * @param {{ name: string, email: string, confirmationLabel?: string }} data
   */
  async fillContact(data) {
    await this.name.fill(data.name);
    if (data.confirmationLabel) {
      await this.confirmation.selectOption({ label: data.confirmationLabel });
    }
    await this.email.fill(data.email);
  }

  async confirmReservation() {
    await Promise.all([
      this.page.waitForURL('**/confirm.html'),
      this.confirmReservationButton.click(),
    ]);
  }
}

module.exports = { ReservationPage };
