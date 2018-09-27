import { cloudformation } from '@aws-cdk/aws-cloudformation';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');

export interface RemoteDesktopGatewayProps {
  rdgwCIDR: string;
  vpc: ec2.VpcNetworkRef;
  keyPairName: string;

  adminPassword: string;
  adminUser?: string;

  domainDNSName?: string;
  numberOfRDGWHosts?: number;
  qss3BucketName?: string;
  qss3KeyPrefix?: string;
  rdgwInstanceType?: string;
}

/**
 * Embed the Remote Desktop Gateway AWS QuickStart
 */
export class RemoteDesktopGateway extends cdk.Construct implements ec2.IConnectable {
  private static readonly PORT = 3389;
  public readonly connections: ec2.Connections;

  constructor(parent: cdk.Construct, name: string, props: RemoteDesktopGatewayProps) {
    super(parent, name);

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

    const nestedStack = new cloudformation.StackResource(this, 'Resource', {
      templateUrl: 'https://s3.amazonaws.com/quickstart-reference/microsoft/rdgateway/latest/templates/rdgw-standalone.template',
      parameters: params
    });

    const securityGroup = ec2.SecurityGroupRef.import(this, 'SecurityGroup', {
      securityGroupId: nestedStack.getAtt('Outputs.RemoteDesktopGatewaySGID').toString()
    });

    const defaultPortRange = new ec2.TcpPort(RemoteDesktopGateway.PORT);
    this.connections = new ec2.Connections({ securityGroup, defaultPortRange });
  }
}
