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
    // more testable if we delete in order
    names.sort();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0Isc0RBQXNEO0FBQ3RELG9EQUEwQztBQUduQyxLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtEO0lBQzlFLE1BQU0sS0FBSyxHQUF3QixLQUFLLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDO0lBQ3hFLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUE2QixDQUFDO0lBRXBELE1BQU0sR0FBRyxHQUFHLElBQUksZ0JBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUM5QyxJQUFJO1FBQ0YsUUFBUSxLQUFLLENBQUMsV0FBVyxFQUFFO1lBQ3pCLEtBQUssUUFBUTtnQkFDWCxPQUFPLENBQUMsSUFBSSxDQUFDLGdEQUFnRCxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztnQkFDN0UsTUFBTSxlQUFlLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNwQyxNQUFNLGFBQWEsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ2xDLE9BQU87WUFDVCxLQUFLLFFBQVE7Z0JBQ1gsTUFBTSxRQUFRLEdBQXdCLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUM7Z0JBQzlFLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxPQUE2QixDQUFDO2dCQUMxRCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUUvQyx3RUFBd0U7Z0JBQ3hFLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3BELElBQUksY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLEdBQUUsY0FBYyxDQUFD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QUFFO1FBQ3RDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDZixPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNYLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKmVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUqL1xuLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzICovXG5pbXBvcnQgeyBTU00gfSBmcm9tICdAYXdzLXNkay9jbGllbnQtc3NtJztcbmltcG9ydCB7IENyb3NzUmVnaW9uRXhwb3J0cywgRXhwb3J0V3JpdGVyQ1JQcm9wcyB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQpIHtcbiAgY29uc3QgcHJvcHM6IEV4cG9ydFdyaXRlckNSUHJvcHMgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuV3JpdGVyUHJvcHM7XG4gIGNvbnN0IGV4cG9ydHMgPSBwcm9wcy5leHBvcnRzIGFzIENyb3NzUmVnaW9uRXhwb3J0cztcblxuICBjb25zdCBzc20gPSBuZXcgU1NNKHsgcmVnaW9uOiBwcm9wcy5yZWdpb24gfSk7XG4gIHRyeSB7XG4gICAgc3dpdGNoIChldmVudC5SZXF1ZXN0VHlwZSkge1xuICAgICAgY2FzZSAnQ3JlYXRlJzpcbiAgICAgICAgY29uc29sZS5pbmZvKGBDcmVhdGluZyBuZXcgU1NNIFBhcmFtZXRlciBleHBvcnRzIGluIHJlZ2lvbiAke3Byb3BzLnJlZ2lvbn1gKTtcbiAgICAgICAgYXdhaXQgdGhyb3dJZkFueUluVXNlKHNzbSwgZXhwb3J0cyk7XG4gICAgICAgIGF3YWl0IHB1dFBhcmFtZXRlcnMoc3NtLCBleHBvcnRzKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2FzZSAnVXBkYXRlJzpcbiAgICAgICAgY29uc3Qgb2xkUHJvcHM6IEV4cG9ydFdyaXRlckNSUHJvcHMgPSBldmVudC5PbGRSZXNvdXJjZVByb3BlcnRpZXMuV3JpdGVyUHJvcHM7XG4gICAgICAgIGNvbnN0IG9sZEV4cG9ydHMgPSBvbGRQcm9wcy5leHBvcnRzIGFzIENyb3NzUmVnaW9uRXhwb3J0cztcbiAgICAgICAgY29uc3QgbmV3RXhwb3J0cyA9IGV4Y2VwdChleHBvcnRzLCBvbGRFeHBvcnRzKTtcblxuICAgICAgICAvLyB0aHJvdyBhbiBlcnJvciB0byBmYWlsIHRoZSBkZXBsb3ltZW50IGlmIGFueSBleHBvcnQgdmFsdWUgaXMgY2hhbmdpbmdcbiAgICAgICAgY29uc3QgY2hhbmdlZEV4cG9ydHMgPSBjaGFuZ2VkKG9sZEV4cG9ydHMsIGV4cG9ydHMpO1xuICAgICAgICBpZiAoY2hhbmdlZEV4cG9ydHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU29tZSBleHBvcnRzIGhhdmUgY2hhbmdlZCFcXG4nKyBjaGFuZ2VkRXhwb3J0cy5qb2luKCdcXG4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgd2UgYXJlIHJlbW92aW5nIGFueSBleHBvcnRzIHRoYXQgYXJlIGluIHVzZSwgdGhlbiB0aHJvdyBhblxuICAgICAgICAvLyBlcnJvciB0byBmYWlsIHRoZSBkZXBsb3ltZW50XG4gICAgICAgIGNvbnN0IHJlbW92ZWRFeHBvcnRzID0gZXhjZXB0KG9sZEV4cG9ydHMsIGV4cG9ydHMpO1xuICAgICAgICBhd2FpdCB0aHJvd0lmQW55SW5Vc2Uoc3NtLCByZW1vdmVkRXhwb3J0cyk7XG4gICAgICAgIC8vIGlmIHRoZSBvbmVzIHdlIGFyZSByZW1vdmluZyBhcmUgbm90IGluIHVzZSB0aGVuIGRlbGV0ZSB0aGVtXG4gICAgICAgIGNvbnN0IHJlbW92ZWRFeHBvcnRzTmFtZXMgPSBPYmplY3Qua2V5cyhyZW1vdmVkRXhwb3J0cyk7XG4gICAgICAgIC8vIHRoaXMgbWV0aG9kIHdpbGwgc2tpcCBpZiBubyBleHBvcnQgbmFtZXMgYXJlIHRvIGJlIGRlbGV0ZWRcbiAgICAgICAgYXdhaXQgZGVsZXRlUGFyYW1ldGVycyhzc20sIHJlbW92ZWRFeHBvcnRzTmFtZXMpO1xuXG4gICAgICAgIC8vIGFsc28gdGhyb3cgYW4gZXJyb3IgaWYgd2UgYXJlIGNyZWF0aW5nIGEgbmV3IGV4cG9ydCB0aGF0IGFscmVhZHkgZXhpc3RzIGZvciBzb21lIHJlYXNvblxuICAgICAgICBhd2FpdCB0aHJvd0lmQW55SW5Vc2Uoc3NtLCBuZXdFeHBvcnRzKTtcbiAgICAgICAgY29uc29sZS5pbmZvKGBDcmVhdGluZyBuZXcgU1NNIFBhcmFtZXRlciBleHBvcnRzIGluIHJlZ2lvbiAke3Byb3BzLnJlZ2lvbn1gKTtcbiAgICAgICAgYXdhaXQgcHV0UGFyYW1ldGVycyhzc20sIG5ld0V4cG9ydHMpO1xuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlICdEZWxldGUnOlxuICAgICAgICAvLyBpZiBhbnkgb2YgdGhlIGV4cG9ydHMgYXJlIGN1cnJlbnRseSBpbiB1c2UgdGhlbiB0aHJvdyBhbiBlcnJvciB0byBmYWlsXG4gICAgICAgIC8vIHRoZSBzdGFjayBkZWxldGlvbi5cbiAgICAgICAgYXdhaXQgdGhyb3dJZkFueUluVXNlKHNzbSwgZXhwb3J0cyk7XG4gICAgICAgIC8vIGlmIG5vbmUgYXJlIGluIHVzZSB0aGVuIGRlbGV0ZSBhbGwgb2YgdGhlbVxuICAgICAgICBhd2FpdCBkZWxldGVQYXJhbWV0ZXJzKHNzbSwgT2JqZWN0LmtleXMoZXhwb3J0cykpO1xuICAgICAgICByZXR1cm47XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm47XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgcHJvY2Vzc2luZyBldmVudDogJywgZSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcblxuLyoqXG4gKiBDcmVhdGUgcGFyYW1ldGVycyBmb3IgZXhpc3RpbmcgZXhwb3J0c1xuICovXG5hc3luYyBmdW5jdGlvbiBwdXRQYXJhbWV0ZXJzKHNzbTogU1NNLCBwYXJhbWV0ZXJzOiBDcm9zc1JlZ2lvbkV4cG9ydHMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgUHJvbWlzZS5hbGwoQXJyYXkuZnJvbShPYmplY3QuZW50cmllcyhwYXJhbWV0ZXJzKSwgKFtuYW1lLCB2YWx1ZV0pID0+IHtcbiAgICByZXR1cm4gc3NtLnB1dFBhcmFtZXRlcih7XG4gICAgICBOYW1lOiBuYW1lLFxuICAgICAgVmFsdWU6IHZhbHVlLFxuICAgICAgVHlwZTogJ1N0cmluZycsXG4gICAgfSk7XG4gIH0pKTtcbn1cblxuLyoqXG4gKiBEZWxldGUgcGFyYW1ldGVycyBubyBsb25nZXIgaW4gdXNlLlxuICogRnJvbSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3lzdGVtcy1tYW5hZ2VyL2xhdGVzdC9BUElSZWZlcmVuY2UvQVBJX0RlbGV0ZVBhcmFtZXRlcnMuaHRtbCB0aGVyZVxuICogaXMgYSBjb25zdHJhaW50IG9uIG5hbWVzLiBJdCBtdXN0IGhhdmUgc2l6ZSBhdCBsZWFzdCAxIGFuZCBhdCBtb3N0IDEwLlxuICovXG5hc3luYyBmdW5jdGlvbiBkZWxldGVQYXJhbWV0ZXJzKHNzbTogU1NNLCBuYW1lczogc3RyaW5nW10pIHtcbiAgLy8gbWF4IGFsbG93ZWQgYnkgRGVsZXRlUGFyYW1ldGVycyBhcGlcbiAgY29uc3QgbWF4U2l6ZSA9IDEwO1xuICAvLyBtb3JlIHRlc3RhYmxlIGlmIHdlIGRlbGV0ZSBpbiBvcmRlclxuICBuYW1lcy5zb3J0KCk7XG4gIGZvciAobGV0IGNodW5rU3RhcnRJZHggPSAwOyBjaHVua1N0YXJ0SWR4IDwgbmFtZXMubGVuZ3RoOyBjaHVua1N0YXJ0SWR4ICs9IG1heFNpemUpIHtcbiAgICBjb25zdCBjaHVua09mTmFtZXMgPSBuYW1lcy5zbGljZShjaHVua1N0YXJ0SWR4LCBjaHVua1N0YXJ0SWR4ICsgbWF4U2l6ZSk7XG4gICAgLy8gYWxzbyBvYnNlcnZlIG1pbmltdW0gc2l6ZSBjb25zdHJhaW50OiBOYW1lcyBwYXJhbWV0ZXIgbXVzdCBoYXZlIHNpemUgYXQgbGVhc3QgMVxuICAgIGlmIChjaHVua09mTmFtZXMubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgc3NtLmRlbGV0ZVBhcmFtZXRlcnMoe1xuICAgICAgICBOYW1lczogY2h1bmtPZk5hbWVzLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUXVlcnkgZm9yIGV4aXN0aW5nIHBhcmFtZXRlcnMgdGhhdCBhcmUgaW4gdXNlXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHRocm93SWZBbnlJblVzZShzc206IFNTTSwgcGFyYW1ldGVyczogQ3Jvc3NSZWdpb25FeHBvcnRzKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHRhZ1Jlc3VsdHM6IE1hcDxzdHJpbmcsIFNldDxzdHJpbmc+PiA9IG5ldyBNYXAoKTtcbiAgYXdhaXQgUHJvbWlzZS5hbGwoT2JqZWN0LmtleXMocGFyYW1ldGVycykubWFwKGFzeW5jIChuYW1lOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBpc0luVXNlKHNzbSwgbmFtZSk7XG4gICAgaWYgKHJlc3VsdC5zaXplID4gMCkge1xuICAgICAgdGFnUmVzdWx0cy5zZXQobmFtZSwgcmVzdWx0KTtcbiAgICB9XG4gIH0pKTtcblxuICBpZiAodGFnUmVzdWx0cy5zaXplID4gMCkge1xuICAgIGNvbnN0IG1lc3NhZ2U6IHN0cmluZyA9IE9iamVjdC5lbnRyaWVzKHRhZ1Jlc3VsdHMpXG4gICAgICAubWFwKChyZXN1bHQ6IFtzdHJpbmcsIHN0cmluZ1tdXSkgPT4gYCR7cmVzdWx0WzBdfSBpcyBpbiB1c2UgYnkgc3RhY2socykgJHtyZXN1bHRbMV0uam9pbignICcpfWApXG4gICAgICAuam9pbignXFxuJyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBFeHBvcnRzIGNhbm5vdCBiZSB1cGRhdGVkOiBcXG4ke21lc3NhZ2V9YCk7XG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhIHBhcmFtZXRlciBpcyBpbiB1c2VcbiAqL1xuYXN5bmMgZnVuY3Rpb24gaXNJblVzZShzc206IFNTTSwgcGFyYW1ldGVyTmFtZTogc3RyaW5nKTogUHJvbWlzZTxTZXQ8c3RyaW5nPj4ge1xuICBjb25zdCB0YWdSZXN1bHRzOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBzc20ubGlzdFRhZ3NGb3JSZXNvdXJjZSh7XG4gICAgICBSZXNvdXJjZUlkOiBwYXJhbWV0ZXJOYW1lLFxuICAgICAgUmVzb3VyY2VUeXBlOiAnUGFyYW1ldGVyJyxcbiAgICB9KTtcbiAgICByZXN1bHQuVGFnTGlzdD8uZm9yRWFjaCh0YWcgPT4ge1xuICAgICAgY29uc3QgdGFnUGFydHMgPSB0YWcuS2V5Py5zcGxpdCgnOicpID8/IFtdO1xuICAgICAgaWYgKHRhZ1BhcnRzWzBdID09PSAnYXdzLWNkaycgJiYgdGFnUGFydHNbMV0gPT09ICdzdHJvbmctcmVmJykge1xuICAgICAgICB0YWdSZXN1bHRzLmFkZCh0YWdQYXJ0c1syXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgIC8vIGFuIEludmFsaWRSZXNvdXJjZUlkIG1lYW5zIHRoYXQgdGhlIHBhcmFtZXRlciBkb2Vzbid0IGV4aXN0XG4gICAgLy8gd2hpY2ggd2Ugc2hvdWxkIGlnbm9yZSBzaW5jZSB0aGF0IG1lYW5zIGl0J3Mgbm90IGluIHVzZVxuICAgIGlmIChlLm5hbWUgPT09ICdJbnZhbGlkUmVzb3VyY2VJZCcpIHtcbiAgICAgIHJldHVybiBuZXcgU2V0KCk7XG4gICAgfVxuICAgIHRocm93IGU7XG4gIH1cbiAgcmV0dXJuIHRhZ1Jlc3VsdHM7XG59XG5cbi8qKlxuICogUmV0dXJuIG9ubHkgdGhlIGl0ZW1zIGZyb20gc291cmNlIHRoYXQgZG8gbm90IGV4aXN0IGluIHRoZSBmaWx0ZXJcbiAqXG4gKiBAcGFyYW0gc291cmNlIHRoZSBzb3VyY2Ugb2JqZWN0IHRvIHBlcmZvcm0gdGhlIGZpbHRlciBvblxuICogQHBhcmFtIGZpbHRlciBmaWx0ZXIgb3V0IGl0ZW1zIHRoYXQgZXhpc3QgaW4gdGhpcyBvYmplY3RcbiAqIEByZXR1cm5zIGFueSBleHBvcnRzIHRoYXQgZG9uJ3QgZXhpc3QgaW4gdGhlIGZpbHRlclxuICovXG5mdW5jdGlvbiBleGNlcHQoc291cmNlOiBDcm9zc1JlZ2lvbkV4cG9ydHMsIGZpbHRlcjogQ3Jvc3NSZWdpb25FeHBvcnRzKTogQ3Jvc3NSZWdpb25FeHBvcnRzIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHNvdXJjZSlcbiAgICAuZmlsdGVyKGtleSA9PiAoIWZpbHRlci5oYXNPd25Qcm9wZXJ0eShrZXkpKSlcbiAgICAucmVkdWNlKChhY2M6IENyb3NzUmVnaW9uRXhwb3J0cywgY3Vycjogc3RyaW5nKSA9PiB7XG4gICAgICBhY2NbY3Vycl0gPSBzb3VyY2VbY3Vycl07XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gaXRlbXMgdGhhdCBleGlzdCBpbiBib3RoIHRoZSB0aGUgb2xkIHBhcmFtZXRlcnMgYW5kIHRoZSBuZXcgcGFyYW1ldGVycyxcbiAqIGJ1dCBoYXZlIGRpZmZlcmVudCB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0gb2xkUGFyYW1zIHRoZSBleHBvcnRzIHRoYXQgZXhpc3RlZCBwcmV2aW91cyB0byB0aGlzIGV4ZWN1dGlvblxuICogQHBhcmFtIG5ld1BhcmFtcyB0aGUgZXhwb3J0cyBmb3IgdGhlIGN1cnJlbnQgZXhlY3V0aW9uXG4gKiBAcmV0dXJucyBhbnkgcGFyYW1ldGVycyB0aGF0IGhhdmUgZGlmZmVyZW50IHZhbHVlc1xuICovXG5mdW5jdGlvbiBjaGFuZ2VkKG9sZFBhcmFtczogQ3Jvc3NSZWdpb25FeHBvcnRzLCBuZXdQYXJhbXM6IENyb3NzUmVnaW9uRXhwb3J0cyk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9sZFBhcmFtcylcbiAgICAuZmlsdGVyKGtleSA9PiAobmV3UGFyYW1zLmhhc093blByb3BlcnR5KGtleSkgJiYgb2xkUGFyYW1zW2tleV0gIT09IG5ld1BhcmFtc1trZXldKSlcbiAgICAucmVkdWNlKChhY2M6IHN0cmluZ1tdLCBjdXJyOiBzdHJpbmcpID0+IHtcbiAgICAgIGFjYy5wdXNoKGN1cnIpO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCBbXSk7XG59XG4iXX0=