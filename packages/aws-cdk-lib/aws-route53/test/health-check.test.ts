import { Template } from '../../assertions';
import { CfnRoutingControl } from '../../aws-route53recoverycontrol';
import * as cdk from '../../core';
import { HealthCheck, HealthCheckType } from '../lib';

describe('health check', () => {
  test('resolves routing control arn', () => {
    const stack = new cdk.Stack(undefined, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const routingControl = new CfnRoutingControl(stack, 'RoutingControl', {
      name: 'routing-control-name',
    });

    new HealthCheck(stack, 'HealthCheck', {
      type: HealthCheckType.RECOVERY_CONTROL,
      routingControl: routingControl.attrRoutingControlArn,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
      HealthCheckConfig: {
        Type: 'RECOVERY_CONTROL',
        RoutingControlArn: stack.resolve(routingControl.attrRoutingControlArn),
      },
    });
  });

  test('import health check from id', () => {
    const stack = new cdk.Stack(undefined, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const healthCheck = HealthCheck.fromHealthCheckId(stack, 'HealthCheck', 'health-check-id');

    expect(healthCheck.healthCheckId).toEqual('health-check-id');
  });

  describe('properties validation', () => {
    test.each([undefined, []])('calculated health check requires child health checks', (childHealthChecks) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck1', {
          type: HealthCheckType.CALCULATED,
          childHealthChecks,
        });
      }).toThrow(/ChildHealthChecks is required for health check type: CALCULATED/);
    });

    test.each`
      type                                 | props
      ${HealthCheckType.HTTP}              | ${{}}
      ${HealthCheckType.HTTPS}             | ${{}}
      ${HealthCheckType.HTTP_STR_MATCH}    | ${{ searchString: 'search' }}
      ${HealthCheckType.HTTPS_STR_MATCH}   | ${{ searchString: 'search' }}
      ${HealthCheckType.TCP}               | ${{}}
      ${HealthCheckType.CLOUDWATCH_METRIC} | ${{ alarmIdentifier: { name: 'alarm-name', region: 'us-east-1' } }}
      ${HealthCheckType.RECOVERY_CONTROL}  | ${{ routingControl: 'arn:aws:route53resolver:us-east-1:123456789012:routing-control/routing-control-id' }}
    `('child health checks are not allowed for $type health check', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
          childHealthChecks: ['child1', 'child2'],
        });
      }).toThrow(/ChildHealthChecks is only supported for health check type:/);
    });

    test('health threshold is allowed for calculated health checks', () => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type: HealthCheckType.CALCULATED,
          childHealthChecks: ['child1', 'child2'],
          healthThreshold: 1,
        });
      }).not.toThrow();
    });

    test.each`
      type                                 | props
      ${HealthCheckType.HTTP}              | ${{}}
      ${HealthCheckType.HTTPS}             | ${{}}
      ${HealthCheckType.HTTP_STR_MATCH}    | ${{ searchString: 'search' }}
      ${HealthCheckType.HTTPS_STR_MATCH}   | ${{ searchString: 'search' }}
      ${HealthCheckType.TCP}               | ${{}}
      ${HealthCheckType.CLOUDWATCH_METRIC} | ${{ alarmIdentifier: { name: 'alarm-name', region: 'us-east-1' } }}
      ${HealthCheckType.RECOVERY_CONTROL}  | ${{ routingControl: 'arn:aws:route53resolver:us-east-1:123456789012:routing-control/routing-control-id' }}
    `('health threshold is not allowed for $type health check', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
          healthThreshold: 1,
        });
      }).toThrow(/HealthThreshold is not supported for health check type:/);
    });

    test.each([HealthCheckType.HTTP_STR_MATCH, HealthCheckType.HTTPS_STR_MATCH])(
      'http_str_match and https_str_match require search string',
      (type) => {
        const stack = new cdk.Stack(undefined, 'TestStack', {
          env: { account: '123456789012', region: 'us-east-1' },
        });

        expect(() => {
          new HealthCheck(stack, 'HttpStrMatchHealthCheck', {
            type,
          });
        }).toThrow(/SearchString is required for health check type:/);
      },
    );

    test.each(['', 'a'.repeat(256)])(
      'http_str_match and https_str_match require search string length between 1 and 255 characters long',
      (searchString) => {
        const stack = new cdk.Stack(undefined, 'TestStack', {
          env: { account: '123456789012', region: 'us-east-1' },
        });

        expect(() => {
          new HealthCheck(stack, 'HttpStrMatchHealthCheck', {
            type: HealthCheckType.HTTP_STR_MATCH,
            searchString,
          });
        }).toThrow(/SearchString must be between 1 and 255 characters long/);
      },
    );

    test.each`
      type                                 | props
      ${HealthCheckType.HTTP}              | ${{}}
      ${HealthCheckType.HTTPS}             | ${{}}
      ${HealthCheckType.TCP}               | ${{}}
      ${HealthCheckType.CALCULATED}        | ${{ childHealthChecks: ['child1', 'child2'] }}
      ${HealthCheckType.CLOUDWATCH_METRIC} | ${{ alarmIdentifier: { name: 'alarm-name', region: 'us-east-1' } }}
      ${HealthCheckType.RECOVERY_CONTROL}  | ${{ routingControl: 'arn:aws:route53resolver:us-east-1:123456789012:routing-control/routing-control-id' }}
    `('search string is not supported for $type health check', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
          searchString: 'search',
        });
      }).toThrow(/SearchString is only supported for health check types: HTTP_STR_MATCH, HTTPS_STR_MATCH/);
    });

    test('recovery control requires routing control', () => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'RecoveryControlHealthCheck', {
          type: HealthCheckType.RECOVERY_CONTROL,
        });
      }).toThrow(/RoutingControl is required for health check type: RECOVERY_CONTROL/);
    });

    test.each`
      type                                 | props
      ${HealthCheckType.HTTP}              | ${{}}
      ${HealthCheckType.HTTPS}             | ${{}}
      ${HealthCheckType.HTTP_STR_MATCH}    | ${{ searchString: 'search' }}
      ${HealthCheckType.HTTPS_STR_MATCH}   | ${{ searchString: 'search' }}
      ${HealthCheckType.TCP}               | ${{}}
      ${HealthCheckType.CALCULATED}        | ${{ childHealthChecks: ['child1', 'child2'] }}
      ${HealthCheckType.CLOUDWATCH_METRIC} | ${{ alarmIdentifier: { name: 'alarm-name', region: 'us-east-1' } }}
    `('recovery control is not supported for $type health check', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
          routingControl: 'arn:aws:route53resolver:us-east-1:123456789012:routing-control/routing-control-id',
        });
      }).toThrow(/RoutingControl is not supported for health check type:/);
    });

    test('fqdn max length is 255 characters', () => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type: HealthCheckType.HTTP,
          fqdn: 'a'.repeat(256),
        });
      }).toThrow(/FQDN must be between 0 and 255 characters long/);
    });

    test('failure threshold defaults to 3', () => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      new HealthCheck(stack, 'HealthCheck', {
        type: HealthCheckType.HTTP,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          FailureThreshold: 3,
        },
      });
    });

    test.each([0, 11])('failure threshold must be between 1 and 10', (threshold) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type: HealthCheckType.HTTP,
          failureThreshold: threshold,
        });
      }).toThrow(/FailureThreshold must be between 1 and 10/);
    });

    test('request interval defaults to 30 seconds', () => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      new HealthCheck(stack, 'HealthCheck', {
        type: HealthCheckType.HTTP,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Route53::HealthCheck', {
        HealthCheckConfig: {
          RequestInterval: 30,
        },
      });
    });

    test.each([cdk.Duration.seconds(0), cdk.Duration.seconds(31)])('request interval must be between 10 and 30 seconds', (interval) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type: HealthCheckType.HTTP,
          requestInterval: interval,
        });
      }).toThrow(/RequestInterval must be between 10 and 30 seconds/);
    });

    test.each`
      type                               | props
      ${HealthCheckType.HTTP}            | ${{}}
      ${HealthCheckType.HTTPS}           | ${{}}
      ${HealthCheckType.HTTP_STR_MATCH}  | ${{ searchString: 'search' }}
      ${HealthCheckType.HTTPS_STR_MATCH} | ${{ searchString: 'search' }}
      ${HealthCheckType.TCP}             | ${{}}
    `('port is allowed for $type health check', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
          port: 80,
        });
      }).not.toThrow();
    });

    test.each`
      type                                 | props
      ${HealthCheckType.CALCULATED}        | ${{ childHealthChecks: ['child1', 'child2'] }}
      ${HealthCheckType.CLOUDWATCH_METRIC} | ${{ alarmIdentifier: { name: 'alarm-name', region: 'us-east-1' } }}
      ${HealthCheckType.RECOVERY_CONTROL}  | ${{ routingControl: 'arn:aws:route53resolver:us-east-1:123456789012:routing-control/routing-control-id' }}
    `('port is not allowed for $type health check', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
          port: 80,
        });
      }).toThrow(/Port is not supported for health check type:/);
    });

    test('alaram identifier is required for CLOUDWATCH_METRIC health checks', () => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type: HealthCheckType.CLOUDWATCH_METRIC,
        });
      }).toThrow(/AlarmIdentifier is required for health check type: CLOUDWATCH_METRIC/);
    });

    test.each`
      type                                | props
      ${HealthCheckType.HTTP}             | ${{}}
      ${HealthCheckType.HTTPS}            | ${{}}
      ${HealthCheckType.HTTP_STR_MATCH}   | ${{}}
      ${HealthCheckType.HTTPS_STR_MATCH}  | ${{}}
      ${HealthCheckType.TCP}              | ${{}}
      ${HealthCheckType.CALCULATED}       | ${{ childHealthChecks: ['child1', 'child2'] }}
      ${HealthCheckType.RECOVERY_CONTROL} | ${{}}
    `('alarm identifier is not supported for $type', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
          alarmIdentifier: {
            name: 'alarm-name',
            region: 'us-east-1',
          },
        });
      }).toThrow(/AlarmIdentifier is not supported for health check type:/);
    });

    test.each`
      type                              | props
      ${HealthCheckType.HTTP}           | ${{ ipAddress: '' }}
      ${HealthCheckType.HTTP_STR_MATCH} | ${{ ipAddress: '', searchString: 'search' }}
      ${HealthCheckType.TCP}            | ${{ ipAddress: '' }}
      ${HealthCheckType.HTTP}           | ${{ ipAddress: 'invalid' }}
      ${HealthCheckType.HTTP}           | ${{ ipAddress: '1.2.3' }}
      ${HealthCheckType.HTTPS}          | ${{ ipAddress: '1.2' }}
      ${HealthCheckType.HTTP_STR_MATCH} | ${{ ipAddress: '1', searchString: 'search' }}
      ${HealthCheckType.HTTP}           | ${{ ipAddress: '2001:' }}
      ${HealthCheckType.TCP}            | ${{ ipAddress: '2001:::::::7334' }}
    `('validates IP address for TCP health checks, ip address: $props.ipAddress', ({ type, props }) => {
      const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
      });

      expect(() => {
        new HealthCheck(stack, 'HealthCheck', {
          type,
          ...props,
        });
      }).toThrow(/IpAddress must be a valid IPv4 or IPv6 address/);
    });
  });
});
