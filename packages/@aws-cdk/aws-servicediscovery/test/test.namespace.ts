import { expect, haveResource } from '@aws-cdk/assert-internal';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as servicediscovery from '../lib';

export = {
  'HTTP namespace'(test: Test) {
    const stack = new cdk.Stack();

    new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'foobar.com',
    });

    expect(stack).toMatch({
      Resources: {
        MyNamespaceD0BB8558: {
          Type: 'AWS::ServiceDiscovery::HttpNamespace',
          Properties: {
            Name: 'foobar.com',
          },
        },
      },
    });

    test.done();
  },

  'Public DNS namespace'(test: Test) {
    const stack = new cdk.Stack();

    new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'foobar.com',
    });

    expect(stack).toMatch({
      Resources: {
        MyNamespaceD0BB8558: {
          Type: 'AWS::ServiceDiscovery::PublicDnsNamespace',
          Properties: {
            Name: 'foobar.com',
          },
        },
      },
    });

    test.done();
  },

  'Private DNS namespace'(test: Test) {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc');

    new servicediscovery.PrivateDnsNamespace(stack, 'MyNamespace', {
      name: 'foobar.com',
      vpc,
    });

    expect(stack).to(haveResource('AWS::ServiceDiscovery::PrivateDnsNamespace', {
      Name: 'foobar.com',
      Vpc: {
        Ref: 'MyVpcF9F0CA6F',
      },
    }));

    test.done();
  },
};
