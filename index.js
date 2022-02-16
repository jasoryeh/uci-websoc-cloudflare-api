const router = require('./router');

addEventListener('fetch', event => {
  console.time("request");
  try {
    event.respondWith(handleRequest(event.request));
  } catch (ex) {
    event.respondWith(
      router.errorResponse({
        "error": "There was an exception thrown whilst handling the request.",
        "details": JSON.stringify(ex, null, 4)
      })
    );
  }
  console.timeEnd("request");
});

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  return await router.route(request);
}