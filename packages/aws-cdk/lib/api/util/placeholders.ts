import * as cxapi from '@aws-cdk/cx-api';
import { debug } from '../../logging';
import { Mode } from '../aws-auth/credentials';

interface IBaseCredentialsPartitionProvider {
  baseCredentialsPartition(environment: cxapi.Environment, mode: Mode): Promise<string | undefined>;
}

/**
 * Replace the {ACCOUNT} and {REGION} placeholders in all strings found in a complex object.
 */
export async function replaceEnvPlaceholders<A extends { }>(
  object: A, env: cxapi.Environment, sdkProvider: IBaseCredentialsPartitionProvider): Promise<A> {
  debug('called replaceEnvPlaceholders');
  return cxapi.EnvironmentPlaceholders.replaceAsync(object, {
    accountId: () => Promise.resolve(env.account),
    region: () => Promise.resolve(env.region),
    partition: async () => {
      // There's no good way to get the partition!
      // We should have had it already, except we don't.
      //
      // Best we can do is ask the "base credentials" for this environment for their partition. Cross-partition
      // AssumeRole'ing will never work anyway, so this answer won't be wrong (it will just be slow!)
      return (await sdkProvider.baseCredentialsPartition(env, Mode.ForReading)) ?? 'aws';
    },
  });
}
