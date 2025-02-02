import type { SecurityGroupContextQuery } from '@aws-cdk/cloud-assembly-schema';
import type { SecurityGroupContextResponse } from '@aws-cdk/cx-api';
import type { Filter, SecurityGroup } from '@aws-sdk/client-ec2';
import { type SdkProvider, initContextProviderSdk } from '../api/aws-auth/sdk-provider';
import type { ContextProviderPlugin } from '../api/plugin';
import { ContextProviderError } from '../toolkit/error';

export class SecurityGroupContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {}

  async getValue(args: SecurityGroupContextQuery): Promise<SecurityGroupContextResponse> {
    if (args.securityGroupId && args.securityGroupName) {
      throw new ContextProviderError(
        "'securityGroupId' and 'securityGroupName' can not be specified both when looking up a security group",
      );
    }

    if (!args.securityGroupId && !args.securityGroupName) {
      throw new ContextProviderError("'securityGroupId' or 'securityGroupName' must be specified to look up a security group");
    }

    const ec2 = (await initContextProviderSdk(this.aws, args)).ec2();

    const filters: Filter[] = [];
    if (args.vpcId) {
      filters.push({
        Name: 'vpc-id',
        Values: [args.vpcId],
      });
    }
    if (args.securityGroupName) {
      filters.push({
        Name: 'group-name',
        Values: [args.securityGroupName],
      });
    }

    const response = await ec2.describeSecurityGroups({
      GroupIds: args.securityGroupId ? [args.securityGroupId] : undefined,
      Filters: filters.length > 0 ? filters : undefined,
    });

    const securityGroups = response.SecurityGroups ?? [];
    if (securityGroups.length === 0) {
      throw new ContextProviderError(`No security groups found matching ${JSON.stringify(args)}`);
    }

    if (securityGroups.length > 1) {
      throw new ContextProviderError(`More than one security groups found matching ${JSON.stringify(args)}`);
    }

    const [securityGroup] = securityGroups;

    return {
      securityGroupId: securityGroup.GroupId!,
      allowAllOutbound: hasAllTrafficEgress(securityGroup),
    };
  }
}

/**
 * @internal
 */
export function hasAllTrafficEgress(securityGroup: SecurityGroup) {
  let hasAllTrafficCidrV4 = false;
  let hasAllTrafficCidrV6 = false;

  for (const ipPermission of securityGroup.IpPermissionsEgress ?? []) {
    const isAllProtocols = ipPermission.IpProtocol === '-1';

    if (isAllProtocols && ipPermission.IpRanges?.some((m) => m.CidrIp === '0.0.0.0/0')) {
      hasAllTrafficCidrV4 = true;
    }

    if (isAllProtocols && ipPermission.Ipv6Ranges?.some((m) => m.CidrIpv6 === '::/0')) {
      hasAllTrafficCidrV6 = true;
    }
  }

  return hasAllTrafficCidrV4 && hasAllTrafficCidrV6;
}
