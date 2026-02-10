// @ts-check
const { expect } = require('@playwright/test');

class SignUpPage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: 'Sign up' });

    this.email = page.getByLabel('Email required');
    this.password = page.getByLabel('Password required');
    this.passwordConfirmation = page.getByLabel('Password (confirmation) required');

    this.name = page.getByLabel('Name required');
    this.address = page.getByLabel('Address');
    this.tel = page.getByLabel('Tel');
    this.gender = page.getByRole('combobox', { name: 'Gender' });
    this.dob = page.getByRole('textbox', { name: 'Date of birth' });

    this.signUpButton = page.getByRole('button', { name: 'Sign up' });
  }

  async waitForLoaded() {
    await expect(this.heading).toBeVisible();
  }

  /**
   * @param {{
   *   email: string,
   *   password: string,
   *   name: string,
   *   address?: string,
   *   tel?: string,
   *   gender?: string,
   *   dob?: string
   * }} data
   */
  async signUp(data) {
    const { email, password, name, address, tel, gender, dob } = data;
    await this.email.fill(email);
    await this.password.fill(password);
    await this.passwordConfirmation.fill(password);

    await this.name.fill(name);
    if (address) await this.address.fill(address);
    if (tel) await this.tel.fill(tel);
    if (gender) await this.gender.selectOption({ label: gender });
    if (dob) await this.dob.fill(dob);

    await Promise.all([
      this.page.waitForURL('**/mypage.html'),
      this.signUpButton.click(),
    ]);
  }
}

module.exports = { SignUpPage };
