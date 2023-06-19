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
async function setLogGroupTags(logGroupName, tags, region, options) {
    // The same as in createLogGroupSafe(), here we could end up with the race
    // condition where a log group is either already being created or its retention
    // policy is being updated. This would result in an OperationAbortedException,
    // which we will try to catch and retry the command a number of times before failing
    let retryCount = options?.maxRetries == undefined ? 10 : options.maxRetries;
    const delay = options?.retryOptions?.base == undefined ? 10 : options.retryOptions.base;
    do {
        try {
            const cloudwatchlogs = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28', region, ...options });
            const tagsOnLogGroup = await cloudwatchlogs.listTagsLogGroup({ logGroupName }).promise();
            const tagsToSet = {};
            const tagsKeys = [];
            if (tagsOnLogGroup.tags) {
                for (const tag of tags) {
                    if (tagsOnLogGroup.tags[tag.Key] === undefined || tagsOnLogGroup.tags[tag.Key] !== tag.Value) {
                        tagsToSet[tag.Key] = tag.Value;
                    }
                    tagsKeys.push(tag.Key);
                }
            }
            const tagsToDelete = tagsOnLogGroup.tags
                ? Object.keys(tagsOnLogGroup.tags).filter(tag => !tagsKeys.includes(tag))
                : [];
            console.log('tagsToDelete = ', tagsToDelete);
            if (Object.keys(tagsToSet).length > 0) {
                await cloudwatchlogs.tagLogGroup({ logGroupName, tags: tagsToSet }).promise();
            }
            await cloudwatchlogs.untagLogGroup({ logGroupName, tags: tagsToDelete }).promise();
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
    } while (true);
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
            if (event.ResourceProperties.Tags !== undefined) {
                await setLogGroupTags(logGroupName, event.ResourceProperties.Tags, logGroupRegion, retryOptions);
            }
            // propagate tags to custom resource logs
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7QUFFL0IsNkRBQTZEO0FBQzdELCtCQUErQjtBQVMvQjs7Ozs7O0dBTUc7QUFDSCxLQUFLLFVBQVUsa0JBQWtCLENBQUMsWUFBb0IsRUFBRSxNQUFlLEVBQUUsT0FBeUI7SUFDaEcsNEVBQTRFO0lBQzVFLDRFQUE0RTtJQUM1RSw2RUFBNkU7SUFDN0UsNEVBQTRFO0lBQzVFLG1DQUFtQztJQUNuQyx1REFBdUQ7SUFDdkQsSUFBSSxVQUFVLEdBQUcsT0FBTyxFQUFFLFVBQVUsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztJQUM1RSxNQUFNLEtBQUssR0FBRyxPQUFPLEVBQUUsWUFBWSxFQUFFLElBQUksSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7SUFDeEYsR0FBRztRQUNELElBQUk7WUFDRixNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDaEcsTUFBTSxjQUFjLENBQUMsY0FBYyxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNoRSxPQUFPO1NBQ1I7UUFBQyxPQUFPLEtBQVUsRUFBRTtZQUNuQixJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssZ0NBQWdDLEVBQUU7Z0JBQ25ELDJEQUEyRDtnQkFDM0QsT0FBTzthQUNSO1lBQ0QsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLDJCQUEyQixFQUFFO2dCQUM5QyxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7b0JBQ2xCLFVBQVUsRUFB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U0FDRixDQUFDO1FBRUYsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNyQyxJQUFJO2dCQUNGLGlFQUFpRTtnQkFDakUsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ2xFLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUM1QixPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDZjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNYO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsU0FBUyxpQkFBaUIsQ0FBQyxVQUFlO1FBQ3hDLE1BQU0sWUFBWSxHQUFvQixFQUFFLENBQUM7UUFDekMsSUFBSSxVQUFVLEVBQUU7WUFDZCxJQUFJLFVBQVUsQ0FBQyxVQUFVLEVBQUU7Z0JBQ3pCLFlBQVksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDL0Q7WUFDRCxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7Z0JBQ25CLFlBQVksQ0FBQyxZQUFZLEdBQUc7b0JBQzFCLElBQUksRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUM7aUJBQ3BDLENBQUM7YUFDSDtTQUNGO1FBQ0QsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztBQUNILENBQUM7QUF4R0QsMEJBd0dDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgKiBhcyBBV1MgZnJvbSAnYXdzLXNkayc7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgdHlwZSB7IFJldHJ5RGVsYXlPcHRpb25zIH0gZnJvbSAnYXdzLXNkay9saWIvY29uZmlnLWJhc2UnO1xuXG5pbnRlcmZhY2UgU2RrUmV0cnlPcHRpb25zIHtcbiAgbWF4UmV0cmllcz86IG51bWJlcjtcbiAgcmV0cnlPcHRpb25zPzogUmV0cnlEZWxheU9wdGlvbnM7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGxvZyBncm91cCBhbmQgZG9lc24ndCB0aHJvdyBpZiBpdCBleGlzdHMuXG4gKlxuICogQHBhcmFtIGxvZ0dyb3VwTmFtZSB0aGUgbmFtZSBvZiB0aGUgbG9nIGdyb3VwIHRvIGNyZWF0ZS5cbiAqIEBwYXJhbSByZWdpb24gdG8gY3JlYXRlIHRoZSBsb2cgZ3JvdXAgaW5cbiAqIEBwYXJhbSBvcHRpb25zIENsb3VkV2F0Y2ggQVBJIFNESyBvcHRpb25zLlxuICovXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVMb2dHcm91cFNhZmUobG9nR3JvdXBOYW1lOiBzdHJpbmcsIHJlZ2lvbj86IHN0cmluZywgb3B0aW9ucz86IFNka1JldHJ5T3B0aW9ucykge1xuICAvLyBJZiB3ZSBzZXQgdGhlIGxvZyByZXRlbnRpb24gZm9yIGEgbGFtYmRhLCB0aGVuIGR1ZSB0byB0aGUgYXN5bmMgbmF0dXJlIG9mXG4gIC8vIExhbWJkYSBsb2dnaW5nIHRoZXJlIGNvdWxkIGJlIGEgcmFjZSBjb25kaXRpb24gd2hlbiB0aGUgc2FtZSBsb2cgZ3JvdXAgaXNcbiAgLy8gYWxyZWFkeSBiZWluZyBjcmVhdGVkIGJ5IHRoZSBsYW1iZGEgZXhlY3V0aW9uLiBUaGlzIGNhbiBzb21ldGltZSByZXN1bHQgaW5cbiAgLy8gYW4gZXJyb3IgXCJPcGVyYXRpb25BYm9ydGVkRXhjZXB0aW9uOiBBIGNvbmZsaWN0aW5nIG9wZXJhdGlvbiBpcyBjdXJyZW50bHlcbiAgLy8gaW4gcHJvZ3Jlc3MuLi5QbGVhc2UgdHJ5IGFnYWluLlwiXG4gIC8vIFRvIGF2b2lkIGFuIGVycm9yLCB3ZSBkbyBhcyByZXF1ZXN0ZWQgYW5kIHRyeSBhZ2Fpbi5cbiAgbGV0IHJldHJ5Q291bnQgPSBvcHRpb25zPy5tYXhSZXRyaWVzID09IHVuZGVmaW5lZCA/IDEwIDogb3B0aW9ucy5tYXhSZXRyaWVzO1xuICBjb25zdCBkZWxheSA9IG9wdGlvbnM/LnJldHJ5T3B0aW9ucz8uYmFzZSA9PSB1bmRlZmluZWQgPyAxMCA6IG9wdGlvbnMucmV0cnlPcHRpb25zLmJhc2U7XG4gIGRvIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY2xvdWR3YXRjaGxvZ3MgPSBuZXcgQVdTLkNsb3VkV2F0Y2hMb2dzKHsgYXBpVmVyc2lvbjogJzIwMTQtMDMtMjgnLCByZWdpb24sIC4uLm9wdGlvbnMgfSk7XG4gICAgICBhd2FpdCBjbG91ZHdhdGNobG9ncy5jcmVhdGVMb2dHcm91cCh7IGxvZ0dyb3VwTmFtZSB9KS5wcm9taXNlKCk7XG4gICAgICByZXR1cm47XG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgaWYgKGVycm9yLmNvZGUgPT09ICdSZXNvdXJjZUFscmVhZHlFeGlzdHNFeGNlcHRpb24nKSB7XG4gICAgICAgIC8vIFRoZSBsb2cgZ3JvdXAgaXMgYWxyZWFkeSBjcmVhdGVkIGJ5IHRoZSBsYW1iZGEgZXhlY3V0aW9uXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgaWYgKHJldHJ5Q291bnQgPiAwKSB7XG4gICAgICAgICAgcmV0cnlDb3VudC0tO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFRoZSBsb2cgZ3JvdXAgaXMgc3RpbGwgYmVpbmcgY3JlYXRlZCBieSBhbm90aGVyIGV4ZWN1dGlvbiBidXQgd2UgYXJlIG91dCBvZiByZXRyaWVzXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPdXQgb2YgYXR0ZW1wdHMgdG8gY3JlYXRlIGEgbG9nR3JvdXAnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9IHdoaWxlICh0cnVlKTsgLy8gZXhpdCBoYXBwZW5zIG9uIHJldHJ5IGNvdW50IGNoZWNrXG59XG5cbi8vZGVsZXRlIGEgbG9nIGdyb3VwXG5hc3luYyBmdW5jdGlvbiBkZWxldGVMb2dHcm91cChsb2dHcm91cE5hbWU6IHN0cmluZywgcmVnaW9uPzogc3RyaW5nLCBvcHRpb25zPzogU2RrUmV0cnlPcHRpb25zKSB7XG4gIGxldCByZXRyeUNvdW50ID0gb3B0aW9ucz8ubWF4UmV0cmllcyA9PSB1bmRlZmluZWQgPyAxMCA6IG9wdGlvbnMubWF4UmV0cmllcztcbiAgY29uc3QgZGVsYXkgPSBvcHRpb25zPy5yZXRyeU9wdGlvbnM/LmJhc2UgPT0gdW5kZWZpbmVkID8gMTAgOiBvcHRpb25zLnJldHJ5T3B0aW9ucy5iYXNlO1xuICBkbyB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNsb3Vkd2F0Y2hsb2dzID0gbmV3IEFXUy5DbG91ZFdhdGNoTG9ncyh7IGFwaVZlcnNpb246ICcyMDE0LTAzLTI4JywgcmVnaW9uLCAuLi5vcHRpb25zIH0pO1xuICAgICAgYXdhaXQgY2xvdWR3YXRjaGxvZ3MuZGVsZXRlTG9nR3JvdXAoeyBsb2dHcm91cE5hbWUgfSkucHJvbWlzZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgLy8gVGhlIGxvZyBncm91cCBkb2Vzbid0IGV4aXN0XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgaWYgKHJldHJ5Q291bnQgPiAwKSB7XG4gICAgICAgICAgcmV0cnlDb3VudC0tO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFRoZSBsb2cgZ3JvdXAgaXMgc3RpbGwgYmVpbmcgZGVsZXRlZCBieSBhbm90aGVyIGV4ZWN1dGlvbiBidXQgd2UgYXJlIG91dCBvZiByZXRyaWVzXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPdXQgb2YgYXR0ZW1wdHMgdG8gZGVsZXRlIGEgbG9nR3JvdXAnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9IHdoaWxlICh0cnVlKTsgLy8gZXhpdCBoYXBwZW5zIG9uIHJldHJ5IGNvdW50IGNoZWNrXG59XG5cbi8qKlxuICogUHV0cyBvciBkZWxldGVzIGEgcmV0ZW50aW9uIHBvbGljeSBvbiBhIGxvZyBncm91cC5cbiAqXG4gKiBAcGFyYW0gbG9nR3JvdXBOYW1lIHRoZSBuYW1lIG9mIHRoZSBsb2cgZ3JvdXAgdG8gY3JlYXRlXG4gKiBAcGFyYW0gcmVnaW9uIHRoZSByZWdpb24gb2YgdGhlIGxvZyBncm91cFxuICogQHBhcmFtIG9wdGlvbnMgQ2xvdWRXYXRjaCBBUEkgU0RLIG9wdGlvbnMuXG4gKiBAcGFyYW0gcmV0ZW50aW9uSW5EYXlzIHRoZSBudW1iZXIgb2YgZGF5cyB0byByZXRhaW4gdGhlIGxvZyBldmVudHMgaW4gdGhlIHNwZWNpZmllZCBsb2cgZ3JvdXAuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHNldFJldGVudGlvblBvbGljeShsb2dHcm91cE5hbWU6IHN0cmluZywgcmVnaW9uPzogc3RyaW5nLCBvcHRpb25zPzogU2RrUmV0cnlPcHRpb25zLCByZXRlbnRpb25JbkRheXM/OiBudW1iZXIpIHtcbiAgLy8gVGhlIHNhbWUgYXMgaW4gY3JlYXRlTG9nR3JvdXBTYWZlKCksIGhlcmUgd2UgY291bGQgZW5kIHVwIHdpdGggdGhlIHJhY2VcbiAgLy8gY29uZGl0aW9uIHdoZXJlIGEgbG9nIGdyb3VwIGlzIGVpdGhlciBhbHJlYWR5IGJlaW5nIGNyZWF0ZWQgb3IgaXRzIHJldGVudGlvblxuICAvLyBwb2xpY3kgaXMgYmVpbmcgdXBkYXRlZC4gVGhpcyB3b3VsZCByZXN1bHQgaW4gYW4gT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbixcbiAgLy8gd2hpY2ggd2Ugd2lsbCB0cnkgdG8gY2F0Y2ggYW5kIHJldHJ5IHRoZSBjb21tYW5kIGEgbnVtYmVyIG9mIHRpbWVzIGJlZm9yZSBmYWlsaW5nXG4gIGxldCByZXRyeUNvdW50ID0gb3B0aW9ucz8ubWF4UmV0cmllcyA9PSB1bmRlZmluZWQgPyAxMCA6IG9wdGlvbnMubWF4UmV0cmllcztcbiAgY29uc3QgZGVsYXkgPSBvcHRpb25zPy5yZXRyeU9wdGlvbnM/LmJhc2UgPT0gdW5kZWZpbmVkID8gMTAgOiBvcHRpb25zLnJldHJ5T3B0aW9ucy5iYXNlO1xuICBkbyB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNsb3Vkd2F0Y2hsb2dzID0gbmV3IEFXUy5DbG91ZFdhdGNoTG9ncyh7IGFwaVZlcnNpb246ICcyMDE0LTAzLTI4JywgcmVnaW9uLCAuLi5vcHRpb25zIH0pO1xuICAgICAgaWYgKCFyZXRlbnRpb25JbkRheXMpIHtcbiAgICAgICAgYXdhaXQgY2xvdWR3YXRjaGxvZ3MuZGVsZXRlUmV0ZW50aW9uUG9saWN5KHsgbG9nR3JvdXBOYW1lIH0pLnByb21pc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IGNsb3Vkd2F0Y2hsb2dzLnB1dFJldGVudGlvblBvbGljeSh7IGxvZ0dyb3VwTmFtZSwgcmV0ZW50aW9uSW5EYXlzIH0pLnByb21pc2UoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcblxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgaWYgKHJldHJ5Q291bnQgPiAwKSB7XG4gICAgICAgICAgcmV0cnlDb3VudC0tO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFRoZSBsb2cgZ3JvdXAgaXMgc3RpbGwgYmVpbmcgY3JlYXRlZCBieSBhbm90aGVyIGV4ZWN1dGlvbiBidXQgd2UgYXJlIG91dCBvZiByZXRyaWVzXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPdXQgb2YgYXR0ZW1wdHMgdG8gY3JlYXRlIGEgbG9nR3JvdXAnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9IHdoaWxlICh0cnVlKTsgLy8gZXhpdCBoYXBwZW5zIG9uIHJldHJ5IGNvdW50IGNoZWNrXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNldExvZ0dyb3VwVGFncyhsb2dHcm91cE5hbWU6IHN0cmluZywgdGFnczogQVdTLkNsb3VkV2F0Y2hMb2dzLlRhZ3NbXSwgcmVnaW9uPzogc3RyaW5nLCBvcHRpb25zPzogU2RrUmV0cnlPcHRpb25zKSB7XG4gIC8vIFRoZSBzYW1lIGFzIGluIGNyZWF0ZUxvZ0dyb3VwU2FmZSgpLCBoZXJlIHdlIGNvdWxkIGVuZCB1cCB3aXRoIHRoZSByYWNlXG4gIC8vIGNvbmRpdGlvbiB3aGVyZSBhIGxvZyBncm91cCBpcyBlaXRoZXIgYWxyZWFkeSBiZWluZyBjcmVhdGVkIG9yIGl0cyByZXRlbnRpb25cbiAgLy8gcG9saWN5IGlzIGJlaW5nIHVwZGF0ZWQuIFRoaXMgd291bGQgcmVzdWx0IGluIGFuIE9wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb24sXG4gIC8vIHdoaWNoIHdlIHdpbGwgdHJ5IHRvIGNhdGNoIGFuZCByZXRyeSB0aGUgY29tbWFuZCBhIG51bWJlciBvZiB0aW1lcyBiZWZvcmUgZmFpbGluZ1xuICBsZXQgcmV0cnlDb3VudCA9IG9wdGlvbnM/Lm1heFJldHJpZXMgPT0gdW5kZWZpbmVkID8gMTAgOiBvcHRpb25zLm1heFJldHJpZXM7XG4gIGNvbnN0IGRlbGF5ID0gb3B0aW9ucz8ucmV0cnlPcHRpb25zPy5iYXNlID09IHVuZGVmaW5lZCA/IDEwIDogb3B0aW9ucy5yZXRyeU9wdGlvbnMuYmFzZTtcbiAgZG8ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjbG91ZHdhdGNobG9ncyA9IG5ldyBBV1MuQ2xvdWRXYXRjaExvZ3MoeyBhcGlWZXJzaW9uOiAnMjAxNC0wMy0yOCcsIHJlZ2lvbiwgLi4ub3B0aW9ucyB9KTtcbiAgICAgIGNvbnN0IHRhZ3NPbkxvZ0dyb3VwID0gYXdhaXQgY2xvdWR3YXRjaGxvZ3MubGlzdFRhZ3NMb2dHcm91cCh7IGxvZ0dyb3VwTmFtZSB9KS5wcm9taXNlKCk7XG5cbiAgICAgIGNvbnN0IHRhZ3NUb1NldDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICAgICAgY29uc3QgdGFnc0tleXM6IHN0cmluZ1tdID0gW107XG4gICAgICBpZiAodGFnc09uTG9nR3JvdXAudGFncykge1xuICAgICAgICBmb3IgKGNvbnN0IHRhZyBvZiB0YWdzKSB7XG4gICAgICAgICAgaWYgKHRhZ3NPbkxvZ0dyb3VwLnRhZ3NbdGFnLktleV0gPT09IHVuZGVmaW5lZCB8fCB0YWdzT25Mb2dHcm91cC50YWdzW3RhZy5LZXldICE9PSB0YWcuVmFsdWUpIHtcbiAgICAgICAgICAgIHRhZ3NUb1NldFt0YWcuS2V5XSA9IHRhZy5WYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGFnc0tleXMucHVzaCh0YWcuS2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCB0YWdzVG9EZWxldGUgPSB0YWdzT25Mb2dHcm91cC50YWdzXG4gICAgICAgID8gT2JqZWN0LmtleXModGFnc09uTG9nR3JvdXAudGFncykuZmlsdGVyKHRhZyA9PiAhdGFnc0tleXMuaW5jbHVkZXModGFnKSlcbiAgICAgICAgOiBbXTtcbiAgICAgIGNvbnNvbGUubG9nKCd0YWdzVG9EZWxldGUgPSAnLCB0YWdzVG9EZWxldGUpO1xuXG4gICAgICBpZiAoT2JqZWN0LmtleXModGFnc1RvU2V0KS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGF3YWl0IGNsb3Vkd2F0Y2hsb2dzLnRhZ0xvZ0dyb3VwKHsgbG9nR3JvdXBOYW1lLCB0YWdzOiB0YWdzVG9TZXQgfSkucHJvbWlzZSgpO1xuICAgICAgfVxuICAgICAgYXdhaXQgY2xvdWR3YXRjaGxvZ3MudW50YWdMb2dHcm91cCh7IGxvZ0dyb3VwTmFtZSwgdGFnczogdGFnc1RvRGVsZXRlIH0pLnByb21pc2UoKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBpZiAoZXJyb3IuY29kZSA9PT0gJ09wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb24nKSB7XG4gICAgICAgIGlmIChyZXRyeUNvdW50ID4gMCkge1xuICAgICAgICAgIHJldHJ5Q291bnQtLTtcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUaGUgbG9nIGdyb3VwIGlzIHN0aWxsIGJlaW5nIGNyZWF0ZWQgYnkgYW5vdGhlciBleGVjdXRpb24gYnV0IHdlIGFyZSBvdXQgb2YgcmV0cmllc1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignT3V0IG9mIGF0dGVtcHRzIHRvIGNyZWF0ZSBhIGxvZ0dyb3VwJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSB3aGlsZSAodHJ1ZSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50LCBjb250ZXh0OiBBV1NMYW1iZGEuQ29udGV4dCkge1xuICB0cnkge1xuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHsgLi4uZXZlbnQsIFJlc3BvbnNlVVJMOiAnLi4uJyB9KSk7XG5cbiAgICAvLyBUaGUgdGFyZ2V0IGxvZyBncm91cFxuICAgIGNvbnN0IGxvZ0dyb3VwTmFtZSA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Mb2dHcm91cE5hbWU7XG5cbiAgICAvLyBUaGUgcmVnaW9uIG9mIHRoZSB0YXJnZXQgbG9nIGdyb3VwXG4gICAgY29uc3QgbG9nR3JvdXBSZWdpb24gPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuTG9nR3JvdXBSZWdpb247XG5cbiAgICAvLyBQYXJzZSB0byBBV1MgU0RLIHJldHJ5IG9wdGlvbnNcbiAgICBjb25zdCByZXRyeU9wdGlvbnMgPSBwYXJzZVJldHJ5T3B0aW9ucyhldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuU2RrUmV0cnkpO1xuXG4gICAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJyB8fCBldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ1VwZGF0ZScpIHtcbiAgICAgIC8vIEFjdCBvbiB0aGUgdGFyZ2V0IGxvZyBncm91cFxuICAgICAgYXdhaXQgY3JlYXRlTG9nR3JvdXBTYWZlKGxvZ0dyb3VwTmFtZSwgbG9nR3JvdXBSZWdpb24sIHJldHJ5T3B0aW9ucyk7XG4gICAgICBhd2FpdCBzZXRSZXRlbnRpb25Qb2xpY3kobG9nR3JvdXBOYW1lLCBsb2dHcm91cFJlZ2lvbiwgcmV0cnlPcHRpb25zLCBwYXJzZUludChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuUmV0ZW50aW9uSW5EYXlzLCAxMCkpO1xuICAgICAgaWYgKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5UYWdzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYXdhaXQgc2V0TG9nR3JvdXBUYWdzKGxvZ0dyb3VwTmFtZSwgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlRhZ3MsIGxvZ0dyb3VwUmVnaW9uLCByZXRyeU9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICAvLyBwcm9wYWdhdGUgdGFncyB0byBjdXN0b20gcmVzb3VyY2UgbG9nc1xuICAgICAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJykge1xuICAgICAgICAvLyBTZXQgYSByZXRlbnRpb24gcG9saWN5IG9mIDEgZGF5IG9uIHRoZSBsb2dzIG9mIHRoaXMgdmVyeSBmdW5jdGlvbi5cbiAgICAgICAgLy8gRHVlIHRvIHRoZSBhc3luYyBuYXR1cmUgb2YgdGhlIGxvZyBncm91cCBjcmVhdGlvbiwgdGhlIGxvZyBncm91cCBmb3IgdGhpcyBmdW5jdGlvbiBtaWdodFxuICAgICAgICAvLyBzdGlsbCBiZSBub3QgY3JlYXRlZCB5ZXQgYXQgdGhpcyBwb2ludC4gVGhlcmVmb3JlIHdlIGF0dGVtcHQgdG8gY3JlYXRlIGl0LlxuICAgICAgICAvLyBJbiBjYXNlIGl0IGlzIGJlaW5nIGNyZWF0ZWQsIGNyZWF0ZUxvZ0dyb3VwU2FmZSB3aWxsIGhhbmRsZSB0aGUgY29uZmxpY3QuXG4gICAgICAgIGNvbnN0IHJlZ2lvbiA9IHByb2Nlc3MuZW52LkFXU19SRUdJT047XG4gICAgICAgIGF3YWl0IGNyZWF0ZUxvZ0dyb3VwU2FmZShgL2F3cy9sYW1iZGEvJHtjb250ZXh0LmZ1bmN0aW9uTmFtZX1gLCByZWdpb24sIHJldHJ5T3B0aW9ucyk7XG4gICAgICAgIC8vIElmIGNyZWF0ZUxvZ0dyb3VwU2FmZSBmYWlscywgdGhlIGxvZyBncm91cCBpcyBub3QgY3JlYXRlZCBldmVuIGFmdGVyIG11bHRpcGxlIGF0dGVtcHRzLlxuICAgICAgICAvLyBJbiB0aGlzIGNhc2Ugd2UgaGF2ZSBub3RoaW5nIHRvIHNldCB0aGUgcmV0ZW50aW9uIHBvbGljeSBvbiBidXQgYW4gZXhjZXB0aW9uIHdpbGwgc2tpcFxuICAgICAgICAvLyB0aGUgbmV4dCBsaW5lLlxuICAgICAgICBhd2FpdCBzZXRSZXRlbnRpb25Qb2xpY3koYC9hd3MvbGFtYmRhLyR7Y29udGV4dC5mdW5jdGlvbk5hbWV9YCwgcmVnaW9uLCByZXRyeU9wdGlvbnMsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vV2hlbiB0aGUgcmVxdWVzdFR5cGUgaXMgZGVsZXRlLCBkZWxldGUgdGhlIGxvZyBncm91cCBpZiB0aGUgcmVtb3ZhbCBwb2xpY3kgaXMgZGVsZXRlXG4gICAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnRGVsZXRlJyAmJiBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuUmVtb3ZhbFBvbGljeSA9PT0gJ2Rlc3Ryb3knKSB7XG4gICAgICBhd2FpdCBkZWxldGVMb2dHcm91cChsb2dHcm91cE5hbWUsIGxvZ0dyb3VwUmVnaW9uLCByZXRyeU9wdGlvbnMpO1xuICAgICAgLy9lbHNlIHJldGFpbiB0aGUgbG9nIGdyb3VwXG4gICAgfVxuXG4gICAgYXdhaXQgcmVzcG9uZCgnU1VDQ0VTUycsICdPSycsIGxvZ0dyb3VwTmFtZSk7XG4gIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgIGNvbnNvbGUubG9nKGUpO1xuXG4gICAgYXdhaXQgcmVzcG9uZCgnRkFJTEVEJywgZS5tZXNzYWdlLCBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuTG9nR3JvdXBOYW1lKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc3BvbmQocmVzcG9uc2VTdGF0dXM6IHN0cmluZywgcmVhc29uOiBzdHJpbmcsIHBoeXNpY2FsUmVzb3VyY2VJZDogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzcG9uc2VCb2R5ID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgU3RhdHVzOiByZXNwb25zZVN0YXR1cyxcbiAgICAgIFJlYXNvbjogcmVhc29uLFxuICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBwaHlzaWNhbFJlc291cmNlSWQsXG4gICAgICBTdGFja0lkOiBldmVudC5TdGFja0lkLFxuICAgICAgUmVxdWVzdElkOiBldmVudC5SZXF1ZXN0SWQsXG4gICAgICBMb2dpY2FsUmVzb3VyY2VJZDogZXZlbnQuTG9naWNhbFJlc291cmNlSWQsXG4gICAgICBEYXRhOiB7XG4gICAgICAgIC8vIEFkZCBsb2cgZ3JvdXAgbmFtZSBhcyBwYXJ0IG9mIHRoZSByZXNwb25zZSBzbyB0aGF0IGl0J3MgYXZhaWxhYmxlIHZpYSBGbjo6R2V0QXR0XG4gICAgICAgIExvZ0dyb3VwTmFtZTogZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkxvZ0dyb3VwTmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZygnUmVzcG9uZGluZycsIHJlc3BvbnNlQm9keSk7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xuICAgIGNvbnN0IHBhcnNlZFVybCA9IHJlcXVpcmUoJ3VybCcpLnBhcnNlKGV2ZW50LlJlc3BvbnNlVVJMKTtcbiAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IHtcbiAgICAgIGhvc3RuYW1lOiBwYXJzZWRVcmwuaG9zdG5hbWUsXG4gICAgICBwYXRoOiBwYXJzZWRVcmwucGF0aCxcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdjb250ZW50LXR5cGUnOiAnJyxcbiAgICAgICAgJ2NvbnRlbnQtbGVuZ3RoJzogQnVmZmVyLmJ5dGVMZW5ndGgocmVzcG9uc2VCb2R5LCAndXRmOCcpLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSByZXF1aXJlKCdodHRwcycpLnJlcXVlc3QocmVxdWVzdE9wdGlvbnMsIHJlc29sdmUpO1xuICAgICAgICByZXF1ZXN0Lm9uKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICAgIHJlcXVlc3Qud3JpdGUocmVzcG9uc2VCb2R5KTtcbiAgICAgICAgcmVxdWVzdC5lbmQoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VSZXRyeU9wdGlvbnMocmF3T3B0aW9uczogYW55KTogU2RrUmV0cnlPcHRpb25zIHtcbiAgICBjb25zdCByZXRyeU9wdGlvbnM6IFNka1JldHJ5T3B0aW9ucyA9IHt9O1xuICAgIGlmIChyYXdPcHRpb25zKSB7XG4gICAgICBpZiAocmF3T3B0aW9ucy5tYXhSZXRyaWVzKSB7XG4gICAgICAgIHJldHJ5T3B0aW9ucy5tYXhSZXRyaWVzID0gcGFyc2VJbnQocmF3T3B0aW9ucy5tYXhSZXRyaWVzLCAxMCk7XG4gICAgICB9XG4gICAgICBpZiAocmF3T3B0aW9ucy5iYXNlKSB7XG4gICAgICAgIHJldHJ5T3B0aW9ucy5yZXRyeU9wdGlvbnMgPSB7XG4gICAgICAgICAgYmFzZTogcGFyc2VJbnQocmF3T3B0aW9ucy5iYXNlLCAxMCksXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXRyeU9wdGlvbnM7XG4gIH1cbn1cbiJdfQ==