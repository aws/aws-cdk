import { expect, haveResource } from '@aws-cdk/assert';
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import { App, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { EndpointHealthCheckRequestInterval } from "../lib";
import route53 = require('../lib');

export = {
  Endpoint: {
    'IP Address': {
      basic(test: Test) {
        // GIVEN
        const stack = new Stack();

        // WHEN
        route53.EndpointHealthCheck.ipAddress(stack, 'HealthCheck', {
          ipAddress: '1.1.1.1',
          protocol: route53.EndpointHealthCheckProtocol.http(),
        });

        // THEN
        expect(stack).to(haveResource('AWS::Route53::HealthCheck', {
          HealthCheckConfig: {
            IPAddress: "1.1.1.1",
            Port: 80,
            ResourcePath: "/",
            Type: "HTTP"
          }
        }));
        test.done();
      },
      IPv6(test: Test) {
        // GIVEN
        const stack = new Stack();

        // WHEN
        route53.EndpointHealthCheck.ipAddress(stack, 'HealthCheck', {
          ipAddress: '::',
          protocol: route53.EndpointHealthCheckProtocol.http(),
        });

        // THEN
        expect(stack).to(haveResource('AWS::Route53::HealthCheck', {
          HealthCheckConfig: {
            IPAddress: "::",
            Port: 80,
            ResourcePath: "/",
            Type: "HTTP"
          }
        }));
        test.done();
      },
      advanced(test: Test) {
        // GIVEN
        const stack = new Stack();

        // WHEN
        route53.EndpointHealthCheck.ipAddress(stack, 'HealthCheck', {
          ipAddress: '1.1.1.1',
          fullyQualifiedDomainName: 'example.com',
          protocol: route53.EndpointHealthCheckProtocol.http(),
          inverted: true,
          failureThreshold: 9,
          measureLatency: true,
          regions: ['us-west-1', 'us-east-1', 'eu-west-3'],
          requestInterval: EndpointHealthCheckRequestInterval.FAST,
        });

        // THEN
        expect(stack).to(haveResource('AWS::Route53::HealthCheck', {
          HealthCheckConfig: {
            FailureThreshold: 9,
            FullyQualifiedDomainName: "example.com",
            IPAddress: "1.1.1.1",
            Inverted: true,
            MeasureLatency: true,
            Port: 80,
            Regions: [
              "us-west-1",
              "us-east-1",
              "eu-west-3"
            ],
            RequestInterval: 10,
            ResourcePath: "/",
            Type: "HTTP"
          }
        }));
        test.done();
      },
    },
    'Domain name': {
      basic(test: Test) {
        // GIVEN
        const stack = new Stack();

        // WHEN
        route53.EndpointHealthCheck.domainName(stack, 'HealthCheck', {
          fullyQualifiedDomainName: 'example.com',
          protocol: route53.EndpointHealthCheckProtocol.http(),
        });

        // THEN
        expect(stack).to(haveResource('AWS::Route53::HealthCheck', {
          HealthCheckConfig: {
            FullyQualifiedDomainName: "example.com",
            Port: 80,
            ResourcePath: "/",
            Type: "HTTP"
          }
        }));
        test.done();
      },
    },
    'Errors': {
      'throws if invalid IP address'(test: Test) {
        // GIVEN
        const stack = new Stack();

        // THEN
        test.throws(() => {
          route53.EndpointHealthCheck.ipAddress(stack, 'HealthCheck', {
            ipAddress: '1',
            fullyQualifiedDomainName: 'example.com',
            protocol: route53.EndpointHealthCheckProtocol.http(),
          });
        }, /Invalid ipAddress: expected valid IPv4 or IPv6 address/);
        test.done();
      },
      'throws if IP, TCP and domain name'(test: Test) {
        // GIVEN
        const stack = new Stack();

        // THEN
        test.throws(() => {
          route53.EndpointHealthCheck.ipAddress(stack, 'HealthCheck', {
            ipAddress: '1.1.1.1',
            fullyQualifiedDomainName: 'example.com',
            protocol: route53.EndpointHealthCheckProtocol.tcp(8080),
          });
        }, /fullyQualifiedDomainName will be ignored with a TCP protocol/);
        test.done();
      },
      'throws if not enough regions'(test: Test) {
        // GIVEN
        const stack = new Stack();

        // THEN
        test.throws(() => {
          route53.EndpointHealthCheck.ipAddress(stack, 'HealthCheck', {
            ipAddress: '1.1.1.1',
            protocol: route53.EndpointHealthCheckProtocol.http(),
            regions: ['foo', 'bar'],
          });
        }, 'If set, regions must contain at least 3, got 2 ([foo, bar])');
        test.done();
      },
      'throws if not empty regions'(test: Test) {
        // GIVEN
        const stack = new Stack();

        // THEN
        test.throws(() => {
          route53.EndpointHealthCheck.ipAddress(stack, 'HealthCheck', {
            ipAddress: '1.1.1.1',
            protocol: route53.EndpointHealthCheckProtocol.http(),
            regions: [],
          });
        }, 'If set, regions must contain at least 3, got 0 ([])');
        test.done();
      },
      'throws if searchString is too long'(test: Test) {
        // GIVEN
        const stack = new Stack();

        // THEN
        test.throws(() => {
          route53.EndpointHealthCheck.ipAddress(stack, 'HealthCheck', {
            ipAddress: '1.1.1.1',
            protocol: route53.EndpointHealthCheckProtocol.http({
              searchString: Array(256).fill(' ').join('')
            }),
            regions: [],
          });
        }, 'searchString cannot be over 255 characters long, got 256');
        test.done();
      },
      'throws if SNI without domain name'(test: Test) {
        // GIVEN
        const stack = new Stack();

        // THEN
        test.throws(() => {
          route53.EndpointHealthCheck.ipAddress(stack, 'HealthCheck', {
            ipAddress: '1.1.1.1',
            protocol: route53.EndpointHealthCheckProtocol.https(),
            regions: [],
          });
        }, 'SNI will always fail without a domain name');
        test.done();
      },
    },
    'Protocols': {
      basic: {
        HTTP(test: Test) {
          // GIVEN
          const stack = new Stack();

          // WHEN
          route53.EndpointHealthCheck.ipAddress(stack, 'HealthCheck', {
            ipAddress: '1.1.1.1',
            protocol: route53.EndpointHealthCheckProtocol.http(),
          });

          // THEN
          expect(stack).to(haveResource('AWS::Route53::HealthCheck', {
            HealthCheckConfig: {
              IPAddress: "1.1.1.1",
              Port: 80,
              ResourcePath: "/",
              Type: "HTTP"
            }
          }));
          test.done();
        },
        HTTPS(test: Test) {
          // GIVEN
          const stack = new Stack();

          // WHEN
          route53.EndpointHealthCheck.ipAddress(stack, 'HealthCheck', {
            ipAddress: '1.1.1.1',
            fullyQualifiedDomainName: 'example.com',
            protocol: route53.EndpointHealthCheckProtocol.https(),
          });

          // THEN
          expect(stack).to(haveResource('AWS::Route53::HealthCheck', {
            HealthCheckConfig: {
              EnableSNI: true,
              FullyQualifiedDomainName: "example.com",
              IPAddress: "1.1.1.1",
              Port: 443,
              ResourcePath: "/",
              Type: "HTTPS"
            }
          }));
          test.done();
        },
        TCP(test: Test) {
          // GIVEN
          const stack = new Stack();

          // WHEN
          route53.EndpointHealthCheck.ipAddress(stack, 'HealthCheck', {
            ipAddress: '1.1.1.1',
            protocol: route53.EndpointHealthCheckProtocol.tcp(5000),
          });

          // THEN
          expect(stack).to(haveResource('AWS::Route53::HealthCheck', {
            HealthCheckConfig: {
              IPAddress: "1.1.1.1",
              Port: 5000,
              Type: "TCP"
            }
          }));
          test.done();
        },
      },
      advanced: {
        HTTP(test: Test) {
          // GIVEN
          const stack = new Stack();

          // WHEN
          route53.EndpointHealthCheck.ipAddress(stack, 'HealthCheck', {
            ipAddress: '1.1.1.1',
            protocol: route53.EndpointHealthCheckProtocol.http({
              resourcePath: '/test',
              searchString: 'Test String',
              port: 8080,
            }),
          });

          // THEN
          expect(stack).to(haveResource('AWS::Route53::HealthCheck', {
            HealthCheckConfig: {
              IPAddress: "1.1.1.1",
              Port: 8080,
              ResourcePath: "/test",
              SearchString: "Test String",
              Type: "HTTP_STR_MATCH"
            }
          }));
          test.done();
        },
        HTTPS(test: Test) {
          // GIVEN
          const stack = new Stack();

          // WHEN
          route53.EndpointHealthCheck.ipAddress(stack, 'HealthCheck', {
            ipAddress: '1.1.1.1',
            protocol: route53.EndpointHealthCheckProtocol.https({
              resourcePath: '/test',
              searchString: 'Test String',
              port: 8080,
              enableSni: false,
            }),
          });

          // THEN
          expect(stack).to(haveResource('AWS::Route53::HealthCheck', {
            HealthCheckConfig: {
              EnableSNI: false,
              IPAddress: "1.1.1.1",
              Port: 8080,
              ResourcePath: "/test",
              SearchString: "Test String",
              Type: "HTTPS_STR_MATCH"
            }
          }));
          test.done();
        },
      },
    }
  },
  Calculated: {
    'basic'(test: Test) {
      // GIVEN
      const stack = new Stack();

      const healthCheck1 = route53.EndpointHealthCheck.ipAddress(stack, 'HealthCheckHTTP', {
        ipAddress: '1.1.1.1',
        protocol: route53.EndpointHealthCheckProtocol.http(),
      });
      const healthCheck2 = route53.EndpointHealthCheck.ipAddress(stack, 'HealthCheckTCP', {
        ipAddress: '1.1.1.1',
        protocol: route53.EndpointHealthCheckProtocol.tcp(5000),
      });

      // WHEN
      new route53.CalculatedHealthCheck(stack, 'CalculatedHealthCheck', {
        childHealthChecks: [healthCheck1, healthCheck2],
        healthThreshold: 1,
      });

      // THEN
      expect(stack).to(haveResource('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          ChildHealthChecks: [
            { Ref: "HealthCheckHTTP36AA2522" },
            { Ref: "HealthCheckTCP6D68A1D5" }
          ],
          HealthThreshold: 1,
          Type: "CALCULATED"
        }
      }));
      test.done();
    },
    'cross-stack'(test: Test) {
      // GIVEN
      const app = new App();
      const stack1 = new Stack(app, 'Stack1');
      const stack2 = new Stack(app, 'Stack2');

      const healthCheck1 = route53.EndpointHealthCheck.ipAddress(stack1, 'HealthCheckHTTP', {
        ipAddress: '1.1.1.1',
        protocol: route53.EndpointHealthCheckProtocol.http(),
      });
      const healthCheck2 = route53.EndpointHealthCheck.ipAddress(stack1, 'HealthCheckTCP', {
        ipAddress: '1.1.1.1',
        protocol: route53.EndpointHealthCheckProtocol.tcp(5000),
      });

      // WHEN
      new route53.CalculatedHealthCheck(stack2, 'CalculatedHealthCheck', {
        childHealthChecks: [healthCheck1, healthCheck2],
        healthThreshold: 1,
        inverted: true
      });

      // THEN
      expect(stack2).to(haveResource('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          ChildHealthChecks: [
            { "Fn::ImportValue": "Stack1:ExportsOutputRefHealthCheckHTTP36AA2522D043599F" },
            { "Fn::ImportValue": "Stack1:ExportsOutputRefHealthCheckTCP6D68A1D593D1BECC" }
          ],
          HealthThreshold: 1,
          Inverted: true,
          Type: "CALCULATED"
        }
      }));
      test.done();
    },
  },
  Alarm: {
    basic(test: Test) {
      // GIVEN
      const stack = new Stack();

      const alarm = new cloudwatch.Alarm(stack, 'Alarm', {
        metric: new cloudwatch.Metric({
          metricName: 'Errors',
          namespace: 'my.namespace',
        }),
        threshold: 1,
        evaluationPeriods: 1,
      });

      // WHEN
      new route53.AlarmHealthCheck(stack, 'HealthCheck', { alarm });

      // THEN
      expect(stack).to(haveResource('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          AlarmIdentifier: {
            Name: {
              Ref: "Alarm7103F465"
            },
            Region: {
              Ref: "AWS::Region"
            }
          },
          Type: "CALCULATED"
        }
      }));
      test.done();
    },
    complex(test: Test) {
      // GIVEN
      const stack = new Stack();

      const alarm = new cloudwatch.Alarm(stack, 'Alarm', {
        metric: new cloudwatch.Metric({
          metricName: 'Errors',
          namespace: 'my.namespace',
        }),
        threshold: 1,
        evaluationPeriods: 1,
      });

      // WHEN
      new route53.AlarmHealthCheck(stack, 'HealthCheck', {
        alarm,
        insufficientDataHealthStatus: route53.InsufficientDataHealthStatusType.UNHEALTHY,
        inverted: true
      });

      // THEN
      expect(stack).to(haveResource('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          AlarmIdentifier: {
            Name: {
              Ref: "Alarm7103F465"
            },
            Region: {
              Ref: "AWS::Region"
            }
          },
          InsufficientDataHealthStatus: "Unhealthy",
          Inverted: true,
          Type: "CALCULATED"
        }
      }));
      test.done();
    },
  },
};
