import { Template } from '../../assertions';
import { Stack } from '../../core';
import { GlobalTable, AttributeType, Billing, Capacity } from '../lib';

/* eslint-disable no-console */
describe('global table configuration', () => {
  test('with default properties', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
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
    // GIVEN
    const stack = new Stack();

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      billing: Billing.provisioned({
        writeCapacity: Capacity.autoscaled({ minCapacity: 10, maxCapacity: 50 }),
        readCapacity: Capacity.fixed(10),
      }),
    });

    // THEN
    console.log(JSON.stringify(Template.fromStack(stack), null, 4));
  });
});

describe('replica table configuration', () => {

});

describe('secondary indexes', () => {

});

describe('billing and capacity', () => {

});