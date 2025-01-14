"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
// eslint-disable-next-line import/no-extraneous-dependencies
const client_s3_1 = require("@aws-sdk/client-s3");
const s3 = new client_s3_1.S3();
async function handler(event) {
    switch (event.RequestType) {
        case 'Create':
            if (event.ResourceProperties.Fail) {
                throw new Error('Failing on request!');
            }
            const bucketName = event.ResourceProperties.BucketName;
            if (!bucketName) {
                throw new Error('Missing BucketName');
            }
            return putObjects(bucketName);
        case 'Update':
        case 'Delete':
            return;
    }
}
async function putObjects(bucketName, n = 5) {
    // Put n objects in parallel
    // Bounded by human input
    // eslint-disable-next-line @cdklabs/promiseall-no-unbounded-parallelism
    await Promise.all([...Array(n).keys()]
        .map(key => s3.putObject({
        Bucket: bucketName,
        Key: `Key${key}`,
        Body: `Body${key}`,
    })));
}
