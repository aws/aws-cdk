import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as AWS from 'aws-sdk';
import { Mode } from '../api/aws-auth/credentials';
import { SdkProvider } from '../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../api/plugin';

export class SecurityGroupContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  async getValue(args: cxschema.SecurityGroupContextQuery): Promise<cxapi.SecurityGroupContextResponse> {
    const account: string = args.account!;
    const region: string = args.region!;

    if (args.securityGroupId && args.securityGroupName) {
      throw new Error('\'securityGroupId\' and \'securityGroupName\' can not be specified both when looking up a security group');
    }

    if (!args.securityGroupId && !args.securityGroupName) {
      throw new Error('\'securityGroupId\' or \'securityGroupName\' must be specified to look up a security group');
    }

    const options = { assumeRoleArn: args.lookupRoleArn };
    const ec2 = (await this.aws.forEnvironment(cxapi.EnvironmentUtils.make(account, region), Mode.ForReading, options)).sdk.ec2();

    const filters: AWS.EC2.FilterList = [];
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
    }).promise();

    const securityGroups = response.SecurityGroups ?? [];
    if (securityGroups.length === 0) {
      throw new Error(`No security groups found matching ${JSON.stringify(args)}`);
    }

    if (securityGroups.length > 1) {
      throw new Error(`More than one security groups found matching ${JSON.stringify(args)}`);
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
export function hasAllTrafficEgress(securityGroup: AWS.EC2.SecurityGroup) {
  let hasAllTrafficCidrV4 = false;
  let hasAllTrafficCidrV6 = false;

  for (const ipPermission of securityGroup.IpPermissionsEgress ?? []) {
    const isAllProtocols = ipPermission.IpProtocol === '-1';

    if (isAllProtocols && ipPermission.IpRanges?.some(m => m.CidrIp === '0.0.0.0/0')) {
      hasAllTrafficCidrV4 = true;
    }

    if (isAllProtocols && ipPermission.Ipv6Ranges?.some(m => m.CidrIpv6 === '::/0')) {
      hasAllTrafficCidrV6 = true;
    }
  }

  return hasAllTrafficCidrV4 && hasAllTrafficCidrV6;
}
