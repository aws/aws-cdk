import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { RouterNetworkInterface, RouterNetworkConfiguration } from '../lib/router-network-interface';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-mediaconnect-router-minimal');

// Just test the network interface first
new RouterNetworkInterface(stack, 'network', {
  routerNetworkInterfaceName: 'minimal-test-network',
  configuration: RouterNetworkConfiguration.publicNetwork({
    cidr: ['172.16.0.0/16'],
  }),
});

new IntegTest(app, 'cdk-integ-emx-router-minimal', {
  testCases: [stack],
});

app.synth();
