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
    let retryCount = options?.maxRetries === undefined ? 10 : options.maxRetries;
    const delay = options?.retryOptions?.base === undefined ? 10 : options.retryOptions.base;
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
    let retryCount = options?.maxRetries === undefined ? 10 : options.maxRetries;
    const delay = options?.retryOptions?.base === undefined ? 10 : options.retryOptions.base;
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
    let retryCount = options?.maxRetries === undefined ? 10 : options.maxRetries;
    const delay = options?.retryOptions?.base === undefined ? 10 : options.retryOptions.base;
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
 * @param logGroupArn the ARN of the log group to create
 * @param tags the tags to propagate to the log group
 * @param region the region of the log group
 * @param options CloudWatch API SDK options
 */
async function setLogGroupTags(logGroupArn, tags, region, options) {
    // The same as in createLogGroupSafe(), here we could end up with the race
    // condition where a log group is either already being created or its retention
    // policy is being updated. This would result in an OperationAbortedException,
    // which we will try to catch and retry the command a number of times before failing
    let retryCount = options?.maxRetries === undefined ? 10 : options.maxRetries;
    const delay = options?.retryOptions?.base === undefined ? 10 : options.retryOptions.base;
    do {
        try {
            console.log('logGroupArn = ', logGroupArn);
            const cloudwatchlogs = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28', region, ...options });
            const tagsOnLogGroup = (await cloudwatchlogs.listTagsForResource({ resourceArn: logGroupArn }).promise()).tags ?? {};
            const tagsToSet = {};
            const tagKeys = [];
            for (const tag of tags) {
                if (tagsOnLogGroup[tag.Key] === undefined || tagsOnLogGroup[tag.Key] !== tag.Value) {
                    tagsToSet[tag.Key] = tag.Value;
                }
                tagKeys.push(tag.Key);
            }
            const tagsToDelete = tagsOnLogGroup
                ? Object.keys(tagsOnLogGroup).filter(tag => !tagKeys.includes(tag))
                : [];
            const tagsToSetLength = Object.keys(tagsToSet).length;
            // tagResource throws if tags has no key-value pairs and we can only set up to 50 tags
            if (tagsToSetLength > 0 && tagsToSetLength <= 50) {
                await cloudwatchlogs.tagResource({ resourceArn: logGroupArn, tags: tagsToSet }).promise();
            }
            // untagResource throws if tagKeys is empty
            if (tagsToDelete.length > 0) {
                await cloudwatchlogs.untagResource({ resourceArn: logGroupArn, tagKeys: tagsToDelete }).promise();
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
        // The ARN of the target log group
        const logGroupArn = event.ResourceProperties.LogGroupArn;
        // The region of the target log group
        const logGroupRegion = event.ResourceProperties.LogGroupRegion;
        // Parse to AWS SDK retry options
        const retryOptions = parseRetryOptions(event.ResourceProperties.SdkRetry);
        if (event.RequestType === 'Create' || event.RequestType === 'Update') {
            // Act on the target log group
            await createLogGroupSafe(logGroupName, logGroupRegion, retryOptions);
            await setRetentionPolicy(logGroupName, logGroupRegion, retryOptions, parseInt(event.ResourceProperties.RetentionInDays, 10));
            if (event.ResourceProperties.PropagateTags === 'true') {
                await setLogGroupTags(logGroupArn, event.ResourceProperties.Tags ?? [], logGroupRegion, retryOptions);
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7QUFFL0IsNkRBQTZEO0FBQzdELCtCQUErQjtBQVMvQjs7Ozs7O0dBTUc7QUFDSCxLQUFLLFVBQVUsa0JBQWtCLENBQUMsWUFBb0IsRUFBRSxNQUFlLEVBQUUsT0FBeUI7SUFDaEcsNEVBQTRFO0lBQzVFLDRFQUE0RTtJQUM1RSw2RUFBNkU7SUFDN0UsNEVBQTRFO0lBQzVFLG1DQUFtQztJQUNuQyx1REFBdUQ7SUFDdkQsSUFBSSxVQUFVLEdBQUcsT0FBTyxFQUFFLFVBQVUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztJQUM3RSxNQUFNLEtBQUssR0FBRyxPQUFPLEVBQUUsWUFBWSxFQUFFLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7SUFDekYsR0FBRztRQUNELElBQUk7WUFDRixNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDaEcsTUFBTSxjQUFjLENBQUMsY0FBYyxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNoRSxPQUFPO1NBQ1I7UUFBQyxPQUFPLEtBQVUsRUFBRTtZQUNuQixJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssZ0NBQWdDLEVBQUU7Z0JBQ25ELDJEQUEyRDtnQkFDM0QsT0FBTzthQUNSO1lBQ0QsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLDJCQUEyQixFQUFFO2dCQUM5QyxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7b0JBQ2xCLFVBQVUsRUFB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RCxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDO0FBQ0gsQ0FBQztBQTFHRCwwQkEwR0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCAqIGFzIEFXUyBmcm9tICdhd3Mtc2RrJztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB0eXBlIHsgUmV0cnlEZWxheU9wdGlvbnMgfSBmcm9tICdhd3Mtc2RrL2xpYi9jb25maWctYmFzZSc7XG5cbmludGVyZmFjZSBTZGtSZXRyeU9wdGlvbnMge1xuICBtYXhSZXRyaWVzPzogbnVtYmVyO1xuICByZXRyeU9wdGlvbnM/OiBSZXRyeURlbGF5T3B0aW9ucztcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbG9nIGdyb3VwIGFuZCBkb2Vzbid0IHRocm93IGlmIGl0IGV4aXN0cy5cbiAqXG4gKiBAcGFyYW0gbG9nR3JvdXBOYW1lIHRoZSBuYW1lIG9mIHRoZSBsb2cgZ3JvdXAgdG8gY3JlYXRlLlxuICogQHBhcmFtIHJlZ2lvbiB0byBjcmVhdGUgdGhlIGxvZyBncm91cCBpblxuICogQHBhcmFtIG9wdGlvbnMgQ2xvdWRXYXRjaCBBUEkgU0RLIG9wdGlvbnMuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUxvZ0dyb3VwU2FmZShsb2dHcm91cE5hbWU6IHN0cmluZywgcmVnaW9uPzogc3RyaW5nLCBvcHRpb25zPzogU2RrUmV0cnlPcHRpb25zKSB7XG4gIC8vIElmIHdlIHNldCB0aGUgbG9nIHJldGVudGlvbiBmb3IgYSBsYW1iZGEsIHRoZW4gZHVlIHRvIHRoZSBhc3luYyBuYXR1cmUgb2ZcbiAgLy8gTGFtYmRhIGxvZ2dpbmcgdGhlcmUgY291bGQgYmUgYSByYWNlIGNvbmRpdGlvbiB3aGVuIHRoZSBzYW1lIGxvZyBncm91cCBpc1xuICAvLyBhbHJlYWR5IGJlaW5nIGNyZWF0ZWQgYnkgdGhlIGxhbWJkYSBleGVjdXRpb24uIFRoaXMgY2FuIHNvbWV0aW1lIHJlc3VsdCBpblxuICAvLyBhbiBlcnJvciBcIk9wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb246IEEgY29uZmxpY3Rpbmcgb3BlcmF0aW9uIGlzIGN1cnJlbnRseVxuICAvLyBpbiBwcm9ncmVzcy4uLlBsZWFzZSB0cnkgYWdhaW4uXCJcbiAgLy8gVG8gYXZvaWQgYW4gZXJyb3IsIHdlIGRvIGFzIHJlcXVlc3RlZCBhbmQgdHJ5IGFnYWluLlxuICBsZXQgcmV0cnlDb3VudCA9IG9wdGlvbnM/Lm1heFJldHJpZXMgPT09IHVuZGVmaW5lZCA/IDEwIDogb3B0aW9ucy5tYXhSZXRyaWVzO1xuICBjb25zdCBkZWxheSA9IG9wdGlvbnM/LnJldHJ5T3B0aW9ucz8uYmFzZSA9PT0gdW5kZWZpbmVkID8gMTAgOiBvcHRpb25zLnJldHJ5T3B0aW9ucy5iYXNlO1xuICBkbyB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNsb3Vkd2F0Y2hsb2dzID0gbmV3IEFXUy5DbG91ZFdhdGNoTG9ncyh7IGFwaVZlcnNpb246ICcyMDE0LTAzLTI4JywgcmVnaW9uLCAuLi5vcHRpb25zIH0pO1xuICAgICAgYXdhaXQgY2xvdWR3YXRjaGxvZ3MuY3JlYXRlTG9nR3JvdXAoeyBsb2dHcm91cE5hbWUgfSkucHJvbWlzZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnUmVzb3VyY2VBbHJlYWR5RXhpc3RzRXhjZXB0aW9uJykge1xuICAgICAgICAvLyBUaGUgbG9nIGdyb3VwIGlzIGFscmVhZHkgY3JlYXRlZCBieSB0aGUgbGFtYmRhIGV4ZWN1dGlvblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoZXJyb3IuY29kZSA9PT0gJ09wZXJhdGlvbkFib3J0ZWRFeGNlcHRpb24nKSB7XG4gICAgICAgIGlmIChyZXRyeUNvdW50ID4gMCkge1xuICAgICAgICAgIHJldHJ5Q291bnQtLTtcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUaGUgbG9nIGdyb3VwIGlzIHN0aWxsIGJlaW5nIGNyZWF0ZWQgYnkgYW5vdGhlciBleGVjdXRpb24gYnV0IHdlIGFyZSBvdXQgb2YgcmV0cmllc1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignT3V0IG9mIGF0dGVtcHRzIHRvIGNyZWF0ZSBhIGxvZ0dyb3VwJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSB3aGlsZSAodHJ1ZSk7IC8vIGV4aXQgaGFwcGVucyBvbiByZXRyeSBjb3VudCBjaGVja1xufVxuXG4vL2RlbGV0ZSBhIGxvZyBncm91cFxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlTG9nR3JvdXAobG9nR3JvdXBOYW1lOiBzdHJpbmcsIHJlZ2lvbj86IHN0cmluZywgb3B0aW9ucz86IFNka1JldHJ5T3B0aW9ucykge1xuICBsZXQgcmV0cnlDb3VudCA9IG9wdGlvbnM/Lm1heFJldHJpZXMgPT09IHVuZGVmaW5lZCA/IDEwIDogb3B0aW9ucy5tYXhSZXRyaWVzO1xuICBjb25zdCBkZWxheSA9IG9wdGlvbnM/LnJldHJ5T3B0aW9ucz8uYmFzZSA9PT0gdW5kZWZpbmVkID8gMTAgOiBvcHRpb25zLnJldHJ5T3B0aW9ucy5iYXNlO1xuICBkbyB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNsb3Vkd2F0Y2hsb2dzID0gbmV3IEFXUy5DbG91ZFdhdGNoTG9ncyh7IGFwaVZlcnNpb246ICcyMDE0LTAzLTI4JywgcmVnaW9uLCAuLi5vcHRpb25zIH0pO1xuICAgICAgYXdhaXQgY2xvdWR3YXRjaGxvZ3MuZGVsZXRlTG9nR3JvdXAoeyBsb2dHcm91cE5hbWUgfSkucHJvbWlzZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgLy8gVGhlIGxvZyBncm91cCBkb2Vzbid0IGV4aXN0XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgaWYgKHJldHJ5Q291bnQgPiAwKSB7XG4gICAgICAgICAgcmV0cnlDb3VudC0tO1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFRoZSBsb2cgZ3JvdXAgaXMgc3RpbGwgYmVpbmcgZGVsZXRlZCBieSBhbm90aGVyIGV4ZWN1dGlvbiBidXQgd2UgYXJlIG91dCBvZiByZXRyaWVzXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPdXQgb2YgYXR0ZW1wdHMgdG8gZGVsZXRlIGEgbG9nR3JvdXAnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9IHdoaWxlICh0cnVlKTsgLy8gZXhpdCBoYXBwZW5zIG9uIHJldHJ5IGNvdW50IGNoZWNrXG59XG5cbi8qKlxuICogUHV0cyBvciBkZWxldGVzIGEgcmV0ZW50aW9uIHBvbGljeSBvbiBhIGxvZyBncm91cC5cbiAqXG4gKiBAcGFyYW0gbG9nR3JvdXBOYW1lIHRoZSBuYW1lIG9mIHRoZSBsb2cgZ3JvdXAgdG8gY3JlYXRlXG4gKiBAcGFyYW0gcmVnaW9uIHRoZSByZWdpb24gb2YgdGhlIGxvZyBncm91cFxuICogQHBhcmFtIG9wdGlvbnMgQ2xvdWRXYXRjaCBBUEkgU0RLIG9wdGlvbnMuXG4gKiBAcGFyYW0gcmV0ZW50aW9uSW5EYXlzIHRoZSBudW1iZXIgb2YgZGF5cyB0byByZXRhaW4gdGhlIGxvZyBldmVudHMgaW4gdGhlIHNwZWNpZmllZCBsb2cgZ3JvdXAuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHNldFJldGVudGlvblBvbGljeShsb2dHcm91cE5hbWU6IHN0cmluZywgcmVnaW9uPzogc3RyaW5nLCBvcHRpb25zPzogU2RrUmV0cnlPcHRpb25zLCByZXRlbnRpb25JbkRheXM/OiBudW1iZXIpIHtcbiAgLy8gVGhlIHNhbWUgYXMgaW4gY3JlYXRlTG9nR3JvdXBTYWZlKCksIGhlcmUgd2UgY291bGQgZW5kIHVwIHdpdGggdGhlIHJhY2VcbiAgLy8gY29uZGl0aW9uIHdoZXJlIGEgbG9nIGdyb3VwIGlzIGVpdGhlciBhbHJlYWR5IGJlaW5nIGNyZWF0ZWQgb3IgaXRzIHJldGVudGlvblxuICAvLyBwb2xpY3kgaXMgYmVpbmcgdXBkYXRlZC4gVGhpcyB3b3VsZCByZXN1bHQgaW4gYW4gT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbixcbiAgLy8gd2hpY2ggd2Ugd2lsbCB0cnkgdG8gY2F0Y2ggYW5kIHJldHJ5IHRoZSBjb21tYW5kIGEgbnVtYmVyIG9mIHRpbWVzIGJlZm9yZSBmYWlsaW5nXG4gIGxldCByZXRyeUNvdW50ID0gb3B0aW9ucz8ubWF4UmV0cmllcyA9PT0gdW5kZWZpbmVkID8gMTAgOiBvcHRpb25zLm1heFJldHJpZXM7XG4gIGNvbnN0IGRlbGF5ID0gb3B0aW9ucz8ucmV0cnlPcHRpb25zPy5iYXNlID09PSB1bmRlZmluZWQgPyAxMCA6IG9wdGlvbnMucmV0cnlPcHRpb25zLmJhc2U7XG4gIGRvIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY2xvdWR3YXRjaGxvZ3MgPSBuZXcgQVdTLkNsb3VkV2F0Y2hMb2dzKHsgYXBpVmVyc2lvbjogJzIwMTQtMDMtMjgnLCByZWdpb24sIC4uLm9wdGlvbnMgfSk7XG4gICAgICBpZiAoIXJldGVudGlvbkluRGF5cykge1xuICAgICAgICBhd2FpdCBjbG91ZHdhdGNobG9ncy5kZWxldGVSZXRlbnRpb25Qb2xpY3koeyBsb2dHcm91cE5hbWUgfSkucHJvbWlzZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXdhaXQgY2xvdWR3YXRjaGxvZ3MucHV0UmV0ZW50aW9uUG9saWN5KHsgbG9nR3JvdXBOYW1lLCByZXRlbnRpb25JbkRheXMgfSkucHJvbWlzZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuXG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgaWYgKGVycm9yLmNvZGUgPT09ICdPcGVyYXRpb25BYm9ydGVkRXhjZXB0aW9uJykge1xuICAgICAgICBpZiAocmV0cnlDb3VudCA+IDApIHtcbiAgICAgICAgICByZXRyeUNvdW50LS07XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVGhlIGxvZyBncm91cCBpcyBzdGlsbCBiZWluZyBjcmVhdGVkIGJ5IGFub3RoZXIgZXhlY3V0aW9uIGJ1dCB3ZSBhcmUgb3V0IG9mIHJldHJpZXNcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ091dCBvZiBhdHRlbXB0cyB0byBjcmVhdGUgYSBsb2dHcm91cCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH0gd2hpbGUgKHRydWUpOyAvLyBleGl0IGhhcHBlbnMgb24gcmV0cnkgY291bnQgY2hlY2tcbn1cblxuLyoqXG4gKiBUYWdzIGFuZCB1bnRhZ3MgYSBsb2cgZ3JvdXAuIFRoaXMgaW5jbHVkZXMgYWRkaW5nIG5ldyB0YWdzIGFuZCB1cGRhdGluZyBleGlzdGluZyB0YWdzLlxuICpcbiAqIEBwYXJhbSBsb2dHcm91cEFybiB0aGUgQVJOIG9mIHRoZSBsb2cgZ3JvdXAgdG8gY3JlYXRlXG4gKiBAcGFyYW0gdGFncyB0aGUgdGFncyB0byBwcm9wYWdhdGUgdG8gdGhlIGxvZyBncm91cFxuICogQHBhcmFtIHJlZ2lvbiB0aGUgcmVnaW9uIG9mIHRoZSBsb2cgZ3JvdXBcbiAqIEBwYXJhbSBvcHRpb25zIENsb3VkV2F0Y2ggQVBJIFNESyBvcHRpb25zXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHNldExvZ0dyb3VwVGFncyhsb2dHcm91cEFybjogc3RyaW5nLCB0YWdzOiBBV1MuQ2xvdWRXYXRjaExvZ3MuVGFnc1tdLCByZWdpb24/OiBzdHJpbmcsIG9wdGlvbnM/OiBTZGtSZXRyeU9wdGlvbnMpIHtcbiAgLy8gVGhlIHNhbWUgYXMgaW4gY3JlYXRlTG9nR3JvdXBTYWZlKCksIGhlcmUgd2UgY291bGQgZW5kIHVwIHdpdGggdGhlIHJhY2VcbiAgLy8gY29uZGl0aW9uIHdoZXJlIGEgbG9nIGdyb3VwIGlzIGVpdGhlciBhbHJlYWR5IGJlaW5nIGNyZWF0ZWQgb3IgaXRzIHJldGVudGlvblxuICAvLyBwb2xpY3kgaXMgYmVpbmcgdXBkYXRlZC4gVGhpcyB3b3VsZCByZXN1bHQgaW4gYW4gT3BlcmF0aW9uQWJvcnRlZEV4Y2VwdGlvbixcbiAgLy8gd2hpY2ggd2Ugd2lsbCB0cnkgdG8gY2F0Y2ggYW5kIHJldHJ5IHRoZSBjb21tYW5kIGEgbnVtYmVyIG9mIHRpbWVzIGJlZm9yZSBmYWlsaW5nXG4gIGxldCByZXRyeUNvdW50ID0gb3B0aW9ucz8ubWF4UmV0cmllcyA9PT0gdW5kZWZpbmVkID8gMTAgOiBvcHRpb25zLm1heFJldHJpZXM7XG4gIGNvbnN0IGRlbGF5ID0gb3B0aW9ucz8ucmV0cnlPcHRpb25zPy5iYXNlID09PSB1bmRlZmluZWQgPyAxMCA6IG9wdGlvbnMucmV0cnlPcHRpb25zLmJhc2U7XG4gIGRvIHtcbiAgICB0cnkge1xuICAgICAgY29uc29sZS5sb2coJ2xvZ0dyb3VwQXJuID0gJywgbG9nR3JvdXBBcm4pO1xuICAgICAgY29uc3QgY2xvdWR3YXRjaGxvZ3MgPSBuZXcgQVdTLkNsb3VkV2F0Y2hMb2dzKHsgYXBpVmVyc2lvbjogJzIwMTQtMDMtMjgnLCByZWdpb24sIC4uLm9wdGlvbnMgfSk7XG4gICAgICBjb25zdCB0YWdzT25Mb2dHcm91cCA9IChhd2FpdCBjbG91ZHdhdGNobG9ncy5saXN0VGFnc0ZvclJlc291cmNlKHsgcmVzb3VyY2VBcm46IGxvZ0dyb3VwQXJuIH0pLnByb21pc2UoKSkudGFncyA/PyB7fTtcblxuICAgICAgY29uc3QgdGFnc1RvU2V0OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gICAgICBjb25zdCB0YWdLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgZm9yIChjb25zdCB0YWcgb2YgdGFncykge1xuICAgICAgICBpZiAodGFnc09uTG9nR3JvdXBbdGFnLktleV0gPT09IHVuZGVmaW5lZCB8fCB0YWdzT25Mb2dHcm91cFt0YWcuS2V5XSAhPT0gdGFnLlZhbHVlKSB7XG4gICAgICAgICAgdGFnc1RvU2V0W3RhZy5LZXldID0gdGFnLlZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHRhZ0tleXMucHVzaCh0YWcuS2V5KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGFnc1RvRGVsZXRlID0gdGFnc09uTG9nR3JvdXBcbiAgICAgICAgPyBPYmplY3Qua2V5cyh0YWdzT25Mb2dHcm91cCkuZmlsdGVyKHRhZyA9PiAhdGFnS2V5cy5pbmNsdWRlcyh0YWcpKVxuICAgICAgICA6IFtdO1xuXG4gICAgICBjb25zdCB0YWdzVG9TZXRMZW5ndGggPSBPYmplY3Qua2V5cyh0YWdzVG9TZXQpLmxlbmd0aDtcbiAgICAgIC8vIHRhZ1Jlc291cmNlIHRocm93cyBpZiB0YWdzIGhhcyBubyBrZXktdmFsdWUgcGFpcnMgYW5kIHdlIGNhbiBvbmx5IHNldCB1cCB0byA1MCB0YWdzXG4gICAgICBpZiAodGFnc1RvU2V0TGVuZ3RoID4gMCAmJiB0YWdzVG9TZXRMZW5ndGggPD0gNTApIHtcbiAgICAgICAgYXdhaXQgY2xvdWR3YXRjaGxvZ3MudGFnUmVzb3VyY2UoeyByZXNvdXJjZUFybjogbG9nR3JvdXBBcm4sIHRhZ3M6IHRhZ3NUb1NldCB9KS5wcm9taXNlKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIHVudGFnUmVzb3VyY2UgdGhyb3dzIGlmIHRhZ0tleXMgaXMgZW1wdHlcbiAgICAgIGlmICh0YWdzVG9EZWxldGUubGVuZ3RoID4gMCkge1xuICAgICAgICBhd2FpdCBjbG91ZHdhdGNobG9ncy51bnRhZ1Jlc291cmNlKHsgcmVzb3VyY2VBcm46IGxvZ0dyb3VwQXJuLCB0YWdLZXlzOiB0YWdzVG9EZWxldGUgfSkucHJvbWlzZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgaWYgKGVycm9yLmNvZGUgPT09ICdPcGVyYXRpb25BYm9ydGVkRXhjZXB0aW9uJykge1xuICAgICAgICBpZiAocmV0cnlDb3VudCA+IDApIHtcbiAgICAgICAgICByZXRyeUNvdW50LS07XG4gICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVGhlIGxvZyBncm91cCBpcyBzdGlsbCBiZWluZyBjcmVhdGVkIGJ5IGFub3RoZXIgZXhlY3V0aW9uIGJ1dCB3ZSBhcmUgb3V0IG9mIHJldHJpZXNcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ091dCBvZiBhdHRlbXB0cyB0byBjcmVhdGUgYSBsb2dHcm91cCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH0gd2hpbGUgKHRydWUpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCwgY29udGV4dDogQVdTTGFtYmRhLkNvbnRleHQpIHtcbiAgdHJ5IHtcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh7IC4uLmV2ZW50LCBSZXNwb25zZVVSTDogJy4uLicgfSkpO1xuXG4gICAgLy8gVGhlIHRhcmdldCBsb2cgZ3JvdXBcbiAgICBjb25zdCBsb2dHcm91cE5hbWUgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuTG9nR3JvdXBOYW1lO1xuXG4gICAgLy8gVGhlIEFSTiBvZiB0aGUgdGFyZ2V0IGxvZyBncm91cFxuICAgIGNvbnN0IGxvZ0dyb3VwQXJuID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkxvZ0dyb3VwQXJuO1xuXG4gICAgLy8gVGhlIHJlZ2lvbiBvZiB0aGUgdGFyZ2V0IGxvZyBncm91cFxuICAgIGNvbnN0IGxvZ0dyb3VwUmVnaW9uID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkxvZ0dyb3VwUmVnaW9uO1xuXG4gICAgLy8gUGFyc2UgdG8gQVdTIFNESyByZXRyeSBvcHRpb25zXG4gICAgY29uc3QgcmV0cnlPcHRpb25zID0gcGFyc2VSZXRyeU9wdGlvbnMoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlNka1JldHJ5KTtcblxuICAgIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0NyZWF0ZScgfHwgZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdVcGRhdGUnKSB7XG4gICAgICAvLyBBY3Qgb24gdGhlIHRhcmdldCBsb2cgZ3JvdXBcbiAgICAgIGF3YWl0IGNyZWF0ZUxvZ0dyb3VwU2FmZShsb2dHcm91cE5hbWUsIGxvZ0dyb3VwUmVnaW9uLCByZXRyeU9wdGlvbnMpO1xuICAgICAgYXdhaXQgc2V0UmV0ZW50aW9uUG9saWN5KGxvZ0dyb3VwTmFtZSwgbG9nR3JvdXBSZWdpb24sIHJldHJ5T3B0aW9ucywgcGFyc2VJbnQoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlJldGVudGlvbkluRGF5cywgMTApKTtcbiAgICAgIGlmIChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuUHJvcGFnYXRlVGFncyA9PT0gJ3RydWUnKSB7XG4gICAgICAgIGF3YWl0IHNldExvZ0dyb3VwVGFncyhsb2dHcm91cEFybiwgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlRhZ3MgPz8gW10sIGxvZ0dyb3VwUmVnaW9uLCByZXRyeU9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdDcmVhdGUnKSB7XG4gICAgICAgIC8vIFNldCBhIHJldGVudGlvbiBwb2xpY3kgb2YgMSBkYXkgb24gdGhlIGxvZ3Mgb2YgdGhpcyB2ZXJ5IGZ1bmN0aW9uLlxuICAgICAgICAvLyBEdWUgdG8gdGhlIGFzeW5jIG5hdHVyZSBvZiB0aGUgbG9nIGdyb3VwIGNyZWF0aW9uLCB0aGUgbG9nIGdyb3VwIGZvciB0aGlzIGZ1bmN0aW9uIG1pZ2h0XG4gICAgICAgIC8vIHN0aWxsIGJlIG5vdCBjcmVhdGVkIHlldCBhdCB0aGlzIHBvaW50LiBUaGVyZWZvcmUgd2UgYXR0ZW1wdCB0byBjcmVhdGUgaXQuXG4gICAgICAgIC8vIEluIGNhc2UgaXQgaXMgYmVpbmcgY3JlYXRlZCwgY3JlYXRlTG9nR3JvdXBTYWZlIHdpbGwgaGFuZGxlIHRoZSBjb25mbGljdC5cbiAgICAgICAgY29uc3QgcmVnaW9uID0gcHJvY2Vzcy5lbnYuQVdTX1JFR0lPTjtcbiAgICAgICAgYXdhaXQgY3JlYXRlTG9nR3JvdXBTYWZlKGAvYXdzL2xhbWJkYS8ke2NvbnRleHQuZnVuY3Rpb25OYW1lfWAsIHJlZ2lvbiwgcmV0cnlPcHRpb25zKTtcbiAgICAgICAgLy8gSWYgY3JlYXRlTG9nR3JvdXBTYWZlIGZhaWxzLCB0aGUgbG9nIGdyb3VwIGlzIG5vdCBjcmVhdGVkIGV2ZW4gYWZ0ZXIgbXVsdGlwbGUgYXR0ZW1wdHMuXG4gICAgICAgIC8vIEluIHRoaXMgY2FzZSB3ZSBoYXZlIG5vdGhpbmcgdG8gc2V0IHRoZSByZXRlbnRpb24gcG9saWN5IG9uIGJ1dCBhbiBleGNlcHRpb24gd2lsbCBza2lwXG4gICAgICAgIC8vIHRoZSBuZXh0IGxpbmUuXG4gICAgICAgIGF3YWl0IHNldFJldGVudGlvblBvbGljeShgL2F3cy9sYW1iZGEvJHtjb250ZXh0LmZ1bmN0aW9uTmFtZX1gLCByZWdpb24sIHJldHJ5T3B0aW9ucywgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9XaGVuIHRoZSByZXF1ZXN0VHlwZSBpcyBkZWxldGUsIGRlbGV0ZSB0aGUgbG9nIGdyb3VwIGlmIHRoZSByZW1vdmFsIHBvbGljeSBpcyBkZWxldGVcbiAgICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdEZWxldGUnICYmIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5SZW1vdmFsUG9saWN5ID09PSAnZGVzdHJveScpIHtcbiAgICAgIGF3YWl0IGRlbGV0ZUxvZ0dyb3VwKGxvZ0dyb3VwTmFtZSwgbG9nR3JvdXBSZWdpb24sIHJldHJ5T3B0aW9ucyk7XG4gICAgICAvL2Vsc2UgcmV0YWluIHRoZSBsb2cgZ3JvdXBcbiAgICB9XG5cbiAgICBhd2FpdCByZXNwb25kKCdTVUNDRVNTJywgJ09LJywgbG9nR3JvdXBOYW1lKTtcbiAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgY29uc29sZS5sb2coZSk7XG5cbiAgICBhd2FpdCByZXNwb25kKCdGQUlMRUQnLCBlLm1lc3NhZ2UsIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Mb2dHcm91cE5hbWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzcG9uZChyZXNwb25zZVN0YXR1czogc3RyaW5nLCByZWFzb246IHN0cmluZywgcGh5c2ljYWxSZXNvdXJjZUlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZXNwb25zZUJvZHkgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBTdGF0dXM6IHJlc3BvbnNlU3RhdHVzLFxuICAgICAgUmVhc29uOiByZWFzb24sXG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IHBoeXNpY2FsUmVzb3VyY2VJZCxcbiAgICAgIFN0YWNrSWQ6IGV2ZW50LlN0YWNrSWQsXG4gICAgICBSZXF1ZXN0SWQ6IGV2ZW50LlJlcXVlc3RJZCxcbiAgICAgIExvZ2ljYWxSZXNvdXJjZUlkOiBldmVudC5Mb2dpY2FsUmVzb3VyY2VJZCxcbiAgICAgIERhdGE6IHtcbiAgICAgICAgLy8gQWRkIGxvZyBncm91cCBuYW1lIGFzIHBhcnQgb2YgdGhlIHJlc3BvbnNlIHNvIHRoYXQgaXQncyBhdmFpbGFibGUgdmlhIEZuOjpHZXRBdHRcbiAgICAgICAgTG9nR3JvdXBOYW1lOiBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuTG9nR3JvdXBOYW1lLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnNvbGUubG9nKCdSZXNwb25kaW5nJywgcmVzcG9uc2VCb2R5KTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgY29uc3QgcGFyc2VkVXJsID0gcmVxdWlyZSgndXJsJykucGFyc2UoZXZlbnQuUmVzcG9uc2VVUkwpO1xuICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgaG9zdG5hbWU6IHBhcnNlZFVybC5ob3N0bmFtZSxcbiAgICAgIHBhdGg6IHBhcnNlZFVybC5wYXRoLFxuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICcnLFxuICAgICAgICAnY29udGVudC1sZW5ndGgnOiBCdWZmZXIuYnl0ZUxlbmd0aChyZXNwb25zZUJvZHksICd1dGY4JyksXG4gICAgICB9LFxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJ2h0dHBzJykucmVxdWVzdChyZXF1ZXN0T3B0aW9ucywgcmVzb2x2ZSk7XG4gICAgICAgIHJlcXVlc3Qub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgICAgcmVxdWVzdC53cml0ZShyZXNwb25zZUJvZHkpO1xuICAgICAgICByZXF1ZXN0LmVuZCgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVJldHJ5T3B0aW9ucyhyYXdPcHRpb25zOiBhbnkpOiBTZGtSZXRyeU9wdGlvbnMge1xuICAgIGNvbnN0IHJldHJ5T3B0aW9uczogU2RrUmV0cnlPcHRpb25zID0ge307XG4gICAgaWYgKHJhd09wdGlvbnMpIHtcbiAgICAgIGlmIChyYXdPcHRpb25zLm1heFJldHJpZXMpIHtcbiAgICAgICAgcmV0cnlPcHRpb25zLm1heFJldHJpZXMgPSBwYXJzZUludChyYXdPcHRpb25zLm1heFJldHJpZXMsIDEwKTtcbiAgICAgIH1cbiAgICAgIGlmIChyYXdPcHRpb25zLmJhc2UpIHtcbiAgICAgICAgcmV0cnlPcHRpb25zLnJldHJ5T3B0aW9ucyA9IHtcbiAgICAgICAgICBiYXNlOiBwYXJzZUludChyYXdPcHRpb25zLmJhc2UsIDEwKSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldHJ5T3B0aW9ucztcbiAgfVxufVxuIl19