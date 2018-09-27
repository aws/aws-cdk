import { MissingContext } from '@aws-cdk/cx-api';
import { Mode, SDK } from './api';
import { debug } from './logging';
import { Settings } from './settings';

export interface ContextProviderPlugin {
  getValue(scope: string[], args: string[]): Promise<any>;
}

export type ProviderMap = {[name: string]: ContextProviderPlugin};

/**
 * Plugin to retrieve the Availability Zones for the current account
 */
export class AZContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SDK) {
  }

  public async getValue(scope: string[], _args: string[]) {
    const [account, region] = scope;
    debug(`Reading AZs for ${account}:${region}`);
    const ec2 = await this.aws.ec2(account, region, Mode.ForReading);
    const response = await ec2.describeAvailabilityZones().promise();
    if (!response.AvailabilityZones) { return []; }
    const azs = response.AvailabilityZones.filter(zone => zone.State === 'available').map(zone => zone.ZoneName);
    return azs;
  }
}

/**
 * Plugin to read arbitrary SSM parameter names
 */
export class SSMContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SDK) {
  }

  public async getValue(scope: string[], args: string[]) {
    const [account, region] = scope;
    const parameterName = args[0];
    debug(`Reading SSM parameter ${account}:${region}:${parameterName}`);

    const ssm = await this.aws.ssm(account, region, Mode.ForReading);
    const response = await ssm.getParameter({ Name: parameterName }).promise();
    if (!response.Parameter || response.Parameter.Value === undefined) {
      throw new Error(`SSM parameter not availble in account ${account}, region ${region}: ${parameterName}`);
    }
    return response.Parameter.Value;
  }
}

/**
 * Iterate over the list of missing context values and invoke the appropriate providers from the map to retrieve them
 */
export async function provideContextValues(missingValues: { [key: string]: MissingContext },
                                           projectConfig: Settings,
                                           availableContextProviders: ProviderMap) {
  for (const key of Object.keys(missingValues)) {
    const query = missingValues[key];

    const provider = availableContextProviders[query.provider];
    if (!provider) {
      throw new Error(`Unrecognized context provider name: ${query.provider}`);
    }

    const value = await provider.getValue(query.scope, query.args);
    projectConfig.set(['context', key], value);
  }
}
