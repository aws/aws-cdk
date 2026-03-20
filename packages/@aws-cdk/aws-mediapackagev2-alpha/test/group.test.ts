import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
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
  new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup', {
    channelGroupName: 'test',
    description: 'my test channel',
    tags: {
      env: 'dev',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::ChannelGroup', {
    ChannelGroupName: 'test',
    Description: 'my test channel',
    Tags: [{
      Key: 'env',
      Value: 'dev',
    }],
  });
});

test('MediaPackagev2 Channel Group Configuration - no name', () => {
  new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup');

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::ChannelGroup', {
    ChannelGroupName: 'MyChannelGroup',
  });
});

test('existing Channel Group can be imported', () => {
  const importedChannelGroup = mediapackagev2.ChannelGroup.fromChannelGroupAttributes(stack, 'ImportedChannelGroup', {
    channelGroupName: 'MyChannelGroup',
  });

  expect(importedChannelGroup.channelGroupArn).toBe('arn:aws:mediapackagev2:us-east-1:123456789012:channelGroup/MyChannelGroup');
});

test('existing Channel Group can be imported and used by a Channel', () => {
  const importedChannelGroup = mediapackagev2.ChannelGroup.fromChannelGroupAttributes(stack, 'ImportedChannelGroup', {
    channelGroupName: 'MyChannelGroup',
  });
  new mediapackagev2.Channel(stack, 'MyTest', {
    channelGroup: importedChannelGroup,
    input: mediapackagev2.InputConfiguration.cmaf(),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::Channel', {
    ChannelGroupName: 'MyChannelGroup',
  });
});

test('Channel Group Injected Property available', () => {
  expect(mediapackagev2.ChannelGroup.PROPERTY_INJECTION_ID).toEqual('@aws-cdk.aws-mediapackagev2-alpha.ChannelGroup');
});

test('addChannel can be called with no options', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup', {
    channelGroupName: 'test-group',
  });

  // Should work with no options parameter
  channelGroup.addChannel('MyChannel');

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::Channel', {
    ChannelGroupName: 'test-group',
    InputType: 'CMAF', // Default input type
  });
});

test('addChannel can be called with options', () => {
  const channelGroup = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup', {
    channelGroupName: 'test-group',
  });

  channelGroup.addChannel('MyChannel', {
    channelName: 'custom-channel',
    description: 'My custom channel',
    input: mediapackagev2.InputConfiguration.cmaf(),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaPackageV2::Channel', {
    ChannelGroupName: 'test-group',
    ChannelName: 'custom-channel',
    Description: 'My custom channel',
    InputType: 'CMAF',
  });
});

test('channel group metrics', () => {
  const group = new mediapackagev2.ChannelGroup(stack, 'MyChannelGroup', {
    channelGroupName: 'test-group',
  });

  expect(stack.resolve(group.metricIngressBytes())).toEqual(expect.objectContaining({
    dimensions: { ChannelGroup: 'test-group' },
    namespace: 'AWS/MediaPackage',
    metricName: 'IngressBytes',
    statistic: 'Sum',
    unit: 'Bytes',
  }));

  expect(stack.resolve(group.metricEgressBytes())).toEqual(expect.objectContaining({
    dimensions: { ChannelGroup: 'test-group' },
    namespace: 'AWS/MediaPackage',
    metricName: 'EgressBytes',
    statistic: 'Sum',
    unit: 'Bytes',
  }));

  expect(stack.resolve(group.metricIngressResponseTime())).toEqual(expect.objectContaining({
    dimensions: { ChannelGroup: 'test-group' },
    namespace: 'AWS/MediaPackage',
    metricName: 'IngressResponseTime',
    statistic: 'Average',
    unit: 'Milliseconds',
  }));

  expect(stack.resolve(group.metricEgressResponseTime())).toEqual(expect.objectContaining({
    dimensions: { ChannelGroup: 'test-group' },
    namespace: 'AWS/MediaPackage',
    metricName: 'EgressResponseTime',
    statistic: 'Average',
    unit: 'Milliseconds',
  }));

  expect(stack.resolve(group.metricIngressRequestCount())).toEqual(expect.objectContaining({
    dimensions: { ChannelGroup: 'test-group' },
    namespace: 'AWS/MediaPackage',
    metricName: 'IngressRequestCount',
    statistic: 'Sum',
    unit: 'Count',
  }));

  expect(stack.resolve(group.metricEgressRequestCount())).toEqual(expect.objectContaining({
    dimensions: { ChannelGroup: 'test-group' },
    namespace: 'AWS/MediaPackage',
    metricName: 'EgressRequestCount',
    statistic: 'Sum',
    unit: 'Count',
  }));
});
