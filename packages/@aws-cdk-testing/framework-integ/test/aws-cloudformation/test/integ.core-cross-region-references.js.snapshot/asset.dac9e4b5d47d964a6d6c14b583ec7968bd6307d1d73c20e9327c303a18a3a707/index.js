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
                // skip if no export names are to be deleted
                const removedExportsNames = Object.keys(removedExports);
                if (removedExportsNames.length > 0) {
                    await ssm.deleteParameters({
                        Names: removedExportsNames,
                    });
                }
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
                });
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
        if (e instanceof client_ssm_1.InvalidResourceId) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0Isc0RBQXNEO0FBQ3RELG9EQUE2RDtBQUd0RCxLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtEO0lBQzlFLE1BQU0sS0FBSyxHQUF3QixLQUFLLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDO0lBQ3hFLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUE2QixDQUFDO0lBRXBELE1BQU0sR0FBRyxHQUFHLElBQUksZ0JBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUM5QyxJQUFJO1FBQ0YsUUFBUSxLQUFLLENBQUMsV0FBVyxFQUFFO1lBQ3pCLEtBQUssUUFBUTtnQkFDWCxPQUFPLENBQUMsSUFBSSxDQUFDLGdEQUFnRCxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztnQkFDN0UsTUFBTSxlQUFlLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNwQyxNQUFNLGFBQWEsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ2xDLE9BQU87WUFDVCxLQUFLLFFBQVE7Z0JBQ1gsTUFBTSxRQUFRLEdBQXdCLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUM7Z0JBQzlFLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxPQUE2QixDQUFDO2dCQUMxRCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUUvQyx3RUFBd0U7Z0JBQ3hFLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3BELElBQUksY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLEdBQUUsY0FBYyxDQUFD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SUFBSSxDQUFDLE1BQU0sQ0FBQztTQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQzVDLE1BQU0sQ0FBQyxDQUFDLEdBQXVCLEVBQUUsSUFBWSxFQUFFLEVBQUU7UUFDaEQsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNYLENBQUM7QUFFRDs7Ozs7OztHQU9HO0FBQ0gsU0FBUyxPQUFPLENBQUMsU0FBNkIsRUFBRSxTQUE2QjtJQUMzRSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQzFCLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDbkYsTUFBTSxDQUFDLENBQUMsR0FBYSxFQUFFLElBQVksRUFBRSxFQUFFO1FBQ3RDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDZixPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNYLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKmVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUqL1xuLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzICovXG5pbXBvcnQgeyBJbnZhbGlkUmVzb3VyY2VJZCwgU1NNIH0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LXNzbSc7XG5pbXBvcnQgeyBDcm9zc1JlZ2lvbkV4cG9ydHMsIEV4cG9ydFdyaXRlckNSUHJvcHMgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50KSB7XG4gIGNvbnN0IHByb3BzOiBFeHBvcnRXcml0ZXJDUlByb3BzID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLldyaXRlclByb3BzO1xuICBjb25zdCBleHBvcnRzID0gcHJvcHMuZXhwb3J0cyBhcyBDcm9zc1JlZ2lvbkV4cG9ydHM7XG5cbiAgY29uc3Qgc3NtID0gbmV3IFNTTSh7IHJlZ2lvbjogcHJvcHMucmVnaW9uIH0pO1xuICB0cnkge1xuICAgIHN3aXRjaCAoZXZlbnQuUmVxdWVzdFR5cGUpIHtcbiAgICAgIGNhc2UgJ0NyZWF0ZSc6XG4gICAgICAgIGNvbnNvbGUuaW5mbyhgQ3JlYXRpbmcgbmV3IFNTTSBQYXJhbWV0ZXIgZXhwb3J0cyBpbiByZWdpb24gJHtwcm9wcy5yZWdpb259YCk7XG4gICAgICAgIGF3YWl0IHRocm93SWZBbnlJblVzZShzc20sIGV4cG9ydHMpO1xuICAgICAgICBhd2FpdCBwdXRQYXJhbWV0ZXJzKHNzbSwgZXhwb3J0cyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgJ1VwZGF0ZSc6XG4gICAgICAgIGNvbnN0IG9sZFByb3BzOiBFeHBvcnRXcml0ZXJDUlByb3BzID0gZXZlbnQuT2xkUmVzb3VyY2VQcm9wZXJ0aWVzLldyaXRlclByb3BzO1xuICAgICAgICBjb25zdCBvbGRFeHBvcnRzID0gb2xkUHJvcHMuZXhwb3J0cyBhcyBDcm9zc1JlZ2lvbkV4cG9ydHM7XG4gICAgICAgIGNvbnN0IG5ld0V4cG9ydHMgPSBleGNlcHQoZXhwb3J0cywgb2xkRXhwb3J0cyk7XG5cbiAgICAgICAgLy8gdGhyb3cgYW4gZXJyb3IgdG8gZmFpbCB0aGUgZGVwbG95bWVudCBpZiBhbnkgZXhwb3J0IHZhbHVlIGlzIGNoYW5naW5nXG4gICAgICAgIGNvbnN0IGNoYW5nZWRFeHBvcnRzID0gY2hhbmdlZChvbGRFeHBvcnRzLCBleHBvcnRzKTtcbiAgICAgICAgaWYgKGNoYW5nZWRFeHBvcnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbWUgZXhwb3J0cyBoYXZlIGNoYW5nZWQhXFxuJysgY2hhbmdlZEV4cG9ydHMuam9pbignXFxuJykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmIHdlIGFyZSByZW1vdmluZyBhbnkgZXhwb3J0cyB0aGF0IGFyZSBpbiB1c2UsIHRoZW4gdGhyb3cgYW5cbiAgICAgICAgLy8gZXJyb3IgdG8gZmFpbCB0aGUgZGVwbG95bWVudFxuICAgICAgICBjb25zdCByZW1vdmVkRXhwb3J0cyA9IGV4Y2VwdChvbGRFeHBvcnRzLCBleHBvcnRzKTtcbiAgICAgICAgYXdhaXQgdGhyb3dJZkFueUluVXNlKHNzbSwgcmVtb3ZlZEV4cG9ydHMpO1xuICAgICAgICAvLyBpZiB0aGUgb25lcyB3ZSBhcmUgcmVtb3ZpbmcgYXJlIG5vdCBpbiB1c2UgdGhlbiBkZWxldGUgdGhlbVxuICAgICAgICAvLyBza2lwIGlmIG5vIGV4cG9ydCBuYW1lcyBhcmUgdG8gYmUgZGVsZXRlZFxuICAgICAgICBjb25zdCByZW1vdmVkRXhwb3J0c05hbWVzID0gT2JqZWN0LmtleXMocmVtb3ZlZEV4cG9ydHMpO1xuICAgICAgICBpZiAocmVtb3ZlZEV4cG9ydHNOYW1lcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgYXdhaXQgc3NtLmRlbGV0ZVBhcmFtZXRlcnMoe1xuICAgICAgICAgICAgTmFtZXM6IHJlbW92ZWRFeHBvcnRzTmFtZXMsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhbHNvIHRocm93IGFuIGVycm9yIGlmIHdlIGFyZSBjcmVhdGluZyBhIG5ldyBleHBvcnQgdGhhdCBhbHJlYWR5IGV4aXN0cyBmb3Igc29tZSByZWFzb25cbiAgICAgICAgYXdhaXQgdGhyb3dJZkFueUluVXNlKHNzbSwgbmV3RXhwb3J0cyk7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhgQ3JlYXRpbmcgbmV3IFNTTSBQYXJhbWV0ZXIgZXhwb3J0cyBpbiByZWdpb24gJHtwcm9wcy5yZWdpb259YCk7XG4gICAgICAgIGF3YWl0IHB1dFBhcmFtZXRlcnMoc3NtLCBuZXdFeHBvcnRzKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgICAgLy8gaWYgYW55IG9mIHRoZSBleHBvcnRzIGFyZSBjdXJyZW50bHkgaW4gdXNlIHRoZW4gdGhyb3cgYW4gZXJyb3IgdG8gZmFpbFxuICAgICAgICAvLyB0aGUgc3RhY2sgZGVsZXRpb24uXG4gICAgICAgIGF3YWl0IHRocm93SWZBbnlJblVzZShzc20sIGV4cG9ydHMpO1xuICAgICAgICAvLyBpZiBub25lIGFyZSBpbiB1c2UgdGhlbiBkZWxldGUgYWxsIG9mIHRoZW1cbiAgICAgICAgYXdhaXQgc3NtLmRlbGV0ZVBhcmFtZXRlcnMoe1xuICAgICAgICAgIE5hbWVzOiBPYmplY3Qua2V5cyhleHBvcnRzKSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwcm9jZXNzaW5nIGV2ZW50OiAnLCBlKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuXG4vKipcbiAqIENyZWF0ZSBwYXJhbWV0ZXJzIGZvciBleGlzdGluZyBleHBvcnRzXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHB1dFBhcmFtZXRlcnMoc3NtOiBTU00sIHBhcmFtZXRlcnM6IENyb3NzUmVnaW9uRXhwb3J0cyk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBQcm9taXNlLmFsbChBcnJheS5mcm9tKE9iamVjdC5lbnRyaWVzKHBhcmFtZXRlcnMpLCAoW25hbWUsIHZhbHVlXSkgPT4ge1xuICAgIHJldHVybiBzc20ucHV0UGFyYW1ldGVyKHtcbiAgICAgIE5hbWU6IG5hbWUsXG4gICAgICBWYWx1ZTogdmFsdWUsXG4gICAgICBUeXBlOiAnU3RyaW5nJyxcbiAgICB9KTtcbiAgfSkpO1xufVxuXG4vKipcbiAqIFF1ZXJ5IGZvciBleGlzdGluZyBwYXJhbWV0ZXJzIHRoYXQgYXJlIGluIHVzZVxuICovXG5hc3luYyBmdW5jdGlvbiB0aHJvd0lmQW55SW5Vc2Uoc3NtOiBTU00sIHBhcmFtZXRlcnM6IENyb3NzUmVnaW9uRXhwb3J0cyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB0YWdSZXN1bHRzOiBNYXA8c3RyaW5nLCBTZXQ8c3RyaW5nPj4gPSBuZXcgTWFwKCk7XG4gIGF3YWl0IFByb21pc2UuYWxsKE9iamVjdC5rZXlzKHBhcmFtZXRlcnMpLm1hcChhc3luYyAobmFtZTogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgaXNJblVzZShzc20sIG5hbWUpO1xuICAgIGlmIChyZXN1bHQuc2l6ZSA+IDApIHtcbiAgICAgIHRhZ1Jlc3VsdHMuc2V0KG5hbWUsIHJlc3VsdCk7XG4gICAgfVxuICB9KSk7XG5cbiAgaWYgKHRhZ1Jlc3VsdHMuc2l6ZSA+IDApIHtcbiAgICBjb25zdCBtZXNzYWdlOiBzdHJpbmcgPSBPYmplY3QuZW50cmllcyh0YWdSZXN1bHRzKVxuICAgICAgLm1hcCgocmVzdWx0OiBbc3RyaW5nLCBzdHJpbmdbXV0pID0+IGAke3Jlc3VsdFswXX0gaXMgaW4gdXNlIGJ5IHN0YWNrKHMpICR7cmVzdWx0WzFdLmpvaW4oJyAnKX1gKVxuICAgICAgLmpvaW4oJ1xcbicpO1xuICAgIHRocm93IG5ldyBFcnJvcihgRXhwb3J0cyBjYW5ub3QgYmUgdXBkYXRlZDogXFxuJHttZXNzYWdlfWApO1xuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYSBwYXJhbWV0ZXIgaXMgaW4gdXNlXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGlzSW5Vc2Uoc3NtOiBTU00sIHBhcmFtZXRlck5hbWU6IHN0cmluZyk6IFByb21pc2U8U2V0PHN0cmluZz4+IHtcbiAgY29uc3QgdGFnUmVzdWx0czogU2V0PHN0cmluZz4gPSBuZXcgU2V0KCk7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc3NtLmxpc3RUYWdzRm9yUmVzb3VyY2Uoe1xuICAgICAgUmVzb3VyY2VJZDogcGFyYW1ldGVyTmFtZSxcbiAgICAgIFJlc291cmNlVHlwZTogJ1BhcmFtZXRlcicsXG4gICAgfSk7XG4gICAgcmVzdWx0LlRhZ0xpc3Q/LmZvckVhY2godGFnID0+IHtcbiAgICAgIGNvbnN0IHRhZ1BhcnRzID0gdGFnLktleT8uc3BsaXQoJzonKSA/PyBbXTtcbiAgICAgIGlmICh0YWdQYXJ0c1swXSA9PT0gJ2F3cy1jZGsnICYmIHRhZ1BhcnRzWzFdID09PSAnc3Ryb25nLXJlZicpIHtcbiAgICAgICAgdGFnUmVzdWx0cy5hZGQodGFnUGFydHNbMl0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAvLyBhbiBJbnZhbGlkUmVzb3VyY2VJZCBtZWFucyB0aGF0IHRoZSBwYXJhbWV0ZXIgZG9lc24ndCBleGlzdFxuICAgIC8vIHdoaWNoIHdlIHNob3VsZCBpZ25vcmUgc2luY2UgdGhhdCBtZWFucyBpdCdzIG5vdCBpbiB1c2VcbiAgICBpZiAoZSBpbnN0YW5jZW9mIEludmFsaWRSZXNvdXJjZUlkKSB7XG4gICAgICByZXR1cm4gbmV3IFNldCgpO1xuICAgIH1cbiAgICB0aHJvdyBlO1xuICB9XG4gIHJldHVybiB0YWdSZXN1bHRzO1xufVxuXG4vKipcbiAqIFJldHVybiBvbmx5IHRoZSBpdGVtcyBmcm9tIHNvdXJjZSB0aGF0IGRvIG5vdCBleGlzdCBpbiB0aGUgZmlsdGVyXG4gKlxuICogQHBhcmFtIHNvdXJjZSB0aGUgc291cmNlIG9iamVjdCB0byBwZXJmb3JtIHRoZSBmaWx0ZXIgb25cbiAqIEBwYXJhbSBmaWx0ZXIgZmlsdGVyIG91dCBpdGVtcyB0aGF0IGV4aXN0IGluIHRoaXMgb2JqZWN0XG4gKiBAcmV0dXJucyBhbnkgZXhwb3J0cyB0aGF0IGRvbid0IGV4aXN0IGluIHRoZSBmaWx0ZXJcbiAqL1xuZnVuY3Rpb24gZXhjZXB0KHNvdXJjZTogQ3Jvc3NSZWdpb25FeHBvcnRzLCBmaWx0ZXI6IENyb3NzUmVnaW9uRXhwb3J0cyk6IENyb3NzUmVnaW9uRXhwb3J0cyB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhzb3VyY2UpXG4gICAgLmZpbHRlcihrZXkgPT4gKCFmaWx0ZXIuaGFzT3duUHJvcGVydHkoa2V5KSkpXG4gICAgLnJlZHVjZSgoYWNjOiBDcm9zc1JlZ2lvbkV4cG9ydHMsIGN1cnI6IHN0cmluZykgPT4ge1xuICAgICAgYWNjW2N1cnJdID0gc291cmNlW2N1cnJdO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG59XG5cbi8qKlxuICogUmV0dXJuIGl0ZW1zIHRoYXQgZXhpc3QgaW4gYm90aCB0aGUgdGhlIG9sZCBwYXJhbWV0ZXJzIGFuZCB0aGUgbmV3IHBhcmFtZXRlcnMsXG4gKiBidXQgaGF2ZSBkaWZmZXJlbnQgdmFsdWVzXG4gKlxuICogQHBhcmFtIG9sZFBhcmFtcyB0aGUgZXhwb3J0cyB0aGF0IGV4aXN0ZWQgcHJldmlvdXMgdG8gdGhpcyBleGVjdXRpb25cbiAqIEBwYXJhbSBuZXdQYXJhbXMgdGhlIGV4cG9ydHMgZm9yIHRoZSBjdXJyZW50IGV4ZWN1dGlvblxuICogQHJldHVybnMgYW55IHBhcmFtZXRlcnMgdGhhdCBoYXZlIGRpZmZlcmVudCB2YWx1ZXNcbiAqL1xuZnVuY3Rpb24gY2hhbmdlZChvbGRQYXJhbXM6IENyb3NzUmVnaW9uRXhwb3J0cywgbmV3UGFyYW1zOiBDcm9zc1JlZ2lvbkV4cG9ydHMpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvbGRQYXJhbXMpXG4gICAgLmZpbHRlcihrZXkgPT4gKG5ld1BhcmFtcy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIG9sZFBhcmFtc1trZXldICE9PSBuZXdQYXJhbXNba2V5XSkpXG4gICAgLnJlZHVjZSgoYWNjOiBzdHJpbmdbXSwgY3Vycjogc3RyaW5nKSA9PiB7XG4gICAgICBhY2MucHVzaChjdXJyKTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwgW10pO1xufVxuIl19