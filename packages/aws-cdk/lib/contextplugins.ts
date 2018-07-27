import { MissingContext } from '@aws-cdk/cx-api';
import { Mode, SDK } from './api';
import { Route53 } from 'aws-sdk';
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
 * Plugin to read arbitrary SSM parameter names
 */
export class HostedZoneContextProviderPlugin implements ContextProviderPlugin {
    constructor(private readonly aws: SDK) {
    }

    public async getValue(scope: string[], args: string[]) {
        const [account, region] = scope;
        const domainName = args[0];
        const privateZone: boolean = args[1] ? args[1] === 'true' : false;
        const vpcId = args[2];
        debug(`Reading hosted zone ${account}:${region}:${domainName}`);

        const r53 = await this.aws.route53(account, region, Mode.ForReading);
        const response = await r53.listHostedZonesByName({ DNSName: domainName }).promise();
        if (!response.HostedZones) {
            throw new Error(`Hosted Zone not availble in account ${account}, region ${region}: ${domainName}`);
        }
        const candidateZones = this.filterZones(r53, response.HostedZones, privateZone, vpcId);
        if(candidateZones.length > 1) {
            const filter = `dns:${domainName}, privateZone:${privateZone}, vpcId:${vpcId}`;
            throw new Error(`Found more than one matching HostedZone ${candidateZones} for ${filter}`);
        }
        return candidateZones[0];

    }

    private filterZones(r53: Route53, zones: Route53.HostedZone[], privateZone: boolean, vpcId: string | undefined): Route53.HostedZone[]{
        let candidates: Route53.HostedZone[] = [];
        if(privateZone) {
            candidates = zones.filter(zone => zone.Config && zone.Config.PrivateZone);
        } else {
            candidates = zones.filter(zone => !zone.Config || !zone.Config.PrivateZone);
        }
        if(vpcId) {
            const vpcZones: Route53.HostedZone[] = [];
            for(const zone of candidates) {
                r53.getHostedZone({Id: zone.Id}, (err, data) => {
                    if(err) {
                        throw new Error(err.message);
                    }
                    if(!data.VPCs) {
                        debug(`Expected VPC for private zone but no VPC found ${zone.Id}`)
                        return;
                    }
                    if(data.VPCs.map(vpc => vpc.VPCId).includes(vpcId)) {
                        vpcZones.push(zone);
                    }
                });
            }
            return vpcZones;
        }
        return candidates;
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
