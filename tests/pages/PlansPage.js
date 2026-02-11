// @ts-check
const { expect } = require('@playwright/test');

class PlansPage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: 'Plans' });
    this.anyReserveRoomLink = page.getByRole('link', { name: 'Reserve room' }).first();
  }

  async waitForLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.anyReserveRoomLink).toBeVisible();
  }


  async openReservationPopupForPlan(planHeadingText) {
    const card = this.page.getByRole('heading', { name: planHeadingText }).locator('..');
    await card.scrollIntoViewIfNeeded();

    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      card.getByRole('link', { name: 'Reserve room' }).click(),
    ]);

    // Popups often start at about:blank; wait until the target page is loaded.
    await popup.waitForLoadState('domcontentloaded');

    return popup;
  }
}

module.exports = { PlansPage };
