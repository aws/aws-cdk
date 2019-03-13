import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import servicediscovery = require('../lib');

export = {
  'IpInstance for service in HTTP namespace'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    const service = namespace.createService('MyService', {
      name: 'service',
    });

    service.registerIpInstance({
      ipv4: '10.0.0.0',
      ipv6: '0:0:0:0:0:ffff:a00:0',
      port: 443
    });

    // THEN
    expect(stack).to(haveResource('AWS::ServiceDiscovery::Instance', {
      InstanceAttributes: {
        AWS_INSTANCE_IPV4: '10.0.0.0',
        AWS_INSTANCE_IPV6: '0:0:0:0:0:ffff:a00:0',
        AWS_INSTANCE_PORT: '443'
      },
      ServiceId: {
        'Fn::GetAtt': [
          'MyNamespaceMyService365E2470',
          'Id'
        ]
      },
      InstanceId: 'MyNamespaceMyServiceIpInstanceBACEB9D2'
    }));

    test.done();
  },

  'IpInstance for service in PublicDnsNamespace'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'public',
    });

    const service = namespace.createService('MyService', {
      name: 'service',
      dnsRecordType: servicediscovery.DnsRecordType.A_AAAA
    });

    service.registerIpInstance({
      ipv4: '54.239.25.192',
      ipv6: '0:0:0:0:0:ffff:a00:0',
      port: 443
    });

    // THEN
    expect(stack).to(haveResource('AWS::ServiceDiscovery::Instance', {
      InstanceAttributes: {
        AWS_INSTANCE_IPV4: '54.239.25.192',
        AWS_INSTANCE_IPV6: '0:0:0:0:0:ffff:a00:0',
        AWS_INSTANCE_PORT: '443'
      },
      ServiceId: {
        'Fn::GetAtt': [
          'MyNamespaceMyService365E2470',
          'Id'
        ]
      },
      InstanceId: 'MyNamespaceMyServiceIpInstanceBACEB9D2'
    }));

    test.done();
  },

  'IpInstance for service in PrivateDnsNamespace'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'MyVpc');

    const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'MyNamespace', {
      name: 'public',
      vpc
    });

    const service = namespace.createService('MyService', {
      name: 'service',
      dnsRecordType: servicediscovery.DnsRecordType.A_AAAA
    });

    service.registerIpInstance({
      ipv4: '10.0.0.0',
      ipv6: '0:0:0:0:0:ffff:a00:0',
      port: 443
    });

    // THEN
    expect(stack).to(haveResource('AWS::ServiceDiscovery::Instance', {
      InstanceAttributes: {
        AWS_INSTANCE_IPV4: '10.0.0.0',
        AWS_INSTANCE_IPV6: '0:0:0:0:0:ffff:a00:0',
        AWS_INSTANCE_PORT: '443'
      },
      ServiceId: {
        'Fn::GetAtt': [
          'MyNamespaceMyService365E2470',
          'Id'
        ]
      },
      InstanceId: 'MyNamespaceMyServiceIpInstanceBACEB9D2'
    }));

    test.done();
  },

  'Registering IpInstance throws when omitting port for a service using SRV'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'public',
    });

    const service = namespace.createService('MyService', {
      name: 'service',
      dnsRecordType: servicediscovery.DnsRecordType.SRV
    });

    // THEN
    test.throws(() => {
      service.registerIpInstance({
        instanceId: 'id',
      });
    }, /A `port` must be specified for a service using a `SRV` record./);

    test.done();
  },

  'Registering IpInstance throws when omitting ipv4 and ipv6 for a service using SRV'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    const service = namespace.createService('MyService', {
      name: 'service',
      dnsRecordType: servicediscovery.DnsRecordType.SRV
    });

    // THEN
    test.throws(() => {
      service.registerIpInstance({
        port: 3306
      });
    }, /At least `ipv4` or `ipv6` must be specified for a service using a `SRV` record./);

    test.done();
  },

  'Registering IpInstance throws when omitting ipv4 for a service using A records'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    const service = namespace.createService('MyService', {
      name: 'service',
      dnsRecordType: servicediscovery.DnsRecordType.A
    });

    // THEN
    test.throws(() => {
      service.registerIpInstance({
        port: 3306
      });
    }, /An `ipv4` must be specified for a service using a `A` record./);

    test.done();
  },

  'Registering IpInstance throws when omitting ipv6 for a service using AAAA records'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    const service = namespace.createService('MyService', {
      name: 'service',
      dnsRecordType: servicediscovery.DnsRecordType.AAAA
    });

    // THEN
    test.throws(() => {
      service.registerIpInstance({
        port: 3306
      });
    }, /An `ipv6` must be specified for a service using a `AAAA` record./);

    test.done();
  },

  'Registering IpInstance throws with wrong DNS record type'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    const service = namespace.createService('MyService', {
      name: 'service',
      dnsRecordType: servicediscovery.DnsRecordType.CNAME
    });

    // THEN
    test.throws(() => {
      service.registerIpInstance({
        port: 3306
      });
    }, /Service must support `A`, `AAAA` or `SRV` records to register this instance type./);

    test.done();
  },

  'Registering AliasTargetInstance'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const vpc = new ec2.VpcNetwork(stack, 'MyVPC');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'MyALB', { vpc });

    const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
      vpc
    });

    const service = namespace.createService('MyService', {
      name: 'service',
      loadBalancer: true,
    });
    const customAttributes = { foo: 'bar' };

    service.registerLoadBalancer("Loadbalancer", alb, customAttributes);

    // THEN
    expect(stack).to(haveResource('AWS::ServiceDiscovery::Instance', {
      InstanceAttributes: {
        AWS_ALIAS_DNS_NAME: {
          'Fn::GetAtt': [
            'MyALB911A8556',
            'DNSName'
          ]
        },
        foo: 'bar'
      },
      ServiceId: {
        'Fn::GetAtt': [
          'MyNamespaceMyService365E2470',
          'Id'
        ]
      },
      InstanceId: 'MyNamespaceMyServiceLoadbalancerD1112A76'
    }));

    test.done();
  },

  'Throws when registering AliasTargetInstance with Http Namespace'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    const service = new servicediscovery.Service(stack, 'MyService', {
      namespace,
    });

    const vpc = new ec2.VpcNetwork(stack, 'MyVPC');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'MyALB', { vpc });

    // THEN
    test.throws(() => {
      service.registerLoadBalancer("Loadbalancer", alb);
    }, /Namespace associated with Service must be a DNS Namespace./);

    test.done();
  },

  // TODO shouldn't be allowed to do this if loadbalancer on ServiceProps is not set to true.
  'Throws when registering AliasTargetInstance with wrong Routing Policy'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    const service = namespace.createService('MyService', {
      routingPolicy: servicediscovery.RoutingPolicy.Multivalue
    });

    const vpc = new ec2.VpcNetwork(stack, 'MyVPC');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'MyALB', { vpc });

    // THEN
    test.throws(() => {
      service.registerLoadBalancer("Loadbalancer", alb);
    }, /Service must use `WEIGHTED` routing policy./);

    test.done();
  },

  'Register CnameInstance'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    const service = namespace.createService('MyService', {
      dnsRecordType: servicediscovery.DnsRecordType.CNAME
    });

    service.registerCnameInstance({
      instanceCname: 'foo.com',
      customAttributes: { dogs: 'good' }
    });

    // THEN
    expect(stack).to(haveResource('AWS::ServiceDiscovery::Instance', {
      InstanceAttributes: {
        AWS_INSTANCE_CNAME: 'foo.com',
        dogs: 'good'
      },
      ServiceId: {
        'Fn::GetAtt': [
          'MyNamespaceMyService365E2470',
          'Id'
        ]
      },
      InstanceId: 'MyNamespaceMyServiceCnameInstance0EB1C98D'
    }));

    test.done();
  },

  'Throws when registering CnameInstance for an HTTP namespace'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    const service = new servicediscovery.Service(stack, 'MyService', {
      namespace,
    });

    // THEN
    test.throws(() => {
      service.registerCnameInstance({
        instanceCname: 'foo.com',
      });
    }, /Namespace associated with Service must be a DNS Namespace/);

    test.done();
  },

  'Register NonIpInstance'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    const service = namespace.createService('MyService');

    service.registerNonIpInstance({
      customAttributes: { dogs: 'good' }
    });

    // THEN
    expect(stack).to(haveResource('AWS::ServiceDiscovery::Instance', {
      InstanceAttributes: {
        dogs: 'good'
      },
      ServiceId: {
        'Fn::GetAtt': [
          'MyNamespaceMyService365E2470',
          'Id'
        ]
      },
      InstanceId: 'MyNamespaceMyServiceNonIpInstance7EFD703A'
    }));

    test.done();
  },

  'Throws when registering NonIpInstance for an Public namespace'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    const service = namespace.createService('MyService');

    // THEN
    test.throws(() => {
      service.registerNonIpInstance({
        instanceId: 'nonIp',
      });
    }, /This type of instance can only be registered for HTTP namespaces./);

    test.done();
  },

  'Throws when no custom attribues specified for NonIpInstance'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    const service = namespace.createService('MyService');

    // THEN
    test.throws(() => {
      service.registerNonIpInstance({
        instanceId: 'nonIp',
      });
    }, /You must specify at least one custom attribute for this instance type./);

    test.done();
  },

  'Throws when custom attribues are emptyfor NonIpInstance'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    const service = namespace.createService('MyService');

    // THEN
    test.throws(() => {
      service.registerNonIpInstance({
        instanceId: 'nonIp',
        customAttributes: {}
      });
    }, /You must specify at least one custom attribute for this instance type./);

    test.done();
  },
};
