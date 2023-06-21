import { EnvironmentPlaceholders } from '@aws-cdk/cx-api';
import { IAws } from '../aws';

/**
 * Replace the {ACCOUNT} and {REGION} placeholders in all strings found in a complex object.
 *
 * Duplicated between cdk-assets and aws-cdk CLI because we don't have a good single place to put it
 * (they're nominally independent tools).
 */
export async function replaceAwsPlaceholders<A extends { region?: string }>(object: A, aws: IAws): Promise<A> {
  let partition = async () => {
    const p = await aws.discoverPartition();
    partition = () => Promise.resolve(p);
    return p;
  };

  let account = async () => {
    const a = await aws.discoverCurrentAccount();
    account = () => Promise.resolve(a);
    return a;
  };

  return EnvironmentPlaceholders.replaceAsync(object, {
    async region() {
      return object.region ?? aws.discoverDefaultRegion();
    },
    async accountId() {
      return (await account()).accountId;
    },
    async partition() {
      return partition();
    },
  });
}