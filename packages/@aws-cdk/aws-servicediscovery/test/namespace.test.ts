import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { CfnOutput } from '@aws-cdk/core';
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

  test('CloudFormation attributes', () => {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc');

    const privateNs = new servicediscovery.PrivateDnsNamespace(stack, 'MyPrivateNamespace', {
      name: 'foobar.com',
      vpc,
    });
    const publicNs = new servicediscovery.PrivateDnsNamespace(stack, 'MyPublicNamespace', {
      name: 'foobar.com',
      vpc,
    });
    new CfnOutput(stack, 'PrivateNsId', { value: privateNs.namespaceId });
    new CfnOutput(stack, 'PrivateNsArn', { value: privateNs.namespaceArn });
    new CfnOutput(stack, 'PrivateHostedZoneId', { value: privateNs.namespaceHostedZoneId });
    new CfnOutput(stack, 'PublicNsId', { value: publicNs.namespaceId });
    new CfnOutput(stack, 'PublicNsArn', { value: publicNs.namespaceArn });
    new CfnOutput(stack, 'PublicHostedZoneId', { value: publicNs.namespaceHostedZoneId });

    Template.fromStack(stack).hasOutput('PrivateNsId', {
      Value: {
        'Fn::GetAtt': [
          'MyPrivateNamespace8CB3AE39',
          'Id',
        ],
      },
    });
    Template.fromStack(stack).hasOutput('PrivateNsArn', {
      Value: {
        'Fn::GetAtt': [
          'MyPrivateNamespace8CB3AE39',
          'Arn',
        ],
      },
    });
    Template.fromStack(stack).hasOutput('PrivateHostedZoneId', {
      Value: {
        'Fn::GetAtt': [
          'MyPrivateNamespace8CB3AE39',
          'HostedZoneId',
        ],
      },
    });
    Template.fromStack(stack).hasOutput('PublicNsId', {
      Value: {
        'Fn::GetAtt': [
          'MyPublicNamespaceAB66AFAC',
          'Id',
        ],
      },
    });
    Template.fromStack(stack).hasOutput('PublicNsArn', {
      Value: {
        'Fn::GetAtt': [
          'MyPublicNamespaceAB66AFAC',
          'Arn',
        ],
      },
    });
    Template.fromStack(stack).hasOutput('PublicHostedZoneId', {
      Value: {
        'Fn::GetAtt': [
          'MyPublicNamespaceAB66AFAC',
          'HostedZoneId',
        ],
      },
    });
  });
});
