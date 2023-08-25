/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import * as Logs from '@aws-sdk/client-cloudwatch-logs';

interface LogRetentionEvent extends Omit<AWSLambda.CloudFormationCustomResourceEvent, 'ResourceProperties'> {
  ResourceProperties: {
    ServiceToken: string;
    LogGroupName: string;
    LogGroupRegion?: string;
    RetentionInDays?: string;
    SdkRetry?: {
      maxRetries?: string;
    };
    RemovalPolicy?: string
  };
}

/**
 * Creates a log group and doesn't throw if it exists.
 */
async function createLogGroupSafe(logGroupName: string, client: Logs.CloudWatchLogsClient, withDelay: (block: () => Promise<void>) => Promise<void>) {
  await withDelay(async () => {
    try {
      const params = { logGroupName };
      const command = new Logs.CreateLogGroupCommand(params);
      await client.send(command);

    } catch (error: any) {
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
async function deleteLogGroup(logGroupName: string, client: Logs.CloudWatchLogsClient, withDelay: (block: () => Promise<void>) => Promise<void>) {
  await withDelay(async () => {
    try {
      const params = { logGroupName };
      const command = new Logs.DeleteLogGroupCommand(params);
      await client.send(command);

    } catch (error: any) {
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
async function setRetentionPolicy(
  logGroupName: string,
  client: Logs.CloudWatchLogsClient,
  withDelay: (block: () => Promise<void>) => Promise<void>,
  retentionInDays?: number,
) {

  await withDelay(async () => {
    if (!retentionInDays) {
      const params = { logGroupName };
      const deleteCommand = new Logs.DeleteRetentionPolicyCommand(params);
      await client.send(deleteCommand);
    } else {
      const params = { logGroupName, retentionInDays };
      const putCommand = new Logs.PutRetentionPolicyCommand(params);
      await client.send(putCommand);
    }
  });
}

export async function handler(event: LogRetentionEvent, context: AWSLambda.Context) {
  try {
    console.log(JSON.stringify({ ...event, ResponseURL: '...' }));

    // The target log group
    const logGroupName = event.ResourceProperties.LogGroupName;

    // The region of the target log group
    const logGroupRegion = event.ResourceProperties.LogGroupRegion;

    // Parse to AWS SDK retry options
    const maxRetries = parseIntOptional(event.ResourceProperties.SdkRetry?.maxRetries) ?? 5;
    const withDelay = makeWithDelay(maxRetries);

    const sdkConfig: Logs.CloudWatchLogsClientConfig = {
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
  } catch (e: any) {
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
      } catch (e) {
        reject(e);
      }
    });
  }
}

function parseIntOptional(value?: string, base = 10): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  return parseInt(value, base);
}

function makeWithDelay(
  maxRetries: number,
  delayBase: number = 100,
  delayCap = 10 * 1000, // 10s
): (block: () => Promise<void>) => Promise<void> {
  // If we try to update the log group, then due to the async nature of
  // Lambda logging there could be a race condition when the same log group is
  // already being created by the lambda execution. This can sometime result in
  // an error "OperationAbortedException: A conflicting operation is currently
  // in progress...Please try again."
  // To avoid an error, we do as requested and try again.

  return async (block: () => Promise<void>) => {
    let attempts = 0;
    do {
      try {
        return await block();
      } catch (error: any) {
        if (
          error instanceof Logs.OperationAbortedException
          || error.name === 'OperationAbortedException'
          || error.name === 'ThrottlingException' // There is no class to check with instanceof, see https://github.com/aws/aws-sdk-js-v3/issues/5140
        ) {
          if (attempts < maxRetries ) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, calculateDelay(attempts, delayBase, delayCap)));
            continue;
          } else {
            // The log group is still being changed by another execution but we are out of retries
            throw new Error('Out of attempts to change log group');
          }
        }
        throw error;
      }
    } while (true); // exit happens on retry count check
  };
}

function calculateDelay(attempt: number, base: number, cap: number): number {
  return Math.round(Math.random() * Math.min(cap, base * 2 ** attempt));
}
