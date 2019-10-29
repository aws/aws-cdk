// tslint:disable: no-console
import fs = require('fs');
import { promisify } from 'util';
import { CloudFormationEventContext, submitCloudFormationResponse } from './cfn-response';

const exists = promisify(fs.exists);

export async function failOnError(event: CloudFormationEventContext, block: () => Promise<any>) {
  try {
    return await block();
  } catch (e) {
    // tell waiter state machine to retry
    if (e instanceof Retry) { throw e; }

    // this is an actual error, fail the activity altogether and exist.
    await submitCloudFormationResponse('FAILED', event, {
      reason: e.stack,
    });

    return {
      error: e.stack
    };
  }
}

export class Retry extends Error { }

/**
 * @param fileEnv the name of the XXX_FILE environment variable which contains the file name of this handler
 * @param funcEnv the name of the XXX_FUNCTION environment variable which contains exported function name for this handler
 */
export async function requireUserHandler<T>(fileEnv: string, funcEnv: string): Promise<T> {
  const filePath = getEnv(fileEnv);
  const exportName = getEnv(funcEnv);

  if (!(await exists(filePath))) {
    throw new Error(`cannot find user handler file ${filePath}`);
  }

  try {
    const mod = require(filePath);
    const fn = mod[exportName];
    if (!fn) {
      throw new Error(`user handler ${filePath} is expected to export a function named "${exportName}"`);
    }

    return fn;
  } catch (e) {
    throw new Error(`unable to import user-defined handler function '${exportName} from ${filePath}: ` + e.message);
  }
}

export function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`The environment variable "${name}" is not defined`);
  }
  return value;
}

export function log(title: any, ...args: any[]) {
  console.log([
    '========================================================================',
    title,
    // '============================',
  ].join('\n') + '\n', ...args.map(x => {
    if (typeof(x) === 'object') { return JSON.stringify(x, undefined, 2); } else { return x; }
  }));
}
