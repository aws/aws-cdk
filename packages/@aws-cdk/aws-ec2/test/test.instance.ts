import { expect, haveResource } from '@aws-cdk/assert';
import { StringParameter } from '@aws-cdk/aws-ssm';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { AmazonLinuxImage, Instance, InstanceClass, InstanceSize, InstanceType, Vpc } from "../lib";

export = {
  'instance is created correctly'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    new Instance(stack, 'Instance', {
      vpc,
      machineImage: new AmazonLinuxImage(),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
    });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::Instance', {
      InstanceType: 't3.large',
    }));

    test.done();
  },
  'instance is created with source/dest check switched off'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    new Instance(stack, 'Instance', {
      vpc,
      machineImage: new AmazonLinuxImage(),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
      sourceDestCheck: false,
    });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::Instance', {
      InstanceType: 't3.large',
      SourceDestCheck: false,
    }));

    test.done();
  },
  'instance is grantable'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const param = new StringParameter(stack, 'Param', {stringValue: 'Foobar'});
    const instance = new Instance(stack, 'Instance', {
      vpc,
      machineImage: new AmazonLinuxImage(),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
    });

    // WHEN
    param.grantRead(instance);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              "ssm:DescribeParameters",
              "ssm:GetParameters",
              "ssm:GetParameter",
              "ssm:GetParameterHistory"
            ],
            Effect: "Allow",
            Resource: {
              "Fn::Join": [
                "",
                [
                  "arn:",
                  {
                    Ref: "AWS::Partition"
                  },
                  ":ssm:",
                  {
                    Ref: "AWS::Region"
                  },
                  ":",
                  {
                    Ref: "AWS::AccountId"
                  },
                  ":parameter/",
                  {
                    Ref: "Param165332EC"
                  }
                ]
              ]
            }
          }
        ],
        Version: "2012-10-17"
      },
    }));

    test.done();
  },
  'instance can be created with Private IP Address'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');

    // WHEN
    new Instance(stack, 'Instance', {
      vpc,
      machineImage: new AmazonLinuxImage(),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
      privateIpAddress: "10.0.0.2"
    });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::Instance', {
      InstanceType: 't3.large',
      PrivateIpAddress: '10.0.0.2'
    }));

    test.done();
  },
};
