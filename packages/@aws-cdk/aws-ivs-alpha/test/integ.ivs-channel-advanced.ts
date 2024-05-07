import { App, Stack } from 'aws-cdk-lib';
import * as ivs from '../lib';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();

const stack = new Stack(app, 'aws-cdk-ivs');

const advancedChannelWithoutPresetSetting = new ivs.Channel(stack, 'AdvancedChannelWithoutPresetSetting', {
  type: ivs.ChannelType.ADVANCED_SD,
});

const advancedChannelWithPresetSetting = new ivs.Channel(stack, 'AdvancedChannelWithPresetSetting', {
  type: ivs.ChannelType.ADVANCED_HD,
  preset: ivs.Preset.CONSTRAINED_BANDWIDTH_DELIVERY,
});

const test = new integ.IntegTest(app, 'ivs-test', {
  testCases: [stack],
});

test.assertions.awsApiCall('IVS', 'GetChannel', {
  arn: advancedChannelWithoutPresetSetting.channelArn,
})
  .expect(integ.ExpectedResult.objectLike({
    channel: {
      preset: 'HIGHER_BANDWIDTH_DELIVERY',
      type: 'ADVANCED_SD',
    },
  }));

test.assertions.awsApiCall('IVS', 'GetChannel', {
  arn: advancedChannelWithPresetSetting.channelArn,
})
  .expect(integ.ExpectedResult.objectLike({
    channel: {
      preset: 'CONSTRAINED_BANDWIDTH_DELIVERY',
      type: 'ADVANCED_HD',
    },
  }));

app.synth();
