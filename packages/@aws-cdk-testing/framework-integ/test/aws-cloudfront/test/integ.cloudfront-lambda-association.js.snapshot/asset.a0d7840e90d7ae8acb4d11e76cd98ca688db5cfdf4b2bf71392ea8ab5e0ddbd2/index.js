"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/@aws-cdk-testing/framework-integ/test/aws-cloudfront/test/edge-lambda-cleanup/index.ts
var index_exports = {};
__export(index_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(index_exports);
var import_client_lambda = require("@aws-sdk/client-lambda");
async function handler(event) {
  console.log("Event:", JSON.stringify(event));
  if (event.RequestType !== "Delete") {
    return;
  }
  const functionArns = event.ResourceProperties.FunctionArns;
  const maxRetries = 50;
  const baseDelay = 1e4;
  for (const arn of functionArns) {
    const arnRegion = arn.split(":")[3];
    const client = new import_client_lambda.Lambda({ region: arnRegion });
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        await client.deleteFunction({ FunctionName: arn });
        console.log(`Deleted ${arn}`);
        break;
      } catch (err) {
        if (err.name === "InvalidParameterValueException" && err.message?.includes("replicated function")) {
          const delay = baseDelay + Math.random() * 7e3;
          console.log(`Attempt ${attempt + 1}: replica still active for ${arn}, waiting ${Math.round(delay / 1e3)}s...`);
          await new Promise((r) => setTimeout(r, delay));
        } else if (err.name === "ResourceNotFoundException") {
          console.log(`${arn} already deleted`);
          break;
        } else {
          throw err;
        }
      }
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
