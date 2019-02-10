import { expect } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import servicediscovery = require('../lib');
import { RecordType } from '../lib';

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
      healthCheckCustomConfig: {
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
                  "TTL": "60",
                  "Type": "A"
                }
              ],
              "NamespaceId": {
                "Ref": "MyNamespaceD0BB8558"
              },
              "RoutingPolicy": "MULTIVALUE",
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

  'Service for DNS namespace with A and AAAA records'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'dns'
    });

    namespace.createService('MyService', {
      dnsRecord: {
        type: RecordType.A_AAAA
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
            "DnsConfig": {
              "DnsRecords": [
                {
                  "TTL": "60",
                  "Type": "A"
                },
                {
                  "TTL": "60",
                  "Type": "AAAA"
                }
              ],
              "NamespaceId": {
                "Ref": "MyNamespaceD0BB8558"
              },
              "RoutingPolicy": "MULTIVALUE",
            },
            "NamespaceId": {
              "Ref": "MyNamespaceD0BB8558"
            }
          }
        }
      }
    });

    test.done();
  },

  'Defaults to weighted for CNAME'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'dns'
    });

    namespace.createService('MyService', {
      dnsRecord: {
        type: RecordType.CNAME
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
            "DnsConfig": {
              "DnsRecords": [
                {
                  "TTL": "60",
                  "Type": "CNAME"
                }
              ],
              "NamespaceId": {
                "Ref": "MyNamespaceD0BB8558"
              },
              "RoutingPolicy": "WEIGHTED",
            },
            "NamespaceId": {
              "Ref": "MyNamespaceD0BB8558"
            }
          }
        }
      }
    });

    test.done();
  },

  'Throws when specifying routingPolicy for an HTTP only namespace'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'name',
      httpOnly: true
    });

    test.throws(() => namespace.createService('MyService', {
      routingPolicy: servicediscovery.RoutingPolicy.Multivalue
    }), /`routingPolicy`/);

    test.done();
  },

  'Throws when specifying dnsRecord for an HTTP only namespace'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'name',
      httpOnly: true
    });

    test.throws(() => namespace.createService('MyService', {
      dnsRecord: {
        type: servicediscovery.RecordType.A
      }
    }), /`dnsRecord`/);

    test.done();
  },

  'Throws when specifying both healthCheckConfig and healthCheckCustomCOnfig'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'name',
      httpOnly: true
    });

    test.throws(() => namespace.createService('MyService', {
      healthCheckConfig: {
        failureThreshold: 1
      },
      healthCheckCustomConfig: {
        resourcePath: '/'
      }
    }), /`healthCheckConfig`.+`healthCheckCustomConfig`/);

    test.done();
  },

  'Throws when specifying health check config for a DNS namespace'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'name'
    });

    test.throws(() => namespace.createService('MyService', {
      healthCheckConfig: {
        failureThreshold: 1
      }
    }), /`healthCheckConfig`/);

    test.done();
  },

  'Throws when using CNAME and Multivalue'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'name'
    });

    test.throws(() => namespace.createService('MyService', {
      dnsRecord: {
        type: servicediscovery.RecordType.CNAME
      },
      routingPolicy: servicediscovery.RoutingPolicy.Multivalue,
    }), /`CNAME`.+`Multivalue`/);

    test.done();
  },

  'Throws when specifying resourcePath with TCP'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'name',
      httpOnly: true,
    });

    test.throws(() => namespace.createService('MyService', {
      healthCheckConfig: {
        type: servicediscovery.HealthCheckType.TCP,
        resourcePath: '/check'
      }
    }), /`resourcePath`.+`TCP`/);

    test.done();
  }
};
