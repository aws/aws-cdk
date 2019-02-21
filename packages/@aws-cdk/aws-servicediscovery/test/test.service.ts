import { expect } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import servicediscovery = require('../lib');

export = {
  'Service for HTTP namespace'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'http',
    });

    new servicediscovery.Service(stack, 'MyService', {
      namespace,
      name: 'service',
      description: 'service description',
      healthCheckCustomConfig: {
        failureThreshold: 3,
      }
    });

    // THEN
    expect(stack).toMatch({
      Resources: {
        MyNamespaceD0BB8558: {
          Type: "AWS::ServiceDiscovery::HttpNamespace",
          Properties: {
            Name: "http"
          },
        },
        MyServiceA1F951EB: {
          Type: "AWS::ServiceDiscovery::Service",
          Properties: {
            Description: "service description",
            HealthCheckCustomConfig: {
              FailureThreshold: 3,
            },
            Name: "service",
            NamespaceId: {
              "Fn::GetAtt": [
                "MyNamespaceD0BB8558",
                "Id"
              ]
            }
          }
        }
      }
    });

    test.done();
  },

  'Service for DNS namespace'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    new servicediscovery.Service(stack, 'MyService', {
      namespace,
      name: 'service',
      description: 'service description',
      healthCheckCustomConfig: {
        failureThreshold: 3,
      }
    });

    // THEN
    expect(stack).toMatch({
      Resources: {
        MyNamespaceD0BB8558: {
          Type: "AWS::ServiceDiscovery::PublicDnsNamespace",
          Properties: {
            Name: "dns"
          }
        },
        MyServiceA1F951EB: {
          Type: "AWS::ServiceDiscovery::Service",
          Properties: {
            Description: "service description",
            DnsConfig: {
              DnsRecords: [
                {
                  TTL: "60",
                  Type: "A"
                }
              ],
              NamespaceId: {
                "Fn::GetAtt": [
                  "MyNamespaceD0BB8558",
                  "Id"
                ]
              },
              RoutingPolicy: "MULTIVALUE"
            },
            HealthCheckCustomConfig: {
              FailureThreshold: 3
            },
            Name: "service",
            NamespaceId: {
              "Fn::GetAtt": [
                "MyNamespaceD0BB8558",
                "Id"
              ]
            }
          }
        }
      }
    });

    test.done();
  },

  'Service for DNS namespace with A and AAAA records'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    new servicediscovery.Service(stack, 'MyService', {
      namespace,
      dnsRecordType: servicediscovery.DnsRecordType.A_AAAA
    });

    // THEN
    expect(stack).toMatch({
      Resources: {
        MyNamespaceD0BB8558: {
          Type: "AWS::ServiceDiscovery::PublicDnsNamespace",
          Properties: {
            Name: "dns"
          }
        },
        MyServiceA1F951EB: {
          Type: "AWS::ServiceDiscovery::Service",
          Properties: {
            DnsConfig: {
              DnsRecords: [
                {
                  TTL: "60",
                  Type: "A, AAAA"
                },
              ],
              NamespaceId: {
                "Fn::GetAtt": [
                  "MyNamespaceD0BB8558",
                  "Id"
                ]
              },
              RoutingPolicy: "MULTIVALUE",
            },
            NamespaceId: {
              "Fn::GetAtt": [
                "MyNamespaceD0BB8558",
                "Id"
              ]
            }
          }
        }
      }
    });

    test.done();
  },

  'Defaults to weighted for CNAME'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'dns',
    });

    new servicediscovery.Service(stack, 'MyService', {
      namespace,
      dnsRecordType: servicediscovery.DnsRecordType.Cname
    });

    // THEN
    expect(stack).toMatch({
      Resources: {
        MyNamespaceD0BB8558: {
          Type: "AWS::ServiceDiscovery::PublicDnsNamespace",
          Properties: {
            Name: "dns"
          }
        },
        MyServiceA1F951EB: {
          Type: "AWS::ServiceDiscovery::Service",
          Properties: {
            DnsConfig: {
              DnsRecords: [
                {
                  TTL: "60",
                  Type: "CNAME"
                }
              ],
              NamespaceId: {
                "Fn::GetAtt": [
                  "MyNamespaceD0BB8558",
                  "Id"
                ]
              },
              RoutingPolicy: "WEIGHTED",
            },
            NamespaceId: {
              "Fn::GetAtt": [
                "MyNamespaceD0BB8558",
                "Id"
              ]
            }
          }
        }
      }
    });

    test.done();
  },

  'Throws when specifying routingPolicy for an HTTP only namespace'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'name',
    });

    // THEN
    test.throws(() => {
      new servicediscovery.Service(stack, 'MyService', {
        namespace,
        name: 'service',
        routingPolicy: servicediscovery.RoutingPolicy.Multivalue
      });
    }, /`routingPolicy`/);

    test.done();
  },

  'Throws when specifying dnsRecord for an HTTP namespace'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'name',
    });

    // THEN
    test.throws(() => {
      new servicediscovery.Service(stack, 'MyService', {
        namespace,
        name: 'service',
        dnsRecordType: servicediscovery.DnsRecordType.A
      });
    }, /`dnsRecord`/);

    test.done();
  },

  'Throws when specifying both healthCheckConfig and healthCheckCustomCOnfig'(test: Test) {
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'name',
    });

    // THEN
    test.throws(() => {
      new servicediscovery.Service(stack, 'MyService', {
        namespace,
        name: 'service',
        healthCheckConfig: {
          resourcePath: '/'
        },
        healthCheckCustomConfig: {
          failureThreshold: 1
        }
      });
    }, /`healthCheckConfig`.+`healthCheckCustomConfig`/);

    test.done();
  },

  'Throws when specifying health check config for an Http Namespace'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
      name: 'name',
    });

    // THEN
    test.throws(() => {
      new servicediscovery.Service(stack, 'MyService', {
        namespace,
        name: 'service',
        healthCheckConfig: {
          resourcePath: '/'
        }
      });
    }, /`healthCheckConfig`/);

    test.done();
  },

  'Throws when using CNAME and Multivalue'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const namespace = new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
      name: 'name',
    });

    // THEN
    test.throws(() => {
      new servicediscovery.Service(stack, 'MyService', {
        namespace,
        name: 'service',
        dnsRecordType: servicediscovery.DnsRecordType.Cname,
        routingPolicy: servicediscovery.RoutingPolicy.Multivalue,
      });
    }, /`CNAME`.+`Multivalue`/);

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
      new servicediscovery.Service(stack, 'MyService', {
        namespace,
        name: 'service',
        healthCheckConfig: {
          type: servicediscovery.HealthCheckType.Tcp,
          resourcePath: '/check'
        }
      });
    }, /`resourcePath`.+`TCP`/);

    test.done();
  }

  // TODO add tests for Private DNS namespace
};
