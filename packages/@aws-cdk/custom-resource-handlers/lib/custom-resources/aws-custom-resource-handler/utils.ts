/* eslint-disable @typescript-eslint/no-require-imports, import/no-extraneous-dependencies */
/* eslint-disable no-console */
import type { AwsCredentialIdentityProvider } from '@smithy/types';
import { AwsSdkCall } from './construct-types';

type Event = AWSLambda.CloudFormationCustomResourceEvent;

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
 * Filters the keys of an object.
 */
export function filterKeys(object: object, pred: (key: string) => boolean): {} {
  return Object.entries(object)
    .reduce(
      (acc, [k, v]) => pred(k)
        ? { ...acc, [k]: v }
        : acc,
      {},
    );
}

/**
 * Parses a stringified JSON API call.
 */
export function decodeCall(call: string | undefined): any {
  if (!call) { return undefined; }
  return JSON.parse(call);
}

export function startsWithOneOf(searchStrings: string[]): (string: string) => boolean {
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
    const { Data, ...filteredResponseObject } = responseObject;
    console.log('Responding', JSON.stringify(filteredResponseObject));
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
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

/**
 * Gets credentials used to make invoke an AWS SDK call.
 */
export async function getCredentials(call: AwsSdkCall, physicalResourceId: string): Promise<AwsCredentialIdentityProvider | undefined> {
  let credentials;
  if (call.assumedRoleArn) {
    const timestamp = (new Date()).getTime();

    const params = {
      RoleArn: call.assumedRoleArn,
      RoleSessionName: `${timestamp}-${physicalResourceId}`.substring(0, 64),
    };

    const { fromTemporaryCredentials } = await import('@aws-sdk/credential-providers');
    credentials = fromTemporaryCredentials({
      params,
      clientConfig: call.region !== undefined ? { region: call.region } : undefined,
    });
  }
  return credentials;
}
