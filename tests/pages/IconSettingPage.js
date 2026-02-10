// @ts-check
const { expect } = require('@playwright/test');

class IconSettingPage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: 'Setting Icon' });
    this.imageButton = page.getByRole('button', { name: 'Image' });
    this.fileInput = page.locator('#icon');
    this.zoomSlider = page.getByRole('slider', { name: 'Zoom' });
    this.submitButton = page.getByRole('button', { name: 'submit' });
  }

  async waitForLoaded() {
    await expect(this.heading).toBeVisible();
  }

  /**
   * Uploads the icon file.
   * This app keeps the file input in the DOM (often hidden). Setting files directly is more reliable
   * than relying on the native file chooser across browsers.
   * @param {string} filePath
   */
  async uploadIcon(filePath) {
    await this.page.setInputFiles('#icon', filePath);
    // For <input type="file"> Playwright uses a fake path like C:\fakepath\file.png.
    await expect(this.fileInput).toHaveValue(/photo\.png$/);
    // At least ensure the controls are present after upload.
    await expect(this.zoomSlider).toBeVisible();
  }

  async submit() {
    await Promise.all([
      this.page.waitForURL('**/mypage.html'),
      this.submitButton.click(),
    ]);
  }
}

module.exports = { IconSettingPage };
