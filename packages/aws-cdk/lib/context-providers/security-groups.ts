import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as AWS from 'aws-sdk';
import { Mode, SdkProvider } from '../api';
import { ContextProviderPlugin } from './provider';

export class SecurityGroupContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  async getValue(args: cxschema.SecurityGroupContextQuery): Promise<cxapi.SecurityGroupContextResponse> {
    const account: string = args.account!;
    const region: string = args.region!;

    const ec2 = (await this.aws.forEnvironment(cxapi.EnvironmentUtils.make(account, region), Mode.ForReading)).ec2();

    const response = await ec2.describeSecurityGroups({
      GroupIds: [args.securityGroupId],
    }).promise();

    const securityGroups = response.SecurityGroups ?? [];
    if (securityGroups.length === 0) {
      throw new Error(`No security groups found matching ${JSON.stringify(args)}`);
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
