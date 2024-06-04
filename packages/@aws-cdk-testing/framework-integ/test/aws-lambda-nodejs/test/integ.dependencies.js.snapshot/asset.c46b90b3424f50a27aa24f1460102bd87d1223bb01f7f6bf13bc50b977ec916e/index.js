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

// packages/@aws-cdk-testing/framework-integ/test/aws-lambda-nodejs/test/integ-handlers/dependencies-sdk-v3.ts
var dependencies_sdk_v3_exports = {};
__export(dependencies_sdk_v3_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(dependencies_sdk_v3_exports);
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
async function handler() {
  const client = new import_client_dynamodb.DynamoDBClient();
  const input = {
    TableName: process.env.TABLE_NAME
  };
  const command = new import_client_dynamodb.DescribeTableCommand(input);
  const response = await client.send(command);
  console.log(response);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
