"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
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
exports.handler = handler;
async function putObjects(bucketName, n = 5) {
    // Put n objects in parallel
    await Promise.all([...Array(n).keys()]
        .map(key => s3.putObject({
        Bucket: bucketName,
        Key: `Key${key}`,
        Body: `Body${key}`,
    })));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2REFBNkQ7QUFDN0Qsa0RBQXdDO0FBRXhDLE1BQU0sRUFBRSxHQUFHLElBQUksY0FBRSxFQUFFLENBQUM7QUFFYixLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtEO0lBQzlFLFFBQVEsS0FBSyxDQUFDLFdBQVcsRUFBRTtRQUN6QixLQUFLLFFBQVE7WUFDWCxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUU7Z0JBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQzthQUN4QztZQUNELE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7WUFDdkQsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDZixNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUM7YUFDdkM7WUFDRCxPQUFPLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoQyxLQUFLLFFBQVEsQ0FBQztRQUNkLEtBQUssUUFBUTtZQUNYLE9BQU87S0FDVjtBQUNILENBQUM7QUFmRCwwQkFlQztBQUVELEtBQUssVUFBVSxVQUFVLENBQUMsVUFBa0IsRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUNqRCw0QkFBNEI7SUFDNUIsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDbkMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQztRQUN2QixNQUFNLEVBQUUsVUFBVTtRQUNsQixHQUFHLEVBQUUsTUFBTSxHQUFHLEVBQUU7UUFDaEIsSUFBSSxFQUFFLE9BQU8sR0FBRyxFQUFFO0tBQ25CLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDVCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgUzMgfSBmcm9tICdAYXdzLXNkay9jbGllbnQtczMnO1xuXG5jb25zdCBzMyA9IG5ldyBTMygpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCk6IFByb21pc2U8dm9pZD4ge1xuICBzd2l0Y2ggKGV2ZW50LlJlcXVlc3RUeXBlKSB7XG4gICAgY2FzZSAnQ3JlYXRlJzpcbiAgICAgIGlmIChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuRmFpbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxpbmcgb24gcmVxdWVzdCEnKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGJ1Y2tldE5hbWUgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQnVja2V0TmFtZTtcbiAgICAgIGlmICghYnVja2V0TmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgQnVja2V0TmFtZScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHB1dE9iamVjdHMoYnVja2V0TmFtZSk7XG4gICAgY2FzZSAnVXBkYXRlJzpcbiAgICBjYXNlICdEZWxldGUnOlxuICAgICAgcmV0dXJuO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHB1dE9iamVjdHMoYnVja2V0TmFtZTogc3RyaW5nLCBuID0gNSkge1xuICAvLyBQdXQgbiBvYmplY3RzIGluIHBhcmFsbGVsXG4gIGF3YWl0IFByb21pc2UuYWxsKFsuLi5BcnJheShuKS5rZXlzKCldXG4gICAgLm1hcChrZXkgPT4gczMucHV0T2JqZWN0KHtcbiAgICAgIEJ1Y2tldDogYnVja2V0TmFtZSxcbiAgICAgIEtleTogYEtleSR7a2V5fWAsXG4gICAgICBCb2R5OiBgQm9keSR7a2V5fWAsXG4gICAgfSkpKTtcbn1cbiJdfQ==