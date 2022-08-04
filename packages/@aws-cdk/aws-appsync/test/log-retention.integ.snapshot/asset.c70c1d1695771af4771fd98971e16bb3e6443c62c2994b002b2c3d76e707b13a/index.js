"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require("aws-sdk");
/**
 * Creates a log group and doesn't throw if it exists.
 *
 * @param logGroupName the name of the log group to create.
 * @param region to create the log group in
 * @param options CloudWatch API SDK options.
 */
async function createLogGroupSafe(logGroupName, region, options) {
    // If we set the log retention for a lambda, then due to the async nature of
    // Lambda logging there could be a race condition when the same log group is
    // already being created by the lambda execution. This can sometime result in
    // an error "OperationAbortedException: A conflicting operation is currently
    // in progress...Please try again."
    // To avoid an error, we do as requested and try again.
    let retryCount = options?.maxRetries == undefined ? 10 : options.maxRetries;
    const delay = options?.retryOptions?.base == undefined ? 10 : options.retryOptions.base;
    do {
        try {
            const cloudwatchlogs = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28', region, ...options });
            await cloudwatchlogs.createLogGroup({ logGroupName }).promise();
            return;
        }
        catch (error) {
            if (error.code === 'ResourceAlreadyExistsException') {
                // The log group is already created by the lambda execution
                return;
            }
            if (error.code === 'OperationAbortedException') {
                if (retryCount > 0) {
                    retryCount--;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                else {
                    // The log group is still being created by another execution but we are out of retries
                    throw new Error('Out of attempts to create a logGroup');
                }
            }
            throw error;
        }
    } while (true); // exit happens on retry count check
}
/**
 * Puts or deletes a retention policy on a log group.
 *
 * @param logGroupName the name of the log group to create
 * @param region the region of the log group
 * @param options CloudWatch API SDK options.
 * @param retentionInDays the number of days to retain the log events in the specified log group.
 */
async function setRetentionPolicy(logGroupName, region, options, retentionInDays) {
    // The same as in createLogGroupSafe(), here we could end up with the race
    // condition where a log group is either already being created or its retention
    // policy is being updated. This would result in an OperationAbortedException,
    // which we will try to catch and retry the command a number of times before failing
    let retryCount = options?.maxRetries == undefined ? 10 : options.maxRetries;
    const delay = options?.retryOptions?.base == undefined ? 10 : options.retryOptions.base;
    do {
        try {
            const cloudwatchlogs = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28', region, ...options });
            if (!retentionInDays) {
                await cloudwatchlogs.deleteRetentionPolicy({ logGroupName }).promise();
            }
            else {
                await cloudwatchlogs.putRetentionPolicy({ logGroupName, retentionInDays }).promise();
            }
            return;
        }
        catch (error) {
            if (error.code === 'OperationAbortedException') {
                if (retryCount > 0) {
                    retryCount--;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                else {
                    // The log group is still being created by another execution but we are out of retries
                    throw new Error('Out of attempts to create a logGroup');
                }
            }
            throw error;
        }
    } while (true); // exit happens on retry count check
}
async function handler(event, context) {
    try {
        console.log(JSON.stringify({ ...event, ResponseURL: '...' }));
        // The target log group
        const logGroupName = event.ResourceProperties.LogGroupName;
        // The region of the target log group
        const logGroupRegion = event.ResourceProperties.LogGroupRegion;
        // Parse to AWS SDK retry options
        const retryOptions = parseRetryOptions(event.ResourceProperties.SdkRetry);
        if (event.RequestType === 'Create' || event.RequestType === 'Update') {
            // Act on the target log group
            await createLogGroupSafe(logGroupName, logGroupRegion, retryOptions);
            await setRetentionPolicy(logGroupName, logGroupRegion, retryOptions, parseInt(event.ResourceProperties.RetentionInDays, 10));
            if (event.RequestType === 'Create') {
                // Set a retention policy of 1 day on the logs of this very function.
                // Due to the async nature of the log group creation, the log group for this function might
                // still be not created yet at this point. Therefore we attempt to create it.
                // In case it is being created, createLogGroupSafe will handle the conflict.
                const region = process.env.AWS_REGION;
                await createLogGroupSafe(`/aws/lambda/${context.functionName}`, region, retryOptions);
                // If createLogGroupSafe fails, the log group is not created even after multiple attempts.
                // In this case we have nothing to set the retention policy on but an exception will skip
                // the next line.
                await setRetentionPolicy(`/aws/lambda/${context.functionName}`, region, retryOptions, 1);
            }
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
            headers: { 'content-type': '', 'content-length': responseBody.length },
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
    function parseRetryOptions(rawOptions) {
        const retryOptions = {};
        if (rawOptions) {
            if (rawOptions.maxRetries) {
                retryOptions.maxRetries = parseInt(rawOptions.maxRetries, 10);
            }
            if (rawOptions.base) {
                retryOptions.retryOptions = {
                    base: parseInt(rawOptions.base, 10),
                };
            }
        }
        return retryOptions;
    }
}
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7QUFFL0IsNkRBQTZEO0FBQzdELCtCQUErQjtBQVMvQjs7Ozs7O0dBTUc7QUFDSCxLQUFLLFVBQVUsa0JBQWtCLENBQUMsWUFBb0IsRUFBRSxNQUFlLEVBQUUsT0FBeUI7SUFDaEcsNEVBQTRFO0lBQzVFLDRFQUE0RTtJQUM1RSw2RUFBNkU7SUFDN0UsNEVBQTRFO0lBQzVFLG1DQUFtQztJQUNuQyx1REFBdUQ7SUFDdkQsSUFBSSxVQUFVLEdBQUcsT0FBTyxFQUFFLFVBQVUsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztJQUM1RSxNQUFNLEtBQUssR0FBRyxPQUFPLEVBQUUsWUFBWSxFQUFFLElBQUksSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7SUFDeEYsR0FBRztRQUNELElBQUk7WUFDRixNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDaEcsTUFBTSxjQUFjLENBQUMsY0FBYyxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNoRSxPQUFPO1NBQ1I7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxnQ0FBZ0MsRUFBRTtnQkFDbkQsMkRBQTJEO2dCQUMzRCxPQUFPO2FBQ1I7WUFDRCxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssMkJBQTJCLEVBQUU7Z0JBQzlDLElBQUksVUFBVSxHQUFHLENBQUMsRUFBRTtvQkFDbEIsVUFBVSxFQUFF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QUFlO1FBQ3hDLE1BQU0sWUFBWSxHQUFvQixFQUFFLENBQUM7UUFDekMsSUFBSSxVQUFVLEVBQUU7WUFDZCxJQUFJLFVBQVUsQ0FBQyxVQUFVLEVBQUU7Z0JBQ3pCLFlBQVksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDL0Q7WUFDRCxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7Z0JBQ25CLFlBQVksQ0FBQyxZQUFZLEdBQUc7b0JBQzFCLElBQUksRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUM7aUJBQ3BDLENBQUM7YUFDSDtTQUNGO1FBQ0QsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztBQUNILENBQUM7QUEzRkQsMEJBMkZDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgKiBhcyBBV1MgZnJvbSAnYXdzLXNkayc7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgdHlwZSB7IFJldHJ5RGVsYXlPcHRpb25zIH0gZnJvbSAnYXdzLXNkay9saWIvY29uZmlnLWJhc2UnO1xuXG5pbnRlcmZhY2UgU2RrUmV0cnlPcHRpb25zIHtcbiAgbWF4UmV0cmllcz86IG51bWJlcjtcbiAgcmV0cnlPcHRpb25zPzogUmV0cnlEZWxheU9wdGlvbnM7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGxvZyBncm91cCBhbmQgZG9lc24ndCB0aHJvdyBpZiBpdCBleGlzdHMuXG4gKlxuICogQHBhcmFtIGxvZ0dyb3VwTmFtZSB0aGUgbmFtZSBvZiB0aGUgbG9nIGdyb3VwIHRvIGNyZWF0ZS5cbiAqIEBwYXJhbSByZWdpb24gdG8gY3JlYXRlIHRoZSBsb2cgZ3JvdXAgaW5cbiAqIEBwYXJhbSBvcHRpb25zIENsb3VkV2F0Y2ggQVBJIFNESyBvcHRpb25zLlxuICovXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVMb2dHcm91cFNhZmUobG9nR3JvdXBOYW1lOiBzdHJpbmcsIHJlZ2lvbj86IHN0cmluZywgb3B0aW9ucz86IFNka1JldHJ5T3B0aW9ucykge1xuICAvLyBJZiB3ZSBzZXQgdGhlIGxvZyByZXRlbnRpb24gZm9yIGEgbGFtYmRhLCB0aGVuIGR1ZSB0byB0aGUgYXN5bmMgbmF0dXJlIG9mXG4gIC8vIExhbWJkYSBsb2dnaW5nIHRoZXJlIGNvdWxkIGJlIGEgcmFjZSBjb25kaXRpb24gd2hlbiB0aGUgc2FtZSBsb2cgZ3JvdXAgaXNcbiAgLy8gYWxyZWFkeSBiZWluZyBjcmVhdGVkIGJ5IHRoZSBsYW1iZGEgZXhlY3V0aW9uLiBUaGlzIGNhbiBzb21ldGltZSByZXN1bHQgaW5cbiAgLy8gYW4gZXJyb3IgXCJPcGVyYXRpb25BYm9ydGVkRXhjZXB0aW9uOiBBIGNvbmZsaWN0aW5nIG9wZXJhdGlvbiBpcyBjdXJyZW50bHlcbiAgLy8gaW4gcHJvZ3Jlc3MuLi5QbGVhc2UgdHJ5IGFnYWluLlwiXG4gIC8vIFRvIGF2b2lkIGFuIGVycm9yLCB3ZSBkbyBhcyByZXF1ZXN0ZWQgYW5kIHRyeSBhZ2Fpbi5cbiAgbGV0IHJldHJ5Q291bnQgPSBvcHRpb25zPy5tYXhSZXRyaWVzID09IHVuZGVmaW5lZCA/IDEwIDogb3B0aW9ucy5tYXhSZXRyaWVzO1xuICBjb25zdCBkZWxheSA9IG9wdGlvbnM/LnJldHJ5T3B0aW9ucz8uYmFzZSA9PSB1bmRlZmluZWQgPyAxMCA6IG9wdGlvbnMucmV0cnlPcHRpb25zLmJhc2U7XG4gIGRvIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY2xvdWR3YXRjaGxvZ3MgPSBuZXcgQVdTLkNsb3VkV2F0Y2hMb2dzKHsgYXBpVmVyc2lvbjogJzIwMTQtMDMtMjgnLCByZWdpb24sIC4uLm9wdGlvbnMgfSk7XG4gICAgICBhd2FpdCBjbG91ZHdhdGNobG9ncy5jcmVhdGVMb2dHcm91cCh7IGxvZ0dyb3VwTmFtZSB9KS5wcm9taXNlKCk7XG4gICAgICByZXR1cm47XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnUmVzb3VyY2VBbHJlYWR5RXhpc3RzRXhjZXB0aW9uJykge1xuICAgICAgICAvLyBUaGUgbG9nIGdyb3VwIGlzIGFscmVhZHkgY3JlYXRlZCBieSB0aGUgbGFtYmRhIGV4ZWN1dGlvblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoZXJyb3IuY29kZSA9PT0gJ09wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb24nKSB7XG4gICAgICAgIGlmIChyZXRyeUNvdW50ID4gMCkge1xuICAgICAgICAgIHJldHJ5Q291bnQtLTtcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUaGUgbG9nIGdyb3VwIGlzIHN0aWxsIGJlaW5nIGNyZWF0ZWQgYnkgYW5vdGhlciBleGVjdXRpb24gYnV0IHdlIGFyZSBvdXQgb2YgcmV0cmllc1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignT3V0IG9mIGF0dGVtcHRzIHRvIGNyZWF0ZSBhIGxvZ0dyb3VwJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSB3aGlsZSAodHJ1ZSk7IC8vIGV4aXQgaGFwcGVucyBvbiByZXRyeSBjb3VudCBjaGVja1xufVxuXG4vKipcbiAqIFB1dHMgb3IgZGVsZXRlcyBhIHJldGVudGlvbiBwb2xpY3kgb24gYSBsb2cgZ3JvdXAuXG4gKlxuICogQHBhcmFtIGxvZ0dyb3VwTmFtZSB0aGUgbmFtZSBvZiB0aGUgbG9nIGdyb3VwIHRvIGNyZWF0ZVxuICogQHBhcmFtIHJlZ2lvbiB0aGUgcmVnaW9uIG9mIHRoZSBsb2cgZ3JvdXBcbiAqIEBwYXJhbSBvcHRpb25zIENsb3VkV2F0Y2ggQVBJIFNESyBvcHRpb25zLlxuICogQHBhcmFtIHJldGVudGlvbkluRGF5cyB0aGUgbnVtYmVyIG9mIGRheXMgdG8gcmV0YWluIHRoZSBsb2cgZXZlbnRzIGluIHRoZSBzcGVjaWZpZWQgbG9nIGdyb3VwLlxuICovXG5hc3luYyBmdW5jdGlvbiBzZXRSZXRlbnRpb25Qb2xpY3kobG9nR3JvdXBOYW1lOiBzdHJpbmcsIHJlZ2lvbj86IHN0cmluZywgb3B0aW9ucz86IFNka1JldHJ5T3B0aW9ucywgcmV0ZW50aW9uSW5EYXlzPzogbnVtYmVyKSB7XG4gIC8vIFRoZSBzYW1lIGFzIGluIGNyZWF0ZUxvZ0dyb3VwU2FmZSgpLCBoZXJlIHdlIGNvdWxkIGVuZCB1cCB3aXRoIHRoZSByYWNlXG4gIC8vIGNvbmRpdGlvbiB3aGVyZSBhIGxvZyBncm91cCBpcyBlaXRoZXIgYWxyZWFkeSBiZWluZyBjcmVhdGVkIG9yIGl0cyByZXRlbnRpb25cbiAgLy8gcG9saWN5IGlzIGJlaW5nIHVwZGF0ZWQuIFRoaXMgd291bGQgcmVzdWx0IGluIGFuIE9wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb24sXG4gIC8vIHdoaWNoIHdlIHdpbGwgdHJ5IHRvIGNhdGNoIGFuZCByZXRyeSB0aGUgY29tbWFuZCBhIG51bWJlciBvZiB0aW1lcyBiZWZvcmUgZmFpbGluZ1xuICBsZXQgcmV0cnlDb3VudCA9IG9wdGlvbnM/Lm1heFJldHJpZXMgPT0gdW5kZWZpbmVkID8gMTAgOiBvcHRpb25zLm1heFJldHJpZXM7XG4gIGNvbnN0IGRlbGF5ID0gb3B0aW9ucz8ucmV0cnlPcHRpb25zPy5iYXNlID09IHVuZGVmaW5lZCA/IDEwIDogb3B0aW9ucy5yZXRyeU9wdGlvbnMuYmFzZTtcbiAgZG8ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjbG91ZHdhdGNobG9ncyA9IG5ldyBBV1MuQ2xvdWRXYXRjaExvZ3MoeyBhcGlWZXJzaW9uOiAnMjAxNC0wMy0yOCcsIHJlZ2lvbiwgLi4ub3B0aW9ucyB9KTtcbiAgICAgIGlmICghcmV0ZW50aW9uSW5EYXlzKSB7XG4gICAgICAgIGF3YWl0IGNsb3Vkd2F0Y2hsb2dzLmRlbGV0ZVJldGVudGlvblBvbGljeSh7IGxvZ0dyb3VwTmFtZSB9KS5wcm9taXNlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhd2FpdCBjbG91ZHdhdGNobG9ncy5wdXRSZXRlbnRpb25Qb2xpY3koeyBsb2dHcm91cE5hbWUsIHJldGVudGlvbkluRGF5cyB9KS5wcm9taXNlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG5cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKGVycm9yLmNvZGUgPT09ICdPcGVyYXRpb25BYm9ydGVkRXhjZXB0aW9uJykge1xuICAgICAgICBpZiAocmV0cnlDb3VudCA+IDApIHtcbiAgICAgICAgICByZXRyeUNvdW50LS07XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVGhlIGxvZyBncm91cCBpcyBzdGlsbCBiZWluZyBjcmVhdGVkIGJ5IGFub3RoZXIgZXhlY3V0aW9uIGJ1dCB3ZSBhcmUgb3V0IG9mIHJldHJpZXNcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ091dCBvZiBhdHRlbXB0cyB0byBjcmVhdGUgYSBsb2dHcm91cCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH0gd2hpbGUgKHRydWUpOyAvLyBleGl0IGhhcHBlbnMgb24gcmV0cnkgY291bnQgY2hlY2tcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQsIGNvbnRleHQ6IEFXU0xhbWJkYS5Db250ZXh0KSB7XG4gIHRyeSB7XG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoeyAuLi5ldmVudCwgUmVzcG9uc2VVUkw6ICcuLi4nIH0pKTtcblxuICAgIC8vIFRoZSB0YXJnZXQgbG9nIGdyb3VwXG4gICAgY29uc3QgbG9nR3JvdXBOYW1lID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkxvZ0dyb3VwTmFtZTtcblxuICAgIC8vIFRoZSByZWdpb24gb2YgdGhlIHRhcmdldCBsb2cgZ3JvdXBcbiAgICBjb25zdCBsb2dHcm91cFJlZ2lvbiA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Mb2dHcm91cFJlZ2lvbjtcblxuICAgIC8vIFBhcnNlIHRvIEFXUyBTREsgcmV0cnkgb3B0aW9uc1xuICAgIGNvbnN0IHJldHJ5T3B0aW9ucyA9IHBhcnNlUmV0cnlPcHRpb25zKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5TZGtSZXRyeSk7XG5cbiAgICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdDcmVhdGUnIHx8IGV2ZW50LlJlcXVlc3RUeXBlID09PSAnVXBkYXRlJykge1xuICAgICAgLy8gQWN0IG9uIHRoZSB0YXJnZXQgbG9nIGdyb3VwXG4gICAgICBhd2FpdCBjcmVhdGVMb2dHcm91cFNhZmUobG9nR3JvdXBOYW1lLCBsb2dHcm91cFJlZ2lvbiwgcmV0cnlPcHRpb25zKTtcbiAgICAgIGF3YWl0IHNldFJldGVudGlvblBvbGljeShsb2dHcm91cE5hbWUsIGxvZ0dyb3VwUmVnaW9uLCByZXRyeU9wdGlvbnMsIHBhcnNlSW50KGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5SZXRlbnRpb25JbkRheXMsIDEwKSk7XG5cbiAgICAgIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0NyZWF0ZScpIHtcbiAgICAgICAgLy8gU2V0IGEgcmV0ZW50aW9uIHBvbGljeSBvZiAxIGRheSBvbiB0aGUgbG9ncyBvZiB0aGlzIHZlcnkgZnVuY3Rpb24uXG4gICAgICAgIC8vIER1ZSB0byB0aGUgYXN5bmMgbmF0dXJlIG9mIHRoZSBsb2cgZ3JvdXAgY3JlYXRpb24sIHRoZSBsb2cgZ3JvdXAgZm9yIHRoaXMgZnVuY3Rpb24gbWlnaHRcbiAgICAgICAgLy8gc3RpbGwgYmUgbm90IGNyZWF0ZWQgeWV0IGF0IHRoaXMgcG9pbnQuIFRoZXJlZm9yZSB3ZSBhdHRlbXB0IHRvIGNyZWF0ZSBpdC5cbiAgICAgICAgLy8gSW4gY2FzZSBpdCBpcyBiZWluZyBjcmVhdGVkLCBjcmVhdGVMb2dHcm91cFNhZmUgd2lsbCBoYW5kbGUgdGhlIGNvbmZsaWN0LlxuICAgICAgICBjb25zdCByZWdpb24gPSBwcm9jZXNzLmVudi5BV1NfUkVHSU9OO1xuICAgICAgICBhd2FpdCBjcmVhdGVMb2dHcm91cFNhZmUoYC9hd3MvbGFtYmRhLyR7Y29udGV4dC5mdW5jdGlvbk5hbWV9YCwgcmVnaW9uLCByZXRyeU9wdGlvbnMpO1xuICAgICAgICAvLyBJZiBjcmVhdGVMb2dHcm91cFNhZmUgZmFpbHMsIHRoZSBsb2cgZ3JvdXAgaXMgbm90IGNyZWF0ZWQgZXZlbiBhZnRlciBtdWx0aXBsZSBhdHRlbXB0cy5cbiAgICAgICAgLy8gSW4gdGhpcyBjYXNlIHdlIGhhdmUgbm90aGluZyB0byBzZXQgdGhlIHJldGVudGlvbiBwb2xpY3kgb24gYnV0IGFuIGV4Y2VwdGlvbiB3aWxsIHNraXBcbiAgICAgICAgLy8gdGhlIG5leHQgbGluZS5cbiAgICAgICAgYXdhaXQgc2V0UmV0ZW50aW9uUG9saWN5KGAvYXdzL2xhbWJkYS8ke2NvbnRleHQuZnVuY3Rpb25OYW1lfWAsIHJlZ2lvbiwgcmV0cnlPcHRpb25zLCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCByZXNwb25kKCdTVUNDRVNTJywgJ09LJywgbG9nR3JvdXBOYW1lKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKGUpO1xuXG4gICAgYXdhaXQgcmVzcG9uZCgnRkFJTEVEJywgZS5tZXNzYWdlLCBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuTG9nR3JvdXBOYW1lKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc3BvbmQocmVzcG9uc2VTdGF0dXM6IHN0cmluZywgcmVhc29uOiBzdHJpbmcsIHBoeXNpY2FsUmVzb3VyY2VJZDogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzcG9uc2VCb2R5ID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgU3RhdHVzOiByZXNwb25zZVN0YXR1cyxcbiAgICAgIFJlYXNvbjogcmVhc29uLFxuICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBwaHlzaWNhbFJlc291cmNlSWQsXG4gICAgICBTdGFja0lkOiBldmVudC5TdGFja0lkLFxuICAgICAgUmVxdWVzdElkOiBldmVudC5SZXF1ZXN0SWQsXG4gICAgICBMb2dpY2FsUmVzb3VyY2VJZDogZXZlbnQuTG9naWNhbFJlc291cmNlSWQsXG4gICAgICBEYXRhOiB7XG4gICAgICAgIC8vIEFkZCBsb2cgZ3JvdXAgbmFtZSBhcyBwYXJ0IG9mIHRoZSByZXNwb25zZSBzbyB0aGF0IGl0J3MgYXZhaWxhYmxlIHZpYSBGbjo6R2V0QXR0XG4gICAgICAgIExvZ0dyb3VwTmFtZTogZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkxvZ0dyb3VwTmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZygnUmVzcG9uZGluZycsIHJlc3BvbnNlQm9keSk7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xuICAgIGNvbnN0IHBhcnNlZFVybCA9IHJlcXVpcmUoJ3VybCcpLnBhcnNlKGV2ZW50LlJlc3BvbnNlVVJMKTtcbiAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IHtcbiAgICAgIGhvc3RuYW1lOiBwYXJzZWRVcmwuaG9zdG5hbWUsXG4gICAgICBwYXRoOiBwYXJzZWRVcmwucGF0aCxcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICBoZWFkZXJzOiB7ICdjb250ZW50LXR5cGUnOiAnJywgJ2NvbnRlbnQtbGVuZ3RoJzogcmVzcG9uc2VCb2R5Lmxlbmd0aCB9LFxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJ2h0dHBzJykucmVxdWVzdChyZXF1ZXN0T3B0aW9ucywgcmVzb2x2ZSk7XG4gICAgICAgIHJlcXVlc3Qub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgICAgcmVxdWVzdC53cml0ZShyZXNwb25zZUJvZHkpO1xuICAgICAgICByZXF1ZXN0LmVuZCgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVJldHJ5T3B0aW9ucyhyYXdPcHRpb25zOiBhbnkpOiBTZGtSZXRyeU9wdGlvbnMge1xuICAgIGNvbnN0IHJldHJ5T3B0aW9uczogU2RrUmV0cnlPcHRpb25zID0ge307XG4gICAgaWYgKHJhd09wdGlvbnMpIHtcbiAgICAgIGlmIChyYXdPcHRpb25zLm1heFJldHJpZXMpIHtcbiAgICAgICAgcmV0cnlPcHRpb25zLm1heFJldHJpZXMgPSBwYXJzZUludChyYXdPcHRpb25zLm1heFJldHJpZXMsIDEwKTtcbiAgICAgIH1cbiAgICAgIGlmIChyYXdPcHRpb25zLmJhc2UpIHtcbiAgICAgICAgcmV0cnlPcHRpb25zLnJldHJ5T3B0aW9ucyA9IHtcbiAgICAgICAgICBiYXNlOiBwYXJzZUludChyYXdPcHRpb25zLmJhc2UsIDEwKSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldHJ5T3B0aW9ucztcbiAgfVxufVxuIl19