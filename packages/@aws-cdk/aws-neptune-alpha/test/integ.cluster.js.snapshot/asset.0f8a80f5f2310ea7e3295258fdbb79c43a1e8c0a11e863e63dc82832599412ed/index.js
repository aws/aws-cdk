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
//delete a log group
async function deleteLogGroup(logGroupName, region, options) {
    let retryCount = options?.maxRetries == undefined ? 10 : options.maxRetries;
    const delay = options?.retryOptions?.base == undefined ? 10 : options.retryOptions.base;
    do {
        try {
            const cloudwatchlogs = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28', region, ...options });
            await cloudwatchlogs.deleteLogGroup({ logGroupName }).promise();
            return;
        }
        catch (error) {
            if (error.code === 'ResourceNotFoundException') {
                // The log group doesn't exist
                return;
            }
            if (error.code === 'OperationAbortedException') {
                if (retryCount > 0) {
                    retryCount--;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                else {
                    // The log group is still being deleted by another execution but we are out of retries
                    throw new Error('Out of attempts to delete a logGroup');
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
        //When the requestType is delete, delete the log group if the removal policy is delete
        if (event.RequestType === 'Delete' && event.ResourceProperties.RemovalPolicy === 'destroy') {
            await deleteLogGroup(logGroupName, logGroupRegion, retryOptions);
            //else retain the log group
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7QUFFL0IsNkRBQTZEO0FBQzdELCtCQUErQjtBQVMvQjs7Ozs7O0dBTUc7QUFDSCxLQUFLLFVBQVUsa0JBQWtCLENBQUMsWUFBb0IsRUFBRSxNQUFlLEVBQUUsT0FBeUI7SUFDaEcsNEVBQTRFO0lBQzVFLDRFQUE0RTtJQUM1RSw2RUFBNkU7SUFDN0UsNEVBQTRFO0lBQzVFLG1DQUFtQztJQUNuQyx1REFBdUQ7SUFDdkQsSUFBSSxVQUFVLEdBQUcsT0FBTyxFQUFFLFVBQVUsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztJQUM1RSxNQUFNLEtBQUssR0FBRyxPQUFPLEVBQUUsWUFBWSxFQUFFLElBQUksSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7SUFDeEYsR0FBRztRQUNELElBQUk7WUFDRixNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDaEcsTUFBTSxjQUFjLENBQUMsY0FBYyxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNoRSxPQUFPO1NBQ1I7UUFBQyxPQUFPLEtBQVUsRUFBRTtZQUNuQixJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssZ0NBQWdDLEVBQUU7Z0JBQ25ELDJEQUEyRDtnQkFDM0QsT0FBTzthQUNSO1lBQ0QsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLDJCQUEyQixFQUFFO2dCQUM5QyxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7b0JBQ2xCLFVBQVUsRUFB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Q2xFLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUM1QixPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDZjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNYO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsU0FBUyxpQkFBaUIsQ0FBQyxVQUFlO1FBQ3hDLE1BQU0sWUFBWSxHQUFvQixFQUFFLENBQUM7UUFDekMsSUFBSSxVQUFVLEVBQUU7WUFDZCxJQUFJLFVBQVUsQ0FBQyxVQUFVLEVBQUU7Z0JBQ3pCLFlBQVksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDL0Q7WUFDRCxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7Z0JBQ25CLFlBQVksQ0FBQyxZQUFZLEdBQUc7b0JBQzFCLElBQUksRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUM7aUJBQ3BDLENBQUM7YUFDSDtTQUNGO1FBQ0QsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztBQUNILENBQUM7QUFwR0QsMEJBb0dDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgKiBhcyBBV1MgZnJvbSAnYXdzLXNkayc7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgdHlwZSB7IFJldHJ5RGVsYXlPcHRpb25zIH0gZnJvbSAnYXdzLXNkay9saWIvY29uZmlnLWJhc2UnO1xuXG5pbnRlcmZhY2UgU2RrUmV0cnlPcHRpb25zIHtcbiAgbWF4UmV0cmllcz86IG51bWJlcjtcbiAgcmV0cnlPcHRpb25zPzogUmV0cnlEZWxheU9wdGlvbnM7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGxvZyBncm91cCBhbmQgZG9lc24ndCB0aHJvdyBpZiBpdCBleGlzdHMuXG4gKlxuICogQHBhcmFtIGxvZ0dyb3VwTmFtZSB0aGUgbmFtZSBvZiB0aGUgbG9nIGdyb3VwIHRvIGNyZWF0ZS5cbiAqIEBwYXJhbSByZWdpb24gdG8gY3JlYXRlIHRoZSBsb2cgZ3JvdXAgaW5cbiAqIEBwYXJhbSBvcHRpb25zIENsb3VkV2F0Y2ggQVBJIFNESyBvcHRpb25zLlxuICovXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVMb2dHcm91cFNhZmUobG9nR3JvdXBOYW1lOiBzdHJpbmcsIHJlZ2lvbj86IHN0cmluZywgb3B0aW9ucz86IFNka1JldHJ5T3B0aW9ucykge1xuICAvLyBJZiB3ZSBzZXQgdGhlIGxvZyByZXRlbnRpb24gZm9yIGEgbGFtYmRhLCB0aGVuIGR1ZSB0byB0aGUgYXN5bmMgbmF0dXJlIG9mXG4gIC8vIExhbWJkYSBsb2dnaW5nIHRoZXJlIGNvdWxkIGJlIGEgcmFjZSBjb25kaXRpb24gd2hlbiB0aGUgc2FtZSBsb2cgZ3JvdXAgaXNcbiAgLy8gYWxyZWFkeSBiZWluZyBjcmVhdGVkIGJ5IHRoZSBsYW1iZGEgZXhlY3V0aW9uLiBUaGlzIGNhbiBzb21ldGltZSByZXN1bHQgaW5cbiAgLy8gYW4gZXJyb3IgXCJPcGVyYXRpb25BYm9ydGVkRXhjZXB0aW9uOiBBIGNvbmZsaWN0aW5nIG9wZXJhdGlvbiBpcyBjdXJyZW50bHlcbiAgLy8gaW4gcHJvZ3Jlc3MuLi5QbGVhc2UgdHJ5IGFnYWluLlwiXG4gIC8vIFRvIGF2b2lkIGFuIGVycm9yLCB3ZSBkbyBhcyByZXF1ZXN0ZWQgYW5kIHRyeSBhZ2Fpbi5cbiAgbGV0IHJldHJ5Q291bnQgPSBvcHRpb25zPy5tYXhSZXRyaWVzID09IHVuZGVmaW5lZCA/IDEwIDogb3B0aW9ucy5tYXhSZXRyaWVzO1xuICBjb25zdCBkZWxheSA9IG9wdGlvbnM/LnJldHJ5T3B0aW9ucz8uYmFzZSA9PSB1bmRlZmluZWQgPyAxMCA6IG9wdGlvbnMucmV0cnlPcHRpb25zLmJhc2U7XG4gIGRvIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY2xvdWR3YXRjaGxvZ3MgPSBuZXcgQVdTLkNsb3VkV2F0Y2hMb2dzKHsgYXBpVmVyc2lvbjogJzIwMTQtMDMtMjgnLCByZWdpb24sIC4uLm9wdGlvbnMgfSk7XG4gICAgICBhd2FpdCBjbG91ZHdhdGNobG9ncy5jcmVhdGVMb2dHcm91cCh7IGxvZ0dyb3VwTmFtZSB9KS5wcm9taXNlKCk7XG4gICAgICByZXR1cm47XG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgaWYgKGVycm9yLmNvZGUgPT09ICdSZXNvdXJjZUFscmVhZHlFeGlzdHNFeGNlcHRpb24nKSB7XG4gICAgICAgIC8vIFRoZSBsb2cgZ3JvdXAgaXMgYWxyZWFkeSBjcmVhdGVkIGJ5IHRoZSBsYW1iZGEgZXhlY3V0aW9uXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgaWYgKHJldHJ5Q291bnQgPiAwKSB7XG4gICAgICAgICAgcmV0cnlDb3VudC0tO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFRoZSBsb2cgZ3JvdXAgaXMgc3RpbGwgYmVpbmcgY3JlYXRlZCBieSBhbm90aGVyIGV4ZWN1dGlvbiBidXQgd2UgYXJlIG91dCBvZiByZXRyaWVzXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPdXQgb2YgYXR0ZW1wdHMgdG8gY3JlYXRlIGEgbG9nR3JvdXAnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9IHdoaWxlICh0cnVlKTsgLy8gZXhpdCBoYXBwZW5zIG9uIHJldHJ5IGNvdW50IGNoZWNrXG59XG5cbi8vZGVsZXRlIGEgbG9nIGdyb3VwXG5hc3luYyBmdW5jdGlvbiBkZWxldGVMb2dHcm91cChsb2dHcm91cE5hbWU6IHN0cmluZywgcmVnaW9uPzogc3RyaW5nLCBvcHRpb25zPzogU2RrUmV0cnlPcHRpb25zKSB7XG4gIGxldCByZXRyeUNvdW50ID0gb3B0aW9ucz8ubWF4UmV0cmllcyA9PSB1bmRlZmluZWQgPyAxMCA6IG9wdGlvbnMubWF4UmV0cmllcztcbiAgY29uc3QgZGVsYXkgPSBvcHRpb25zPy5yZXRyeU9wdGlvbnM/LmJhc2UgPT0gdW5kZWZpbmVkID8gMTAgOiBvcHRpb25zLnJldHJ5T3B0aW9ucy5iYXNlO1xuICBkbyB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNsb3Vkd2F0Y2hsb2dzID0gbmV3IEFXUy5DbG91ZFdhdGNoTG9ncyh7IGFwaVZlcnNpb246ICcyMDE0LTAzLTI4JywgcmVnaW9uLCAuLi5vcHRpb25zIH0pO1xuICAgICAgYXdhaXQgY2xvdWR3YXRjaGxvZ3MuZGVsZXRlTG9nR3JvdXAoeyBsb2dHcm91cE5hbWUgfSkucHJvbWlzZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgLy8gVGhlIGxvZyBncm91cCBkb2Vzbid0IGV4aXN0XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgaWYgKHJldHJ5Q291bnQgPiAwKSB7XG4gICAgICAgICAgcmV0cnlDb3VudC0tO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFRoZSBsb2cgZ3JvdXAgaXMgc3RpbGwgYmVpbmcgZGVsZXRlZCBieSBhbm90aGVyIGV4ZWN1dGlvbiBidXQgd2UgYXJlIG91dCBvZiByZXRyaWVzXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPdXQgb2YgYXR0ZW1wdHMgdG8gZGVsZXRlIGEgbG9nR3JvdXAnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9IHdoaWxlICh0cnVlKTsgLy8gZXhpdCBoYXBwZW5zIG9uIHJldHJ5IGNvdW50IGNoZWNrXG59XG5cbi8qKlxuICogUHV0cyBvciBkZWxldGVzIGEgcmV0ZW50aW9uIHBvbGljeSBvbiBhIGxvZyBncm91cC5cbiAqXG4gKiBAcGFyYW0gbG9nR3JvdXBOYW1lIHRoZSBuYW1lIG9mIHRoZSBsb2cgZ3JvdXAgdG8gY3JlYXRlXG4gKiBAcGFyYW0gcmVnaW9uIHRoZSByZWdpb24gb2YgdGhlIGxvZyBncm91cFxuICogQHBhcmFtIG9wdGlvbnMgQ2xvdWRXYXRjaCBBUEkgU0RLIG9wdGlvbnMuXG4gKiBAcGFyYW0gcmV0ZW50aW9uSW5EYXlzIHRoZSBudW1iZXIgb2YgZGF5cyB0byByZXRhaW4gdGhlIGxvZyBldmVudHMgaW4gdGhlIHNwZWNpZmllZCBsb2cgZ3JvdXAuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHNldFJldGVudGlvblBvbGljeShsb2dHcm91cE5hbWU6IHN0cmluZywgcmVnaW9uPzogc3RyaW5nLCBvcHRpb25zPzogU2RrUmV0cnlPcHRpb25zLCByZXRlbnRpb25JbkRheXM/OiBudW1iZXIpIHtcbiAgLy8gVGhlIHNhbWUgYXMgaW4gY3JlYXRlTG9nR3JvdXBTYWZlKCksIGhlcmUgd2UgY291bGQgZW5kIHVwIHdpdGggdGhlIHJhY2VcbiAgLy8gY29uZGl0aW9uIHdoZXJlIGEgbG9nIGdyb3VwIGlzIGVpdGhlciBhbHJlYWR5IGJlaW5nIGNyZWF0ZWQgb3IgaXRzIHJldGVudGlvblxuICAvLyBwb2xpY3kgaXMgYmVpbmcgdXBkYXRlZC4gVGhpcyB3b3VsZCByZXN1bHQgaW4gYW4gT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbixcbiAgLy8gd2hpY2ggd2Ugd2lsbCB0cnkgdG8gY2F0Y2ggYW5kIHJldHJ5IHRoZSBjb21tYW5kIGEgbnVtYmVyIG9mIHRpbWVzIGJlZm9yZSBmYWlsaW5nXG4gIGxldCByZXRyeUNvdW50ID0gb3B0aW9ucz8ubWF4UmV0cmllcyA9PSB1bmRlZmluZWQgPyAxMCA6IG9wdGlvbnMubWF4UmV0cmllcztcbiAgY29uc3QgZGVsYXkgPSBvcHRpb25zPy5yZXRyeU9wdGlvbnM/LmJhc2UgPT0gdW5kZWZpbmVkID8gMTAgOiBvcHRpb25zLnJldHJ5T3B0aW9ucy5iYXNlO1xuICBkbyB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNsb3Vkd2F0Y2hsb2dzID0gbmV3IEFXUy5DbG91ZFdhdGNoTG9ncyh7IGFwaVZlcnNpb246ICcyMDE0LTAzLTI4JywgcmVnaW9uLCAuLi5vcHRpb25zIH0pO1xuICAgICAgaWYgKCFyZXRlbnRpb25JbkRheXMpIHtcbiAgICAgICAgYXdhaXQgY2xvdWR3YXRjaGxvZ3MuZGVsZXRlUmV0ZW50aW9uUG9saWN5KHsgbG9nR3JvdXBOYW1lIH0pLnByb21pc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IGNsb3Vkd2F0Y2hsb2dzLnB1dFJldGVudGlvblBvbGljeSh7IGxvZ0dyb3VwTmFtZSwgcmV0ZW50aW9uSW5EYXlzIH0pLnByb21pc2UoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcblxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgaWYgKHJldHJ5Q291bnQgPiAwKSB7XG4gICAgICAgICAgcmV0cnlDb3VudC0tO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFRoZSBsb2cgZ3JvdXAgaXMgc3RpbGwgYmVpbmcgY3JlYXRlZCBieSBhbm90aGVyIGV4ZWN1dGlvbiBidXQgd2UgYXJlIG91dCBvZiByZXRyaWVzXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPdXQgb2YgYXR0ZW1wdHMgdG8gY3JlYXRlIGEgbG9nR3JvdXAnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9IHdoaWxlICh0cnVlKTsgLy8gZXhpdCBoYXBwZW5zIG9uIHJldHJ5IGNvdW50IGNoZWNrXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50LCBjb250ZXh0OiBBV1NMYW1iZGEuQ29udGV4dCkge1xuICB0cnkge1xuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHsgLi4uZXZlbnQsIFJlc3BvbnNlVVJMOiAnLi4uJyB9KSk7XG5cbiAgICAvLyBUaGUgdGFyZ2V0IGxvZyBncm91cFxuICAgIGNvbnN0IGxvZ0dyb3VwTmFtZSA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Mb2dHcm91cE5hbWU7XG5cbiAgICAvLyBUaGUgcmVnaW9uIG9mIHRoZSB0YXJnZXQgbG9nIGdyb3VwXG4gICAgY29uc3QgbG9nR3JvdXBSZWdpb24gPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuTG9nR3JvdXBSZWdpb247XG5cbiAgICAvLyBQYXJzZSB0byBBV1MgU0RLIHJldHJ5IG9wdGlvbnNcbiAgICBjb25zdCByZXRyeU9wdGlvbnMgPSBwYXJzZVJldHJ5T3B0aW9ucyhldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuU2RrUmV0cnkpO1xuXG4gICAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJyB8fCBldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ1VwZGF0ZScpIHtcbiAgICAgIC8vIEFjdCBvbiB0aGUgdGFyZ2V0IGxvZyBncm91cFxuICAgICAgYXdhaXQgY3JlYXRlTG9nR3JvdXBTYWZlKGxvZ0dyb3VwTmFtZSwgbG9nR3JvdXBSZWdpb24sIHJldHJ5T3B0aW9ucyk7XG4gICAgICBhd2FpdCBzZXRSZXRlbnRpb25Qb2xpY3kobG9nR3JvdXBOYW1lLCBsb2dHcm91cFJlZ2lvbiwgcmV0cnlPcHRpb25zLCBwYXJzZUludChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuUmV0ZW50aW9uSW5EYXlzLCAxMCkpO1xuXG4gICAgICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdDcmVhdGUnKSB7XG4gICAgICAgIC8vIFNldCBhIHJldGVudGlvbiBwb2xpY3kgb2YgMSBkYXkgb24gdGhlIGxvZ3Mgb2YgdGhpcyB2ZXJ5IGZ1bmN0aW9uLlxuICAgICAgICAvLyBEdWUgdG8gdGhlIGFzeW5jIG5hdHVyZSBvZiB0aGUgbG9nIGdyb3VwIGNyZWF0aW9uLCB0aGUgbG9nIGdyb3VwIGZvciB0aGlzIGZ1bmN0aW9uIG1pZ2h0XG4gICAgICAgIC8vIHN0aWxsIGJlIG5vdCBjcmVhdGVkIHlldCBhdCB0aGlzIHBvaW50LiBUaGVyZWZvcmUgd2UgYXR0ZW1wdCB0byBjcmVhdGUgaXQuXG4gICAgICAgIC8vIEluIGNhc2UgaXQgaXMgYmVpbmcgY3JlYXRlZCwgY3JlYXRlTG9nR3JvdXBTYWZlIHdpbGwgaGFuZGxlIHRoZSBjb25mbGljdC5cbiAgICAgICAgY29uc3QgcmVnaW9uID0gcHJvY2Vzcy5lbnYuQVdTX1JFR0lPTjtcbiAgICAgICAgYXdhaXQgY3JlYXRlTG9nR3JvdXBTYWZlKGAvYXdzL2xhbWJkYS8ke2NvbnRleHQuZnVuY3Rpb25OYW1lfWAsIHJlZ2lvbiwgcmV0cnlPcHRpb25zKTtcbiAgICAgICAgLy8gSWYgY3JlYXRlTG9nR3JvdXBTYWZlIGZhaWxzLCB0aGUgbG9nIGdyb3VwIGlzIG5vdCBjcmVhdGVkIGV2ZW4gYWZ0ZXIgbXVsdGlwbGUgYXR0ZW1wdHMuXG4gICAgICAgIC8vIEluIHRoaXMgY2FzZSB3ZSBoYXZlIG5vdGhpbmcgdG8gc2V0IHRoZSByZXRlbnRpb24gcG9saWN5IG9uIGJ1dCBhbiBleGNlcHRpb24gd2lsbCBza2lwXG4gICAgICAgIC8vIHRoZSBuZXh0IGxpbmUuXG4gICAgICAgIGF3YWl0IHNldFJldGVudGlvblBvbGljeShgL2F3cy9sYW1iZGEvJHtjb250ZXh0LmZ1bmN0aW9uTmFtZX1gLCByZWdpb24sIHJldHJ5T3B0aW9ucywgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9XaGVuIHRoZSByZXF1ZXN0VHlwZSBpcyBkZWxldGUsIGRlbGV0ZSB0aGUgbG9nIGdyb3VwIGlmIHRoZSByZW1vdmFsIHBvbGljeSBpcyBkZWxldGVcbiAgICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdEZWxldGUnICYmIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5SZW1vdmFsUG9saWN5ID09PSAnZGVzdHJveScpIHtcbiAgICAgIGF3YWl0IGRlbGV0ZUxvZ0dyb3VwKGxvZ0dyb3VwTmFtZSwgbG9nR3JvdXBSZWdpb24sIHJldHJ5T3B0aW9ucyk7XG4gICAgICAvL2Vsc2UgcmV0YWluIHRoZSBsb2cgZ3JvdXBcbiAgICB9XG5cbiAgICBhd2FpdCByZXNwb25kKCdTVUNDRVNTJywgJ09LJywgbG9nR3JvdXBOYW1lKTtcbiAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgY29uc29sZS5sb2coZSk7XG5cbiAgICBhd2FpdCByZXNwb25kKCdGQUlMRUQnLCBlLm1lc3NhZ2UsIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Mb2dHcm91cE5hbWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzcG9uZChyZXNwb25zZVN0YXR1czogc3RyaW5nLCByZWFzb246IHN0cmluZywgcGh5c2ljYWxSZXNvdXJjZUlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZXNwb25zZUJvZHkgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBTdGF0dXM6IHJlc3BvbnNlU3RhdHVzLFxuICAgICAgUmVhc29uOiByZWFzb24sXG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IHBoeXNpY2FsUmVzb3VyY2VJZCxcbiAgICAgIFN0YWNrSWQ6IGV2ZW50LlN0YWNrSWQsXG4gICAgICBSZXF1ZXN0SWQ6IGV2ZW50LlJlcXVlc3RJZCxcbiAgICAgIExvZ2ljYWxSZXNvdXJjZUlkOiBldmVudC5Mb2dpY2FsUmVzb3VyY2VJZCxcbiAgICAgIERhdGE6IHtcbiAgICAgICAgLy8gQWRkIGxvZyBncm91cCBuYW1lIGFzIHBhcnQgb2YgdGhlIHJlc3BvbnNlIHNvIHRoYXQgaXQncyBhdmFpbGFibGUgdmlhIEZuOjpHZXRBdHRcbiAgICAgICAgTG9nR3JvdXBOYW1lOiBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuTG9nR3JvdXBOYW1lLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnNvbGUubG9nKCdSZXNwb25kaW5nJywgcmVzcG9uc2VCb2R5KTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgY29uc3QgcGFyc2VkVXJsID0gcmVxdWlyZSgndXJsJykucGFyc2UoZXZlbnQuUmVzcG9uc2VVUkwpO1xuICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgaG9zdG5hbWU6IHBhcnNlZFVybC5ob3N0bmFtZSxcbiAgICAgIHBhdGg6IHBhcnNlZFVybC5wYXRoLFxuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICcnLFxuICAgICAgICAnY29udGVudC1sZW5ndGgnOiBCdWZmZXIuYnl0ZUxlbmd0aChyZXNwb25zZUJvZHksICd1dGY4JyksXG4gICAgICB9LFxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJ2h0dHBzJykucmVxdWVzdChyZXF1ZXN0T3B0aW9ucywgcmVzb2x2ZSk7XG4gICAgICAgIHJlcXVlc3Qub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgICAgcmVxdWVzdC53cml0ZShyZXNwb25zZUJvZHkpO1xuICAgICAgICByZXF1ZXN0LmVuZCgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVJldHJ5T3B0aW9ucyhyYXdPcHRpb25zOiBhbnkpOiBTZGtSZXRyeU9wdGlvbnMge1xuICAgIGNvbnN0IHJldHJ5T3B0aW9uczogU2RrUmV0cnlPcHRpb25zID0ge307XG4gICAgaWYgKHJhd09wdGlvbnMpIHtcbiAgICAgIGlmIChyYXdPcHRpb25zLm1heFJldHJpZXMpIHtcbiAgICAgICAgcmV0cnlPcHRpb25zLm1heFJldHJpZXMgPSBwYXJzZUludChyYXdPcHRpb25zLm1heFJldHJpZXMsIDEwKTtcbiAgICAgIH1cbiAgICAgIGlmIChyYXdPcHRpb25zLmJhc2UpIHtcbiAgICAgICAgcmV0cnlPcHRpb25zLnJldHJ5T3B0aW9ucyA9IHtcbiAgICAgICAgICBiYXNlOiBwYXJzZUludChyYXdPcHRpb25zLmJhc2UsIDEwKSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldHJ5T3B0aW9ucztcbiAgfVxufVxuIl19