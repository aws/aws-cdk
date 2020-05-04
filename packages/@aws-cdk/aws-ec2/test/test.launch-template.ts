import { expect, haveResource } from '@aws-cdk/assert';
import { Stack, App } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { AmazonLinuxImage, Instance, InstanceClass, InstanceSize, InstanceType, LaunchTemplate, Vpc } from '../lib';
import * as path from 'path';
export = {
  'launchTemplate from id'(test: Test) {
    // WHEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    new Instance(stack, 'Instance', {
      vpc,
      machineImage: new AmazonLinuxImage(),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
      launchTemplate: LaunchTemplate.fromLaunchTemplateId('lt-082dc807e25331536', '1')
    });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::Instance', {
      LaunchTemplate: {
        LaunchTemplateId: "lt-082dc807e25331536",
        Version: "1"
      }
    }));
    test.done();
  },
  'launchTemplate from resource'(test: Test) {
    // WHEN
    const app = new App({
      outdir: path.join(__dirname, 'temp/')
    });
    const stack = new Stack(app, 'Stack');
    const vpc = new Vpc(stack, 'VPC');

    const launchTemplate = new LaunchTemplate(stack, 'LT', {
      machineImage: new AmazonLinuxImage(),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
      vpc
    });

    new Instance(stack, 'Instance', {
      vpc,
      machineImage: new AmazonLinuxImage(),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
      launchTemplate
    });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::Instance', {
      LaunchTemplate: {
        LaunchTemplateId: {
          Ref: 'LTC4631592'
        },
        Version: {
          'Fn::GetAtt': [
            'LTC4631592',
            'LatestVersionNumber'
          ]
        }
      }
    }));
    test.done();
  }
};
