// tslint:disable:no-console

// eslint-disable-next-line import/no-extraneous-dependencies
import * as AWS from 'aws-sdk';

/**
 * Creates a log group and doesn't throw if it exists.
 *
 * @param logGroupName the name of the log group to create
 */
async function createLogGroupSafe(logGroupName: string) {
  try { // Try to create the log group
    const cloudwatchlogs = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28' });
    await cloudwatchlogs.createLogGroup({ logGroupName }).promise();
  } catch (e) {
    if (e.code !== 'ResourceAlreadyExistsException') {
      throw e;
    }
  }
}

/**
 * Puts or deletes a retention policy on a log group.
 *
 * @param logGroupName the name of the log group to create
 * @param retentionInDays the number of days to retain the log events in the specified log group.
 */
async function setRetentionPolicy(logGroupName: string, retentionInDays?: number) {
  const cloudwatchlogs = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28' });
  if (!retentionInDays) {
    await cloudwatchlogs.deleteRetentionPolicy({ logGroupName }).promise();
  } else {
    await cloudwatchlogs.putRetentionPolicy({ logGroupName, retentionInDays }).promise();
  }
}

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent, context: AWSLambda.Context) {
  try {
    console.log(JSON.stringify(event));

    // The target log group
    const logGroupName = event.ResourceProperties.LogGroupName;

    if (event.RequestType === 'Create' || event.RequestType === 'Update') {
      // Act on the target log group
      await createLogGroupSafe(logGroupName);
      await setRetentionPolicy(logGroupName, parseInt(event.ResourceProperties.RetentionInDays, 10));

      if (event.RequestType === 'Create') {
        // Set a retention policy of 1 day on the logs of this function. The log
        // group for this function should already exist at this stage because we
        // already logged the event but due to the async nature of Lambda logging
        // there could be a race condition. So we also try to create the log group
        // of this function first. If multiple LogRetention constructs are present
        // in the stack, they will try to act on this function's log group at the
        // same time. This can sometime result in an OperationAbortedException. To
        // avoid this and because this operation is not critical we catch all errors.
        try {
          await createLogGroupSafe(`/aws/lambda/${context.functionName}`);
          await setRetentionPolicy(`/aws/lambda/${context.functionName}`, 1);
        } catch (e) {
          console.log(e);
        }
      }
    }

    await respond('SUCCESS', 'OK', logGroupName);
  } catch (e) {
    console.log(e);

    await respond('FAILED', e.message, event.ResourceProperties.LogGroupName);
  }

  function respond(responseStatus: string, reason: string, physicalResourceId: string) {
    const responseBody = JSON.stringify({
      Status: responseStatus,
      Reason: reason,
      PhysicalResourceId: physicalResourceId,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      Data: {}
    });

    console.log('Responding', responseBody);

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const parsedUrl = require('url').parse(event.ResponseURL);
    const requestOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      method: 'PUT',
      headers: { 'content-type': '', 'content-length': responseBody.length }
    };

    return new Promise((resolve, reject) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const request = require('https').request(requestOptions, resolve);
        request.on('error', reject);
        request.write(responseBody);
        request.end();
      } catch (e) {
        reject(e);
      }
    });
  }
}
