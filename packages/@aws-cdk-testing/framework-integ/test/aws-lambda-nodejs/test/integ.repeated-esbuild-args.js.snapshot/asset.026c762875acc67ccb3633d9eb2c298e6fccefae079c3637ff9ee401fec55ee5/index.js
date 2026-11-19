"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
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

// packages/@aws-cdk-testing/framework-integ/test/aws-lambda-nodejs/test/integ-handlers/util.ts
var util_exports = {};
__export(util_exports, {
  add: () => add,
  mult: () => mult
});
function add(a, b) {
  return a + b;
}
function mult(a, b) {
  return a * b;
}
var init_util = __esm({
  "packages/@aws-cdk-testing/framework-integ/test/aws-lambda-nodejs/test/integ-handlers/util.ts"() {
    "use strict";
  }
});

// packages/@aws-cdk-testing/framework-integ/test/aws-lambda-nodejs/test/integ-handlers/repeated-aliases.cjs
var first = (init_util(), __toCommonJS(util_exports));
var second = (init_util(), __toCommonJS(util_exports));
exports.handler = async () => first.mult(3, 4) + second.mult(2, 3);
