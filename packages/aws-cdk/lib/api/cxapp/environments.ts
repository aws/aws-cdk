import * as cxapi from '@aws-cdk/cx-api';
import { StackCollection } from './cloud-assembly';
import { SdkProvider } from '../aws-auth';

// namespace object imports won't work in the bundle for function exports
// eslint-disable-next-line @typescript-eslint/no-require-imports
const minimatch = require('minimatch');

export function looksLikeGlob(environment: string) {
  return environment.indexOf('*') > -1;
}

// eslint-disable-next-line max-len
export async function globEnvironmentsFromStacks(stacks: StackCollection, environmentGlobs: string[], sdk: SdkProvider): Promise<cxapi.Environment[]> {
  if (environmentGlobs.length === 0) { return []; }

  const availableEnvironments = new Array<cxapi.Environment>();
  for (const stack of stacks.stackArtifacts) {
    const actual = await sdk.resolveEnvironment(stack.environment);
    availableEnvironments.push(actual);
  }

  const environments = distinct(availableEnvironments).filter(env => environmentGlobs.find(glob => minimatch(env!.name, glob)));
  if (environments.length === 0) {
    const globs = JSON.stringify(environmentGlobs);
    const envList = availableEnvironments.length > 0 ? availableEnvironments.map(env => env!.name).join(', ') : '<none>';
    throw new Error(`No environments were found when selecting across ${globs} (available: ${envList})`);
  }

  return environments;
}

/**
 * Given a set of "<account>/<region>" strings, construct environments for them
 */
export function environmentsFromDescriptors(envSpecs: string[]): cxapi.Environment[] {
  const ret = new Array<cxapi.Environment>();

  for (const spec of envSpecs) {
    const parts = spec.replace(/^aws:\/\//, '').split('/');
    if (parts.length !== 2) {
      throw new Error(`Expected environment name in format 'aws://<account>/<region>', got: ${spec}`);
    }

    ret.push({
      name: spec,
      account: parts[0],
      region: parts[1],
    });
  }

  return ret;
}

/**
 * De-duplicates a list of environments, such that a given account and region is only represented exactly once
 * in the result.
 *
 * @param envs the possibly full-of-duplicates list of environments.
 *
 * @return a de-duplicated list of environments.
 */
function distinct(envs: cxapi.Environment[]): cxapi.Environment[] {
  const unique: { [id: string]: cxapi.Environment } = {};
  for (const env of envs) {
    const id = `${env.account || 'default'}/${env.region || 'default'}`;
    if (id in unique) { continue; }
    unique[id] = env;
  }
  return Object.values(unique);
}
