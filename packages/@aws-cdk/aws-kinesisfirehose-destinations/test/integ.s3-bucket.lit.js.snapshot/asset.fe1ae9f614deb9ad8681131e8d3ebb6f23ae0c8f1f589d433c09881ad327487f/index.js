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

// packages/@aws-cdk/aws-kinesisfirehose-destinations/test/lambda-data-processor.js
var lambda_data_processor_exports = {};
__export(lambda_data_processor_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(lambda_data_processor_exports);
async function handler(event, context) {
  const output = event.records.map((record) => ({
    /* This transformation is the "identity" transformation, the data is left intact */
    recordId: record.recordId,
    result: "Ok",
    data: record.data
  }));
  console.log(`Processing completed.  Successful records ${output.length}.`);
  return { records: output };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
