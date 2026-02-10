// @ts-check
const { test, expect } = require('@playwright/test');
const user = require('../user/user.json');

const { hotelUrl, month, date, year, name, email } = user;

// open the hotel booking website before each test and clear locaal storage
test.beforeEach(async ({ page }) => {
  await page.goto(hotelUrl);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

/**
  User Story 1: Book honeymoon plan
  As a guest user,
  I want to book honeymoon room for 2 people with breakfast included,
  so that I can reserve a honeymoon night.
 
 Acceptance Criteria:
  - given I am on the hotel booking website, I can navigate to the reservation page
  - given I am on the reservation page, I can select the honeymoon plan and fill in the required details
  - given I have filled in the required details, I can confirm my reservation and see a confirmation message
 */


test('Book honeymoon plan', async ({ page }) => {

  //click on reserve page
  await page.getByText('Reserve', { exact: true }).click();
  //wait for the reserve room page to load
  await expect(page.getByRole('link', { name: 'Reserve room' }).first()).toBeVisible();

  const honeymoonCard = page.getByRole('heading', { name: 'For honeymoon' }).locator('..');

  //scroll to the honeymoon card
  await honeymoonCard.scrollIntoViewIfNeeded();
  //click on the reserve room link in the honeymoon card and wait for the new page to open
  const [reservationPage] = await Promise.all([
    page.waitForEvent('popup'),
    honeymoonCard.getByRole('link', { name: 'Reserve room' }).click(),
  ]);
  //wait for the reservation page to load
  await expect(reservationPage.getByRole('heading', { name: 'For honeymoon' })).toBeVisible();
  //fill date
  const checkIn = `${month.padStart(2, "0")}/${date.padStart(2, "0")}/${year}`;

  await reservationPage.locator('#date').fill(checkIn);
  await expect(reservationPage.locator('#date')).toHaveValue(checkIn);
  //hide datepicker if it's visible
  const datepicker = reservationPage.locator('#ui-datepicker-div');
  if (await datepicker.isVisible()) {
    await datepicker.getByRole('button', { name: 'Done' }).click();
    await datepicker.waitFor({ state: 'hidden' });
  }

  //add breakfast
  await reservationPage.getByRole('checkbox', { name: 'Breakfast' }).check();

  //fill name and email
  await reservationPage.getByLabel('Name required').fill(name);
  await reservationPage.getByLabel('Confirmation required').selectOption({ label: 'By email' });
  await reservationPage.getByLabel('Email required').fill(email);

  //confirm reservation and wait for the confirmation page to load
  await Promise.all([
    reservationPage.waitForURL('**/confirm.html'),
    reservationPage.getByRole('button', { name: 'Confirm Reservation' }).click(),
  ]);
  await expect(reservationPage.getByRole('heading', { name: 'Confirm Reservation' })).toBeVisible();

  await reservationPage.getByRole('button', { name: 'Submit Reservation' }).click();
  await expect(reservationPage.getByRole('dialog')).toBeVisible();
  await expect(reservationPage.getByRole('heading', { name: 'Thank you for reserving.' })).toBeVisible();
});


/**
User Story 2: Sign Up
As a guest user,
I want to sign up using the Sign up form,
so that I can access MyPage in the same browser session.

Acceptance Criteria:
- Given I am on the Sign up page, I can fill in and submit the required fields.
- Given I submit valid data, I am redirected to MyPage in the same browser.
 */

test('Sign Up', async ({ page }) => {

  //click on sign up link and wait for the sign up page to load
  await page.getByRole('link', { name: 'Sign up' }).click();
  await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();
  //fill registration form with user data from user.json
  await page.getByLabel('Email required').fill(user.email);
  await page.getByLabel('Password required').fill(user.password);
  await page.getByLabel('Password (confirmation) required').fill(user.password);
  await page.getByLabel('Name required').fill(user.name);
  await page.getByLabel('Address').fill(user.address);
  await page.getByLabel('Tel').fill(user.phone);

  await page.getByRole('combobox', { name: 'Gender' }).selectOption({ label: user.gender });
  await page.getByRole('textbox', { name: 'Date of birth' }).fill(user.dob);

  //click on sign up button and wait for the mypage to load
  await page.getByRole('button', { name: 'Sign up' }).click();
  // await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  await page.waitForURL('**/mypage.html');
  await expect(page.getByRole('heading', { name: 'MyPage' })).toBeVisible();



});

/**
  User Story 3: Update profile icon
  As a registered user,
  I want to update my profile icon,
  so that my profile information is complete.

  Acceptance Criteria:
 - Given I am logged in, MyPage is displayed
 - Given I have not set a profile icon, I can upload or select an icon
 - When I save the icon, it is displayed on MyPage
 */

test('Update profile icon', async ({ page }) => {

  //sign up first bcs i clear local storage before each test and page does not have BE and also on 
  // preset users cant change icon 
  const uniqueEmail = `aa+${Date.now()}@example.com`;
  await page.getByRole('link', { name: 'Sign up' }).click();
  await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();

  //fill registration form with user data from user.json and unique email
  await page.getByLabel('Email required').fill(uniqueEmail);
  await page.getByLabel('Password required').fill(user.password);
  await page.getByLabel('Password (confirmation) required').fill(user.password);
  await page.getByLabel('Name required').fill(user.name);
  await page.getByLabel('Address').fill(user.address);
  await page.getByLabel('Tel').fill(user.phone);

  await page.getByRole('combobox', { name: 'Gender' }).selectOption({ label: user.gender });
  await page.getByRole('textbox', { name: 'Date of birth' }).fill(user.dob);

  //click on sign up button and wait for the mypage to load
  await page.getByRole('button', { name: 'Sign up' }).click();
  // await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  await page.waitForURL('**/mypage.html');
  await expect(page.getByRole('heading', { name: 'MyPage' })).toBeVisible();


  //click on icon setting band add icon
  await page.getByRole('button', { name: 'Icon Setting' }).click();
  await expect(page.getByRole('heading', { name: 'Setting Icon' })).toBeVisible();

  await page.setInputFiles('#icon', 'user/photo.png');
  await expect(page.locator('#zoom:visible')).toBeVisible();


  await Promise.all([
    page.waitForURL('**/mypage.html'),
    page.getByRole('button', { name: 'submit' }).click(),
  ]);

  //check if the icon is displayed on mypage
  await expect(page.getByRole('heading', { name: 'MyPage' })).toBeVisible();
  await expect(page.locator('#icon-holder img')).toBeVisible();
});




/**
  User Story 4: View MyPage as preset user
  As a preset user,
  I want to log in and access MyPage,
  so that I can view my stored profile information.
  Acceptance Criteria:
  - Given I am on the login page, I can log in using preset user credentials
  - Given I am logged in, MyPage is displayed
  - Given MyPage is displayed, my profile information is visible
 */


test('View MyPage as preset user', async ({ page }) => {


  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  await page.getByLabel('Email').fill(user.presetmail);
  await page.getByLabel('Password').fill(user.presetpassword);
  await page.locator('button').filter({ hasText: 'Login' }).last().click();
  await page.waitForURL('**/mypage.html');
  await expect(page.getByRole('heading', { name: 'MyPage' })).toBeVisible();
  await expect(page.locator('ul.list-group')).toBeVisible();



});
