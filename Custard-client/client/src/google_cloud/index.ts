// Imports the Google Cloud client library
const vision = require("@google-cloud/vision");
const config = require("./config.json");

// Creates a client
export const client = new vision.ImageAnnotatorClient({
  keyFilename: "config.json",
});
