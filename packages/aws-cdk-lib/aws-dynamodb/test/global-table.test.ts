import { Template } from '../../assertions';
import { Stack } from '../../core';
import { GlobalTable, Billing, Capacity, AttributeType } from '../lib';

/* eslint-disable no-console */
describe('global table configuration', () => {
  test('with default properties', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      billing: Billing.provisioned({
        readCapacity: Capacity.fixed(10),
        writeCapacity: Capacity.autoscaled({
          minCapacity: 1,
          maxCapacity: 10,
        }),
      }),
      pointInTimeRecovery: true,
      contributorInsights: true,
      globalSecondaryIndexes: [
        {
          indexName: 'gsi',
          partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
          writeCapacity: Capacity.autoscaled({
            minCapacity: 10,
            maxCapacity: 50,
            targetUtilizationPercent: 80,
          }),
        },
      ],
      replicas: [
        { region: stack.region, readCapacity: Capacity.autoscaled({ minCapacity: 1, maxCapacity: 10 }) },
        { region: 'us-east-1', pointInTimeRecovery: false },
      ],
    });

    // THEN
    console.log(JSON.stringify(Template.fromStack(stack), null, 4));
  });

  test('with contributor insights enabled', () => {

  });

  test('with deletion protection enabled', () => {

  });

  test('with point-in-time recovery enabled', () => {

  });

  test('with standard IA table class', () => {

  });

  test('with table name', () => {

  });

  test('with TTL attribute', () => {

  });

  test('with removal policy as DESTROY', () => {

  });

  test('with provisioned billing', () => {

  });
});

describe('replica table configuration', () => {

});

describe('secondary indexes', () => {

});

describe('billing and capacity', () => {

});