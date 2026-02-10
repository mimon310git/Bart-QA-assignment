// @ts-check
const { expect } = require('@playwright/test');

class MyPage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: 'MyPage' });
    this.profileList = page.locator('ul.list-group');

    this.iconSettingButton = page.getByRole('button', { name: 'Icon Setting' });
    this.iconImage = page.locator('#icon-holder img');
  }

  async waitForLoaded() {
    await this.page.waitForURL('**/mypage.html');
    await expect(this.heading).toBeVisible();
  }

  async openIconSetting() {
    await this.iconSettingButton.click();
  }

  async expectProfileVisible() {
    await expect(this.profileList).toBeVisible();
  }

  async expectIconVisible() {
    await expect(this.iconImage).toBeVisible({ timeout: 15000 });
  }
}

module.exports = { MyPage };
