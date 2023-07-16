import { Template } from '../../assertions';
import { Stack } from '../../core';
import { GlobalTable, AttributeType } from '../lib';

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
});

describe('replica table configuration', () => {

});

describe('secondary indexes', () => {

});

describe('billing and capacity', () => {

});