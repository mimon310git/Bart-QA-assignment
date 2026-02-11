const { test, expect } = require('@playwright/test');

test('Bonus API: Agify returns valid data for name=alex', async ({ request }) => {
    // Make a GET request to the Agify API with the name 'alex'
  const response = await request.get('https://api.agify.io/?name=alex');

  // Check that the response status is 200 OK
  expect(response.status()).toBe(200);

  // Parse the JSON response
  const json = await response.json();

  // Check that the name in the response is 'alex'
  expect(json).toMatchObject({
    name: 'alex',
  });

  // age can be null for unknown names, otherwise it should be a number
  expect(json.age === null || typeof json.age === 'number').toBeTruthy();
  console.log('Agify API response:', json);
});
