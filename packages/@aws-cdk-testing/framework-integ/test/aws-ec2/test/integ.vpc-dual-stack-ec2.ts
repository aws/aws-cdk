/**
 * Note: this integ test may take around 10 minutes to complete successfully.
 */

/* eslint-disable no-console */
import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import * as path from 'path';

const app = new cdk.App();

class EC2DualStack extends cdk.Stack {
  public readonly instancePublicIp: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Ip6VpcDualStack', {
      ipProtocol: ec2.IpProtocol.DUAL_STACK,
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
      flowLogs: {
        cloudwatchLogs: {
          destination: ec2.FlowLogDestination.toCloudWatchLogs(),
        },
      },
    });

    const instance = new ec2.Instance(this, 'MyInstance', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      vpc: vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      allowAllIpv6Outbound: true,
      init: ec2.CloudFormationInit.fromConfigSets({
        configSets: {
          default: ['default'],
        },
        configs: {
          default: new ec2.InitConfig([
            ec2.InitFile.fromAsset('/app/webserver.zip', path.join(__dirname, 'integ.vpc-dual-stack-ec2.assets')),
            ec2.InitCommand.shellCommand('unzip webserver.zip', { cwd: '/app' }),
            ec2.InitService.systemdConfigFile('webserver', {
              command: '/usr/bin/python3 web-server.py',
              cwd: '/app',
            }),
            ec2.InitService.enable('webserver', {
              serviceManager: ec2.ServiceManager.SYSTEMD,
            }),
          ]),
        },
      }),
    });

    this.instancePublicIp = instance.instancePublicIp;

    instance.connections.allowFromAnyIpv4(ec2.Port.tcp(22), 'Allow SSH access');
    instance.connections.allowFromAnyIpv4(ec2.Port.tcp(8000), 'HTTP traffic');
    instance.connections.allowFromAnyIpv4(ec2.Port.icmpPing());
    instance.connections.allowFrom(ec2.Peer.anyIpv6(), ec2.Port.allIcmpV6(), 'allow ICMP6');
  }
}

const testCase = new EC2DualStack(app, 'vpc-dual-stack-ec2');

const integ = new IntegTest(app, 'vpc-dual-stack-ec2-test', {
  testCases: [testCase],
});

const ipv4ipv6Invoke = integ.assertions.httpApiCall(`http://${testCase.instancePublicIp}:8000`, {});
ipv4ipv6Invoke.expect(ExpectedResult.objectLike({
  status: 200,
}));
