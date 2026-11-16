
import * as url from 'url';
import { httpRequest } from './outbound';
import { log, withRetries } from './util';
import type { OnEventResponse } from '../types';

export const CREATE_FAILED_PHYSICAL_ID_MARKER = 'AWSCDK::CustomResourceProviderFramework::CREATE_FAILED';
export const MISSING_PHYSICAL_ID_MARKER = 'AWSCDK::CustomResourceProviderFramework::MISSING_PHYSICAL_ID';

export interface CloudFormationResponseOptions {
  readonly reason?: string;
  readonly noEcho?: boolean;
}

export interface CloudFormationEventContext {
  StackId: string;
  RequestId: string;
  PhysicalResourceId?: string;
  LogicalResourceId: string;
  ResponseURL: string;
  Data?: any;
  NoEcho?: boolean;
}

export async function submitResponse(status: 'SUCCESS' | 'FAILED', event: CloudFormationEventContext, options: CloudFormationResponseOptions = { }) {
  // NoEcho is set if either the caller or the event says so. A FAILED response for
  // an isComplete request (submitted by safeHandler) does not pass the option, but
  // the request still carries the Data returned by onEvent. The check is for
  // truthiness, not `=== true`: a handler written in another language, or one that
  // builds its JSON by hand, can return `"true"` or `1`, which CloudFormation and
  // the framework have always honored. The same value decides both the response
  // body and the log line.
  const noEcho = Boolean(options.noEcho) || Boolean(event.NoEcho);
  const json: AWSLambda.CloudFormationCustomResourceResponse = {
    Status: status,
    Reason: options.reason || status,
    StackId: event.StackId,
    RequestId: event.RequestId,
    PhysicalResourceId: event.PhysicalResourceId || MISSING_PHYSICAL_ID_MARKER,
    LogicalResourceId: event.LogicalResourceId,
    NoEcho: noEcho ? true : undefined,
    Data: event.Data,
  };

  const responseBody = JSON.stringify(json);

  const parsedUrl = url.parse(event.ResponseURL);
  const loggingSafeUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}/${parsedUrl.pathname}?***`;
  if (noEcho) {
    log('submit redacted response to cloudformation', loggingSafeUrl, redactDataFromPayload(json));
  } else {
    log('submit response to cloudformation', loggingSafeUrl, json);
  }

  const retryOptions = {
    attempts: 5,
    sleep: 1000,
  };
  await withRetries(retryOptions, httpRequest)({
    hostname: parsedUrl.hostname,
    path: parsedUrl.path,
    method: 'PUT',
    headers: {
      'content-type': '',
      'content-length': Buffer.byteLength(responseBody, 'utf8'),
    },
  }, responseBody);
}

export let includeStackTraces = true; // for unit tests

export function safeHandler(block: (event: any) => Promise<void>) {
  return async (event: any) => {
    // ignore DELETE event when the physical resource ID is the marker that
    // indicates that this DELETE is a subsequent DELETE to a failed CREATE
    // operation.
    if (event.RequestType === 'Delete' && event.PhysicalResourceId === CREATE_FAILED_PHYSICAL_ID_MARKER) {
      log('ignoring DELETE event caused by a failed CREATE event');
      await submitResponse('SUCCESS', event);
      return;
    }

    try {
      await block(event);
    } catch (e: any) {
      // tell waiter state machine to retry
      if (e instanceof Retry) {
        log('retry requested by handler');
        throw e;
      }

      if (!event.PhysicalResourceId) {
        // special case: if CREATE fails, which usually implies, we usually don't
        // have a physical resource id. in this case, the subsequent DELETE
        // operation does not have any meaning, and will likely fail as well. to
        // address this, we use a marker so the provider framework can simply
        // ignore the subsequent DELETE.
        if (event.RequestType === 'Create') {
          log('CREATE failed, responding with a marker physical resource id so that the subsequent DELETE will be ignored');
          event.PhysicalResourceId = CREATE_FAILED_PHYSICAL_ID_MARKER;
        } else {
          // otherwise, if PhysicalResourceId is not specified, something is
          // terribly wrong because all other events should have an ID.
          const sanitizedEvent = { ...event, ResponseURL: '...' };
          log(`ERROR: Malformed event. "PhysicalResourceId" is required: ${JSON.stringify(event.NoEcho ? redactDataFromPayload(sanitizedEvent) : sanitizedEvent)}`);
        }
      }

      // this is an actual error, fail the activity altogether and exist.
      await submitResponse('FAILED', event, {
        reason: includeStackTraces ? e.stack : e.message,
      });
    }
  };
}

/**
 * Returns a copy of the payload with every `Data` value replaced, for logging a
 * payload that has `NoEcho` set. The `Data` key names are kept: they are the
 * attribute names the template reads with `Fn::GetAtt`, so they are not secret.
 *
 * The same rule is implemented by `redactResponseData` in
 * `@aws-cdk/custom-resource-handlers` (`nodejs-entrypoint.ts` and
 * `core/nodejs-entrypoint-handler/index.ts`), which cannot import it.
 * `custom-resources/test/provider-framework/redact-data-parity.test.ts` runs all
 * three on the same inputs.
 */
export function redactDataFromPayload(payload: OnEventResponse): OnEventResponse {
  // Create a deep copy of the payload object
  const redactedPayload: OnEventResponse = JSON.parse(JSON.stringify(payload));

  // Redact the data in the copied payload object
  const data: unknown = redactedPayload.Data;
  if (data === undefined || data === null) {
    return redactedPayload;
  }
  if (typeof data !== 'object' || Array.isArray(data)) {
    // masking per key only makes sense for an object; for anything else (for
    // example a string, whose characters cannot be overwritten) hide the whole value.
    return { ...redactedPayload, Data: '*****' as any };
  }
  return { ...redactedPayload, Data: Object.fromEntries(Object.keys(data).map(key => [key, '*****'])) };
}

export class Retry extends Error { }
