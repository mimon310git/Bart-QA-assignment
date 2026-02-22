# Test Scenarios

## TS-1 Book honeymoon plan

**Preconditions**
- Clear `localStorage` and `sessionStorage`
- User is not logged in
- Start URL: `hotelUrl`

| # | Test Step | Test Data | Expected Result |
|---|---|---|---|
| 1 | Open home page | `hotelUrl` | Home page is displayed |
| 2 | Click `Reserve` in navigation | `-` | Plans page is displayed |
| 3 | Find plan `For honeymoon` and click `Reserve room` | Plan: `For honeymoon` | Reservation page opens in a new tab/window and heading `For honeymoon` is visible |
| 4 | Fill reservation form | Date `MM/DD/YYYY`; Breakfast = checked; Name; Confirmation = `By email`; Email | All fields are filled and accepted (values are present) |
| 5 | Click `Confirm Reservation` | `-` | Confirmation page with heading `Confirm Reservation` is displayed |
| 6 | Click `Submit Reservation` | `-` | Success page/message `Thank you for reserving.` |

## TS-2 Sign Up and access MyPage

**Preconditions**
- Clear `localStorage` and `sessionStorage`
- User is not logged in
- Start URL: `hotelUrl`

| # | Test Step | Test Data | Expected Result |
|---|---|---|---|
| 1 | Open `Sign up` page | `-` | Sign up page is displayed |
| 2 | Fill required fields | Unique email; Password (`>= 8` chars); Password confirmation; Name | Fields are filled and no validation errors are shown |
| 3 | Fill optional fields | Address; Tel (11 digits); Gender (male); DoB (`YYYY-MM-DD`) | Fields are filled |
| 4 | Click `Sign up` | Button = `Sign up` | Redirected to MyPage |
| 5 | Verify MyPage | Expected Email + Name | `MyPage` heading is visible, `Logout` is visible, profile contains submitted Email and Name |

## TS-3 Update profile icon

**Preconditions**
- Clear `localStorage` and `sessionStorage`
- User is logged in (create a new user via Sign up in the same test)
- Start URL: `hotelUrl`

| # | Test Step | Test Data | Expected Result |
|---|---|---|---|
| 1 | Navigate to MyPage (after Sign Up/Login) | `-` | MyPage is displayed |
| 2 | Open `Icon Setting` from MyPage | `-` | Icon setting page with heading `Setting Icon` is displayed |
| 3 | Upload icon file | `photo.png` (`<= 10 KB`) | File is selected (icon input contains filename) and controls become enabled (for example Zoom enabled) |
| 4 | Click `submit` | Button = `submit` | Redirected to MyPage |
| 5 | Verify icon is shown | `-` | Icon is saved/applied on MyPage (icon holder updated) |

## TS-4 View MyPage as preset user

**Preconditions**
- Clear `localStorage` and `sessionStorage`
- User is not logged in
- Preset credentials available (email + password)
- Start URL: `hotelUrl`

| # | Test Step | Test Data | Expected Result |
|---|---|---|---|
| 1 | Open Login dialog/page | Button = `Login` | Login page is displayed |
| 2 | Login with preset credentials | Preset email + preset password | Redirected to MyPage |
| 3 | Verify MyPage | Expected preset Email + Name | `MyPage` heading is visible and profile sections contain preset Email and Name |
