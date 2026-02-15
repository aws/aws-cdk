/* eslint-disable @typescript-eslint/no-require-imports, import/no-extraneous-dependencies */

import type { AwsCredentialIdentityProvider } from '@smithy/types';
import type { AwsSdkCall } from './construct-types';

type Event = AWSLambda.CloudFormationCustomResourceEvent;

/**
 * Retry configuration constants
 */
const MAX_RETRIES = 5;
const DELAY_BASE_MS = 1000;
const DELAY_CAP_MS = 30000;

let FAKE_SLEEP = false;

/**
 * Disables sleep for testing purposes to speed up tests.
 */
export function disableSleepForTesting() {
  FAKE_SLEEP = true;
}

/**
 * Checks if an error is a Lambda initialization error that should be retried.
 * These errors occur when invoking a Lambda function that is in a cold start state.
 */
export function isRetryableError(error: any): boolean {
  if (!error) return false;

  // Check error name
  if (error.name === 'ResourceNotReadyException') {
    return true;
  }

  // Check error message for Lambda initialization errors (case-insensitive)
  const message = error.message || '';
  if (message.toLowerCase().includes('lambda is initializing')) {
    return true;
  }

  return false;
}

/**
 * Calculates delay with exponential backoff and jitter.
 * @param attempt The current attempt number (1-based)
 * @param base The base delay in milliseconds
 * @param cap The maximum delay in milliseconds
 * @returns The calculated delay in milliseconds
 */
export function calculateDelay(attempt: number, base: number, cap: number): number {
  return Math.min(Math.round(Math.random() * base * 2 ** attempt), cap);
}

/**
 * Sleep helper function.
 * @param timeMs Time to sleep in milliseconds
 */
export async function sleep(timeMs: number): Promise<void> {
  if (FAKE_SLEEP) {
    timeMs = 0;
  }
  await new Promise<void>(resolve => setTimeout(resolve, timeMs));
}

/**
 * Creates a retry wrapper function that retries on Lambda initialization errors.
 * Follows the same pattern as log-retention-handler.
 * @param maxRetries Maximum number of retry attempts
 * @param delayBase Base delay in milliseconds for exponential backoff
 * @param delayCap Maximum delay in milliseconds
 * @returns A function that wraps an async operation with retry logic
 */
export function makeWithRetry(
  maxRetries: number = MAX_RETRIES,
  delayBase: number = DELAY_BASE_MS,
  delayCap: number = DELAY_CAP_MS,
): <T>(block: () => Promise<T>) => Promise<T> {
  return async <T>(block: () => Promise<T>): Promise<T> => {
    let attempts = 0;
    do {
      try {
        return await block();
      } catch (error: any) {
        if (isRetryableError(error)) {
          if (attempts < maxRetries) {
            attempts++;
            const delay = calculateDelay(attempts, delayBase, delayCap);
            console.log(`Lambda initialization error detected, retrying (attempt ${attempts}/${maxRetries}) after ${delay}ms...`);
            await sleep(delay);
            continue;
          } else {
            // Out of retries
            throw new Error(`Lambda initialization failed after ${maxRetries} retries: ${error.message}`);
          }
        }
        throw error;
      }
    } while (true); // exit happens on retry count check or successful return
  };
}

/**
 * Serialized form of the physical resource id for use in the operation parameters
 */
export const PHYSICAL_RESOURCE_ID_REFERENCE = 'PHYSICAL:RESOURCEID:';

/**
 * Decodes encoded special values (physicalResourceId)
 */
export function decodeSpecialValues(object: object, physicalResourceId: string): any {
  return recurse(object);

  function recurse(x: any): any {
    if (x === PHYSICAL_RESOURCE_ID_REFERENCE) {
      return physicalResourceId;
    }
    if (Array.isArray(x)) {
      return x.map(recurse);
    }
    if (x && typeof x === 'object') {
      for (const [key, value] of Object.entries(x)) {
        x[key] = recurse(value);
      }
      return x;
    }
    return x;
  }
}

/**
 * Parses a stringified JSON API call.
 */
export function decodeCall(call: string | undefined): any {
  if (!call) { return undefined; }
  return JSON.parse(call);
}

/**
 * Responds to the CloudFormation Custom Resource.
 */
export function respond(
  event: Event,
  responseStatus: string,
  reason: string,
  physicalResourceId: string,
  data: any, logApiResponseData: boolean,
): Promise<void> {
  const responseObject = {
    Status: responseStatus,
    Reason: reason,
    PhysicalResourceId: physicalResourceId,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    NoEcho: false,
    Data: data,
  };

  if (logApiResponseData) {
    console.log('Responding', JSON.stringify(responseObject));
  } else {
    // Extract Data property to exclude it from logging (security)
    const { Data: _data, ...filteredResponseObject } = responseObject;
    console.log('Responding', JSON.stringify(filteredResponseObject));
  }

  const parsedUrl = require('url').parse(event.ResponseURL);
  const responseBody = JSON.stringify(responseObject);
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
      const request = require('https').request(requestOptions, resolve);
      request.on('error', reject);
      request.write(responseBody);
      request.end();
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Gets credentials used to make an API call.
 */
export async function getCredentials(call: AwsSdkCall, physicalResourceId: string): Promise<AwsCredentialIdentityProvider | undefined> {
  // Validate that externalId requires assumedRoleArn
  if (call.externalId && !call.assumedRoleArn) {
    throw new Error('ExternalId can only be provided when assumedRoleArn is specified');
  }

  let credentials;
  if (call.assumedRoleArn) {
    const timestamp = (new Date()).getTime();

    const params = {
      RoleArn: call.assumedRoleArn,
      RoleSessionName: `${timestamp}-${physicalResourceId}`.replace(/[^\w+=,.@-]/g, '').substring(0, 64),
      ExternalId: call.externalId,
    };

    const { fromTemporaryCredentials } = await import('@aws-sdk/credential-providers');
    credentials = fromTemporaryCredentials({
      params,
      clientConfig: call.region !== undefined ? { region: call.region } : undefined,
    });
  }
  return credentials;
}

/**
 * Formats API response data based on outputPath or outputPaths configured in the SDK call.
 */
export function formatData(call: AwsSdkCall, flatData: { [key: string]: string }): { [key: string]: string } {
  let outputPaths: string[] | undefined;
  if (call.outputPath) {
    outputPaths = [call.outputPath];
  } else if (call.outputPaths) {
    outputPaths = call.outputPaths;
  }

  if (outputPaths) {
    return filterKeys(flatData, startsWithOneOf(outputPaths));
  }

  return flatData;
}

/**
 * Returns a predicate function that returns true if a target string starts with any of the specified
 * search strings.
 */
function startsWithOneOf(searchStrings: string[]): (string: string) => boolean {
  return function(string: string): boolean {
    for (const searchString of searchStrings) {
      if (string.startsWith(searchString)) {
        return true;
      }
    }
    return false;
  };
}

/**
 * Filters the keys of an object.
 */
function filterKeys(object: object, pred: (key: string) => boolean): {} {
  return Object.entries(object)
    .reduce(
      (acc, [k, v]) => pred(k)
        ? { ...acc, [k]: v }
        : acc,
      {},
    );
}
