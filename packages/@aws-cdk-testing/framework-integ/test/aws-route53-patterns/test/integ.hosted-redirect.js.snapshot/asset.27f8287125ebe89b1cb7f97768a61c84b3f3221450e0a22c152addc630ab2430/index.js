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
                // skip if no export names are to be deleted
                const removedExportsNames = Object.keys(removedExports);
                if (removedExportsNames.length > 0) {
                    await ssm.deleteParameters({
                        Names: removedExportsNames,
                    }).promise();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0Isc0RBQXNEO0FBQ3RELHFDQUE4QjtBQUd2QixLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtEO0lBQzlFLE1BQU0sS0FBSyxHQUF3QixLQUFLLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDO0lBQ3hFLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUE2QixDQUFDO0lBRXBELE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLElBQUk7UUFDRixRQUFRLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFDekIsS0FBSyxRQUFRO2dCQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0RBQWdELEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2dCQUM3RSxNQUFNLGVBQWUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3BDLE1BQU0sYUFBYSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDbEMsT0FBTztZQUNULEtBQUssUUFBUTtnQkFDWCxNQUFNLFFBQVEsR0FBd0IsS0FBSyxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQztnQkFDOUUsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE9BQTZCLENBQUM7Z0JBQzFELE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBRS9DLHdFQUF3RTtnQkFDeEUsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsR0FBRSxjQUFjLENBQUMs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O0FBQ0gsU0FBUyxNQUFNLENBQUMsTUFBMEIsRUFBRSxNQUEwQjtJQUNwRSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQ3ZCLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDNUMsTUFBTSxDQUFDLENBQUMsR0FBdUIsRUFBRSxJQUFZLEVBQUUsRUFBRTtRQUNoRCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxTQUFTLE9BQU8sQ0FBQyxTQUE2QixFQUFFLFNBQTZCO0lBQzNFLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7U0FDMUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNuRixNQUFNLENBQUMsQ0FBQyxHQUFhLEVBQUUsSUFBWSxFQUFFLEVBQUU7UUFDdEMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNmLE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSovXG4vKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMgKi9cbmltcG9ydCB7IFNTTSB9IGZyb20gJ2F3cy1zZGsnO1xuaW1wb3J0IHsgQ3Jvc3NSZWdpb25FeHBvcnRzLCBFeHBvcnRXcml0ZXJDUlByb3BzIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCkge1xuICBjb25zdCBwcm9wczogRXhwb3J0V3JpdGVyQ1JQcm9wcyA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Xcml0ZXJQcm9wcztcbiAgY29uc3QgZXhwb3J0cyA9IHByb3BzLmV4cG9ydHMgYXMgQ3Jvc3NSZWdpb25FeHBvcnRzO1xuXG4gIGNvbnN0IHNzbSA9IG5ldyBTU00oeyByZWdpb246IHByb3BzLnJlZ2lvbiB9KTtcbiAgdHJ5IHtcbiAgICBzd2l0Y2ggKGV2ZW50LlJlcXVlc3RUeXBlKSB7XG4gICAgICBjYXNlICdDcmVhdGUnOlxuICAgICAgICBjb25zb2xlLmluZm8oYENyZWF0aW5nIG5ldyBTU00gUGFyYW1ldGVyIGV4cG9ydHMgaW4gcmVnaW9uICR7cHJvcHMucmVnaW9ufWApO1xuICAgICAgICBhd2FpdCB0aHJvd0lmQW55SW5Vc2Uoc3NtLCBleHBvcnRzKTtcbiAgICAgICAgYXdhaXQgcHV0UGFyYW1ldGVycyhzc20sIGV4cG9ydHMpO1xuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlICdVcGRhdGUnOlxuICAgICAgICBjb25zdCBvbGRQcm9wczogRXhwb3J0V3JpdGVyQ1JQcm9wcyA9IGV2ZW50Lk9sZFJlc291cmNlUHJvcGVydGllcy5Xcml0ZXJQcm9wcztcbiAgICAgICAgY29uc3Qgb2xkRXhwb3J0cyA9IG9sZFByb3BzLmV4cG9ydHMgYXMgQ3Jvc3NSZWdpb25FeHBvcnRzO1xuICAgICAgICBjb25zdCBuZXdFeHBvcnRzID0gZXhjZXB0KGV4cG9ydHMsIG9sZEV4cG9ydHMpO1xuXG4gICAgICAgIC8vIHRocm93IGFuIGVycm9yIHRvIGZhaWwgdGhlIGRlcGxveW1lbnQgaWYgYW55IGV4cG9ydCB2YWx1ZSBpcyBjaGFuZ2luZ1xuICAgICAgICBjb25zdCBjaGFuZ2VkRXhwb3J0cyA9IGNoYW5nZWQob2xkRXhwb3J0cywgZXhwb3J0cyk7XG4gICAgICAgIGlmIChjaGFuZ2VkRXhwb3J0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTb21lIGV4cG9ydHMgaGF2ZSBjaGFuZ2VkIVxcbicrIGNoYW5nZWRFeHBvcnRzLmpvaW4oJ1xcbicpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiB3ZSBhcmUgcmVtb3ZpbmcgYW55IGV4cG9ydHMgdGhhdCBhcmUgaW4gdXNlLCB0aGVuIHRocm93IGFuXG4gICAgICAgIC8vIGVycm9yIHRvIGZhaWwgdGhlIGRlcGxveW1lbnRcbiAgICAgICAgY29uc3QgcmVtb3ZlZEV4cG9ydHMgPSBleGNlcHQob2xkRXhwb3J0cywgZXhwb3J0cyk7XG4gICAgICAgIGF3YWl0IHRocm93SWZBbnlJblVzZShzc20sIHJlbW92ZWRFeHBvcnRzKTtcbiAgICAgICAgLy8gaWYgdGhlIG9uZXMgd2UgYXJlIHJlbW92aW5nIGFyZSBub3QgaW4gdXNlIHRoZW4gZGVsZXRlIHRoZW1cbiAgICAgICAgLy8gc2tpcCBpZiBubyBleHBvcnQgbmFtZXMgYXJlIHRvIGJlIGRlbGV0ZWRcbiAgICAgICAgY29uc3QgcmVtb3ZlZEV4cG9ydHNOYW1lcyA9IE9iamVjdC5rZXlzKHJlbW92ZWRFeHBvcnRzKTtcbiAgICAgICAgaWYgKHJlbW92ZWRFeHBvcnRzTmFtZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGF3YWl0IHNzbS5kZWxldGVQYXJhbWV0ZXJzKHtcbiAgICAgICAgICAgIE5hbWVzOiByZW1vdmVkRXhwb3J0c05hbWVzLFxuICAgICAgICAgIH0pLnByb21pc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFsc28gdGhyb3cgYW4gZXJyb3IgaWYgd2UgYXJlIGNyZWF0aW5nIGEgbmV3IGV4cG9ydCB0aGF0IGFscmVhZHkgZXhpc3RzIGZvciBzb21lIHJlYXNvblxuICAgICAgICBhd2FpdCB0aHJvd0lmQW55SW5Vc2Uoc3NtLCBuZXdFeHBvcnRzKTtcbiAgICAgICAgY29uc29sZS5pbmZvKGBDcmVhdGluZyBuZXcgU1NNIFBhcmFtZXRlciBleHBvcnRzIGluIHJlZ2lvbiAke3Byb3BzLnJlZ2lvbn1gKTtcbiAgICAgICAgYXdhaXQgcHV0UGFyYW1ldGVycyhzc20sIG5ld0V4cG9ydHMpO1xuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlICdEZWxldGUnOlxuICAgICAgICAvLyBpZiBhbnkgb2YgdGhlIGV4cG9ydHMgYXJlIGN1cnJlbnRseSBpbiB1c2UgdGhlbiB0aHJvdyBhbiBlcnJvciB0byBmYWlsXG4gICAgICAgIC8vIHRoZSBzdGFjayBkZWxldGlvbi5cbiAgICAgICAgYXdhaXQgdGhyb3dJZkFueUluVXNlKHNzbSwgZXhwb3J0cyk7XG4gICAgICAgIC8vIGlmIG5vbmUgYXJlIGluIHVzZSB0aGVuIGRlbGV0ZSBhbGwgb2YgdGhlbVxuICAgICAgICBhd2FpdCBzc20uZGVsZXRlUGFyYW1ldGVycyh7XG4gICAgICAgICAgTmFtZXM6IE9iamVjdC5rZXlzKGV4cG9ydHMpLFxuICAgICAgICB9KS5wcm9taXNlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwcm9jZXNzaW5nIGV2ZW50OiAnLCBlKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuXG4vKipcbiAqIENyZWF0ZSBwYXJhbWV0ZXJzIGZvciBleGlzdGluZyBleHBvcnRzXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHB1dFBhcmFtZXRlcnMoc3NtOiBTU00sIHBhcmFtZXRlcnM6IENyb3NzUmVnaW9uRXhwb3J0cyk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBQcm9taXNlLmFsbChBcnJheS5mcm9tKE9iamVjdC5lbnRyaWVzKHBhcmFtZXRlcnMpLCAoW25hbWUsIHZhbHVlXSkgPT4ge1xuICAgIHJldHVybiBzc20ucHV0UGFyYW1ldGVyKHtcbiAgICAgIE5hbWU6IG5hbWUsXG4gICAgICBWYWx1ZTogdmFsdWUsXG4gICAgICBUeXBlOiAnU3RyaW5nJyxcbiAgICB9KS5wcm9taXNlKCk7XG4gIH0pKTtcbn1cblxuLyoqXG4gKiBRdWVyeSBmb3IgZXhpc3RpbmcgcGFyYW1ldGVycyB0aGF0IGFyZSBpbiB1c2VcbiAqL1xuYXN5bmMgZnVuY3Rpb24gdGhyb3dJZkFueUluVXNlKHNzbTogU1NNLCBwYXJhbWV0ZXJzOiBDcm9zc1JlZ2lvbkV4cG9ydHMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgdGFnUmVzdWx0czogTWFwPHN0cmluZywgU2V0PHN0cmluZz4+ID0gbmV3IE1hcCgpO1xuICBhd2FpdCBQcm9taXNlLmFsbChPYmplY3Qua2V5cyhwYXJhbWV0ZXJzKS5tYXAoYXN5bmMgKG5hbWU6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGlzSW5Vc2Uoc3NtLCBuYW1lKTtcbiAgICBpZiAocmVzdWx0LnNpemUgPiAwKSB7XG4gICAgICB0YWdSZXN1bHRzLnNldChuYW1lLCByZXN1bHQpO1xuICAgIH1cbiAgfSkpO1xuXG4gIGlmICh0YWdSZXN1bHRzLnNpemUgPiAwKSB7XG4gICAgY29uc3QgbWVzc2FnZTogc3RyaW5nID0gT2JqZWN0LmVudHJpZXModGFnUmVzdWx0cylcbiAgICAgIC5tYXAoKHJlc3VsdDogW3N0cmluZywgc3RyaW5nW11dKSA9PiBgJHtyZXN1bHRbMF19IGlzIGluIHVzZSBieSBzdGFjayhzKSAke3Jlc3VsdFsxXS5qb2luKCcgJyl9YClcbiAgICAgIC5qb2luKCdcXG4nKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cG9ydHMgY2Fubm90IGJlIHVwZGF0ZWQ6IFxcbiR7bWVzc2FnZX1gKTtcbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIGlmIGEgcGFyYW1ldGVyIGlzIGluIHVzZVxuICovXG5hc3luYyBmdW5jdGlvbiBpc0luVXNlKHNzbTogU1NNLCBwYXJhbWV0ZXJOYW1lOiBzdHJpbmcpOiBQcm9taXNlPFNldDxzdHJpbmc+PiB7XG4gIGNvbnN0IHRhZ1Jlc3VsdHM6IFNldDxzdHJpbmc+ID0gbmV3IFNldCgpO1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNzbS5saXN0VGFnc0ZvclJlc291cmNlKHtcbiAgICAgIFJlc291cmNlSWQ6IHBhcmFtZXRlck5hbWUsXG4gICAgICBSZXNvdXJjZVR5cGU6ICdQYXJhbWV0ZXInLFxuICAgIH0pLnByb21pc2UoKTtcbiAgICByZXN1bHQuVGFnTGlzdD8uZm9yRWFjaCh0YWcgPT4ge1xuICAgICAgY29uc3QgdGFnUGFydHMgPSB0YWcuS2V5LnNwbGl0KCc6Jyk7XG4gICAgICBpZiAodGFnUGFydHNbMF0gPT09ICdhd3MtY2RrJyAmJiB0YWdQYXJ0c1sxXSA9PT0gJ3N0cm9uZy1yZWYnKSB7XG4gICAgICAgIHRhZ1Jlc3VsdHMuYWRkKHRhZ1BhcnRzWzJdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgLy8gYW4gSW52YWxpZFJlc291cmNlSWQgbWVhbnMgdGhhdCB0aGUgcGFyYW1ldGVyIGRvZXNuJ3QgZXhpc3RcbiAgICAvLyB3aGljaCB3ZSBzaG91bGQgaWdub3JlIHNpbmNlIHRoYXQgbWVhbnMgaXQncyBub3QgaW4gdXNlXG4gICAgaWYgKGUuY29kZSA9PT0gJ0ludmFsaWRSZXNvdXJjZUlkJykge1xuICAgICAgcmV0dXJuIG5ldyBTZXQoKTtcbiAgICB9XG4gICAgdGhyb3cgZTtcbiAgfVxuICByZXR1cm4gdGFnUmVzdWx0cztcbn1cblxuLyoqXG4gKiBSZXR1cm4gb25seSB0aGUgaXRlbXMgZnJvbSBzb3VyY2UgdGhhdCBkbyBub3QgZXhpc3QgaW4gdGhlIGZpbHRlclxuICpcbiAqIEBwYXJhbSBzb3VyY2UgdGhlIHNvdXJjZSBvYmplY3QgdG8gcGVyZm9ybSB0aGUgZmlsdGVyIG9uXG4gKiBAcGFyYW0gZmlsdGVyIGZpbHRlciBvdXQgaXRlbXMgdGhhdCBleGlzdCBpbiB0aGlzIG9iamVjdFxuICogQHJldHVybnMgYW55IGV4cG9ydHMgdGhhdCBkb24ndCBleGlzdCBpbiB0aGUgZmlsdGVyXG4gKi9cbmZ1bmN0aW9uIGV4Y2VwdChzb3VyY2U6IENyb3NzUmVnaW9uRXhwb3J0cywgZmlsdGVyOiBDcm9zc1JlZ2lvbkV4cG9ydHMpOiBDcm9zc1JlZ2lvbkV4cG9ydHMge1xuICByZXR1cm4gT2JqZWN0LmtleXMoc291cmNlKVxuICAgIC5maWx0ZXIoa2V5ID0+ICghZmlsdGVyLmhhc093blByb3BlcnR5KGtleSkpKVxuICAgIC5yZWR1Y2UoKGFjYzogQ3Jvc3NSZWdpb25FeHBvcnRzLCBjdXJyOiBzdHJpbmcpID0+IHtcbiAgICAgIGFjY1tjdXJyXSA9IHNvdXJjZVtjdXJyXTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xufVxuXG4vKipcbiAqIFJldHVybiBpdGVtcyB0aGF0IGV4aXN0IGluIGJvdGggdGhlIHRoZSBvbGQgcGFyYW1ldGVycyBhbmQgdGhlIG5ldyBwYXJhbWV0ZXJzLFxuICogYnV0IGhhdmUgZGlmZmVyZW50IHZhbHVlc1xuICpcbiAqIEBwYXJhbSBvbGRQYXJhbXMgdGhlIGV4cG9ydHMgdGhhdCBleGlzdGVkIHByZXZpb3VzIHRvIHRoaXMgZXhlY3V0aW9uXG4gKiBAcGFyYW0gbmV3UGFyYW1zIHRoZSBleHBvcnRzIGZvciB0aGUgY3VycmVudCBleGVjdXRpb25cbiAqIEByZXR1cm5zIGFueSBwYXJhbWV0ZXJzIHRoYXQgaGF2ZSBkaWZmZXJlbnQgdmFsdWVzXG4gKi9cbmZ1bmN0aW9uIGNoYW5nZWQob2xkUGFyYW1zOiBDcm9zc1JlZ2lvbkV4cG9ydHMsIG5ld1BhcmFtczogQ3Jvc3NSZWdpb25FeHBvcnRzKTogc3RyaW5nW10ge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2xkUGFyYW1zKVxuICAgIC5maWx0ZXIoa2V5ID0+IChuZXdQYXJhbXMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBvbGRQYXJhbXNba2V5XSAhPT0gbmV3UGFyYW1zW2tleV0pKVxuICAgIC5yZWR1Y2UoKGFjYzogc3RyaW5nW10sIGN1cnI6IHN0cmluZykgPT4ge1xuICAgICAgYWNjLnB1c2goY3Vycik7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIFtdKTtcbn1cbiJdfQ==