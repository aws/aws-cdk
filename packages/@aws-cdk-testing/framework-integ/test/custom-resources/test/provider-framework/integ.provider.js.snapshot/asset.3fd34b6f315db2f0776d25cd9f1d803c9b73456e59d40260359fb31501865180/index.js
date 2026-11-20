"use strict";
/// <reference path="../../../../../../../../../node_modules/aws-cdk-lib/custom-resources/lib/provider-framework/types.d.ts" />
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.onEvent = onEvent;
exports.putObject = putObject;
exports.deleteObject = deleteObject;
const client_s3_1 = require("@aws-sdk/client-s3");
const api = __importStar(require("./api"));
const s3 = new client_s3_1.S3();
async function onEvent(event) {
    switch (event.RequestType) {
        case 'Create':
        case 'Update':
            return putObject(event);
        case 'Delete':
            return deleteObject(event);
    }
}
async function putObject(event) {
    const bucketName = event.ResourceProperties[api.PROP_BUCKET_NAME];
    if (!bucketName) {
        throw new Error('"BucketName" is required');
    }
    const contents = event.ResourceProperties[api.PROP_CONTENTS];
    if (!contents) {
        throw new Error('"Contents" is required');
    }
    // determine the object key which is the physical ID of the resource.
    // if it was not provided by the user, we generated it using the request ID.
    let objectKey = event.ResourceProperties[api.PROP_OBJECT_KEY] || event.LogicalResourceId + '-' + event.RequestId.replace(/-/g, '') + '.txt';
    // trim trailing `/`
    if (objectKey.startsWith('/')) {
        objectKey = objectKey.slice(1);
    }
    const publicRead = event.ResourceProperties[api.PROP_PUBLIC] || false;
    console.log(`writing s3://${bucketName}/${objectKey}`);
    const resp = await s3.putObject({
        Bucket: bucketName,
        Key: objectKey,
        Body: contents,
        ACL: publicRead ? 'public-read' : undefined,
    });
    // NOTE: updates to the object key will be handled automatically: a new object will be put and then we return
    // the new name. this will tell cloudformation that the resource has been replaced and it will issue a DELETE
    // for the old object.
    return {
        PhysicalResourceId: objectKey,
        Data: {
            [api.ATTR_OBJECT_KEY]: objectKey,
            [api.ATTR_ETAG]: resp.ETag,
            [api.ATTR_URL]: `https://${bucketName}.s3.amazonaws.com/${objectKey}`,
        },
    };
}
async function deleteObject(event) {
    const bucketName = event.ResourceProperties.BucketName;
    if (!bucketName) {
        throw new Error('"BucketName" is required');
    }
    const objectKey = event.PhysicalResourceId;
    if (!objectKey) {
        throw new Error('PhysicalResourceId expected for DELETE events');
    }
    await s3.deleteObject({
        Bucket: bucketName,
        Key: objectKey,
    });
}
