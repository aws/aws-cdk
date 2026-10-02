/**
 * Integration test: router inputs configured without an upstream connection.
 *
 * Covers the two "prepare-the-input-before-the-source-exists" paths:
 * - `RouterInputConfiguration.mediaConnectFlowWithoutConnection`
 * - `RouterInputConfiguration.mediaLiveChannelWithoutConnection`
 *
 * Both take only an `availabilityZone` — no real flow / channel is required.
 * This validates the service accepts the AZ-pending-connection shape.
 */
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';

import { RouterInput, RouterInputConfiguration, RouterInputTier, RoutingScope } from '../lib/router-input';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-mediaconnect-router-input-without-connection');

new RouterInput(stack, 'FlowWithoutConnection', {
  routerInputName: 'flow-pending',
  maximumBitrate: cdk.Bitrate.mbps(5),
  routingScope: RoutingScope.REGIONAL,
  tier: RouterInputTier.INPUT_20,
  configuration: RouterInputConfiguration.mediaConnectFlowWithoutConnection({
    availabilityZone: `${stack.region}a`,
  }),
});

new RouterInput(stack, 'MediaLiveChannelWithoutConnection', {
  routerInputName: 'medialive-channel-pending',
  maximumBitrate: cdk.Bitrate.mbps(5),
  routingScope: RoutingScope.REGIONAL,
  tier: RouterInputTier.INPUT_20,
  configuration: RouterInputConfiguration.mediaLiveChannelWithoutConnection({
    availabilityZone: `${stack.region}a`,
  }),
});

new IntegTest(app, 'cdk-integ-emx-router-input-without-connection', {
  testCases: [stack],
});

app.synth();
