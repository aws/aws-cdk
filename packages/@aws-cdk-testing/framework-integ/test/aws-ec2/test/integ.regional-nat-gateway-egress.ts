import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

// `checkip.amazonaws.com` echoes the caller's source address, which for a function in a
// private subnet is the public address of the NAT gateway its traffic left through.
const RETURN_SOURCE_IP = `exports.handler = async () => {
  const res = await fetch('https://checkip.amazonaws.com');
  return (await res.text()).trim();
};`;

const RETURN_STATUS_CODE = `exports.handler = async () => {
  const res = await fetch('https://checkip.amazonaws.com');
  return res.status;
};`;

class RegionalNatGatewayEgressStack extends cdk.Stack {
  public readonly manualModeFunctionName: string;
  public readonly manualModeEipAddress: string;
  public readonly automaticModeFunctionName: string;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const eip = new ec2.CfnEIP(this, 'NatEip');
    const manualModeVpc = new ec2.Vpc(this, 'ManualModeVpc', {
      // A single Availability Zone keeps the egress address deterministic, so the test can
      // assert that traffic left through the Elastic IP configured below.
      maxAzs: 1,
      natGatewayProvider: ec2.NatProvider.regionalGateway({
        availabilityZoneAddresses: [
          { allocationIds: [eip.attrAllocationId], availabilityZone: this.availabilityZones[0] },
        ],
      }),
      subnetConfiguration: [
        { name: 'Private', subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      ],
    });
    this.manualModeEipAddress = eip.attrPublicIp;
    this.manualModeFunctionName = this.egressProbe('ManualModeProbe', manualModeVpc, RETURN_SOURCE_IP).functionName;

    const automaticModeVpc = new ec2.Vpc(this, 'AutomaticModeVpc', {
      maxAzs: 1,
      natGatewayProvider: ec2.NatProvider.regionalGateway(),
      subnetConfiguration: [
        { name: 'Private', subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      ],
    });
    this.automaticModeFunctionName = this.egressProbe('AutomaticModeProbe', automaticModeVpc, RETURN_STATUS_CODE).functionName;
  }

  private egressProbe(id: string, vpc: ec2.IVpc, code: string): lambda.Function {
    return new lambda.Function(this, id, {
      runtime: lambda.Runtime.NODEJS_24_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(code),
      timeout: cdk.Duration.seconds(30),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });
  }
}

const app = new cdk.App();
const stack = new RegionalNatGatewayEgressStack(app, 'RegionalNatGatewayEgressStack');

const test = new IntegTest(app, 'regional-nat-gateway-egress-integ', {
  testCases: [stack],
});

// Manual mode lists its Availability Zones up front, so the gateway serves them from the
// moment it is created and the observed egress address is the Elastic IP we supplied.
test.assertions.invokeFunction({ functionName: stack.manualModeFunctionName })
  .expect(ExpectedResult.objectLike({ Payload: `"${stack.manualModeEipAddress}"` }))
  .waitForAssertions({ totalTimeout: cdk.Duration.minutes(10), interval: cdk.Duration.seconds(30) });

// Automatic mode allocates its own addresses and expands to an Availability Zone only once
// it detects an ENI there, which AWS documents as taking 15-20 minutes on average, so this
// assertion only checks that egress succeeds.
test.assertions.invokeFunction({ functionName: stack.automaticModeFunctionName })
  .expect(ExpectedResult.objectLike({ Payload: '200' }))
  .waitForAssertions({ totalTimeout: cdk.Duration.minutes(30), interval: cdk.Duration.minutes(1) });
