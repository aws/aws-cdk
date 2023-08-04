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
function makeWithDelay(maxRetries = 5, delayBase = 100, delayCap = 10 * 1000) {
    // If we try to update the log group, then due to the async nature of
    // Lambda logging there could be a race condition when the same log group is
    // already being created by the lambda execution. This can sometime result in
    // an error "OperationAbortedException: A conflicting operation is currently
    // in progress...Please try again."
    // To avoid an error, we do as requested and try again.
    return async (block) => {
        let attempts = 0;
        do {
            try {
                return await block();
            }
            catch (error) {
                if (error instanceof Logs.OperationAbortedException || error.name === 'OperationAbortedException') {
                    if (attempts < maxRetries) {
                        attempts++;
                        await new Promise(resolve => setTimeout(resolve, calculateDelay(attempts, delayBase, delayCap)));
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
function calculateDelay(attempt, base, cap) {
    return Math.round(Math.random() * Math.min(cap, base * 2 ** attempt));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IsNkRBQTZEO0FBQzdELHdEQUF3RDtBQWV4RDs7R0FFRztBQUNILEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxZQUFvQixFQUFFLE1BQWlDLEVBQUUsU0FBd0Q7SUFDakosTUFBTSxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDekIsSUFBSTtZQUNGLE1BQU0sTUFBTSxHQUFHLEVBQUUsWUFBWSxFQUFFLENBQUM7WUFDaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkQsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBRTVCO1FBQUMsT0FBTyxLQUFVLEVBQUU7WUFDbkIsSUFBSSxLQUFLLFlBQVksSUFBSSxDQUFDLDhCQUE4QixJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssZ0NBQWdDLEVBQUU7Z0JBQzNHLDJEQUEyRDtnQkFDM0QsT0FBTzthQUNSO1lBRUQsTUFBTSxLQUFLLENBQUM7U0FDYjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVEOztHQUVHO0FBQ0gsS0FBSyxVQUFVLGNBQWMsQ0FBQyxZQUFvQixFQUFFLE1BQWlDLEVBQUUsU0FBd0Q7SUFDN0ksTUFBTSxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDekIsSUFBSTtZQUNGLE1BQU0sTUFBTSxHQUFHLEVBQUUsWUFBWSxFQUFFLENBQUM7WUFDaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkQsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBRTVCO1FBQUMsT0FBTyxLQUFVLEVBQUU7WUFDbkIsSUFBSSxLQUFLLFlBQVksSUFBSSxDQUFD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dC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCAqIGFzIExvZ3MgZnJvbSAnQGF3cy1zZGsvY2xpZW50LWNsb3Vkd2F0Y2gtbG9ncyc7XG5cbmludGVyZmFjZSBMb2dSZXRlbnRpb25FdmVudCBleHRlbmRzIE9taXQ8QVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCwgJ1Jlc291cmNlUHJvcGVydGllcyc+IHtcbiAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgU2VydmljZVRva2VuOiBzdHJpbmc7XG4gICAgTG9nR3JvdXBOYW1lOiBzdHJpbmc7XG4gICAgTG9nR3JvdXBSZWdpb24/OiBzdHJpbmc7XG4gICAgUmV0ZW50aW9uSW5EYXlzPzogc3RyaW5nO1xuICAgIFNka1JldHJ5Pzoge1xuICAgICAgbWF4UmV0cmllcz86IHN0cmluZztcbiAgICB9O1xuICAgIFJlbW92YWxQb2xpY3k/OiBzdHJpbmdcbiAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbG9nIGdyb3VwIGFuZCBkb2Vzbid0IHRocm93IGlmIGl0IGV4aXN0cy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gY3JlYXRlTG9nR3JvdXBTYWZlKGxvZ0dyb3VwTmFtZTogc3RyaW5nLCBjbGllbnQ6IExvZ3MuQ2xvdWRXYXRjaExvZ3NDbGllbnQsIHdpdGhEZWxheTogKGJsb2NrOiAoKSA9PiBQcm9taXNlPHZvaWQ+KSA9PiBQcm9taXNlPHZvaWQ+KSB7XG4gIGF3YWl0IHdpdGhEZWxheShhc3luYyAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHsgbG9nR3JvdXBOYW1lIH07XG4gICAgICBjb25zdCBjb21tYW5kID0gbmV3IExvZ3MuQ3JlYXRlTG9nR3JvdXBDb21tYW5kKHBhcmFtcyk7XG4gICAgICBhd2FpdCBjbGllbnQuc2VuZChjb21tYW5kKTtcblxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIExvZ3MuUmVzb3VyY2VBbHJlYWR5RXhpc3RzRXhjZXB0aW9uIHx8IGVycm9yLm5hbWUgPT09ICdSZXNvdXJjZUFscmVhZHlFeGlzdHNFeGNlcHRpb24nKSB7XG4gICAgICAgIC8vIFRoZSBsb2cgZ3JvdXAgaXMgYWxyZWFkeSBjcmVhdGVkIGJ5IHRoZSBsYW1iZGEgZXhlY3V0aW9uXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBEZWxldGVzIGEgbG9nIGdyb3VwIGFuZCBkb2Vzbid0IHRocm93IGlmIGl0IGRvZXMgbm90IGV4aXN0LlxuICovXG5hc3luYyBmdW5jdGlvbiBkZWxldGVMb2dHcm91cChsb2dHcm91cE5hbWU6IHN0cmluZywgY2xpZW50OiBMb2dzLkNsb3VkV2F0Y2hMb2dzQ2xpZW50LCB3aXRoRGVsYXk6IChibG9jazogKCkgPT4gUHJvbWlzZTx2b2lkPikgPT4gUHJvbWlzZTx2b2lkPikge1xuICBhd2FpdCB3aXRoRGVsYXkoYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJhbXMgPSB7IGxvZ0dyb3VwTmFtZSB9O1xuICAgICAgY29uc3QgY29tbWFuZCA9IG5ldyBMb2dzLkRlbGV0ZUxvZ0dyb3VwQ29tbWFuZChwYXJhbXMpO1xuICAgICAgYXdhaXQgY2xpZW50LnNlbmQoY29tbWFuZCk7XG5cbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBMb2dzLlJlc291cmNlTm90Rm91bmRFeGNlcHRpb24gfHwgZXJyb3IubmFtZSA9PT0gJ1Jlc291cmNlTm90Rm91bmRFeGNlcHRpb24nKSB7XG4gICAgICAgIC8vIFRoZSBsb2cgZ3JvdXAgZG9lc24ndCBleGlzdFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogUHV0cyBvciBkZWxldGVzIGEgcmV0ZW50aW9uIHBvbGljeSBvbiBhIGxvZyBncm91cC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gc2V0UmV0ZW50aW9uUG9saWN5KFxuICBsb2dHcm91cE5hbWU6IHN0cmluZyxcbiAgY2xpZW50OiBMb2dzLkNsb3VkV2F0Y2hMb2dzQ2xpZW50LFxuICB3aXRoRGVsYXk6IChibG9jazogKCkgPT4gUHJvbWlzZTx2b2lkPikgPT4gUHJvbWlzZTx2b2lkPixcbiAgcmV0ZW50aW9uSW5EYXlzPzogbnVtYmVyLFxuKSB7XG5cbiAgYXdhaXQgd2l0aERlbGF5KGFzeW5jICgpID0+IHtcbiAgICBpZiAoIXJldGVudGlvbkluRGF5cykge1xuICAgICAgY29uc3QgcGFyYW1zID0geyBsb2dHcm91cE5hbWUgfTtcbiAgICAgIGNvbnN0IGRlbGV0ZUNvbW1hbmQgPSBuZXcgTG9ncy5EZWxldGVSZXRlbnRpb25Qb2xpY3lDb21tYW5kKHBhcmFtcyk7XG4gICAgICBhd2FpdCBjbGllbnQuc2VuZChkZWxldGVDb21tYW5kKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcGFyYW1zID0geyBsb2dHcm91cE5hbWUsIHJldGVudGlvbkluRGF5cyB9O1xuICAgICAgY29uc3QgcHV0Q29tbWFuZCA9IG5ldyBMb2dzLlB1dFJldGVudGlvblBvbGljeUNvbW1hbmQocGFyYW1zKTtcbiAgICAgIGF3YWl0IGNsaWVudC5zZW5kKHB1dENvbW1hbmQpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBMb2dSZXRlbnRpb25FdmVudCwgY29udGV4dDogQVdTTGFtYmRhLkNvbnRleHQpIHtcbiAgdHJ5IHtcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh7IC4uLmV2ZW50LCBSZXNwb25zZVVSTDogJy4uLicgfSkpO1xuXG4gICAgLy8gVGhlIHRhcmdldCBsb2cgZ3JvdXBcbiAgICBjb25zdCBsb2dHcm91cE5hbWUgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuTG9nR3JvdXBOYW1lO1xuXG4gICAgLy8gVGhlIHJlZ2lvbiBvZiB0aGUgdGFyZ2V0IGxvZyBncm91cFxuICAgIGNvbnN0IGxvZ0dyb3VwUmVnaW9uID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkxvZ0dyb3VwUmVnaW9uO1xuXG4gICAgLy8gUGFyc2UgdG8gQVdTIFNESyByZXRyeSBvcHRpb25zXG4gICAgY29uc3Qgd2l0aERlbGF5ID0gbWFrZVdpdGhEZWxheShwYXJzZUludE9wdGlvbmFsKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5TZGtSZXRyeT8ubWF4UmV0cmllcykpO1xuXG4gICAgY29uc3Qgc2RrQ29uZmlnOiBMb2dzLkNsb3VkV2F0Y2hMb2dzQ2xpZW50Q29uZmlnID0ge1xuICAgICAgbG9nZ2VyOiBjb25zb2xlLFxuICAgICAgcmVnaW9uOiBsb2dHcm91cFJlZ2lvbixcbiAgICB9O1xuICAgIGNvbnN0IGNsaWVudCA9IG5ldyBMb2dzLkNsb3VkV2F0Y2hMb2dzQ2xpZW50KHNka0NvbmZpZyk7XG5cbiAgICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdDcmVhdGUnIHx8IGV2ZW50LlJlcXVlc3RUeXBlID09PSAnVXBkYXRlJykge1xuICAgICAgLy8gQWN0IG9uIHRoZSB0YXJnZXQgbG9nIGdyb3VwXG4gICAgICBhd2FpdCBjcmVhdGVMb2dHcm91cFNhZmUobG9nR3JvdXBOYW1lLCBjbGllbnQsIHdpdGhEZWxheSk7XG4gICAgICBhd2FpdCBzZXRSZXRlbnRpb25Qb2xpY3kobG9nR3JvdXBOYW1lLCBjbGllbnQsIHdpdGhEZWxheSwgcGFyc2VJbnRPcHRpb25hbChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuUmV0ZW50aW9uSW5EYXlzKSk7XG5cbiAgICAgIC8vIENvbmZpZ3VyZSB0aGUgTG9nIEdyb3VwIGZvciB0aGUgQ3VzdG9tIFJlc291cmNlIGZ1bmN0aW9uIGl0c2VsZlxuICAgICAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJykge1xuICAgICAgICBjb25zdCBjbGllbnRGb3JDdXN0b21SZXNvdXJjZUZ1bmN0aW9uID0gbmV3IExvZ3MuQ2xvdWRXYXRjaExvZ3NDbGllbnQoe1xuICAgICAgICAgIGxvZ2dlcjogY29uc29sZSxcbiAgICAgICAgICByZWdpb246IHByb2Nlc3MuZW52LkFXU19SRUdJT04sXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBTZXQgYSByZXRlbnRpb24gcG9saWN5IG9mIDEgZGF5IG9uIHRoZSBsb2dzIG9mIHRoaXMgdmVyeSBmdW5jdGlvbi5cbiAgICAgICAgLy8gRHVlIHRvIHRoZSBhc3luYyBuYXR1cmUgb2YgdGhlIGxvZyBncm91cCBjcmVhdGlvbiwgdGhlIGxvZyBncm91cCBmb3IgdGhpcyBmdW5jdGlvbiBtaWdodFxuICAgICAgICAvLyBzdGlsbCBiZSBub3QgY3JlYXRlZCB5ZXQgYXQgdGhpcyBwb2ludC4gVGhlcmVmb3JlIHdlIGF0dGVtcHQgdG8gY3JlYXRlIGl0LlxuICAgICAgICAvLyBJbiBjYXNlIGl0IGlzIGJlaW5nIGNyZWF0ZWQsIGNyZWF0ZUxvZ0dyb3VwU2FmZSB3aWxsIGhhbmRsZSB0aGUgY29uZmxpY3QuXG4gICAgICAgIGF3YWl0IGNyZWF0ZUxvZ0dyb3VwU2FmZShgL2F3cy9sYW1iZGEvJHtjb250ZXh0LmZ1bmN0aW9uTmFtZX1gLCBjbGllbnRGb3JDdXN0b21SZXNvdXJjZUZ1bmN0aW9uLCB3aXRoRGVsYXkpO1xuICAgICAgICAvLyBJZiBjcmVhdGVMb2dHcm91cFNhZmUgZmFpbHMsIHRoZSBsb2cgZ3JvdXAgaXMgbm90IGNyZWF0ZWQgZXZlbiBhZnRlciBtdWx0aXBsZSBhdHRlbXB0cy5cbiAgICAgICAgLy8gSW4gdGhpcyBjYXNlIHdlIGhhdmUgbm90aGluZyB0byBzZXQgdGhlIHJldGVudGlvbiBwb2xpY3kgb24gYnV0IGFuIGV4Y2VwdGlvbiB3aWxsIHNraXBcbiAgICAgICAgLy8gdGhlIG5leHQgbGluZS5cbiAgICAgICAgYXdhaXQgc2V0UmV0ZW50aW9uUG9saWN5KGAvYXdzL2xhbWJkYS8ke2NvbnRleHQuZnVuY3Rpb25OYW1lfWAsIGNsaWVudEZvckN1c3RvbVJlc291cmNlRnVuY3Rpb24sIHdpdGhEZWxheSwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gV2hlbiB0aGUgcmVxdWVzdFR5cGUgaXMgZGVsZXRlLCBkZWxldGUgdGhlIGxvZyBncm91cCBpZiB0aGUgcmVtb3ZhbCBwb2xpY3kgaXMgZGVsZXRlXG4gICAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnRGVsZXRlJyAmJiBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuUmVtb3ZhbFBvbGljeSA9PT0gJ2Rlc3Ryb3knKSB7XG4gICAgICBhd2FpdCBkZWxldGVMb2dHcm91cChsb2dHcm91cE5hbWUsIGNsaWVudCwgd2l0aERlbGF5KTtcbiAgICAgIC8vIGVsc2UgcmV0YWluIHRoZSBsb2cgZ3JvdXBcbiAgICB9XG5cbiAgICBhd2FpdCByZXNwb25kKCdTVUNDRVNTJywgJ09LJywgbG9nR3JvdXBOYW1lKTtcbiAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgY29uc29sZS5sb2coZSk7XG4gICAgYXdhaXQgcmVzcG9uZCgnRkFJTEVEJywgZS5tZXNzYWdlLCBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuTG9nR3JvdXBOYW1lKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc3BvbmQocmVzcG9uc2VTdGF0dXM6IHN0cmluZywgcmVhc29uOiBzdHJpbmcsIHBoeXNpY2FsUmVzb3VyY2VJZDogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzcG9uc2VCb2R5ID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgU3RhdHVzOiByZXNwb25zZVN0YXR1cyxcbiAgICAgIFJlYXNvbjogcmVhc29uLFxuICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBwaHlzaWNhbFJlc291cmNlSWQsXG4gICAgICBTdGFja0lkOiBldmVudC5TdGFja0lkLFxuICAgICAgUmVxdWVzdElkOiBldmVudC5SZXF1ZXN0SWQsXG4gICAgICBMb2dpY2FsUmVzb3VyY2VJZDogZXZlbnQuTG9naWNhbFJlc291cmNlSWQsXG4gICAgICBEYXRhOiB7XG4gICAgICAgIC8vIEFkZCBsb2cgZ3JvdXAgbmFtZSBhcyBwYXJ0IG9mIHRoZSByZXNwb25zZSBzbyB0aGF0IGl0J3MgYXZhaWxhYmxlIHZpYSBGbjo6R2V0QXR0XG4gICAgICAgIExvZ0dyb3VwTmFtZTogZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkxvZ0dyb3VwTmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZygnUmVzcG9uZGluZycsIHJlc3BvbnNlQm9keSk7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xuICAgIGNvbnN0IHBhcnNlZFVybCA9IHJlcXVpcmUoJ3VybCcpLnBhcnNlKGV2ZW50LlJlc3BvbnNlVVJMKTtcbiAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IHtcbiAgICAgIGhvc3RuYW1lOiBwYXJzZWRVcmwuaG9zdG5hbWUsXG4gICAgICBwYXRoOiBwYXJzZWRVcmwucGF0aCxcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdjb250ZW50LXR5cGUnOiAnJyxcbiAgICAgICAgJ2NvbnRlbnQtbGVuZ3RoJzogQnVmZmVyLmJ5dGVMZW5ndGgocmVzcG9uc2VCb2R5LCAndXRmOCcpLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSByZXF1aXJlKCdodHRwcycpLnJlcXVlc3QocmVxdWVzdE9wdGlvbnMsIHJlc29sdmUpO1xuICAgICAgICByZXF1ZXN0Lm9uKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICAgIHJlcXVlc3Qud3JpdGUocmVzcG9uc2VCb2R5KTtcbiAgICAgICAgcmVxdWVzdC5lbmQoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlSW50T3B0aW9uYWwodmFsdWU/OiBzdHJpbmcsIGJhc2UgPSAxMCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiBwYXJzZUludCh2YWx1ZSwgYmFzZSk7XG59XG5cbmZ1bmN0aW9uIG1ha2VXaXRoRGVsYXkoXG4gIG1heFJldHJpZXM6IG51bWJlciA9IDUsXG4gIGRlbGF5QmFzZTogbnVtYmVyID0gMTAwLFxuICBkZWxheUNhcCA9IDEwICogMTAwMCwgLy8gMTBzXG4pOiAoYmxvY2s6ICgpID0+IFByb21pc2U8dm9pZD4pID0+IFByb21pc2U8dm9pZD4ge1xuICAvLyBJZiB3ZSB0cnkgdG8gdXBkYXRlIHRoZSBsb2cgZ3JvdXAsIHRoZW4gZHVlIHRvIHRoZSBhc3luYyBuYXR1cmUgb2ZcbiAgLy8gTGFtYmRhIGxvZ2dpbmcgdGhlcmUgY291bGQgYmUgYSByYWNlIGNvbmRpdGlvbiB3aGVuIHRoZSBzYW1lIGxvZyBncm91cCBpc1xuICAvLyBhbHJlYWR5IGJlaW5nIGNyZWF0ZWQgYnkgdGhlIGxhbWJkYSBleGVjdXRpb24uIFRoaXMgY2FuIHNvbWV0aW1lIHJlc3VsdCBpblxuICAvLyBhbiBlcnJvciBcIk9wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb246IEEgY29uZmxpY3Rpbmcgb3BlcmF0aW9uIGlzIGN1cnJlbnRseVxuICAvLyBpbiBwcm9ncmVzcy4uLlBsZWFzZSB0cnkgYWdhaW4uXCJcbiAgLy8gVG8gYXZvaWQgYW4gZXJyb3IsIHdlIGRvIGFzIHJlcXVlc3RlZCBhbmQgdHJ5IGFnYWluLlxuXG4gIHJldHVybiBhc3luYyAoYmxvY2s6ICgpID0+IFByb21pc2U8dm9pZD4pID0+IHtcbiAgICBsZXQgYXR0ZW1wdHMgPSAwO1xuICAgIGRvIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBibG9jaygpO1xuICAgICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBMb2dzLk9wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb24gfHwgZXJyb3IubmFtZSA9PT0gJ09wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb24nKSB7XG4gICAgICAgICAgaWYgKGF0dGVtcHRzIDwgbWF4UmV0cmllcyApIHtcbiAgICAgICAgICAgIGF0dGVtcHRzKys7XG4gICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgY2FsY3VsYXRlRGVsYXkoYXR0ZW1wdHMsIGRlbGF5QmFzZSwgZGVsYXlDYXApKSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVGhlIGxvZyBncm91cCBpcyBzdGlsbCBiZWluZyBjaGFuZ2VkIGJ5IGFub3RoZXIgZXhlY3V0aW9uIGJ1dCB3ZSBhcmUgb3V0IG9mIHJldHJpZXNcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignT3V0IG9mIGF0dGVtcHRzIHRvIGNoYW5nZSBsb2cgZ3JvdXAnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfSB3aGlsZSAodHJ1ZSk7IC8vIGV4aXQgaGFwcGVucyBvbiByZXRyeSBjb3VudCBjaGVja1xuICB9O1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVEZWxheShhdHRlbXB0OiBudW1iZXIsIGJhc2U6IG51bWJlciwgY2FwOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogTWF0aC5taW4oY2FwLCBiYXNlICogMiAqKiBhdHRlbXB0KSk7XG59XG4iXX0=