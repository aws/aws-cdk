"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
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

// packages/@aws-cdk/aws-amplify-alpha/lib/asset-deployment-handler/common.ts
var ResourceHandler;
var init_common = __esm({
  "packages/@aws-cdk/aws-amplify-alpha/lib/asset-deployment-handler/common.ts"() {
    "use strict";
    ResourceHandler = class {
      constructor(event) {
        this.requestType = event.RequestType;
        this.requestId = event.RequestId;
        this.logicalResourceId = event.LogicalResourceId;
        this.physicalResourceId = event.PhysicalResourceId;
        this.event = event;
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
      log(x) {
        console.log(JSON.stringify(x, void 0, 2));
      }
    };
  }
});

// packages/@aws-cdk/aws-amplify-alpha/lib/asset-deployment-handler/handler.ts
var handler_exports = {};
__export(handler_exports, {
  AmplifyAssetDeploymentHandler: () => AmplifyAssetDeploymentHandler
});
function parseProps(props) {
  return props;
}
var import_client_s3, import_s3_request_presigner, AmplifyAssetDeploymentHandler;
var init_handler = __esm({
  "packages/@aws-cdk/aws-amplify-alpha/lib/asset-deployment-handler/handler.ts"() {
    "use strict";
    import_client_s3 = require("@aws-sdk/client-s3");
    import_s3_request_presigner = require("@aws-sdk/s3-request-presigner");
    init_common();
    AmplifyAssetDeploymentHandler = class extends ResourceHandler {
      constructor(amplify2, s32, event) {
        super(event);
        this.props = parseProps(this.event.ResourceProperties);
        this.amplify = amplify2;
        this.s3 = s32;
      }
      // ------
      // CREATE
      // ------
      async onCreate() {
        console.log("deploying to Amplify with options:", JSON.stringify(this.props, void 0, 2));
        const jobs = await this.amplify.listJobs({
          appId: this.props.AppId,
          branchName: this.props.BranchName,
          maxResults: 1
        });
        if (jobs.jobSummaries && jobs.jobSummaries.find((summary) => summary.status === "PENDING")) {
          return Promise.reject("Amplify job already running. Aborting deployment.");
        }
        const command = new import_client_s3.GetObjectCommand({
          Bucket: this.props.S3BucketName,
          Key: this.props.S3ObjectKey
        });
        const assetUrl = await (0, import_s3_request_presigner.getSignedUrl)(this.s3, command);
        const deployment = await this.amplify.startDeployment({
          appId: this.props.AppId,
          branchName: this.props.BranchName,
          sourceUrl: assetUrl
        });
        return {
          AmplifyJobId: deployment.jobSummary?.jobId
        };
      }
      async isCreateComplete() {
        return this.isActive(this.event.AmplifyJobId);
      }
      // ------
      // DELETE
      // ------
      async onDelete() {
        return;
      }
      async isDeleteComplete() {
        return {
          IsComplete: true
        };
      }
      // ------
      // UPDATE
      // ------
      async onUpdate() {
        return this.onCreate();
      }
      async isUpdateComplete() {
        return this.isActive(this.event.AmplifyJobId);
      }
      async isActive(jobId) {
        if (!jobId) {
          throw new Error("Unable to determine Amplify job status without job id");
        }
        const job = await this.amplify.getJob({
          appId: this.props.AppId,
          branchName: this.props.BranchName,
          jobId
        });
        if (job.job?.summary?.status === "SUCCEED") {
          return {
            IsComplete: true,
            Data: {
              JobId: jobId,
              Status: job.job.summary.status
            }
          };
        }
        if (job.job?.summary?.status === "FAILED" || job.job?.summary?.status === "CANCELLED") {
          throw new Error(`Amplify job failed with status: ${job.job?.summary?.status}`);
        } else {
          return {
            IsComplete: false
          };
        }
      }
    };
  }
});

// packages/@aws-cdk/aws-amplify-alpha/lib/asset-deployment-handler/index.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.isComplete = exports.onEvent = void 0;
var client_amplify_1 = require("@aws-sdk/client-amplify");
var client_s3_1 = require("@aws-sdk/client-s3");
var handler_1 = (init_handler(), __toCommonJS(handler_exports));
var AMPLIFY_ASSET_DEPLOYMENT_RESOURCE_TYPE = "Custom::AmplifyAssetDeployment";
var sdkConfig = { logger: console };
var amplify = new client_amplify_1.Amplify(sdkConfig);
var s3 = new client_s3_1.S3(sdkConfig);
async function onEvent(event) {
  const provider = createResourceHandler(event);
  return provider.onEvent();
}
exports.onEvent = onEvent;
async function isComplete(event) {
  const provider = createResourceHandler(event);
  return provider.isComplete();
}
exports.isComplete = isComplete;
function createResourceHandler(event) {
  switch (event.ResourceType) {
    case AMPLIFY_ASSET_DEPLOYMENT_RESOURCE_TYPE:
      return new handler_1.AmplifyAssetDeploymentHandler(amplify, s3, event);
    default:
      throw new Error(`Unsupported resource type "${event.ResourceType}"`);
  }
}
