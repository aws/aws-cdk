"use strict";

// packages/@aws-cdk-testing/framework-integ/test/aws-lambda-nodejs/test/integ-handlers/cjs-handler.cjs
var crypto = require("crypto");
async function handler() {
  console.log(crypto.createHash("sha512").update("cdk").digest("hex"));
}
module.exports = { handler };
