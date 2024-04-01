import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

/*
 * Stack verification steps:
 * * Create an instance in the VPC
 * * Connect to that instance (via SSH using `keyPair` should be easiest)
 * * Run the following command: `nslookup accesspoint.s3-global.amazonaws.com`
 *
 * You should see a response with the IP address of the global S3 endpoint.
*/
class Test extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

    const vpc = new ec2.Vpc(this, 'MyVpc', {
      enableDnsSupport: true,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          mapPublicIpOnLaunch: true,
        },
        {
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    vpc.addInterfaceEndpoint('S3MultiRegionAccessEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.S3_MULTI_REGION_ACCESS_POINTS,
    });

    // Create an instance to test the endpoint
    /* const securityGroup = new ec2.SecurityGroup(this, 'MySecurityGroup', {
      vpc,
      allowAllOutbound: true,
    });
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH access');

    new ec2.Instance(this, 'MyInstance', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      securityGroup,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      keyPair: ec2.KeyPair.fromKeyPairName(this, 'KeyPair', 'my-key-pair-name'),
    }); */
  }
}

const app = new cdk.App();

const testCase = new Test(app, 'test-globalvpcendpoint');
new IntegTest(app, 'globalvpcendpoint', {
  testCases: [testCase],
});

app.synth();
