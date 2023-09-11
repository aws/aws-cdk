"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteObject = exports.putObject = exports.onEvent = void 0;
/// <reference path="../../../../../../../../../node_modules/aws-cdk-lib/custom-resources/lib/provider-framework/types.d.ts" />
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrSEFBK0g7QUFDL0gsc0RBQXNEO0FBQ3RELCtCQUErQjtBQUMvQixrREFBd0M7QUFDeEMsNkJBQTZCO0FBRTdCLE1BQU0sRUFBRSxHQUFHLElBQUksY0FBRSxFQUFFLENBQUM7QUFFYixLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQStDO0lBQzNFLFFBQVEsS0FBSyxDQUFDLFdBQVcsRUFBRTtRQUN6QixLQUFLLFFBQVEsQ0FBQztRQUNkLEtBQUssUUFBUTtZQUNYLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFCLEtBQUssUUFBUTtZQUNYLE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzlCO0FBQ0gsQ0FBQztBQVRELDBCQVNDO0FBRU0sS0FBSyxVQUFVLFNBQVMsQ0FBQyxLQUErQztJQUM3RSxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDbEUsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztLQUFFO0lBRWpFLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDN0QsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztLQUFFO0lBRTdELHFFQUFxRTtJQUNyRSw0RUFBNEU7SUFDNUUsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxLQUFLLENBQUMsaUJBQWlCLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUM7SUFFNUksb0JBQW9CO0lBQ3BCLElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUM3QixTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoQztJQUVELE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksS0FBSyxDQUFDO0lBRXRFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLFVBQVUsSUFBSSxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBRXZELE1BQU0sSUFBSSxHQUFHLE1BQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQztRQUM5QixNQUFNLEVBQUUsVUFBVTtRQUNsQixHQUFHLEVBQUUsU0FBUztRQUNkLElBQUksRUFBRSxRQUFRO1FBQ2QsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxTQUFTO0tBQzVDLENBQUMsQ0FBQztJQUVILDZHQUE2RztJQUM3Ryw2R0FBNkc7SUFDN0csc0JBQXNCO0lBRXRCLE9BQU87UUFDTCxrQkFBa0IsRUFBRSxTQUFTO1FBQzdCLElBQUksRUFBRTtZQUNKLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxFQUFFLFNBQVM7WUFDaEMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDMUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsV0FBVyxVQUFVLHFCQUFxQixTQUFTLEVBQUU7U0FDdEU7S0FDRixDQUFDO0FBQ0osQ0FBQztBQXZDRCw4QkF1Q0M7QUFFTSxLQUFLLFVBQVUsWUFBWSxDQUFDLEtBQStDO0lBQ2hGLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7SUFDdkQsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztLQUFFO0lBRWpFLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQztJQUMzQyxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0tBQ2xFO0lBRUQsTUFBTSxFQUFFLENBQUMsWUFBWSxDQUFDO1FBQ3BCLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLEdBQUcsRUFBRSxTQUFTO0tBQ2YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWJELG9DQWFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hd3MtY2RrLWxpYi9jdXN0b20tcmVzb3VyY2VzL2xpYi9wcm92aWRlci1mcmFtZXdvcmsvdHlwZXMuZC50c1wiIC8+XG4vKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbmltcG9ydCB7IFMzIH0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LXMzJztcbmltcG9ydCAqIGFzIGFwaSBmcm9tICcuL2FwaSc7XG5cbmNvbnN0IHMzID0gbmV3IFMzKCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvbkV2ZW50KGV2ZW50OiBBV1NDREtBc3luY0N1c3RvbVJlc291cmNlLk9uRXZlbnRSZXF1ZXN0KSB7XG4gIHN3aXRjaCAoZXZlbnQuUmVxdWVzdFR5cGUpIHtcbiAgICBjYXNlICdDcmVhdGUnOlxuICAgIGNhc2UgJ1VwZGF0ZSc6XG4gICAgICByZXR1cm4gcHV0T2JqZWN0KGV2ZW50KTtcblxuICAgIGNhc2UgJ0RlbGV0ZSc6XG4gICAgICByZXR1cm4gZGVsZXRlT2JqZWN0KGV2ZW50KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHV0T2JqZWN0KGV2ZW50OiBBV1NDREtBc3luY0N1c3RvbVJlc291cmNlLk9uRXZlbnRSZXF1ZXN0KTogUHJvbWlzZTxBV1NDREtBc3luY0N1c3RvbVJlc291cmNlLk9uRXZlbnRSZXNwb25zZT4ge1xuICBjb25zdCBidWNrZXROYW1lID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzW2FwaS5QUk9QX0JVQ0tFVF9OQU1FXTtcbiAgaWYgKCFidWNrZXROYW1lKSB7IHRocm93IG5ldyBFcnJvcignXCJCdWNrZXROYW1lXCIgaXMgcmVxdWlyZWQnKTsgfVxuXG4gIGNvbnN0IGNvbnRlbnRzID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzW2FwaS5QUk9QX0NPTlRFTlRTXTtcbiAgaWYgKCFjb250ZW50cykgeyB0aHJvdyBuZXcgRXJyb3IoJ1wiQ29udGVudHNcIiBpcyByZXF1aXJlZCcpOyB9XG5cbiAgLy8gZGV0ZXJtaW5lIHRoZSBvYmplY3Qga2V5IHdoaWNoIGlzIHRoZSBwaHlzaWNhbCBJRCBvZiB0aGUgcmVzb3VyY2UuXG4gIC8vIGlmIGl0IHdhcyBub3QgcHJvdmlkZWQgYnkgdGhlIHVzZXIsIHdlIGdlbmVyYXRlZCBpdCB1c2luZyB0aGUgcmVxdWVzdCBJRC5cbiAgbGV0IG9iamVjdEtleSA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllc1thcGkuUFJPUF9PQkpFQ1RfS0VZXSB8fCBldmVudC5Mb2dpY2FsUmVzb3VyY2VJZCArICctJyArIGV2ZW50LlJlcXVlc3RJZC5yZXBsYWNlKC8tL2csICcnKSArICcudHh0JztcblxuICAvLyB0cmltIHRyYWlsaW5nIGAvYFxuICBpZiAob2JqZWN0S2V5LnN0YXJ0c1dpdGgoJy8nKSkge1xuICAgIG9iamVjdEtleSA9IG9iamVjdEtleS5zbGljZSgxKTtcbiAgfVxuXG4gIGNvbnN0IHB1YmxpY1JlYWQgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXNbYXBpLlBST1BfUFVCTElDXSB8fCBmYWxzZTtcblxuICBjb25zb2xlLmxvZyhgd3JpdGluZyBzMzovLyR7YnVja2V0TmFtZX0vJHtvYmplY3RLZXl9YCk7XG5cbiAgY29uc3QgcmVzcCA9IGF3YWl0IHMzLnB1dE9iamVjdCh7XG4gICAgQnVja2V0OiBidWNrZXROYW1lLFxuICAgIEtleTogb2JqZWN0S2V5LFxuICAgIEJvZHk6IGNvbnRlbnRzLFxuICAgIEFDTDogcHVibGljUmVhZCA/ICdwdWJsaWMtcmVhZCcgOiB1bmRlZmluZWQsXG4gIH0pO1xuXG4gIC8vIE5PVEU6IHVwZGF0ZXMgdG8gdGhlIG9iamVjdCBrZXkgd2lsbCBiZSBoYW5kbGVkIGF1dG9tYXRpY2FsbHk6IGEgbmV3IG9iamVjdCB3aWxsIGJlIHB1dCBhbmQgdGhlbiB3ZSByZXR1cm5cbiAgLy8gdGhlIG5ldyBuYW1lLiB0aGlzIHdpbGwgdGVsbCBjbG91ZGZvcm1hdGlvbiB0aGF0IHRoZSByZXNvdXJjZSBoYXMgYmVlbiByZXBsYWNlZCBhbmQgaXQgd2lsbCBpc3N1ZSBhIERFTEVURVxuICAvLyBmb3IgdGhlIG9sZCBvYmplY3QuXG5cbiAgcmV0dXJuIHtcbiAgICBQaHlzaWNhbFJlc291cmNlSWQ6IG9iamVjdEtleSxcbiAgICBEYXRhOiB7XG4gICAgICBbYXBpLkFUVFJfT0JKRUNUX0tFWV06IG9iamVjdEtleSxcbiAgICAgIFthcGkuQVRUUl9FVEFHXTogcmVzcC5FVGFnLFxuICAgICAgW2FwaS5BVFRSX1VSTF06IGBodHRwczovLyR7YnVja2V0TmFtZX0uczMuYW1hem9uYXdzLmNvbS8ke29iamVjdEtleX1gLFxuICAgIH0sXG4gIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVPYmplY3QoZXZlbnQ6IEFXU0NES0FzeW5jQ3VzdG9tUmVzb3VyY2UuT25FdmVudFJlcXVlc3QpIHtcbiAgY29uc3QgYnVja2V0TmFtZSA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5CdWNrZXROYW1lO1xuICBpZiAoIWJ1Y2tldE5hbWUpIHsgdGhyb3cgbmV3IEVycm9yKCdcIkJ1Y2tldE5hbWVcIiBpcyByZXF1aXJlZCcpOyB9XG5cbiAgY29uc3Qgb2JqZWN0S2V5ID0gZXZlbnQuUGh5c2ljYWxSZXNvdXJjZUlkO1xuICBpZiAoIW9iamVjdEtleSkge1xuICAgIHRocm93IG5ldyBFcnJvcignUGh5c2ljYWxSZXNvdXJjZUlkIGV4cGVjdGVkIGZvciBERUxFVEUgZXZlbnRzJyk7XG4gIH1cblxuICBhd2FpdCBzMy5kZWxldGVPYmplY3Qoe1xuICAgIEJ1Y2tldDogYnVja2V0TmFtZSxcbiAgICBLZXk6IG9iamVjdEtleSxcbiAgfSk7XG59XG4iXX0=