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
            if (error.name === 'ResourceAlreadyExistsException') {
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
            if (error.name === 'ResourceNotFoundException') {
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
                if (error.name === 'OperationAbortedException'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IsNkRBQTZEO0FBQzdELHdEQUF3RDtBQWV4RDs7R0FFRztBQUNILEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxZQUFvQixFQUFFLE1BQWlDLEVBQUUsU0FBd0Q7SUFDakosTUFBTSxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDekIsSUFBSTtZQUNGLE1BQU0sTUFBTSxHQUFHLEVBQUUsWUFBWSxFQUFFLENBQUM7WUFDaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkQsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBRTVCO1FBQUMsT0FBTyxLQUFVLEVBQUU7WUFDbkIsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLGdDQUFnQyxFQUFFO2dCQUNuRCwyREFBMkQ7Z0JBQzNELE9BQU87YUFDUjtZQUVELE1BQU0sS0FBSyxDQUFDO1NBQ2I7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRDs7R0FFRztBQUNILEtBQUssVUFBVSxjQUFjLENBQUMsWUFBb0IsRUFBRSxNQUFpQyxFQUFFLFNBQXdEO0lBQzdJLE1BQU0sU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ3pCLElBQUk7WUFDRixNQUFNLE1BQU0sR0FBRyxFQUFFLFlBQVksRUFBRSxDQUFDO1lBQ2hDLE1BQU0sT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUU1QjtRQUFDLE9BQU8sS0FBVSxFQUFFO1lBQ25CLElBQUksS0FBSyxDQUFDLElBQUksS0FBSywyQkFBMkIsRUFBRTtnQkFDOUMsOEJBQThCO2dCQUM5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Y2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgKiBhcyBMb2dzIGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1jbG91ZHdhdGNoLWxvZ3MnO1xuXG5pbnRlcmZhY2UgTG9nUmV0ZW50aW9uRXZlbnQgZXh0ZW5kcyBPbWl0PEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQsICdSZXNvdXJjZVByb3BlcnRpZXMnPiB7XG4gIFJlc291cmNlUHJvcGVydGllczoge1xuICAgIFNlcnZpY2VUb2tlbjogc3RyaW5nO1xuICAgIExvZ0dyb3VwTmFtZTogc3RyaW5nO1xuICAgIExvZ0dyb3VwUmVnaW9uPzogc3RyaW5nO1xuICAgIFJldGVudGlvbkluRGF5cz86IHN0cmluZztcbiAgICBTZGtSZXRyeT86IHtcbiAgICAgIG1heFJldHJpZXM/OiBzdHJpbmc7XG4gICAgfTtcbiAgICBSZW1vdmFsUG9saWN5Pzogc3RyaW5nXG4gIH07XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGxvZyBncm91cCBhbmQgZG9lc24ndCB0aHJvdyBpZiBpdCBleGlzdHMuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUxvZ0dyb3VwU2FmZShsb2dHcm91cE5hbWU6IHN0cmluZywgY2xpZW50OiBMb2dzLkNsb3VkV2F0Y2hMb2dzQ2xpZW50LCB3aXRoRGVsYXk6IChibG9jazogKCkgPT4gUHJvbWlzZTx2b2lkPikgPT4gUHJvbWlzZTx2b2lkPikge1xuICBhd2FpdCB3aXRoRGVsYXkoYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJhbXMgPSB7IGxvZ0dyb3VwTmFtZSB9O1xuICAgICAgY29uc3QgY29tbWFuZCA9IG5ldyBMb2dzLkNyZWF0ZUxvZ0dyb3VwQ29tbWFuZChwYXJhbXMpO1xuICAgICAgYXdhaXQgY2xpZW50LnNlbmQoY29tbWFuZCk7XG5cbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBpZiAoZXJyb3IubmFtZSA9PT0gJ1Jlc291cmNlQWxyZWFkeUV4aXN0c0V4Y2VwdGlvbicpIHtcbiAgICAgICAgLy8gVGhlIGxvZyBncm91cCBpcyBhbHJlYWR5IGNyZWF0ZWQgYnkgdGhlIGxhbWJkYSBleGVjdXRpb25cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIERlbGV0ZXMgYSBsb2cgZ3JvdXAgYW5kIGRvZXNuJ3QgdGhyb3cgaWYgaXQgZG9lcyBub3QgZXhpc3QuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUxvZ0dyb3VwKGxvZ0dyb3VwTmFtZTogc3RyaW5nLCBjbGllbnQ6IExvZ3MuQ2xvdWRXYXRjaExvZ3NDbGllbnQsIHdpdGhEZWxheTogKGJsb2NrOiAoKSA9PiBQcm9taXNlPHZvaWQ+KSA9PiBQcm9taXNlPHZvaWQ+KSB7XG4gIGF3YWl0IHdpdGhEZWxheShhc3luYyAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHsgbG9nR3JvdXBOYW1lIH07XG4gICAgICBjb25zdCBjb21tYW5kID0gbmV3IExvZ3MuRGVsZXRlTG9nR3JvdXBDb21tYW5kKHBhcmFtcyk7XG4gICAgICBhd2FpdCBjbGllbnQuc2VuZChjb21tYW5kKTtcblxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgIGlmIChlcnJvci5uYW1lID09PSAnUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgLy8gVGhlIGxvZyBncm91cCBkb2Vzbid0IGV4aXN0XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBQdXRzIG9yIGRlbGV0ZXMgYSByZXRlbnRpb24gcG9saWN5IG9uIGEgbG9nIGdyb3VwLlxuICovXG5hc3luYyBmdW5jdGlvbiBzZXRSZXRlbnRpb25Qb2xpY3koXG4gIGxvZ0dyb3VwTmFtZTogc3RyaW5nLFxuICBjbGllbnQ6IExvZ3MuQ2xvdWRXYXRjaExvZ3NDbGllbnQsXG4gIHdpdGhEZWxheTogKGJsb2NrOiAoKSA9PiBQcm9taXNlPHZvaWQ+KSA9PiBQcm9taXNlPHZvaWQ+LFxuICByZXRlbnRpb25JbkRheXM/OiBudW1iZXIsXG4pIHtcblxuICBhd2FpdCB3aXRoRGVsYXkoYXN5bmMgKCkgPT4ge1xuICAgIGlmICghcmV0ZW50aW9uSW5EYXlzKSB7XG4gICAgICBjb25zdCBwYXJhbXMgPSB7IGxvZ0dyb3VwTmFtZSB9O1xuICAgICAgY29uc3QgZGVsZXRlQ29tbWFuZCA9IG5ldyBMb2dzLkRlbGV0ZVJldGVudGlvblBvbGljeUNvbW1hbmQocGFyYW1zKTtcbiAgICAgIGF3YWl0IGNsaWVudC5zZW5kKGRlbGV0ZUNvbW1hbmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwYXJhbXMgPSB7IGxvZ0dyb3VwTmFtZSwgcmV0ZW50aW9uSW5EYXlzIH07XG4gICAgICBjb25zdCBwdXRDb21tYW5kID0gbmV3IExvZ3MuUHV0UmV0ZW50aW9uUG9saWN5Q29tbWFuZChwYXJhbXMpO1xuICAgICAgYXdhaXQgY2xpZW50LnNlbmQocHV0Q29tbWFuZCk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IExvZ1JldGVudGlvbkV2ZW50LCBjb250ZXh0OiBBV1NMYW1iZGEuQ29udGV4dCkge1xuICB0cnkge1xuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHsgLi4uZXZlbnQsIFJlc3BvbnNlVVJMOiAnLi4uJyB9KSk7XG5cbiAgICAvLyBUaGUgdGFyZ2V0IGxvZyBncm91cFxuICAgIGNvbnN0IGxvZ0dyb3VwTmFtZSA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Mb2dHcm91cE5hbWU7XG5cbiAgICAvLyBUaGUgcmVnaW9uIG9mIHRoZSB0YXJnZXQgbG9nIGdyb3VwXG4gICAgY29uc3QgbG9nR3JvdXBSZWdpb24gPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuTG9nR3JvdXBSZWdpb247XG5cbiAgICAvLyBQYXJzZSB0byBBV1MgU0RLIHJldHJ5IG9wdGlvbnNcbiAgICBjb25zdCBtYXhSZXRyaWVzID0gcGFyc2VJbnRPcHRpb25hbChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuU2RrUmV0cnk/Lm1heFJldHJpZXMpID8/IDU7XG4gICAgY29uc3Qgd2l0aERlbGF5ID0gbWFrZVdpdGhEZWxheShtYXhSZXRyaWVzKTtcblxuICAgIGNvbnN0IHNka0NvbmZpZzogTG9ncy5DbG91ZFdhdGNoTG9nc0NsaWVudENvbmZpZyA9IHtcbiAgICAgIGxvZ2dlcjogY29uc29sZSxcbiAgICAgIHJlZ2lvbjogbG9nR3JvdXBSZWdpb24sXG4gICAgICBtYXhBdHRlbXB0czogTWF0aC5tYXgoNSwgbWF4UmV0cmllcyksIC8vIFVzZSBhIG1pbmltdW0gZm9yIFNESyBsZXZlbCByZXRyaWVzLCBiZWNhdXNlIGl0IG1pZ2h0IGluY2x1ZGUgcmV0cnlhYmxlIGZhaWx1cmVzIHRoYXQgd2l0aERlbGF5IGlzbid0IGNoZWNraW5nIGZvclxuICAgIH07XG4gICAgY29uc3QgY2xpZW50ID0gbmV3IExvZ3MuQ2xvdWRXYXRjaExvZ3NDbGllbnQoc2RrQ29uZmlnKTtcblxuICAgIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0NyZWF0ZScgfHwgZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdVcGRhdGUnKSB7XG4gICAgICAvLyBBY3Qgb24gdGhlIHRhcmdldCBsb2cgZ3JvdXBcbiAgICAgIGF3YWl0IGNyZWF0ZUxvZ0dyb3VwU2FmZShsb2dHcm91cE5hbWUsIGNsaWVudCwgd2l0aERlbGF5KTtcbiAgICAgIGF3YWl0IHNldFJldGVudGlvblBvbGljeShsb2dHcm91cE5hbWUsIGNsaWVudCwgd2l0aERlbGF5LCBwYXJzZUludE9wdGlvbmFsKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5SZXRlbnRpb25JbkRheXMpKTtcblxuICAgICAgLy8gQ29uZmlndXJlIHRoZSBMb2cgR3JvdXAgZm9yIHRoZSBDdXN0b20gUmVzb3VyY2UgZnVuY3Rpb24gaXRzZWxmXG4gICAgICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdDcmVhdGUnKSB7XG4gICAgICAgIGNvbnN0IGNsaWVudEZvckN1c3RvbVJlc291cmNlRnVuY3Rpb24gPSBuZXcgTG9ncy5DbG91ZFdhdGNoTG9nc0NsaWVudCh7XG4gICAgICAgICAgbG9nZ2VyOiBjb25zb2xlLFxuICAgICAgICAgIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQVdTX1JFR0lPTixcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFNldCBhIHJldGVudGlvbiBwb2xpY3kgb2YgMSBkYXkgb24gdGhlIGxvZ3Mgb2YgdGhpcyB2ZXJ5IGZ1bmN0aW9uLlxuICAgICAgICAvLyBEdWUgdG8gdGhlIGFzeW5jIG5hdHVyZSBvZiB0aGUgbG9nIGdyb3VwIGNyZWF0aW9uLCB0aGUgbG9nIGdyb3VwIGZvciB0aGlzIGZ1bmN0aW9uIG1pZ2h0XG4gICAgICAgIC8vIHN0aWxsIGJlIG5vdCBjcmVhdGVkIHlldCBhdCB0aGlzIHBvaW50LiBUaGVyZWZvcmUgd2UgYXR0ZW1wdCB0byBjcmVhdGUgaXQuXG4gICAgICAgIC8vIEluIGNhc2UgaXQgaXMgYmVpbmcgY3JlYXRlZCwgY3JlYXRlTG9nR3JvdXBTYWZlIHdpbGwgaGFuZGxlIHRoZSBjb25mbGljdC5cbiAgICAgICAgYXdhaXQgY3JlYXRlTG9nR3JvdXBTYWZlKGAvYXdzL2xhbWJkYS8ke2NvbnRleHQuZnVuY3Rpb25OYW1lfWAsIGNsaWVudEZvckN1c3RvbVJlc291cmNlRnVuY3Rpb24sIHdpdGhEZWxheSk7XG4gICAgICAgIC8vIElmIGNyZWF0ZUxvZ0dyb3VwU2FmZSBmYWlscywgdGhlIGxvZyBncm91cCBpcyBub3QgY3JlYXRlZCBldmVuIGFmdGVyIG11bHRpcGxlIGF0dGVtcHRzLlxuICAgICAgICAvLyBJbiB0aGlzIGNhc2Ugd2UgaGF2ZSBub3RoaW5nIHRvIHNldCB0aGUgcmV0ZW50aW9uIHBvbGljeSBvbiBidXQgYW4gZXhjZXB0aW9uIHdpbGwgc2tpcFxuICAgICAgICAvLyB0aGUgbmV4dCBsaW5lLlxuICAgICAgICBhd2FpdCBzZXRSZXRlbnRpb25Qb2xpY3koYC9hd3MvbGFtYmRhLyR7Y29udGV4dC5mdW5jdGlvbk5hbWV9YCwgY2xpZW50Rm9yQ3VzdG9tUmVzb3VyY2VGdW5jdGlvbiwgd2l0aERlbGF5LCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXaGVuIHRoZSByZXF1ZXN0VHlwZSBpcyBkZWxldGUsIGRlbGV0ZSB0aGUgbG9nIGdyb3VwIGlmIHRoZSByZW1vdmFsIHBvbGljeSBpcyBkZWxldGVcbiAgICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdEZWxldGUnICYmIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5SZW1vdmFsUG9saWN5ID09PSAnZGVzdHJveScpIHtcbiAgICAgIGF3YWl0IGRlbGV0ZUxvZ0dyb3VwKGxvZ0dyb3VwTmFtZSwgY2xpZW50LCB3aXRoRGVsYXkpO1xuICAgICAgLy8gZWxzZSByZXRhaW4gdGhlIGxvZyBncm91cFxuICAgIH1cblxuICAgIGF3YWl0IHJlc3BvbmQoJ1NVQ0NFU1MnLCAnT0snLCBsb2dHcm91cE5hbWUpO1xuICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZyhlKTtcbiAgICBhd2FpdCByZXNwb25kKCdGQUlMRUQnLCBlLm1lc3NhZ2UsIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Mb2dHcm91cE5hbWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzcG9uZChyZXNwb25zZVN0YXR1czogc3RyaW5nLCByZWFzb246IHN0cmluZywgcGh5c2ljYWxSZXNvdXJjZUlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZXNwb25zZUJvZHkgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBTdGF0dXM6IHJlc3BvbnNlU3RhdHVzLFxuICAgICAgUmVhc29uOiByZWFzb24sXG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IHBoeXNpY2FsUmVzb3VyY2VJZCxcbiAgICAgIFN0YWNrSWQ6IGV2ZW50LlN0YWNrSWQsXG4gICAgICBSZXF1ZXN0SWQ6IGV2ZW50LlJlcXVlc3RJZCxcbiAgICAgIExvZ2ljYWxSZXNvdXJjZUlkOiBldmVudC5Mb2dpY2FsUmVzb3VyY2VJZCxcbiAgICAgIERhdGE6IHtcbiAgICAgICAgLy8gQWRkIGxvZyBncm91cCBuYW1lIGFzIHBhcnQgb2YgdGhlIHJlc3BvbnNlIHNvIHRoYXQgaXQncyBhdmFpbGFibGUgdmlhIEZuOjpHZXRBdHRcbiAgICAgICAgTG9nR3JvdXBOYW1lOiBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuTG9nR3JvdXBOYW1lLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnNvbGUubG9nKCdSZXNwb25kaW5nJywgcmVzcG9uc2VCb2R5KTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgY29uc3QgcGFyc2VkVXJsID0gcmVxdWlyZSgndXJsJykucGFyc2UoZXZlbnQuUmVzcG9uc2VVUkwpO1xuICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgaG9zdG5hbWU6IHBhcnNlZFVybC5ob3N0bmFtZSxcbiAgICAgIHBhdGg6IHBhcnNlZFVybC5wYXRoLFxuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICcnLFxuICAgICAgICAnY29udGVudC1sZW5ndGgnOiBCdWZmZXIuYnl0ZUxlbmd0aChyZXNwb25zZUJvZHksICd1dGY4JyksXG4gICAgICB9LFxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJ2h0dHBzJykucmVxdWVzdChyZXF1ZXN0T3B0aW9ucywgcmVzb2x2ZSk7XG4gICAgICAgIHJlcXVlc3Qub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgICAgcmVxdWVzdC53cml0ZShyZXNwb25zZUJvZHkpO1xuICAgICAgICByZXF1ZXN0LmVuZCgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VJbnRPcHRpb25hbCh2YWx1ZT86IHN0cmluZywgYmFzZSA9IDEwKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHBhcnNlSW50KHZhbHVlLCBiYXNlKTtcbn1cblxuZnVuY3Rpb24gbWFrZVdpdGhEZWxheShcbiAgbWF4UmV0cmllczogbnVtYmVyLFxuICBkZWxheUJhc2U6IG51bWJlciA9IDEwMCxcbiAgZGVsYXlDYXAgPSAxMCAqIDEwMDAsIC8vIDEwc1xuKTogKGJsb2NrOiAoKSA9PiBQcm9taXNlPHZvaWQ+KSA9PiBQcm9taXNlPHZvaWQ+IHtcbiAgLy8gSWYgd2UgdHJ5IHRvIHVwZGF0ZSB0aGUgbG9nIGdyb3VwLCB0aGVuIGR1ZSB0byB0aGUgYXN5bmMgbmF0dXJlIG9mXG4gIC8vIExhbWJkYSBsb2dnaW5nIHRoZXJlIGNvdWxkIGJlIGEgcmFjZSBjb25kaXRpb24gd2hlbiB0aGUgc2FtZSBsb2cgZ3JvdXAgaXNcbiAgLy8gYWxyZWFkeSBiZWluZyBjcmVhdGVkIGJ5IHRoZSBsYW1iZGEgZXhlY3V0aW9uLiBUaGlzIGNhbiBzb21ldGltZSByZXN1bHQgaW5cbiAgLy8gYW4gZXJyb3IgXCJPcGVyYXRpb25BYm9ydGVkRXhjZXB0aW9uOiBBIGNvbmZsaWN0aW5nIG9wZXJhdGlvbiBpcyBjdXJyZW50bHlcbiAgLy8gaW4gcHJvZ3Jlc3MuLi5QbGVhc2UgdHJ5IGFnYWluLlwiXG4gIC8vIFRvIGF2b2lkIGFuIGVycm9yLCB3ZSBkbyBhcyByZXF1ZXN0ZWQgYW5kIHRyeSBhZ2Fpbi5cblxuICByZXR1cm4gYXN5bmMgKGJsb2NrOiAoKSA9PiBQcm9taXNlPHZvaWQ+KSA9PiB7XG4gICAgbGV0IGF0dGVtcHRzID0gMDtcbiAgICBkbyB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXdhaXQgYmxvY2soKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGVycm9yLm5hbWUgPT09ICdPcGVyYXRpb25BYm9ydGVkRXhjZXB0aW9uJ1xuICAgICAgICAgIHx8IGVycm9yLm5hbWUgPT09ICdUaHJvdHRsaW5nRXhjZXB0aW9uJyAvLyBUaGVyZSBpcyBubyBjbGFzcyB0byBjaGVjayB3aXRoIGluc3RhbmNlb2YsIHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1zZGstanMtdjMvaXNzdWVzLzUxNDBcbiAgICAgICAgKSB7XG4gICAgICAgICAgaWYgKGF0dGVtcHRzIDwgbWF4UmV0cmllcyApIHtcbiAgICAgICAgICAgIGF0dGVtcHRzKys7XG4gICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgY2FsY3VsYXRlRGVsYXkoYXR0ZW1wdHMsIGRlbGF5QmFzZSwgZGVsYXlDYXApKSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVGhlIGxvZyBncm91cCBpcyBzdGlsbCBiZWluZyBjaGFuZ2VkIGJ5IGFub3RoZXIgZXhlY3V0aW9uIGJ1dCB3ZSBhcmUgb3V0IG9mIHJldHJpZXNcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignT3V0IG9mIGF0dGVtcHRzIHRvIGNoYW5nZSBsb2cgZ3JvdXAnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfSB3aGlsZSAodHJ1ZSk7IC8vIGV4aXQgaGFwcGVucyBvbiByZXRyeSBjb3VudCBjaGVja1xuICB9O1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVEZWxheShhdHRlbXB0OiBudW1iZXIsIGJhc2U6IG51bWJlciwgY2FwOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogTWF0aC5taW4oY2FwLCBiYXNlICogMiAqKiBhdHRlbXB0KSk7XG59XG4iXX0=