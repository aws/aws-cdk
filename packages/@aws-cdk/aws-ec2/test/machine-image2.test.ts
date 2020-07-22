import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';

export = {
  'Lookup ARM_64 AMI from correct SSM parameter store path'(test: Test) {
    // WHEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '1234', region: 'testregion' },
    })

    ec2.MachineImage.latestAmazonLinux({
      cpuType: ec2.AmazonLinuxCpuType.ARM_64,
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
    }).getImage(stack);

    // THEN
    const assembly = app.synth();
    const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
    test.ok(Object.entries(parameters).some(
      ([k, v]) => k.startsWith('SsmParameterValueawsserviceamiamazonlinuxlatestamzn2ami') && (v as any).Default.includes('amzn2-ami-hvm-arm64-gp2'),
    ), 'AmazonLinux 2 AMI with ARM64 should be in ssm parameters');
    test.done();
    }
}
