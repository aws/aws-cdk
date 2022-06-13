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

// packages/@aws-cdk/aws-lambda-nodejs/test/integ-handlers/js-handler.js
var js_handler_exports = {};
__export(js_handler_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(js_handler_exports);

// packages/@aws-cdk/aws-lambda-nodejs/test/integ-handlers/util.ts
function add(a, b) {
  return a + b;
}

// packages/@aws-cdk/aws-lambda-nodejs/test/integ-handlers/js-handler.js
async function handler() {
  console.log(add(1, 2));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
