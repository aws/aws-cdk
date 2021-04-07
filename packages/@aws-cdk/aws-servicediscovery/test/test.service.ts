import { expect, haveResource } from '@aws-cdk/assert-internal';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as servicediscovery from '../lib';

export = {
  'Service for HTTP namespace with custom health check'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    namespace.createService('MyService', {
      name: 'service',
      description: 'service description',
      customHealthCheck: {
        failureThreshold: 3,
      },
    });

    // THEN
    expect(stack).toMatch({
      Resources: {
        MyNamespaceD0BB8558: {
          Type: 'AWS::ServiceDiscovery::HttpNamespace',
          Properties: {
            Name: 'http',
          },
        },
        MyNamespaceMyService365E2470: {
          Type: 'AWS::ServiceDiscovery::Service',
          Properties: {
            Description: 'service description',
            HealthCheckCustomConfig: {
              FailureThreshold: 3,
            },
            Name: 'service',
            NamespaceId: {
              'Fn::GetAtt': [
                'MyNamespaceD0BB8558',
                'Id',
              ],
            },
          },
        },
      },
    });

    test.done();
  },

  'Service for HTTP namespace with health check'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    namespace.createService('MyService', {
      name: 'service',
      description: 'service description',
      healthCheck: {
        type: servicediscovery.HealthCheckType.HTTP,
        resourcePath: '/check',
      },
    });

    // THEN
    expect(stack).toMatch({
      Resources: {
        MyNamespaceD0BB8558: {
          Type: 'AWS::ServiceDiscovery::HttpNamespace',
          Properties: {
            Name: 'http',
          },
        },
        MyNamespaceMyService365E2470: {
          Type: 'AWS::ServiceDiscovery::Service',
          Properties: {
            Description: 'service description',
            HealthCheckConfig: {
              FailureThreshold: 1,
              ResourcePath: '/check',
              Type: 'HTTP',
            },
            Name: 'service',
            NamespaceId: {
              'Fn::GetAtt': [
                'MyNamespaceD0BB8558',
                'Id',
              ],
            },
          },
        },
      },
    });

    test.done();
  },

  'Service for Public DNS namespace'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    namespace.createService('MyService', {
      name: 'service',
      description: 'service description',
      customHealthCheck: {
        failureThreshold: 3,
      },
    });

    // THEN
    expect(stack).toMatch({
      Resources: {
        MyNamespaceD0BB8558: {
          Type: 'AWS::ServiceDiscovery::PublicDnsNamespace',
          Properties: {
            Name: 'dns',
          },
        },
        MyNamespaceMyService365E2470: {
          Type: 'AWS::ServiceDiscovery::Service',
          Properties: {
            Description: 'service description',
            DnsConfig: {
              DnsRecords: [
                {
                  TTL: 60,
                  Type: 'A',
                },
              ],
              NamespaceId: {
                'Fn::GetAtt': [
                  'MyNamespaceD0BB8558',
                  'Id',
                ],
              },
              RoutingPolicy: 'MULTIVALUE',
            },
            HealthCheckCustomConfig: {
              FailureThreshold: 3,
            },
            Name: 'service',
            NamespaceId: {
              'Fn::GetAtt': [
                'MyNamespaceD0BB8558',
                'Id',
              ],
            },
          },
        },
      },
    });

    test.done();
  },

  'Service for Public DNS namespace with A and AAAA records'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    namespace.createService('MyService', {
      dnsRecordType: servicediscovery.DnsRecordType.A_AAAA,
    });

    // THEN
    expect(stack).toMatch({
      Resources: {
        MyNamespaceD0BB8558: {
          Type: 'AWS::ServiceDiscovery::PublicDnsNamespace',
          Properties: {
            Name: 'dns',
          },
        },
        MyNamespaceMyService365E2470: {
          Type: 'AWS::ServiceDiscovery::Service',
          Properties: {
            DnsConfig: {
              DnsRecords: [
                {
                  TTL: 60,
                  Type: 'A',
                },
                {
                  TTL: 60,
                  Type: 'AAAA',
                },
              ],
              NamespaceId: {
                'Fn::GetAtt': [
                  'MyNamespaceD0BB8558',
                  'Id',
                ],
              },
              RoutingPolicy: 'MULTIVALUE',
            },
            NamespaceId: {
              'Fn::GetAtt': [
                'MyNamespaceD0BB8558',
                'Id',
              ],
            },
          },
        },
      },
    });

    test.done();
  },

  'Defaults to WEIGHTED routing policy for CNAME'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    namespace.createService('MyService', {
      dnsRecordType: servicediscovery.DnsRecordType.CNAME,
    });

    // THEN
    expect(stack).toMatch({
      Resources: {
        MyNamespaceD0BB8558: {
          Type: 'AWS::ServiceDiscovery::PublicDnsNamespace',
          Properties: {
            Name: 'dns',
          },
        },
        MyNamespaceMyService365E2470: {
          Type: 'AWS::ServiceDiscovery::Service',
          Properties: {
            DnsConfig: {
              DnsRecords: [
                {
                  TTL: 60,
                  Type: 'CNAME',
                },
              ],
              NamespaceId: {
                'Fn::GetAtt': [
                  'MyNamespaceD0BB8558',
                  'Id',
                ],
              },
              RoutingPolicy: 'WEIGHTED',
            },
            NamespaceId: {
              'Fn::GetAtt': [
                'MyNamespaceD0BB8558',
                'Id',
              ],
            },
          },
        },
      },
    });

    test.done();
  },

  'Throws when specifying both healthCheckConfig and healthCheckCustomConfig on PublicDnsNamespace'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'name',
    });

    // THEN
    test.throws(() => {
      namespace.createService('MyService', {
        name: 'service',
        healthCheck: {
          resourcePath: '/',
        },
        customHealthCheck: {
          failureThreshold: 1,
        },
      });
    }, /`healthCheckConfig`.+`healthCheckCustomConfig`/);

    test.done();
  },

  'Throws when specifying healthCheckConfig on PrivateDnsNamespace'(test: Test) {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc');

    const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'MyNamespace', {
      name: 'name',
      vpc,
    });

    // THEN
    test.throws(() => {
      namespace.createService('MyService', {
        name: 'service',
        healthCheck: {
          resourcePath: '/',
        },
        customHealthCheck: {
          failureThreshold: 1,
        },
      });
    }, /`healthCheckConfig`.+`healthCheckCustomConfig`/);

    test.done();
  },

  'Throws when using CNAME and Multivalue routing policy'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'name',
    });

    // THEN
    test.throws(() => {
      namespace.createService('MyService', {
        name: 'service',
        dnsRecordType: servicediscovery.DnsRecordType.CNAME,
        routingPolicy: servicediscovery.RoutingPolicy.MULTIVALUE,
      });
    }, /Cannot use `CNAME` record when routing policy is `Multivalue`./);

    test.done();
  },

  'Throws when specifying resourcePath with TCP'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'name',
    });

    // THEN
    test.throws(() => {
      namespace.createService('MyService', {
        name: 'service',
        healthCheck: {
          type: servicediscovery.HealthCheckType.TCP,
          resourcePath: '/check',
        },
      });
    }, /`resourcePath`.+`TCP`/);

    test.done();
  },

  'Throws when specifying loadbalancer with wrong DnsRecordType'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'name',
    });

    // THEN
    test.throws(() => {
      namespace.createService('MyService', {
        name: 'service',
        dnsRecordType: servicediscovery.DnsRecordType.CNAME,
        loadBalancer: true,
      });
    }, /Must support `A` or `AAAA` records to register loadbalancers/);

    test.done();
  },

  'Throws when specifying loadbalancer with Multivalue routing Policy'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    // THEN
    test.throws(() => {
      namespace.createService('MyService', {
        loadBalancer: true,
        routingPolicy: servicediscovery.RoutingPolicy.MULTIVALUE,
      });
    }, /Cannot register loadbalancers when routing policy is `Multivalue`./);

    test.done();
  },

  'Service for Private DNS namespace'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc');

    const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'MyNamespace', {
      name: 'private',
      vpc,
    });

    namespace.createService('MyService', {
      name: 'service',
      description: 'service description',
    });

    // THEN
    expect(stack).to(haveResource('AWS::ServiceDiscovery::PrivateDnsNamespace', {
      Name: 'private',
    }));

    expect(stack).to(haveResource('AWS::ServiceDiscovery::Service', {
      Description: 'service description',
      DnsConfig: {
        DnsRecords: [
          {
            TTL: 60,
            Type: 'A',
          },
        ],
        NamespaceId: {
          'Fn::GetAtt': [
            'MyNamespaceD0BB8558',
            'Id',
          ],
        },
        RoutingPolicy: 'MULTIVALUE',
      },
      Name: 'service',
      NamespaceId: {
        'Fn::GetAtt': [
          'MyNamespaceD0BB8558',
          'Id',
        ],
      },
    }));

    test.done();
  },
};
