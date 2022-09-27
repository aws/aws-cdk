"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
/*eslint-disable no-console*/
/* eslint-disable import/no-extraneous-dependencies */
const aws_sdk_1 = require("aws-sdk");
async function handler(event) {
    const props = event.ResourceProperties;
    const exports = props.Exports;
    const ssm = new aws_sdk_1.SSM({ region: props.Region });
    try {
        switch (event.RequestType) {
            case 'Create':
                console.info(`Creating new SSM Parameter exports in region ${props.Region}`);
                await throwIfAnyExistingParameters(ssm, exports);
                await putParameters(ssm, exports);
                return;
            case 'Update':
                const oldProps = event.OldResourceProperties;
                const oldExports = oldProps.Exports;
                const newExports = filterExports(exports, oldExports);
                await throwIfAnyExistingParameters(ssm, newExports);
                const paramsToDelete = filterExports(oldExports, exports);
                console.info(`Deleting unused SSM Parameter exports in region ${props.Region}`);
                if (Object.keys(paramsToDelete).length > 0) {
                    await ssm.deleteParameters({
                        Names: Object.keys(paramsToDelete),
                    }).promise();
                }
                console.info(`Creating new SSM Parameter exports in region ${props.Region}`);
                await putParameters(ssm, newExports);
                return;
            case 'Delete':
                console.info(`Deleting all SSM Parameter exports in region ${props.Region}`);
                await ssm.deleteParameters({
                    Names: Array.from(Object.keys(exports)),
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
 * Query for existing parameters
 */
async function throwIfAnyExistingParameters(ssm, parameters) {
    const result = await ssm.getParameters({
        Names: Object.keys(parameters),
    }).promise();
    if ((result.Parameters ?? []).length > 0) {
        const existing = result.Parameters.map(param => param.Name);
        throw new Error(`Exports already exist: \n${existing.join('\n')}`);
    }
}
/**
 * Return only the items from source that do not exist in the filter
 *
 * @param source the source object to perform the filter on
 * @param filter filter out items that exist in this object
 */
function filterExports(source, filter) {
    return Object.keys(source)
        .filter(key => !filter.hasOwnProperty(key))
        .reduce((acc, curr) => {
        acc[curr] = source[curr];
        return acc;
    }, {});
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0Isc0RBQXNEO0FBQ3RELHFDQUE4QjtBQUd2QixLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtEO0lBQzlFLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQztJQUN2QyxNQUFNLE9BQU8sR0FBdUIsS0FBSyxDQUFDLE9BQU8sQ0FBQztJQUVsRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUM5QyxJQUFJO1FBQ0YsUUFBUSxLQUFLLENBQUMsV0FBVyxFQUFFO1lBQ3pCLEtBQUssUUFBUTtnQkFDWCxPQUFPLENBQUMsSUFBSSxDQUFDLGdEQUFnRCxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztnQkFDN0UsTUFBTSw0QkFBNEIsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ2pELE1BQU0sYUFBYSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDbEMsT0FBTztZQUNULEtBQUssUUFBUTtnQkFDWCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMscUJBQXFCLENBQUM7Z0JBQzdDLE1BQU0sVUFBVSxHQUF1QixRQUFRLENBQUMsT0FBTyxDQUFDO2dCQUN4RCxNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUN0RCxNQUFNLDRCQUE0QixDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDcEQsTUFBTSxjQUFjLEdBQUcsYUFBYSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDMUQsT0FBTyxDQUFDLElBQUksQ0FBQyxtREFBbUQsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBQ2hGLElBQUks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IjpbIi8qZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSovXG4vKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMgKi9cbmltcG9ydCB7IFNTTSB9IGZyb20gJ2F3cy1zZGsnO1xudHlwZSBDcm9zc1JlZ2lvbkV4cG9ydHMgPSB7IFtleHBvcnROYW1lOiBzdHJpbmddOiBzdHJpbmcgfTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQpIHtcbiAgY29uc3QgcHJvcHMgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXM7XG4gIGNvbnN0IGV4cG9ydHM6IENyb3NzUmVnaW9uRXhwb3J0cyA9IHByb3BzLkV4cG9ydHM7XG5cbiAgY29uc3Qgc3NtID0gbmV3IFNTTSh7IHJlZ2lvbjogcHJvcHMuUmVnaW9uIH0pO1xuICB0cnkge1xuICAgIHN3aXRjaCAoZXZlbnQuUmVxdWVzdFR5cGUpIHtcbiAgICAgIGNhc2UgJ0NyZWF0ZSc6XG4gICAgICAgIGNvbnNvbGUuaW5mbyhgQ3JlYXRpbmcgbmV3IFNTTSBQYXJhbWV0ZXIgZXhwb3J0cyBpbiByZWdpb24gJHtwcm9wcy5SZWdpb259YCk7XG4gICAgICAgIGF3YWl0IHRocm93SWZBbnlFeGlzdGluZ1BhcmFtZXRlcnMoc3NtLCBleHBvcnRzKTtcbiAgICAgICAgYXdhaXQgcHV0UGFyYW1ldGVycyhzc20sIGV4cG9ydHMpO1xuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlICdVcGRhdGUnOlxuICAgICAgICBjb25zdCBvbGRQcm9wcyA9IGV2ZW50Lk9sZFJlc291cmNlUHJvcGVydGllcztcbiAgICAgICAgY29uc3Qgb2xkRXhwb3J0czogQ3Jvc3NSZWdpb25FeHBvcnRzID0gb2xkUHJvcHMuRXhwb3J0cztcbiAgICAgICAgY29uc3QgbmV3RXhwb3J0cyA9IGZpbHRlckV4cG9ydHMoZXhwb3J0cywgb2xkRXhwb3J0cyk7XG4gICAgICAgIGF3YWl0IHRocm93SWZBbnlFeGlzdGluZ1BhcmFtZXRlcnMoc3NtLCBuZXdFeHBvcnRzKTtcbiAgICAgICAgY29uc3QgcGFyYW1zVG9EZWxldGUgPSBmaWx0ZXJFeHBvcnRzKG9sZEV4cG9ydHMsIGV4cG9ydHMpO1xuICAgICAgICBjb25zb2xlLmluZm8oYERlbGV0aW5nIHVudXNlZCBTU00gUGFyYW1ldGVyIGV4cG9ydHMgaW4gcmVnaW9uICR7cHJvcHMuUmVnaW9ufWApO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMocGFyYW1zVG9EZWxldGUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBhd2FpdCBzc20uZGVsZXRlUGFyYW1ldGVycyh7XG4gICAgICAgICAgICBOYW1lczogT2JqZWN0LmtleXMocGFyYW1zVG9EZWxldGUpLFxuICAgICAgICAgIH0pLnByb21pc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmluZm8oYENyZWF0aW5nIG5ldyBTU00gUGFyYW1ldGVyIGV4cG9ydHMgaW4gcmVnaW9uICR7cHJvcHMuUmVnaW9ufWApO1xuICAgICAgICBhd2FpdCBwdXRQYXJhbWV0ZXJzKHNzbSwgbmV3RXhwb3J0cyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgJ0RlbGV0ZSc6XG4gICAgICAgIGNvbnNvbGUuaW5mbyhgRGVsZXRpbmcgYWxsIFNTTSBQYXJhbWV0ZXIgZXhwb3J0cyBpbiByZWdpb24gJHtwcm9wcy5SZWdpb259YCk7XG4gICAgICAgIGF3YWl0IHNzbS5kZWxldGVQYXJhbWV0ZXJzKHtcbiAgICAgICAgICBOYW1lczogQXJyYXkuZnJvbShPYmplY3Qua2V5cyhleHBvcnRzKSksXG4gICAgICAgIH0pLnByb21pc2UoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHByb2Nlc3NpbmcgZXZlbnQ6ICcsIGUpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG5cbi8qKlxuICogQ3JlYXRlIHBhcmFtZXRlcnMgZm9yIGV4aXN0aW5nIGV4cG9ydHNcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcHV0UGFyYW1ldGVycyhzc206IFNTTSwgcGFyYW1ldGVyczogQ3Jvc3NSZWdpb25FeHBvcnRzKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IFByb21pc2UuYWxsKEFycmF5LmZyb20oT2JqZWN0LmVudHJpZXMocGFyYW1ldGVycyksIChbbmFtZSwgdmFsdWVdKSA9PiB7XG4gICAgcmV0dXJuIHNzbS5wdXRQYXJhbWV0ZXIoe1xuICAgICAgTmFtZTogbmFtZSxcbiAgICAgIFZhbHVlOiB2YWx1ZSxcbiAgICAgIFR5cGU6ICdTdHJpbmcnLFxuICAgIH0pLnByb21pc2UoKTtcbiAgfSkpO1xufVxuXG4vKipcbiAqIFF1ZXJ5IGZvciBleGlzdGluZyBwYXJhbWV0ZXJzXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHRocm93SWZBbnlFeGlzdGluZ1BhcmFtZXRlcnMoc3NtOiBTU00sIHBhcmFtZXRlcnM6IENyb3NzUmVnaW9uRXhwb3J0cyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXN1bHQgPSBhd2FpdCBzc20uZ2V0UGFyYW1ldGVycyh7XG4gICAgTmFtZXM6IE9iamVjdC5rZXlzKHBhcmFtZXRlcnMpLFxuICB9KS5wcm9taXNlKCk7XG4gIGlmICgocmVzdWx0LlBhcmFtZXRlcnMgPz8gW10pLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBleGlzdGluZyA9IHJlc3VsdC5QYXJhbWV0ZXJzIS5tYXAocGFyYW0gPT4gcGFyYW0uTmFtZSk7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBFeHBvcnRzIGFscmVhZHkgZXhpc3Q6IFxcbiR7ZXhpc3Rpbmcuam9pbignXFxuJyl9YCk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm4gb25seSB0aGUgaXRlbXMgZnJvbSBzb3VyY2UgdGhhdCBkbyBub3QgZXhpc3QgaW4gdGhlIGZpbHRlclxuICpcbiAqIEBwYXJhbSBzb3VyY2UgdGhlIHNvdXJjZSBvYmplY3QgdG8gcGVyZm9ybSB0aGUgZmlsdGVyIG9uXG4gKiBAcGFyYW0gZmlsdGVyIGZpbHRlciBvdXQgaXRlbXMgdGhhdCBleGlzdCBpbiB0aGlzIG9iamVjdFxuICovXG5mdW5jdGlvbiBmaWx0ZXJFeHBvcnRzKHNvdXJjZTogQ3Jvc3NSZWdpb25FeHBvcnRzLCBmaWx0ZXI6IENyb3NzUmVnaW9uRXhwb3J0cyk6IENyb3NzUmVnaW9uRXhwb3J0cyB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhzb3VyY2UpXG4gICAgLmZpbHRlcihrZXkgPT4gIWZpbHRlci5oYXNPd25Qcm9wZXJ0eShrZXkpKVxuICAgIC5yZWR1Y2UoKGFjYzogQ3Jvc3NSZWdpb25FeHBvcnRzLCBjdXJyOiBzdHJpbmcpID0+IHtcbiAgICAgIGFjY1tjdXJyXSA9IHNvdXJjZVtjdXJyXTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xufVxuIl19