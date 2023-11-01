"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteObject = exports.putObject = exports.onEvent = void 0;
/// <reference path="../../../../../../../../../node_modules/@aws-cdk/custom-resource-handlers/lib/types.d.ts" />
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const client_s3_1 = require("@aws-sdk/client-s3");
const api = require("./api");
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
exports.onEvent = onEvent;
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
exports.putObject = putObject;
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
exports.deleteObject = deleteObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpSEFBaUg7QUFDakgsc0RBQXNEO0FBQ3RELCtCQUErQjtBQUMvQixrREFBd0M7QUFDeEMsNkJBQTZCO0FBRTdCLE1BQU0sRUFBRSxHQUFHLElBQUksY0FBRSxFQUFFLENBQUM7QUFFYixLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQStDO0lBQzNFLFFBQVEsS0FBSyxDQUFDLFdBQVcsRUFBRTtRQUN6QixLQUFLLFFBQVEsQ0FBQztRQUNkLEtBQUssUUFBUTtZQUNYLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFCLEtBQUssUUFBUTtZQUNYLE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzlCO0FBQ0gsQ0FBQztBQVRELDBCQVNDO0FBRU0sS0FBSyxVQUFVLFNBQVMsQ0FBQyxLQUErQztJQUM3RSxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDbEUsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztLQUFFO0lBRWpFLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDN0QsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztLQUFFO0lBRTdELHFFQUFxRTtJQUNyRSw0RUFBNEU7SUFDNUUsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxLQUFLLENBQUMsaUJBQWlCLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUM7SUFFNUksb0JBQW9CO0lBQ3BCLElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUM3QixTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoQztJQUVELE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksS0FBSyxDQUFDO0lBRXRFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLFVBQVUsSUFBSSxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBRXZELE1BQU0sSUFBSSxHQUFHLE1BQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQztRQUM5QixNQUFNLEVBQUUsVUFBVTtRQUNsQixHQUFHLEVBQUUsU0FBUztRQUNkLElBQUksRUFBRSxRQUFRO1FBQ2QsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxTQUFTO0tBQzVDLENBQUMsQ0FBQztJQUVILDZHQUE2RztJQUM3Ryw2R0FBNkc7SUFDN0csc0JBQXNCO0lBRXRCLE9BQU87UUFDTCxrQkFBa0IsRUFBRSxTQUFTO1FBQzdCLElBQUksRUFBRTtZQUNKLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxFQUFFLFNBQVM7WUFDaEMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDMUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsV0FBVyxVQUFVLHFCQUFxQixTQUFTLEVBQUU7U0FDdEU7S0FDRixDQUFDO0FBQ0osQ0FBQztBQXZDRCw4QkF1Q0M7QUFFTSxLQUFLLFVBQVUsWUFBWSxDQUFDLEtBQStDO0lBQ2hGLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7SUFDdkQsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztLQUFFO0lBRWpFLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQztJQUMzQyxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0tBQ2xFO0lBRUQsTUFBTSxFQUFFLENBQUMsWUFBWSxDQUFDO1FBQ3BCLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLEdBQUcsRUFBRSxTQUFTO0tBQ2YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWJELG9DQWFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AYXdzLWNkay9jdXN0b20tcmVzb3VyY2UtaGFuZGxlcnMvbGliL3R5cGVzLmQudHNcIiAvPlxuLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5pbXBvcnQgeyBTMyB9IGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1zMyc7XG5pbXBvcnQgKiBhcyBhcGkgZnJvbSAnLi9hcGknO1xuXG5jb25zdCBzMyA9IG5ldyBTMygpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb25FdmVudChldmVudDogQVdTQ0RLQXN5bmNDdXN0b21SZXNvdXJjZS5PbkV2ZW50UmVxdWVzdCkge1xuICBzd2l0Y2ggKGV2ZW50LlJlcXVlc3RUeXBlKSB7XG4gICAgY2FzZSAnQ3JlYXRlJzpcbiAgICBjYXNlICdVcGRhdGUnOlxuICAgICAgcmV0dXJuIHB1dE9iamVjdChldmVudCk7XG5cbiAgICBjYXNlICdEZWxldGUnOlxuICAgICAgcmV0dXJuIGRlbGV0ZU9iamVjdChldmVudCk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHB1dE9iamVjdChldmVudDogQVdTQ0RLQXN5bmNDdXN0b21SZXNvdXJjZS5PbkV2ZW50UmVxdWVzdCk6IFByb21pc2U8QVdTQ0RLQXN5bmNDdXN0b21SZXNvdXJjZS5PbkV2ZW50UmVzcG9uc2U+IHtcbiAgY29uc3QgYnVja2V0TmFtZSA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllc1thcGkuUFJPUF9CVUNLRVRfTkFNRV07XG4gIGlmICghYnVja2V0TmFtZSkgeyB0aHJvdyBuZXcgRXJyb3IoJ1wiQnVja2V0TmFtZVwiIGlzIHJlcXVpcmVkJyk7IH1cblxuICBjb25zdCBjb250ZW50cyA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllc1thcGkuUFJPUF9DT05URU5UU107XG4gIGlmICghY29udGVudHMpIHsgdGhyb3cgbmV3IEVycm9yKCdcIkNvbnRlbnRzXCIgaXMgcmVxdWlyZWQnKTsgfVxuXG4gIC8vIGRldGVybWluZSB0aGUgb2JqZWN0IGtleSB3aGljaCBpcyB0aGUgcGh5c2ljYWwgSUQgb2YgdGhlIHJlc291cmNlLlxuICAvLyBpZiBpdCB3YXMgbm90IHByb3ZpZGVkIGJ5IHRoZSB1c2VyLCB3ZSBnZW5lcmF0ZWQgaXQgdXNpbmcgdGhlIHJlcXVlc3QgSUQuXG4gIGxldCBvYmplY3RLZXkgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXNbYXBpLlBST1BfT0JKRUNUX0tFWV0gfHwgZXZlbnQuTG9naWNhbFJlc291cmNlSWQgKyAnLScgKyBldmVudC5SZXF1ZXN0SWQucmVwbGFjZSgvLS9nLCAnJykgKyAnLnR4dCc7XG5cbiAgLy8gdHJpbSB0cmFpbGluZyBgL2BcbiAgaWYgKG9iamVjdEtleS5zdGFydHNXaXRoKCcvJykpIHtcbiAgICBvYmplY3RLZXkgPSBvYmplY3RLZXkuc2xpY2UoMSk7XG4gIH1cblxuICBjb25zdCBwdWJsaWNSZWFkID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzW2FwaS5QUk9QX1BVQkxJQ10gfHwgZmFsc2U7XG5cbiAgY29uc29sZS5sb2coYHdyaXRpbmcgczM6Ly8ke2J1Y2tldE5hbWV9LyR7b2JqZWN0S2V5fWApO1xuXG4gIGNvbnN0IHJlc3AgPSBhd2FpdCBzMy5wdXRPYmplY3Qoe1xuICAgIEJ1Y2tldDogYnVja2V0TmFtZSxcbiAgICBLZXk6IG9iamVjdEtleSxcbiAgICBCb2R5OiBjb250ZW50cyxcbiAgICBBQ0w6IHB1YmxpY1JlYWQgPyAncHVibGljLXJlYWQnIDogdW5kZWZpbmVkLFxuICB9KTtcblxuICAvLyBOT1RFOiB1cGRhdGVzIHRvIHRoZSBvYmplY3Qga2V5IHdpbGwgYmUgaGFuZGxlZCBhdXRvbWF0aWNhbGx5OiBhIG5ldyBvYmplY3Qgd2lsbCBiZSBwdXQgYW5kIHRoZW4gd2UgcmV0dXJuXG4gIC8vIHRoZSBuZXcgbmFtZS4gdGhpcyB3aWxsIHRlbGwgY2xvdWRmb3JtYXRpb24gdGhhdCB0aGUgcmVzb3VyY2UgaGFzIGJlZW4gcmVwbGFjZWQgYW5kIGl0IHdpbGwgaXNzdWUgYSBERUxFVEVcbiAgLy8gZm9yIHRoZSBvbGQgb2JqZWN0LlxuXG4gIHJldHVybiB7XG4gICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBvYmplY3RLZXksXG4gICAgRGF0YToge1xuICAgICAgW2FwaS5BVFRSX09CSkVDVF9LRVldOiBvYmplY3RLZXksXG4gICAgICBbYXBpLkFUVFJfRVRBR106IHJlc3AuRVRhZyxcbiAgICAgIFthcGkuQVRUUl9VUkxdOiBgaHR0cHM6Ly8ke2J1Y2tldE5hbWV9LnMzLmFtYXpvbmF3cy5jb20vJHtvYmplY3RLZXl9YCxcbiAgICB9LFxuICB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlT2JqZWN0KGV2ZW50OiBBV1NDREtBc3luY0N1c3RvbVJlc291cmNlLk9uRXZlbnRSZXF1ZXN0KSB7XG4gIGNvbnN0IGJ1Y2tldE5hbWUgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQnVja2V0TmFtZTtcbiAgaWYgKCFidWNrZXROYW1lKSB7IHRocm93IG5ldyBFcnJvcignXCJCdWNrZXROYW1lXCIgaXMgcmVxdWlyZWQnKTsgfVxuXG4gIGNvbnN0IG9iamVjdEtleSA9IGV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZDtcbiAgaWYgKCFvYmplY3RLZXkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1BoeXNpY2FsUmVzb3VyY2VJZCBleHBlY3RlZCBmb3IgREVMRVRFIGV2ZW50cycpO1xuICB9XG5cbiAgYXdhaXQgczMuZGVsZXRlT2JqZWN0KHtcbiAgICBCdWNrZXQ6IGJ1Y2tldE5hbWUsXG4gICAgS2V5OiBvYmplY3RLZXksXG4gIH0pO1xufVxuIl19