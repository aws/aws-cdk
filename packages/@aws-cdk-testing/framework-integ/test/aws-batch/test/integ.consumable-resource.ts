/// !cdk-integ *

import { App, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as batch from 'aws-cdk-lib/aws-batch';

const app = new App();
const stack = new Stack(app, 'BatchConsumableResourceIntegTest');

// Create a REPLENISHABLE consumable resource
new batch.ConsumableResource(stack, 'ReplenishableResource', {
  consumableResourceName: 'test-replenishable-license',
  resourceType: batch.ConsumableResourceType.REPLENISHABLE,
  totalQuantity: 100,
});

// Create a NON_REPLENISHABLE consumable resource
new batch.ConsumableResource(stack, 'NonReplenishableResource', {
  consumableResourceName: 'test-non-replenishable-license',
  resourceType: batch.ConsumableResourceType.NON_REPLENISHABLE,
  totalQuantity: 50,
});

const test = new IntegTest(app, 'BatchConsumableResourceTest', {
  testCases: [stack],
});

// Verify replenishable resource was created
test.assertions.awsApiCall('Batch', 'listConsumableResources', {
  filters: [{
    name: 'CONSUMABLE_RESOURCE_NAME',
    values: ['test-replenishable-license'],
  }],
}).expect(ExpectedResult.objectLike({
  consumableResources: [{
    consumableResourceName: 'test-replenishable-license',
    resourceType: 'REPLENISHABLE',
    totalQuantity: 100,
  }],
}));

// Verify non-replenishable resource was created
test.assertions.awsApiCall('Batch', 'listConsumableResources', {
  filters: [{
    name: 'CONSUMABLE_RESOURCE_NAME',
    values: ['test-non-replenishable-license'],
  }],
}).expect(ExpectedResult.objectLike({
  consumableResources: [{
    consumableResourceName: 'test-non-replenishable-license',
    resourceType: 'NON_REPLENISHABLE',
    totalQuantity: 50,
  }],
}));
