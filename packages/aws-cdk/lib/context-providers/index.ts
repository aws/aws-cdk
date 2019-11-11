import cxapi = require('@aws-cdk/cx-api');
import { ISDK } from '../api/util/sdk';
import { debug } from '../logging';
import { Context, TRANSIENT_CONTEXT_KEY } from '../settings';
import { AmiContextProviderPlugin } from './ami';
import { AZContextProviderPlugin } from './availability-zones';
import { HostedZoneContextProviderPlugin } from './hosted-zones';
import { ContextProviderPlugin } from './provider';
import { SSMContextProviderPlugin } from './ssm-parameters';
import { VpcNetworkContextProviderPlugin } from './vpcs';

type ProviderConstructor =  (new (sdk: ISDK) => ContextProviderPlugin);
export type ProviderMap = {[name: string]: ProviderConstructor};

/**
 * Iterate over the list of missing context values and invoke the appropriate providers from the map to retrieve them
 */
export async function provideContextValues(
  missingValues: cxapi.MissingContext[],
  context: Context,
  sdk: ISDK) {

  for (const missingContext of missingValues) {
    const key = missingContext.key;
    const constructor = availableContextProviders[missingContext.provider];
    if (!constructor) {
      // tslint:disable-next-line:max-line-length
      throw new Error(`Unrecognized context provider name: ${missingContext.provider}. You might need to update the toolkit to match the version of the construct library.`);
    }

    const provider = new constructor(sdk);

    let value;
    try {
      value = await provider.getValue(missingContext.props);
    } catch (e) {
      // Set a specially formatted provider value which will be interpreted
      // as a lookup failure in the toolkit.
      value = { [cxapi.PROVIDER_ERROR_KEY]: e.message, [TRANSIENT_CONTEXT_KEY]: true };
    }
    context.set(key, value);
    debug(`Setting "${key}" context to ${JSON.stringify(value)}`);
  }
}

/**
 * Register a context provider
 *
 * (Only available for testing right now).
 */
export function registerContextProvider(name: string, provider: ProviderConstructor) {
  availableContextProviders[name] = provider;
}

const availableContextProviders: ProviderMap = {
  [cxapi.AVAILABILITY_ZONE_PROVIDER]: AZContextProviderPlugin,
  [cxapi.SSM_PARAMETER_PROVIDER]: SSMContextProviderPlugin,
  [cxapi.HOSTED_ZONE_PROVIDER]: HostedZoneContextProviderPlugin,
  [cxapi.VPC_PROVIDER]: VpcNetworkContextProviderPlugin,
  [cxapi.AMI_PROVIDER]: AmiContextProviderPlugin,
};
