import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';

// Reached over the public internet from outside the VPC, so the address it echoes back is the
// public address of the NAT gateway the caller's traffic left through.
const ECHO_SOURCE_IP = `exports.handler = async (event) => ({
  statusCode: 200,
  body: event.requestContext.http.sourceIp,
});`;

const RETURN_SOURCE_IP = `exports.handler = async () => {
  const res = await fetch(process.env.ECHO_URL);
  return (await res.text()).trim();
};`;

class RegionalNatGatewayEgressStack extends cdk.Stack {
  public readonly manualModeFunctionName: string;
  public readonly manualModeEipAddress: string;
  public readonly automaticModeFunctionName: string;

  private readonly echoUrl: string;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const echo = new lambda.Function(this, 'SourceIpEcho', {
      runtime: lambda.Runtime.NODEJS_24_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(ECHO_SOURCE_IP),
    });
    this.echoUrl = echo.addFunctionUrl({ authType: lambda.FunctionUrlAuthType.NONE }).url;

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
    this.manualModeFunctionName = this.egressProbe('ManualModeProbe', manualModeVpc).functionName;

    const automaticModeVpc = new ec2.Vpc(this, 'AutomaticModeVpc', {
      maxAzs: 1,
      natGatewayProvider: ec2.NatProvider.regionalGateway(),
      subnetConfiguration: [
        { name: 'Private', subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      ],
    });
    this.automaticModeFunctionName = this.egressProbe('AutomaticModeProbe', automaticModeVpc).functionName;
  }

  private egressProbe(id: string, vpc: ec2.IVpc): lambda.Function {
    return new lambda.Function(this, id, {
      runtime: lambda.Runtime.NODEJS_24_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(RETURN_SOURCE_IP),
      environment: { ECHO_URL: this.echoUrl },
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

// Automatic mode allocates its own addresses and expands to an Availability Zone only once it
// detects an ENI there, which AWS documents as taking 15-20 minutes on average, so this
// assertion only checks that the echo observed a public address for the call.
test.assertions.invokeFunction({ functionName: stack.automaticModeFunctionName })
  .expect(ExpectedResult.objectLike({ Payload: Match.stringLikeRegexp('^"\\d+\\.\\d+\\.\\d+\\.\\d+"$') }))
  .waitForAssertions({ totalTimeout: cdk.Duration.minutes(30), interval: cdk.Duration.minutes(1) });
