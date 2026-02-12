import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as bedrock from 'aws-cdk-lib/aws-bedrockagentcore';
import { CfnMemoryLogsMixin } from '../../../lib/services/aws-bedrockagentcore/mixins';
import '../../../lib/with';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'VendedLogsMixinTest');

// Source Resource
const memory = new bedrock.CfnMemory(stack, 'Memory', {
  name: 'vended_logs_mixin_memory_01',
  eventExpiryDuration: 7,
});

// Setup traces delivery to XRay
memory.with(CfnMemoryLogsMixin.TRACES.toXRay());

new integ.IntegTest(app, 'DeliveryTest', {
  testCases: [stack],
});
