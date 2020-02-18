import { countResources, expect, haveOutput, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as cloud9 from '../lib';

export = {
  'with no properties set, it correctly sets default properties'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    // const vpc = mockVpc(stack);

    // WHEN
    new cloud9.EnvironmentEC2(stack, 'C9Env');

    // THEN
    expect(stack).to(haveResource("AWS::Cloud9::EnvironmentEC2", {
      InstanceType: "t2.micro",
      SubnetId: {
        Ref: "C9EnvVpcPublicSubnet1Subnet6CAA08D7"
      }
    }
    ));
    expect(stack).to(countResources("AWS::Cloud9::EnvironmentEC2", 1));
    expect(stack).to(haveResource("AWS::EC2::VPC", {
      CidrBlock: "10.0.0.0/16",
      EnableDnsHostnames: true,
      EnableDnsSupport: true,
      InstanceTenancy: "default",
      Tags: [
        {
          Key: "Name",
          Value: "C9Env/Vpc"
        }
      ]
    }
    ));
    test.done();
  },

  'with only vpc set, it correctly sets default properties'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new cloud9.EnvironmentEC2(stack, 'C9Env', {
      vpc,
     });

    // THEN
    expect(stack).to(haveResource("AWS::Cloud9::EnvironmentEC2", {
      InstanceType: "t2.micro",
      SubnetId: "pub1"
    }
    ));

    test.done();
  },

  'allow specifying instance type'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new cloud9.EnvironmentEC2(stack, 'C9Env', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.XLARGE)
    });

    // THEN
    expect(stack).to(haveResource("AWS::Cloud9::EnvironmentEC2", {
      InstanceType: "c5.xlarge",
      SubnetId: "pub1"
    }
    ));
    test.done();
  },

  'when subnetId and vpc both specified, select subnetId'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new cloud9.EnvironmentEC2(stack, 'C9Env', {
      vpc,
      subnetId: 'anotherId'
    });

    // THEN
    expect(stack).to(haveResource("AWS::Cloud9::EnvironmentEC2", {
      InstanceType: "t2.micro",
      SubnetId: "anotherId"
    }
    ));
    test.done();
  },

  'multiple environments with default properties'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    for (let i = 0; i < 2; i++) {
      new cloud9.EnvironmentEC2(stack, `C9Env${i}`);
    }

    // THEN
    expect(stack).to(countResources("AWS::Cloud9::EnvironmentEC2", 2));
    expect(stack).to(haveResource("AWS::EC2::VPC", {
      CidrBlock: "10.0.0.0/16",
      EnableDnsHostnames: true,
      EnableDnsSupport: true,
      InstanceTenancy: "default",
      Tags: [
        {
          Key: "Name",
          Value: "C9Env1/Vpc"
        }
      ]
    }
    ));
    test.done();
  },

  'import from existing environment'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new cloud9.EnvironmentEC2(stack, 'C9Env', { vpc });
    cloud9.EnvironmentEC2.fromEnvironmentEC2Name(stack, 'ImportedEnv', 'xxx');

    // THEN
    expect(stack).to(haveResource("AWS::Cloud9::EnvironmentEC2", {
    }
    ));

    test.done();
  },

  'custom environment'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    const c9env = new cloud9.EnvironmentEC2(stack, 'C9Env', {
      vpc,
      environmentEc2Name: 'MyCustomEnvName',
      description: 'my test env',
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.LARGE),
      subnetId: 'foo'
    });

    new cdk.CfnOutput(stack, 'URL', { value: c9env.ideUrl});
    // THEN
    expect(stack).to(haveResource("AWS::Cloud9::EnvironmentEC2", {
      InstanceType: "t3.large",
      Description: "my test env",
      Name: "MyCustomEnvName",
      SubnetId: "foo"
    }
    ));
    expect(stack).to(haveOutput({
      outputName: 'URL'
    }));

    test.done();
  },

};

function mockVpc(stack: cdk.Stack) {
  return ec2.Vpc.fromVpcAttributes(stack, 'MyVpc', {
    vpcId: 'my-vpc',
    availabilityZones: ['az1'],
    publicSubnetIds: ['pub1'],
    privateSubnetIds: ['pri1'],
    isolatedSubnetIds: [],
  });
}