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
        const maxRetries = parseIntOptional(event.ResourceProperties.SdkRetry?.maxRetries) ?? 5;
        const withDelay = makeWithDelay(maxRetries);
        const sdkConfig = {
            logger: console,
            region: logGroupRegion,
            maxAttempts: Math.max(5, maxRetries), // Use a minimum for SDK level retries, because it might include retryable failures that withDelay isn't checking for
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
function makeWithDelay(maxRetries, delayBase = 100, delayCap = 10 * 1000) {
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
                if (error instanceof Logs.OperationAbortedException
                    || error.name === 'OperationAbortedException'
                    || error.name === 'ThrottlingException' // There is no class to check with instanceof, see https://github.com/aws/aws-sdk-js-v3/issues/5140
                ) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IsNkRBQTZEO0FBQzdELHdEQUF3RDtBQWV4RDs7R0FFRztBQUNILEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxZQUFvQixFQUFFLE1BQWlDLEVBQUUsU0FBd0Q7SUFDakosTUFBTSxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDekIsSUFBSSxDQUFDO1lBQ0gsTUFBTSxNQUFNLEdBQUcsRUFBRSxZQUFZLEVBQUUsQ0FBQztZQUNoQyxNQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2RCxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFN0IsQ0FBQztRQUFDLE9BQU8sS0FBVSxFQUFFLENBQUM7WUFDcEIsSUFBSSxLQUFLLFlBQVksSUFBSSxDQUFDLDhCQUE4QixJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssZ0NBQWdDLEVBQUUsQ0FBQztnQkFDNUcsMkRBQTJEO2dCQUMzRCxPQUFPO1lBQ1QsQ0FBQztZQUVELE1BQU0sS0FBSyxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVEOztHQUVHO0FBQ0gsS0FBSyxVQUFVLGNBQWMsQ0FBQyxZQUFvQixFQUFFLE1BQWlDLEVBQUUsU0FBd0Q7SUFDN0ksTUFBTSxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDekIsSUFBSSxDQUFDO1lBQ0gsTUFBTSxNQUFNLEdBQUcsRUFBRSxZQUFZLEVBQUUsQ0FBQztZQUNoQyxNQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2RCxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFN0IsQ0FBQztRQUFDLE9BQU8s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QUFxQyxDQUFDLENBQUM7b0JBQ3pELENBQUM7Z0JBQ0gsQ0FBQztnQkFDRCxNQUFNLEtBQUssQ0FBQztZQUNkLENBQUM7UUFDSCxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsb0NBQW9DO0lBQ3RELENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxPQUFlLEVBQUUsSUFBWSxFQUFFLEdBQVc7SUFDaEUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDeEUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCAqIGFzIExvZ3MgZnJvbSAnQGF3cy1zZGsvY2xpZW50LWNsb3Vkd2F0Y2gtbG9ncyc7XG5cbmludGVyZmFjZSBMb2dSZXRlbnRpb25FdmVudCBleHRlbmRzIE9taXQ8QVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCwgJ1Jlc291cmNlUHJvcGVydGllcyc+IHtcbiAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgU2VydmljZVRva2VuOiBzdHJpbmc7XG4gICAgTG9nR3JvdXBOYW1lOiBzdHJpbmc7XG4gICAgTG9nR3JvdXBSZWdpb24/OiBzdHJpbmc7XG4gICAgUmV0ZW50aW9uSW5EYXlzPzogc3RyaW5nO1xuICAgIFNka1JldHJ5Pzoge1xuICAgICAgbWF4UmV0cmllcz86IHN0cmluZztcbiAgICB9O1xuICAgIFJlbW92YWxQb2xpY3k/OiBzdHJpbmdcbiAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbG9nIGdyb3VwIGFuZCBkb2Vzbid0IHRocm93IGlmIGl0IGV4aXN0cy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gY3JlYXRlTG9nR3JvdXBTYWZlKGxvZ0dyb3VwTmFtZTogc3RyaW5nLCBjbGllbnQ6IExvZ3MuQ2xvdWRXYXRjaExvZ3NDbGllbnQsIHdpdGhEZWxheTogKGJsb2NrOiAoKSA9PiBQcm9taXNlPHZvaWQ+KSA9PiBQcm9taXNlPHZvaWQ+KSB7XG4gIGF3YWl0IHdpdGhEZWxheShhc3luYyAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHsgbG9nR3JvdXBOYW1lIH07XG4gICAgICBjb25zdCBjb21tYW5kID0gbmV3IExvZ3MuQ3JlYXRlTG9nR3JvdXBDb21tYW5kKHBhcmFtcyk7XG4gICAgICBhd2FpdCBjbGllbnQuc2VuZChjb21tYW5kKTtcblxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIExvZ3MuUmVzb3VyY2VBbHJlYWR5RXhpc3RzRXhjZXB0aW9uIHx8IGVycm9yLm5hbWUgPT09ICdSZXNvdXJjZUFscmVhZHlFeGlzdHNFeGNlcHRpb24nKSB7XG4gICAgICAgIC8vIFRoZSBsb2cgZ3JvdXAgaXMgYWxyZWFkeSBjcmVhdGVkIGJ5IHRoZSBsYW1iZGEgZXhlY3V0aW9uXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBEZWxldGVzIGEgbG9nIGdyb3VwIGFuZCBkb2Vzbid0IHRocm93IGlmIGl0IGRvZXMgbm90IGV4aXN0LlxuICovXG5hc3luYyBmdW5jdGlvbiBkZWxldGVMb2dHcm91cChsb2dHcm91cE5hbWU6IHN0cmluZywgY2xpZW50OiBMb2dzLkNsb3VkV2F0Y2hMb2dzQ2xpZW50LCB3aXRoRGVsYXk6IChibG9jazogKCkgPT4gUHJvbWlzZTx2b2lkPikgPT4gUHJvbWlzZTx2b2lkPikge1xuICBhd2FpdCB3aXRoRGVsYXkoYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJhbXMgPSB7IGxvZ0dyb3VwTmFtZSB9O1xuICAgICAgY29uc3QgY29tbWFuZCA9IG5ldyBMb2dzLkRlbGV0ZUxvZ0dyb3VwQ29tbWFuZChwYXJhbXMpO1xuICAgICAgYXdhaXQgY2xpZW50LnNlbmQoY29tbWFuZCk7XG5cbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBMb2dzLlJlc291cmNlTm90Rm91bmRFeGNlcHRpb24gfHwgZXJyb3IubmFtZSA9PT0gJ1Jlc291cmNlTm90Rm91bmRFeGNlcHRpb24nKSB7XG4gICAgICAgIC8vIFRoZSBsb2cgZ3JvdXAgZG9lc24ndCBleGlzdFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogUHV0cyBvciBkZWxldGVzIGEgcmV0ZW50aW9uIHBvbGljeSBvbiBhIGxvZyBncm91cC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gc2V0UmV0ZW50aW9uUG9saWN5KFxuICBsb2dHcm91cE5hbWU6IHN0cmluZyxcbiAgY2xpZW50OiBMb2dzLkNsb3VkV2F0Y2hMb2dzQ2xpZW50LFxuICB3aXRoRGVsYXk6IChibG9jazogKCkgPT4gUHJvbWlzZTx2b2lkPikgPT4gUHJvbWlzZTx2b2lkPixcbiAgcmV0ZW50aW9uSW5EYXlzPzogbnVtYmVyLFxuKSB7XG5cbiAgYXdhaXQgd2l0aERlbGF5KGFzeW5jICgpID0+IHtcbiAgICBpZiAoIXJldGVudGlvbkluRGF5cykge1xuICAgICAgY29uc3QgcGFyYW1zID0geyBsb2dHcm91cE5hbWUgfTtcbiAgICAgIGNvbnN0IGRlbGV0ZUNvbW1hbmQgPSBuZXcgTG9ncy5EZWxldGVSZXRlbnRpb25Qb2xpY3lDb21tYW5kKHBhcmFtcyk7XG4gICAgICBhd2FpdCBjbGllbnQuc2VuZChkZWxldGVDb21tYW5kKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcGFyYW1zID0geyBsb2dHcm91cE5hbWUsIHJldGVudGlvbkluRGF5cyB9O1xuICAgICAgY29uc3QgcHV0Q29tbWFuZCA9IG5ldyBMb2dzLlB1dFJldGVudGlvblBvbGljeUNvbW1hbmQocGFyYW1zKTtcbiAgICAgIGF3YWl0IGNsaWVudC5zZW5kKHB1dENvbW1hbmQpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBMb2dSZXRlbnRpb25FdmVudCwgY29udGV4dDogQVdTTGFtYmRhLkNvbnRleHQpIHtcbiAgdHJ5IHtcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh7IC4uLmV2ZW50LCBSZXNwb25zZVVSTDogJy4uLicgfSkpO1xuXG4gICAgLy8gVGhlIHRhcmdldCBsb2cgZ3JvdXBcbiAgICBjb25zdCBsb2dHcm91cE5hbWUgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuTG9nR3JvdXBOYW1lO1xuXG4gICAgLy8gVGhlIHJlZ2lvbiBvZiB0aGUgdGFyZ2V0IGxvZyBncm91cFxuICAgIGNvbnN0IGxvZ0dyb3VwUmVnaW9uID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkxvZ0dyb3VwUmVnaW9uO1xuXG4gICAgLy8gUGFyc2UgdG8gQVdTIFNESyByZXRyeSBvcHRpb25zXG4gICAgY29uc3QgbWF4UmV0cmllcyA9IHBhcnNlSW50T3B0aW9uYWwoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlNka1JldHJ5Py5tYXhSZXRyaWVzKSA/PyA1O1xuICAgIGNvbnN0IHdpdGhEZWxheSA9IG1ha2VXaXRoRGVsYXkobWF4UmV0cmllcyk7XG5cbiAgICBjb25zdCBzZGtDb25maWc6IExvZ3MuQ2xvdWRXYXRjaExvZ3NDbGllbnRDb25maWcgPSB7XG4gICAgICBsb2dnZXI6IGNvbnNvbGUsXG4gICAgICByZWdpb246IGxvZ0dyb3VwUmVnaW9uLFxuICAgICAgbWF4QXR0ZW1wdHM6IE1hdGgubWF4KDUsIG1heFJldHJpZXMpLCAvLyBVc2UgYSBtaW5pbXVtIGZvciBTREsgbGV2ZWwgcmV0cmllcywgYmVjYXVzZSBpdCBtaWdodCBpbmNsdWRlIHJldHJ5YWJsZSBmYWlsdXJlcyB0aGF0IHdpdGhEZWxheSBpc24ndCBjaGVja2luZyBmb3JcbiAgICB9O1xuICAgIGNvbnN0IGNsaWVudCA9IG5ldyBMb2dzLkNsb3VkV2F0Y2hMb2dzQ2xpZW50KHNka0NvbmZpZyk7XG5cbiAgICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdDcmVhdGUnIHx8IGV2ZW50LlJlcXVlc3RUeXBlID09PSAnVXBkYXRlJykge1xuICAgICAgLy8gQWN0IG9uIHRoZSB0YXJnZXQgbG9nIGdyb3VwXG4gICAgICBhd2FpdCBjcmVhdGVMb2dHcm91cFNhZmUobG9nR3JvdXBOYW1lLCBjbGllbnQsIHdpdGhEZWxheSk7XG4gICAgICBhd2FpdCBzZXRSZXRlbnRpb25Qb2xpY3kobG9nR3JvdXBOYW1lLCBjbGllbnQsIHdpdGhEZWxheSwgcGFyc2VJbnRPcHRpb25hbChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuUmV0ZW50aW9uSW5EYXlzKSk7XG5cbiAgICAgIC8vIENvbmZpZ3VyZSB0aGUgTG9nIEdyb3VwIGZvciB0aGUgQ3VzdG9tIFJlc291cmNlIGZ1bmN0aW9uIGl0c2VsZlxuICAgICAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJykge1xuICAgICAgICBjb25zdCBjbGllbnRGb3JDdXN0b21SZXNvdXJjZUZ1bmN0aW9uID0gbmV3IExvZ3MuQ2xvdWRXYXRjaExvZ3NDbGllbnQoe1xuICAgICAgICAgIGxvZ2dlcjogY29uc29sZSxcbiAgICAgICAgICByZWdpb246IHByb2Nlc3MuZW52LkFXU19SRUdJT04sXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBTZXQgYSByZXRlbnRpb24gcG9saWN5IG9mIDEgZGF5IG9uIHRoZSBsb2dzIG9mIHRoaXMgdmVyeSBmdW5jdGlvbi5cbiAgICAgICAgLy8gRHVlIHRvIHRoZSBhc3luYyBuYXR1cmUgb2YgdGhlIGxvZyBncm91cCBjcmVhdGlvbiwgdGhlIGxvZyBncm91cCBmb3IgdGhpcyBmdW5jdGlvbiBtaWdodFxuICAgICAgICAvLyBzdGlsbCBiZSBub3QgY3JlYXRlZCB5ZXQgYXQgdGhpcyBwb2ludC4gVGhlcmVmb3JlIHdlIGF0dGVtcHQgdG8gY3JlYXRlIGl0LlxuICAgICAgICAvLyBJbiBjYXNlIGl0IGlzIGJlaW5nIGNyZWF0ZWQsIGNyZWF0ZUxvZ0dyb3VwU2FmZSB3aWxsIGhhbmRsZSB0aGUgY29uZmxpY3QuXG4gICAgICAgIGF3YWl0IGNyZWF0ZUxvZ0dyb3VwU2FmZShgL2F3cy9sYW1iZGEvJHtjb250ZXh0LmZ1bmN0aW9uTmFtZX1gLCBjbGllbnRGb3JDdXN0b21SZXNvdXJjZUZ1bmN0aW9uLCB3aXRoRGVsYXkpO1xuICAgICAgICAvLyBJZiBjcmVhdGVMb2dHcm91cFNhZmUgZmFpbHMsIHRoZSBsb2cgZ3JvdXAgaXMgbm90IGNyZWF0ZWQgZXZlbiBhZnRlciBtdWx0aXBsZSBhdHRlbXB0cy5cbiAgICAgICAgLy8gSW4gdGhpcyBjYXNlIHdlIGhhdmUgbm90aGluZyB0byBzZXQgdGhlIHJldGVudGlvbiBwb2xpY3kgb24gYnV0IGFuIGV4Y2VwdGlvbiB3aWxsIHNraXBcbiAgICAgICAgLy8gdGhlIG5leHQgbGluZS5cbiAgICAgICAgYXdhaXQgc2V0UmV0ZW50aW9uUG9saWN5KGAvYXdzL2xhbWJkYS8ke2NvbnRleHQuZnVuY3Rpb25OYW1lfWAsIGNsaWVudEZvckN1c3RvbVJlc291cmNlRnVuY3Rpb24sIHdpdGhEZWxheSwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gV2hlbiB0aGUgcmVxdWVzdFR5cGUgaXMgZGVsZXRlLCBkZWxldGUgdGhlIGxvZyBncm91cCBpZiB0aGUgcmVtb3ZhbCBwb2xpY3kgaXMgZGVsZXRlXG4gICAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnRGVsZXRlJyAmJiBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuUmVtb3ZhbFBvbGljeSA9PT0gJ2Rlc3Ryb3knKSB7XG4gICAgICBhd2FpdCBkZWxldGVMb2dHcm91cChsb2dHcm91cE5hbWUsIGNsaWVudCwgd2l0aERlbGF5KTtcbiAgICAgIC8vIGVsc2UgcmV0YWluIHRoZSBsb2cgZ3JvdXBcbiAgICB9XG5cbiAgICBhd2FpdCByZXNwb25kKCdTVUNDRVNTJywgJ09LJywgbG9nR3JvdXBOYW1lKTtcbiAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgY29uc29sZS5sb2coZSk7XG4gICAgYXdhaXQgcmVzcG9uZCgnRkFJTEVEJywgZS5tZXNzYWdlLCBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuTG9nR3JvdXBOYW1lKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc3BvbmQocmVzcG9uc2VTdGF0dXM6IHN0cmluZywgcmVhc29uOiBzdHJpbmcsIHBoeXNpY2FsUmVzb3VyY2VJZDogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzcG9uc2VCb2R5ID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgU3RhdHVzOiByZXNwb25zZVN0YXR1cyxcbiAgICAgIFJlYXNvbjogcmVhc29uLFxuICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBwaHlzaWNhbFJlc291cmNlSWQsXG4gICAgICBTdGFja0lkOiBldmVudC5TdGFja0lkLFxuICAgICAgUmVxdWVzdElkOiBldmVudC5SZXF1ZXN0SWQsXG4gICAgICBMb2dpY2FsUmVzb3VyY2VJZDogZXZlbnQuTG9naWNhbFJlc291cmNlSWQsXG4gICAgICBEYXRhOiB7XG4gICAgICAgIC8vIEFkZCBsb2cgZ3JvdXAgbmFtZSBhcyBwYXJ0IG9mIHRoZSByZXNwb25zZSBzbyB0aGF0IGl0J3MgYXZhaWxhYmxlIHZpYSBGbjo6R2V0QXR0XG4gICAgICAgIExvZ0dyb3VwTmFtZTogZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkxvZ0dyb3VwTmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZygnUmVzcG9uZGluZycsIHJlc3BvbnNlQm9keSk7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xuICAgIGNvbnN0IHBhcnNlZFVybCA9IHJlcXVpcmUoJ3VybCcpLnBhcnNlKGV2ZW50LlJlc3BvbnNlVVJMKTtcbiAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IHtcbiAgICAgIGhvc3RuYW1lOiBwYXJzZWRVcmwuaG9zdG5hbWUsXG4gICAgICBwYXRoOiBwYXJzZWRVcmwucGF0aCxcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdjb250ZW50LXR5cGUnOiAnJyxcbiAgICAgICAgJ2NvbnRlbnQtbGVuZ3RoJzogQnVmZmVyLmJ5dGVMZW5ndGgocmVzcG9uc2VCb2R5LCAndXRmOCcpLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSByZXF1aXJlKCdodHRwcycpLnJlcXVlc3QocmVxdWVzdE9wdGlvbnMsIHJlc29sdmUpO1xuICAgICAgICByZXF1ZXN0Lm9uKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICAgIHJlcXVlc3Qud3JpdGUocmVzcG9uc2VCb2R5KTtcbiAgICAgICAgcmVxdWVzdC5lbmQoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlSW50T3B0aW9uYWwodmFsdWU/OiBzdHJpbmcsIGJhc2UgPSAxMCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiBwYXJzZUludCh2YWx1ZSwgYmFzZSk7XG59XG5cbmZ1bmN0aW9uIG1ha2VXaXRoRGVsYXkoXG4gIG1heFJldHJpZXM6IG51bWJlcixcbiAgZGVsYXlCYXNlOiBudW1iZXIgPSAxMDAsXG4gIGRlbGF5Q2FwID0gMTAgKiAxMDAwLCAvLyAxMHNcbik6IChibG9jazogKCkgPT4gUHJvbWlzZTx2b2lkPikgPT4gUHJvbWlzZTx2b2lkPiB7XG4gIC8vIElmIHdlIHRyeSB0byB1cGRhdGUgdGhlIGxvZyBncm91cCwgdGhlbiBkdWUgdG8gdGhlIGFzeW5jIG5hdHVyZSBvZlxuICAvLyBMYW1iZGEgbG9nZ2luZyB0aGVyZSBjb3VsZCBiZSBhIHJhY2UgY29uZGl0aW9uIHdoZW4gdGhlIHNhbWUgbG9nIGdyb3VwIGlzXG4gIC8vIGFscmVhZHkgYmVpbmcgY3JlYXRlZCBieSB0aGUgbGFtYmRhIGV4ZWN1dGlvbi4gVGhpcyBjYW4gc29tZXRpbWUgcmVzdWx0IGluXG4gIC8vIGFuIGVycm9yIFwiT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbjogQSBjb25mbGljdGluZyBvcGVyYXRpb24gaXMgY3VycmVudGx5XG4gIC8vIGluIHByb2dyZXNzLi4uUGxlYXNlIHRyeSBhZ2Fpbi5cIlxuICAvLyBUbyBhdm9pZCBhbiBlcnJvciwgd2UgZG8gYXMgcmVxdWVzdGVkIGFuZCB0cnkgYWdhaW4uXG5cbiAgcmV0dXJuIGFzeW5jIChibG9jazogKCkgPT4gUHJvbWlzZTx2b2lkPikgPT4ge1xuICAgIGxldCBhdHRlbXB0cyA9IDA7XG4gICAgZG8ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGJsb2NrKCk7XG4gICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBlcnJvciBpbnN0YW5jZW9mIExvZ3MuT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvblxuICAgICAgICAgIHx8IGVycm9yLm5hbWUgPT09ICdPcGVyYXRpb25BYm9ydGVkRXhjZXB0aW9uJ1xuICAgICAgICAgIHx8IGVycm9yLm5hbWUgPT09ICdUaHJvdHRsaW5nRXhjZXB0aW9uJyAvLyBUaGVyZSBpcyBubyBjbGFzcyB0byBjaGVjayB3aXRoIGluc3RhbmNlb2YsIHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1zZGstanMtdjMvaXNzdWVzLzUxNDBcbiAgICAgICAgKSB7XG4gICAgICAgICAgaWYgKGF0dGVtcHRzIDwgbWF4UmV0cmllcyApIHtcbiAgICAgICAgICAgIGF0dGVtcHRzKys7XG4gICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgY2FsY3VsYXRlRGVsYXkoYXR0ZW1wdHMsIGRlbGF5QmFzZSwgZGVsYXlDYXApKSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVGhlIGxvZyBncm91cCBpcyBzdGlsbCBiZWluZyBjaGFuZ2VkIGJ5IGFub3RoZXIgZXhlY3V0aW9uIGJ1dCB3ZSBhcmUgb3V0IG9mIHJldHJpZXNcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignT3V0IG9mIGF0dGVtcHRzIHRvIGNoYW5nZSBsb2cgZ3JvdXAnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfSB3aGlsZSAodHJ1ZSk7IC8vIGV4aXQgaGFwcGVucyBvbiByZXRyeSBjb3VudCBjaGVja1xuICB9O1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVEZWxheShhdHRlbXB0OiBudW1iZXIsIGJhc2U6IG51bWJlciwgY2FwOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogTWF0aC5taW4oY2FwLCBiYXNlICogMiAqKiBhdHRlbXB0KSk7XG59XG4iXX0=