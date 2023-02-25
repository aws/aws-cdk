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
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/assertions/providers/lambda-handler/index.ts
var lambda_handler_exports = {};
__export(lambda_handler_exports, {
  handler: () => handler,
  isComplete: () => isComplete,
  onTimeout: () => onTimeout
});
module.exports = __toCommonJS(lambda_handler_exports);

// ../assertions/lib/matcher.ts
var Matcher = class {
  static isMatcher(x) {
    return x && x instanceof Matcher;
  }
};
var MatchResult = class {
  constructor(target) {
    this.failuresHere = /* @__PURE__ */ new Map();
    this.captures = /* @__PURE__ */ new Map();
    this.finalized = false;
    this.innerMatchFailures = /* @__PURE__ */ new Map();
    this._hasFailed = false;
    this._failCount = 0;
    this._cost = 0;
    this.target = target;
  }
  push(matcher, path, message) {
    return this.recordFailure({ matcher, path, message });
  }
  recordFailure(failure) {
    const failKey = failure.path.join(".");
    let list = this.failuresHere.get(failKey);
    if (!list) {
      list = [];
      this.failuresHere.set(failKey, list);
    }
    this._failCount += 1;
    this._cost += failure.cost ?? 1;
    list.push(failure);
    this._hasFailed = true;
    return this;
  }
  get isSuccess() {
    return !this._hasFailed;
  }
  hasFailed() {
    return this._hasFailed;
  }
  get failCount() {
    return this._failCount;
  }
  get failCost() {
    return this._cost;
  }
  compose(id, inner) {
    if (inner.hasFailed()) {
      this._hasFailed = true;
      this._failCount += inner.failCount;
      this._cost += inner._cost;
      this.innerMatchFailures.set(id, inner);
    }
    inner.captures.forEach((vals, capture) => {
      vals.forEach((value) => this.recordCapture({ capture, value }));
    });
    return this;
  }
  finished() {
    if (this.finalized) {
      return this;
    }
    if (this.failCount === 0) {
      this.captures.forEach((vals, cap) => cap._captured.push(...vals));
    }
    this.finalized = true;
    return this;
  }
  toHumanStrings() {
    const failures = new Array();
    debugger;
    recurse(this, []);
    return failures.map((r) => {
      const loc = r.path.length === 0 ? "" : ` at /${r.path.join("/")}`;
      return "" + r.message + loc + ` (using ${r.matcher.name} matcher)`;
    });
    function recurse(x, prefix) {
      for (const fail of Array.from(x.failuresHere.values()).flat()) {
        failures.push({
          matcher: fail.matcher,
          message: fail.message,
          path: [...prefix, ...fail.path]
        });
      }
      for (const [key, inner] of x.innerMatchFailures.entries()) {
        recurse(inner, [...prefix, key]);
      }
    }
  }
  renderMismatch() {
    if (!this.hasFailed()) {
      return "<match>";
    }
    const parts = new Array();
    const indents = new Array();
    emitFailures(this, "");
    recurse(this);
    return moveMarkersToFront(parts.join("").trimEnd());
    function emit(x) {
      if (x === void 0) {
        debugger;
      }
      parts.push(x.replace(/\n/g, `
${indents.join("")}`));
    }
    function emitFailures(r, path, scrapSet) {
      for (const fail of r.failuresHere.get(path) ?? []) {
        emit(`!! ${fail.message}
`);
      }
      scrapSet == null ? void 0 : scrapSet.delete(path);
    }
    function recurse(r) {
      const remainingFailures = new Set(Array.from(r.failuresHere.keys()).filter((x) => x !== ""));
      if (Array.isArray(r.target)) {
        indents.push("  ");
        emit("[\n");
        for (const [first, i] of enumFirst(range(r.target.length))) {
          if (!first) {
            emit(",\n");
          }
          emitFailures(r, `${i}`, remainingFailures);
          const innerMatcher = r.innerMatchFailures.get(`${i}`);
          if (innerMatcher) {
            emitFailures(innerMatcher, "");
            recurseComparingValues(innerMatcher, r.target[i]);
          } else {
            emit(renderAbridged(r.target[i]));
          }
        }
        emitRemaining();
        indents.pop();
        emit("\n]");
        return;
      }
      if (r.target && typeof r.target === "object") {
        indents.push("  ");
        emit("{\n");
        const keys = Array.from(/* @__PURE__ */ new Set([
          ...Object.keys(r.target),
          ...Array.from(remainingFailures)
        ])).sort();
        for (const [first, key] of enumFirst(keys)) {
          if (!first) {
            emit(",\n");
          }
          emitFailures(r, key, remainingFailures);
          const innerMatcher = r.innerMatchFailures.get(key);
          if (innerMatcher) {
            emitFailures(innerMatcher, "");
            emit(`${jsonify(key)}: `);
            recurseComparingValues(innerMatcher, r.target[key]);
          } else {
            emit(`${jsonify(key)}: `);
            emit(renderAbridged(r.target[key]));
          }
        }
        emitRemaining();
        indents.pop();
        emit("\n}");
        return;
      }
      emitRemaining();
      emit(jsonify(r.target));
      function emitRemaining() {
        if (remainingFailures.size > 0) {
          emit("\n");
        }
        for (const key of remainingFailures) {
          emitFailures(r, key);
        }
      }
    }
    function recurseComparingValues(inner, actualValue) {
      if (inner.target === actualValue) {
        return recurse(inner);
      }
      emit(renderAbridged(actualValue));
      emit(" <*> ");
      recurse(inner);
    }
    function renderAbridged(x) {
      if (Array.isArray(x)) {
        switch (x.length) {
          case 0:
            return "[]";
          case 1:
            return `[ ${renderAbridged(x[0])} ]`;
          case 2:
            if (x.every((e) => ["number", "boolean", "string"].includes(typeof e))) {
              return `[ ${x.map(renderAbridged).join(", ")} ]`;
            }
            return "[ ... ]";
          default:
            return "[ ... ]";
        }
      }
      if (x && typeof x === "object") {
        const keys = Object.keys(x);
        switch (keys.length) {
          case 0:
            return "{}";
          case 1:
            return `{ ${JSON.stringify(keys[0])}: ${renderAbridged(x[keys[0]])} }`;
          default:
            return "{ ... }";
        }
      }
      return jsonify(x);
    }
    function jsonify(x) {
      return JSON.stringify(x) ?? "undefined";
    }
    function moveMarkersToFront(x) {
      const re = /^(\s+)!!/gm;
      return x.replace(re, (_, spaces) => `!!${spaces.substring(0, spaces.length - 2)}`);
    }
  }
  recordCapture(options) {
    let values = this.captures.get(options.capture);
    if (values === void 0) {
      values = [];
    }
    values.push(options.value);
    this.captures.set(options.capture, values);
  }
};
function* range(n) {
  for (let i = 0; i < n; i++) {
    yield i;
  }
}
function* enumFirst(xs) {
  let first = true;
  for (const x of xs) {
    yield [first, x];
    first = false;
  }
}

// ../assertions/lib/private/matchers/absent.ts
var AbsentMatch = class extends Matcher {
  constructor(name) {
    super();
    this.name = name;
  }
  test(actual) {
    const result = new MatchResult(actual);
    if (actual !== void 0) {
      result.recordFailure({
        matcher: this,
        path: [],
        message: `Received ${actual}, but key should be absent`
      });
    }
    return result;
  }
};

// ../assertions/lib/private/sorting.ts
function sortKeyComparator(keyFn) {
  return (a, b) => {
    const ak = keyFn(a);
    const bk = keyFn(b);
    for (let i = 0; i < ak.length && i < bk.length; i++) {
      const av = ak[i];
      const bv = bk[i];
      let diff = 0;
      if (typeof av === "number" && typeof bv === "number") {
        diff = av - bv;
      } else if (typeof av === "string" && typeof bv === "string") {
        diff = av.localeCompare(bv);
      }
      if (diff !== 0) {
        return diff;
      }
    }
    return bk.length - ak.length;
  };
}

// ../assertions/lib/private/sparse-matrix.ts
var SparseMatrix = class {
  constructor() {
    this.matrix = /* @__PURE__ */ new Map();
  }
  get(row, col) {
    var _a;
    return (_a = this.matrix.get(row)) == null ? void 0 : _a.get(col);
  }
  row(row) {
    var _a;
    return Array.from(((_a = this.matrix.get(row)) == null ? void 0 : _a.entries()) ?? []);
  }
  set(row, col, value) {
    let r = this.matrix.get(row);
    if (!r) {
      r = /* @__PURE__ */ new Map();
      this.matrix.set(row, r);
    }
    r.set(col, value);
  }
};

// ../assertions/lib/private/type.ts
function getType(obj) {
  return Array.isArray(obj) ? "array" : typeof obj;
}

// ../assertions/lib/match.ts
var Match = class {
  static absent() {
    return new AbsentMatch("absent");
  }
  static arrayWith(pattern) {
    return new ArrayMatch("arrayWith", pattern);
  }
  static arrayEquals(pattern) {
    return new ArrayMatch("arrayEquals", pattern, { subsequence: false });
  }
  static exact(pattern) {
    return new LiteralMatch("exact", pattern, { partialObjects: false });
  }
  static objectLike(pattern) {
    return new ObjectMatch("objectLike", pattern);
  }
  static objectEquals(pattern) {
    return new ObjectMatch("objectEquals", pattern, { partial: false });
  }
  static not(pattern) {
    return new NotMatch("not", pattern);
  }
  static serializedJson(pattern) {
    return new SerializedJson("serializedJson", pattern);
  }
  static anyValue() {
    return new AnyMatch("anyValue");
  }
  static stringLikeRegexp(pattern) {
    return new StringLikeRegexpMatch("stringLikeRegexp", pattern);
  }
};
var LiteralMatch = class extends Matcher {
  constructor(name, pattern, options = {}) {
    super();
    this.name = name;
    this.pattern = pattern;
    this.partialObjects = options.partialObjects ?? false;
    if (Matcher.isMatcher(this.pattern)) {
      throw new Error("LiteralMatch cannot directly contain another matcher. Remove the top-level matcher or nest it more deeply.");
    }
  }
  test(actual) {
    if (Array.isArray(this.pattern)) {
      return new ArrayMatch(this.name, this.pattern, { subsequence: false, partialObjects: this.partialObjects }).test(actual);
    }
    if (typeof this.pattern === "object") {
      return new ObjectMatch(this.name, this.pattern, { partial: this.partialObjects }).test(actual);
    }
    const result = new MatchResult(actual);
    if (typeof this.pattern !== typeof actual) {
      result.recordFailure({
        matcher: this,
        path: [],
        message: `Expected type ${typeof this.pattern} but received ${getType(actual)}`
      });
      return result;
    }
    if (actual !== this.pattern) {
      result.recordFailure({
        matcher: this,
        path: [],
        message: `Expected ${this.pattern} but received ${actual}`
      });
    }
    return result;
  }
};
var ArrayMatch = class extends Matcher {
  constructor(name, pattern, options = {}) {
    super();
    this.name = name;
    this.pattern = pattern;
    this.subsequence = options.subsequence ?? true;
    this.partialObjects = options.partialObjects ?? false;
  }
  test(actual) {
    if (!Array.isArray(actual)) {
      return new MatchResult(actual).recordFailure({
        matcher: this,
        path: [],
        message: `Expected type array but received ${getType(actual)}`
      });
    }
    return this.subsequence ? this.testSubsequence(actual) : this.testFullArray(actual);
  }
  testFullArray(actual) {
    const result = new MatchResult(actual);
    let i = 0;
    for (; i < this.pattern.length && i < actual.length; i++) {
      const patternElement = this.pattern[i];
      const matcher = Matcher.isMatcher(patternElement) ? patternElement : new LiteralMatch(this.name, patternElement, { partialObjects: this.partialObjects });
      const innerResult = matcher.test(actual[i]);
      result.compose(`${i}`, innerResult);
    }
    if (i < this.pattern.length) {
      result.recordFailure({
        matcher: this,
        message: `Not enough elements in array (expecting ${this.pattern.length}, got ${actual.length})`,
        path: [`${i}`]
      });
    }
    if (i < actual.length) {
      result.recordFailure({
        matcher: this,
        message: `Too many elements in array (expecting ${this.pattern.length}, got ${actual.length})`,
        path: [`${i}`]
      });
    }
    return result;
  }
  testSubsequence(actual) {
    const result = new MatchResult(actual);
    let patternIdx = 0;
    let actualIdx = 0;
    const matches = new SparseMatrix();
    while (patternIdx < this.pattern.length && actualIdx < actual.length) {
      const patternElement = this.pattern[patternIdx];
      const matcher = Matcher.isMatcher(patternElement) ? patternElement : new LiteralMatch(this.name, patternElement, { partialObjects: this.partialObjects });
      const matcherName = matcher.name;
      if (matcherName == "absent" || matcherName == "anyValue") {
        throw new Error(`The Matcher ${matcherName}() cannot be nested within arrayWith()`);
      }
      const innerResult = matcher.test(actual[actualIdx]);
      matches.set(patternIdx, actualIdx, innerResult);
      actualIdx++;
      if (innerResult.isSuccess) {
        result.compose(`${actualIdx}`, innerResult);
        patternIdx++;
      }
    }
    if (patternIdx < this.pattern.length) {
      for (let spi = 0; spi < patternIdx; spi++) {
        const foundMatch = matches.row(spi).find(([, r]) => r.isSuccess);
        if (!foundMatch) {
          continue;
        }
        const [index] = foundMatch;
        result.compose(`${index}`, new MatchResult(actual[index]).recordFailure({
          matcher: this,
          message: `arrayWith pattern ${spi} matched here`,
          path: [],
          cost: 0
        }));
      }
      const failedMatches = matches.row(patternIdx);
      failedMatches.sort(sortKeyComparator(([i, r]) => [r.failCost, i]));
      if (failedMatches.length > 0) {
        const [index, innerResult] = failedMatches[0];
        result.recordFailure({
          matcher: this,
          message: `Could not match arrayWith pattern ${patternIdx}. This is the closest match`,
          path: [`${index}`],
          cost: 0
        });
        result.compose(`${index}`, innerResult);
      } else {
        result.recordFailure({
          matcher: this,
          message: `Could not match arrayWith pattern ${patternIdx}. No more elements to try`,
          path: [`${actual.length}`]
        });
      }
    }
    return result;
  }
};
var ObjectMatch = class extends Matcher {
  constructor(name, pattern, options = {}) {
    super();
    this.name = name;
    this.pattern = pattern;
    this.partial = options.partial ?? true;
  }
  test(actual) {
    if (typeof actual !== "object" || Array.isArray(actual)) {
      return new MatchResult(actual).recordFailure({
        matcher: this,
        path: [],
        message: `Expected type object but received ${getType(actual)}`
      });
    }
    const result = new MatchResult(actual);
    if (!this.partial) {
      for (const a of Object.keys(actual)) {
        if (!(a in this.pattern)) {
          result.recordFailure({
            matcher: this,
            path: [a],
            message: `Unexpected key ${a}`
          });
        }
      }
    }
    for (const [patternKey, patternVal] of Object.entries(this.pattern)) {
      if (!(patternKey in actual) && !(patternVal instanceof AbsentMatch)) {
        result.recordFailure({
          matcher: this,
          path: [patternKey],
          message: `Missing key '${patternKey}'`
        });
        continue;
      }
      const matcher = Matcher.isMatcher(patternVal) ? patternVal : new LiteralMatch(this.name, patternVal, { partialObjects: this.partial });
      const inner = matcher.test(actual[patternKey]);
      result.compose(patternKey, inner);
    }
    return result;
  }
};
var SerializedJson = class extends Matcher {
  constructor(name, pattern) {
    super();
    this.name = name;
    this.pattern = pattern;
  }
  test(actual) {
    if (getType(actual) !== "string") {
      return new MatchResult(actual).recordFailure({
        matcher: this,
        path: [],
        message: `Expected JSON as a string but found ${getType(actual)}`
      });
    }
    let parsed;
    try {
      parsed = JSON.parse(actual);
    } catch (err) {
      if (err instanceof SyntaxError) {
        return new MatchResult(actual).recordFailure({
          matcher: this,
          path: [],
          message: `Invalid JSON string: ${actual}`
        });
      } else {
        throw err;
      }
    }
    const matcher = Matcher.isMatcher(this.pattern) ? this.pattern : new LiteralMatch(this.name, this.pattern);
    const innerResult = matcher.test(parsed);
    if (innerResult.hasFailed()) {
      innerResult.recordFailure({
        matcher: this,
        path: [],
        message: "Encoded JSON value does not match"
      });
    }
    return innerResult;
  }
};
var NotMatch = class extends Matcher {
  constructor(name, pattern) {
    super();
    this.name = name;
    this.pattern = pattern;
  }
  test(actual) {
    const matcher = Matcher.isMatcher(this.pattern) ? this.pattern : new LiteralMatch(this.name, this.pattern);
    const innerResult = matcher.test(actual);
    const result = new MatchResult(actual);
    if (innerResult.failCount === 0) {
      result.recordFailure({
        matcher: this,
        path: [],
        message: `Found unexpected match: ${JSON.stringify(actual, void 0, 2)}`
      });
    }
    return result;
  }
};
var AnyMatch = class extends Matcher {
  constructor(name) {
    super();
    this.name = name;
  }
  test(actual) {
    const result = new MatchResult(actual);
    if (actual == null) {
      result.recordFailure({
        matcher: this,
        path: [],
        message: "Expected a value but found none"
      });
    }
    return result;
  }
};
var StringLikeRegexpMatch = class extends Matcher {
  constructor(name, pattern) {
    super();
    this.name = name;
    this.pattern = pattern;
  }
  test(actual) {
    const result = new MatchResult(actual);
    const regex = new RegExp(this.pattern, "gm");
    if (typeof actual !== "string") {
      result.recordFailure({
        matcher: this,
        path: [],
        message: `Expected a string, but got '${typeof actual}'`
      });
    }
    if (!regex.test(actual)) {
      result.recordFailure({
        matcher: this,
        path: [],
        message: `String '${actual}' did not match pattern '${this.pattern}'`
      });
    }
    return result;
  }
};

// lib/assertions/providers/lambda-handler/base.ts
var https = __toESM(require("https"));
var url = __toESM(require("url"));
var AWS = __toESM(require("aws-sdk"));
var CustomResourceHandler = class {
  constructor(event, context) {
    this.event = event;
    this.context = context;
    this.timedOut = false;
    this.timeout = setTimeout(async () => {
      await this.respond({
        status: "FAILED",
        reason: "Lambda Function Timeout",
        data: this.context.logStreamName
      });
      this.timedOut = true;
    }, context.getRemainingTimeInMillis() - 1200);
    this.event = event;
    this.physicalResourceId = extractPhysicalResourceId(event);
  }
  async handle() {
    try {
      if ("stateMachineArn" in this.event.ResourceProperties) {
        const req = {
          stateMachineArn: this.event.ResourceProperties.stateMachineArn,
          name: this.event.RequestId,
          input: JSON.stringify(this.event)
        };
        await this.startExecution(req);
        return;
      } else {
        const response = await this.processEvent(this.event.ResourceProperties);
        return response;
      }
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      clearTimeout(this.timeout);
    }
  }
  async handleIsComplete() {
    try {
      const result = await this.processEvent(this.event.ResourceProperties);
      return result;
    } catch (e) {
      console.log(e);
      return;
    } finally {
      clearTimeout(this.timeout);
    }
  }
  async startExecution(req) {
    try {
      const sfn = new AWS.StepFunctions();
      await sfn.startExecution(req).promise();
    } finally {
      clearTimeout(this.timeout);
    }
  }
  respond(response) {
    if (this.timedOut) {
      return;
    }
    const cfResponse = {
      Status: response.status,
      Reason: response.reason,
      PhysicalResourceId: this.physicalResourceId,
      StackId: this.event.StackId,
      RequestId: this.event.RequestId,
      LogicalResourceId: this.event.LogicalResourceId,
      NoEcho: false,
      Data: response.data
    };
    const responseBody = JSON.stringify(cfResponse);
    console.log("Responding to CloudFormation", responseBody);
    const parsedUrl = url.parse(this.event.ResponseURL);
    const requestOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      method: "PUT",
      headers: { "content-type": "", "content-length": responseBody.length }
    };
    return new Promise((resolve, reject) => {
      try {
        const request2 = https.request(requestOptions, resolve);
        request2.on("error", reject);
        request2.write(responseBody);
        request2.end();
      } catch (e) {
        reject(e);
      } finally {
        clearTimeout(this.timeout);
      }
    });
  }
};
function extractPhysicalResourceId(event) {
  switch (event.RequestType) {
    case "Create":
      return event.LogicalResourceId;
    case "Update":
    case "Delete":
      return event.PhysicalResourceId;
  }
}

// lib/assertions/providers/lambda-handler/assertion.ts
var AssertionHandler = class extends CustomResourceHandler {
  async processEvent(request2) {
    let actual = decodeCall(request2.actual);
    const expected = decodeCall(request2.expected);
    let result;
    const matcher = new MatchCreator(expected).getMatcher();
    console.log(`Testing equality between ${JSON.stringify(request2.actual)} and ${JSON.stringify(request2.expected)}`);
    const matchResult = matcher.test(actual);
    matchResult.finished();
    if (matchResult.hasFailed()) {
      result = {
        failed: true,
        assertion: JSON.stringify({
          status: "fail",
          message: matchResult.renderMismatch()
        })
      };
      if (request2.failDeployment) {
        throw new Error(result.assertion);
      }
    } else {
      result = {
        assertion: JSON.stringify({
          status: "success"
        })
      };
    }
    return result;
  }
};
var MatchCreator = class {
  constructor(obj) {
    this.parsedObj = {
      matcher: obj
    };
  }
  getMatcher() {
    try {
      const final = JSON.parse(JSON.stringify(this.parsedObj), function(_k, v) {
        const nested = Object.keys(v)[0];
        switch (nested) {
          case "$ArrayWith":
            return Match.arrayWith(v[nested]);
          case "$ObjectLike":
            return Match.objectLike(v[nested]);
          case "$StringLike":
            return Match.stringLikeRegexp(v[nested]);
          case "$SerializedJson":
            return Match.serializedJson(v[nested]);
          default:
            return v;
        }
      });
      if (Matcher.isMatcher(final.matcher)) {
        return final.matcher;
      }
      return Match.exact(final.matcher);
    } catch {
      return Match.exact(this.parsedObj.matcher);
    }
  }
};
function decodeCall(call) {
  if (!call) {
    return void 0;
  }
  try {
    const parsed = JSON.parse(call);
    return parsed;
  } catch (e) {
    return call;
  }
}

// lib/assertions/providers/lambda-handler/utils.ts
function decode(object) {
  return JSON.parse(JSON.stringify(object), (_k, v) => {
    switch (v) {
      case "TRUE:BOOLEAN":
        return true;
      case "FALSE:BOOLEAN":
        return false;
      default:
        return v;
    }
  });
}

// lib/assertions/providers/lambda-handler/sdk.ts
function flatten(object) {
  return Object.assign(
    {},
    ...function _flatten(child, path = []) {
      return [].concat(...Object.keys(child).map((key) => {
        let childKey = Buffer.isBuffer(child[key]) ? child[key].toString("utf8") : child[key];
        if (typeof childKey === "string") {
          childKey = isJsonString(childKey);
        }
        return typeof childKey === "object" && childKey !== null ? _flatten(childKey, path.concat([key])) : { [path.concat([key]).join(".")]: childKey };
      }));
    }(object)
  );
}
var AwsApiCallHandler = class extends CustomResourceHandler {
  async processEvent(request2) {
    const AWS2 = require("aws-sdk");
    console.log(`AWS SDK VERSION: ${AWS2.VERSION}`);
    if (!Object.prototype.hasOwnProperty.call(AWS2, request2.service)) {
      throw Error(`Service ${request2.service} does not exist in AWS SDK version ${AWS2.VERSION}.`);
    }
    const service = new AWS2[request2.service]();
    const response = await service[request2.api](request2.parameters && decode(request2.parameters)).promise();
    console.log(`SDK response received ${JSON.stringify(response)}`);
    delete response.ResponseMetadata;
    const respond = {
      apiCallResponse: response
    };
    const flatData = {
      ...flatten(respond)
    };
    let resp = respond;
    if (request2.outputPaths) {
      resp = filterKeys(flatData, request2.outputPaths);
    } else if (request2.flattenResponse === "true") {
      resp = flatData;
    }
    console.log(`Returning result ${JSON.stringify(resp)}`);
    return resp;
  }
};
function filterKeys(object, searchStrings) {
  return Object.entries(object).reduce((filteredObject, [key, value]) => {
    for (const searchString of searchStrings) {
      if (key.startsWith(`apiCallResponse.${searchString}`)) {
        filteredObject[key] = value;
      }
    }
    return filteredObject;
  }, {});
}
function isJsonString(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

// lib/assertions/providers/lambda-handler/types.ts
var ASSERT_RESOURCE_TYPE = "Custom::DeployAssert@AssertEquals";
var SDK_RESOURCE_TYPE_PREFIX = "Custom::DeployAssert@SdkCall";

// lib/assertions/providers/lambda-handler/index.ts
async function handler(event, context) {
  console.log(`Event: ${JSON.stringify({ ...event, ResponseURL: "..." })}`);
  const provider = createResourceHandler(event, context);
  try {
    if (event.RequestType === "Delete") {
      await provider.respond({
        status: "SUCCESS",
        reason: "OK"
      });
      return;
    }
    const result = await provider.handle();
    if ("stateMachineArn" in event.ResourceProperties) {
      console.info('Found "stateMachineArn", waiter statemachine started');
      return;
    } else if ("expected" in event.ResourceProperties) {
      console.info('Found "expected", testing assertions');
      const actualPath = event.ResourceProperties.actualPath;
      const actual = actualPath ? result[`apiCallResponse.${actualPath}`] : result.apiCallResponse;
      const assertion = new AssertionHandler({
        ...event,
        ResourceProperties: {
          ServiceToken: event.ServiceToken,
          actual,
          expected: event.ResourceProperties.expected
        }
      }, context);
      try {
        const assertionResult = await assertion.handle();
        await provider.respond({
          status: "SUCCESS",
          reason: "OK",
          data: {
            ...assertionResult,
            ...result
          }
        });
        return;
      } catch (e) {
        await provider.respond({
          status: "FAILED",
          reason: e.message ?? "Internal Error"
        });
        return;
      }
    }
    await provider.respond({
      status: "SUCCESS",
      reason: "OK",
      data: result
    });
  } catch (e) {
    await provider.respond({
      status: "FAILED",
      reason: e.message ?? "Internal Error"
    });
    return;
  }
  return;
}
async function onTimeout(timeoutEvent) {
  const isCompleteRequest = JSON.parse(JSON.parse(timeoutEvent.Cause).errorMessage);
  const provider = createResourceHandler(isCompleteRequest, standardContext);
  await provider.respond({
    status: "FAILED",
    reason: "Operation timed out: " + JSON.stringify(isCompleteRequest)
  });
}
async function isComplete(event, context) {
  console.log(`Event: ${JSON.stringify({ ...event, ResponseURL: "..." })}`);
  const provider = createResourceHandler(event, context);
  try {
    const result = await provider.handleIsComplete();
    const actualPath = event.ResourceProperties.actualPath;
    if (result) {
      const actual = actualPath ? result[`apiCallResponse.${actualPath}`] : result.apiCallResponse;
      if ("expected" in event.ResourceProperties) {
        const assertion = new AssertionHandler({
          ...event,
          ResourceProperties: {
            ServiceToken: event.ServiceToken,
            actual,
            expected: event.ResourceProperties.expected
          }
        }, context);
        const assertionResult = await assertion.handleIsComplete();
        if (!(assertionResult == null ? void 0 : assertionResult.failed)) {
          await provider.respond({
            status: "SUCCESS",
            reason: "OK",
            data: {
              ...assertionResult,
              ...result
            }
          });
          return;
        } else {
          console.log(`Assertion Failed: ${JSON.stringify(assertionResult)}`);
          throw new Error(JSON.stringify(event));
        }
      }
      await provider.respond({
        status: "SUCCESS",
        reason: "OK",
        data: result
      });
    } else {
      console.log("No result");
      throw new Error(JSON.stringify(event));
    }
    return;
  } catch (e) {
    console.log(e);
    throw new Error(JSON.stringify(event));
  }
}
function createResourceHandler(event, context) {
  if (event.ResourceType.startsWith(SDK_RESOURCE_TYPE_PREFIX)) {
    return new AwsApiCallHandler(event, context);
  } else if (event.ResourceType.startsWith(ASSERT_RESOURCE_TYPE)) {
    return new AssertionHandler(event, context);
  } else {
    throw new Error(`Unsupported resource type "${event.ResourceType}`);
  }
}
var standardContext = {
  getRemainingTimeInMillis: () => 9e4
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler,
  isComplete,
  onTimeout
});
