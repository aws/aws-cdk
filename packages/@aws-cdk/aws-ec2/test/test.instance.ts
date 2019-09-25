import { expect, haveResource } from '@aws-cdk/assert';
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
};
