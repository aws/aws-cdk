import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as iot from '../lib';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

test('Default property', () => {
  // WHEN
  new iot.Thing(stack, 'MyThing');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::Thing', {
  });
});

test('can get thing name', () => {
  // WHEN
  const thing = new iot.Thing(stack, 'MyThing');
  new cdk.CfnResource(stack, 'Res', {
    type: 'Test::Resource',
    properties: {
      ThingName: thing.thingName,
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Test::Resource', {
    ThingName: { Ref: 'MyThingDFC59ABB' },
  });
});

test('can set physical name', () => {
  // WHEN
  new iot.Thing(stack, 'MyThing', {
    thingName: 'PhysicalName',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::Thing', {
    ThingName: 'PhysicalName',
  });
});

test('can set description', () => {
  // WHEN
  new iot.Thing(stack, 'MyThing', {
    attributes: {
      attr1: 'attr1-value',
      attr2: 'attr2-value',
      attr3: 'attr3-value',
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::Thing', {
    AttributePayload: {
      Attributes: {
        attr1: 'attr1-value',
        attr2: 'attr2-value',
        attr3: 'attr3-value',
      },
    },
  });
});

test('cannot set more than three attributes', () => {
  expect(() => {
    new iot.Thing(stack, 'MyThing', {
      attributes: {
        attr1: 'attr1-value',
        attr2: 'attr2-value',
        attr3: 'attr3-value',
        attr4: 'attr4-value',
      },
    });
  }).toThrow('Thing cannot have more than three attributes.');
});

test('can import a Thing by name', () => {
  // WHEN
  const thing = iot.Thing.fromThingName(stack, 'ThingFromArn', 'test-thing');

  // THEN
  expect(thing).toMatchObject({
    thingName: 'test-thing',
  });
});
