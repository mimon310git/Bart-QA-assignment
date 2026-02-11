# QA Technical Task - Hotel Planisphere (Playwright)

This repository contains E2E UI tests (FE only) for the Hotel Planisphere demo site:
`https://hotel-example-site.takeyaqa.dev/en-US/`

Note: The demo app has no backend. Data is stored only in the browser (localStorage/sessionStorage) and is cleared in beforeEach to ensure a clean state.

## Scope and Limitations

This test suite covers only happy-path scenarios.

## Requirements

- Node.js 18+ (recommended: Node.js LTS)
- npm
- Playwright browsers (installed via Playwright)

## Install

```powershell
cd <project-root>
npm install
npx playwright install
```

## Run Tests

Recommended (final) run for the assignment (POM-based UI tests):

```powershell
npm run test:pom
```

Run all tests (includes both `task1.spec.js` and `POM.spec.js`, so some scenarios are duplicated on purpose):

```powershell
npm test
```

Run a specific spec file:

```powershell
npm run test:task1
npm run test:pom
npm run test:api
```

Debug (headed + inspector):

```powershell
npx playwright test --debug
```

## Reports

### Playwright HTML report

After the test run:

```powershell
npm run report
```

### Allure report (optional)

Run tests with the Allure reporter to generate `allure-results`:

```powershell
npm run allure:test
```

Generate the Allure HTML report (this step is required to refresh the report after a new test run):

```powershell
npm run allure:report
```

Open the Allure report:

```powershell
npm run allure:open
```

## Test Data

- UI test data is stored in `user/user.json`.
- Tests clear `localStorage` and `sessionStorage` in `beforeEach` to ensure a clean state.

## API Test (Google Books)

The API test is in `tests/APIbooks.spec.js` and checks that the author for ISBN `9782842604103` contains `William Shakespeare`.

It requires a Google Books API key set as an environment variable:

```powershell
$env:GOOGLE_BOOKS_API_KEY="your_api_key_here"
npm run test:api
```

CI note: The API test requires `GOOGLE_BOOKS_API_KEY`. In GitHub Actions, configure it as a repository secret; otherwise the API test will fail.

## Bonus API Test

Bonus test file: `tests/APIbonus.spec.js` (Agify public API, no API key required).

It verifies that querying `name=alex` returns JSON with:
- `name: "alex"`
- a valid `age` field

Run it with:

```powershell
npx playwright test APIbonus.spec.js
```

## Deliverables

- User stories: `userStories.md`
- Test scenarios: `testscen.xlsx`
- Automated tests:
  - `tests/task1.spec.js` (non-POM version)
  - `tests/POM.spec.js` + `tests/pages/*` (Page Object Model example)
  - `tests/APIbooks.spec.js` (API test)
  - `tests/APIbonus.spec.js` (optional bonus API test)
