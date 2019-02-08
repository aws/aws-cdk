import { expect } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import servicediscovery = require('../lib');

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
            "NamespaceId": {
              "Ref": "MyNamespaceD0BB8558"
            }
          }
        },
        "MyNamespaceMyServiceMyInstance562A88C1": {
          "Type": "AWS::ServiceDiscovery::Instance",
          "Properties": {
            "InstanceAttributes": {
              "AWS_INSTANCE_IPV4": "10.0.0.0",
              "AWS_INSTANCE_IPV6": "0:0:0:0:0:ffff:a00:0",
              "AWS_INSTANCE_PORT": "443",
              "key": "value"
            },
            "ServiceId": {
              "Fn::GetAtt": [
                "MyNamespaceMyService365E2470",
                "Id"
              ]
            },
            "InstanceId": "id"
          }
        }
      }
    });

    test.done();
  },

  'Throws when specifying both domainName for an HTTP namespace'(test: Test) {
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
