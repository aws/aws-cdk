import { Template, Match } from '../../assertions';
import { Duration, Stack } from '../../core';
import { ConfigurationSet, ConfigurationSetTlsPolicy, DedicatedIpPool, SuppressionReasons } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('default configuration set', () => {
  new ConfigurationSet(stack, 'ConfigurationSet');

  Template.fromStack(stack).hasResourceProperties('AWS::SES::ConfigurationSet', {
    Name: Match.absent(),
  });
});

test('configuration set with options', () => {
  new ConfigurationSet(stack, 'ConfigurationSet', {
    customTrackingRedirectDomain: 'track.cdk.dev',
    suppressionReasons: SuppressionReasons.COMPLAINTS_ONLY,
    tlsPolicy: ConfigurationSetTlsPolicy.REQUIRE,
    dedicatedIpPool: new DedicatedIpPool(stack, 'Pool'),
    maxDeliveryDuration: Duration.seconds(300),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SES::ConfigurationSet', {
    DeliveryOptions: {
      SendingPoolName: {
        Ref: 'PoolD3F588B8',
      },
      TlsPolicy: 'REQUIRE',
      MaxDeliverySeconds: 300,
    },
    SuppressionOptions: {
      SuppressedReasons: [
        'COMPLAINT',
      ],
    },
    TrackingOptions: {
      CustomRedirectDomain: 'track.cdk.dev',
    },
  });
});

test('configuration set with both engagement metrics and optimized shared delivery enabled', () => {
  new ConfigurationSet(stack, 'ConfigurationSet', {
    vdmOptions: {
      engagementMetrics: true,
      optimizedSharedDelivery: true,
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SES::ConfigurationSet', {
    VdmOptions: {
      DashboardOptions: {
        EngagementMetrics: 'ENABLED',
      },
      GuardianOptions: {
        OptimizedSharedDelivery: 'ENABLED',
      },
    },
  });
});

test('configuration set with both engagement metrics and optimized shared delivery disabled', () => {
  new ConfigurationSet(stack, 'ConfigurationSet', {
    vdmOptions: {
      engagementMetrics: false,
      optimizedSharedDelivery: false,
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SES::ConfigurationSet', {
    VdmOptions: {
      DashboardOptions: {
        EngagementMetrics: 'DISABLED',
      },
      GuardianOptions: {
        OptimizedSharedDelivery: 'DISABLED',
      },
    },
  });
});

test('configuration set with vdmOptions not configured', () => {
  new ConfigurationSet(stack, 'ConfigurationSet', {
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SES::ConfigurationSet', {
    VdmOptions: Match.absent(),
  });
});

describe('configuration set with account-level suppression list overrides', () => {
  test('disable account-level suppression list', () => {
    new ConfigurationSet(stack, 'ConfigurationSet', {
      disableSuppressionList: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SES::ConfigurationSet', {
      SuppressionOptions: {
        SuppressedReasons: [],
      },
    });
  });

  test('throws error with both disableSuppressionList and suppressionReasons are specified', () => {
    expect(() => {
      new ConfigurationSet(stack, 'ConfigurationSet', {
        disableSuppressionList: true,
        suppressionReasons: SuppressionReasons.BOUNCES_AND_COMPLAINTS,
      });
    }).toThrow('When disableSuppressionList is true, suppressionReasons must not be specified.');
  });

  test('allows when disableSuppressionList is false and suppressionReasons are specified', () => {
    new ConfigurationSet(stack, 'ConfigurationSet', {
      disableSuppressionList: false,
      suppressionReasons: SuppressionReasons.BOUNCES_AND_COMPLAINTS,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SES::ConfigurationSet', {
      SuppressionOptions: {
        SuppressedReasons: ['BOUNCE', 'COMPLAINT'],
      },
    });
  });

  test('enable account-level suppression list explicitly', () => {
    new ConfigurationSet(stack, 'ConfigurationSet', {
      disableSuppressionList: false,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SES::ConfigurationSet', {
      SuppressionOptions: Match.absent(),
    });
  });

  test('override suppressionReasons to BOUNCES only', () => {
    new ConfigurationSet(stack, 'ConfigurationSet', {
      suppressionReasons: SuppressionReasons.BOUNCES_ONLY,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SES::ConfigurationSet', {
      SuppressionOptions: {
        SuppressedReasons: ['BOUNCE'],
      },
    });
  });

  test('override suppressionReasons to COMPLAINTS only', () => {
    new ConfigurationSet(stack, 'ConfigurationSet', {
      suppressionReasons: SuppressionReasons.COMPLAINTS_ONLY,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SES::ConfigurationSet', {
      SuppressionOptions: {
        SuppressedReasons: ['COMPLAINT'],
      },
    });
  });

  test('override suppressionReasons to BOUNCES and COMPLAINTS', () => {
    new ConfigurationSet(stack, 'ConfigurationSet', {
      suppressionReasons: SuppressionReasons.BOUNCES_AND_COMPLAINTS,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::SES::ConfigurationSet', {
      SuppressionOptions: {
        SuppressedReasons: ['BOUNCE', 'COMPLAINT'],
      },
    });
  });
});

describe('maxDeliveryDuration', () => {
  test.each([Duration.millis(999), Duration.minutes(4)])('invalid duration less than 5 minutes %s', (maxDeliveryDuration) => {
    expect(() => {
      new ConfigurationSet(stack, 'ConfigurationSet', {
        maxDeliveryDuration,
      });
    }).toThrow(`The maximum delivery duration must be greater than or equal to 5 minutes (300_000 milliseconds), got: ${maxDeliveryDuration.toMilliseconds()} milliseconds.`);
  });

  test('invalid duration greater than 14 hours', () => {
    expect(() => {
      new ConfigurationSet(stack, 'ConfigurationSet', {
        maxDeliveryDuration: Duration.hours(14).plus(Duration.seconds(1)),
      });
    }).toThrow('The maximum delivery duration must be less than or equal to 14 hours (50400 seconds), got: 50401 seconds.');
  });
});
