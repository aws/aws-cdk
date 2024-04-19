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

test('renders the correct ARN for owned ConfigurationSet', () => {
  const configurationSet = new ConfigurationSet(stack, 'ConfigurationSet');
  const arn = stack.resolve(configurationSet.configurationSetArn);
  expect(arn).toEqual({
    'Fn::Join': ['', [
      'arn:',
      { Ref: 'AWS::Partition' },
      ':ses:',
      { Ref: 'AWS::Region' },
      ':',
      { Ref: 'AWS::AccountId' },
      ':configuration-set/',
      {
        Ref: 'ConfigurationSet3DD38186',
      },
    ]],
  });
});

test('renders the correct ARN for unowned ConfigurationSet', () => {
  const unownedConfigurationSet = ConfigurationSet.fromConfigurationSetName(stack, 'ConfigurationSet', 'my-imported-configuration-set');
  const arn = stack.resolve(unownedConfigurationSet.configurationSetArn);
  expect(arn).toEqual({
    'Fn::Join': ['', [
      'arn:',
      { Ref: 'AWS::Partition' },
      ':ses:',
      { Ref: 'AWS::Region' },
      ':',
      { Ref: 'AWS::AccountId' },
      ':configuration-set/my-imported-configuration-set',
    ]],
  });
});