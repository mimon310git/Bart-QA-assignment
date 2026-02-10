const { test, expect } = require('@playwright/test');

test('Google Books API returns Shakespeare as author', async ({ request }) => {
// Ensure the API key is set in the environment variables
  const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
 // Check that the API key is available 
  expect(API_KEY).toBeTruthy();

  // Make a GET request to the Google Books API for the specified ISBN
  const response = await request.get(
    'https://www.googleapis.com/books/v1/volumes?q=isbn:9782842604103&key=' + API_KEY
  );
 // Verify that the response status is 200 OK
  expect(response.status()).toBe(200);

  // Parse the JSON response and extract the authors
  const json = await response.json();

  // Compare expected vs received JSON
  expect(json.items[0].volumeInfo).toMatchObject({
    authors: expect.arrayContaining(['William Shakespeare']),
  });
});
