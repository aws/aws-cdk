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
  },

  'Export/import'(test: Test) {
    const stack1 = new cdk.Stack(undefined, 'S1');
    const namespace = new servicediscovery.Namespace(stack1, 'MyNamespace', {
      name: 'name'
    });

    const namespaceRef = namespace.export();

    expect(stack1).toMatch({
      "Resources": {
        "MyNamespaceD0BB8558": {
          "Type": "AWS::ServiceDiscovery::PublicDnsNamespace",
          "Properties": {
            "Name": "name"
          }
        }
      },
      "Outputs": {
        "MyNamespaceNamespaceId1F78B5C5": {
          "Value": {
            "Ref": "MyNamespaceD0BB8558"
          },
          "Export": {
            "Name": "S1:MyNamespaceNamespaceId1F78B5C5"
          }
        },
        "MyNamespaceNamespaceArn72A839B2": {
          "Value": {
            "Fn::GetAtt": [
              "MyNamespaceD0BB8558",
              "Arn"
            ]
          },
          "Export": {
            "Name": "S1:MyNamespaceNamespaceArn72A839B2"
          }
        },
        "MyNamespaceNamespaceNameA1D98C48": {
          "Value": "name",
          "Export": {
            "Name": "S1:MyNamespaceNamespaceNameA1D98C48"
          }
        },
        "MyNamespaceNamespaceHttpOnly77F1AD5A": {
          "Value": false,
          "Export": {
            "Name": "S1:MyNamespaceNamespaceHttpOnly77F1AD5A"
          }
        }
      }
    });

    const stack2 = new cdk.Stack(undefined, 'S2');
    const importedNamespace = servicediscovery.Namespace.import(stack2, 'ImportedNamespace', namespaceRef);

    importedNamespace.createService('MyService', { name: 'service'});

    expect(stack2).toMatch({
      "Resources": {
        "ImportedNamespaceMyServiceA61A61FA": {
          "Type": "AWS::ServiceDiscovery::Service",
          "Properties": {
            "Name": "service",
            "NamespaceId": {
              "Fn::ImportValue": "S1:MyNamespaceNamespaceId1F78B5C5"
            }
          }
        }
      }
    });

    test.done();
  }
};
