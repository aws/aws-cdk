import { App, Stack } from 'aws-cdk-lib';
import * as ivs from '../lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();

const stack = new Stack(app, 'aws-cdk-ivs');

new ivs.Channel(stack, 'AdvancedChannelWithoutPresetSetting', {
  type: ivs.ChannelType.ADVANCED_SD,
});

new ivs.Channel(stack, 'AdvancedChannelWithPresetSetting', {
  type: ivs.ChannelType.ADVANCED_HD,
  preset: ivs.Preset.CONSTRAINED_BANDWIDTH_DELIVERY,
});

new IntegTest(app, 'ivs-test', {
  testCases: [stack],
});

app.synth();
