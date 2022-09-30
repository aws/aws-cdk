"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
/*eslint-disable no-console*/
/* eslint-disable import/no-extraneous-dependencies */
const aws_sdk_1 = require("aws-sdk");
async function handler(event) {
    const props = event.ResourceProperties;
    const imports = props.Imports;
    const keyName = `cdk-strong-ref:${props.StackName}`;
    const ssm = new aws_sdk_1.SSM({ region: props.Region });
    try {
        switch (event.RequestType) {
            case 'Create':
                console.info('Tagging SSM Parameter imports');
                await addTags(ssm, imports, keyName);
                return;
            case 'Update':
                const oldProps = event.OldResourceProperties;
                const oldExports = oldProps.Imports;
                const newExports = filterExports(imports, oldExports);
                const paramsToDelete = filterExports(oldExports, imports);
                console.info('Releasing unused SSM Parameter imports');
                if (Object.keys(paramsToDelete).length > 0) {
                    await removeTags(ssm, paramsToDelete, keyName);
                }
                console.info('Tagging new SSM Parameter imports');
                await addTags(ssm, newExports, keyName);
                return;
            case 'Delete':
                console.info('Deleting all SSM Parameter exports');
                await deleteParametersByPath(ssm, `/cdk/exports/${props.StackName}/`);
                return;
            default:
                return;
        }
    }
    catch (e) {
        console.error('Error importing cross region stack exports: ', e);
        throw e;
    }
}
exports.handler = handler;
;
/**
 * Add tag to parameters for existing exports
 */
async function addTags(ssm, parameters, keyName) {
    await Promise.all(parameters.map(async (name) => {
        try {
            return ssm.addTagsToResource({
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
            return ssm.removeTagsFromResource({
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
 * Get all parameters in a given path
 *
 * If the request fails for any reason it will fail the custom resource event.
 * Since this is only run when the resource is deleted that is probably the behavior
 * that is desired.
 */
async function getParametersByPath(ssm, path, nextToken) {
    const parameters = [];
    return ssm.getParametersByPath({
        Path: path,
        NextToken: nextToken,
    }).promise().then(async (getParametersByPathResult) => {
        parameters.push(...getParametersByPathResult.Parameters ?? []);
        if (getParametersByPathResult.NextToken) {
            parameters.push(...await getParametersByPath(ssm, path, getParametersByPathResult.NextToken));
        }
        return parameters;
    });
}
/**
 * Delete all parameters in a give path
 */
async function deleteParametersByPath(ssm, path) {
    const allParams = await getParametersByPath(ssm, path);
    const names = allParams.map(param => param.Name).filter(x => !!x);
    await ssm.deleteParameters({
        Names: names,
    }).promise();
}
/**
 * Return only the items from source that do not exist in the filter
 *
 * @param source the source object to perform the filter on
 * @param filter filter out items that exist in this object
 */
function filterExports(source, filter) {
    return source.filter(key => !filter.includes(key));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0Isc0RBQXNEO0FBQ3RELHFDQUE4QjtBQUV2QixLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtEO0lBQzlFLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQztJQUN2QyxNQUFNLE9BQU8sR0FBYSxLQUFLLENBQUMsT0FBTyxDQUFDO0lBQ3hDLE1BQU0sT0FBTyxHQUFXLGtCQUFrQixLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7SUFFNUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxhQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDOUMsSUFBSTtRQUNGLFFBQVEsS0FBSyxDQUFDLFdBQVcsRUFBRTtZQUN6QixLQUFLLFFBQVE7Z0JBQ1gsT0FBTyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO2dCQUM5QyxNQUFNLE9BQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNyQyxPQUFPO1lBQ1QsS0FBSyxRQUFRO2dCQUNYLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQztnQkFDN0MsTUFBTSxVQUFVLEdBQWEsUUFBUSxDQUFDLE9BQU8sQ0FBQztnQkFDOUMsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDdEQsTUFBTSxjQUFjLEdBQUcsYUFBYSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDMUQsT0FBTyxDQUFDLElBQUksQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO2dCQUN2RCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDMUMsTUFBTSxVQUFVLENBQUMs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QUMsR0FBRyxFQUFFLElBQUksRUFBRSx5QkFBeUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1NBQy9GO1FBQ0MsT0FBTyxVQUFVLENBQUM7SUFDdEIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxLQUFLLFVBQVUsc0JBQXNCLENBQUMsR0FBUSxFQUFFLElBQVk7SUFDMUQsTUFBTSxTQUFTLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdkQsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFhLENBQUM7SUFDOUUsTUFBTSxHQUFHLENBQUMsZ0JBQWdCLENBQUM7UUFDekIsS0FBSyxFQUFFLEtBQUs7S0FDYixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDZixDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFTLGFBQWEsQ0FBQyxNQUFnQixFQUFFLE1BQWdCO0lBQ3ZELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3JELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKmVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUqL1xuLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzICovXG5pbXBvcnQgeyBTU00gfSBmcm9tICdhd3Mtc2RrJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQpIHtcbiAgY29uc3QgcHJvcHMgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXM7XG4gIGNvbnN0IGltcG9ydHM6IHN0cmluZ1tdID0gcHJvcHMuSW1wb3J0cztcbiAgY29uc3Qga2V5TmFtZTogc3RyaW5nID0gYGNkay1zdHJvbmctcmVmOiR7cHJvcHMuU3RhY2tOYW1lfWA7XG5cbiAgY29uc3Qgc3NtID0gbmV3IFNTTSh7IHJlZ2lvbjogcHJvcHMuUmVnaW9uIH0pO1xuICB0cnkge1xuICAgIHN3aXRjaCAoZXZlbnQuUmVxdWVzdFR5cGUpIHtcbiAgICAgIGNhc2UgJ0NyZWF0ZSc6XG4gICAgICAgIGNvbnNvbGUuaW5mbygnVGFnZ2luZyBTU00gUGFyYW1ldGVyIGltcG9ydHMnKTtcbiAgICAgICAgYXdhaXQgYWRkVGFncyhzc20sIGltcG9ydHMsIGtleU5hbWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlICdVcGRhdGUnOlxuICAgICAgICBjb25zdCBvbGRQcm9wcyA9IGV2ZW50Lk9sZFJlc291cmNlUHJvcGVydGllcztcbiAgICAgICAgY29uc3Qgb2xkRXhwb3J0czogc3RyaW5nW10gPSBvbGRQcm9wcy5JbXBvcnRzO1xuICAgICAgICBjb25zdCBuZXdFeHBvcnRzID0gZmlsdGVyRXhwb3J0cyhpbXBvcnRzLCBvbGRFeHBvcnRzKTtcbiAgICAgICAgY29uc3QgcGFyYW1zVG9EZWxldGUgPSBmaWx0ZXJFeHBvcnRzKG9sZEV4cG9ydHMsIGltcG9ydHMpO1xuICAgICAgICBjb25zb2xlLmluZm8oJ1JlbGVhc2luZyB1bnVzZWQgU1NNIFBhcmFtZXRlciBpbXBvcnRzJyk7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhwYXJhbXNUb0RlbGV0ZSkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGF3YWl0IHJlbW92ZVRhZ3Moc3NtLCBwYXJhbXNUb0RlbGV0ZSwga2V5TmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5pbmZvKCdUYWdnaW5nIG5ldyBTU00gUGFyYW1ldGVyIGltcG9ydHMnKTtcbiAgICAgICAgYXdhaXQgYWRkVGFncyhzc20sIG5ld0V4cG9ydHMsIGtleU5hbWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlICdEZWxldGUnOlxuICAgICAgICBjb25zb2xlLmluZm8oJ0RlbGV0aW5nIGFsbCBTU00gUGFyYW1ldGVyIGV4cG9ydHMnKTtcbiAgICAgICAgYXdhaXQgZGVsZXRlUGFyYW1ldGVyc0J5UGF0aChzc20sIGAvY2RrL2V4cG9ydHMvJHtwcm9wcy5TdGFja05hbWV9L2ApO1xuICAgICAgICByZXR1cm47XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm47XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgaW1wb3J0aW5nIGNyb3NzIHJlZ2lvbiBzdGFjayBleHBvcnRzOiAnLCBlKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuXG4vKipcbiAqIEFkZCB0YWcgdG8gcGFyYW1ldGVycyBmb3IgZXhpc3RpbmcgZXhwb3J0c1xuICovXG5hc3luYyBmdW5jdGlvbiBhZGRUYWdzKHNzbTogU1NNLCBwYXJhbWV0ZXJzOiBzdHJpbmdbXSwga2V5TmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IFByb21pc2UuYWxsKHBhcmFtZXRlcnMubWFwKGFzeW5jIG5hbWUgPT4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gc3NtLmFkZFRhZ3NUb1Jlc291cmNlKHtcbiAgICAgICAgUmVzb3VyY2VJZDogbmFtZSxcbiAgICAgICAgUmVzb3VyY2VUeXBlOiAnUGFyYW1ldGVyJyxcbiAgICAgICAgVGFnczogW3tcbiAgICAgICAgICBLZXk6IGtleU5hbWUsXG4gICAgICAgICAgVmFsdWU6ICd0cnVlJyxcbiAgICAgICAgfV0sXG4gICAgICB9KS5wcm9taXNlKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciBpbXBvcnRpbmcgJHtuYW1lfTogJHtlfWApO1xuICAgIH1cbiAgfSkpO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0YWdzIGZyb20gcGFyYW1ldGVyc1xuICovXG5hc3luYyBmdW5jdGlvbiByZW1vdmVUYWdzKHNzbTogU1NNLCBwYXJhbWV0ZXJzOiBzdHJpbmdbXSwga2V5TmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IFByb21pc2UuYWxsKHBhcmFtZXRlcnMubWFwKGFzeW5jIG5hbWUgPT4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gc3NtLnJlbW92ZVRhZ3NGcm9tUmVzb3VyY2Uoe1xuICAgICAgICBUYWdLZXlzOiBba2V5TmFtZV0sXG4gICAgICAgIFJlc291cmNlVHlwZTogJ1BhcmFtZXRlcicsXG4gICAgICAgIFJlc291cmNlSWQ6IG5hbWUsXG4gICAgICB9KS5wcm9taXNlKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc3dpdGNoIChlLmNvZGUpIHtcbiAgICAgICAgLy8gaWYgdGhlIHBhcmFtZXRlciBkb2Vzbid0IGV4aXN0IHRoZW4gdGhlcmUgaXMgbm90aGluZyB0byByZWxlYXNlXG4gICAgICAgIGNhc2UgJ0ludmFsaWRSZXNvdXJjZUlkJzpcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciByZWxlYXNpbmcgaW1wb3J0ICR7bmFtZX06ICR7ZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pKTtcbn1cblxuLyoqXG4gKiBHZXQgYWxsIHBhcmFtZXRlcnMgaW4gYSBnaXZlbiBwYXRoXG4gKlxuICogSWYgdGhlIHJlcXVlc3QgZmFpbHMgZm9yIGFueSByZWFzb24gaXQgd2lsbCBmYWlsIHRoZSBjdXN0b20gcmVzb3VyY2UgZXZlbnQuXG4gKiBTaW5jZSB0aGlzIGlzIG9ubHkgcnVuIHdoZW4gdGhlIHJlc291cmNlIGlzIGRlbGV0ZWQgdGhhdCBpcyBwcm9iYWJseSB0aGUgYmVoYXZpb3JcbiAqIHRoYXQgaXMgZGVzaXJlZC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZ2V0UGFyYW1ldGVyc0J5UGF0aChzc206IFNTTSwgcGF0aDogc3RyaW5nLCBuZXh0VG9rZW4/OiBzdHJpbmcpOiBQcm9taXNlPFNTTS5QYXJhbWV0ZXJbXT4ge1xuICBjb25zdCBwYXJhbWV0ZXJzOiBTU00uUGFyYW1ldGVyW10gPSBbXTtcbiAgcmV0dXJuIHNzbS5nZXRQYXJhbWV0ZXJzQnlQYXRoKHtcbiAgICBQYXRoOiBwYXRoLFxuICAgIE5leHRUb2tlbjogbmV4dFRva2VuLFxuICB9KS5wcm9taXNlKCkudGhlbihhc3luYyBnZXRQYXJhbWV0ZXJzQnlQYXRoUmVzdWx0ID0+IHtcbiAgICBwYXJhbWV0ZXJzLnB1c2goLi4uZ2V0UGFyYW1ldGVyc0J5UGF0aFJlc3VsdC5QYXJhbWV0ZXJzID8/IFtdKTtcbiAgICBpZiAoZ2V0UGFyYW1ldGVyc0J5UGF0aFJlc3VsdC5OZXh0VG9rZW4pIHtcbiAgICAgIHBhcmFtZXRlcnMucHVzaCguLi5hd2FpdCBnZXRQYXJhbWV0ZXJzQnlQYXRoKHNzbSwgcGF0aCwgZ2V0UGFyYW1ldGVyc0J5UGF0aFJlc3VsdC5OZXh0VG9rZW4pKTtcbiAgICB9XG4gICAgICByZXR1cm4gcGFyYW1ldGVycztcbiAgfSk7XG59XG5cbi8qKlxuICogRGVsZXRlIGFsbCBwYXJhbWV0ZXJzIGluIGEgZ2l2ZSBwYXRoXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVBhcmFtZXRlcnNCeVBhdGgoc3NtOiBTU00sIHBhdGg6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBhbGxQYXJhbXMgPSBhd2FpdCBnZXRQYXJhbWV0ZXJzQnlQYXRoKHNzbSwgcGF0aCk7XG4gIGNvbnN0IG5hbWVzID0gYWxsUGFyYW1zLm1hcChwYXJhbSA9PiBwYXJhbS5OYW1lKS5maWx0ZXIoeCA9PiAhIXgpIGFzIHN0cmluZ1tdO1xuICBhd2FpdCBzc20uZGVsZXRlUGFyYW1ldGVycyh7XG4gICAgTmFtZXM6IG5hbWVzLFxuICB9KS5wcm9taXNlKCk7XG59XG5cbi8qKlxuICogUmV0dXJuIG9ubHkgdGhlIGl0ZW1zIGZyb20gc291cmNlIHRoYXQgZG8gbm90IGV4aXN0IGluIHRoZSBmaWx0ZXJcbiAqXG4gKiBAcGFyYW0gc291cmNlIHRoZSBzb3VyY2Ugb2JqZWN0IHRvIHBlcmZvcm0gdGhlIGZpbHRlciBvblxuICogQHBhcmFtIGZpbHRlciBmaWx0ZXIgb3V0IGl0ZW1zIHRoYXQgZXhpc3QgaW4gdGhpcyBvYmplY3RcbiAqL1xuZnVuY3Rpb24gZmlsdGVyRXhwb3J0cyhzb3VyY2U6IHN0cmluZ1tdLCBmaWx0ZXI6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICByZXR1cm4gc291cmNlLmZpbHRlcihrZXkgPT4gIWZpbHRlci5pbmNsdWRlcyhrZXkpKTtcbn1cbiJdfQ==