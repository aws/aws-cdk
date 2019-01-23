import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import servicediscovery = require('../lib');

export = {
  'HTTP namespace'(test: Test) {
    const stack = new cdk.Stack();

    new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'foobar.com',
      type: servicediscovery.NamespaceType.Http,
    });

    expect(stack).toMatch({
      Resources: {
        MyNamespaceD0BB8558: {
          Type: "AWS::ServiceDiscovery::HttpNamespace",
          Properties: {
            Name: "foobar.com"
          }
        }
      }
    });

    test.done();
  },

  'Public DNS namespace'(test: Test) {
    const stack = new cdk.Stack();

    new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'foobar.com',
      type: servicediscovery.NamespaceType.DnsPublic,
    });

    expect(stack).toMatch({
      Resources: {
        MyNamespaceD0BB8558: {
          Type: "AWS::ServiceDiscovery::PublicDnsNamespace",
          Properties: {
            Name: "foobar.com"
          }
        }
      }
    });

    test.done();
  },

  'Private DNS namespace'(test: Test) {
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'MyVpc');

    new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'foobar.com',
      type: servicediscovery.NamespaceType.DnsPrivate,
      vpc
    });

    expect(stack).to(haveResource('AWS::ServiceDiscovery::PrivateDnsNamespace', {
      Name: "foobar.com",
      Vpc: {
        Ref: "MyVpcF9F0CA6F"
      }
    }));

    test.done();
  }
};
