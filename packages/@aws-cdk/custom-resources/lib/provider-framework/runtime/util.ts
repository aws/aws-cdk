// tslint:disable: no-console
import { CloudFormationEventContext, submitCloudFormationResponse } from './cfn-response';

export let includeStackTraces = true; // for unit tests

export async function failOnError(event: CloudFormationEventContext, block: () => Promise<any>) {
  try {
    return await block();
  } catch (e) {
    // tell waiter state machine to retry
    if (e instanceof Retry) { throw e; }

    // this is an actual error, fail the activity altogether and exist.
    await submitCloudFormationResponse('FAILED', event, {
      reason: includeStackTraces ? e.stack : e.message,
    });

    return {
      error: e.stack
    };
  }
}

export class Retry extends Error { }

export function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`The environment variable "${name}" is not defined`);
  }
  return value;
}

export function log(title: any, ...args: any[]) {
  console.log('[provider-framework]', title, ...args.map(x => typeof(x) === 'object' ? JSON.stringify(x, undefined, 2) : x));
}
