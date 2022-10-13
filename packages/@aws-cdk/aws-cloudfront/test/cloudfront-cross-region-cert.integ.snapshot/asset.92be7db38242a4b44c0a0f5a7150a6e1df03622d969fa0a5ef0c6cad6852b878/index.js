"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
/*eslint-disable no-console*/
/* eslint-disable import/no-extraneous-dependencies */
const aws_sdk_1 = require("aws-sdk");
async function handler(event) {
    const props = event.ResourceProperties.ReaderProps;
    const imports = props.imports;
    const keyName = `aws-cdk:strong-ref:${props.prefix}`;
    const ssm = new aws_sdk_1.SSM({ region: props.region });
    try {
        switch (event.RequestType) {
            case 'Create':
                console.info('Tagging SSM Parameter imports');
                await addTags(ssm, imports, keyName);
                return;
            case 'Update':
                const oldProps = event.OldResourceProperties.ReaderProps;
                const oldExports = oldProps.imports;
                const newExports = except(imports, oldExports);
                const paramsToDelete = except(oldExports, imports);
                console.info('Releasing unused SSM Parameter imports');
                if (Object.keys(paramsToDelete).length > 0) {
                    await removeTags(ssm, paramsToDelete, keyName);
                }
                console.info('Tagging new SSM Parameter imports');
                await addTags(ssm, newExports, keyName);
                return;
            case 'Delete':
                console.info('Deleting all SSM Parameter exports');
                await deleteParametersByPath(ssm, `/cdk/exports/${props.prefix}/`);
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
async function getParametersByPath(ssm, path) {
    const parameters = [];
    let nextToken;
    do {
        const response = await ssm.getParametersByPath({ Path: path, NextToken: nextToken }).promise();
        parameters.push(...response.Parameters ?? []);
        nextToken = response.NextToken;
    } while (nextToken);
    return parameters;
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
function except(source, filter) {
    return source.filter(key => !filter.includes(key));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0Isc0RBQXNEO0FBQ3RELHFDQUE4QjtBQUd2QixLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtEO0lBQzlFLE1BQU0sS0FBSyxHQUF3QixLQUFLLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDO0lBQ3hFLE1BQU0sT0FBTyxHQUFhLEtBQUssQ0FBQyxPQUFPLENBQUM7SUFDeEMsTUFBTSxPQUFPLEdBQVcsc0JBQXNCLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUU3RCxNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUM5QyxJQUFJO1FBQ0YsUUFBUSxLQUFLLENBQUMsV0FBVyxFQUFFO1lBQ3pCLEtBQUssUUFBUTtnQkFDWCxPQUFPLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUM7Z0JBQzlDLE1BQU0sT0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3JDLE9BQU87WUFDVCxLQUFLLFFBQVE7Z0JBQ1gsTUFBTSxRQUFRLEdBQXdCLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUM7Z0JBQzlFLE1BQU0sVUFBVSxHQUFhLFFBQVEsQ0FBQyxPQUFPLENBQUM7Z0JBQzlDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQy9DLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ25ELE9BQU8sQ0FBQyxJQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7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LEVBQUU7SUFDcEIsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQztBQUVEOztHQUVHO0FBQ0gsS0FBSyxVQUFVLHNCQUFzQixDQUFDLEdBQVEsRUFBRSxJQUFZO0lBQzFELE1BQU0sU0FBUyxHQUFHLE1BQU0sbUJBQW1CLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBYSxDQUFDO0lBQzlFLE1BQU0sR0FBRyxDQUFDLGdCQUFnQixDQUFDO1FBQ3pCLEtBQUssRUFBRSxLQUFLO0tBQ2IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2YsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBUyxNQUFNLENBQUMsTUFBZ0IsRUFBRSxNQUFnQjtJQUNoRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNyRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyplc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlKi9cbi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcyAqL1xuaW1wb3J0IHsgU1NNIH0gZnJvbSAnYXdzLXNkayc7XG5pbXBvcnQgeyBFeHBvcnRSZWFkZXJDUlByb3BzIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCkge1xuICBjb25zdCBwcm9wczogRXhwb3J0UmVhZGVyQ1JQcm9wcyA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5SZWFkZXJQcm9wcztcbiAgY29uc3QgaW1wb3J0czogc3RyaW5nW10gPSBwcm9wcy5pbXBvcnRzO1xuICBjb25zdCBrZXlOYW1lOiBzdHJpbmcgPSBgYXdzLWNkazpzdHJvbmctcmVmOiR7cHJvcHMucHJlZml4fWA7XG5cbiAgY29uc3Qgc3NtID0gbmV3IFNTTSh7IHJlZ2lvbjogcHJvcHMucmVnaW9uIH0pO1xuICB0cnkge1xuICAgIHN3aXRjaCAoZXZlbnQuUmVxdWVzdFR5cGUpIHtcbiAgICAgIGNhc2UgJ0NyZWF0ZSc6XG4gICAgICAgIGNvbnNvbGUuaW5mbygnVGFnZ2luZyBTU00gUGFyYW1ldGVyIGltcG9ydHMnKTtcbiAgICAgICAgYXdhaXQgYWRkVGFncyhzc20sIGltcG9ydHMsIGtleU5hbWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlICdVcGRhdGUnOlxuICAgICAgICBjb25zdCBvbGRQcm9wczogRXhwb3J0UmVhZGVyQ1JQcm9wcyA9IGV2ZW50Lk9sZFJlc291cmNlUHJvcGVydGllcy5SZWFkZXJQcm9wcztcbiAgICAgICAgY29uc3Qgb2xkRXhwb3J0czogc3RyaW5nW10gPSBvbGRQcm9wcy5pbXBvcnRzO1xuICAgICAgICBjb25zdCBuZXdFeHBvcnRzID0gZXhjZXB0KGltcG9ydHMsIG9sZEV4cG9ydHMpO1xuICAgICAgICBjb25zdCBwYXJhbXNUb0RlbGV0ZSA9IGV4Y2VwdChvbGRFeHBvcnRzLCBpbXBvcnRzKTtcbiAgICAgICAgY29uc29sZS5pbmZvKCdSZWxlYXNpbmcgdW51c2VkIFNTTSBQYXJhbWV0ZXIgaW1wb3J0cycpO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMocGFyYW1zVG9EZWxldGUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBhd2FpdCByZW1vdmVUYWdzKHNzbSwgcGFyYW1zVG9EZWxldGUsIGtleU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUuaW5mbygnVGFnZ2luZyBuZXcgU1NNIFBhcmFtZXRlciBpbXBvcnRzJyk7XG4gICAgICAgIGF3YWl0IGFkZFRhZ3Moc3NtLCBuZXdFeHBvcnRzLCBrZXlOYW1lKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgICAgY29uc29sZS5pbmZvKCdEZWxldGluZyBhbGwgU1NNIFBhcmFtZXRlciBleHBvcnRzJyk7XG4gICAgICAgIGF3YWl0IGRlbGV0ZVBhcmFtZXRlcnNCeVBhdGgoc3NtLCBgL2Nkay9leHBvcnRzLyR7cHJvcHMucHJlZml4fS9gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGltcG9ydGluZyBjcm9zcyByZWdpb24gc3RhY2sgZXhwb3J0czogJywgZSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcblxuLyoqXG4gKiBBZGQgdGFnIHRvIHBhcmFtZXRlcnMgZm9yIGV4aXN0aW5nIGV4cG9ydHNcbiAqL1xuYXN5bmMgZnVuY3Rpb24gYWRkVGFncyhzc206IFNTTSwgcGFyYW1ldGVyczogc3RyaW5nW10sIGtleU5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBQcm9taXNlLmFsbChwYXJhbWV0ZXJzLm1hcChhc3luYyBuYW1lID0+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHNzbS5hZGRUYWdzVG9SZXNvdXJjZSh7XG4gICAgICAgIFJlc291cmNlSWQ6IG5hbWUsXG4gICAgICAgIFJlc291cmNlVHlwZTogJ1BhcmFtZXRlcicsXG4gICAgICAgIFRhZ3M6IFt7XG4gICAgICAgICAgS2V5OiBrZXlOYW1lLFxuICAgICAgICAgIFZhbHVlOiAndHJ1ZScsXG4gICAgICAgIH1dLFxuICAgICAgfSkucHJvbWlzZSgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3IgaW1wb3J0aW5nICR7bmFtZX06ICR7ZX1gKTtcbiAgICB9XG4gIH0pKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGFncyBmcm9tIHBhcmFtZXRlcnNcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlVGFncyhzc206IFNTTSwgcGFyYW1ldGVyczogc3RyaW5nW10sIGtleU5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBQcm9taXNlLmFsbChwYXJhbWV0ZXJzLm1hcChhc3luYyBuYW1lID0+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHNzbS5yZW1vdmVUYWdzRnJvbVJlc291cmNlKHtcbiAgICAgICAgVGFnS2V5czogW2tleU5hbWVdLFxuICAgICAgICBSZXNvdXJjZVR5cGU6ICdQYXJhbWV0ZXInLFxuICAgICAgICBSZXNvdXJjZUlkOiBuYW1lLFxuICAgICAgfSkucHJvbWlzZSgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHN3aXRjaCAoZS5jb2RlKSB7XG4gICAgICAgIC8vIGlmIHRoZSBwYXJhbWV0ZXIgZG9lc24ndCBleGlzdCB0aGVuIHRoZXJlIGlzIG5vdGhpbmcgdG8gcmVsZWFzZVxuICAgICAgICBjYXNlICdJbnZhbGlkUmVzb3VyY2VJZCc6XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3IgcmVsZWFzaW5nIGltcG9ydCAke25hbWV9OiAke2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9KSk7XG59XG5cbi8qKlxuICogR2V0IGFsbCBwYXJhbWV0ZXJzIGluIGEgZ2l2ZW4gcGF0aFxuICpcbiAqIElmIHRoZSByZXF1ZXN0IGZhaWxzIGZvciBhbnkgcmVhc29uIGl0IHdpbGwgZmFpbCB0aGUgY3VzdG9tIHJlc291cmNlIGV2ZW50LlxuICogU2luY2UgdGhpcyBpcyBvbmx5IHJ1biB3aGVuIHRoZSByZXNvdXJjZSBpcyBkZWxldGVkIHRoYXQgaXMgcHJvYmFibHkgdGhlIGJlaGF2aW9yXG4gKiB0aGF0IGlzIGRlc2lyZWQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGdldFBhcmFtZXRlcnNCeVBhdGgoc3NtOiBTU00sIHBhdGg6IHN0cmluZyk6IFByb21pc2U8U1NNLlBhcmFtZXRlcltdPiB7XG4gIGNvbnN0IHBhcmFtZXRlcnM6IFNTTS5QYXJhbWV0ZXJbXSA9IFtdO1xuICBsZXQgbmV4dFRva2VuOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIGRvIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNzbS5nZXRQYXJhbWV0ZXJzQnlQYXRoKHsgUGF0aDogcGF0aCwgTmV4dFRva2VuOiBuZXh0VG9rZW4gfSkucHJvbWlzZSgpO1xuICAgIHBhcmFtZXRlcnMucHVzaCguLi5yZXNwb25zZS5QYXJhbWV0ZXJzID8/IFtdKTtcbiAgICBuZXh0VG9rZW4gPSByZXNwb25zZS5OZXh0VG9rZW47XG5cbiAgfSB3aGlsZSAobmV4dFRva2VuKTtcbiAgcmV0dXJuIHBhcmFtZXRlcnM7XG59XG5cbi8qKlxuICogRGVsZXRlIGFsbCBwYXJhbWV0ZXJzIGluIGEgZ2l2ZSBwYXRoXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVBhcmFtZXRlcnNCeVBhdGgoc3NtOiBTU00sIHBhdGg6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBhbGxQYXJhbXMgPSBhd2FpdCBnZXRQYXJhbWV0ZXJzQnlQYXRoKHNzbSwgcGF0aCk7XG4gIGNvbnN0IG5hbWVzID0gYWxsUGFyYW1zLm1hcChwYXJhbSA9PiBwYXJhbS5OYW1lKS5maWx0ZXIoeCA9PiAhIXgpIGFzIHN0cmluZ1tdO1xuICBhd2FpdCBzc20uZGVsZXRlUGFyYW1ldGVycyh7XG4gICAgTmFtZXM6IG5hbWVzLFxuICB9KS5wcm9taXNlKCk7XG59XG5cbi8qKlxuICogUmV0dXJuIG9ubHkgdGhlIGl0ZW1zIGZyb20gc291cmNlIHRoYXQgZG8gbm90IGV4aXN0IGluIHRoZSBmaWx0ZXJcbiAqXG4gKiBAcGFyYW0gc291cmNlIHRoZSBzb3VyY2Ugb2JqZWN0IHRvIHBlcmZvcm0gdGhlIGZpbHRlciBvblxuICogQHBhcmFtIGZpbHRlciBmaWx0ZXIgb3V0IGl0ZW1zIHRoYXQgZXhpc3QgaW4gdGhpcyBvYmplY3RcbiAqL1xuZnVuY3Rpb24gZXhjZXB0KHNvdXJjZTogc3RyaW5nW10sIGZpbHRlcjogc3RyaW5nW10pOiBzdHJpbmdbXSB7XG4gIHJldHVybiBzb3VyY2UuZmlsdGVyKGtleSA9PiAhZmlsdGVyLmluY2x1ZGVzKGtleSkpO1xufVxuIl19