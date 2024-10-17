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

// packages/@aws-cdk-testing/framework-integ/test/aws-stepfunctions/test/integ-assets/get-succeeded-batch-execution-result/index.ts
var get_succeeded_batch_execution_result_exports = {};
__export(get_succeeded_batch_execution_result_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(get_succeeded_batch_execution_result_exports);
var import_client_s3 = require("@aws-sdk/client-s3");
var client = new import_client_s3.S3Client({});
async function handler(event) {
  console.log("handling event", event);
  console.log("getting key for results writer succeeded file");
  const listObjectsCommandOutput = await client.send(new import_client_s3.ListObjectsV2Command({
    Bucket: event.bucket,
    Prefix: event.prefix
  }));
  if (!listObjectsCommandOutput.Contents) {
    throw new Error("No objects found");
  }
  const succeedKey = listObjectsCommandOutput.Contents.find((object2) => object2?.Key?.endsWith("SUCCEEDED_0.json"));
  if (!succeedKey) {
    throw new Error("No SUCCEEDED_0.json found");
  }
  console.log("found key", succeedKey.Key);
  console.log("getting object");
  const object = await client.send(new import_client_s3.GetObjectCommand({
    Bucket: event.bucket,
    Key: succeedKey.Key
  }));
  if (!object?.Body) {
    throw new Error("No object body found");
  }
  const body = JSON.parse(await object.Body.transformToString());
  console.log("got succeeded object body", body);
  return JSON.parse(body[0].Input);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
