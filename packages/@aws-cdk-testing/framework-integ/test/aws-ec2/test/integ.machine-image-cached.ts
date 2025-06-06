import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import {
  Stack,
  StackProps,
  App,
  aws_ec2 as ec2,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

// we associate this stack with an explicit environment since this is required by the
// environmental context provider used with `cachedInContext`. CDK_INTEG_XXX are set
// when producing the .expected file and CDK_DEFAULT_XXX is passed in through from
// the CLI in actual deployment.
const env = {
  account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
};

export class TestCase extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);
    const vpc = new ec2.Vpc(this, 'Vpc');

    const instanceType = ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.NANO);

    new ec2.Instance(this, 'al2023Cached', {
      instanceType,
      machineImage: ec2.MachineImage.latestAmazonLinux2023({
        cachedInContext: true,
      }),
      vpc,
    });

    new ec2.Instance(this, 'al2023CachedScope', {
      instanceType,
      machineImage: ec2.MachineImage.latestAmazonLinux2023({
        cachedInContext: true,
        additionalCacheKey: 'extraKey',
      }),
      vpc,
    });
  }
}

const app = new App();
const stack = new TestCase(app, 'cdk-ec2-machine-image-cached', { env });
new IntegTest(app, 'integ-ec2-machine-image-cached', {
  testCases: [stack],
  enableLookups: true,
});
app.synth();
