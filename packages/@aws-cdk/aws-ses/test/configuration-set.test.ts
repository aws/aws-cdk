import { Template, Match } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
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
