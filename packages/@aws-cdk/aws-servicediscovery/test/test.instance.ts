import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import servicediscovery = require('../lib');
import { RecordType } from '../lib';

// to make it easy to copy & paste from output:
// tslint:disable:object-literal-key-quotes

export = {
  'Instance for service in HTTP namespace'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'http',
      httpOnly: true,
    });

    const service = namespace.createService('MyService');

    service.registerInstance('MyInstance', {
      instanceId: 'id',
      instanceAttributes: {
        ipv4: '10.0.0.0',
        ipv6: '0:0:0:0:0:ffff:a00:0',
        port: '443',
        customAttributes: {
          key: 'value'
        }
      }
    });

    expect(stack).to(haveResource('AWS::ServiceDiscovery::Instance', {
      "InstanceAttributes": {
        "key": "value",
        "AWS_INSTANCE_IPV4": "10.0.0.0",
        "AWS_INSTANCE_IPV6": "0:0:0:0:0:ffff:a00:0",
        "AWS_INSTANCE_PORT": "443"
      },
      "ServiceId": {
        "Fn::GetAtt": [
          "MyNamespaceMyService365E2470",
          "Id"
        ]
      },
      "InstanceId": "id"
    }));

    test.done();
  },

  'Instance for a load balancer'(test: Test) {
    const stack = new cdk.Stack();

    const vpc = new ec2.VpcNetwork(stack, 'MyVPC');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'MyALB', { vpc });

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'dns',
      vpc
    });

    const service = namespace.createService('MyService');

    service.registerInstance('MyInstance', {
      instanceId: 'id',
      instanceAttributes: {
        loadBalancer: alb
      }
    });

    expect(stack).to(haveResource('AWS::ServiceDiscovery::Instance', {
      "InstanceAttributes": {
        "AWS_ALIAS_DNS_NAME": {
          "Fn::GetAtt": [
            "MyALB911A8556",
            "DNSName"
          ]
        }
      },
      "ServiceId": {
        "Fn::GetAtt": [
          "MyNamespaceMyService365E2470",
          "Id"
        ]
      },
      "InstanceId": "id"
    }));

    test.done();
  },

  'Instance with domain name'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'dns'
    });

    const service = namespace.createService('MyService', {
      dnsRecord: {
        type: RecordType.CNAME
      }
    });

    service.registerInstance('MyInstance', {
      instanceId: 'id',
      instanceAttributes: {
        domainName: 'a.b.c'
      }
    });

    expect(stack).to(haveResource('AWS::ServiceDiscovery::Instance', {
      "InstanceAttributes": {
        "AWS_INSTANCE_CNAME": "a.b.c",
      },
      "ServiceId": {
        "Fn::GetAtt": [
          "MyNamespaceMyService365E2470",
          "Id"
        ]
      },
      "InstanceId": "id"
    }));

    test.done();
  },

  'Throws when specifying both loadBalancer and domainName'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'http',
      httpOnly: true
    });

    const service = namespace.createService('MyService');

    const vpc = new ec2.VpcNetwork(stack, 'MyVPC');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'MyALB', { vpc });

    test.throws(() => service.registerInstance('MyInstance', {
      instanceId: 'id',
      instanceAttributes: {
        loadBalancer: alb,
        domainName: 'domain'
      }
    }), /`loadBalancer`.+`domainName`/);

    test.done();
  },

  'Throws when specifying loadBalancer for an HTTP only namespace'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'http',
      httpOnly: true
    });

    const service = namespace.createService('MyService');

    const vpc = new ec2.VpcNetwork(stack, 'MyVPC');
    const alb = new elbv2.ApplicationLoadBalancer(stack, 'MyALB', { vpc });

    test.throws(() => service.registerInstance('MyInstance', {
      instanceId: 'id',
      instanceAttributes: {
        loadBalancer: alb,
      }
    }), /`loadBalancer`/);

    test.done();
  },

  'Throws when specifying domainName for an HTTP namespace'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'http',
      httpOnly: true
    });

    const service = namespace.createService('MyService');

    test.throws(() => service.registerInstance('MyInstance', {
      instanceId: 'id',
      instanceAttributes: {
        domainName: 'domain'
      }
    }), /`domainName`/);

    test.done();
  },

  'Throws when omitting domainName for a service using CNAME'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'dns'
    });

    const service = namespace.createService('MyService', {
      dnsRecord: {
        type: servicediscovery.RecordType.CNAME,
        ttl: '300'
      }
    });

    test.throws(() => service.registerInstance('MyInstance', {
      instanceId: 'id',
      instanceAttributes: {
        customAttributes: {
          key: 'value'
        }
      }
    }), /`domainName`.+`CNAME`/);

    test.done();
  },

  'Throws when omitting port for a service using SRV'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'dns'
    });

    const service = namespace.createService('MyService', {
      dnsRecord: {
        type: servicediscovery.RecordType.SRV
      }
    });

    test.throws(() => service.registerInstance('MyInstance', {
      instanceId: 'id',
      instanceAttributes: {
        customAttributes: {
          key: 'value'
        }
      }
    }), /`port`.+`SRV`/);

    test.done();
  },

  'Throws when omitting ipv4 and ipv6 for a service using SRV'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'dns'
    });

    const service = namespace.createService('MyService', {
      dnsRecord: {
        type: servicediscovery.RecordType.SRV
      }
    });

    test.throws(() => service.registerInstance('MyInstance', {
      instanceId: 'id',
      instanceAttributes: {
        port: '3306'
      }
    }), /`ipv4`.+`ipv6`.+`SRV`/);

    test.done();
  },

  'Throws when omitting ipv4 for a service using A'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'dns'
    });

    const service = namespace.createService('MyService', {
      dnsRecord: {
        type: servicediscovery.RecordType.A
      }
    });

    test.throws(() => service.registerInstance('MyInstance', {
      instanceId: 'id',
      instanceAttributes: {
        port: '3306'
      }
    }), /`ipv4`.+`A`/);

    test.done();
  },

  'Throws when omitting ipv6 for a service using AAAA'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.Namespace(stack, 'MyNamespace', {
      name: 'dns'
    });

    const service = namespace.createService('MyService', {
      dnsRecord: {
        type: servicediscovery.RecordType.AAAA,
      }
    });

    test.throws(() => service.registerInstance('MyInstance', {
      instanceId: 'id',
      instanceAttributes: {
        port: '3306'
      }
    }), /`ipv6`.+`AAAA`/);

    test.done();
  }
};
