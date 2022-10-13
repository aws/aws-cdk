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
                await throwIfAnyInUse(ssm, newExports);
                console.info(`Creating new SSM Parameter exports in region ${props.region}`);
                await putParameters(ssm, newExports);
                return;
            case 'Delete':
                // consuming stack will delete parameters
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
        try {
            const result = await ssm.listTagsForResource({
                ResourceId: name,
                ResourceType: 'Parameter',
            }).promise();
            result.TagList?.forEach(tag => {
                const tagParts = tag.Key.split(':');
                if (tagParts[0] === 'aws-cdk' && tagParts[1] === 'strong-ref') {
                    tagResults.has(name)
                        ? tagResults.get(name).add(tagParts[2])
                        : tagResults.set(name, new Set([tagParts[2]]));
                }
            });
        }
        catch (e) {
            // an InvalidResourceId means that the parameter doesn't exist
            // which we should ignore since that means it's not in use
            if (e.code === 'InvalidResourceId') {
                return;
            }
            throw e;
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
 * Return only the items from source that do not exist in the filter
 *
 * @param source the source object to perform the filter on
 * @param filter filter out items that exist in this object
 */
function except(source, filter) {
    return Object.keys(source)
        .filter(key => (!filter.hasOwnProperty(key) || source[key] !== filter[key]))
        .reduce((acc, curr) => {
        acc[curr] = source[curr];
        return acc;
    }, {});
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0Isc0RBQXNEO0FBQ3RELHFDQUE4QjtBQUd2QixLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtEO0lBQzlFLE1BQU0sS0FBSyxHQUF3QixLQUFLLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDO0lBQ3hFLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUE2QixDQUFDO0lBRXBELE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLElBQUk7UUFDRixRQUFRLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFDekIsS0FBSyxRQUFRO2dCQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0RBQWdELEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2dCQUM3RSxNQUFNLGVBQWUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3BDLE1BQU0sYUFBYSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDbEMsT0FBTztZQUNULEtBQUssUUFBUTtnQkFDWCxNQUFNLFFBQVEsR0FBd0IsS0FBSyxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQztnQkFDOUUsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE9BQTZCLENBQUM7Z0JBQzFELE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQy9DLE1BQU0sZUFBZSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDdkMsT0FBTyxDQUFDLElBQUksQ0FBQyxnREFBZ0QsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBQzdFLE1BQU0sYUFBYSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFD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QUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFTLE1BQU0sQ0FBQyxNQUEwQixFQUFFLE1BQTBCO0lBQ3BFLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDdkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQzNFLE1BQU0sQ0FBQyxDQUFDLEdBQXVCLEVBQUUsSUFBWSxFQUFFLEVBQUU7UUFDaEQsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNYLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKmVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUqL1xuLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzICovXG5pbXBvcnQgeyBTU00gfSBmcm9tICdhd3Mtc2RrJztcbmltcG9ydCB7IENyb3NzUmVnaW9uRXhwb3J0cywgRXhwb3J0V3JpdGVyQ1JQcm9wcyB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQpIHtcbiAgY29uc3QgcHJvcHM6IEV4cG9ydFdyaXRlckNSUHJvcHMgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuV3JpdGVyUHJvcHM7XG4gIGNvbnN0IGV4cG9ydHMgPSBwcm9wcy5leHBvcnRzIGFzIENyb3NzUmVnaW9uRXhwb3J0cztcblxuICBjb25zdCBzc20gPSBuZXcgU1NNKHsgcmVnaW9uOiBwcm9wcy5yZWdpb24gfSk7XG4gIHRyeSB7XG4gICAgc3dpdGNoIChldmVudC5SZXF1ZXN0VHlwZSkge1xuICAgICAgY2FzZSAnQ3JlYXRlJzpcbiAgICAgICAgY29uc29sZS5pbmZvKGBDcmVhdGluZyBuZXcgU1NNIFBhcmFtZXRlciBleHBvcnRzIGluIHJlZ2lvbiAke3Byb3BzLnJlZ2lvbn1gKTtcbiAgICAgICAgYXdhaXQgdGhyb3dJZkFueUluVXNlKHNzbSwgZXhwb3J0cyk7XG4gICAgICAgIGF3YWl0IHB1dFBhcmFtZXRlcnMoc3NtLCBleHBvcnRzKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2FzZSAnVXBkYXRlJzpcbiAgICAgICAgY29uc3Qgb2xkUHJvcHM6IEV4cG9ydFdyaXRlckNSUHJvcHMgPSBldmVudC5PbGRSZXNvdXJjZVByb3BlcnRpZXMuV3JpdGVyUHJvcHM7XG4gICAgICAgIGNvbnN0IG9sZEV4cG9ydHMgPSBvbGRQcm9wcy5leHBvcnRzIGFzIENyb3NzUmVnaW9uRXhwb3J0cztcbiAgICAgICAgY29uc3QgbmV3RXhwb3J0cyA9IGV4Y2VwdChleHBvcnRzLCBvbGRFeHBvcnRzKTtcbiAgICAgICAgYXdhaXQgdGhyb3dJZkFueUluVXNlKHNzbSwgbmV3RXhwb3J0cyk7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhgQ3JlYXRpbmcgbmV3IFNTTSBQYXJhbWV0ZXIgZXhwb3J0cyBpbiByZWdpb24gJHtwcm9wcy5yZWdpb259YCk7XG4gICAgICAgIGF3YWl0IHB1dFBhcmFtZXRlcnMoc3NtLCBuZXdFeHBvcnRzKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgICAgLy8gY29uc3VtaW5nIHN0YWNrIHdpbGwgZGVsZXRlIHBhcmFtZXRlcnNcbiAgICAgICAgcmV0dXJuO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHByb2Nlc3NpbmcgZXZlbnQ6ICcsIGUpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG5cbi8qKlxuICogQ3JlYXRlIHBhcmFtZXRlcnMgZm9yIGV4aXN0aW5nIGV4cG9ydHNcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcHV0UGFyYW1ldGVycyhzc206IFNTTSwgcGFyYW1ldGVyczogQ3Jvc3NSZWdpb25FeHBvcnRzKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IFByb21pc2UuYWxsKEFycmF5LmZyb20oT2JqZWN0LmVudHJpZXMocGFyYW1ldGVycyksIChbbmFtZSwgdmFsdWVdKSA9PiB7XG4gICAgcmV0dXJuIHNzbS5wdXRQYXJhbWV0ZXIoe1xuICAgICAgTmFtZTogbmFtZSxcbiAgICAgIFZhbHVlOiB2YWx1ZSxcbiAgICAgIFR5cGU6ICdTdHJpbmcnLFxuICAgIH0pLnByb21pc2UoKTtcbiAgfSkpO1xufVxuXG4vKipcbiAqIFF1ZXJ5IGZvciBleGlzdGluZyBwYXJhbWV0ZXJzIHRoYXQgYXJlIGluIHVzZVxuICovXG5hc3luYyBmdW5jdGlvbiB0aHJvd0lmQW55SW5Vc2Uoc3NtOiBTU00sIHBhcmFtZXRlcnM6IENyb3NzUmVnaW9uRXhwb3J0cyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB0YWdSZXN1bHRzOiBNYXA8c3RyaW5nLCBTZXQ8c3RyaW5nPj4gPSBuZXcgTWFwKCk7XG4gIGF3YWl0IFByb21pc2UuYWxsKE9iamVjdC5rZXlzKHBhcmFtZXRlcnMpLm1hcChhc3luYyAobmFtZTogc3RyaW5nKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNzbS5saXN0VGFnc0ZvclJlc291cmNlKHtcbiAgICAgICAgUmVzb3VyY2VJZDogbmFtZSxcbiAgICAgICAgUmVzb3VyY2VUeXBlOiAnUGFyYW1ldGVyJyxcbiAgICAgIH0pLnByb21pc2UoKTtcbiAgICAgIHJlc3VsdC5UYWdMaXN0Py5mb3JFYWNoKHRhZyA9PiB7XG4gICAgICAgIGNvbnN0IHRhZ1BhcnRzID0gdGFnLktleS5zcGxpdCgnOicpO1xuICAgICAgICBpZiAodGFnUGFydHNbMF0gPT09ICdhd3MtY2RrJyAmJiB0YWdQYXJ0c1sxXSA9PT0gJ3N0cm9uZy1yZWYnKSB7XG4gICAgICAgICAgdGFnUmVzdWx0cy5oYXMobmFtZSlcbiAgICAgICAgICAgID8gdGFnUmVzdWx0cy5nZXQobmFtZSkhLmFkZCh0YWdQYXJ0c1syXSlcbiAgICAgICAgICAgIDogdGFnUmVzdWx0cy5zZXQobmFtZSwgbmV3IFNldChbdGFnUGFydHNbMl1dKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gYW4gSW52YWxpZFJlc291cmNlSWQgbWVhbnMgdGhhdCB0aGUgcGFyYW1ldGVyIGRvZXNuJ3QgZXhpc3RcbiAgICAgIC8vIHdoaWNoIHdlIHNob3VsZCBpZ25vcmUgc2luY2UgdGhhdCBtZWFucyBpdCdzIG5vdCBpbiB1c2VcbiAgICAgIGlmIChlLmNvZGUgPT09ICdJbnZhbGlkUmVzb3VyY2VJZCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgfSkpO1xuXG4gIGlmICh0YWdSZXN1bHRzLnNpemUgPiAwKSB7XG4gICAgY29uc3QgbWVzc2FnZTogc3RyaW5nID0gT2JqZWN0LmVudHJpZXModGFnUmVzdWx0cylcbiAgICAgIC5tYXAoKHJlc3VsdDogW3N0cmluZywgc3RyaW5nW11dKSA9PiBgJHtyZXN1bHRbMF19IGlzIGluIHVzZSBieSBzdGFjayhzKSAke3Jlc3VsdFsxXS5qb2luKCcgJyl9YClcbiAgICAgIC5qb2luKCdcXG4nKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cG9ydHMgY2Fubm90IGJlIHVwZGF0ZWQ6IFxcbiR7bWVzc2FnZX1gKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybiBvbmx5IHRoZSBpdGVtcyBmcm9tIHNvdXJjZSB0aGF0IGRvIG5vdCBleGlzdCBpbiB0aGUgZmlsdGVyXG4gKlxuICogQHBhcmFtIHNvdXJjZSB0aGUgc291cmNlIG9iamVjdCB0byBwZXJmb3JtIHRoZSBmaWx0ZXIgb25cbiAqIEBwYXJhbSBmaWx0ZXIgZmlsdGVyIG91dCBpdGVtcyB0aGF0IGV4aXN0IGluIHRoaXMgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGV4Y2VwdChzb3VyY2U6IENyb3NzUmVnaW9uRXhwb3J0cywgZmlsdGVyOiBDcm9zc1JlZ2lvbkV4cG9ydHMpOiBDcm9zc1JlZ2lvbkV4cG9ydHMge1xuICByZXR1cm4gT2JqZWN0LmtleXMoc291cmNlKVxuICAgIC5maWx0ZXIoa2V5ID0+ICghZmlsdGVyLmhhc093blByb3BlcnR5KGtleSkgfHwgc291cmNlW2tleV0gIT09IGZpbHRlcltrZXldKSlcbiAgICAucmVkdWNlKChhY2M6IENyb3NzUmVnaW9uRXhwb3J0cywgY3Vycjogc3RyaW5nKSA9PiB7XG4gICAgICBhY2NbY3Vycl0gPSBzb3VyY2VbY3Vycl07XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbn1cbiJdfQ==