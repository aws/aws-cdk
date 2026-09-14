"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/@aws-cdk-testing/framework-integ/test/aws-cloudfront/test/integ.distribution-mtls.assets/mtls-test-handler.ts
var mtls_test_handler_exports = {};
__export(mtls_test_handler_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(mtls_test_handler_exports);
var https = __toESM(require("https"));
var import_client_s3 = require("@aws-sdk/client-s3");
var CertificateRetrievalError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "CertificateRetrievalError";
  }
};
async function handler(event) {
  let cert;
  let key;
  if (event.useCert) {
    const s3 = new import_client_s3.S3Client({});
    const certObj = await s3.send(new import_client_s3.GetObjectCommand({
      Bucket: event.certBucket,
      Key: "client-cert.pem"
    }));
    const keyObj = await s3.send(new import_client_s3.GetObjectCommand({
      Bucket: event.certBucket,
      Key: "client-key.pem"
    }));
    cert = await certObj.Body?.transformToString();
    key = await keyObj.Body?.transformToString();
    if (!cert || !key) {
      throw new CertificateRetrievalError("Failed to retrieve client certificate or key from S3");
    }
  }
  return new Promise((resolve, reject) => {
    const options = {
      hostname: event.distributionDomainName,
      port: 443,
      path: "/index.html",
      method: "GET"
    };
    if (event.useCert && cert && key) {
      options.cert = cert;
      options.key = key;
    }
    const req = https.request(options, (res) => {
      resolve({
        statusCode: res.statusCode ?? 0,
        statusMessage: res.statusMessage ?? ""
      });
    });
    req.on("error", (err) => {
      reject(err);
    });
    req.end();
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
