"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
/*eslint-disable no-console*/
/* eslint-disable import/no-extraneous-dependencies */
const client_ssm_1 = require("@aws-sdk/client-ssm");
async function handler(event) {
    const props = event.ResourceProperties.ReaderProps;
    const imports = props.imports;
    const importNames = Object.keys(imports);
    const keyName = `aws-cdk:strong-ref:${props.prefix}`;
    const ssm = new client_ssm_1.SSM({ region: props.region });
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
            });
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
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0Isc0RBQXNEO0FBQ3RELG9EQUEwQztBQUduQyxLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtEO0lBQzlFLE1BQU0sS0FBSyxHQUF3QixLQUFLLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDO0lBQ3hFLE1BQU0sT0FBTyxHQUF1QixLQUFLLENBQUMsT0FBNkIsQ0FBQztJQUN4RSxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pDLE1BQU0sT0FBTyxHQUFXLHNCQUFzQixLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFN0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxnQkFBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLElBQUk7UUFDRixRQUFRLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFDekIsS0FBSyxRQUFRO2dCQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxPQUFPLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDekMsTUFBTTtZQUNSLEtBQUssUUFBUTtnQkFDWCxNQUFNLFFBQVEsR0FBd0IsS0FBSyxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQztnQkFDOUUsTUFBTSxVQUFVLEdBQXVCLFFBQVEsQ0FBQyxPQUE2QixDQUFDO2dCQUM5RSxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDaEUsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQ3JFLE9BQU8sQ0FBQyxJQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQzNDLE1BQU0sVUFBVSxDQUFDLEdBQUcsRUFBRSxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7aUJBQ2pEO2dCQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQztnQkFDbEQsTUFBTSxPQUFPLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDeEMsTUFBTTtZQUNSLEtBQUssUUFBUTtnQkFDWCxPQUFPLENBQUMsSUFBSSxDQUFDLHNEQUFzRCxDQUFDLENBQUM7Z0JBQ3JFLE1BQU0sVUFBVSxDQUFDLEdBQUcsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQzVDLE9BQU87U0FDVjtLQUNGO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLENBQUMsS0FBSyxDQUFDLDhDQUE4QyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLE1BQU0sQ0FBQyxDQUFDO0tBQ1Q7SUFDRCxPQUFPO1FBQ0wsSUFBSSxFQUFFLE9BQU87S0FDZCxDQUFDO0FBQ0osQ0FBQztBQXJDRCwwQkFxQ0M7QUFBQSxDQUFDO0FBRUY7O0dBRUc7QUFDSCxLQUFLLFVBQVUsT0FBTyxDQUFDLEdBQVEsRUFBRSxVQUFvQixFQUFFLE9BQWU7SUFDcEUsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxFQUFFO1FBQzVDLElBQUk7WUFDRixPQUFPLE1BQU0sR0FBRyxDQUFDLGlCQUFpQixDQUFDO2dCQUNqQyxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsWUFBWSxFQUFFLFdBQVc7Z0JBQ3pCLElBQUksRUFBRSxDQUFDO3dCQUNMLEdBQUcsRUFBRSxPQUFPO3dCQUNaLEtBQUssRUFBRSxNQUFNO3FCQUNkLENBQUM7YUFDSCxDQUFDLENBQUM7U0FDSjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDbEQ7SUFDSCxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUVEOztHQUVHO0FBQ0gsS0FBSyxVQUFVLFVBQVUsQ0FBQyxHQUFRLEVBQUUsVUFBb0IsRUFBRSxPQUFlO0lBQ3ZFLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsRUFBRTtRQUM1QyxJQUFJO1lBQ0YsT0FBTyxNQUFNLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQztnQkFDdEMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDO2dCQUNsQixZQUFZLEVBQUUsV0FBVztnQkFDekIsVUFBVSxFQUFFLElBQUk7YUFDakIsQ0FBQyxDQUFDO1NBQ0o7UUFBQyxPQUFPLENBQU0sRUFBRTtZQUNmLFFBQVEsQ0FBQyxDQUFDLElBQUksRUFBRTtnQkFDZCxrRUFBa0U7Z0JBQ2xFLEtBQUssbUJBQW1CO29CQUN0QixPQUFPO2dCQUNUO29CQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQzNEO1NBQ0Y7SUFDSCxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBUyxNQUFNLENBQUMsTUFBZ0IsRUFBRSxNQUFnQjtJQUNoRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNyRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyplc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlKi9cbi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcyAqL1xuaW1wb3J0IHsgU1NNIH0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LXNzbSc7XG5pbXBvcnQgeyBFeHBvcnRSZWFkZXJDUlByb3BzLCBDcm9zc1JlZ2lvbkV4cG9ydHMgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50KSB7XG4gIGNvbnN0IHByb3BzOiBFeHBvcnRSZWFkZXJDUlByb3BzID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlJlYWRlclByb3BzO1xuICBjb25zdCBpbXBvcnRzOiBDcm9zc1JlZ2lvbkV4cG9ydHMgPSBwcm9wcy5pbXBvcnRzIGFzIENyb3NzUmVnaW9uRXhwb3J0cztcbiAgY29uc3QgaW1wb3J0TmFtZXMgPSBPYmplY3Qua2V5cyhpbXBvcnRzKTtcbiAgY29uc3Qga2V5TmFtZTogc3RyaW5nID0gYGF3cy1jZGs6c3Ryb25nLXJlZjoke3Byb3BzLnByZWZpeH1gO1xuXG4gIGNvbnN0IHNzbSA9IG5ldyBTU00oeyByZWdpb246IHByb3BzLnJlZ2lvbiB9KTtcbiAgdHJ5IHtcbiAgICBzd2l0Y2ggKGV2ZW50LlJlcXVlc3RUeXBlKSB7XG4gICAgICBjYXNlICdDcmVhdGUnOlxuICAgICAgICBjb25zb2xlLmluZm8oJ1RhZ2dpbmcgU1NNIFBhcmFtZXRlciBpbXBvcnRzJyk7XG4gICAgICAgIGF3YWl0IGFkZFRhZ3Moc3NtLCBpbXBvcnROYW1lcywga2V5TmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnVXBkYXRlJzpcbiAgICAgICAgY29uc3Qgb2xkUHJvcHM6IEV4cG9ydFJlYWRlckNSUHJvcHMgPSBldmVudC5PbGRSZXNvdXJjZVByb3BlcnRpZXMuUmVhZGVyUHJvcHM7XG4gICAgICAgIGNvbnN0IG9sZEV4cG9ydHM6IENyb3NzUmVnaW9uRXhwb3J0cyA9IG9sZFByb3BzLmltcG9ydHMgYXMgQ3Jvc3NSZWdpb25FeHBvcnRzO1xuICAgICAgICBjb25zdCBuZXdFeHBvcnRzID0gZXhjZXB0KGltcG9ydE5hbWVzLCBPYmplY3Qua2V5cyhvbGRFeHBvcnRzKSk7XG4gICAgICAgIGNvbnN0IHBhcmFtc1RvUmVsZWFzZSA9IGV4Y2VwdChPYmplY3Qua2V5cyhvbGRFeHBvcnRzKSwgaW1wb3J0TmFtZXMpO1xuICAgICAgICBjb25zb2xlLmluZm8oJ1JlbGVhc2luZyB1bnVzZWQgU1NNIFBhcmFtZXRlciBpbXBvcnRzJyk7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhwYXJhbXNUb1JlbGVhc2UpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBhd2FpdCByZW1vdmVUYWdzKHNzbSwgcGFyYW1zVG9SZWxlYXNlLCBrZXlOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmluZm8oJ1RhZ2dpbmcgbmV3IFNTTSBQYXJhbWV0ZXIgaW1wb3J0cycpO1xuICAgICAgICBhd2FpdCBhZGRUYWdzKHNzbSwgbmV3RXhwb3J0cywga2V5TmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgICAgY29uc29sZS5pbmZvKCdSZWxlYXNpbmcgYWxsIFNTTSBQYXJhbWV0ZXIgZXhwb3J0cyBieSByZW1vdmluZyB0YWdzJyk7XG4gICAgICAgIGF3YWl0IHJlbW92ZVRhZ3Moc3NtLCBpbXBvcnROYW1lcywga2V5TmFtZSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbXBvcnRpbmcgY3Jvc3MgcmVnaW9uIHN0YWNrIGV4cG9ydHM6ICcsIGUpO1xuICAgIHRocm93IGU7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBEYXRhOiBpbXBvcnRzLFxuICB9O1xufTtcblxuLyoqXG4gKiBBZGQgdGFnIHRvIHBhcmFtZXRlcnMgZm9yIGV4aXN0aW5nIGV4cG9ydHNcbiAqL1xuYXN5bmMgZnVuY3Rpb24gYWRkVGFncyhzc206IFNTTSwgcGFyYW1ldGVyczogc3RyaW5nW10sIGtleU5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBQcm9taXNlLmFsbChwYXJhbWV0ZXJzLm1hcChhc3luYyBuYW1lID0+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHNzbS5hZGRUYWdzVG9SZXNvdXJjZSh7XG4gICAgICAgIFJlc291cmNlSWQ6IG5hbWUsXG4gICAgICAgIFJlc291cmNlVHlwZTogJ1BhcmFtZXRlcicsXG4gICAgICAgIFRhZ3M6IFt7XG4gICAgICAgICAgS2V5OiBrZXlOYW1lLFxuICAgICAgICAgIFZhbHVlOiAndHJ1ZScsXG4gICAgICAgIH1dLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciBpbXBvcnRpbmcgJHtuYW1lfTogJHtlfWApO1xuICAgIH1cbiAgfSkpO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0YWdzIGZyb20gcGFyYW1ldGVyc1xuICovXG5hc3luYyBmdW5jdGlvbiByZW1vdmVUYWdzKHNzbTogU1NNLCBwYXJhbWV0ZXJzOiBzdHJpbmdbXSwga2V5TmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IFByb21pc2UuYWxsKHBhcmFtZXRlcnMubWFwKGFzeW5jIG5hbWUgPT4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgc3NtLnJlbW92ZVRhZ3NGcm9tUmVzb3VyY2Uoe1xuICAgICAgICBUYWdLZXlzOiBba2V5TmFtZV0sXG4gICAgICAgIFJlc291cmNlVHlwZTogJ1BhcmFtZXRlcicsXG4gICAgICAgIFJlc291cmNlSWQ6IG5hbWUsXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIHN3aXRjaCAoZS5jb2RlKSB7XG4gICAgICAgIC8vIGlmIHRoZSBwYXJhbWV0ZXIgZG9lc24ndCBleGlzdCB0aGVuIHRoZXJlIGlzIG5vdGhpbmcgdG8gcmVsZWFzZVxuICAgICAgICBjYXNlICdJbnZhbGlkUmVzb3VyY2VJZCc6XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3IgcmVsZWFzaW5nIGltcG9ydCAke25hbWV9OiAke2V9YCk7XG4gICAgICB9XG4gICAgfVxuICB9KSk7XG59XG5cbi8qKlxuICogUmV0dXJuIG9ubHkgdGhlIGl0ZW1zIGZyb20gc291cmNlIHRoYXQgZG8gbm90IGV4aXN0IGluIHRoZSBmaWx0ZXJcbiAqXG4gKiBAcGFyYW0gc291cmNlIHRoZSBzb3VyY2Ugb2JqZWN0IHRvIHBlcmZvcm0gdGhlIGZpbHRlciBvblxuICogQHBhcmFtIGZpbHRlciBmaWx0ZXIgb3V0IGl0ZW1zIHRoYXQgZXhpc3QgaW4gdGhpcyBvYmplY3RcbiAqL1xuZnVuY3Rpb24gZXhjZXB0KHNvdXJjZTogc3RyaW5nW10sIGZpbHRlcjogc3RyaW5nW10pOiBzdHJpbmdbXSB7XG4gIHJldHVybiBzb3VyY2UuZmlsdGVyKGtleSA9PiAhZmlsdGVyLmluY2x1ZGVzKGtleSkpO1xufVxuIl19