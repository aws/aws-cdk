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

// packages/@aws-cdk-testing/framework-integ/test/aws-stepfunctions-tasks/test/http/my-lambda-handler/index.ts
var my_lambda_handler_exports = {};
__export(my_lambda_handler_exports, {
  handler: () => handler,
  password: () => password,
  username: () => username
});
module.exports = __toCommonJS(my_lambda_handler_exports);
var username = "integ-username";
var password = "integ-password";
var base64Encode = (value) => Buffer.from(value).toString("base64");
var handler = async (event) => {
  const token = event.authorizationToken;
  const encoded = base64Encode(`${username}:${password}`);
  const effect = token === `Basic ${encoded}` ? "Allow" : "Deny";
  return {
    principalId: "user",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: "*"
        }
      ]
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler,
  password,
  username
});
