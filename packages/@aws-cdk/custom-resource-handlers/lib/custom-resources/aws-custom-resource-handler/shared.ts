/* eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
/**
 * Serialized form of the physical resource id for use in the operation parameters
 */
export const PHYSICAL_RESOURCE_ID_REFERENCE = 'PHYSICAL:RESOURCEID:';

type Event = AWSLambda.CloudFormationCustomResourceEvent

/**
 * Inputs to configure the Lambda function response.
 */
export interface RespondProps {
  /**
   * Data passed to the Lambda function upon execution.
   */
  event: Event;

  /**
   * The HTTP response status.
   */
  responseStatus: string;

  /**
   *
   */
  reason: string;

  /**
   * The physical ID of the custom resouce.
   */
  physicalResourceId: string;

  /**
   * API response data to include in the response.
   */
  data: any;

  /**
   * Disables logging information related to the operation of the Lambda function. This
   * includes displaying the event received by the handler, any API responses received,
   * and any caught or uncaught errors
   *
   * @default false
   */
  disableLogging?: boolean;
}

/**
 * Decodes encoded special values (physicalResourceId)
 */
export function decodeSpecialValues(object: object, physicalResourceId: string) {
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
export function filterKeys(object: object, pred: (key: string) => boolean) {
  return Object.entries(object)
    .reduce(
      (acc, [k, v]) => pred(k)
        ? { ...acc, [k]: v }
        : acc,
      {},
    );
}

export function respond(props: RespondProps) {
  const responseBody = JSON.stringify({
    Status: props.responseStatus,
    Reason: props.reason,
    PhysicalResourceId: props.physicalResourceId,
    StackId: props.event.StackId,
    RequestId: props.event.RequestId,
    LogicalResourceId: props.event.LogicalResourceId,
    NoEcho: false,
    Data: props.data,
  });

  if (!props.disableLogging) {
    // eslint-disable-next-line no-console
    console.log('Responding', responseBody);
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const parsedUrl = require('url').parse(props.event.ResponseURL);
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

export function decodeCall(call: string | undefined) {
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
