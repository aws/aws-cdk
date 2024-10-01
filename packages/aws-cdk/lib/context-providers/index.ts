import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { AmiContextProviderPlugin } from './ami';
import { AZContextProviderPlugin } from './availability-zones';
import { EndpointServiceAZContextProviderPlugin } from './endpoint-service-availability-zones';
import { HostedZoneContextProviderPlugin } from './hosted-zones';
import { KeyContextProviderPlugin } from './keys';
import { LoadBalancerContextProviderPlugin, LoadBalancerListenerContextProviderPlugin } from './load-balancers';
import { SecurityGroupContextProviderPlugin } from './security-groups';
import { SSMContextProviderPlugin } from './ssm-parameters';
import { VpcNetworkContextProviderPlugin } from './vpcs';
import { SdkProvider, SdkProviderv3 } from '../api';
import { PluginHost } from '../api/plugin';
import { ContextProviderPlugin } from '../api/plugin/context-provider-plugin';
import { replaceEnvPlaceholders } from '../api/util/placeholders';
import { debug } from '../logging';
import { Context, TRANSIENT_CONTEXT_KEY } from '../settings';

export type ContextProviderFactory = ((sdk: SdkProvider) => ContextProviderPlugin);
export type ContextProviderFactoryv3 = ((sdk: SdkProviderv3) => ContextProviderPlugin);
export type ProviderMap = {[name: string]: ContextProviderFactory};
export type ProviderMapv3 = {[name: string]: ContextProviderFactoryv3};

const PLUGIN_PROVIDER_PREFIX = 'plugin';

type SdkProviderType = SdkProvider | SdkProviderv3;

/**
 * Iterate over the list of missing context values and invoke the appropriate providers from the map to retrieve them
 */
export async function provideContextValues<T extends SdkProviderType>(
  missingValues: cxschema.MissingContext[],
  context: Context,
  sdk: T,
) {
  for (const missingContext of missingValues) {
    const key = missingContext.key;

    const providerName = missingContext.provider === cxschema.ContextProvider.PLUGIN
      ? `${PLUGIN_PROVIDER_PREFIX}:${(missingContext.props as cxschema.PluginContextQuery).pluginName}`
      : missingContext.provider;

    let factory: (sdk: T) => ContextProviderPlugin;
    if (providerName.startsWith(`${PLUGIN_PROVIDER_PREFIX}:`)) {
      const plugin = PluginHost.instance.contextProviderPlugins[providerName.substring(PLUGIN_PROVIDER_PREFIX.length + 1)];
      if (!plugin) {
        throw new Error(`Unrecognized plugin context provider name: ${missingContext.provider}.`);
      }
      factory = () => plugin;
    } else {
      factory = availableContextProviders[providerName] as (sdk: T) => ContextProviderPlugin
      || availableContextProvidersv3[providerName] as (sdk: T) => ContextProviderPlugin;
      if (!factory) {
        throw new Error(`Unrecognized context provider name: ${missingContext.provider}. You might need to update the toolkit to match the version of the construct library.`);
      }
    }

    const provider = factory(sdk);

    let value;
    try {
      const environment = missingContext.props.account && missingContext.props.region
        ? cxapi.EnvironmentUtils.make(missingContext.props.account, missingContext.props.region)
        : undefined;

      const resolvedEnvironment: cxapi.Environment = environment
        ? await sdk.resolveEnvironment(environment)
        : { account: '?', region: '?', name: '?' };

      const arns = await replaceEnvPlaceholders({
        lookupRoleArn: missingContext.props.lookupRoleArn,
      }, resolvedEnvironment, sdk);

      value = await provider.getValue({ ...missingContext.props, lookupRoleArn: arns.lookupRoleArn });
    } catch (e: any) {
      value = { [cxapi.PROVIDER_ERROR_KEY]: e.message, [TRANSIENT_CONTEXT_KEY]: true };
    }
    context.set(key, value);
    debug(`Setting "${key}" context to ${JSON.stringify(value)}`);
  }
}

/**
 * Register a context provider
 *
 * A context provider cannot reuse the SDKs authentication mechanisms.
 */
export function registerContextProvider(name: string, provider: ContextProviderPlugin) {
  availableContextProviders[name] = () => provider;
  combinedContextProviders[name] = () => provider;
}

/**
 * Register a plugin context provider
 *
 * A plugin provider cannot reuse the SDKs authentication mechanisms.
 */
export function registerPluginContextProvider(name: string, provider: ContextProviderPlugin) {
  registerContextProvider(`${PLUGIN_PROVIDER_PREFIX}:${name}`, provider);
}

/**
 * Register a context provider factory
 *
 * A context provider factory takes an SdkProvider and returns the context provider plugin.
 */
export function registerContextProviderFactory(name: string, provider: ContextProviderFactory) {
  availableContextProviders[name] = provider;
}

const availableContextProviders: ProviderMap = {
  [cxschema.ContextProvider.AVAILABILITY_ZONE_PROVIDER]: (s) => new AZContextProviderPlugin(s),
  [cxschema.ContextProvider.SSM_PARAMETER_PROVIDER]: (s) => new SSMContextProviderPlugin(s),
  [cxschema.ContextProvider.HOSTED_ZONE_PROVIDER]: (s) => new HostedZoneContextProviderPlugin(s),
  [cxschema.ContextProvider.ENDPOINT_SERVICE_AVAILABILITY_ZONE_PROVIDER]: (s) => new EndpointServiceAZContextProviderPlugin(s),
  [cxschema.ContextProvider.SECURITY_GROUP_PROVIDER]: (s) => new SecurityGroupContextProviderPlugin(s),
  [cxschema.ContextProvider.LOAD_BALANCER_PROVIDER]: (s) => new LoadBalancerContextProviderPlugin(s),
  [cxschema.ContextProvider.LOAD_BALANCER_LISTENER_PROVIDER]: (s) => new LoadBalancerListenerContextProviderPlugin(s),
  [cxschema.ContextProvider.KEY_PROVIDER]: (s) => new KeyContextProviderPlugin(s),
  [cxschema.ContextProvider.AMI_PROVIDER]: (s) => new AmiContextProviderPlugin(s),
};

const availableContextProvidersv3: ProviderMapv3 = {
  [cxschema.ContextProvider.VPC_PROVIDER]: (s) => new VpcNetworkContextProviderPlugin(s),
};

type CombinedContextProviderFactory = ContextProviderFactory | ContextProviderFactoryv3;

type CombinedProviderMap = {
  [key: string]: CombinedContextProviderFactory;
};

const combinedContextProviders: CombinedProviderMap = {
  ...availableContextProviders,
  ...availableContextProvidersv3,
};