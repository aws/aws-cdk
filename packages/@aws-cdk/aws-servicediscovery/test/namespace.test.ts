import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as servicediscovery from '../lib';

describe('namespace', () => {
  test('HTTP namespace', () => {
    const stack = new cdk.Stack();

    new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'foobar.com',
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyNamespaceD0BB8558: {
          Type: 'AWS::ServiceDiscovery::HttpNamespace',
          Properties: {
            Name: 'foobar.com',
          },
        },
      },
    });


  });

  test('Public DNS namespace', () => {
    const stack = new cdk.Stack();

    new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'foobar.com',
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyNamespaceD0BB8558: {
          Type: 'AWS::ServiceDiscovery::PublicDnsNamespace',
          Properties: {
            Name: 'foobar.com',
          },
        },
      },
    });


  });

  test('Private DNS namespace', () => {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc');

    new servicediscovery.PrivateDnsNamespace(stack, 'MyNamespace', {
      name: 'foobar.com',
      vpc,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::PrivateDnsNamespace', {
      Name: 'foobar.com',
      Vpc: {
        Ref: 'MyVpcF9F0CA6F',
      },
    });


  });
});
