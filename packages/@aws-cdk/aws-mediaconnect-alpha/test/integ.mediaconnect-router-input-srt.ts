import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

import { RouterInput, RouterInputConfiguration, RouterInputProtocol, RouterInputTier, RoutingScope } from '../lib/router-input';
import { RouterNetworkConfiguration, RouterNetworkInterface } from '../lib/router-network-interface';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-mediaconnect-router-input-srt');

const networkInterface = new RouterNetworkInterface(stack, 'network', {
  routerNetworkInterfaceName: 'srt-network',
  configuration: RouterNetworkConfiguration.publicNetwork({
    cidr: ['10.0.0.0/16'],
  }),
});

// Create role and secret for SRT decryption
const srtRole = new Role(stack, 'SrtRole', {
  assumedBy: new ServicePrincipal('mediaconnect.amazonaws.com'),
});

const srtSecret = new Secret(stack, 'SrtSecret', {
  description: 'SRT decryption key for RouterInput',
});
const grant = srtSecret.grantRead(srtRole);

// RouterInput with SRT Listener configuration
const input = new RouterInput(stack, 'routerInputSrtListener', {
  routerInputName: 'srt-listener-input',
  maximumBitrate: cdk.Bitrate.mbps(3),
  routingScope: RoutingScope.REGIONAL,
  tier: RouterInputTier.INPUT_20,
  configuration: RouterInputConfiguration.standard({
    networkInterface,
    protocol: RouterInputProtocol.srtListener({
      port: 7000,
      minimumLatency: Duration.millis(120),
      decryptionConfiguration: {
        role: srtRole,
        secret: srtSecret,
      },
    }),
  }),
});

// RouterInput with SRT Caller configuration
const input2 = new RouterInput(stack, 'routerInputSrtCaller', {
  routerInputName: 'srt-caller-input',
  maximumBitrate: cdk.Bitrate.mbps(4),
  routingScope: RoutingScope.GLOBAL,
  tier: RouterInputTier.INPUT_50,
  configuration: RouterInputConfiguration.standard({
    networkInterface,
    protocol: RouterInputProtocol.srtCaller({
      sourceAddress: '203.0.113.10',
      sourcePort: 8000,
      minimumLatency: Duration.millis(150),
      streamId: 'test-stream-input',
      decryptionConfiguration: {
        role: srtRole,
        secret: srtSecret,
      },
    }),
  }),
});

// Make sure the policy exists first... before creating the input
input.node.addDependency(grant);
input2.node.addDependency(grant);

new IntegTest(app, 'cdk-integ-emx-router-input-srt', {
  testCases: [stack],
});

app.synth();
