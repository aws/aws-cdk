// tslint:disable: no-console
import path = require('path');
import { LifecycleEvent } from './api';
import { cfnRespond } from './cfn-response';

export async function failOnError(event: LifecycleEvent, block: () => Promise<any>) {
  try {
    return await block();
  } catch (e) {
    // tell waiter state machine to retry
    if (e instanceof Retry) { throw e; }

    // this is an actual error, fail the activity altogether and exist.
    await cfnRespond(event, 'FAILED', e.message);

    return {
      error: e.message
    };
  }
}

export class Retry extends Error { }

export function requireUserHandler<T>(env: string): T {
    const spec = getEnv(env);
    const [ file, exportName ] = spec.split('.');
    const filePath = path.join('/opt', file + '.js');
    try {
      const mod = require(filePath);
      const fn = mod[exportName];
      if (!fn) {
        throw new Error(`Cannot find handler function with export name "${exportName}"`);
      }
      return fn;
    } catch (e) {
      throw new Error(`Cannot require user handler: ${filePath}`);
    }
}

export function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`The environment variable "${name}" is not defined`);
  }
  return value;
}
