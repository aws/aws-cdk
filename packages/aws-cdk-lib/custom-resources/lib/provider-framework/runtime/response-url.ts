/* eslint-disable @cdklabs/no-throw-default-error */

import { deleteParameter, getParameter } from './outbound';
import { log } from './util';

/**
 * The subset of an event that carries the CloudFormation response URL.
 *
 * When the waiter state machine is involved, the presigned URL itself is held in
 * SSM Parameter Store and `ResponseURL` carries a redacted placeholder, so that
 * the URL never enters the execution state or an error thrown back to the state
 * machine.
 */
export interface ResponseUrlHolder {
  readonly ResponseURL: string;
  readonly ResponseURLParameterName?: string;
}

/**
 * Returns the real response URL for an event.
 *
 * Events that predate the parameter indirection, including executions already in
 * flight when this framework version is deployed, carry the URL inline and are
 * returned as is.
 */
export async function resolveResponseUrl(event: ResponseUrlHolder): Promise<string> {
  if (!event.ResponseURLParameterName) {
    return event.ResponseURL;
  }

  const value = await getParameter({ Name: event.ResponseURLParameterName });
  if (!value) {
    throw new Error(`unable to resolve the CloudFormation response URL from parameter "${event.ResponseURLParameterName}"`);
  }
  return value;
}

/**
 * Deletes the stored response URL once it can no longer be needed.
 *
 * Best effort on purpose: a parameter left behind is harmless next to a
 * deployment that fails during cleanup.
 */
export async function forgetResponseUrl(event: ResponseUrlHolder): Promise<void> {
  if (!event.ResponseURLParameterName) {
    return;
  }

  try {
    await deleteParameter({ Name: event.ResponseURLParameterName });
  } catch (e: any) {
    log('unable to delete the response URL parameter', e.message);
  }
}
