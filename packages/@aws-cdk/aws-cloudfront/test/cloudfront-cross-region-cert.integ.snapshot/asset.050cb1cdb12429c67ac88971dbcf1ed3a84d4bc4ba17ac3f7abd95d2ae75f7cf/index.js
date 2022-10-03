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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0Isc0RBQXNEO0FBQ3RELHFDQUE4QjtBQUV2QixLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtEO0lBQzlFLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQztJQUN2QyxNQUFNLE9BQU8sR0FBYSxLQUFLLENBQUMsT0FBTyxDQUFDO0lBQ3hDLE1BQU0sT0FBTyxHQUFXLGtCQUFrQixLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7SUFFNUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxhQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDOUMsSUFBSTtRQUNGLFFBQVEsS0FBSyxDQUFDLFdBQVcsRUFBRTtZQUN6QixLQUFLLFFBQVE7Z0JBQ1gsT0FBTyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO2dCQUM5QyxNQUFNLE9BQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNyQyxPQUFPO1lBQ1QsS0FBSyxRQUFRO2dCQUNYLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQztnQkFDN0MsTUFBTSxVQUFVLEdBQWEsUUFBUSxDQUFDLE9BQU8sQ0FBQztnQkFDOUMsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDdEQsTUFBTSxjQUFjLEdBQUcsYUFBYSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDMUQsT0FBTyxDQUFDLElBQUksQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO2dCQUN2RCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDMUMsTUFBTSxVQUFVLENBQUMs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LG1CQUFtQixDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUseUJBQXlCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztTQUMvRjtRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVEOztHQUVHO0FBQ0gsS0FBSyxVQUFVLHNCQUFzQixDQUFDLEdBQVEsRUFBRSxJQUFZO0lBQzFELE1BQU0sU0FBUyxHQUFHLE1BQU0sbUJBQW1CLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBYSxDQUFDO0lBQzlFLE1BQU0sR0FBRyxDQUFDLGdCQUFnQixDQUFDO1FBQ3pCLEtBQUssRUFBRSxLQUFLO0tBQ2IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2YsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBUyxhQUFhLENBQUMsTUFBZ0IsRUFBRSxNQUFnQjtJQUN2RCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNyRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyplc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlKi9cbi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcyAqL1xuaW1wb3J0IHsgU1NNIH0gZnJvbSAnYXdzLXNkayc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50KSB7XG4gIGNvbnN0IHByb3BzID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzO1xuICBjb25zdCBpbXBvcnRzOiBzdHJpbmdbXSA9IHByb3BzLkltcG9ydHM7XG4gIGNvbnN0IGtleU5hbWU6IHN0cmluZyA9IGBjZGstc3Ryb25nLXJlZjoke3Byb3BzLlN0YWNrTmFtZX1gO1xuXG4gIGNvbnN0IHNzbSA9IG5ldyBTU00oeyByZWdpb246IHByb3BzLlJlZ2lvbiB9KTtcbiAgdHJ5IHtcbiAgICBzd2l0Y2ggKGV2ZW50LlJlcXVlc3RUeXBlKSB7XG4gICAgICBjYXNlICdDcmVhdGUnOlxuICAgICAgICBjb25zb2xlLmluZm8oJ1RhZ2dpbmcgU1NNIFBhcmFtZXRlciBpbXBvcnRzJyk7XG4gICAgICAgIGF3YWl0IGFkZFRhZ3Moc3NtLCBpbXBvcnRzLCBrZXlOYW1lKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2FzZSAnVXBkYXRlJzpcbiAgICAgICAgY29uc3Qgb2xkUHJvcHMgPSBldmVudC5PbGRSZXNvdXJjZVByb3BlcnRpZXM7XG4gICAgICAgIGNvbnN0IG9sZEV4cG9ydHM6IHN0cmluZ1tdID0gb2xkUHJvcHMuSW1wb3J0cztcbiAgICAgICAgY29uc3QgbmV3RXhwb3J0cyA9IGZpbHRlckV4cG9ydHMoaW1wb3J0cywgb2xkRXhwb3J0cyk7XG4gICAgICAgIGNvbnN0IHBhcmFtc1RvRGVsZXRlID0gZmlsdGVyRXhwb3J0cyhvbGRFeHBvcnRzLCBpbXBvcnRzKTtcbiAgICAgICAgY29uc29sZS5pbmZvKCdSZWxlYXNpbmcgdW51c2VkIFNTTSBQYXJhbWV0ZXIgaW1wb3J0cycpO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMocGFyYW1zVG9EZWxldGUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBhd2FpdCByZW1vdmVUYWdzKHNzbSwgcGFyYW1zVG9EZWxldGUsIGtleU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUuaW5mbygnVGFnZ2luZyBuZXcgU1NNIFBhcmFtZXRlciBpbXBvcnRzJyk7XG4gICAgICAgIGF3YWl0IGFkZFRhZ3Moc3NtLCBuZXdFeHBvcnRzLCBrZXlOYW1lKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgICAgY29uc29sZS5pbmZvKCdEZWxldGluZyBhbGwgU1NNIFBhcmFtZXRlciBleHBvcnRzJyk7XG4gICAgICAgIGF3YWl0IGRlbGV0ZVBhcmFtZXRlcnNCeVBhdGgoc3NtLCBgL2Nkay9leHBvcnRzLyR7cHJvcHMuU3RhY2tOYW1lfS9gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGltcG9ydGluZyBjcm9zcyByZWdpb24gc3RhY2sgZXhwb3J0czogJywgZSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcblxuLyoqXG4gKiBBZGQgdGFnIHRvIHBhcmFtZXRlcnMgZm9yIGV4aXN0aW5nIGV4cG9ydHNcbiAqL1xuYXN5bmMgZnVuY3Rpb24gYWRkVGFncyhzc206IFNTTSwgcGFyYW1ldGVyczogc3RyaW5nW10sIGtleU5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBQcm9taXNlLmFsbChwYXJhbWV0ZXJzLm1hcChhc3luYyBuYW1lID0+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHNzbS5hZGRUYWdzVG9SZXNvdXJjZSh7XG4gICAgICAgIFJlc291cmNlSWQ6IG5hbWUsXG4gICAgICAgIFJlc291cmNlVHlwZTogJ1BhcmFtZXRlcicsXG4gICAgICAgIFRhZ3M6IFt7XG4gICAgICAgICAgS2V5OiBrZXlOYW1lLFxuICAgICAgICAgIFZhbHVlOiAndHJ1ZScsXG4gICAgICAgIH1dLFxuICAgICAgfSkucHJvbWlzZSgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3IgaW1wb3J0aW5nICR7bmFtZX06ICR7ZX1gKTtcbiAgICB9XG4gIH0pKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGFncyBmcm9tIHBhcmFtZXRlcnNcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlVGFncyhzc206IFNTTSwgcGFyYW1ldGVyczogc3RyaW5nW10sIGtleU5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBQcm9taXNlLmFsbChwYXJhbWV0ZXJzLm1hcChhc3luYyBuYW1lID0+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHNzbS5yZW1vdmVUYWdzRnJvbVJlc291cmNlKHtcbiAgICAgICAgVGFnS2V5czogW2tleU5hbWVdLFxuICAgICAgICBSZXNvdXJjZVR5cGU6ICdQYXJhbWV0ZXInLFxuICAgICAgICBSZXNvdXJjZUlkOiBuYW1lLFxuICAgICAgfSkucHJvbWlzZSgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHN3aXRjaCAoZS5jb2RlKSB7XG4gICAgICAgIC8vIGlmIHRoZSBwYXJhbWV0ZXIgZG9lc24ndCBleGlzdCB0aGVuIHRoZXJlIGlzIG5vdGhpbmcgdG8gcmVsZWFzZVxuICAgICAgICBjYXNlICdJbnZhbGlkUmVzb3VyY2VJZCc6XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3IgcmVsZWFzaW5nIGltcG9ydCAke25hbWV9OiAke2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9KSk7XG59XG5cbi8qKlxuICogR2V0IGFsbCBwYXJhbWV0ZXJzIGluIGEgZ2l2ZW4gcGF0aFxuICpcbiAqIElmIHRoZSByZXF1ZXN0IGZhaWxzIGZvciBhbnkgcmVhc29uIGl0IHdpbGwgZmFpbCB0aGUgY3VzdG9tIHJlc291cmNlIGV2ZW50LlxuICogU2luY2UgdGhpcyBpcyBvbmx5IHJ1biB3aGVuIHRoZSByZXNvdXJjZSBpcyBkZWxldGVkIHRoYXQgaXMgcHJvYmFibHkgdGhlIGJlaGF2aW9yXG4gKiB0aGF0IGlzIGRlc2lyZWQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGdldFBhcmFtZXRlcnNCeVBhdGgoc3NtOiBTU00sIHBhdGg6IHN0cmluZywgbmV4dFRva2VuPzogc3RyaW5nKTogUHJvbWlzZTxTU00uUGFyYW1ldGVyW10+IHtcbiAgY29uc3QgcGFyYW1ldGVyczogU1NNLlBhcmFtZXRlcltdID0gW107XG4gIHJldHVybiBzc20uZ2V0UGFyYW1ldGVyc0J5UGF0aCh7XG4gICAgUGF0aDogcGF0aCxcbiAgICBOZXh0VG9rZW46IG5leHRUb2tlbixcbiAgfSkucHJvbWlzZSgpLnRoZW4oYXN5bmMgZ2V0UGFyYW1ldGVyc0J5UGF0aFJlc3VsdCA9PiB7XG4gICAgcGFyYW1ldGVycy5wdXNoKC4uLmdldFBhcmFtZXRlcnNCeVBhdGhSZXN1bHQuUGFyYW1ldGVycyA/PyBbXSk7XG4gICAgaWYgKGdldFBhcmFtZXRlcnNCeVBhdGhSZXN1bHQuTmV4dFRva2VuKSB7XG4gICAgICBwYXJhbWV0ZXJzLnB1c2goLi4uYXdhaXQgZ2V0UGFyYW1ldGVyc0J5UGF0aChzc20sIHBhdGgsIGdldFBhcmFtZXRlcnNCeVBhdGhSZXN1bHQuTmV4dFRva2VuKSk7XG4gICAgfVxuICAgIHJldHVybiBwYXJhbWV0ZXJzO1xuICB9KTtcbn1cblxuLyoqXG4gKiBEZWxldGUgYWxsIHBhcmFtZXRlcnMgaW4gYSBnaXZlIHBhdGhcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZGVsZXRlUGFyYW1ldGVyc0J5UGF0aChzc206IFNTTSwgcGF0aDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGFsbFBhcmFtcyA9IGF3YWl0IGdldFBhcmFtZXRlcnNCeVBhdGgoc3NtLCBwYXRoKTtcbiAgY29uc3QgbmFtZXMgPSBhbGxQYXJhbXMubWFwKHBhcmFtID0+IHBhcmFtLk5hbWUpLmZpbHRlcih4ID0+ICEheCkgYXMgc3RyaW5nW107XG4gIGF3YWl0IHNzbS5kZWxldGVQYXJhbWV0ZXJzKHtcbiAgICBOYW1lczogbmFtZXMsXG4gIH0pLnByb21pc2UoKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gb25seSB0aGUgaXRlbXMgZnJvbSBzb3VyY2UgdGhhdCBkbyBub3QgZXhpc3QgaW4gdGhlIGZpbHRlclxuICpcbiAqIEBwYXJhbSBzb3VyY2UgdGhlIHNvdXJjZSBvYmplY3QgdG8gcGVyZm9ybSB0aGUgZmlsdGVyIG9uXG4gKiBAcGFyYW0gZmlsdGVyIGZpbHRlciBvdXQgaXRlbXMgdGhhdCBleGlzdCBpbiB0aGlzIG9iamVjdFxuICovXG5mdW5jdGlvbiBmaWx0ZXJFeHBvcnRzKHNvdXJjZTogc3RyaW5nW10sIGZpbHRlcjogc3RyaW5nW10pOiBzdHJpbmdbXSB7XG4gIHJldHVybiBzb3VyY2UuZmlsdGVyKGtleSA9PiAhZmlsdGVyLmluY2x1ZGVzKGtleSkpO1xufVxuIl19