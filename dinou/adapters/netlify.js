// dinou/adapters/netlify.js
// Netlify Functions v2 Adapter for Dinou.
// Automatically routes all requests to Dinou's universal Web Standards handler.

const { handleRequest } = require("../core/handler.js");

/**
 * Netlify Function v2 handler
 * @param {Request} request 
 * @param {object} context 
 * @returns {Promise<Response>}
 */
export default async function netlifyHandler(request, context) {
  return handleRequest(request);
}

export const config = {
  path: "/*",
  preferStatic: true,
};

