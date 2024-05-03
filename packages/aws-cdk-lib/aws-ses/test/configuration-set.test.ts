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

test('configuration set with both engagement metrics and optimized shared delivery', () => {
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

test('configuration set with engagement metrics only', () => {
  new ConfigurationSet(stack, 'ConfigurationSet', {
    vdmOptions: {
      engagementMetrics: true,
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SES::ConfigurationSet', {
    VdmOptions: {
      DashboardOptions: {
        EngagementMetrics: 'ENABLED',
      },
      GuardianOptions: Match.absent(),
    },
  });
});

test('configuration set with optimized shared delivery only', () => {
  new ConfigurationSet(stack, 'ConfigurationSet', {
    vdmOptions: {
      optimizedSharedDelivery: true,
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SES::ConfigurationSet', {
    VdmOptions: {
      DashboardOptions: Match.absent(),
      GuardianOptions: {
        OptimizedSharedDelivery: 'ENABLED',
      },
    },
  });
});
