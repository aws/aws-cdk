import { CfnStack } from '@aws-cdk/aws-cloudformation';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');

export interface RemoteDesktopGatewayProps {
  readonly rdgwCIDR: string;
  readonly vpc: ec2.IVpcNetwork;
  readonly keyPairName: string;

  readonly adminPassword: string;
  readonly adminUser?: string;

  readonly domainDNSName?: string;
  readonly numberOfRDGWHosts?: number;
  readonly qss3BucketName?: string;
  readonly qss3KeyPrefix?: string;
  readonly rdgwInstanceType?: string;
}

/**
 * Embed the Remote Desktop Gateway AWS QuickStart
 */
export class RemoteDesktopGateway extends cdk.Construct implements ec2.IConnectable {
  private static readonly PORT = 3389;
  public readonly connections: ec2.Connections;

  constructor(scope: cdk.Construct, id: string, props: RemoteDesktopGatewayProps) {
    super(scope, id);

    const params: any = {
      RDGWCIDR: props.rdgwCIDR,
      VPCID: props.vpc.vpcId,
      PublicSubnet1ID: props.vpc.publicSubnets[0].subnetId,
      PublicSubnet2ID: props.vpc.publicSubnets[1].subnetId,
      AdminPassword: props.adminPassword,
      AdminUser: props.adminUser,
      DomainDNSName: props.domainDNSName,
      KeyPairName: props.keyPairName,
      NumberOfRDGWHosts: props.numberOfRDGWHosts,
      QSS3BucketName: props.qss3BucketName,
      QSS3KeyPrefix: props.qss3KeyPrefix,
      RDGWInstanceType: props.rdgwInstanceType,
    };

    const nestedStack = new CfnStack(this, 'Resource', {
      templateUrl: 'https://s3.amazonaws.com/quickstart-reference/microsoft/rdgateway/latest/templates/rdgw-standalone.template',
      parameters: params
    });

    const securityGroup = ec2.SecurityGroup.import(this, 'SecurityGroup', {
      securityGroupId: nestedStack.getAtt('Outputs.RemoteDesktopGatewaySGID').toString()
    });

    const defaultPortRange = new ec2.TcpPort(RemoteDesktopGateway.PORT);
    this.connections = new ec2.Connections({ securityGroups: [securityGroup], defaultPortRange });
  }
}
