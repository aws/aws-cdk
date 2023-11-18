import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import {
  Stack,
  StackProps,
  App,
  aws_ec2 as ec2,
  aws_autoscaling as asg,
  aws_ssm as ssm,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

export class TestCase extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);
    const vpc = new ec2.Vpc(this, 'Vpc');

    const instanceType = ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO);

    new ec2.Instance(this, 'amzn2', {
      instanceType,
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      vpc,
    });

    new ec2.Instance(this, 'al2023', {
      instanceType,
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      vpc,
    });

    new ec2.Instance(this, 'al2023WithMinimalAMI', {
      instanceType,
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023,
        edition: ec2.AmazonLinuxEdition.MINIMAL,
      }),
      vpc,
    });

    const parameter = new ssm.CfnParameter(this, 'AmiParameter', {
      name: 'IntegTestAmi',
      type: 'String',
      dataType: 'aws:ec2:image',
      value: 'ami-06ca3ca175f37dd66',
    });

    const machineImage = ec2.MachineImage.resolveSsmParameterAtLaunch(parameter.ref);
    const ssmInstanceTest = new ec2.Instance(this, 'ssm-resolve-instance', { instanceType, machineImage, vpc });
    ssmInstanceTest.node.addDependency(parameter);

    const launchTemplate = new ec2.LaunchTemplate(this, 'LT', { instanceType, machineImage });
    new asg.AutoScalingGroup(this, 'ASG', {
      vpc,
      launchTemplate,
      desiredCapacity: 1,
    });
  }
}

const app = new App();
new IntegTest(app, 'integ-test', {
  testCases: [new TestCase(app, 'integ-ec2-machine-image-test')],
  enableLookups: true,
});
