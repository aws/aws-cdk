"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// eslint-disable-next-line import/no-extraneous-dependencies
const aws_sdk_1 = require("aws-sdk");
const AUTO_DELETE_OBJECTS_TAG = 'aws-cdk:auto-delete-objects';
const s3 = new aws_sdk_1.S3();
async function handler(event) {
    var _a;
    switch (event.RequestType) {
        case 'Create':
            return;
        case 'Update':
            return onUpdate(event);
        case 'Delete':
            return onDelete((_a = event.ResourceProperties) === null || _a === void 0 ? void 0 : _a.BucketName);
    }
}
exports.handler = handler;
async function onUpdate(event) {
    var _a, _b;
    const updateEvent = event;
    const oldBucketName = (_a = updateEvent.OldResourceProperties) === null || _a === void 0 ? void 0 : _a.BucketName;
    const newBucketName = (_b = updateEvent.ResourceProperties) === null || _b === void 0 ? void 0 : _b.BucketName;
    const bucketNameHasChanged = newBucketName != null && oldBucketName != null && newBucketName !== oldBucketName;
    /* If the name of the bucket has changed, CloudFormation will try to delete the bucket
       and create a new one with the new name. So we have to delete the contents of the
       bucket so that this operation does not fail. */
    if (bucketNameHasChanged) {
        return onDelete(oldBucketName);
    }
}
/**
 * Recursively delete all items in the bucket
 *
 * @param bucketName the bucket name
 */
async function emptyBucket(bucketName) {
    var _a, _b;
    const listedObjects = await s3.listObjectVersions({ Bucket: bucketName }).promise();
    const contents = [...(_a = listedObjects.Versions) !== null && _a !== void 0 ? _a : [], ...(_b = listedObjects.DeleteMarkers) !== null && _b !== void 0 ? _b : []];
    if (contents.length === 0) {
        return;
    }
    const records = contents.map((record) => ({ Key: record.Key, VersionId: record.VersionId }));
    await s3.deleteObjects({ Bucket: bucketName, Delete: { Objects: records } }).promise();
    if (listedObjects === null || listedObjects === void 0 ? void 0 : listedObjects.IsTruncated) {
        await emptyBucket(bucketName);
    }
}
async function onDelete(bucketName) {
    if (!bucketName) {
        throw new Error('No BucketName was provided.');
    }
    if (!await isBucketTaggedForDeletion(bucketName)) {
        process.stdout.write(`Bucket does not have '${AUTO_DELETE_OBJECTS_TAG}' tag, skipping cleaning.\n`);
        return;
    }
    try {
        await emptyBucket(bucketName);
    }
    catch (e) {
        if (e.code !== 'NoSuchBucket') {
            throw e;
        }
        // Bucket doesn't exist. Ignoring
    }
}
/**
 * The bucket will only be tagged for deletion if it's being deleted in the same
 * deployment as this Custom Resource.
 *
 * If the Custom Resource is every deleted before the bucket, it must be because
 * `autoDeleteObjects` has been switched to false, in which case the tag would have
 * been removed before we get to this Delete event.
 */
async function isBucketTaggedForDeletion(bucketName) {
    const response = await s3.getBucketTagging({ Bucket: bucketName }).promise();
    return response.TagSet.some(tag => tag.Key === AUTO_DELETE_OBJECTS_TAG && tag.Value === 'true');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2REFBNkQ7QUFDN0QscUNBQTZCO0FBRTdCLE1BQU0sdUJBQXVCLEdBQUcsNkJBQTZCLENBQUM7QUFFOUQsTUFBTSxFQUFFLEdBQUcsSUFBSSxZQUFFLEVBQUUsQ0FBQztBQUViLEtBQUssVUFBVSxPQUFPLENBQUMsS0FBa0Q7O0lBQzlFLFFBQVEsS0FBSyxDQUFDLFdBQVcsRUFBRTtRQUN6QixLQUFLLFFBQVE7WUFDWCxPQUFPO1FBQ1QsS0FBSyxRQUFRO1lBQ1gsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsS0FBSyxRQUFRO1lBQ1gsT0FBTyxRQUFRLE9BQUMsS0FBSyxDQUFDLGtCQUFrQiwwQ0FBRSxVQUFVLENBQUMsQ0FBQztLQUN6RDtBQUNILENBQUM7QUFURCwwQkFTQztBQUVELEtBQUssVUFBVSxRQUFRLENBQUMsS0FBa0Q7O0lBQ3hFLE1BQU0sV0FBVyxHQUFHLEtBQTBELENBQUM7SUFDL0UsTUFBTSxhQUFhLFNBQUcsV0FBVyxDQUFDLHFCQUFxQiwwQ0FBRSxVQUFVLENBQUM7SUFDcEUsTUFBTSxhQUFhLFNBQUcsV0FBVyxDQUFDLGtCQUFrQiwwQ0FBRSxVQUFVLENBQUM7SUFDakUsTUFBTSxvQkFBb0IsR0FBRyxhQUFhLElBQUksSUFBSSxJQUFJLGFBQWEsSUFBSSxJQUFJLElBQUksYUFBYSxLQUFLLGFBQWEsQ0FBQztJQUUvRzs7c0RBRWtEO0lBQ2xELElBQUksb0JBQW9CLEVBQUU7UUFDeEIsT0FBTyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDaEM7QUFDSCxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILEtBQUssVUFBVSxXQUFXLENBQUMsVUFBa0I7O0lBQzNDLE1BQU0sYUFBYSxHQUFHLE1BQU0sRUFBRSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDcEYsTUFBTSxRQUFRLEdBQUcsQ0FBQyxTQUFHLGFBQWEsQ0FBQyxRQUFRLG1DQUFJLEVBQUUsRUFBRSxTQUFHLGFBQWEsQ0FBQyxhQUFhLG1DQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3pGLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDekIsT0FBTztLQUNSO0lBRUQsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQVcsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2xHLE1BQU0sRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUV2RixJQUFJLGFBQWEsYUFBYixhQUFhLHVCQUFiLGFBQWEsQ0FBRSxXQUFXLEVBQUU7UUFDOUIsTUFBTSxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDL0I7QUFDSCxDQUFDO0FBRUQsS0FBSyxVQUFVLFFBQVEsQ0FBQyxVQUFtQjtJQUN6QyxJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0tBQ2hEO0lBQ0QsSUFBSSxDQUFDLE1BQU0seUJBQXlCLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFDaEQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMseUJBQXlCLHVCQUF1Qiw2QkFBNkIsQ0FBQyxDQUFDO1FBQ3BHLE9BQU87S0FDUjtJQUNELElBQUk7UUFDRixNQUFNLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUMvQjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLGNBQWMsRUFBRTtZQUM3QixNQUFNLENBQUMsQ0FBQztTQUNUO1FBQ0QsaUNBQWlDO0tBQ2xDO0FBQ0gsQ0FBQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxLQUFLLFVBQVUseUJBQXlCLENBQUMsVUFBa0I7SUFDekQsTUFBTSxRQUFRLEdBQUcsTUFBTSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3RSxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyx1QkFBdUIsSUFBSSxHQUFHLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQyxDQUFDO0FBQ2xHLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBTMyB9IGZyb20gJ2F3cy1zZGsnO1xuXG5jb25zdCBBVVRPX0RFTEVURV9PQkpFQ1RTX1RBRyA9ICdhd3MtY2RrOmF1dG8tZGVsZXRlLW9iamVjdHMnO1xuXG5jb25zdCBzMyA9IG5ldyBTMygpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCkge1xuICBzd2l0Y2ggKGV2ZW50LlJlcXVlc3RUeXBlKSB7XG4gICAgY2FzZSAnQ3JlYXRlJzpcbiAgICAgIHJldHVybjtcbiAgICBjYXNlICdVcGRhdGUnOlxuICAgICAgcmV0dXJuIG9uVXBkYXRlKGV2ZW50KTtcbiAgICBjYXNlICdEZWxldGUnOlxuICAgICAgcmV0dXJuIG9uRGVsZXRlKGV2ZW50LlJlc291cmNlUHJvcGVydGllcz8uQnVja2V0TmFtZSk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gb25VcGRhdGUoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQpIHtcbiAgY29uc3QgdXBkYXRlRXZlbnQgPSBldmVudCBhcyBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZVVwZGF0ZUV2ZW50O1xuICBjb25zdCBvbGRCdWNrZXROYW1lID0gdXBkYXRlRXZlbnQuT2xkUmVzb3VyY2VQcm9wZXJ0aWVzPy5CdWNrZXROYW1lO1xuICBjb25zdCBuZXdCdWNrZXROYW1lID0gdXBkYXRlRXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzPy5CdWNrZXROYW1lO1xuICBjb25zdCBidWNrZXROYW1lSGFzQ2hhbmdlZCA9IG5ld0J1Y2tldE5hbWUgIT0gbnVsbCAmJiBvbGRCdWNrZXROYW1lICE9IG51bGwgJiYgbmV3QnVja2V0TmFtZSAhPT0gb2xkQnVja2V0TmFtZTtcblxuICAvKiBJZiB0aGUgbmFtZSBvZiB0aGUgYnVja2V0IGhhcyBjaGFuZ2VkLCBDbG91ZEZvcm1hdGlvbiB3aWxsIHRyeSB0byBkZWxldGUgdGhlIGJ1Y2tldFxuICAgICBhbmQgY3JlYXRlIGEgbmV3IG9uZSB3aXRoIHRoZSBuZXcgbmFtZS4gU28gd2UgaGF2ZSB0byBkZWxldGUgdGhlIGNvbnRlbnRzIG9mIHRoZVxuICAgICBidWNrZXQgc28gdGhhdCB0aGlzIG9wZXJhdGlvbiBkb2VzIG5vdCBmYWlsLiAqL1xuICBpZiAoYnVja2V0TmFtZUhhc0NoYW5nZWQpIHtcbiAgICByZXR1cm4gb25EZWxldGUob2xkQnVja2V0TmFtZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZWN1cnNpdmVseSBkZWxldGUgYWxsIGl0ZW1zIGluIHRoZSBidWNrZXRcbiAqXG4gKiBAcGFyYW0gYnVja2V0TmFtZSB0aGUgYnVja2V0IG5hbWVcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZW1wdHlCdWNrZXQoYnVja2V0TmFtZTogc3RyaW5nKSB7XG4gIGNvbnN0IGxpc3RlZE9iamVjdHMgPSBhd2FpdCBzMy5saXN0T2JqZWN0VmVyc2lvbnMoeyBCdWNrZXQ6IGJ1Y2tldE5hbWUgfSkucHJvbWlzZSgpO1xuICBjb25zdCBjb250ZW50cyA9IFsuLi5saXN0ZWRPYmplY3RzLlZlcnNpb25zID8/IFtdLCAuLi5saXN0ZWRPYmplY3RzLkRlbGV0ZU1hcmtlcnMgPz8gW11dO1xuICBpZiAoY29udGVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcmVjb3JkcyA9IGNvbnRlbnRzLm1hcCgocmVjb3JkOiBhbnkpID0+ICh7IEtleTogcmVjb3JkLktleSwgVmVyc2lvbklkOiByZWNvcmQuVmVyc2lvbklkIH0pKTtcbiAgYXdhaXQgczMuZGVsZXRlT2JqZWN0cyh7IEJ1Y2tldDogYnVja2V0TmFtZSwgRGVsZXRlOiB7IE9iamVjdHM6IHJlY29yZHMgfSB9KS5wcm9taXNlKCk7XG5cbiAgaWYgKGxpc3RlZE9iamVjdHM/LklzVHJ1bmNhdGVkKSB7XG4gICAgYXdhaXQgZW1wdHlCdWNrZXQoYnVja2V0TmFtZSk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gb25EZWxldGUoYnVja2V0TmFtZT86IHN0cmluZykge1xuICBpZiAoIWJ1Y2tldE5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIEJ1Y2tldE5hbWUgd2FzIHByb3ZpZGVkLicpO1xuICB9XG4gIGlmICghYXdhaXQgaXNCdWNrZXRUYWdnZWRGb3JEZWxldGlvbihidWNrZXROYW1lKSkge1xuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGBCdWNrZXQgZG9lcyBub3QgaGF2ZSAnJHtBVVRPX0RFTEVURV9PQkpFQ1RTX1RBR30nIHRhZywgc2tpcHBpbmcgY2xlYW5pbmcuXFxuYCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRyeSB7XG4gICAgYXdhaXQgZW1wdHlCdWNrZXQoYnVja2V0TmFtZSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoZS5jb2RlICE9PSAnTm9TdWNoQnVja2V0Jykge1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gICAgLy8gQnVja2V0IGRvZXNuJ3QgZXhpc3QuIElnbm9yaW5nXG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgYnVja2V0IHdpbGwgb25seSBiZSB0YWdnZWQgZm9yIGRlbGV0aW9uIGlmIGl0J3MgYmVpbmcgZGVsZXRlZCBpbiB0aGUgc2FtZVxuICogZGVwbG95bWVudCBhcyB0aGlzIEN1c3RvbSBSZXNvdXJjZS5cbiAqXG4gKiBJZiB0aGUgQ3VzdG9tIFJlc291cmNlIGlzIGV2ZXJ5IGRlbGV0ZWQgYmVmb3JlIHRoZSBidWNrZXQsIGl0IG11c3QgYmUgYmVjYXVzZVxuICogYGF1dG9EZWxldGVPYmplY3RzYCBoYXMgYmVlbiBzd2l0Y2hlZCB0byBmYWxzZSwgaW4gd2hpY2ggY2FzZSB0aGUgdGFnIHdvdWxkIGhhdmVcbiAqIGJlZW4gcmVtb3ZlZCBiZWZvcmUgd2UgZ2V0IHRvIHRoaXMgRGVsZXRlIGV2ZW50LlxuICovXG5hc3luYyBmdW5jdGlvbiBpc0J1Y2tldFRhZ2dlZEZvckRlbGV0aW9uKGJ1Y2tldE5hbWU6IHN0cmluZykge1xuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHMzLmdldEJ1Y2tldFRhZ2dpbmcoeyBCdWNrZXQ6IGJ1Y2tldE5hbWUgfSkucHJvbWlzZSgpO1xuICByZXR1cm4gcmVzcG9uc2UuVGFnU2V0LnNvbWUodGFnID0+IHRhZy5LZXkgPT09IEFVVE9fREVMRVRFX09CSkVDVFNfVEFHICYmIHRhZy5WYWx1ZSA9PT0gJ3RydWUnKTtcbn0iXX0=