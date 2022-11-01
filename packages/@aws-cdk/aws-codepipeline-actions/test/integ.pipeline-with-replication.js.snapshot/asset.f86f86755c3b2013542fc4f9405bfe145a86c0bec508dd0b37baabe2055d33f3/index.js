"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
/*eslint-disable no-console*/
/* eslint-disable import/no-extraneous-dependencies */
const aws_sdk_1 = require("aws-sdk");
async function handler(event) {
    const props = event.ResourceProperties.WriterProps;
    const exports = props.exports;
    const ssm = new aws_sdk_1.SSM({ region: props.region });
    try {
        switch (event.RequestType) {
            case 'Create':
                console.info(`Creating new SSM Parameter exports in region ${props.region}`);
                await throwIfAnyInUse(ssm, exports);
                await putParameters(ssm, exports);
                return;
            case 'Update':
                const oldProps = event.OldResourceProperties.WriterProps;
                const oldExports = oldProps.exports;
                const newExports = except(exports, oldExports);
                // throw an error to fail the deployment if any export value is changing
                const changedExports = changed(oldExports, exports);
                if (changedExports.length > 0) {
                    throw new Error('Some exports have changed!\n' + changedExports.join('\n'));
                }
                // if we are removing any exports that are in use, then throw an
                // error to fail the deployment
                const removedExports = except(oldExports, exports);
                await throwIfAnyInUse(ssm, removedExports);
                // if the ones we are removing are not in use then delete them
                await ssm.deleteParameters({
                    Names: Object.keys(removedExports),
                }).promise();
                // also throw an error if we are creating a new export that already exists for some reason
                await throwIfAnyInUse(ssm, newExports);
                console.info(`Creating new SSM Parameter exports in region ${props.region}`);
                await putParameters(ssm, newExports);
                return;
            case 'Delete':
                // if any of the exports are currently in use then throw an error to fail
                // the stack deletion.
                await throwIfAnyInUse(ssm, exports);
                // if none are in use then delete all of them
                await ssm.deleteParameters({
                    Names: Object.keys(exports),
                }).promise();
                return;
            default:
                return;
        }
    }
    catch (e) {
        console.error('Error processing event: ', e);
        throw e;
    }
}
exports.handler = handler;
;
/**
 * Create parameters for existing exports
 */
async function putParameters(ssm, parameters) {
    await Promise.all(Array.from(Object.entries(parameters), ([name, value]) => {
        return ssm.putParameter({
            Name: name,
            Value: value,
            Type: 'String',
        }).promise();
    }));
}
/**
 * Query for existing parameters that are in use
 */
async function throwIfAnyInUse(ssm, parameters) {
    const tagResults = new Map();
    await Promise.all(Object.keys(parameters).map(async (name) => {
        const result = await isInUse(ssm, name);
        if (result.size > 0) {
            tagResults.set(name, result);
        }
    }));
    if (tagResults.size > 0) {
        const message = Object.entries(tagResults)
            .map((result) => `${result[0]} is in use by stack(s) ${result[1].join(' ')}`)
            .join('\n');
        throw new Error(`Exports cannot be updated: \n${message}`);
    }
}
/**
 * Check if a parameter is in use
 */
async function isInUse(ssm, parameterName) {
    const tagResults = new Set();
    try {
        const result = await ssm.listTagsForResource({
            ResourceId: parameterName,
            ResourceType: 'Parameter',
        }).promise();
        result.TagList?.forEach(tag => {
            const tagParts = tag.Key.split(':');
            if (tagParts[0] === 'aws-cdk' && tagParts[1] === 'strong-ref') {
                tagResults.add(tagParts[2]);
            }
        });
    }
    catch (e) {
        // an InvalidResourceId means that the parameter doesn't exist
        // which we should ignore since that means it's not in use
        if (e.code === 'InvalidResourceId') {
            return new Set();
        }
        throw e;
    }
    return tagResults;
}
/**
 * Return only the items from source that do not exist in the filter
 *
 * @param source the source object to perform the filter on
 * @param filter filter out items that exist in this object
 * @returns any exports that don't exist in the filter
 */
function except(source, filter) {
    return Object.keys(source)
        .filter(key => (!filter.hasOwnProperty(key)))
        .reduce((acc, curr) => {
        acc[curr] = source[curr];
        return acc;
    }, {});
}
/**
 * Return items that exist in both the the old parameters and the new parameters,
 * but have different values
 *
 * @param oldParams the exports that existed previous to this execution
 * @param newParams the exports for the current execution
 * @returns any parameters that have different values
 */
function changed(oldParams, newParams) {
    return Object.keys(oldParams)
        .filter(key => (newParams.hasOwnProperty(key) && oldParams[key] !== newParams[key]))
        .reduce((acc, curr) => {
        acc.push(curr);
        return acc;
    }, []);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0Isc0RBQXNEO0FBQ3RELHFDQUE4QjtBQUd2QixLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtEO0lBQzlFLE1BQU0sS0FBSyxHQUF3QixLQUFLLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDO0lBQ3hFLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUE2QixDQUFDO0lBRXBELE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLElBQUk7UUFDRixRQUFRLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFDekIsS0FBSyxRQUFRO2dCQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0RBQWdELEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2dCQUM3RSxNQUFNLGVBQWUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3BDLE1BQU0sYUFBYSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDbEMsT0FBTztZQUNULEtBQUssUUFBUTtnQkFDWCxNQUFNLFFBQVEsR0FBd0IsS0FBSyxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQztnQkFDOUUsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE9BQTZCLENBQUM7Z0JBQzFELE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBRS9DLHdFQUF3RTtnQkFDeEUsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsR0FBRSxjQUFjLENBQUMs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Q0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUM1QyxNQUFNLENBQUMsQ0FBQyxHQUF1QixFQUFFLElBQVksRUFBRSxFQUFFO1FBQ2hELEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekIsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDWCxDQUFDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILFNBQVMsT0FBTyxDQUFDLFNBQTZCLEVBQUUsU0FBNkI7SUFDM0UsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUMxQixNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ25GLE1BQU0sQ0FBQyxDQUFDLEdBQWEsRUFBRSxJQUFZLEVBQUUsRUFBRTtRQUN0QyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2YsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDWCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyplc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlKi9cbi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcyAqL1xuaW1wb3J0IHsgU1NNIH0gZnJvbSAnYXdzLXNkayc7XG5pbXBvcnQgeyBDcm9zc1JlZ2lvbkV4cG9ydHMsIEV4cG9ydFdyaXRlckNSUHJvcHMgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50KSB7XG4gIGNvbnN0IHByb3BzOiBFeHBvcnRXcml0ZXJDUlByb3BzID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLldyaXRlclByb3BzO1xuICBjb25zdCBleHBvcnRzID0gcHJvcHMuZXhwb3J0cyBhcyBDcm9zc1JlZ2lvbkV4cG9ydHM7XG5cbiAgY29uc3Qgc3NtID0gbmV3IFNTTSh7IHJlZ2lvbjogcHJvcHMucmVnaW9uIH0pO1xuICB0cnkge1xuICAgIHN3aXRjaCAoZXZlbnQuUmVxdWVzdFR5cGUpIHtcbiAgICAgIGNhc2UgJ0NyZWF0ZSc6XG4gICAgICAgIGNvbnNvbGUuaW5mbyhgQ3JlYXRpbmcgbmV3IFNTTSBQYXJhbWV0ZXIgZXhwb3J0cyBpbiByZWdpb24gJHtwcm9wcy5yZWdpb259YCk7XG4gICAgICAgIGF3YWl0IHRocm93SWZBbnlJblVzZShzc20sIGV4cG9ydHMpO1xuICAgICAgICBhd2FpdCBwdXRQYXJhbWV0ZXJzKHNzbSwgZXhwb3J0cyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgJ1VwZGF0ZSc6XG4gICAgICAgIGNvbnN0IG9sZFByb3BzOiBFeHBvcnRXcml0ZXJDUlByb3BzID0gZXZlbnQuT2xkUmVzb3VyY2VQcm9wZXJ0aWVzLldyaXRlclByb3BzO1xuICAgICAgICBjb25zdCBvbGRFeHBvcnRzID0gb2xkUHJvcHMuZXhwb3J0cyBhcyBDcm9zc1JlZ2lvbkV4cG9ydHM7XG4gICAgICAgIGNvbnN0IG5ld0V4cG9ydHMgPSBleGNlcHQoZXhwb3J0cywgb2xkRXhwb3J0cyk7XG5cbiAgICAgICAgLy8gdGhyb3cgYW4gZXJyb3IgdG8gZmFpbCB0aGUgZGVwbG95bWVudCBpZiBhbnkgZXhwb3J0IHZhbHVlIGlzIGNoYW5naW5nXG4gICAgICAgIGNvbnN0IGNoYW5nZWRFeHBvcnRzID0gY2hhbmdlZChvbGRFeHBvcnRzLCBleHBvcnRzKTtcbiAgICAgICAgaWYgKGNoYW5nZWRFeHBvcnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbWUgZXhwb3J0cyBoYXZlIGNoYW5nZWQhXFxuJysgY2hhbmdlZEV4cG9ydHMuam9pbignXFxuJykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmIHdlIGFyZSByZW1vdmluZyBhbnkgZXhwb3J0cyB0aGF0IGFyZSBpbiB1c2UsIHRoZW4gdGhyb3cgYW5cbiAgICAgICAgLy8gZXJyb3IgdG8gZmFpbCB0aGUgZGVwbG95bWVudFxuICAgICAgICBjb25zdCByZW1vdmVkRXhwb3J0cyA9IGV4Y2VwdChvbGRFeHBvcnRzLCBleHBvcnRzKTtcbiAgICAgICAgYXdhaXQgdGhyb3dJZkFueUluVXNlKHNzbSwgcmVtb3ZlZEV4cG9ydHMpO1xuICAgICAgICAvLyBpZiB0aGUgb25lcyB3ZSBhcmUgcmVtb3ZpbmcgYXJlIG5vdCBpbiB1c2UgdGhlbiBkZWxldGUgdGhlbVxuICAgICAgICBhd2FpdCBzc20uZGVsZXRlUGFyYW1ldGVycyh7XG4gICAgICAgICAgTmFtZXM6IE9iamVjdC5rZXlzKHJlbW92ZWRFeHBvcnRzKSxcbiAgICAgICAgfSkucHJvbWlzZSgpO1xuXG4gICAgICAgIC8vIGFsc28gdGhyb3cgYW4gZXJyb3IgaWYgd2UgYXJlIGNyZWF0aW5nIGEgbmV3IGV4cG9ydCB0aGF0IGFscmVhZHkgZXhpc3RzIGZvciBzb21lIHJlYXNvblxuICAgICAgICBhd2FpdCB0aHJvd0lmQW55SW5Vc2Uoc3NtLCBuZXdFeHBvcnRzKTtcbiAgICAgICAgY29uc29sZS5pbmZvKGBDcmVhdGluZyBuZXcgU1NNIFBhcmFtZXRlciBleHBvcnRzIGluIHJlZ2lvbiAke3Byb3BzLnJlZ2lvbn1gKTtcbiAgICAgICAgYXdhaXQgcHV0UGFyYW1ldGVycyhzc20sIG5ld0V4cG9ydHMpO1xuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlICdEZWxldGUnOlxuICAgICAgICAvLyBpZiBhbnkgb2YgdGhlIGV4cG9ydHMgYXJlIGN1cnJlbnRseSBpbiB1c2UgdGhlbiB0aHJvdyBhbiBlcnJvciB0byBmYWlsXG4gICAgICAgIC8vIHRoZSBzdGFjayBkZWxldGlvbi5cbiAgICAgICAgYXdhaXQgdGhyb3dJZkFueUluVXNlKHNzbSwgZXhwb3J0cyk7XG4gICAgICAgIC8vIGlmIG5vbmUgYXJlIGluIHVzZSB0aGVuIGRlbGV0ZSBhbGwgb2YgdGhlbVxuICAgICAgICBhd2FpdCBzc20uZGVsZXRlUGFyYW1ldGVycyh7XG4gICAgICAgICAgTmFtZXM6IE9iamVjdC5rZXlzKGV4cG9ydHMpLFxuICAgICAgICB9KS5wcm9taXNlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwcm9jZXNzaW5nIGV2ZW50OiAnLCBlKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuXG4vKipcbiAqIENyZWF0ZSBwYXJhbWV0ZXJzIGZvciBleGlzdGluZyBleHBvcnRzXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHB1dFBhcmFtZXRlcnMoc3NtOiBTU00sIHBhcmFtZXRlcnM6IENyb3NzUmVnaW9uRXhwb3J0cyk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBQcm9taXNlLmFsbChBcnJheS5mcm9tKE9iamVjdC5lbnRyaWVzKHBhcmFtZXRlcnMpLCAoW25hbWUsIHZhbHVlXSkgPT4ge1xuICAgIHJldHVybiBzc20ucHV0UGFyYW1ldGVyKHtcbiAgICAgIE5hbWU6IG5hbWUsXG4gICAgICBWYWx1ZTogdmFsdWUsXG4gICAgICBUeXBlOiAnU3RyaW5nJyxcbiAgICB9KS5wcm9taXNlKCk7XG4gIH0pKTtcbn1cblxuLyoqXG4gKiBRdWVyeSBmb3IgZXhpc3RpbmcgcGFyYW1ldGVycyB0aGF0IGFyZSBpbiB1c2VcbiAqL1xuYXN5bmMgZnVuY3Rpb24gdGhyb3dJZkFueUluVXNlKHNzbTogU1NNLCBwYXJhbWV0ZXJzOiBDcm9zc1JlZ2lvbkV4cG9ydHMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgdGFnUmVzdWx0czogTWFwPHN0cmluZywgU2V0PHN0cmluZz4+ID0gbmV3IE1hcCgpO1xuICBhd2FpdCBQcm9taXNlLmFsbChPYmplY3Qua2V5cyhwYXJhbWV0ZXJzKS5tYXAoYXN5bmMgKG5hbWU6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGlzSW5Vc2Uoc3NtLCBuYW1lKTtcbiAgICBpZiAocmVzdWx0LnNpemUgPiAwKSB7XG4gICAgICB0YWdSZXN1bHRzLnNldChuYW1lLCByZXN1bHQpO1xuICAgIH1cbiAgfSkpO1xuXG4gIGlmICh0YWdSZXN1bHRzLnNpemUgPiAwKSB7XG4gICAgY29uc3QgbWVzc2FnZTogc3RyaW5nID0gT2JqZWN0LmVudHJpZXModGFnUmVzdWx0cylcbiAgICAgIC5tYXAoKHJlc3VsdDogW3N0cmluZywgc3RyaW5nW11dKSA9PiBgJHtyZXN1bHRbMF19IGlzIGluIHVzZSBieSBzdGFjayhzKSAke3Jlc3VsdFsxXS5qb2luKCcgJyl9YClcbiAgICAgIC5qb2luKCdcXG4nKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cG9ydHMgY2Fubm90IGJlIHVwZGF0ZWQ6IFxcbiR7bWVzc2FnZX1gKTtcbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIGlmIGEgcGFyYW1ldGVyIGlzIGluIHVzZVxuICovXG5hc3luYyBmdW5jdGlvbiBpc0luVXNlKHNzbTogU1NNLCBwYXJhbWV0ZXJOYW1lOiBzdHJpbmcpOiBQcm9taXNlPFNldDxzdHJpbmc+PiB7XG4gIGNvbnN0IHRhZ1Jlc3VsdHM6IFNldDxzdHJpbmc+ID0gbmV3IFNldCgpO1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNzbS5saXN0VGFnc0ZvclJlc291cmNlKHtcbiAgICAgIFJlc291cmNlSWQ6IHBhcmFtZXRlck5hbWUsXG4gICAgICBSZXNvdXJjZVR5cGU6ICdQYXJhbWV0ZXInLFxuICAgIH0pLnByb21pc2UoKTtcbiAgICByZXN1bHQuVGFnTGlzdD8uZm9yRWFjaCh0YWcgPT4ge1xuICAgICAgY29uc3QgdGFnUGFydHMgPSB0YWcuS2V5LnNwbGl0KCc6Jyk7XG4gICAgICBpZiAodGFnUGFydHNbMF0gPT09ICdhd3MtY2RrJyAmJiB0YWdQYXJ0c1sxXSA9PT0gJ3N0cm9uZy1yZWYnKSB7XG4gICAgICAgIHRhZ1Jlc3VsdHMuYWRkKHRhZ1BhcnRzWzJdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIGFuIEludmFsaWRSZXNvdXJjZUlkIG1lYW5zIHRoYXQgdGhlIHBhcmFtZXRlciBkb2Vzbid0IGV4aXN0XG4gICAgLy8gd2hpY2ggd2Ugc2hvdWxkIGlnbm9yZSBzaW5jZSB0aGF0IG1lYW5zIGl0J3Mgbm90IGluIHVzZVxuICAgIGlmIChlLmNvZGUgPT09ICdJbnZhbGlkUmVzb3VyY2VJZCcpIHtcbiAgICAgIHJldHVybiBuZXcgU2V0KCk7XG4gICAgfVxuICAgIHRocm93IGU7XG4gIH1cbiAgcmV0dXJuIHRhZ1Jlc3VsdHM7XG59XG5cbi8qKlxuICogUmV0dXJuIG9ubHkgdGhlIGl0ZW1zIGZyb20gc291cmNlIHRoYXQgZG8gbm90IGV4aXN0IGluIHRoZSBmaWx0ZXJcbiAqXG4gKiBAcGFyYW0gc291cmNlIHRoZSBzb3VyY2Ugb2JqZWN0IHRvIHBlcmZvcm0gdGhlIGZpbHRlciBvblxuICogQHBhcmFtIGZpbHRlciBmaWx0ZXIgb3V0IGl0ZW1zIHRoYXQgZXhpc3QgaW4gdGhpcyBvYmplY3RcbiAqIEByZXR1cm5zIGFueSBleHBvcnRzIHRoYXQgZG9uJ3QgZXhpc3QgaW4gdGhlIGZpbHRlclxuICovXG5mdW5jdGlvbiBleGNlcHQoc291cmNlOiBDcm9zc1JlZ2lvbkV4cG9ydHMsIGZpbHRlcjogQ3Jvc3NSZWdpb25FeHBvcnRzKTogQ3Jvc3NSZWdpb25FeHBvcnRzIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHNvdXJjZSlcbiAgICAuZmlsdGVyKGtleSA9PiAoIWZpbHRlci5oYXNPd25Qcm9wZXJ0eShrZXkpKSlcbiAgICAucmVkdWNlKChhY2M6IENyb3NzUmVnaW9uRXhwb3J0cywgY3Vycjogc3RyaW5nKSA9PiB7XG4gICAgICBhY2NbY3Vycl0gPSBzb3VyY2VbY3Vycl07XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gaXRlbXMgdGhhdCBleGlzdCBpbiBib3RoIHRoZSB0aGUgb2xkIHBhcmFtZXRlcnMgYW5kIHRoZSBuZXcgcGFyYW1ldGVycyxcbiAqIGJ1dCBoYXZlIGRpZmZlcmVudCB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0gb2xkUGFyYW1zIHRoZSBleHBvcnRzIHRoYXQgZXhpc3RlZCBwcmV2aW91cyB0byB0aGlzIGV4ZWN1dGlvblxuICogQHBhcmFtIG5ld1BhcmFtcyB0aGUgZXhwb3J0cyBmb3IgdGhlIGN1cnJlbnQgZXhlY3V0aW9uXG4gKiBAcmV0dXJucyBhbnkgcGFyYW1ldGVycyB0aGF0IGhhdmUgZGlmZmVyZW50IHZhbHVlc1xuICovXG5mdW5jdGlvbiBjaGFuZ2VkKG9sZFBhcmFtczogQ3Jvc3NSZWdpb25FeHBvcnRzLCBuZXdQYXJhbXM6IENyb3NzUmVnaW9uRXhwb3J0cyk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9sZFBhcmFtcylcbiAgICAuZmlsdGVyKGtleSA9PiAobmV3UGFyYW1zLmhhc093blByb3BlcnR5KGtleSkgJiYgb2xkUGFyYW1zW2tleV0gIT09IG5ld1BhcmFtc1trZXldKSlcbiAgICAucmVkdWNlKChhY2M6IHN0cmluZ1tdLCBjdXJyOiBzdHJpbmcpID0+IHtcbiAgICAgIGFjYy5wdXNoKGN1cnIpO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCBbXSk7XG59XG4iXX0=