// Imports the Google Cloud client library
const vision = require("@google-cloud/vision");

// Creates a client
export const client = new vision.ImageAnnotatorClient();
