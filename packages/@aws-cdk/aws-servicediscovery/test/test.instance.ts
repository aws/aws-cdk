import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import servicediscovery = require('../lib');

export = {
  'Instance for service in HTTP namespace'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    const service = new servicediscovery.Service(stack, 'MyService', {
      namespace,
    });

    new servicediscovery.Instance(stack, 'MyInstance', {
      service,
      instanceId: "41332780-d796-feed-face-02252334a661",
      instanceAttributes: {
        ipv4: '10.0.0.0',
        ipv6: '0:0:0:0:0:ffff:a00:0',
        port: '443'
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::ServiceDiscovery::Instance', {
      InstanceAttributes: {
        AWS_INSTANCE_IPV4: "10.0.0.0",
        AWS_INSTANCE_IPV6: "0:0:0:0:0:ffff:a00:0",
        AWS_INSTANCE_PORT: "443"
      },
      ServiceId: {
        "Fn::GetAtt": [
          "MyServiceA1F951EB",
          "Id"
        ]
      },
      InstanceId: "41332780-d796-feed-face-02252334a661"
    }));

    test.done();
  },

  'Instance for a load balancer'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const vpc = new ec2.VpcNetwork(stack, 'MyVPC');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'MyALB', { vpc });

    const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
      vpc
    });

    const service = new servicediscovery.Service(stack, 'MyService', {
      namespace,
    });

    new servicediscovery.Instance(stack, 'MyInstance', {
      service,
      instanceId: 'id',
      instanceAttributes: {
        aliasDnsName: alb.asAliasRecordTarget().dnsName
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::ServiceDiscovery::Instance', {
      InstanceAttributes: {
        AWS_ALIAS_DNS_NAME: {
          "Fn::GetAtt": [
            "MyALB911A8556",
            "DNSName"
          ]
        }
      },
      ServiceId: {
        "Fn::GetAtt": [
          "MyServiceA1F951EB",
          "Id"
        ]
      },
      InstanceId: "id"
    }));

    test.done();
  },

  'Instance with domain name'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    const service = new servicediscovery.Service(stack, 'MyService', {
      namespace,
      dnsRecordType: servicediscovery.DnsRecordType.Cname
    });

    new servicediscovery.Instance(stack, 'MyInstance', {
      instanceId: 'id',
      service,
      instanceAttributes: {
        instanceCname: 'foo.com'
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::ServiceDiscovery::Instance', {
      InstanceAttributes: {
        AWS_INSTANCE_CNAME: "foo.com",
      },
      ServiceId: {
        "Fn::GetAtt": [
          "MyServiceA1F951EB",
          "Id"
        ]
      },
      InstanceId: "id"
    }));

    test.done();
  },

  'Throws when specifying both aliasDnsName and instanceCname'(test: Test) {
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
      new servicediscovery.Instance(stack, 'MyInstance', {
        service,
        instanceId: 'id',
        instanceAttributes: {
          aliasDnsName: 'alb.foo.com',
          instanceCname: 'domain'
        }
      });
    }, /Cannot specify both `aliasDnsName` and `instanceCname`/);

    test.done();
  },

  'Throws when specifying aliasDnsName for an HTTP only namespace'(test: Test) {
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
      new servicediscovery.Instance(stack, 'MyInstance', {
        service,
        instanceId: 'id',
        instanceAttributes: {
          aliasDnsName: "foo.com",
        }
      });
    }, /Cannot specify `aliasDnsName` or `instanceCname` for an HTTP namespace./);

    test.done();
  },

  'Throws when specifying instanceCname for an HTTP namespace'(test: Test) {
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
      new servicediscovery.Instance(stack, 'MyInstance', {
        service,
        instanceId: 'id',
        instanceAttributes: {
          instanceCname: "domain",
        }
      });
    }, /Cannot specify `aliasDnsName` or `instanceCname` for an HTTP namespace./);

    test.done();
  },

  'Throws when omitting instanceCname for a service using CNAME'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    const service = new servicediscovery.Service(stack, 'MyService', {
      namespace,
      dnsRecordType: servicediscovery.DnsRecordType.Cname,
      dnsTtlSec: 300
    });

    // THEN
    test.throws(() => {
      new servicediscovery.Instance(stack, 'MyInstance', {
        service,
        instanceId: 'id',
        instanceAttributes: {}
      });
    }, /A `instanceCname` must be specified for a service using a `CNAME` record./);

    test.done();
  },

  'Throws when omitting port for a service using SRV'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    const service = new servicediscovery.Service(stack, 'MyService', {
      namespace,
      dnsRecordType: servicediscovery.DnsRecordType.Srv
    });

    // THEN
    test.throws(() => {
      new servicediscovery.Instance(stack, 'MyInstance', {
        service,
        instanceId: 'id',
        instanceAttributes: {}
      });
    }, /A `port` must be specified for a service using a `SRV` record./);

    test.done();
  },

  'Throws when omitting ipv4 and ipv6 for a service using SRV'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    const service = new servicediscovery.Service(stack, 'MyService', {
      namespace,
      dnsRecordType: servicediscovery.DnsRecordType.Srv
    });

    // THEN
    test.throws(() => {
      new servicediscovery.Instance(stack, 'MyInstance', {
        service,
        instanceId: 'id',
        instanceAttributes: {
          port: '3306'
        }
      });
    }, /At least `ipv4` or `ipv6` must be specified for a service using a `SRV` record./);

    test.done();
  },

  'Throws when omitting ipv4 for a service using A'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    const service = new servicediscovery.Service(stack, 'MyService', {
      namespace,
      dnsRecordType: servicediscovery.DnsRecordType.A
    });

    // THEN
    test.throws(() => {
      new servicediscovery.Instance(stack, 'MyInstance', {
        service,
        instanceId: 'id',
        instanceAttributes: {
          port: '3306'
        }
      });
    }, /An `ipv4` must be specified for a service using a `A` record./);

    test.done();
  },

  'Throws when omitting ipv6 for a service using AAAA'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    const service = new servicediscovery.Service(stack, 'MyService', {
      namespace,
      dnsRecordType: servicediscovery.DnsRecordType.AAAA
    });

    // THEN
    test.throws(() => {
      new servicediscovery.Instance(stack, 'MyInstance', {
        service,
        instanceId: 'id',
        instanceAttributes: {
          port: '3306'
        }
      });
    }, /An `ipv6` must be specified for a service using a `AAAA` record./);

    test.done();
  }
};
