"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const Logs = require("@aws-sdk/client-cloudwatch-logs");
/**
 * Creates a log group and doesn't throw if it exists.
 */
async function createLogGroupSafe(logGroupName, client, withDelay) {
    await withDelay(async () => {
        try {
            const params = { logGroupName };
            const command = new Logs.CreateLogGroupCommand(params);
            await client.send(command);
        }
        catch (error) {
            if (error instanceof Logs.ResourceAlreadyExistsException || error.name === 'ResourceAlreadyExistsException') {
                // The log group is already created by the lambda execution
                return;
            }
            throw error;
        }
    });
}
/**
 * Deletes a log group and doesn't throw if it does not exist.
 */
async function deleteLogGroup(logGroupName, client, withDelay) {
    await withDelay(async () => {
        try {
            const params = { logGroupName };
            const command = new Logs.DeleteLogGroupCommand(params);
            await client.send(command);
        }
        catch (error) {
            if (error instanceof Logs.ResourceNotFoundException || error.name === 'ResourceNotFoundException') {
                // The log group doesn't exist
                return;
            }
            throw error;
        }
    });
}
/**
 * Puts or deletes a retention policy on a log group.
 */
async function setRetentionPolicy(logGroupName, client, withDelay, retentionInDays) {
    await withDelay(async () => {
        if (!retentionInDays) {
            const params = { logGroupName };
            const deleteCommand = new Logs.DeleteRetentionPolicyCommand(params);
            await client.send(deleteCommand);
        }
        else {
            const params = { logGroupName, retentionInDays };
            const putCommand = new Logs.PutRetentionPolicyCommand(params);
            await client.send(putCommand);
        }
    });
}
async function handler(event, context) {
    try {
        console.log(JSON.stringify({ ...event, ResponseURL: '...' }));
        // The target log group
        const logGroupName = event.ResourceProperties.LogGroupName;
        // The region of the target log group
        const logGroupRegion = event.ResourceProperties.LogGroupRegion;
        // Parse to AWS SDK retry options
        const withDelay = makeWithDelay(parseIntOptional(event.ResourceProperties.SdkRetry?.maxRetries));
        const sdkConfig = {
            logger: console,
            region: logGroupRegion,
        };
        const client = new Logs.CloudWatchLogsClient(sdkConfig);
        if (event.RequestType === 'Create' || event.RequestType === 'Update') {
            // Act on the target log group
            await createLogGroupSafe(logGroupName, client, withDelay);
            await setRetentionPolicy(logGroupName, client, withDelay, parseIntOptional(event.ResourceProperties.RetentionInDays));
            // Configure the Log Group for the Custom Resource function itself
            if (event.RequestType === 'Create') {
                const clientForCustomResourceFunction = new Logs.CloudWatchLogsClient({
                    logger: console,
                    region: process.env.AWS_REGION,
                });
                // Set a retention policy of 1 day on the logs of this very function.
                // Due to the async nature of the log group creation, the log group for this function might
                // still be not created yet at this point. Therefore we attempt to create it.
                // In case it is being created, createLogGroupSafe will handle the conflict.
                await createLogGroupSafe(`/aws/lambda/${context.functionName}`, clientForCustomResourceFunction, withDelay);
                // If createLogGroupSafe fails, the log group is not created even after multiple attempts.
                // In this case we have nothing to set the retention policy on but an exception will skip
                // the next line.
                await setRetentionPolicy(`/aws/lambda/${context.functionName}`, clientForCustomResourceFunction, withDelay, 1);
            }
        }
        // When the requestType is delete, delete the log group if the removal policy is delete
        if (event.RequestType === 'Delete' && event.ResourceProperties.RemovalPolicy === 'destroy') {
            await deleteLogGroup(logGroupName, client, withDelay);
            // else retain the log group
        }
        await respond('SUCCESS', 'OK', logGroupName);
    }
    catch (e) {
        console.log(e);
        await respond('FAILED', e.message, event.ResourceProperties.LogGroupName);
    }
    function respond(responseStatus, reason, physicalResourceId) {
        const responseBody = JSON.stringify({
            Status: responseStatus,
            Reason: reason,
            PhysicalResourceId: physicalResourceId,
            StackId: event.StackId,
            RequestId: event.RequestId,
            LogicalResourceId: event.LogicalResourceId,
            Data: {
                // Add log group name as part of the response so that it's available via Fn::GetAtt
                LogGroupName: event.ResourceProperties.LogGroupName,
            },
        });
        console.log('Responding', responseBody);
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const parsedUrl = require('url').parse(event.ResponseURL);
        const requestOptions = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.path,
            method: 'PUT',
            headers: {
                'content-type': '',
                'content-length': Buffer.byteLength(responseBody, 'utf8'),
            },
        };
        return new Promise((resolve, reject) => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                const request = require('https').request(requestOptions, resolve);
                request.on('error', reject);
                request.write(responseBody);
                request.end();
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.handler = handler;
function parseIntOptional(value, base = 10) {
    if (value === undefined) {
        return undefined;
    }
    return parseInt(value, base);
}
function makeWithDelay(maxRetries = 10, delay = 100) {
    // If we try to update the log group, then due to the async nature of
    // Lambda logging there could be a race condition when the same log group is
    // already being created by the lambda execution. This can sometime result in
    // an error "OperationAbortedException: A conflicting operation is currently
    // in progress...Please try again."
    // To avoid an error, we do as requested and try again.
    return async (block) => {
        do {
            try {
                return await block();
            }
            catch (error) {
                if (error instanceof Logs.OperationAbortedException || error.name === 'OperationAbortedException') {
                    if (maxRetries > 0) {
                        maxRetries--;
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                    else {
                        // The log group is still being changed by another execution but we are out of retries
                        throw new Error('Out of attempts to change log group');
                    }
                }
                throw error;
            }
        } while (true); // exit happens on retry count check
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IsNkRBQTZEO0FBQzdELHdEQUF3RDtBQWV4RDs7R0FFRztBQUNILEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxZQUFvQixFQUFFLE1BQWlDLEVBQUUsU0FBd0Q7SUFDakosTUFBTSxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDekIsSUFBSTtZQUNGLE1BQU0sTUFBTSxHQUFHLEVBQUUsWUFBWSxFQUFFLENBQUM7WUFDaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkQsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBRTVCO1FBQUMsT0FBTyxLQUFVLEVBQUU7WUFDbkIsSUFBSSxLQUFLLFlBQVksSUFBSSxDQUFDLDhCQUE4QixJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssZ0NBQWdDLEVBQUU7Z0JBQzNHLDJEQUEyRDtnQkFDM0QsT0FBTzthQUNSO1lBRUQsTUFBTSxLQUFLLENBQUM7U0FDYjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVEOztHQUVHO0FBQ0gsS0FBSyxVQUFVLGNBQWMsQ0FBQyxZQUFvQixFQUFFLE1BQWlDLEVBQUUsU0FBd0Q7SUFDN0ksTUFBTSxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDekIsSUFBSTtZQUNGLE1BQU0sTUFBTSxHQUFHLEVBQUUsWUFBWSxFQUFFLENBQUM7WUFDaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkQsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBRTVCO1FBQUMsT0FBTyxLQUFVLEVBQUU7WUFDbkIsSUFBSSxLQUFLLFlBQVksSUFBSSxDQUFD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NUUsNkVBQTZFO0lBQzdFLDRFQUE0RTtJQUM1RSxtQ0FBbUM7SUFDbkMsdURBQXVEO0lBRXZELE9BQU8sS0FBSyxFQUFFLEtBQTBCLEVBQUUsRUFBRTtRQUMxQyxHQUFHO1lBQ0QsSUFBSTtnQkFDRixPQUFPLE1BQU0sS0FBSyxFQUFFLENBQUM7YUFDdEI7WUFBQyxPQUFPLEtBQVUsRUFBRTtnQkFDbkIsSUFBSSxLQUFLLFlBQVksSUFBSSxDQUFDLHlCQUF5QixJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssMkJBQTJCLEVBQUU7b0JBQ2pHLElBQUksVUFBVSxHQUFHLENBQUMsRUFBRTt3QkFDbEIsVUFBVSxFQUFFLENBQUM7d0JBQ2IsTUFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQzt3QkFDekQsU0FBUztxQkFDVjt5QkFBTTt3QkFDTCxzRkFBc0Y7d0JBQ3RGLE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztxQkFDeEQ7aUJBQ0Y7Z0JBQ0QsTUFBTSxLQUFLLENBQUM7YUFDYjtTQUNGLFFBQVEsSUFBSSxFQUFFLENBQUMsb0NBQW9DO0lBQ3RELENBQUMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgKiBhcyBMb2dzIGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1jbG91ZHdhdGNoLWxvZ3MnO1xuXG5pbnRlcmZhY2UgTG9nUmV0ZW50aW9uRXZlbnQgZXh0ZW5kcyBPbWl0PEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQsICdSZXNvdXJjZVByb3BlcnRpZXMnPiB7XG4gIFJlc291cmNlUHJvcGVydGllczoge1xuICAgIFNlcnZpY2VUb2tlbjogc3RyaW5nO1xuICAgIExvZ0dyb3VwTmFtZTogc3RyaW5nO1xuICAgIExvZ0dyb3VwUmVnaW9uPzogc3RyaW5nO1xuICAgIFJldGVudGlvbkluRGF5cz86IHN0cmluZztcbiAgICBTZGtSZXRyeT86IHtcbiAgICAgIG1heFJldHJpZXM/OiBzdHJpbmc7XG4gICAgfTtcbiAgICBSZW1vdmFsUG9saWN5Pzogc3RyaW5nXG4gIH07XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGxvZyBncm91cCBhbmQgZG9lc24ndCB0aHJvdyBpZiBpdCBleGlzdHMuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUxvZ0dyb3VwU2FmZShsb2dHcm91cE5hbWU6IHN0cmluZywgY2xpZW50OiBMb2dzLkNsb3VkV2F0Y2hMb2dzQ2xpZW50LCB3aXRoRGVsYXk6IChibG9jazogKCkgPT4gUHJvbWlzZTx2b2lkPikgPT4gUHJvbWlzZTx2b2lkPikge1xuICBhd2FpdCB3aXRoRGVsYXkoYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJhbXMgPSB7IGxvZ0dyb3VwTmFtZSB9O1xuICAgICAgY29uc3QgY29tbWFuZCA9IG5ldyBMb2dzLkNyZWF0ZUxvZ0dyb3VwQ29tbWFuZChwYXJhbXMpO1xuICAgICAgYXdhaXQgY2xpZW50LnNlbmQoY29tbWFuZCk7XG5cbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBMb2dzLlJlc291cmNlQWxyZWFkeUV4aXN0c0V4Y2VwdGlvbiB8fCBlcnJvci5uYW1lID09PSAnUmVzb3VyY2VBbHJlYWR5RXhpc3RzRXhjZXB0aW9uJykge1xuICAgICAgICAvLyBUaGUgbG9nIGdyb3VwIGlzIGFscmVhZHkgY3JlYXRlZCBieSB0aGUgbGFtYmRhIGV4ZWN1dGlvblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogRGVsZXRlcyBhIGxvZyBncm91cCBhbmQgZG9lc24ndCB0aHJvdyBpZiBpdCBkb2VzIG5vdCBleGlzdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZGVsZXRlTG9nR3JvdXAobG9nR3JvdXBOYW1lOiBzdHJpbmcsIGNsaWVudDogTG9ncy5DbG91ZFdhdGNoTG9nc0NsaWVudCwgd2l0aERlbGF5OiAoYmxvY2s6ICgpID0+IFByb21pc2U8dm9pZD4pID0+IFByb21pc2U8dm9pZD4pIHtcbiAgYXdhaXQgd2l0aERlbGF5KGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcGFyYW1zID0geyBsb2dHcm91cE5hbWUgfTtcbiAgICAgIGNvbnN0IGNvbW1hbmQgPSBuZXcgTG9ncy5EZWxldGVMb2dHcm91cENvbW1hbmQocGFyYW1zKTtcbiAgICAgIGF3YWl0IGNsaWVudC5zZW5kKGNvbW1hbmQpO1xuXG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgTG9ncy5SZXNvdXJjZU5vdEZvdW5kRXhjZXB0aW9uIHx8IGVycm9yLm5hbWUgPT09ICdSZXNvdXJjZU5vdEZvdW5kRXhjZXB0aW9uJykge1xuICAgICAgICAvLyBUaGUgbG9nIGdyb3VwIGRvZXNuJ3QgZXhpc3RcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIFB1dHMgb3IgZGVsZXRlcyBhIHJldGVudGlvbiBwb2xpY3kgb24gYSBsb2cgZ3JvdXAuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHNldFJldGVudGlvblBvbGljeShcbiAgbG9nR3JvdXBOYW1lOiBzdHJpbmcsXG4gIGNsaWVudDogTG9ncy5DbG91ZFdhdGNoTG9nc0NsaWVudCxcbiAgd2l0aERlbGF5OiAoYmxvY2s6ICgpID0+IFByb21pc2U8dm9pZD4pID0+IFByb21pc2U8dm9pZD4sXG4gIHJldGVudGlvbkluRGF5cz86IG51bWJlcixcbikge1xuXG4gIGF3YWl0IHdpdGhEZWxheShhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFyZXRlbnRpb25JbkRheXMpIHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHsgbG9nR3JvdXBOYW1lIH07XG4gICAgICBjb25zdCBkZWxldGVDb21tYW5kID0gbmV3IExvZ3MuRGVsZXRlUmV0ZW50aW9uUG9saWN5Q29tbWFuZChwYXJhbXMpO1xuICAgICAgYXdhaXQgY2xpZW50LnNlbmQoZGVsZXRlQ29tbWFuZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHsgbG9nR3JvdXBOYW1lLCByZXRlbnRpb25JbkRheXMgfTtcbiAgICAgIGNvbnN0IHB1dENvbW1hbmQgPSBuZXcgTG9ncy5QdXRSZXRlbnRpb25Qb2xpY3lDb21tYW5kKHBhcmFtcyk7XG4gICAgICBhd2FpdCBjbGllbnQuc2VuZChwdXRDb21tYW5kKTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogTG9nUmV0ZW50aW9uRXZlbnQsIGNvbnRleHQ6IEFXU0xhbWJkYS5Db250ZXh0KSB7XG4gIHRyeSB7XG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoeyAuLi5ldmVudCwgUmVzcG9uc2VVUkw6ICcuLi4nIH0pKTtcblxuICAgIC8vIFRoZSB0YXJnZXQgbG9nIGdyb3VwXG4gICAgY29uc3QgbG9nR3JvdXBOYW1lID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkxvZ0dyb3VwTmFtZTtcblxuICAgIC8vIFRoZSByZWdpb24gb2YgdGhlIHRhcmdldCBsb2cgZ3JvdXBcbiAgICBjb25zdCBsb2dHcm91cFJlZ2lvbiA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Mb2dHcm91cFJlZ2lvbjtcblxuICAgIC8vIFBhcnNlIHRvIEFXUyBTREsgcmV0cnkgb3B0aW9uc1xuICAgIGNvbnN0IHdpdGhEZWxheSA9IG1ha2VXaXRoRGVsYXkocGFyc2VJbnRPcHRpb25hbChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuU2RrUmV0cnk/Lm1heFJldHJpZXMpKTtcblxuICAgIGNvbnN0IHNka0NvbmZpZzogTG9ncy5DbG91ZFdhdGNoTG9nc0NsaWVudENvbmZpZyA9IHtcbiAgICAgIGxvZ2dlcjogY29uc29sZSxcbiAgICAgIHJlZ2lvbjogbG9nR3JvdXBSZWdpb24sXG4gICAgfTtcbiAgICBjb25zdCBjbGllbnQgPSBuZXcgTG9ncy5DbG91ZFdhdGNoTG9nc0NsaWVudChzZGtDb25maWcpO1xuXG4gICAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJyB8fCBldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ1VwZGF0ZScpIHtcbiAgICAgIC8vIEFjdCBvbiB0aGUgdGFyZ2V0IGxvZyBncm91cFxuICAgICAgYXdhaXQgY3JlYXRlTG9nR3JvdXBTYWZlKGxvZ0dyb3VwTmFtZSwgY2xpZW50LCB3aXRoRGVsYXkpO1xuICAgICAgYXdhaXQgc2V0UmV0ZW50aW9uUG9saWN5KGxvZ0dyb3VwTmFtZSwgY2xpZW50LCB3aXRoRGVsYXksIHBhcnNlSW50T3B0aW9uYWwoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlJldGVudGlvbkluRGF5cykpO1xuXG4gICAgICAvLyBDb25maWd1cmUgdGhlIExvZyBHcm91cCBmb3IgdGhlIEN1c3RvbSBSZXNvdXJjZSBmdW5jdGlvbiBpdHNlbGZcbiAgICAgIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0NyZWF0ZScpIHtcbiAgICAgICAgY29uc3QgY2xpZW50Rm9yQ3VzdG9tUmVzb3VyY2VGdW5jdGlvbiA9IG5ldyBMb2dzLkNsb3VkV2F0Y2hMb2dzQ2xpZW50KHtcbiAgICAgICAgICBsb2dnZXI6IGNvbnNvbGUsXG4gICAgICAgICAgcmVnaW9uOiBwcm9jZXNzLmVudi5BV1NfUkVHSU9OLFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gU2V0IGEgcmV0ZW50aW9uIHBvbGljeSBvZiAxIGRheSBvbiB0aGUgbG9ncyBvZiB0aGlzIHZlcnkgZnVuY3Rpb24uXG4gICAgICAgIC8vIER1ZSB0byB0aGUgYXN5bmMgbmF0dXJlIG9mIHRoZSBsb2cgZ3JvdXAgY3JlYXRpb24sIHRoZSBsb2cgZ3JvdXAgZm9yIHRoaXMgZnVuY3Rpb24gbWlnaHRcbiAgICAgICAgLy8gc3RpbGwgYmUgbm90IGNyZWF0ZWQgeWV0IGF0IHRoaXMgcG9pbnQuIFRoZXJlZm9yZSB3ZSBhdHRlbXB0IHRvIGNyZWF0ZSBpdC5cbiAgICAgICAgLy8gSW4gY2FzZSBpdCBpcyBiZWluZyBjcmVhdGVkLCBjcmVhdGVMb2dHcm91cFNhZmUgd2lsbCBoYW5kbGUgdGhlIGNvbmZsaWN0LlxuICAgICAgICBhd2FpdCBjcmVhdGVMb2dHcm91cFNhZmUoYC9hd3MvbGFtYmRhLyR7Y29udGV4dC5mdW5jdGlvbk5hbWV9YCwgY2xpZW50Rm9yQ3VzdG9tUmVzb3VyY2VGdW5jdGlvbiwgd2l0aERlbGF5KTtcbiAgICAgICAgLy8gSWYgY3JlYXRlTG9nR3JvdXBTYWZlIGZhaWxzLCB0aGUgbG9nIGdyb3VwIGlzIG5vdCBjcmVhdGVkIGV2ZW4gYWZ0ZXIgbXVsdGlwbGUgYXR0ZW1wdHMuXG4gICAgICAgIC8vIEluIHRoaXMgY2FzZSB3ZSBoYXZlIG5vdGhpbmcgdG8gc2V0IHRoZSByZXRlbnRpb24gcG9saWN5IG9uIGJ1dCBhbiBleGNlcHRpb24gd2lsbCBza2lwXG4gICAgICAgIC8vIHRoZSBuZXh0IGxpbmUuXG4gICAgICAgIGF3YWl0IHNldFJldGVudGlvblBvbGljeShgL2F3cy9sYW1iZGEvJHtjb250ZXh0LmZ1bmN0aW9uTmFtZX1gLCBjbGllbnRGb3JDdXN0b21SZXNvdXJjZUZ1bmN0aW9uLCB3aXRoRGVsYXksIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdoZW4gdGhlIHJlcXVlc3RUeXBlIGlzIGRlbGV0ZSwgZGVsZXRlIHRoZSBsb2cgZ3JvdXAgaWYgdGhlIHJlbW92YWwgcG9saWN5IGlzIGRlbGV0ZVxuICAgIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0RlbGV0ZScgJiYgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlJlbW92YWxQb2xpY3kgPT09ICdkZXN0cm95Jykge1xuICAgICAgYXdhaXQgZGVsZXRlTG9nR3JvdXAobG9nR3JvdXBOYW1lLCBjbGllbnQsIHdpdGhEZWxheSk7XG4gICAgICAvLyBlbHNlIHJldGFpbiB0aGUgbG9nIGdyb3VwXG4gICAgfVxuXG4gICAgYXdhaXQgcmVzcG9uZCgnU1VDQ0VTUycsICdPSycsIGxvZ0dyb3VwTmFtZSk7XG4gIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIGF3YWl0IHJlc3BvbmQoJ0ZBSUxFRCcsIGUubWVzc2FnZSwgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkxvZ0dyb3VwTmFtZSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNwb25kKHJlc3BvbnNlU3RhdHVzOiBzdHJpbmcsIHJlYXNvbjogc3RyaW5nLCBwaHlzaWNhbFJlc291cmNlSWQ6IHN0cmluZykge1xuICAgIGNvbnN0IHJlc3BvbnNlQm9keSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIFN0YXR1czogcmVzcG9uc2VTdGF0dXMsXG4gICAgICBSZWFzb246IHJlYXNvbixcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogcGh5c2ljYWxSZXNvdXJjZUlkLFxuICAgICAgU3RhY2tJZDogZXZlbnQuU3RhY2tJZCxcbiAgICAgIFJlcXVlc3RJZDogZXZlbnQuUmVxdWVzdElkLFxuICAgICAgTG9naWNhbFJlc291cmNlSWQ6IGV2ZW50LkxvZ2ljYWxSZXNvdXJjZUlkLFxuICAgICAgRGF0YToge1xuICAgICAgICAvLyBBZGQgbG9nIGdyb3VwIG5hbWUgYXMgcGFydCBvZiB0aGUgcmVzcG9uc2Ugc28gdGhhdCBpdCdzIGF2YWlsYWJsZSB2aWEgRm46OkdldEF0dFxuICAgICAgICBMb2dHcm91cE5hbWU6IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Mb2dHcm91cE5hbWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc29sZS5sb2coJ1Jlc3BvbmRpbmcnLCByZXNwb25zZUJvZHkpO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcbiAgICBjb25zdCBwYXJzZWRVcmwgPSByZXF1aXJlKCd1cmwnKS5wYXJzZShldmVudC5SZXNwb25zZVVSTCk7XG4gICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICBob3N0bmFtZTogcGFyc2VkVXJsLmhvc3RuYW1lLFxuICAgICAgcGF0aDogcGFyc2VkVXJsLnBhdGgsXG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnY29udGVudC10eXBlJzogJycsXG4gICAgICAgICdjb250ZW50LWxlbmd0aCc6IEJ1ZmZlci5ieXRlTGVuZ3RoKHJlc3BvbnNlQm9keSwgJ3V0ZjgnKSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xuICAgICAgICBjb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgnaHR0cHMnKS5yZXF1ZXN0KHJlcXVlc3RPcHRpb25zLCByZXNvbHZlKTtcbiAgICAgICAgcmVxdWVzdC5vbignZXJyb3InLCByZWplY3QpO1xuICAgICAgICByZXF1ZXN0LndyaXRlKHJlc3BvbnNlQm9keSk7XG4gICAgICAgIHJlcXVlc3QuZW5kKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZUludE9wdGlvbmFsKHZhbHVlPzogc3RyaW5nLCBiYXNlID0gMTApOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gcGFyc2VJbnQodmFsdWUsIGJhc2UpO1xufVxuXG5mdW5jdGlvbiBtYWtlV2l0aERlbGF5KG1heFJldHJpZXM6IG51bWJlciA9IDEwLCBkZWxheTogbnVtYmVyID0gMTAwKTogKGJsb2NrOiAoKSA9PiBQcm9taXNlPHZvaWQ+KSA9PiBQcm9taXNlPHZvaWQ+IHtcbiAgLy8gSWYgd2UgdHJ5IHRvIHVwZGF0ZSB0aGUgbG9nIGdyb3VwLCB0aGVuIGR1ZSB0byB0aGUgYXN5bmMgbmF0dXJlIG9mXG4gIC8vIExhbWJkYSBsb2dnaW5nIHRoZXJlIGNvdWxkIGJlIGEgcmFjZSBjb25kaXRpb24gd2hlbiB0aGUgc2FtZSBsb2cgZ3JvdXAgaXNcbiAgLy8gYWxyZWFkeSBiZWluZyBjcmVhdGVkIGJ5IHRoZSBsYW1iZGEgZXhlY3V0aW9uLiBUaGlzIGNhbiBzb21ldGltZSByZXN1bHQgaW5cbiAgLy8gYW4gZXJyb3IgXCJPcGVyYXRpb25BYm9ydGVkRXhjZXB0aW9uOiBBIGNvbmZsaWN0aW5nIG9wZXJhdGlvbiBpcyBjdXJyZW50bHlcbiAgLy8gaW4gcHJvZ3Jlc3MuLi5QbGVhc2UgdHJ5IGFnYWluLlwiXG4gIC8vIFRvIGF2b2lkIGFuIGVycm9yLCB3ZSBkbyBhcyByZXF1ZXN0ZWQgYW5kIHRyeSBhZ2Fpbi5cblxuICByZXR1cm4gYXN5bmMgKGJsb2NrOiAoKSA9PiBQcm9taXNlPHZvaWQ+KSA9PiB7XG4gICAgZG8ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGJsb2NrKCk7XG4gICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIExvZ3MuT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbiB8fCBlcnJvci5uYW1lID09PSAnT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgICBpZiAobWF4UmV0cmllcyA+IDApIHtcbiAgICAgICAgICAgIG1heFJldHJpZXMtLTtcbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRoZSBsb2cgZ3JvdXAgaXMgc3RpbGwgYmVpbmcgY2hhbmdlZCBieSBhbm90aGVyIGV4ZWN1dGlvbiBidXQgd2UgYXJlIG91dCBvZiByZXRyaWVzXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ091dCBvZiBhdHRlbXB0cyB0byBjaGFuZ2UgbG9nIGdyb3VwJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKHRydWUpOyAvLyBleGl0IGhhcHBlbnMgb24gcmV0cnkgY291bnQgY2hlY2tcbiAgfTtcbn1cbiJdfQ==