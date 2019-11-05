import ec2 = require('@aws-cdk/aws-ec2');
import r53 = require('@aws-cdk/aws-route53');
import cdk = require('@aws-cdk/core');

/**
 * Set an InterfaceVpcEndpoint as a target for an ARecord
 */
export class InterfaceVpcEndpointTarget implements r53.IAliasRecordTarget {
  private readonly cfnVpcEndpoint: ec2.CfnVPCEndpoint;
  constructor(private readonly vpcEndpoint: ec2.IInterfaceVpcEndpoint) {
    this.cfnVpcEndpoint = this.vpcEndpoint.node.findChild('Resource') as ec2.CfnVPCEndpoint;
  }

  public bind(_record: r53.IRecordSet): r53.AliasRecordTargetConfig {
    return {
      dnsName: cdk.Fn.select(1, cdk.Fn.split(':', cdk.Fn.select(0, this.cfnVpcEndpoint.attrDnsEntries))),
      hostedZoneId: cdk.Fn.select(0, cdk.Fn.split(':', cdk.Fn.select(0, this.cfnVpcEndpoint.attrDnsEntries))),
    };
  }
}
