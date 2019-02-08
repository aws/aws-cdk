import { expect } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import servicediscovery = require('../lib');

// to make it easy to copy & paste from output:
// tslint:disable:object-literal-key-quotes

export = {
  'Service for HTTP namespace'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'http',
      httpOnly: true,
    });

    namespace.createService('MyService', {
      name: 'service',
      description: 'service description',
      healthCheckConfig: {
        failureThreshold: 3,
        type: servicediscovery.HealthCheckType.HTTP,
        resourcePath: '/check'
      }
    });

    expect(stack).toMatch({
      "Resources": {
        "MyNamespaceD0BB8558": {
          "Type": "AWS::ServiceDiscovery::HttpNamespace",
          "Properties": {
            "Name": "http"
          }
        },
        "MyNamespaceMyService365E2470": {
          "Type": "AWS::ServiceDiscovery::Service",
          "Properties": {
            "Description": "service description",
            "HealthCheckConfig": {
              "FailureThreshold": 3,
              "ResourcePath": "/check",
              "Type": "HTTP"
            },
            "Name": "service",
            "NamespaceId": {
              "Ref": "MyNamespaceD0BB8558"
            }
          }
        }
      }
    });

    test.done();
  },

  'Service for DNS namespace'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'dns'
    });

    namespace.createService('MyService', {
      name: 'service',
      description: 'service description',
      healthCheckConfig: {
        failureThreshold: 3,
      }
    });

    expect(stack).toMatch({
      "Resources": {
        "MyNamespaceD0BB8558": {
          "Type": "AWS::ServiceDiscovery::PublicDnsNamespace",
          "Properties": {
            "Name": "dns"
          }
        },
        "MyNamespaceMyService365E2470": {
          "Type": "AWS::ServiceDiscovery::Service",
          "Properties": {
            "Description": "service description",
            "DnsConfig": {
              "DnsRecords": [
                {
                  "TTL": "300",
                  "Type": "A"
                }
              ],
              "NamespaceId": {
                "Ref": "MyNamespaceD0BB8558"
              }
            },
            "HealthCheckCustomConfig": {
              "FailureThreshold": 3
            },
            "Name": "service",
            "NamespaceId": {
              "Ref": "MyNamespaceD0BB8558"
            }
          }
        }
      }
    });

    test.done();
  },
};
