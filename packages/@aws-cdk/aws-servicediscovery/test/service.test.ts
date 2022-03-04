import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as servicediscovery from '../lib';

describe('service', () => {
  test('Service for HTTP namespace with custom health check', () => {
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
    Template.fromStack(stack).templateMatches({
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


  });

  test('Service for HTTP namespace with health check', () => {
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
    Template.fromStack(stack).templateMatches({
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


  });

  test('Service for Public DNS namespace', () => {
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
    Template.fromStack(stack).templateMatches({
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


  });

  test('Service for Public DNS namespace with A and AAAA records', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    namespace.createService('MyService', {
      dnsRecordType: servicediscovery.DnsRecordType.A_AAAA,
    });

    // THEN
    Template.fromStack(stack).templateMatches({
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


  });

  test('Defaults to WEIGHTED routing policy for CNAME', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    namespace.createService('MyService', {
      dnsRecordType: servicediscovery.DnsRecordType.CNAME,
    });

    // THEN
    Template.fromStack(stack).templateMatches({
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


  });

  test('Throws when specifying both healthCheckConfig and healthCheckCustomConfig on PublicDnsNamespace', () => {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'name',
    });

    // THEN
    expect(() => {
      namespace.createService('MyService', {
        name: 'service',
        healthCheck: {
          resourcePath: '/',
        },
        customHealthCheck: {
          failureThreshold: 1,
        },
      });
    }).toThrow(/`healthCheckConfig`.+`healthCheckCustomConfig`/);


  });

  test('Throws when specifying healthCheckConfig on PrivateDnsNamespace', () => {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc');

    const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'MyNamespace', {
      name: 'name',
      vpc,
    });

    // THEN
    expect(() => {
      namespace.createService('MyService', {
        name: 'service',
        healthCheck: {
          resourcePath: '/',
        },
        customHealthCheck: {
          failureThreshold: 1,
        },
      });
    }).toThrow(/`healthCheckConfig`.+`healthCheckCustomConfig`/);


  });

  test('Throws when using CNAME and Multivalue routing policy', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'name',
    });

    // THEN
    expect(() => {
      namespace.createService('MyService', {
        name: 'service',
        dnsRecordType: servicediscovery.DnsRecordType.CNAME,
        routingPolicy: servicediscovery.RoutingPolicy.MULTIVALUE,
      });
    }).toThrow(/Cannot use `CNAME` record when routing policy is `Multivalue`./);


  });

  test('Throws when specifying resourcePath with TCP', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'name',
    });

    // THEN
    expect(() => {
      namespace.createService('MyService', {
        name: 'service',
        healthCheck: {
          type: servicediscovery.HealthCheckType.TCP,
          resourcePath: '/check',
        },
      });
    }).toThrow(/`resourcePath`.+`TCP`/);


  });

  test('Throws when specifying loadbalancer with wrong DnsRecordType', () => {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'name',
    });

    // THEN
    expect(() => {
      namespace.createService('MyService', {
        name: 'service',
        dnsRecordType: servicediscovery.DnsRecordType.CNAME,
        loadBalancer: true,
      });
    }).toThrow(/Must support `A` or `AAAA` records to register loadbalancers/);


  });

  test('Throws when specifying loadbalancer with Multivalue routing Policy', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    // THEN
    expect(() => {
      namespace.createService('MyService', {
        loadBalancer: true,
        routingPolicy: servicediscovery.RoutingPolicy.MULTIVALUE,
      });
    }).toThrow(/Cannot register loadbalancers when routing policy is `Multivalue`./);


  });

  test('Service for Private DNS namespace', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::PrivateDnsNamespace', {
      Name: 'private',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Service', {
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
    });


  });
});
