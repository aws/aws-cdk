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
        //The deletion policy of log after the stack is deleted
        const logDeletionPolicy = event.ResourceProperties.LogDeletionPolicy;
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
        //if the requestType is delete, then delete the log group created by the logRetention
        if (event.RequestType === 'Delete') {
            //if the removal policy is delete, then delete the log group
            if (logDeletionPolicy === 'destroy') {
                await deleteLogGroup(logGroupName, logGroupRegion, retryOptions);
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7QUFFL0IsNkRBQTZEO0FBQzdELCtCQUErQjtBQVMvQjs7Ozs7O0dBTUc7QUFDSCxLQUFLLFVBQVUsa0JBQWtCLENBQUMsWUFBb0IsRUFBRSxNQUFlLEVBQUUsT0FBeUI7SUFDaEcsNEVBQTRFO0lBQzVFLDRFQUE0RTtJQUM1RSw2RUFBNkU7SUFDN0UsNEVBQTRFO0lBQzVFLG1DQUFtQztJQUNuQyx1REFBdUQ7SUFDdkQsSUFBSSxVQUFVLEdBQUcsT0FBTyxFQUFFLFVBQVUsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztJQUM1RSxNQUFNLEtBQUssR0FBRyxPQUFPLEVBQUUsWUFBWSxFQUFFLElBQUksSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7SUFDeEYsR0FBRztRQUNELElBQUk7WUFDRixNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDaEcsTUFBTSxjQUFjLENBQUMsY0FBYyxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNoRSxPQUFPO1NBQ1I7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxnQ0FBZ0MsRUFBRTtnQkFDbkQsMkRBQTJEO2dCQUMzRCxPQUFPO2FBQ1I7WUFDRCxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssMkJBQTJCLEVBQUU7Z0JBQzlDLElBQUksVUFBVSxHQUFHLENBQUMsRUFBRTtvQkFDbEIsVUFBVSxFQUFF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LENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNsRSxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDNUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDNUIsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO2FBQ2Y7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDWDtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFNBQVMsaUJBQWlCLENBQUMsVUFBZTtRQUN4QyxNQUFNLFlBQVksR0FBb0IsRUFBRSxDQUFDO1FBQ3pDLElBQUksVUFBVSxFQUFFO1lBQ2QsSUFBSSxVQUFVLENBQUMsVUFBVSxFQUFFO2dCQUN6QixZQUFZLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQy9EO1lBQ0QsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFO2dCQUNuQixZQUFZLENBQUMsWUFBWSxHQUFHO29CQUMxQixJQUFJLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO2lCQUNwQyxDQUFDO2FBQ0g7U0FDRjtRQUNELE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7QUFDSCxDQUFDO0FBdkdELDBCQXVHQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0ICogYXMgQVdTIGZyb20gJ2F3cy1zZGsnO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHR5cGUgeyBSZXRyeURlbGF5T3B0aW9ucyB9IGZyb20gJ2F3cy1zZGsvbGliL2NvbmZpZy1iYXNlJztcblxuaW50ZXJmYWNlIFNka1JldHJ5T3B0aW9ucyB7XG4gIG1heFJldHJpZXM/OiBudW1iZXI7XG4gIHJldHJ5T3B0aW9ucz86IFJldHJ5RGVsYXlPcHRpb25zO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBsb2cgZ3JvdXAgYW5kIGRvZXNuJ3QgdGhyb3cgaWYgaXQgZXhpc3RzLlxuICpcbiAqIEBwYXJhbSBsb2dHcm91cE5hbWUgdGhlIG5hbWUgb2YgdGhlIGxvZyBncm91cCB0byBjcmVhdGUuXG4gKiBAcGFyYW0gcmVnaW9uIHRvIGNyZWF0ZSB0aGUgbG9nIGdyb3VwIGluXG4gKiBAcGFyYW0gb3B0aW9ucyBDbG91ZFdhdGNoIEFQSSBTREsgb3B0aW9ucy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gY3JlYXRlTG9nR3JvdXBTYWZlKGxvZ0dyb3VwTmFtZTogc3RyaW5nLCByZWdpb24/OiBzdHJpbmcsIG9wdGlvbnM/OiBTZGtSZXRyeU9wdGlvbnMpIHtcbiAgLy8gSWYgd2Ugc2V0IHRoZSBsb2cgcmV0ZW50aW9uIGZvciBhIGxhbWJkYSwgdGhlbiBkdWUgdG8gdGhlIGFzeW5jIG5hdHVyZSBvZlxuICAvLyBMYW1iZGEgbG9nZ2luZyB0aGVyZSBjb3VsZCBiZSBhIHJhY2UgY29uZGl0aW9uIHdoZW4gdGhlIHNhbWUgbG9nIGdyb3VwIGlzXG4gIC8vIGFscmVhZHkgYmVpbmcgY3JlYXRlZCBieSB0aGUgbGFtYmRhIGV4ZWN1dGlvbi4gVGhpcyBjYW4gc29tZXRpbWUgcmVzdWx0IGluXG4gIC8vIGFuIGVycm9yIFwiT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbjogQSBjb25mbGljdGluZyBvcGVyYXRpb24gaXMgY3VycmVudGx5XG4gIC8vIGluIHByb2dyZXNzLi4uUGxlYXNlIHRyeSBhZ2Fpbi5cIlxuICAvLyBUbyBhdm9pZCBhbiBlcnJvciwgd2UgZG8gYXMgcmVxdWVzdGVkIGFuZCB0cnkgYWdhaW4uXG4gIGxldCByZXRyeUNvdW50ID0gb3B0aW9ucz8ubWF4UmV0cmllcyA9PSB1bmRlZmluZWQgPyAxMCA6IG9wdGlvbnMubWF4UmV0cmllcztcbiAgY29uc3QgZGVsYXkgPSBvcHRpb25zPy5yZXRyeU9wdGlvbnM/LmJhc2UgPT0gdW5kZWZpbmVkID8gMTAgOiBvcHRpb25zLnJldHJ5T3B0aW9ucy5iYXNlO1xuICBkbyB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNsb3Vkd2F0Y2hsb2dzID0gbmV3IEFXUy5DbG91ZFdhdGNoTG9ncyh7IGFwaVZlcnNpb246ICcyMDE0LTAzLTI4JywgcmVnaW9uLCAuLi5vcHRpb25zIH0pO1xuICAgICAgYXdhaXQgY2xvdWR3YXRjaGxvZ3MuY3JlYXRlTG9nR3JvdXAoeyBsb2dHcm91cE5hbWUgfSkucHJvbWlzZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IuY29kZSA9PT0gJ1Jlc291cmNlQWxyZWFkeUV4aXN0c0V4Y2VwdGlvbicpIHtcbiAgICAgICAgLy8gVGhlIGxvZyBncm91cCBpcyBhbHJlYWR5IGNyZWF0ZWQgYnkgdGhlIGxhbWJkYSBleGVjdXRpb25cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGVycm9yLmNvZGUgPT09ICdPcGVyYXRpb25BYm9ydGVkRXhjZXB0aW9uJykge1xuICAgICAgICBpZiAocmV0cnlDb3VudCA+IDApIHtcbiAgICAgICAgICByZXRyeUNvdW50LS07XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVGhlIGxvZyBncm91cCBpcyBzdGlsbCBiZWluZyBjcmVhdGVkIGJ5IGFub3RoZXIgZXhlY3V0aW9uIGJ1dCB3ZSBhcmUgb3V0IG9mIHJldHJpZXNcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ091dCBvZiBhdHRlbXB0cyB0byBjcmVhdGUgYSBsb2dHcm91cCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH0gd2hpbGUgKHRydWUpOyAvLyBleGl0IGhhcHBlbnMgb24gcmV0cnkgY291bnQgY2hlY2tcbn1cblxuLy9kZWxldGUgYSBsb2cgZ3JvdXBcbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUxvZ0dyb3VwKGxvZ0dyb3VwTmFtZTogc3RyaW5nLCByZWdpb24/OiBzdHJpbmcsIG9wdGlvbnM/OiBTZGtSZXRyeU9wdGlvbnMpIHtcbiAgbGV0IHJldHJ5Q291bnQgPSBvcHRpb25zPy5tYXhSZXRyaWVzID09IHVuZGVmaW5lZCA/IDEwIDogb3B0aW9ucy5tYXhSZXRyaWVzO1xuICBjb25zdCBkZWxheSA9IG9wdGlvbnM/LnJldHJ5T3B0aW9ucz8uYmFzZSA9PSB1bmRlZmluZWQgPyAxMCA6IG9wdGlvbnMucmV0cnlPcHRpb25zLmJhc2U7XG4gIGRvIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY2xvdWR3YXRjaGxvZ3MgPSBuZXcgQVdTLkNsb3VkV2F0Y2hMb2dzKHsgYXBpVmVyc2lvbjogJzIwMTQtMDMtMjgnLCByZWdpb24sIC4uLm9wdGlvbnMgfSk7XG4gICAgICBhd2FpdCBjbG91ZHdhdGNobG9ncy5kZWxldGVMb2dHcm91cCh7IGxvZ0dyb3VwTmFtZSB9KS5wcm9taXNlKCk7XG4gICAgICByZXR1cm47XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgLy8gVGhlIGxvZyBncm91cCBkb2Vzbid0IGV4aXN0XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgaWYgKHJldHJ5Q291bnQgPiAwKSB7XG4gICAgICAgICAgcmV0cnlDb3VudC0tO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFRoZSBsb2cgZ3JvdXAgaXMgc3RpbGwgYmVpbmcgZGVsZXRlZCBieSBhbm90aGVyIGV4ZWN1dGlvbiBidXQgd2UgYXJlIG91dCBvZiByZXRyaWVzXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPdXQgb2YgYXR0ZW1wdHMgdG8gZGVsZXRlIGEgbG9nR3JvdXAnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9IHdoaWxlICh0cnVlKTsgLy8gZXhpdCBoYXBwZW5zIG9uIHJldHJ5IGNvdW50IGNoZWNrXG59XG5cbi8qKlxuICogUHV0cyBvciBkZWxldGVzIGEgcmV0ZW50aW9uIHBvbGljeSBvbiBhIGxvZyBncm91cC5cbiAqXG4gKiBAcGFyYW0gbG9nR3JvdXBOYW1lIHRoZSBuYW1lIG9mIHRoZSBsb2cgZ3JvdXAgdG8gY3JlYXRlXG4gKiBAcGFyYW0gcmVnaW9uIHRoZSByZWdpb24gb2YgdGhlIGxvZyBncm91cFxuICogQHBhcmFtIG9wdGlvbnMgQ2xvdWRXYXRjaCBBUEkgU0RLIG9wdGlvbnMuXG4gKiBAcGFyYW0gcmV0ZW50aW9uSW5EYXlzIHRoZSBudW1iZXIgb2YgZGF5cyB0byByZXRhaW4gdGhlIGxvZyBldmVudHMgaW4gdGhlIHNwZWNpZmllZCBsb2cgZ3JvdXAuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHNldFJldGVudGlvblBvbGljeShsb2dHcm91cE5hbWU6IHN0cmluZywgcmVnaW9uPzogc3RyaW5nLCBvcHRpb25zPzogU2RrUmV0cnlPcHRpb25zLCByZXRlbnRpb25JbkRheXM/OiBudW1iZXIpIHtcbiAgLy8gVGhlIHNhbWUgYXMgaW4gY3JlYXRlTG9nR3JvdXBTYWZlKCksIGhlcmUgd2UgY291bGQgZW5kIHVwIHdpdGggdGhlIHJhY2VcbiAgLy8gY29uZGl0aW9uIHdoZXJlIGEgbG9nIGdyb3VwIGlzIGVpdGhlciBhbHJlYWR5IGJlaW5nIGNyZWF0ZWQgb3IgaXRzIHJldGVudGlvblxuICAvLyBwb2xpY3kgaXMgYmVpbmcgdXBkYXRlZC4gVGhpcyB3b3VsZCByZXN1bHQgaW4gYW4gT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbixcbiAgLy8gd2hpY2ggd2Ugd2lsbCB0cnkgdG8gY2F0Y2ggYW5kIHJldHJ5IHRoZSBjb21tYW5kIGEgbnVtYmVyIG9mIHRpbWVzIGJlZm9yZSBmYWlsaW5nXG4gIGxldCByZXRyeUNvdW50ID0gb3B0aW9ucz8ubWF4UmV0cmllcyA9PSB1bmRlZmluZWQgPyAxMCA6IG9wdGlvbnMubWF4UmV0cmllcztcbiAgY29uc3QgZGVsYXkgPSBvcHRpb25zPy5yZXRyeU9wdGlvbnM/LmJhc2UgPT0gdW5kZWZpbmVkID8gMTAgOiBvcHRpb25zLnJldHJ5T3B0aW9ucy5iYXNlO1xuICBkbyB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNsb3Vkd2F0Y2hsb2dzID0gbmV3IEFXUy5DbG91ZFdhdGNoTG9ncyh7IGFwaVZlcnNpb246ICcyMDE0LTAzLTI4JywgcmVnaW9uLCAuLi5vcHRpb25zIH0pO1xuICAgICAgaWYgKCFyZXRlbnRpb25JbkRheXMpIHtcbiAgICAgICAgYXdhaXQgY2xvdWR3YXRjaGxvZ3MuZGVsZXRlUmV0ZW50aW9uUG9saWN5KHsgbG9nR3JvdXBOYW1lIH0pLnByb21pc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IGNsb3Vkd2F0Y2hsb2dzLnB1dFJldGVudGlvblBvbGljeSh7IGxvZ0dyb3VwTmFtZSwgcmV0ZW50aW9uSW5EYXlzIH0pLnByb21pc2UoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcblxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IuY29kZSA9PT0gJ09wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb24nKSB7XG4gICAgICAgIGlmIChyZXRyeUNvdW50ID4gMCkge1xuICAgICAgICAgIHJldHJ5Q291bnQtLTtcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUaGUgbG9nIGdyb3VwIGlzIHN0aWxsIGJlaW5nIGNyZWF0ZWQgYnkgYW5vdGhlciBleGVjdXRpb24gYnV0IHdlIGFyZSBvdXQgb2YgcmV0cmllc1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignT3V0IG9mIGF0dGVtcHRzIHRvIGNyZWF0ZSBhIGxvZ0dyb3VwJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSB3aGlsZSAodHJ1ZSk7IC8vIGV4aXQgaGFwcGVucyBvbiByZXRyeSBjb3VudCBjaGVja1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCwgY29udGV4dDogQVdTTGFtYmRhLkNvbnRleHQpIHtcbiAgdHJ5IHtcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh7IC4uLmV2ZW50LCBSZXNwb25zZVVSTDogJy4uLicgfSkpO1xuXG4gICAgLy8gVGhlIHRhcmdldCBsb2cgZ3JvdXBcbiAgICBjb25zdCBsb2dHcm91cE5hbWUgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuTG9nR3JvdXBOYW1lO1xuXG4gICAgLy8gVGhlIHJlZ2lvbiBvZiB0aGUgdGFyZ2V0IGxvZyBncm91cFxuICAgIGNvbnN0IGxvZ0dyb3VwUmVnaW9uID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkxvZ0dyb3VwUmVnaW9uO1xuXG4gICAgLy8gUGFyc2UgdG8gQVdTIFNESyByZXRyeSBvcHRpb25zXG4gICAgY29uc3QgcmV0cnlPcHRpb25zID0gcGFyc2VSZXRyeU9wdGlvbnMoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlNka1JldHJ5KTtcblxuICAgIC8vVGhlIGRlbGV0aW9uIHBvbGljeSBvZiBsb2cgYWZ0ZXIgdGhlIHN0YWNrIGlzIGRlbGV0ZWRcbiAgICBjb25zdCBsb2dEZWxldGlvblBvbGljeSA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Mb2dEZWxldGlvblBvbGljeTtcblxuICAgIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0NyZWF0ZScgfHwgZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdVcGRhdGUnKSB7XG4gICAgICAvLyBBY3Qgb24gdGhlIHRhcmdldCBsb2cgZ3JvdXBcbiAgICAgIGF3YWl0IGNyZWF0ZUxvZ0dyb3VwU2FmZShsb2dHcm91cE5hbWUsIGxvZ0dyb3VwUmVnaW9uLCByZXRyeU9wdGlvbnMpO1xuICAgICAgYXdhaXQgc2V0UmV0ZW50aW9uUG9saWN5KGxvZ0dyb3VwTmFtZSwgbG9nR3JvdXBSZWdpb24sIHJldHJ5T3B0aW9ucywgcGFyc2VJbnQoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlJldGVudGlvbkluRGF5cywgMTApKTtcblxuICAgICAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJykge1xuICAgICAgICAvLyBTZXQgYSByZXRlbnRpb24gcG9saWN5IG9mIDEgZGF5IG9uIHRoZSBsb2dzIG9mIHRoaXMgdmVyeSBmdW5jdGlvbi5cbiAgICAgICAgLy8gRHVlIHRvIHRoZSBhc3luYyBuYXR1cmUgb2YgdGhlIGxvZyBncm91cCBjcmVhdGlvbiwgdGhlIGxvZyBncm91cCBmb3IgdGhpcyBmdW5jdGlvbiBtaWdodFxuICAgICAgICAvLyBzdGlsbCBiZSBub3QgY3JlYXRlZCB5ZXQgYXQgdGhpcyBwb2ludC4gVGhlcmVmb3JlIHdlIGF0dGVtcHQgdG8gY3JlYXRlIGl0LlxuICAgICAgICAvLyBJbiBjYXNlIGl0IGlzIGJlaW5nIGNyZWF0ZWQsIGNyZWF0ZUxvZ0dyb3VwU2FmZSB3aWxsIGhhbmRsZSB0aGUgY29uZmxpY3QuXG4gICAgICAgIGNvbnN0IHJlZ2lvbiA9IHByb2Nlc3MuZW52LkFXU19SRUdJT047XG4gICAgICAgIGF3YWl0IGNyZWF0ZUxvZ0dyb3VwU2FmZShgL2F3cy9sYW1iZGEvJHtjb250ZXh0LmZ1bmN0aW9uTmFtZX1gLCByZWdpb24sIHJldHJ5T3B0aW9ucyk7XG4gICAgICAgIC8vIElmIGNyZWF0ZUxvZ0dyb3VwU2FmZSBmYWlscywgdGhlIGxvZyBncm91cCBpcyBub3QgY3JlYXRlZCBldmVuIGFmdGVyIG11bHRpcGxlIGF0dGVtcHRzLlxuICAgICAgICAvLyBJbiB0aGlzIGNhc2Ugd2UgaGF2ZSBub3RoaW5nIHRvIHNldCB0aGUgcmV0ZW50aW9uIHBvbGljeSBvbiBidXQgYW4gZXhjZXB0aW9uIHdpbGwgc2tpcFxuICAgICAgICAvLyB0aGUgbmV4dCBsaW5lLlxuICAgICAgICBhd2FpdCBzZXRSZXRlbnRpb25Qb2xpY3koYC9hd3MvbGFtYmRhLyR7Y29udGV4dC5mdW5jdGlvbk5hbWV9YCwgcmVnaW9uLCByZXRyeU9wdGlvbnMsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vaWYgdGhlIHJlcXVlc3RUeXBlIGlzIGRlbGV0ZSwgdGhlbiBkZWxldGUgdGhlIGxvZyBncm91cCBjcmVhdGVkIGJ5IHRoZSBsb2dSZXRlbnRpb25cbiAgICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdEZWxldGUnKSB7XG4gICAgICAvL2lmIHRoZSByZW1vdmFsIHBvbGljeSBpcyBkZWxldGUsIHRoZW4gZGVsZXRlIHRoZSBsb2cgZ3JvdXBcbiAgICAgIGlmIChsb2dEZWxldGlvblBvbGljeSA9PT0gJ2Rlc3Ryb3knKSB7XG4gICAgICAgIGF3YWl0IGRlbGV0ZUxvZ0dyb3VwKGxvZ0dyb3VwTmFtZSwgbG9nR3JvdXBSZWdpb24sIHJldHJ5T3B0aW9ucyk7XG4gICAgICB9XG4gICAgICAvL2Vsc2UgcmV0YWluIHRoZSBsb2cgZ3JvdXBcbiAgICB9XG5cbiAgICBhd2FpdCByZXNwb25kKCdTVUNDRVNTJywgJ09LJywgbG9nR3JvdXBOYW1lKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKGUpO1xuXG4gICAgYXdhaXQgcmVzcG9uZCgnRkFJTEVEJywgZS5tZXNzYWdlLCBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuTG9nR3JvdXBOYW1lKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc3BvbmQocmVzcG9uc2VTdGF0dXM6IHN0cmluZywgcmVhc29uOiBzdHJpbmcsIHBoeXNpY2FsUmVzb3VyY2VJZDogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzcG9uc2VCb2R5ID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgU3RhdHVzOiByZXNwb25zZVN0YXR1cyxcbiAgICAgIFJlYXNvbjogcmVhc29uLFxuICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBwaHlzaWNhbFJlc291cmNlSWQsXG4gICAgICBTdGFja0lkOiBldmVudC5TdGFja0lkLFxuICAgICAgUmVxdWVzdElkOiBldmVudC5SZXF1ZXN0SWQsXG4gICAgICBMb2dpY2FsUmVzb3VyY2VJZDogZXZlbnQuTG9naWNhbFJlc291cmNlSWQsXG4gICAgICBEYXRhOiB7XG4gICAgICAgIC8vIEFkZCBsb2cgZ3JvdXAgbmFtZSBhcyBwYXJ0IG9mIHRoZSByZXNwb25zZSBzbyB0aGF0IGl0J3MgYXZhaWxhYmxlIHZpYSBGbjo6R2V0QXR0XG4gICAgICAgIExvZ0dyb3VwTmFtZTogZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkxvZ0dyb3VwTmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZygnUmVzcG9uZGluZycsIHJlc3BvbnNlQm9keSk7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xuICAgIGNvbnN0IHBhcnNlZFVybCA9IHJlcXVpcmUoJ3VybCcpLnBhcnNlKGV2ZW50LlJlc3BvbnNlVVJMKTtcbiAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IHtcbiAgICAgIGhvc3RuYW1lOiBwYXJzZWRVcmwuaG9zdG5hbWUsXG4gICAgICBwYXRoOiBwYXJzZWRVcmwucGF0aCxcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICBoZWFkZXJzOiB7ICdjb250ZW50LXR5cGUnOiAnJywgJ2NvbnRlbnQtbGVuZ3RoJzogcmVzcG9uc2VCb2R5Lmxlbmd0aCB9LFxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJ2h0dHBzJykucmVxdWVzdChyZXF1ZXN0T3B0aW9ucywgcmVzb2x2ZSk7XG4gICAgICAgIHJlcXVlc3Qub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgICAgcmVxdWVzdC53cml0ZShyZXNwb25zZUJvZHkpO1xuICAgICAgICByZXF1ZXN0LmVuZCgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVJldHJ5T3B0aW9ucyhyYXdPcHRpb25zOiBhbnkpOiBTZGtSZXRyeU9wdGlvbnMge1xuICAgIGNvbnN0IHJldHJ5T3B0aW9uczogU2RrUmV0cnlPcHRpb25zID0ge307XG4gICAgaWYgKHJhd09wdGlvbnMpIHtcbiAgICAgIGlmIChyYXdPcHRpb25zLm1heFJldHJpZXMpIHtcbiAgICAgICAgcmV0cnlPcHRpb25zLm1heFJldHJpZXMgPSBwYXJzZUludChyYXdPcHRpb25zLm1heFJldHJpZXMsIDEwKTtcbiAgICAgIH1cbiAgICAgIGlmIChyYXdPcHRpb25zLmJhc2UpIHtcbiAgICAgICAgcmV0cnlPcHRpb25zLnJldHJ5T3B0aW9ucyA9IHtcbiAgICAgICAgICBiYXNlOiBwYXJzZUludChyYXdPcHRpb25zLmJhc2UsIDEwKSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldHJ5T3B0aW9ucztcbiAgfVxufVxuIl19