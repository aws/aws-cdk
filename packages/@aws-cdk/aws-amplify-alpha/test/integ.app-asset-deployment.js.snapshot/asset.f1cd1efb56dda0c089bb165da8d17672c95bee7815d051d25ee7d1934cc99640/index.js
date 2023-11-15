"use strict";

// packages/@aws-cdk/custom-resource-handlers/dist/aws-amplify-alpha/asset-deployment-handler/index.js
var n = Object.defineProperty;
var h = Object.getOwnPropertyDescriptor;
var f = Object.getOwnPropertyNames;
var b = Object.prototype.hasOwnProperty;
var C = (t, e) => {
  for (var s in e)
    n(t, s, { get: e[s], enumerable: true });
};
var I = (t, e, s, o) => {
  if (e && typeof e == "object" || typeof e == "function")
    for (let r of f(e))
      !b.call(t, r) && r !== s && n(t, r, { get: () => e[r], enumerable: !(o = h(e, r)) || o.enumerable });
  return t;
};
var A = (t) => I(n({}, "__esModule", { value: true }), t);
var P = {};
C(P, { isComplete: () => w, onEvent: () => v });
module.exports = A(P);
var c = require("@aws-sdk/client-amplify");
var l = require("@aws-sdk/client-s3");
var a = require("@aws-sdk/client-s3");
var m = require("@aws-sdk/s3-request-presigner");
var p = class {
  constructor(e) {
    this.requestType = e.RequestType, this.requestId = e.RequestId, this.logicalResourceId = e.LogicalResourceId, this.physicalResourceId = e.PhysicalResourceId, this.event = e;
  }
  onEvent() {
    switch (this.requestType) {
      case "Create":
        return this.onCreate();
      case "Update":
        return this.onUpdate();
      case "Delete":
        return this.onDelete();
    }
    throw new Error(`Invalid request type ${this.requestType}`);
  }
  isComplete() {
    switch (this.requestType) {
      case "Create":
        return this.isCreateComplete();
      case "Update":
        return this.isUpdateComplete();
      case "Delete":
        return this.isDeleteComplete();
    }
    throw new Error(`Invalid request type ${this.requestType}`);
  }
  log(e) {
    console.log(JSON.stringify(e, void 0, 2));
  }
};
var i = class extends p {
  constructor(s, o, r) {
    super(r);
    this.props = this.event.ResourceProperties, this.amplify = s, this.s3 = o;
  }
  async onCreate() {
    console.log("deploying to Amplify with options:", JSON.stringify(this.props, void 0, 2));
    let s = await this.amplify.listJobs({ appId: this.props.AppId, branchName: this.props.BranchName, maxResults: 1 });
    if (s.jobSummaries && s.jobSummaries.find((y) => y.status === "PENDING"))
      return Promise.reject("Amplify job already running. Aborting deployment.");
    let o = new a.GetObjectCommand({ Bucket: this.props.S3BucketName, Key: this.props.S3ObjectKey }), r = await (0, m.getSignedUrl)(this.s3, o);
    return { AmplifyJobId: (await this.amplify.startDeployment({ appId: this.props.AppId, branchName: this.props.BranchName, sourceUrl: r })).jobSummary?.jobId };
  }
  async isCreateComplete() {
    return this.isActive(this.event.AmplifyJobId);
  }
  async onDelete() {
  }
  async isDeleteComplete() {
    return { IsComplete: true };
  }
  async onUpdate() {
    return this.onCreate();
  }
  async isUpdateComplete() {
    return this.isActive(this.event.AmplifyJobId);
  }
  async isActive(s) {
    if (!s)
      throw new Error("Unable to determine Amplify job status without job id");
    let o = await this.amplify.getJob({ appId: this.props.AppId, branchName: this.props.BranchName, jobId: s });
    if (o.job?.summary?.status === "SUCCEED")
      return { IsComplete: true, Data: { JobId: s, Status: o.job.summary.status } };
    if (o.job?.summary?.status === "FAILED" || o.job?.summary?.status === "CANCELLED")
      throw new Error(`Amplify job failed with status: ${o.job?.summary?.status}`);
    return { IsComplete: false };
  }
};
var R = "Custom::AmplifyAssetDeployment";
var d = { logger: console };
var E = new c.Amplify(d);
var g = new l.S3(d);
async function v(t) {
  return u(t).onEvent();
}
async function w(t) {
  return u(t).isComplete();
}
function u(t) {
  switch (t.ResourceType) {
    case R:
      return new i(E, g, t);
    default:
      throw new Error(`Unsupported resource type "${t.ResourceType}"`);
  }
}
