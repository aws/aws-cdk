import { type Environment, EnvironmentPlaceholders } from '@aws-cdk/cx-api';
import { Branded } from '../../util/type-brands';
import type { SdkProvider } from '../aws-auth/sdk-provider';
import { Mode } from '../plugin/mode';

/**
 * Replace the {ACCOUNT} and {REGION} placeholders in all strings found in a complex object.
 */
export async function replaceEnvPlaceholders<A extends Record<string, string | undefined>>(
  object: A,
  env: Environment,
  sdkProvider: SdkProvider,
): Promise<{[k in keyof A]: StringWithoutPlaceholders | undefined}> {
  return EnvironmentPlaceholders.replaceAsync(object, {
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

export type StringWithoutPlaceholders = Branded<string, 'NoPlaceholders'>;
