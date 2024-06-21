import { Template, Match } from '../../assertions';
import { Stack } from '../../core';
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
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SES::ConfigurationSet', {
    DeliveryOptions: {
      SendingPoolName: {
        Ref: 'PoolD3F588B8',
      },
      TlsPolicy: 'REQUIRE',
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
