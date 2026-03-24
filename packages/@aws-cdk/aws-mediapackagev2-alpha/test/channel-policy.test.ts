import { Template } from 'aws-cdk-lib/assertions';
import { ArnPrincipal, Effect, PolicyDocument, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { App, Stack } from 'aws-cdk-lib/core';
import * as mediapackagev2 from '../lib';
let app: App;
let stack: Stack;
beforeEach(() => {
  app = new App();
  stack = new Stack(app, undefined, {
    env: { account: '123456789012', region: 'us-east-1' },
  });
});

test('MediaPackagev2 Channel Group Configuration', () => {
  const group = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');
  const channel = new mediapackagev2.Channel(stack, 'myChannel', {
    channelGroup: group,
    input: mediapackagev2.InputConfiguration.cmaf(),
  });
  channel.addToResourcePolicy(new PolicyStatement({
    sid: 'AllowMediaLiveRoleToAccessEmpChannel',
    principals: [new ArnPrincipal('arn:aws:iam::AccountID:role/MediaLiveAccessRole')],
    effect: Effect.ALLOW,
    actions: ['mediapackagev2:PutObject'],
    resources: [channel.channelArn],
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::ChannelPolicy', {
    ChannelGroupName: 'MyChannelGroup',
    ChannelName: 'myChannel',
    Policy: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'mediapackagev2:PutObject',
        Effect: 'Allow',
        Principal: {
          AWS: 'arn:aws:iam::AccountID:role/MediaLiveAccessRole',
        },
        Resource: {
          'Fn::GetAtt': ['myChannel4B408FFD', 'Arn'],
        },
        Sid: 'AllowMediaLiveRoleToAccessEmpChannel',
      }],
    },
  });
});

test('MediaPackagev2 Channel Group Configuration - creation with construct', () => {
  const group = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup2');
  const channel = new mediapackagev2.Channel(stack, 'myChannel2', {
    channelGroup: group,
    input: mediapackagev2.InputConfiguration.cmaf(),
  });
  const policy = new mediapackagev2.ChannelPolicy(stack, 'ChannelPolicy', {
    channel,
  });
  policy.document.addStatements(new PolicyStatement({
    sid: 'AllowMediaLiveRoleToAccessEmpChannel',
    principals: [new ArnPrincipal('arn:aws:iam::AccountID:role/MediaLiveAccessRole')],
    effect: Effect.ALLOW,
    actions: ['mediapackagev2:PutObject'],
    resources: [channel.channelArn],
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::ChannelPolicy', {
    ChannelGroupName: 'MyChannelGroup2',
    ChannelName: 'myChannel2',
    Policy: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'mediapackagev2:PutObject',
        Effect: 'Allow',
        Principal: {
          AWS: 'arn:aws:iam::AccountID:role/MediaLiveAccessRole',
        },
        Resource: {
          'Fn::GetAtt': ['myChannel2FF44B35D', 'Arn'],
        },
        Sid: 'AllowMediaLiveRoleToAccessEmpChannel',
      }],
    },
  });
});

test('ChannelPolicy accepts initial policyDocument', () => {
  const group = new mediapackagev2.ChannelGroup(stack, 'Group');
  const channel = new mediapackagev2.Channel(stack, 'Channel', {
    channelGroup: group,
  });

  new mediapackagev2.ChannelPolicy(stack, 'Policy', {
    channel,
    policyDocument: new PolicyDocument({
      statements: [
        new PolicyStatement({
          sid: 'TestStatement',
          effect: Effect.ALLOW,
          principals: [new ArnPrincipal('arn:aws:iam::123456789012:role/TestRole')],
          actions: ['mediapackagev2:PutObject'],
          resources: [channel.channelArn],
        }),
      ],
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::ChannelPolicy', {
    Policy: {
      Statement: [{
        Sid: 'TestStatement',
        Effect: 'Allow',
        Action: 'mediapackagev2:PutObject',
      }],
    },
  });
});
