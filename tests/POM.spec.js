// @ts-check
const { test, expect } = require('@playwright/test');
const user = require('../user/user.json');

const { HomePage } = require('./pages/HomePage.js');
const { PlansPage } = require('./pages/PlansPage.js');
const { ReservationPage } = require('./pages/ReservationPage.js');
const { ConfirmReservationPage } = require('./pages/ConfirmReservationPage.js');

const { SignUpPage } = require('./pages/SignUpPage.js');
const { LoginPage } = require('./pages/LoginPage.js');
const { MyPage } = require('./pages/MyPage.js');
const { IconSettingPage } = require('./pages/IconSettingPage.js');

const { hotelUrl } = user;

test.beforeEach(async ({ page }) => {
  await page.goto(hotelUrl);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test('Book honeymoon plan (POM)', async ({ page }) => {
  const home = new HomePage(page);
  await home.waitForLoaded();
  await home.openPlans();

  const plans = new PlansPage(page);
  await plans.waitForLoaded();

  const reservationPopup = await plans.openReservationPopupForPlan('For honeymoon');
  const reservation = new ReservationPage(reservationPopup);
  await reservation.waitForLoaded('For honeymoon');

  const checkIn = `${user.month.padStart(2, '0')}/${user.date.padStart(2, '0')}/${user.year}`;
  await reservation.setCheckInDate(checkIn);
  await reservation.chooseBreakfast();
  await reservation.fillContact({
    name: user.name,
    email: user.email,
    confirmationLabel: 'By email',
  });

  await reservation.confirmReservation();

  const confirm = new ConfirmReservationPage(reservationPopup);
  await confirm.waitForLoaded();
  await confirm.submit();
  await confirm.expectThankYou();
});

test('Sign Up (POM)', async ({ page }) => {
  const home = new HomePage(page);
  await home.openSignUp();

  const signUp = new SignUpPage(page);
  await signUp.waitForLoaded();

  const uniqueEmail = `qa+${Date.now()}@example.com`;
  await signUp.signUp({
    email: uniqueEmail,
    password: user.password,
    name: user.name,
    address: user.address,
    tel: user.phone,
    gender: user.gender,
    dob: user.dob,
  });

  const mypage = new MyPage(page);
  await mypage.waitForLoaded();
});

test('Update profile icon (POM)', async ({ page }) => {
  // Needs a fresh user because storage is cleared and the app has no backend.
  const home = new HomePage(page);
  await home.openSignUp();

  const signUp = new SignUpPage(page);
  await signUp.waitForLoaded();

  const uniqueEmail = `icon+${Date.now()}@example.com`;
  await signUp.signUp({
    email: uniqueEmail,
    password: user.password,
    name: user.name,
    address: user.address,
    tel: user.phone,
    gender: user.gender,
    dob: user.dob,
  });

  const mypage = new MyPage(page);
  await mypage.waitForLoaded();

  await mypage.openIconSetting();

  const icon = new IconSettingPage(page);
  await icon.waitForLoaded();
  await icon.uploadIcon('user/photo.png');
  await icon.submit();

  // Icon rendering can differ by implementation/browser. Validate:
  // - either an <img> appears in #icon-holder, or #icon-holder has a background-image,
  // - or (fallback) the icon data is persisted in storage as a data URL.
  await mypage.waitForLoaded();
  await expect(async () => {
    const state = await page.evaluate(() => {
      const holder = document.querySelector('#icon-holder');
      const img = holder ? holder.querySelector('img') : null;
      const bg = holder ? getComputedStyle(holder).backgroundImage : null;

      const hasDataImage = (storage) => {
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          const val = key ? storage.getItem(key) : '';
          if (val && val.includes('data:image/')) return true;
        }
        return false;
      };

      return {
        holderExists: !!holder,
        hasImg: !!img,
        bg: bg || '',
        hasDataImage: hasDataImage(localStorage) || hasDataImage(sessionStorage),
      };
    });

    if (state.hasImg) {
      await expect(page.locator('#icon-holder img')).toBeVisible();
      return;
    }

    if (state.holderExists && state.bg && state.bg !== 'none') return;

    expect(state.hasDataImage).toBe(true);
  }).toPass({ timeout: 15000 });
});

test('View MyPage as preset user (POM)', async ({ page }) => {
  const home = new HomePage(page);
  await home.openLogin();

  const login = new LoginPage(page);
  // Keep the override to avoid scoping issues and the navbar "Login" button.
  login.email = page.getByRole('textbox', { name: 'Email' });
  login.password = page.getByRole('textbox', { name: 'Password' });
  login.loginButton = page.getByRole('button', { name: 'Login' }).last();

  await login.waitForLoaded();
  await login.login(user.presetmail, user.presetpassword);

  const mypage = new MyPage(page);
  await mypage.waitForLoaded();
  await mypage.expectProfileVisible();
});
