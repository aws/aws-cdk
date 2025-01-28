import { AtmosphereClient } from '@cdklabs/cdk-atmosphere-client';
import { AwsClients } from './aws';
import { TestContext } from './integ-test';
import { ResourcePool } from './resource-pool';
import { DisableBootstrapContext } from './with-cdk-app';

export function atmosphereEnabled(): boolean {
  const enabled = process.env.CDK_INTEG_ATMOSPHERE_ENABLED;
  return enabled === 'true' || enabled === '1';
}

export function atmosphereEndpoint(): string {
  const value = process.env.CDK_INTEG_ATMOSPHERE_ENDPOINT;
  if (!value) {
    throw new Error('CDK_INTEG_ATMOSPHERE_ENDPOINT is not defined');
  }
  return value;
}

export function atmospherePool() {
  const value = process.env.CDK_INTEG_ATMOSPHERE_POOL;
  if (!value) {
    throw new Error('CDK_INTEG_ATMOSPHERE_POOL is not defined');
  }
  return value;
}

export type AwsContext = { readonly aws: AwsClients };

/**
 * Higher order function to execute a block with an AWS client setup
 *
 * Allocate the next region from the REGION pool and dispose it afterwards.
 */
export function withAws<A extends TestContext>(
  block: (context: A & AwsContext & DisableBootstrapContext) => Promise<void>,
  disableBootstrap: boolean = false,
): (context: A) => Promise<void> {
  return async (context: A) => {

    if (atmosphereEnabled()) {
      const atmosphere = new AtmosphereClient(atmosphereEndpoint());
      const allocation = await atmosphere.acquire({ pool: atmospherePool(), requester: context.name });
      const aws = await AwsClients.forIdentity(allocation.environment.region, {
        accessKeyId: allocation.credentials.accessKeyId,
        secretAccessKey: allocation.credentials.secretAccessKey,
        sessionToken: allocation.credentials.sessionToken,
        accountId: allocation.environment.account,
      }, context.output);

      await sanityCheck(aws);

      let outcome = 'success';
      try {
        return await block({ ...context, disableBootstrap, aws });
      } catch (e: any) {
        outcome = 'failure';
        throw e;
      } finally {
        await atmosphere.release(allocation.id, outcome);
      }

    } else {
      return regionPool().using(async (region) => {
        const aws = await AwsClients.forRegion(region, context.output);
        await sanityCheck(aws);

        return block({ ...context, disableBootstrap, aws });
      });
    }

  };
}

let _regionPool: undefined | ResourcePool;
export function regionPool(): ResourcePool {
  if (_regionPool !== undefined) {
    return _regionPool;
  }

  const REGIONS = process.env.AWS_REGIONS
    ? process.env.AWS_REGIONS.split(',')
    : [process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? 'us-east-1'];

  // eslint-disable-next-line no-console
  console.log(`Using regions: ${REGIONS}\n`);

  _regionPool = ResourcePool.withResources('aws_regions', REGIONS);
  return _regionPool;
}

/**
 * Perform a one-time quick sanity check that the AWS clients have properly configured credentials
 *
 * If we don't do this, calls are going to fail and they'll be retried and everything will take
 * forever before the user notices a simple misconfiguration.
 *
 * We can't check for the presence of environment variables since credentials could come from
 * anywhere, so do simple account retrieval.
 *
 * Only do it once per process.
 */
async function sanityCheck(aws: AwsClients) {
  if (sanityChecked === undefined) {
    try {
      await aws.account();
      sanityChecked = true;
    } catch (e: any) {
      sanityChecked = false;
      throw new Error(`AWS credentials probably not configured, got error: ${e.message}`);
    }
  }
  if (!sanityChecked) {
    throw new Error('AWS credentials probably not configured, see previous error');
  }
}
let sanityChecked: boolean | undefined;
