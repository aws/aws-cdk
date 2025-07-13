"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/delay/index.js
var require_delay = __commonJS({
  "node_modules/delay/index.js"(exports2, module2) {
    "use strict";
    var randomInteger = (minimum, maximum) => Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
    var createAbortError = () => {
      const error = new Error("Delay aborted");
      error.name = "AbortError";
      return error;
    };
    var createDelay = ({ clearTimeout: defaultClear, setTimeout: set, willResolve }) => (ms, { value, signal } = {}) => {
      if (signal && signal.aborted) {
        return Promise.reject(createAbortError());
      }
      let timeoutId;
      let settle;
      let rejectFn;
      const clear = defaultClear || clearTimeout;
      const signalListener = () => {
        clear(timeoutId);
        rejectFn(createAbortError());
      };
      const cleanup = () => {
        if (signal) {
          signal.removeEventListener("abort", signalListener);
        }
      };
      const delayPromise = new Promise((resolve, reject) => {
        settle = () => {
          cleanup();
          if (willResolve) {
            resolve(value);
          } else {
            reject(value);
          }
        };
        rejectFn = reject;
        timeoutId = (set || setTimeout)(settle, ms);
      });
      if (signal) {
        signal.addEventListener("abort", signalListener, { once: true });
      }
      delayPromise.clear = () => {
        clear(timeoutId);
        timeoutId = null;
        settle();
      };
      return delayPromise;
    };
    var createWithTimers = (clearAndSet) => {
      const delay3 = createDelay({ ...clearAndSet, willResolve: true });
      delay3.reject = createDelay({ ...clearAndSet, willResolve: false });
      delay3.range = (minimum, maximum, options) => delay3(randomInteger(minimum, maximum), options);
      return delay3;
    };
    var delay2 = createWithTimers();
    delay2.createWithTimers = createWithTimers;
    module2.exports = delay2;
    module2.exports.default = delay2;
  }
});

// packages/@aws-cdk-testing/framework-integ/test/aws-lambda-nodejs/test/integ-handlers/dependencies.ts
var dependencies_exports = {};
__export(dependencies_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(dependencies_exports);
var import_delay = __toESM(require_delay());
async function handler() {
  await (0, import_delay.default)(5);
  console.log("log after delay");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
