"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// eslint-disable-next-line import/no-extraneous-dependencies
const aws_sdk_1 = require("aws-sdk");
const s3 = new aws_sdk_1.S3();
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
exports.handler = handler;
async function putObjects(bucketName, n = 5) {
    // Put n objects in parallel
    await Promise.all([...Array(n).keys()]
        .map(key => s3.putObject({
        Bucket: bucketName,
        Key: `Key${key}`,
        Body: `Body${key}`,
    }).promise()));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2REFBNkQ7QUFDN0QscUNBQTZCO0FBRTdCLE1BQU0sRUFBRSxHQUFHLElBQUksWUFBRSxFQUFFLENBQUM7QUFFYixLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtEO0lBQzlFLFFBQVEsS0FBSyxDQUFDLFdBQVcsRUFBRTtRQUN6QixLQUFLLFFBQVE7WUFDWCxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUU7Z0JBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQzthQUN4QztZQUNELE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7WUFDdkQsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDZixNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUM7YUFDdkM7WUFDRCxPQUFPLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoQyxLQUFLLFFBQVEsQ0FBQztRQUNkLEtBQUssUUFBUTtZQUNYLE9BQU87S0FDVjtBQUNILENBQUM7QUFmRCwwQkFlQztBQUVELEtBQUssVUFBVSxVQUFVLENBQUMsVUFBa0IsRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUNqRCw0QkFBNEI7SUFDNUIsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDbkMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQztRQUN2QixNQUFNLEVBQUUsVUFBVTtRQUNsQixHQUFHLEVBQUUsTUFBTSxHQUFHLEVBQUU7UUFDaEIsSUFBSSxFQUFFLE9BQU8sR0FBRyxFQUFFO0tBQ25CLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IFMzIH0gZnJvbSAnYXdzLXNkayc7XG5cbmNvbnN0IHMzID0gbmV3IFMzKCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50KTogUHJvbWlzZTx2b2lkPiB7XG4gIHN3aXRjaCAoZXZlbnQuUmVxdWVzdFR5cGUpIHtcbiAgICBjYXNlICdDcmVhdGUnOlxuICAgICAgaWYgKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5GYWlsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGluZyBvbiByZXF1ZXN0IScpO1xuICAgICAgfVxuICAgICAgY29uc3QgYnVja2V0TmFtZSA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5CdWNrZXROYW1lO1xuICAgICAgaWYgKCFidWNrZXROYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBCdWNrZXROYW1lJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHV0T2JqZWN0cyhidWNrZXROYW1lKTtcbiAgICBjYXNlICdVcGRhdGUnOlxuICAgIGNhc2UgJ0RlbGV0ZSc6XG4gICAgICByZXR1cm47XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gcHV0T2JqZWN0cyhidWNrZXROYW1lOiBzdHJpbmcsIG4gPSA1KSB7XG4gIC8vIFB1dCBuIG9iamVjdHMgaW4gcGFyYWxsZWxcbiAgYXdhaXQgUHJvbWlzZS5hbGwoWy4uLkFycmF5KG4pLmtleXMoKV1cbiAgICAubWFwKGtleSA9PiBzMy5wdXRPYmplY3Qoe1xuICAgICAgQnVja2V0OiBidWNrZXROYW1lLFxuICAgICAgS2V5OiBgS2V5JHtrZXl9YCxcbiAgICAgIEJvZHk6IGBCb2R5JHtrZXl9YCxcbiAgICB9KS5wcm9taXNlKCkpKTtcbn1cbiJdfQ==