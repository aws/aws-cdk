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
/**
 * Tags and untags a log group. This includes adding new tags and updating existing tags.
 *
 * @param logGroupName the name of the log group to create
 * @param tags the tags to propagate to the log group
 * @param region the region of the log group
 * @param options CloudWatch API SDK options
 */
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
            if (Object.keys(tagsToSet).length > 0) {
                await cloudwatchlogs.tagLogGroup({ logGroupName, tags: tagsToSet }).promise();
            }
            if (tagsToDelete.length > 0) {
                await cloudwatchlogs.untagLogGroup({ logGroupName, tags: tagsToDelete }).promise();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7QUFFL0IsNkRBQTZEO0FBQzdELCtCQUErQjtBQVMvQjs7Ozs7O0dBTUc7QUFDSCxLQUFLLFVBQVUsa0JBQWtCLENBQUMsWUFBb0IsRUFBRSxNQUFlLEVBQUUsT0FBeUI7SUFDaEcsNEVBQTRFO0lBQzVFLDRFQUE0RTtJQUM1RSw2RUFBNkU7SUFDN0UsNEVBQTRFO0lBQzVFLG1DQUFtQztJQUNuQyx1REFBdUQ7SUFDdkQsSUFBSSxVQUFVLEdBQUcsT0FBTyxFQUFFLFVBQVUsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztJQUM1RSxNQUFNLEtBQUssR0FBRyxPQUFPLEVBQUUsWUFBWSxFQUFFLElBQUksSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7SUFDeEYsR0FBRztRQUNELElBQUk7WUFDRixNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDaEcsTUFBTSxjQUFjLENBQUMsY0FBYyxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNoRSxPQUFPO1NBQ1I7UUFBQyxPQUFPLEtBQVUsRUFBRTtZQUNuQixJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssZ0NBQWdDLEVBQUU7Z0JBQ25ELDJEQUEyRDtnQkFDM0QsT0FBTzthQUNSO1lBQ0QsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLDJCQUEyQixFQUFFO2dCQUM5QyxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7b0JBQ2xCLFVBQVUsRUFB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QUFDO2FBQzFEO1NBQ0YsQ0FBQztRQUVGLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsSUFBSTtnQkFDRixpRUFBaUU7Z0JBQ2pFLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNsRSxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDNUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDNUIsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO2FBQ2Y7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDWDtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFNBQVMsaUJBQWlCLENBQUMsVUFBZTtRQUN4QyxNQUFNLFlBQVksR0FBb0IsRUFBRSxDQUFDO1FBQ3pDLElBQUksVUFBVSxFQUFFO1lBQ2QsSUFBSSxVQUFVLENBQUMsVUFBVSxFQUFFO2dCQUN6QixZQUFZLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQy9EO1lBQ0QsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFO2dCQUNuQixZQUFZLENBQUMsWUFBWSxHQUFHO29CQUMxQixJQUFJLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO2lCQUNwQyxDQUFDO2FBQ0g7U0FDRjtRQUNELE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7QUFDSCxDQUFDO0FBeEdELDBCQXdHQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0ICogYXMgQVdTIGZyb20gJ2F3cy1zZGsnO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHR5cGUgeyBSZXRyeURlbGF5T3B0aW9ucyB9IGZyb20gJ2F3cy1zZGsvbGliL2NvbmZpZy1iYXNlJztcblxuaW50ZXJmYWNlIFNka1JldHJ5T3B0aW9ucyB7XG4gIG1heFJldHJpZXM/OiBudW1iZXI7XG4gIHJldHJ5T3B0aW9ucz86IFJldHJ5RGVsYXlPcHRpb25zO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBsb2cgZ3JvdXAgYW5kIGRvZXNuJ3QgdGhyb3cgaWYgaXQgZXhpc3RzLlxuICpcbiAqIEBwYXJhbSBsb2dHcm91cE5hbWUgdGhlIG5hbWUgb2YgdGhlIGxvZyBncm91cCB0byBjcmVhdGUuXG4gKiBAcGFyYW0gcmVnaW9uIHRvIGNyZWF0ZSB0aGUgbG9nIGdyb3VwIGluXG4gKiBAcGFyYW0gb3B0aW9ucyBDbG91ZFdhdGNoIEFQSSBTREsgb3B0aW9ucy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gY3JlYXRlTG9nR3JvdXBTYWZlKGxvZ0dyb3VwTmFtZTogc3RyaW5nLCByZWdpb24/OiBzdHJpbmcsIG9wdGlvbnM/OiBTZGtSZXRyeU9wdGlvbnMpIHtcbiAgLy8gSWYgd2Ugc2V0IHRoZSBsb2cgcmV0ZW50aW9uIGZvciBhIGxhbWJkYSwgdGhlbiBkdWUgdG8gdGhlIGFzeW5jIG5hdHVyZSBvZlxuICAvLyBMYW1iZGEgbG9nZ2luZyB0aGVyZSBjb3VsZCBiZSBhIHJhY2UgY29uZGl0aW9uIHdoZW4gdGhlIHNhbWUgbG9nIGdyb3VwIGlzXG4gIC8vIGFscmVhZHkgYmVpbmcgY3JlYXRlZCBieSB0aGUgbGFtYmRhIGV4ZWN1dGlvbi4gVGhpcyBjYW4gc29tZXRpbWUgcmVzdWx0IGluXG4gIC8vIGFuIGVycm9yIFwiT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbjogQSBjb25mbGljdGluZyBvcGVyYXRpb24gaXMgY3VycmVudGx5XG4gIC8vIGluIHByb2dyZXNzLi4uUGxlYXNlIHRyeSBhZ2Fpbi5cIlxuICAvLyBUbyBhdm9pZCBhbiBlcnJvciwgd2UgZG8gYXMgcmVxdWVzdGVkIGFuZCB0cnkgYWdhaW4uXG4gIGxldCByZXRyeUNvdW50ID0gb3B0aW9ucz8ubWF4UmV0cmllcyA9PSB1bmRlZmluZWQgPyAxMCA6IG9wdGlvbnMubWF4UmV0cmllcztcbiAgY29uc3QgZGVsYXkgPSBvcHRpb25zPy5yZXRyeU9wdGlvbnM/LmJhc2UgPT0gdW5kZWZpbmVkID8gMTAgOiBvcHRpb25zLnJldHJ5T3B0aW9ucy5iYXNlO1xuICBkbyB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNsb3Vkd2F0Y2hsb2dzID0gbmV3IEFXUy5DbG91ZFdhdGNoTG9ncyh7IGFwaVZlcnNpb246ICcyMDE0LTAzLTI4JywgcmVnaW9uLCAuLi5vcHRpb25zIH0pO1xuICAgICAgYXdhaXQgY2xvdWR3YXRjaGxvZ3MuY3JlYXRlTG9nR3JvdXAoeyBsb2dHcm91cE5hbWUgfSkucHJvbWlzZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnUmVzb3VyY2VBbHJlYWR5RXhpc3RzRXhjZXB0aW9uJykge1xuICAgICAgICAvLyBUaGUgbG9nIGdyb3VwIGlzIGFscmVhZHkgY3JlYXRlZCBieSB0aGUgbGFtYmRhIGV4ZWN1dGlvblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoZXJyb3IuY29kZSA9PT0gJ09wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb24nKSB7XG4gICAgICAgIGlmIChyZXRyeUNvdW50ID4gMCkge1xuICAgICAgICAgIHJldHJ5Q291bnQtLTtcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUaGUgbG9nIGdyb3VwIGlzIHN0aWxsIGJlaW5nIGNyZWF0ZWQgYnkgYW5vdGhlciBleGVjdXRpb24gYnV0IHdlIGFyZSBvdXQgb2YgcmV0cmllc1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignT3V0IG9mIGF0dGVtcHRzIHRvIGNyZWF0ZSBhIGxvZ0dyb3VwJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSB3aGlsZSAodHJ1ZSk7IC8vIGV4aXQgaGFwcGVucyBvbiByZXRyeSBjb3VudCBjaGVja1xufVxuXG4vL2RlbGV0ZSBhIGxvZyBncm91cFxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlTG9nR3JvdXAobG9nR3JvdXBOYW1lOiBzdHJpbmcsIHJlZ2lvbj86IHN0cmluZywgb3B0aW9ucz86IFNka1JldHJ5T3B0aW9ucykge1xuICBsZXQgcmV0cnlDb3VudCA9IG9wdGlvbnM/Lm1heFJldHJpZXMgPT0gdW5kZWZpbmVkID8gMTAgOiBvcHRpb25zLm1heFJldHJpZXM7XG4gIGNvbnN0IGRlbGF5ID0gb3B0aW9ucz8ucmV0cnlPcHRpb25zPy5iYXNlID09IHVuZGVmaW5lZCA/IDEwIDogb3B0aW9ucy5yZXRyeU9wdGlvbnMuYmFzZTtcbiAgZG8ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjbG91ZHdhdGNobG9ncyA9IG5ldyBBV1MuQ2xvdWRXYXRjaExvZ3MoeyBhcGlWZXJzaW9uOiAnMjAxNC0wMy0yOCcsIHJlZ2lvbiwgLi4ub3B0aW9ucyB9KTtcbiAgICAgIGF3YWl0IGNsb3Vkd2F0Y2hsb2dzLmRlbGV0ZUxvZ0dyb3VwKHsgbG9nR3JvdXBOYW1lIH0pLnByb21pc2UoKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBpZiAoZXJyb3IuY29kZSA9PT0gJ1Jlc291cmNlTm90Rm91bmRFeGNlcHRpb24nKSB7XG4gICAgICAgIC8vIFRoZSBsb2cgZ3JvdXAgZG9lc24ndCBleGlzdFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoZXJyb3IuY29kZSA9PT0gJ09wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb24nKSB7XG4gICAgICAgIGlmIChyZXRyeUNvdW50ID4gMCkge1xuICAgICAgICAgIHJldHJ5Q291bnQtLTtcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUaGUgbG9nIGdyb3VwIGlzIHN0aWxsIGJlaW5nIGRlbGV0ZWQgYnkgYW5vdGhlciBleGVjdXRpb24gYnV0IHdlIGFyZSBvdXQgb2YgcmV0cmllc1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignT3V0IG9mIGF0dGVtcHRzIHRvIGRlbGV0ZSBhIGxvZ0dyb3VwJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSB3aGlsZSAodHJ1ZSk7IC8vIGV4aXQgaGFwcGVucyBvbiByZXRyeSBjb3VudCBjaGVja1xufVxuXG4vKipcbiAqIFB1dHMgb3IgZGVsZXRlcyBhIHJldGVudGlvbiBwb2xpY3kgb24gYSBsb2cgZ3JvdXAuXG4gKlxuICogQHBhcmFtIGxvZ0dyb3VwTmFtZSB0aGUgbmFtZSBvZiB0aGUgbG9nIGdyb3VwIHRvIGNyZWF0ZVxuICogQHBhcmFtIHJlZ2lvbiB0aGUgcmVnaW9uIG9mIHRoZSBsb2cgZ3JvdXBcbiAqIEBwYXJhbSBvcHRpb25zIENsb3VkV2F0Y2ggQVBJIFNESyBvcHRpb25zLlxuICogQHBhcmFtIHJldGVudGlvbkluRGF5cyB0aGUgbnVtYmVyIG9mIGRheXMgdG8gcmV0YWluIHRoZSBsb2cgZXZlbnRzIGluIHRoZSBzcGVjaWZpZWQgbG9nIGdyb3VwLlxuICovXG5hc3luYyBmdW5jdGlvbiBzZXRSZXRlbnRpb25Qb2xpY3kobG9nR3JvdXBOYW1lOiBzdHJpbmcsIHJlZ2lvbj86IHN0cmluZywgb3B0aW9ucz86IFNka1JldHJ5T3B0aW9ucywgcmV0ZW50aW9uSW5EYXlzPzogbnVtYmVyKSB7XG4gIC8vIFRoZSBzYW1lIGFzIGluIGNyZWF0ZUxvZ0dyb3VwU2FmZSgpLCBoZXJlIHdlIGNvdWxkIGVuZCB1cCB3aXRoIHRoZSByYWNlXG4gIC8vIGNvbmRpdGlvbiB3aGVyZSBhIGxvZyBncm91cCBpcyBlaXRoZXIgYWxyZWFkeSBiZWluZyBjcmVhdGVkIG9yIGl0cyByZXRlbnRpb25cbiAgLy8gcG9saWN5IGlzIGJlaW5nIHVwZGF0ZWQuIFRoaXMgd291bGQgcmVzdWx0IGluIGFuIE9wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb24sXG4gIC8vIHdoaWNoIHdlIHdpbGwgdHJ5IHRvIGNhdGNoIGFuZCByZXRyeSB0aGUgY29tbWFuZCBhIG51bWJlciBvZiB0aW1lcyBiZWZvcmUgZmFpbGluZ1xuICBsZXQgcmV0cnlDb3VudCA9IG9wdGlvbnM/Lm1heFJldHJpZXMgPT0gdW5kZWZpbmVkID8gMTAgOiBvcHRpb25zLm1heFJldHJpZXM7XG4gIGNvbnN0IGRlbGF5ID0gb3B0aW9ucz8ucmV0cnlPcHRpb25zPy5iYXNlID09IHVuZGVmaW5lZCA/IDEwIDogb3B0aW9ucy5yZXRyeU9wdGlvbnMuYmFzZTtcbiAgZG8ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjbG91ZHdhdGNobG9ncyA9IG5ldyBBV1MuQ2xvdWRXYXRjaExvZ3MoeyBhcGlWZXJzaW9uOiAnMjAxNC0wMy0yOCcsIHJlZ2lvbiwgLi4ub3B0aW9ucyB9KTtcbiAgICAgIGlmICghcmV0ZW50aW9uSW5EYXlzKSB7XG4gICAgICAgIGF3YWl0IGNsb3Vkd2F0Y2hsb2dzLmRlbGV0ZVJldGVudGlvblBvbGljeSh7IGxvZ0dyb3VwTmFtZSB9KS5wcm9taXNlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhd2FpdCBjbG91ZHdhdGNobG9ncy5wdXRSZXRlbnRpb25Qb2xpY3koeyBsb2dHcm91cE5hbWUsIHJldGVudGlvbkluRGF5cyB9KS5wcm9taXNlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG5cbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBpZiAoZXJyb3IuY29kZSA9PT0gJ09wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb24nKSB7XG4gICAgICAgIGlmIChyZXRyeUNvdW50ID4gMCkge1xuICAgICAgICAgIHJldHJ5Q291bnQtLTtcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUaGUgbG9nIGdyb3VwIGlzIHN0aWxsIGJlaW5nIGNyZWF0ZWQgYnkgYW5vdGhlciBleGVjdXRpb24gYnV0IHdlIGFyZSBvdXQgb2YgcmV0cmllc1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignT3V0IG9mIGF0dGVtcHRzIHRvIGNyZWF0ZSBhIGxvZ0dyb3VwJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSB3aGlsZSAodHJ1ZSk7IC8vIGV4aXQgaGFwcGVucyBvbiByZXRyeSBjb3VudCBjaGVja1xufVxuXG4vKipcbiAqIFRhZ3MgYW5kIHVudGFncyBhIGxvZyBncm91cC4gVGhpcyBpbmNsdWRlcyBhZGRpbmcgbmV3IHRhZ3MgYW5kIHVwZGF0aW5nIGV4aXN0aW5nIHRhZ3MuXG4gKlxuICogQHBhcmFtIGxvZ0dyb3VwTmFtZSB0aGUgbmFtZSBvZiB0aGUgbG9nIGdyb3VwIHRvIGNyZWF0ZVxuICogQHBhcmFtIHRhZ3MgdGhlIHRhZ3MgdG8gcHJvcGFnYXRlIHRvIHRoZSBsb2cgZ3JvdXBcbiAqIEBwYXJhbSByZWdpb24gdGhlIHJlZ2lvbiBvZiB0aGUgbG9nIGdyb3VwXG4gKiBAcGFyYW0gb3B0aW9ucyBDbG91ZFdhdGNoIEFQSSBTREsgb3B0aW9uc1xuICovXG5hc3luYyBmdW5jdGlvbiBzZXRMb2dHcm91cFRhZ3MobG9nR3JvdXBOYW1lOiBzdHJpbmcsIHRhZ3M6IEFXUy5DbG91ZFdhdGNoTG9ncy5UYWdzW10sIHJlZ2lvbj86IHN0cmluZywgb3B0aW9ucz86IFNka1JldHJ5T3B0aW9ucykge1xuICAvLyBUaGUgc2FtZSBhcyBpbiBjcmVhdGVMb2dHcm91cFNhZmUoKSwgaGVyZSB3ZSBjb3VsZCBlbmQgdXAgd2l0aCB0aGUgcmFjZVxuICAvLyBjb25kaXRpb24gd2hlcmUgYSBsb2cgZ3JvdXAgaXMgZWl0aGVyIGFscmVhZHkgYmVpbmcgY3JlYXRlZCBvciBpdHMgcmV0ZW50aW9uXG4gIC8vIHBvbGljeSBpcyBiZWluZyB1cGRhdGVkLiBUaGlzIHdvdWxkIHJlc3VsdCBpbiBhbiBPcGVyYXRpb25BYm9ydGVkRXhjZXB0aW9uLFxuICAvLyB3aGljaCB3ZSB3aWxsIHRyeSB0byBjYXRjaCBhbmQgcmV0cnkgdGhlIGNvbW1hbmQgYSBudW1iZXIgb2YgdGltZXMgYmVmb3JlIGZhaWxpbmdcbiAgbGV0IHJldHJ5Q291bnQgPSBvcHRpb25zPy5tYXhSZXRyaWVzID09IHVuZGVmaW5lZCA/IDEwIDogb3B0aW9ucy5tYXhSZXRyaWVzO1xuICBjb25zdCBkZWxheSA9IG9wdGlvbnM/LnJldHJ5T3B0aW9ucz8uYmFzZSA9PSB1bmRlZmluZWQgPyAxMCA6IG9wdGlvbnMucmV0cnlPcHRpb25zLmJhc2U7XG4gIGRvIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY2xvdWR3YXRjaGxvZ3MgPSBuZXcgQVdTLkNsb3VkV2F0Y2hMb2dzKHsgYXBpVmVyc2lvbjogJzIwMTQtMDMtMjgnLCByZWdpb24sIC4uLm9wdGlvbnMgfSk7XG4gICAgICBjb25zdCB0YWdzT25Mb2dHcm91cCA9IGF3YWl0IGNsb3Vkd2F0Y2hsb2dzLmxpc3RUYWdzTG9nR3JvdXAoeyBsb2dHcm91cE5hbWUgfSkucHJvbWlzZSgpO1xuXG4gICAgICBjb25zdCB0YWdzVG9TZXQ6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcbiAgICAgIGNvbnN0IHRhZ3NLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgaWYgKHRhZ3NPbkxvZ0dyb3VwLnRhZ3MpIHtcbiAgICAgICAgZm9yIChjb25zdCB0YWcgb2YgdGFncykge1xuICAgICAgICAgIGlmICh0YWdzT25Mb2dHcm91cC50YWdzW3RhZy5LZXldID09PSB1bmRlZmluZWQgfHwgdGFnc09uTG9nR3JvdXAudGFnc1t0YWcuS2V5XSAhPT0gdGFnLlZhbHVlKSB7XG4gICAgICAgICAgICB0YWdzVG9TZXRbdGFnLktleV0gPSB0YWcuVmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRhZ3NLZXlzLnB1c2godGFnLktleSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgdGFnc1RvRGVsZXRlID0gdGFnc09uTG9nR3JvdXAudGFnc1xuICAgICAgICA/IE9iamVjdC5rZXlzKHRhZ3NPbkxvZ0dyb3VwLnRhZ3MpLmZpbHRlcih0YWcgPT4gIXRhZ3NLZXlzLmluY2x1ZGVzKHRhZykpXG4gICAgICAgIDogW107XG5cbiAgICAgIGlmIChPYmplY3Qua2V5cyh0YWdzVG9TZXQpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXdhaXQgY2xvdWR3YXRjaGxvZ3MudGFnTG9nR3JvdXAoeyBsb2dHcm91cE5hbWUsIHRhZ3M6IHRhZ3NUb1NldCB9KS5wcm9taXNlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0YWdzVG9EZWxldGUubGVuZ3RoID4gMCkge1xuICAgICAgICBhd2FpdCBjbG91ZHdhdGNobG9ncy51bnRhZ0xvZ0dyb3VwKHsgbG9nR3JvdXBOYW1lLCB0YWdzOiB0YWdzVG9EZWxldGUgfSkucHJvbWlzZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgaWYgKGVycm9yLmNvZGUgPT09ICdPcGVyYXRpb25BYm9ydGVkRXhjZXB0aW9uJykge1xuICAgICAgICBpZiAocmV0cnlDb3VudCA+IDApIHtcbiAgICAgICAgICByZXRyeUNvdW50LS07XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVGhlIGxvZyBncm91cCBpcyBzdGlsbCBiZWluZyBjcmVhdGVkIGJ5IGFub3RoZXIgZXhlY3V0aW9uIGJ1dCB3ZSBhcmUgb3V0IG9mIHJldHJpZXNcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ091dCBvZiBhdHRlbXB0cyB0byBjcmVhdGUgYSBsb2dHcm91cCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH0gd2hpbGUgKHRydWUpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCwgY29udGV4dDogQVdTTGFtYmRhLkNvbnRleHQpIHtcbiAgdHJ5IHtcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh7IC4uLmV2ZW50LCBSZXNwb25zZVVSTDogJy4uLicgfSkpO1xuXG4gICAgLy8gVGhlIHRhcmdldCBsb2cgZ3JvdXBcbiAgICBjb25zdCBsb2dHcm91cE5hbWUgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuTG9nR3JvdXBOYW1lO1xuXG4gICAgLy8gVGhlIHJlZ2lvbiBvZiB0aGUgdGFyZ2V0IGxvZyBncm91cFxuICAgIGNvbnN0IGxvZ0dyb3VwUmVnaW9uID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkxvZ0dyb3VwUmVnaW9uO1xuXG4gICAgLy8gUGFyc2UgdG8gQVdTIFNESyByZXRyeSBvcHRpb25zXG4gICAgY29uc3QgcmV0cnlPcHRpb25zID0gcGFyc2VSZXRyeU9wdGlvbnMoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlNka1JldHJ5KTtcblxuICAgIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0NyZWF0ZScgfHwgZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdVcGRhdGUnKSB7XG4gICAgICAvLyBBY3Qgb24gdGhlIHRhcmdldCBsb2cgZ3JvdXBcbiAgICAgIGF3YWl0IGNyZWF0ZUxvZ0dyb3VwU2FmZShsb2dHcm91cE5hbWUsIGxvZ0dyb3VwUmVnaW9uLCByZXRyeU9wdGlvbnMpO1xuICAgICAgYXdhaXQgc2V0UmV0ZW50aW9uUG9saWN5KGxvZ0dyb3VwTmFtZSwgbG9nR3JvdXBSZWdpb24sIHJldHJ5T3B0aW9ucywgcGFyc2VJbnQoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlJldGVudGlvbkluRGF5cywgMTApKTtcbiAgICAgIGlmIChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuVGFncyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGF3YWl0IHNldExvZ0dyb3VwVGFncyhsb2dHcm91cE5hbWUsIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5UYWdzLCBsb2dHcm91cFJlZ2lvbiwgcmV0cnlPcHRpb25zKTtcbiAgICAgIH1cblxuICAgICAgLy8gcHJvcGFnYXRlIHRhZ3MgdG8gY3VzdG9tIHJlc291cmNlIGxvZ3NcbiAgICAgIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0NyZWF0ZScpIHtcbiAgICAgICAgLy8gU2V0IGEgcmV0ZW50aW9uIHBvbGljeSBvZiAxIGRheSBvbiB0aGUgbG9ncyBvZiB0aGlzIHZlcnkgZnVuY3Rpb24uXG4gICAgICAgIC8vIER1ZSB0byB0aGUgYXN5bmMgbmF0dXJlIG9mIHRoZSBsb2cgZ3JvdXAgY3JlYXRpb24sIHRoZSBsb2cgZ3JvdXAgZm9yIHRoaXMgZnVuY3Rpb24gbWlnaHRcbiAgICAgICAgLy8gc3RpbGwgYmUgbm90IGNyZWF0ZWQgeWV0IGF0IHRoaXMgcG9pbnQuIFRoZXJlZm9yZSB3ZSBhdHRlbXB0IHRvIGNyZWF0ZSBpdC5cbiAgICAgICAgLy8gSW4gY2FzZSBpdCBpcyBiZWluZyBjcmVhdGVkLCBjcmVhdGVMb2dHcm91cFNhZmUgd2lsbCBoYW5kbGUgdGhlIGNvbmZsaWN0LlxuICAgICAgICBjb25zdCByZWdpb24gPSBwcm9jZXNzLmVudi5BV1NfUkVHSU9OO1xuICAgICAgICBhd2FpdCBjcmVhdGVMb2dHcm91cFNhZmUoYC9hd3MvbGFtYmRhLyR7Y29udGV4dC5mdW5jdGlvbk5hbWV9YCwgcmVnaW9uLCByZXRyeU9wdGlvbnMpO1xuICAgICAgICAvLyBJZiBjcmVhdGVMb2dHcm91cFNhZmUgZmFpbHMsIHRoZSBsb2cgZ3JvdXAgaXMgbm90IGNyZWF0ZWQgZXZlbiBhZnRlciBtdWx0aXBsZSBhdHRlbXB0cy5cbiAgICAgICAgLy8gSW4gdGhpcyBjYXNlIHdlIGhhdmUgbm90aGluZyB0byBzZXQgdGhlIHJldGVudGlvbiBwb2xpY3kgb24gYnV0IGFuIGV4Y2VwdGlvbiB3aWxsIHNraXBcbiAgICAgICAgLy8gdGhlIG5leHQgbGluZS5cbiAgICAgICAgYXdhaXQgc2V0UmV0ZW50aW9uUG9saWN5KGAvYXdzL2xhbWJkYS8ke2NvbnRleHQuZnVuY3Rpb25OYW1lfWAsIHJlZ2lvbiwgcmV0cnlPcHRpb25zLCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL1doZW4gdGhlIHJlcXVlc3RUeXBlIGlzIGRlbGV0ZSwgZGVsZXRlIHRoZSBsb2cgZ3JvdXAgaWYgdGhlIHJlbW92YWwgcG9saWN5IGlzIGRlbGV0ZVxuICAgIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0RlbGV0ZScgJiYgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlJlbW92YWxQb2xpY3kgPT09ICdkZXN0cm95Jykge1xuICAgICAgYXdhaXQgZGVsZXRlTG9nR3JvdXAobG9nR3JvdXBOYW1lLCBsb2dHcm91cFJlZ2lvbiwgcmV0cnlPcHRpb25zKTtcbiAgICAgIC8vZWxzZSByZXRhaW4gdGhlIGxvZyBncm91cFxuICAgIH1cblxuICAgIGF3YWl0IHJlc3BvbmQoJ1NVQ0NFU1MnLCAnT0snLCBsb2dHcm91cE5hbWUpO1xuICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZyhlKTtcblxuICAgIGF3YWl0IHJlc3BvbmQoJ0ZBSUxFRCcsIGUubWVzc2FnZSwgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkxvZ0dyb3VwTmFtZSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNwb25kKHJlc3BvbnNlU3RhdHVzOiBzdHJpbmcsIHJlYXNvbjogc3RyaW5nLCBwaHlzaWNhbFJlc291cmNlSWQ6IHN0cmluZykge1xuICAgIGNvbnN0IHJlc3BvbnNlQm9keSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIFN0YXR1czogcmVzcG9uc2VTdGF0dXMsXG4gICAgICBSZWFzb246IHJlYXNvbixcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogcGh5c2ljYWxSZXNvdXJjZUlkLFxuICAgICAgU3RhY2tJZDogZXZlbnQuU3RhY2tJZCxcbiAgICAgIFJlcXVlc3RJZDogZXZlbnQuUmVxdWVzdElkLFxuICAgICAgTG9naWNhbFJlc291cmNlSWQ6IGV2ZW50LkxvZ2ljYWxSZXNvdXJjZUlkLFxuICAgICAgRGF0YToge1xuICAgICAgICAvLyBBZGQgbG9nIGdyb3VwIG5hbWUgYXMgcGFydCBvZiB0aGUgcmVzcG9uc2Ugc28gdGhhdCBpdCdzIGF2YWlsYWJsZSB2aWEgRm46OkdldEF0dFxuICAgICAgICBMb2dHcm91cE5hbWU6IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Mb2dHcm91cE5hbWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc29sZS5sb2coJ1Jlc3BvbmRpbmcnLCByZXNwb25zZUJvZHkpO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcbiAgICBjb25zdCBwYXJzZWRVcmwgPSByZXF1aXJlKCd1cmwnKS5wYXJzZShldmVudC5SZXNwb25zZVVSTCk7XG4gICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICBob3N0bmFtZTogcGFyc2VkVXJsLmhvc3RuYW1lLFxuICAgICAgcGF0aDogcGFyc2VkVXJsLnBhdGgsXG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnY29udGVudC10eXBlJzogJycsXG4gICAgICAgICdjb250ZW50LWxlbmd0aCc6IEJ1ZmZlci5ieXRlTGVuZ3RoKHJlc3BvbnNlQm9keSwgJ3V0ZjgnKSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xuICAgICAgICBjb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgnaHR0cHMnKS5yZXF1ZXN0KHJlcXVlc3RPcHRpb25zLCByZXNvbHZlKTtcbiAgICAgICAgcmVxdWVzdC5vbignZXJyb3InLCByZWplY3QpO1xuICAgICAgICByZXF1ZXN0LndyaXRlKHJlc3BvbnNlQm9keSk7XG4gICAgICAgIHJlcXVlc3QuZW5kKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlUmV0cnlPcHRpb25zKHJhd09wdGlvbnM6IGFueSk6IFNka1JldHJ5T3B0aW9ucyB7XG4gICAgY29uc3QgcmV0cnlPcHRpb25zOiBTZGtSZXRyeU9wdGlvbnMgPSB7fTtcbiAgICBpZiAocmF3T3B0aW9ucykge1xuICAgICAgaWYgKHJhd09wdGlvbnMubWF4UmV0cmllcykge1xuICAgICAgICByZXRyeU9wdGlvbnMubWF4UmV0cmllcyA9IHBhcnNlSW50KHJhd09wdGlvbnMubWF4UmV0cmllcywgMTApO1xuICAgICAgfVxuICAgICAgaWYgKHJhd09wdGlvbnMuYmFzZSkge1xuICAgICAgICByZXRyeU9wdGlvbnMucmV0cnlPcHRpb25zID0ge1xuICAgICAgICAgIGJhc2U6IHBhcnNlSW50KHJhd09wdGlvbnMuYmFzZSwgMTApLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0cnlPcHRpb25zO1xuICB9XG59XG4iXX0=