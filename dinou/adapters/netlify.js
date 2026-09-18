// dinou/adapters/netlify.js
// Netlify Functions v2 Adapter for Dinou.
// Automatically routes all requests to Dinou's universal Web Standards handler.

const { handleRequest } = require("../core/handler.js");

/**
 * Netlify Function handler
 * @param {Request} request 
 * @param {object} context 
 * @returns {Promise<Response>}
 */
async function netlifyHandler(request, context) {
  return handleRequest(request);
}

module.exports = netlifyHandler;
module.exports.default = netlifyHandler;
module.exports.config = {
  path: "/*",
  preferStatic: true,
};
