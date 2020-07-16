/* eslint-disable max-len */
/* eslint-disable no-console */
import * as url from 'url';
import { httpRequest } from './outbound';
import { log } from './util';

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
  Data?: any
}

export async function submitResponse(status: 'SUCCESS' | 'FAILED', event: CloudFormationEventContext, options: CloudFormationResponseOptions = { }) {
  const json: AWSLambda.CloudFormationCustomResourceResponse = {
    Status: status,
    Reason: options.reason || status,
    StackId: event.StackId,
    RequestId: event.RequestId,
    PhysicalResourceId: event.PhysicalResourceId || MISSING_PHYSICAL_ID_MARKER,
    LogicalResourceId: event.LogicalResourceId,
    NoEcho: options.noEcho,
    Data: event.Data,
  };

  log('submit response to cloudformation', json);

  const responseBody = JSON.stringify(json);

  const parsedUrl = url.parse(event.ResponseURL);
  await httpRequest({
    hostname: parsedUrl.hostname,
    path: parsedUrl.path,
    method: 'PUT',
    headers: {
      'content-type': '',
      'content-length': responseBody.length,
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
    } catch (e) {
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
          log(`ERROR: Malformed event. "PhysicalResourceId" is required: ${JSON.stringify(event)}`);
        }
      }

      // this is an actual error, fail the activity altogether and exist.
      await submitResponse('FAILED', event, {
        reason: includeStackTraces ? e.stack : e.message,
      });
    }
  };
}

export class Retry extends Error { }
