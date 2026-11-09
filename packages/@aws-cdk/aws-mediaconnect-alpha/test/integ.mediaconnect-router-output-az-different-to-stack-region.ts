import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';

import { RoutingScope } from '../lib/router-input';
import { RouterOutput, RouterOutputConfiguration, RouterOutputTier } from '../lib/router-output';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-mediaconnect-router-output-az-different-to-stack-region');

// Test 1: MediaLive Output without connecting to a specific input
// No AZ top level, but AZ in MediaLive input connection
new RouterOutput(stack, 'RouterOutput1', {
  routerOutputName: 'test-medialive-no-input',
  maximumBitrate: cdk.Bitrate.mbps(12),
  routingScope: RoutingScope.REGIONAL,
  regionName: 'eu-west-1',
  tier: RouterOutputTier.OUTPUT_50,
  configuration: RouterOutputConfiguration.mediaLiveInputWithoutConnection({
    availabilityZone: 'eu-west-1a',
  }),
});

// Test 2: MediaLive Output without connecting to a specific input
// AZ top level, but different AZ in MediaLive input connection
new RouterOutput(stack, 'RouterOutput2', {
  routerOutputName: 'test-medialive-no-input',
  maximumBitrate: cdk.Bitrate.mbps(12),
  routingScope: RoutingScope.REGIONAL,
  regionName: 'eu-west-1',
  tier: RouterOutputTier.OUTPUT_50,
  configuration: RouterOutputConfiguration.mediaLiveInputWithoutConnection({
    availabilityZone: 'eu-west-1a',
  }),
});

new IntegTest(app, 'cdk-integ-emx-router-output-az-different-to-stack-region', {
  testCases: [stack],
});

app.synth();
