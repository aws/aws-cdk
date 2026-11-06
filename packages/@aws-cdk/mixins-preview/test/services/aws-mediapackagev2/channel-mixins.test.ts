import { Construct } from 'constructs';
import { Stack, App } from 'aws-cdk-lib/core';
import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as mediapackagev2 from 'aws-cdk-lib/aws-mediapackagev2';
import { ChannelInputSwitching, ChannelPolicy, PreferredInput } from '../../../lib/services/aws-mediapackagev2/channel';

class TestConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

describe('MediaPackageV2 Channel Mixins', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  function createChannel(props: mediapackagev2.CfnChannelProps = {
    channelGroupName: 'test-group',
    channelName: 'test-channel',
  }): mediapackagev2.CfnChannel {
    return new mediapackagev2.CfnChannel(stack, 'Channel', props);
  }

  describe('ChannelInputSwitching', () => {
    test('supports CfnChannel constructs', () => {
      const channel = createChannel();
      const mixin = new ChannelInputSwitching();

      expect(mixin.supports(channel)).toBe(true);
    });

    test('does not support non-CfnChannel constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new ChannelInputSwitching();

      expect(mixin.supports(construct)).toBe(false);
    });

    test('enables MQCS input switching with default props', () => {
      const channel = createChannel();
      const mixin = new ChannelInputSwitching();

      mixin.applyTo(channel);

      expect(channel.inputSwitchConfiguration).toEqual({
        mqcsInputSwitching: true,
        preferredInput: undefined,
      });
      expect(channel.outputHeaderConfiguration).toBeUndefined();
    });

    test('sets preferred input when provided', () => {
      const channel = createChannel();
      const mixin = new ChannelInputSwitching({
        preferredInput: PreferredInput.INPUT_1,
      });

      mixin.applyTo(channel);

      expect(channel.inputSwitchConfiguration).toEqual({
        mqcsInputSwitching: true,
        preferredInput: 1,
      });
    });

    test('sets preferred input 2', () => {
      const channel = createChannel();
      const mixin = new ChannelInputSwitching({
        preferredInput: PreferredInput.INPUT_2,
      });

      mixin.applyTo(channel);

      expect(channel.inputSwitchConfiguration).toEqual({
        mqcsInputSwitching: true,
        preferredInput: 2,
      });
    });

    test('sets outputHeaderConfiguration when publishMqcs is true', () => {
      const channel = createChannel();
      const mixin = new ChannelInputSwitching({
        publishMqcs: true,
      });

      mixin.applyTo(channel);

      expect(channel.outputHeaderConfiguration).toEqual({
        publishMqcs: true,
      });
    });

    test('sets outputHeaderConfiguration when publishMqcs is false', () => {
      const channel = createChannel();
      const mixin = new ChannelInputSwitching({
        publishMqcs: false,
      });

      mixin.applyTo(channel);

      expect(channel.outputHeaderConfiguration).toEqual({
        publishMqcs: false,
      });
    });

    test('does not set outputHeaderConfiguration when publishMqcs is undefined', () => {
      const channel = createChannel();
      const mixin = new ChannelInputSwitching({
        preferredInput: PreferredInput.INPUT_1,
      });

      mixin.applyTo(channel);

      expect(channel.outputHeaderConfiguration).toBeUndefined();
    });

    test('sets all props together', () => {
      const channel = createChannel();
      const mixin = new ChannelInputSwitching({
        preferredInput: PreferredInput.INPUT_2,
        publishMqcs: true,
      });

      mixin.applyTo(channel);

      expect(channel.inputSwitchConfiguration).toEqual({
        mqcsInputSwitching: true,
        preferredInput: 2,
      });
      expect(channel.outputHeaderConfiguration).toEqual({
        publishMqcs: true,
      });
    });

    test('does not apply to non-CfnChannel constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new ChannelInputSwitching();

      // Should not throw
      mixin.applyTo(construct);
    });

    test('validates that inputType is CMAF at synthesis time', () => {
      const channel = createChannel({ channelGroupName: 'test-group', channelName: 'test-channel', inputType: 'HLS' });
      const mixin = new ChannelInputSwitching();

      mixin.applyTo(channel);

      expect(() => app.synth()).toThrow(/ChannelInputSwitching requires CMAF input type/);
    });

    test('passes validation when inputType is CMAF', () => {
      const channel = createChannel({ channelGroupName: 'test-group', channelName: 'test-channel', inputType: 'CMAF' });
      const mixin = new ChannelInputSwitching();

      mixin.applyTo(channel);

      // Should not throw
      expect(() => app.synth()).not.toThrow();
    });

    test('passes validation when inputType is not explicitly set', () => {
      const channel = createChannel();
      const mixin = new ChannelInputSwitching();

      mixin.applyTo(channel);

      // inputType is undefined — validator should not reject
      expect(() => app.synth()).not.toThrow();
    });

    test('validates correctly when inputType is set after mixin is applied', () => {
      const channel = createChannel();
      const mixin = new ChannelInputSwitching();

      mixin.applyTo(channel);
      channel.inputType = 'HLS';

      expect(() => app.synth()).toThrow(/ChannelInputSwitching requires CMAF input type/);
    });

    test('synthesizes correct CloudFormation template', () => {
      const channel = createChannel({ channelGroupName: 'test-group', channelName: 'test-channel', inputType: 'CMAF' });
      const mixin = new ChannelInputSwitching({
        preferredInput: PreferredInput.INPUT_1,
        publishMqcs: true,
      });

      mixin.applyTo(channel);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::MediaPackageV2::Channel', {
        InputSwitchConfiguration: {
          MQCSInputSwitching: true,
          PreferredInput: 1,
        },
        OutputHeaderConfiguration: {
          PublishMQCS: true,
        },
      });
    });
  });

  describe('ChannelPolicy', () => {
    test('supports CfnChannel constructs', () => {
      const channel = createChannel();
      const mixin = new ChannelPolicy({
        policy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ['mediapackagev2:PutObject'],
              resources: ['*'],
              principals: [new iam.AnyPrincipal()],
            }),
          ],
        }),
      });

      expect(mixin.supports(channel)).toBe(true);
    });

    test('does not support non-CfnChannel constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new ChannelPolicy({
        policy: new iam.PolicyDocument(),
      });

      expect(mixin.supports(construct)).toBe(false);
    });

    test('creates CfnChannelPolicy with policy document', () => {
      const channel = createChannel();
      const mixin = new ChannelPolicy({
        policy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ['mediapackagev2:PutObject'],
              resources: ['*'],
              principals: [new iam.AnyPrincipal()],
            }),
          ],
        }),
      });

      mixin.applyTo(channel);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::MediaPackageV2::ChannelPolicy', {
        ChannelGroupName: 'test-group',
        ChannelName: 'test-channel',
        Policy: {
          Statement: [
            {
              Action: 'mediapackagev2:PutObject',
              Effect: 'Allow',
              Principal: { AWS: '*' },
              Resource: '*',
            },
          ],
        },
      });
    });

    test('creates CfnChannelPolicy from statements', () => {
      const channel = createChannel();
      const mixin = new ChannelPolicy({
        statements: [
          new iam.PolicyStatement({
            actions: ['mediapackagev2:PutObject'],
            resources: ['*'],
            principals: [new iam.AccountPrincipal('123456789012')],
          }),
        ],
      });

      mixin.applyTo(channel);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::MediaPackageV2::ChannelPolicy', {
        ChannelGroupName: 'test-group',
        ChannelName: 'test-channel',
      });
    });

    test('throws when both policy and statements are provided', () => {
      expect(() => {
        new ChannelPolicy({
          policy: new iam.PolicyDocument(),
          statements: [
            new iam.PolicyStatement({
              actions: ['mediapackagev2:PutObject'],
              resources: ['*'],
            }),
          ],
        });
      }).toThrow(/Specify either 'policy' or 'statements', but not both/);
    });

    test('throws when neither policy nor statements are provided', () => {
      expect(() => {
        new ChannelPolicy({});
      }).toThrow(/One of 'policy' or 'statements' is required/);
    });

    test('does not apply to non-CfnChannel constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new ChannelPolicy({
        policy: new iam.PolicyDocument(),
      });

      // Should not throw
      mixin.applyTo(construct);
    });
  });
});
