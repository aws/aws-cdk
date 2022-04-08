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

// packages/@aws-cdk/aws-lambda-nodejs/test/integ-handlers/ts-handler.ts
var ts_handler_exports = {};
__export(ts_handler_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(ts_handler_exports);

// packages/@aws-cdk/aws-lambda-nodejs/test/integ-handlers/util.ts
function mult(a, b) {
  return a * b;
}

// packages/@aws-cdk/aws-lambda-nodejs/test/integ-handlers/ts-handler.ts
async function handler() {
  console.log(mult(3, 4));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
