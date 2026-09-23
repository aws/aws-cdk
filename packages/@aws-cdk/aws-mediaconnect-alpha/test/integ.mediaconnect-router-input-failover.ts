import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';

import { PrimarySource, RouterInput, RouterInputConfiguration, RouterInputProtocol, RouterInputTier, RoutingScope, SourcePriorityConfig } from '../lib/router-input';
import { RouterNetworkConfiguration, RouterNetworkInterface } from '../lib/router-network-interface';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-mediaconnect-router-input-failover');

const networkInterface = new RouterNetworkInterface(stack, 'network', {
  routerNetworkInterfaceName: 'failover-network',
  configuration: RouterNetworkConfiguration.publicNetwork({
    cidr: ['10.0.0.0/16'],
  }),
});

// RouterInput with failover configuration - two RTP protocols
new RouterInput(stack, 'routerInputFailover', {
  routerInputName: 'failover-input',
  maximumBitrate: cdk.Bitrate.mbps(5),
  routingScope: RoutingScope.REGIONAL,
  tier: RouterInputTier.INPUT_50,
  regionName: 'us-east-1',
  configuration: RouterInputConfiguration.failover({
    networkInterface,
    protocols: [
      RouterInputProtocol.rtp({ port: 5000 }), // Primary
      RouterInputProtocol.rtp({ port: 5001 }), // Secondary
    ],
    sourcePriority: SourcePriorityConfig.primarySecondary(PrimarySource.FIRST_SOURCE),
  }),
});

new IntegTest(app, 'cdk-integ-emx-router-input-failover', {
  testCases: [stack],
});

app.synth();
