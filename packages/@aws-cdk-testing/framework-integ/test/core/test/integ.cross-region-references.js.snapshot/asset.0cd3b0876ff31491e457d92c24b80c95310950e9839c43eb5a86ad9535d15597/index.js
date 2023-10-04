"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
/*eslint-disable no-console*/
/* eslint-disable import/no-extraneous-dependencies */
const client_ssm_1 = require("@aws-sdk/client-ssm");
async function handler(event) {
    const props = event.ResourceProperties.WriterProps;
    const exports = props.exports;
    const ssm = new client_ssm_1.SSM({ region: props.region });
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
                const removedExportsNames = Object.keys(removedExports);
                // this method will skip if no export names are to be deleted
                await deleteParameters(ssm, removedExportsNames);
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
                await deleteParameters(ssm, Object.keys(exports));
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
        });
    }));
}
/**
 * Delete parameters no longer in use.
 * From https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_DeleteParameters.html there
 * is a constraint on names. It must have size at least 1 and at most 10.
 */
async function deleteParameters(ssm, names) {
    // max allowed by DeleteParameters api
    const maxSize = 10;
    for (let chunkStartIdx = 0; chunkStartIdx < names.length; chunkStartIdx += maxSize) {
        const chunkOfNames = names.slice(chunkStartIdx, chunkStartIdx + maxSize);
        // also observe minimum size constraint: Names parameter must have size at least 1
        if (chunkOfNames.length > 0) {
            await ssm.deleteParameters({
                Names: chunkOfNames,
            });
        }
    }
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
        });
        result.TagList?.forEach(tag => {
            const tagParts = tag.Key?.split(':') ?? [];
            if (tagParts[0] === 'aws-cdk' && tagParts[1] === 'strong-ref') {
                tagResults.add(tagParts[2]);
            }
        });
    }
    catch (e) {
        // an InvalidResourceId means that the parameter doesn't exist
        // which we should ignore since that means it's not in use
        if (e.name === 'InvalidResourceId') {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0Isc0RBQXNEO0FBQ3RELG9EQUEwQztBQUduQyxLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtEO0lBQzlFLE1BQU0sS0FBSyxHQUF3QixLQUFLLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDO0lBQ3hFLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUE2QixDQUFDO0lBRXBELE1BQU0sR0FBRyxHQUFHLElBQUksZ0JBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUM5QyxJQUFJO1FBQ0YsUUFBUSxLQUFLLENBQUMsV0FBVyxFQUFFO1lBQ3pCLEtBQUssUUFBUTtnQkFDWCxPQUFPLENBQUMsSUFBSSxDQUFDLGdEQUFnRCxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztnQkFDN0UsTUFBTSxlQUFlLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNwQyxNQUFNLGFBQWEsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ2xDLE9BQU87WUFDVCxLQUFLLFFBQVE7Z0JBQ1gsTUFBTSxRQUFRLEdBQXdCLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUM7Z0JBQzlFLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxPQUE2QixDQUFDO2dCQUMxRCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUUvQyx3RUFBd0U7Z0JBQ3hFLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3BELElBQUksY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLEdBQUUsY0FBYyxDQUFD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QztRQUNmLE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSovXG4vKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMgKi9cbmltcG9ydCB7IFNTTSB9IGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1zc20nO1xuaW1wb3J0IHsgQ3Jvc3NSZWdpb25FeHBvcnRzLCBFeHBvcnRXcml0ZXJDUlByb3BzIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCkge1xuICBjb25zdCBwcm9wczogRXhwb3J0V3JpdGVyQ1JQcm9wcyA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Xcml0ZXJQcm9wcztcbiAgY29uc3QgZXhwb3J0cyA9IHByb3BzLmV4cG9ydHMgYXMgQ3Jvc3NSZWdpb25FeHBvcnRzO1xuXG4gIGNvbnN0IHNzbSA9IG5ldyBTU00oeyByZWdpb246IHByb3BzLnJlZ2lvbiB9KTtcbiAgdHJ5IHtcbiAgICBzd2l0Y2ggKGV2ZW50LlJlcXVlc3RUeXBlKSB7XG4gICAgICBjYXNlICdDcmVhdGUnOlxuICAgICAgICBjb25zb2xlLmluZm8oYENyZWF0aW5nIG5ldyBTU00gUGFyYW1ldGVyIGV4cG9ydHMgaW4gcmVnaW9uICR7cHJvcHMucmVnaW9ufWApO1xuICAgICAgICBhd2FpdCB0aHJvd0lmQW55SW5Vc2Uoc3NtLCBleHBvcnRzKTtcbiAgICAgICAgYXdhaXQgcHV0UGFyYW1ldGVycyhzc20sIGV4cG9ydHMpO1xuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlICdVcGRhdGUnOlxuICAgICAgICBjb25zdCBvbGRQcm9wczogRXhwb3J0V3JpdGVyQ1JQcm9wcyA9IGV2ZW50Lk9sZFJlc291cmNlUHJvcGVydGllcy5Xcml0ZXJQcm9wcztcbiAgICAgICAgY29uc3Qgb2xkRXhwb3J0cyA9IG9sZFByb3BzLmV4cG9ydHMgYXMgQ3Jvc3NSZWdpb25FeHBvcnRzO1xuICAgICAgICBjb25zdCBuZXdFeHBvcnRzID0gZXhjZXB0KGV4cG9ydHMsIG9sZEV4cG9ydHMpO1xuXG4gICAgICAgIC8vIHRocm93IGFuIGVycm9yIHRvIGZhaWwgdGhlIGRlcGxveW1lbnQgaWYgYW55IGV4cG9ydCB2YWx1ZSBpcyBjaGFuZ2luZ1xuICAgICAgICBjb25zdCBjaGFuZ2VkRXhwb3J0cyA9IGNoYW5nZWQob2xkRXhwb3J0cywgZXhwb3J0cyk7XG4gICAgICAgIGlmIChjaGFuZ2VkRXhwb3J0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTb21lIGV4cG9ydHMgaGF2ZSBjaGFuZ2VkIVxcbicrIGNoYW5nZWRFeHBvcnRzLmpvaW4oJ1xcbicpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiB3ZSBhcmUgcmVtb3ZpbmcgYW55IGV4cG9ydHMgdGhhdCBhcmUgaW4gdXNlLCB0aGVuIHRocm93IGFuXG4gICAgICAgIC8vIGVycm9yIHRvIGZhaWwgdGhlIGRlcGxveW1lbnRcbiAgICAgICAgY29uc3QgcmVtb3ZlZEV4cG9ydHMgPSBleGNlcHQob2xkRXhwb3J0cywgZXhwb3J0cyk7XG4gICAgICAgIGF3YWl0IHRocm93SWZBbnlJblVzZShzc20sIHJlbW92ZWRFeHBvcnRzKTtcbiAgICAgICAgLy8gaWYgdGhlIG9uZXMgd2UgYXJlIHJlbW92aW5nIGFyZSBub3QgaW4gdXNlIHRoZW4gZGVsZXRlIHRoZW1cbiAgICAgICAgY29uc3QgcmVtb3ZlZEV4cG9ydHNOYW1lcyA9IE9iamVjdC5rZXlzKHJlbW92ZWRFeHBvcnRzKTtcbiAgICAgICAgLy8gdGhpcyBtZXRob2Qgd2lsbCBza2lwIGlmIG5vIGV4cG9ydCBuYW1lcyBhcmUgdG8gYmUgZGVsZXRlZFxuICAgICAgICBhd2FpdCBkZWxldGVQYXJhbWV0ZXJzKHNzbSwgcmVtb3ZlZEV4cG9ydHNOYW1lcyk7XG5cbiAgICAgICAgLy8gYWxzbyB0aHJvdyBhbiBlcnJvciBpZiB3ZSBhcmUgY3JlYXRpbmcgYSBuZXcgZXhwb3J0IHRoYXQgYWxyZWFkeSBleGlzdHMgZm9yIHNvbWUgcmVhc29uXG4gICAgICAgIGF3YWl0IHRocm93SWZBbnlJblVzZShzc20sIG5ld0V4cG9ydHMpO1xuICAgICAgICBjb25zb2xlLmluZm8oYENyZWF0aW5nIG5ldyBTU00gUGFyYW1ldGVyIGV4cG9ydHMgaW4gcmVnaW9uICR7cHJvcHMucmVnaW9ufWApO1xuICAgICAgICBhd2FpdCBwdXRQYXJhbWV0ZXJzKHNzbSwgbmV3RXhwb3J0cyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgJ0RlbGV0ZSc6XG4gICAgICAgIC8vIGlmIGFueSBvZiB0aGUgZXhwb3J0cyBhcmUgY3VycmVudGx5IGluIHVzZSB0aGVuIHRocm93IGFuIGVycm9yIHRvIGZhaWxcbiAgICAgICAgLy8gdGhlIHN0YWNrIGRlbGV0aW9uLlxuICAgICAgICBhd2FpdCB0aHJvd0lmQW55SW5Vc2Uoc3NtLCBleHBvcnRzKTtcbiAgICAgICAgLy8gaWYgbm9uZSBhcmUgaW4gdXNlIHRoZW4gZGVsZXRlIGFsbCBvZiB0aGVtXG4gICAgICAgIGF3YWl0IGRlbGV0ZVBhcmFtZXRlcnMoc3NtLCBPYmplY3Qua2V5cyhleHBvcnRzKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwcm9jZXNzaW5nIGV2ZW50OiAnLCBlKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuXG4vKipcbiAqIENyZWF0ZSBwYXJhbWV0ZXJzIGZvciBleGlzdGluZyBleHBvcnRzXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHB1dFBhcmFtZXRlcnMoc3NtOiBTU00sIHBhcmFtZXRlcnM6IENyb3NzUmVnaW9uRXhwb3J0cyk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBQcm9taXNlLmFsbChBcnJheS5mcm9tKE9iamVjdC5lbnRyaWVzKHBhcmFtZXRlcnMpLCAoW25hbWUsIHZhbHVlXSkgPT4ge1xuICAgIHJldHVybiBzc20ucHV0UGFyYW1ldGVyKHtcbiAgICAgIE5hbWU6IG5hbWUsXG4gICAgICBWYWx1ZTogdmFsdWUsXG4gICAgICBUeXBlOiAnU3RyaW5nJyxcbiAgICB9KTtcbiAgfSkpO1xufVxuXG4vKipcbiAqIERlbGV0ZSBwYXJhbWV0ZXJzIG5vIGxvbmdlciBpbiB1c2UuXG4gKiBGcm9tIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zeXN0ZW1zLW1hbmFnZXIvbGF0ZXN0L0FQSVJlZmVyZW5jZS9BUElfRGVsZXRlUGFyYW1ldGVycy5odG1sIHRoZXJlXG4gKiBpcyBhIGNvbnN0cmFpbnQgb24gbmFtZXMuIEl0IG11c3QgaGF2ZSBzaXplIGF0IGxlYXN0IDEgYW5kIGF0IG1vc3QgMTAuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVBhcmFtZXRlcnMoc3NtOiBTU00sIG5hbWVzOiBzdHJpbmdbXSkge1xuICAvLyBtYXggYWxsb3dlZCBieSBEZWxldGVQYXJhbWV0ZXJzIGFwaVxuICBjb25zdCBtYXhTaXplID0gMTA7XG4gIGZvciAobGV0IGNodW5rU3RhcnRJZHggPSAwOyBjaHVua1N0YXJ0SWR4IDwgbmFtZXMubGVuZ3RoOyBjaHVua1N0YXJ0SWR4ICs9IG1heFNpemUpIHtcbiAgICBjb25zdCBjaHVua09mTmFtZXMgPSBuYW1lcy5zbGljZShjaHVua1N0YXJ0SWR4LCBjaHVua1N0YXJ0SWR4ICsgbWF4U2l6ZSk7XG4gICAgLy8gYWxzbyBvYnNlcnZlIG1pbmltdW0gc2l6ZSBjb25zdHJhaW50OiBOYW1lcyBwYXJhbWV0ZXIgbXVzdCBoYXZlIHNpemUgYXQgbGVhc3QgMVxuICAgIGlmIChjaHVua09mTmFtZXMubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgc3NtLmRlbGV0ZVBhcmFtZXRlcnMoe1xuICAgICAgICBOYW1lczogY2h1bmtPZk5hbWVzLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUXVlcnkgZm9yIGV4aXN0aW5nIHBhcmFtZXRlcnMgdGhhdCBhcmUgaW4gdXNlXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHRocm93SWZBbnlJblVzZShzc206IFNTTSwgcGFyYW1ldGVyczogQ3Jvc3NSZWdpb25FeHBvcnRzKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHRhZ1Jlc3VsdHM6IE1hcDxzdHJpbmcsIFNldDxzdHJpbmc+PiA9IG5ldyBNYXAoKTtcbiAgYXdhaXQgUHJvbWlzZS5hbGwoT2JqZWN0LmtleXMocGFyYW1ldGVycykubWFwKGFzeW5jIChuYW1lOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBpc0luVXNlKHNzbSwgbmFtZSk7XG4gICAgaWYgKHJlc3VsdC5zaXplID4gMCkge1xuICAgICAgdGFnUmVzdWx0cy5zZXQobmFtZSwgcmVzdWx0KTtcbiAgICB9XG4gIH0pKTtcblxuICBpZiAodGFnUmVzdWx0cy5zaXplID4gMCkge1xuICAgIGNvbnN0IG1lc3NhZ2U6IHN0cmluZyA9IE9iamVjdC5lbnRyaWVzKHRhZ1Jlc3VsdHMpXG4gICAgICAubWFwKChyZXN1bHQ6IFtzdHJpbmcsIHN0cmluZ1tdXSkgPT4gYCR7cmVzdWx0WzBdfSBpcyBpbiB1c2UgYnkgc3RhY2socykgJHtyZXN1bHRbMV0uam9pbignICcpfWApXG4gICAgICAuam9pbignXFxuJyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBFeHBvcnRzIGNhbm5vdCBiZSB1cGRhdGVkOiBcXG4ke21lc3NhZ2V9YCk7XG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhIHBhcmFtZXRlciBpcyBpbiB1c2VcbiAqL1xuYXN5bmMgZnVuY3Rpb24gaXNJblVzZShzc206IFNTTSwgcGFyYW1ldGVyTmFtZTogc3RyaW5nKTogUHJvbWlzZTxTZXQ8c3RyaW5nPj4ge1xuICBjb25zdCB0YWdSZXN1bHRzOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBzc20ubGlzdFRhZ3NGb3JSZXNvdXJjZSh7XG4gICAgICBSZXNvdXJjZUlkOiBwYXJhbWV0ZXJOYW1lLFxuICAgICAgUmVzb3VyY2VUeXBlOiAnUGFyYW1ldGVyJyxcbiAgICB9KTtcbiAgICByZXN1bHQuVGFnTGlzdD8uZm9yRWFjaCh0YWcgPT4ge1xuICAgICAgY29uc3QgdGFnUGFydHMgPSB0YWcuS2V5Py5zcGxpdCgnOicpID8/IFtdO1xuICAgICAgaWYgKHRhZ1BhcnRzWzBdID09PSAnYXdzLWNkaycgJiYgdGFnUGFydHNbMV0gPT09ICdzdHJvbmctcmVmJykge1xuICAgICAgICB0YWdSZXN1bHRzLmFkZCh0YWdQYXJ0c1syXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgIC8vIGFuIEludmFsaWRSZXNvdXJjZUlkIG1lYW5zIHRoYXQgdGhlIHBhcmFtZXRlciBkb2Vzbid0IGV4aXN0XG4gICAgLy8gd2hpY2ggd2Ugc2hvdWxkIGlnbm9yZSBzaW5jZSB0aGF0IG1lYW5zIGl0J3Mgbm90IGluIHVzZVxuICAgIGlmIChlLm5hbWUgPT09ICdJbnZhbGlkUmVzb3VyY2VJZCcpIHtcbiAgICAgIHJldHVybiBuZXcgU2V0KCk7XG4gICAgfVxuICAgIHRocm93IGU7XG4gIH1cbiAgcmV0dXJuIHRhZ1Jlc3VsdHM7XG59XG5cbi8qKlxuICogUmV0dXJuIG9ubHkgdGhlIGl0ZW1zIGZyb20gc291cmNlIHRoYXQgZG8gbm90IGV4aXN0IGluIHRoZSBmaWx0ZXJcbiAqXG4gKiBAcGFyYW0gc291cmNlIHRoZSBzb3VyY2Ugb2JqZWN0IHRvIHBlcmZvcm0gdGhlIGZpbHRlciBvblxuICogQHBhcmFtIGZpbHRlciBmaWx0ZXIgb3V0IGl0ZW1zIHRoYXQgZXhpc3QgaW4gdGhpcyBvYmplY3RcbiAqIEByZXR1cm5zIGFueSBleHBvcnRzIHRoYXQgZG9uJ3QgZXhpc3QgaW4gdGhlIGZpbHRlclxuICovXG5mdW5jdGlvbiBleGNlcHQoc291cmNlOiBDcm9zc1JlZ2lvbkV4cG9ydHMsIGZpbHRlcjogQ3Jvc3NSZWdpb25FeHBvcnRzKTogQ3Jvc3NSZWdpb25FeHBvcnRzIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHNvdXJjZSlcbiAgICAuZmlsdGVyKGtleSA9PiAoIWZpbHRlci5oYXNPd25Qcm9wZXJ0eShrZXkpKSlcbiAgICAucmVkdWNlKChhY2M6IENyb3NzUmVnaW9uRXhwb3J0cywgY3Vycjogc3RyaW5nKSA9PiB7XG4gICAgICBhY2NbY3Vycl0gPSBzb3VyY2VbY3Vycl07XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gaXRlbXMgdGhhdCBleGlzdCBpbiBib3RoIHRoZSB0aGUgb2xkIHBhcmFtZXRlcnMgYW5kIHRoZSBuZXcgcGFyYW1ldGVycyxcbiAqIGJ1dCBoYXZlIGRpZmZlcmVudCB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0gb2xkUGFyYW1zIHRoZSBleHBvcnRzIHRoYXQgZXhpc3RlZCBwcmV2aW91cyB0byB0aGlzIGV4ZWN1dGlvblxuICogQHBhcmFtIG5ld1BhcmFtcyB0aGUgZXhwb3J0cyBmb3IgdGhlIGN1cnJlbnQgZXhlY3V0aW9uXG4gKiBAcmV0dXJucyBhbnkgcGFyYW1ldGVycyB0aGF0IGhhdmUgZGlmZmVyZW50IHZhbHVlc1xuICovXG5mdW5jdGlvbiBjaGFuZ2VkKG9sZFBhcmFtczogQ3Jvc3NSZWdpb25FeHBvcnRzLCBuZXdQYXJhbXM6IENyb3NzUmVnaW9uRXhwb3J0cyk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9sZFBhcmFtcylcbiAgICAuZmlsdGVyKGtleSA9PiAobmV3UGFyYW1zLmhhc093blByb3BlcnR5KGtleSkgJiYgb2xkUGFyYW1zW2tleV0gIT09IG5ld1BhcmFtc1trZXldKSlcbiAgICAucmVkdWNlKChhY2M6IHN0cmluZ1tdLCBjdXJyOiBzdHJpbmcpID0+IHtcbiAgICAgIGFjYy5wdXNoKGN1cnIpO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCBbXSk7XG59XG4iXX0=