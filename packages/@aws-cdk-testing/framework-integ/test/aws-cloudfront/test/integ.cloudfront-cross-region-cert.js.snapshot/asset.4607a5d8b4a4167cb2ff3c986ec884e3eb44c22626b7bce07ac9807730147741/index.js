"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
/*eslint-disable no-console*/
/* eslint-disable import/no-extraneous-dependencies */
const aws_sdk_1 = require("aws-sdk");
async function handler(event) {
    const props = event.ResourceProperties.ReaderProps;
    const imports = props.imports;
    const importNames = Object.keys(imports);
    const keyName = `aws-cdk:strong-ref:${props.prefix}`;
    const ssm = new aws_sdk_1.SSM({ region: props.region });
    try {
        switch (event.RequestType) {
            case 'Create':
                console.info('Tagging SSM Parameter imports');
                await addTags(ssm, importNames, keyName);
                break;
            case 'Update':
                const oldProps = event.OldResourceProperties.ReaderProps;
                const oldExports = oldProps.imports;
                const newExports = except(importNames, Object.keys(oldExports));
                const paramsToRelease = except(Object.keys(oldExports), importNames);
                console.info('Releasing unused SSM Parameter imports');
                if (Object.keys(paramsToRelease).length > 0) {
                    await removeTags(ssm, paramsToRelease, keyName);
                }
                console.info('Tagging new SSM Parameter imports');
                await addTags(ssm, newExports, keyName);
                break;
            case 'Delete':
                console.info('Releasing all SSM Parameter exports by removing tags');
                await removeTags(ssm, importNames, keyName);
                return;
        }
    }
    catch (e) {
        console.error('Error importing cross region stack exports: ', e);
        throw e;
    }
    console.info('returning imports: ', JSON.stringify(imports));
    return {
        Data: imports,
    };
}
exports.handler = handler;
;
/**
 * Add tag to parameters for existing exports
 */
async function addTags(ssm, parameters, keyName) {
    await Promise.all(parameters.map(async (name) => {
        try {
            return await ssm.addTagsToResource({
                ResourceId: name,
                ResourceType: 'Parameter',
                Tags: [{
                        Key: keyName,
                        Value: 'true',
                    }],
            }).promise();
        }
        catch (e) {
            throw new Error(`Error importing ${name}: ${e}`);
        }
    }));
}
/**
 * Remove tags from parameters
 */
async function removeTags(ssm, parameters, keyName) {
    await Promise.all(parameters.map(async (name) => {
        try {
            return await ssm.removeTagsFromResource({
                TagKeys: [keyName],
                ResourceType: 'Parameter',
                ResourceId: name,
            }).promise();
        }
        catch (e) {
            switch (e.code) {
                // if the parameter doesn't exist then there is nothing to release
                case 'InvalidResourceId':
                    return;
                default:
                    throw new Error(`Error releasing import ${name}: ${e}`);
            }
        }
    }));
}
/**
 * Return only the items from source that do not exist in the filter
 *
 * @param source the source object to perform the filter on
 * @param filter filter out items that exist in this object
 */
function except(source, filter) {
    return source.filter(key => !filter.includes(key));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0Isc0RBQXNEO0FBQ3RELHFDQUE4QjtBQUd2QixLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtEO0lBQzlFLE1BQU0sS0FBSyxHQUF3QixLQUFLLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDO0lBQ3hFLE1BQU0sT0FBTyxHQUF1QixLQUFLLENBQUMsT0FBNkIsQ0FBQztJQUN4RSxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pDLE1BQU0sT0FBTyxHQUFXLHNCQUFzQixLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFN0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxhQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDOUMsSUFBSTtRQUNGLFFBQVEsS0FBSyxDQUFDLFdBQVcsRUFBRTtZQUN6QixLQUFLLFFBQVE7Z0JBQ1gsT0FBTyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO2dCQUM5QyxNQUFNLE9BQU8sQ0FBQyxHQUFHLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN6QyxNQUFNO1lBQ1IsS0FBSyxRQUFRO2dCQUNYLE1BQU0sUUFBUSxHQUF3QixLQUFLLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDO2dCQUM5RSxNQUFNLFVBQVUsR0FBdUIsUUFBUSxDQUFDLE9BQTZCLENBQUM7Z0JBQzlFLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNoRSxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztn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LCJzb3VyY2VzQ29udGVudCI6WyIvKmVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUqL1xuLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzICovXG5pbXBvcnQgeyBTU00gfSBmcm9tICdhd3Mtc2RrJztcbmltcG9ydCB7IEV4cG9ydFJlYWRlckNSUHJvcHMsIENyb3NzUmVnaW9uRXhwb3J0cyB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQpIHtcbiAgY29uc3QgcHJvcHM6IEV4cG9ydFJlYWRlckNSUHJvcHMgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuUmVhZGVyUHJvcHM7XG4gIGNvbnN0IGltcG9ydHM6IENyb3NzUmVnaW9uRXhwb3J0cyA9IHByb3BzLmltcG9ydHMgYXMgQ3Jvc3NSZWdpb25FeHBvcnRzO1xuICBjb25zdCBpbXBvcnROYW1lcyA9IE9iamVjdC5rZXlzKGltcG9ydHMpO1xuICBjb25zdCBrZXlOYW1lOiBzdHJpbmcgPSBgYXdzLWNkazpzdHJvbmctcmVmOiR7cHJvcHMucHJlZml4fWA7XG5cbiAgY29uc3Qgc3NtID0gbmV3IFNTTSh7IHJlZ2lvbjogcHJvcHMucmVnaW9uIH0pO1xuICB0cnkge1xuICAgIHN3aXRjaCAoZXZlbnQuUmVxdWVzdFR5cGUpIHtcbiAgICAgIGNhc2UgJ0NyZWF0ZSc6XG4gICAgICAgIGNvbnNvbGUuaW5mbygnVGFnZ2luZyBTU00gUGFyYW1ldGVyIGltcG9ydHMnKTtcbiAgICAgICAgYXdhaXQgYWRkVGFncyhzc20sIGltcG9ydE5hbWVzLCBrZXlOYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdVcGRhdGUnOlxuICAgICAgICBjb25zdCBvbGRQcm9wczogRXhwb3J0UmVhZGVyQ1JQcm9wcyA9IGV2ZW50Lk9sZFJlc291cmNlUHJvcGVydGllcy5SZWFkZXJQcm9wcztcbiAgICAgICAgY29uc3Qgb2xkRXhwb3J0czogQ3Jvc3NSZWdpb25FeHBvcnRzID0gb2xkUHJvcHMuaW1wb3J0cyBhcyBDcm9zc1JlZ2lvbkV4cG9ydHM7XG4gICAgICAgIGNvbnN0IG5ld0V4cG9ydHMgPSBleGNlcHQoaW1wb3J0TmFtZXMsIE9iamVjdC5rZXlzKG9sZEV4cG9ydHMpKTtcbiAgICAgICAgY29uc3QgcGFyYW1zVG9SZWxlYXNlID0gZXhjZXB0KE9iamVjdC5rZXlzKG9sZEV4cG9ydHMpLCBpbXBvcnROYW1lcyk7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnUmVsZWFzaW5nIHVudXNlZCBTU00gUGFyYW1ldGVyIGltcG9ydHMnKTtcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHBhcmFtc1RvUmVsZWFzZSkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGF3YWl0IHJlbW92ZVRhZ3Moc3NtLCBwYXJhbXNUb1JlbGVhc2UsIGtleU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUuaW5mbygnVGFnZ2luZyBuZXcgU1NNIFBhcmFtZXRlciBpbXBvcnRzJyk7XG4gICAgICAgIGF3YWl0IGFkZFRhZ3Moc3NtLCBuZXdFeHBvcnRzLCBrZXlOYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdEZWxldGUnOlxuICAgICAgICBjb25zb2xlLmluZm8oJ1JlbGVhc2luZyBhbGwgU1NNIFBhcmFtZXRlciBleHBvcnRzIGJ5IHJlbW92aW5nIHRhZ3MnKTtcbiAgICAgICAgYXdhaXQgcmVtb3ZlVGFncyhzc20sIGltcG9ydE5hbWVzLCBrZXlOYW1lKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGltcG9ydGluZyBjcm9zcyByZWdpb24gc3RhY2sgZXhwb3J0czogJywgZSk7XG4gICAgdGhyb3cgZTtcbiAgfVxuICBjb25zb2xlLmluZm8oJ3JldHVybmluZyBpbXBvcnRzOiAnLCBKU09OLnN0cmluZ2lmeShpbXBvcnRzKSk7XG4gIHJldHVybiB7XG4gICAgRGF0YTogaW1wb3J0cyxcbiAgfTtcbn07XG5cbi8qKlxuICogQWRkIHRhZyB0byBwYXJhbWV0ZXJzIGZvciBleGlzdGluZyBleHBvcnRzXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGFkZFRhZ3Moc3NtOiBTU00sIHBhcmFtZXRlcnM6IHN0cmluZ1tdLCBrZXlOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgUHJvbWlzZS5hbGwocGFyYW1ldGVycy5tYXAoYXN5bmMgbmFtZSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBzc20uYWRkVGFnc1RvUmVzb3VyY2Uoe1xuICAgICAgICBSZXNvdXJjZUlkOiBuYW1lLFxuICAgICAgICBSZXNvdXJjZVR5cGU6ICdQYXJhbWV0ZXInLFxuICAgICAgICBUYWdzOiBbe1xuICAgICAgICAgIEtleToga2V5TmFtZSxcbiAgICAgICAgICBWYWx1ZTogJ3RydWUnLFxuICAgICAgICB9XSxcbiAgICAgIH0pLnByb21pc2UoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIGltcG9ydGluZyAke25hbWV9OiAke2V9YCk7XG4gICAgfVxuICB9KSk7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRhZ3MgZnJvbSBwYXJhbWV0ZXJzXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZVRhZ3Moc3NtOiBTU00sIHBhcmFtZXRlcnM6IHN0cmluZ1tdLCBrZXlOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgUHJvbWlzZS5hbGwocGFyYW1ldGVycy5tYXAoYXN5bmMgbmFtZSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBzc20ucmVtb3ZlVGFnc0Zyb21SZXNvdXJjZSh7XG4gICAgICAgIFRhZ0tleXM6IFtrZXlOYW1lXSxcbiAgICAgICAgUmVzb3VyY2VUeXBlOiAnUGFyYW1ldGVyJyxcbiAgICAgICAgUmVzb3VyY2VJZDogbmFtZSxcbiAgICAgIH0pLnByb21pc2UoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzd2l0Y2ggKGUuY29kZSkge1xuICAgICAgICAvLyBpZiB0aGUgcGFyYW1ldGVyIGRvZXNuJ3QgZXhpc3QgdGhlbiB0aGVyZSBpcyBub3RoaW5nIHRvIHJlbGVhc2VcbiAgICAgICAgY2FzZSAnSW52YWxpZFJlc291cmNlSWQnOlxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIHJlbGVhc2luZyBpbXBvcnQgJHtuYW1lfTogJHtlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfSkpO1xufVxuXG4vKipcbiAqIFJldHVybiBvbmx5IHRoZSBpdGVtcyBmcm9tIHNvdXJjZSB0aGF0IGRvIG5vdCBleGlzdCBpbiB0aGUgZmlsdGVyXG4gKlxuICogQHBhcmFtIHNvdXJjZSB0aGUgc291cmNlIG9iamVjdCB0byBwZXJmb3JtIHRoZSBmaWx0ZXIgb25cbiAqIEBwYXJhbSBmaWx0ZXIgZmlsdGVyIG91dCBpdGVtcyB0aGF0IGV4aXN0IGluIHRoaXMgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGV4Y2VwdChzb3VyY2U6IHN0cmluZ1tdLCBmaWx0ZXI6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICByZXR1cm4gc291cmNlLmZpbHRlcihrZXkgPT4gIWZpbHRlci5pbmNsdWRlcyhrZXkpKTtcbn1cbiJdfQ==