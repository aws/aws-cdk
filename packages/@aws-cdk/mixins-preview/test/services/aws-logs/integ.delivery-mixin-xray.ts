import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as bedrock from 'aws-cdk-lib/aws-bedrockagentcore';
import { CfnMemoryLogsMixin } from '../../../lib/services/aws-bedrockagentcore/mixins';
import '../../../lib/with';
import { XRayDeliveryDestination } from '../../../lib/services/aws-logs';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'VendedLogsMixinTest');

// Source Resource for toXRay
const memory1 = new bedrock.CfnMemory(stack, 'Memory1', {
  name: 'vended_logs_mixin_memory_01',
  eventExpiryDuration: 7,
});

// Source Resource for XRay with toDestination
const memory2 = new bedrock.CfnMemory(stack, 'Memory2', {
  name: 'vended_logs_mixin_memory_02',
  eventExpiryDuration: 7,
});

// destination for XRay Delivery Desintation to be used with toDestination
const destination = new XRayDeliveryDestination(stack, 'DeliveryDestination', {
  sourceResource: memory2.attrMemoryArn,
});

// Setup traces delivery to XRay
memory1.with(CfnMemoryLogsMixin.TRACES.toXRay());
memory2.with(CfnMemoryLogsMixin.TRACES.toDestination(destination));

new integ.IntegTest(app, 'DeliveryTest', {
  testCases: [stack],
});
