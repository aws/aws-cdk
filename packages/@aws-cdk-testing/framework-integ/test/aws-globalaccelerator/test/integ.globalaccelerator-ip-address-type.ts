import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ga from 'aws-cdk-lib/aws-globalaccelerator';

const app = new App({});

const stack = new Stack(app, 'global-accelerator-ip-address-type');

new ga.Accelerator(stack, 'Accelerator', {
  acceleratorName: 'acceleratorWithIpAddressType',
  ipAddressType: ga.IpAddressType.DUAL_STACK,
});

new IntegTest(app, 'GlobalAcceleratorIpAddressType', {
  testCases: [stack],
});

app.synth();
