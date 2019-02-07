import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import servicediscovery = require('../lib');

// to make it easy to copy & paste from output:
// tslint:disable:object-literal-key-quotes

export = {
  'HTTP only namespace'(test: Test) {
    const stack = new cdk.Stack();

    new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'http',
      httpOnly: true,
    });

    expect(stack).toMatch({
      "Resources": {
        "MyNamespaceD0BB8558": {
          "Type": "AWS::ServiceDiscovery::HttpNamespace",
          "Properties": {
            "Name": "http"
          }
        }
      }
    });

    test.done();
  },

  'Public DNS namespace'(test: Test) {
    const stack = new cdk.Stack();

    new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'name'
    });

    expect(stack).toMatch({
      "Resources": {
        "MyNamespaceD0BB8558": {
          "Type": "AWS::ServiceDiscovery::PublicDnsNamespace",
          "Properties": {
            "Name": "name"
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
      name: 'name',
      vpc
    });

    expect(stack).to(haveResource('AWS::ServiceDiscovery::PrivateDnsNamespace', {
      "Name": "name",
      "Vpc": {
        "Ref": "MyVpcF9F0CA6F"
      }
    }));

    test.done();
  }
};
