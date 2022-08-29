import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';
import * as servicediscovery from '../lib';

describe('instance', () => {
  test('IpInstance for service in HTTP namespace', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    const service = namespace.createService('MyService', {
      name: 'service',
    });

    service.registerIpInstance('IpInstance', {
      ipv4: '10.0.0.0',
      ipv6: '0:0:0:0:0:ffff:a00:0',
      port: 443,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Instance', {
      InstanceAttributes: {
        AWS_INSTANCE_IPV4: '10.0.0.0',
        AWS_INSTANCE_IPV6: '0:0:0:0:0:ffff:a00:0',
        AWS_INSTANCE_PORT: '443',
      },
      ServiceId: {
        'Fn::GetAtt': [
          'MyNamespaceMyService365E2470',
          'Id',
        ],
      },
      InstanceId: 'MyNamespaceMyServiceIpInstanceBACEB9D2',
    });


  });

  test('IpInstance for service in PublicDnsNamespace', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'public',
    });

    const service = namespace.createService('MyService', {
      name: 'service',
      dnsRecordType: servicediscovery.DnsRecordType.A_AAAA,
    });

    service.registerIpInstance('IpInstance', {
      ipv4: '54.239.25.192',
      ipv6: '0:0:0:0:0:ffff:a00:0',
      port: 443,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Instance', {
      InstanceAttributes: {
        AWS_INSTANCE_IPV4: '54.239.25.192',
        AWS_INSTANCE_IPV6: '0:0:0:0:0:ffff:a00:0',
        AWS_INSTANCE_PORT: '443',
      },
      ServiceId: {
        'Fn::GetAtt': [
          'MyNamespaceMyService365E2470',
          'Id',
        ],
      },
      InstanceId: 'MyNamespaceMyServiceIpInstanceBACEB9D2',
    });


  });

  test('IpInstance for service in PrivateDnsNamespace', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc');

    const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'MyNamespace', {
      name: 'public',
      vpc,
    });

    const service = namespace.createService('MyService', {
      name: 'service',
      dnsRecordType: servicediscovery.DnsRecordType.A_AAAA,
    });

    service.registerIpInstance('IpInstance', {
      ipv4: '10.0.0.0',
      ipv6: '0:0:0:0:0:ffff:a00:0',
      port: 443,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Instance', {
      InstanceAttributes: {
        AWS_INSTANCE_IPV4: '10.0.0.0',
        AWS_INSTANCE_IPV6: '0:0:0:0:0:ffff:a00:0',
        AWS_INSTANCE_PORT: '443',
      },
      ServiceId: {
        'Fn::GetAtt': [
          'MyNamespaceMyService365E2470',
          'Id',
        ],
      },
      InstanceId: 'MyNamespaceMyServiceIpInstanceBACEB9D2',
    });


  });

  test('Registering IpInstance throws when omitting port for a service using SRV', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'public',
    });

    const service = namespace.createService('MyService', {
      name: 'service',
      dnsRecordType: servicediscovery.DnsRecordType.SRV,
    });

    // THEN
    expect(() => {
      service.registerIpInstance('IpInstance', {
        instanceId: 'id',
      });
    }).toThrow(/A `port` must be specified for a service using a `SRV` record./);


  });

  test('Registering IpInstance throws when omitting ipv4 and ipv6 for a service using SRV', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    const service = namespace.createService('MyService', {
      name: 'service',
      dnsRecordType: servicediscovery.DnsRecordType.SRV,
    });

    // THEN
    expect(() => {
      service.registerIpInstance('IpInstance', {
        port: 3306,
      });
    }).toThrow(/At least `ipv4` or `ipv6` must be specified for a service using a `SRV` record./);


  });

  test('Registering IpInstance throws when omitting ipv4 for a service using A records', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    const service = namespace.createService('MyService', {
      name: 'service',
      dnsRecordType: servicediscovery.DnsRecordType.A,
    });

    // THEN
    expect(() => {
      service.registerIpInstance('IpInstance', {
        port: 3306,
      });
    }).toThrow(/An `ipv4` must be specified for a service using a `A` record./);


  });

  test('Registering IpInstance throws when omitting ipv6 for a service using AAAA records', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    const service = namespace.createService('MyService', {
      name: 'service',
      dnsRecordType: servicediscovery.DnsRecordType.AAAA,
    });

    // THEN
    expect(() => {
      service.registerIpInstance('IpInstance', {
        port: 3306,
      });
    }).toThrow(/An `ipv6` must be specified for a service using a `AAAA` record./);


  });

  test('Registering IpInstance throws with wrong DNS record type', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    const service = namespace.createService('MyService', {
      name: 'service',
      dnsRecordType: servicediscovery.DnsRecordType.CNAME,
    });

    // THEN
    expect(() => {
      service.registerIpInstance('IpInstance', {
        port: 3306,
      });
    }).toThrow(/Service must support `A`, `AAAA` or `SRV` records to register this instance type./);


  });

  test('Registering AliasTargetInstance', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const vpc = new ec2.Vpc(stack, 'MyVPC');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'MyALB', { vpc });

    const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
      vpc,
    });

    const service = namespace.createService('MyService', {
      name: 'service',
      loadBalancer: true,
    });
    const customAttributes = { foo: 'bar' };

    service.registerLoadBalancer('Loadbalancer', alb, customAttributes);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Instance', {
      InstanceAttributes: {
        AWS_ALIAS_DNS_NAME: {
          'Fn::GetAtt': [
            'MyALB911A8556',
            'DNSName',
          ],
        },
        foo: 'bar',
      },
      ServiceId: {
        'Fn::GetAtt': [
          'MyNamespaceMyService365E2470',
          'Id',
        ],
      },
      InstanceId: 'MyNamespaceMyServiceLoadbalancerD1112A76',
    });


  });

  test('Throws when registering AliasTargetInstance with Http Namespace', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    const service = new servicediscovery.Service(stack, 'MyService', {
      namespace,
    });

    const vpc = new ec2.Vpc(stack, 'MyVPC');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'MyALB', { vpc });

    // THEN
    expect(() => {
      service.registerLoadBalancer('Loadbalancer', alb);
    }).toThrow(/Namespace associated with Service must be a DNS Namespace./);


  });

  // TODO shouldn't be allowed to do this if loadbalancer on ServiceProps is not set to true.
  test('Throws when registering AliasTargetInstance with wrong Routing Policy', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    const service = namespace.createService('MyService', {
      routingPolicy: servicediscovery.RoutingPolicy.MULTIVALUE,
    });

    const vpc = new ec2.Vpc(stack, 'MyVPC');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'MyALB', { vpc });

    // THEN
    expect(() => {
      service.registerLoadBalancer('Loadbalancer', alb);
    }).toThrow(/Service must use `WEIGHTED` routing policy./);


  });

  test('Register CnameInstance', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    const service = namespace.createService('MyService', {
      dnsRecordType: servicediscovery.DnsRecordType.CNAME,
    });

    service.registerCnameInstance('CnameInstance', {
      instanceCname: 'foo.com',
      customAttributes: { dogs: 'good' },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Instance', {
      InstanceAttributes: {
        AWS_INSTANCE_CNAME: 'foo.com',
        dogs: 'good',
      },
      ServiceId: {
        'Fn::GetAtt': [
          'MyNamespaceMyService365E2470',
          'Id',
        ],
      },
      InstanceId: 'MyNamespaceMyServiceCnameInstance0EB1C98D',
    });


  });

  test('Throws when registering CnameInstance for an HTTP namespace', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    const service = new servicediscovery.Service(stack, 'MyService', {
      namespace,
    });

    // THEN
    expect(() => {
      service.registerCnameInstance('CnameInstance', {
        instanceCname: 'foo.com',
      });
    }).toThrow(/Namespace associated with Service must be a DNS Namespace/);


  });

  test('Register NonIpInstance', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    const service = namespace.createService('MyService');

    service.registerNonIpInstance('NonIpInstance', {
      customAttributes: { dogs: 'good' },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Instance', {
      InstanceAttributes: {
        dogs: 'good',
      },
      ServiceId: {
        'Fn::GetAtt': [
          'MyNamespaceMyService365E2470',
          'Id',
        ],
      },
      InstanceId: 'MyNamespaceMyServiceNonIpInstance7EFD703A',
    });


  });

  test('Register NonIpInstance, DNS Namespace, API Only service', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(
      stack,
      'MyNamespace',
      {
        name: 'http',
      },
    );

    const service = namespace.createService('MyService', { discoveryType: servicediscovery.DiscoveryType.API } );

    service.registerNonIpInstance('NonIpInstance', {
      customAttributes: { dogs: 'good' },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(
      'AWS::ServiceDiscovery::Instance',
      {
        InstanceAttributes: {
          dogs: 'good',
        },
        ServiceId: {
          'Fn::GetAtt': ['MyNamespaceMyService365E2470', 'Id'],
        },
        InstanceId: 'MyNamespaceMyServiceNonIpInstance7EFD703A',
      },
    );
  });

  test('Throws when registering NonIpInstance for an DNS discoverable service', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    const service = namespace.createService('MyService');

    // THEN
    expect(() => {
      service.registerNonIpInstance('NonIpInstance', {
        instanceId: 'nonIp',
      });
    }).toThrow(/This type of instance can only be registered for HTTP namespaces./);


  });

  test('Throws when no custom attribues specified for NonIpInstance', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    const service = namespace.createService('MyService');

    // THEN
    expect(() => {
      service.registerNonIpInstance('NonIpInstance', {
        instanceId: 'nonIp',
      });
    }).toThrow(/You must specify at least one custom attribute for this instance type./);


  });

  test('Throws when custom attribues are emptyfor NonIpInstance', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    const service = namespace.createService('MyService');

    // THEN
    expect(() => {
      service.registerNonIpInstance('NonIpInstance', {
        instanceId: 'nonIp',
        customAttributes: {},
      });
    }).toThrow(/You must specify at least one custom attribute for this instance type./);


  });

  test('Register multiple instances on the same service', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'public',
    });

    const service = namespace.createService('MyService');

    // WHEN
    service.registerIpInstance('First', {
      ipv4: '10.0.0.0',
    });

    service.registerIpInstance('Second', {
      ipv4: '10.0.0.1',
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::ServiceDiscovery::Instance', 2);


  });
});
