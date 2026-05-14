import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';

import { RouterInput, RouterInputConfiguration, RouterInputProtocol, RouterInputTier, RoutingScope } from '../lib/router-input';
import { RouterNetworkConfiguration, RouterNetworkInterface } from '../lib/router-network-interface';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-mediaconnect-router-input-merge');

const networkInterface = new RouterNetworkInterface(stack, 'network', {
  routerNetworkInterfaceName: 'merge-network',
  configuration: RouterNetworkConfiguration.publicNetwork({
    cidr: ['10.0.0.0/16'],
  }),
});

// RouterInput with merge configuration - two RIST protocols
new RouterInput(stack, 'routerInputMerge', {
  routerInputName: 'merge-input',
  maximumBitrate: cdk.Bitrate.mbps(8),
  routingScope: RoutingScope.GLOBAL,
  tier: RouterInputTier.INPUT_20,
  regionName: 'us-east-1',
  configuration: RouterInputConfiguration.merge({
    networkInterface,
    protocols: [
      RouterInputProtocol.rist({
        port: 6000,
        recoveryLatency: Duration.millis(200),
      }),
      RouterInputProtocol.rist({
        port: 6002,
        recoveryLatency: Duration.millis(200),
      }),
    ],
    mergeRecoveryWindow: Duration.millis(500),
  }),
});

new IntegTest(app, 'cdk-integ-emx-router-input-merge', {
  testCases: [stack],
});

app.synth();
