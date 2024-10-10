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
 * Gets credentials used to make an API call.
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
