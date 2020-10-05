import * as ec2 from '@aws-cdk/aws-ec2';
import * as route53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';

/**
 * Set an InterfaceVpcEndpoint as a target for an ARecord
 */
export class InterfaceVpcEndpointTarget implements route53.IAliasRecordTarget {
  private readonly cfnVpcEndpoint: ec2.CfnVPCEndpoint;
  constructor(private readonly vpcEndpoint: ec2.IInterfaceVpcEndpoint) {
    this.cfnVpcEndpoint = this.vpcEndpoint.node.findChild('Resource') as ec2.CfnVPCEndpoint;
  }

  public bind(_record: route53.IRecordSet): route53.AliasRecordTargetConfig {
    return {
      dnsName: cdk.Fn.select(1, cdk.Fn.split(':', cdk.Fn.select(0, this.cfnVpcEndpoint.attrDnsEntries))),
      hostedZoneId: cdk.Fn.select(0, cdk.Fn.split(':', cdk.Fn.select(0, this.cfnVpcEndpoint.attrDnsEntries))),
    };
  }
}
