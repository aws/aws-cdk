import * as cxapi from '@aws-cdk/cx-api';
import * as minimatch from 'minimatch';
import { ISDK } from '../util/sdk';
import { AppStacks } from './stacks';

export async function globEnvironmentsFromStacks(appStacks: AppStacks, environmentGlobs: string[], sdk: ISDK): Promise<cxapi.Environment[]> {
  if (environmentGlobs.length === 0) {
    environmentGlobs = [ '**' ]; // default to ALL
  }

  const stacks = await appStacks.listStacks();

  const availableEnvironments = new Array<cxapi.Environment>();
  for (const stack of stacks) {
    const actual = await parseEnvironment(sdk, stack.environment);
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

async function parseEnvironment(sdk: ISDK, env: cxapi.Environment): Promise<cxapi.Environment> {
  const account = env.account === cxapi.UNKNOWN_ACCOUNT ? await sdk.defaultAccount() : env.account;
  const region = env.region === cxapi.UNKNOWN_REGION ? await sdk.defaultRegion() : env.region;

  if (!account || !region) {
    throw new Error(`Unable to determine default account and/or region`);
  }

  return {
    account, region,
    name: cxapi.EnvironmentUtils.format(account, region)
  };
}

/**
 * Given a set of "<account>/<region>" strings, construct environments for them
 */
export function environmentsFromDescriptors(envSpecs: string[]): cxapi.Environment[] {
  if (envSpecs.length === 0) {
    throw new Error(`Either specify an app with '--app', or specify an environment name like 'aws://123456789012/us-east-1'`);
  }

  const ret = new Array<cxapi.Environment>();

  for (const spec of envSpecs) {
    const parts = spec.replace(/^aws:\/\//, '').split('/');
    if (parts.length !== 2) {
      throw new Error(`Expected environment name in format 'aws://<account>/<region>', got: ${spec}`);
    }

    ret.push({
      name: spec,
      account: parts[0],
      region: parts[1]
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
