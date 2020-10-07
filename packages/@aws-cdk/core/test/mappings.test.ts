import { nodeunitShim, Test } from 'nodeunit-shim';
import { Aws, CfnMapping, CfnResource, Fn, Stack } from '../lib';
import { toCloudFormation } from './util';

nodeunitShim({
  'mappings can be added as another type of entity, and mapping.findInMap can be used to get a token'(test: Test) {
    const stack = new Stack();
    const mapping = new CfnMapping(stack, 'MyMapping', {
      mapping: {
        TopLevelKey1: {
          SecondLevelKey1: [1, 2, 3],
          SecondLevelKey2: { Hello: 'World' },
        },
        TopLevelKey2: {
          SecondLevelKey1: [99, 99, 99],
        },
      },
    });

    // findInMap can be used to take a reference
    new CfnResource(stack, 'MyResource', {
      type: 'R',
      properties: {
        RefToValueInMap: mapping.findInMap('TopLevelKey1', 'SecondLevelKey1'),
      },
    });
    test.throws(() => mapping.findInMap('NotFoundTopLevel', 'NotFound'), 'Mapping doesn\'t contain top-level key \'NotFoundTopLevel\'');
    test.throws(() => mapping.findInMap('TopLevelKey1', 'NotFound'), 'Mapping doesn\'t contain second-level key \'NotFound\'');

    // set value can be used to set/modify a specific value
    mapping.setValue('TopLevelKey2', 'SecondLevelKey2', 'Hi');
    mapping.setValue('TopLevelKey1', 'SecondLevelKey1', [1, 2, 3, 4]);

    test.deepEqual(toCloudFormation(stack), {
      Mappings:
      {
        MyMapping:
         {
           TopLevelKey1:
          {
            SecondLevelKey1: [1, 2, 3, 4],
            SecondLevelKey2: { Hello: 'World' },
          },
           TopLevelKey2: { SecondLevelKey1: [99, 99, 99], SecondLevelKey2: 'Hi' },
         },
      },
      Resources:
      {
        MyResource:
         {
           Type: 'R',
           Properties:
          {
            RefToValueInMap:
           { 'Fn::FindInMap': ['MyMapping', 'TopLevelKey1', 'SecondLevelKey1'] },
          },
         },
      },
    });

    test.done();
  },

  'allow using unresolved tokens in find-in-map'(test: Test) {
    const stack = new Stack();

    const mapping = new CfnMapping(stack, 'mapping', {
      mapping: {
        instanceCount: {
          'us-east-1': 12,
        },
      },
    });

    const v1 = mapping.findInMap('instanceCount', Aws.REGION);
    const v2 = Fn.findInMap(mapping.logicalId, 'instanceCount', Aws.REGION);

    const expected = { 'Fn::FindInMap': ['mapping', 'instanceCount', { Ref: 'AWS::Region' }] };
    test.deepEqual(stack.resolve(v1), expected);
    test.deepEqual(stack.resolve(v2), expected);
    test.done();
  },

  'no validation if first key is token and second is a static string'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const mapping = new CfnMapping(stack, 'mapping', {
      mapping: {
        'us-east-1': {
          size: 12,
        },
      },
    });

    // WHEN
    const v = mapping.findInMap(Aws.REGION, 'size');

    // THEN
    test.deepEqual(stack.resolve(v), {
      'Fn::FindInMap': ['mapping', { Ref: 'AWS::Region' }, 'size'],
    });
    test.done();
  },

  'validate first key if it is a string and second is a token'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const mapping = new CfnMapping(stack, 'mapping', {
      mapping: {
        size: {
          'us-east-1': 12,
        },
      },
    });

    // WHEN
    const v = mapping.findInMap('size', Aws.REGION);

    // THEN
    test.throws(() => mapping.findInMap('not-found', Aws.REGION), /Mapping doesn't contain top-level key 'not-found'/);
    test.deepEqual(stack.resolve(v), { 'Fn::FindInMap': ['mapping', 'size', { Ref: 'AWS::Region' }] });
    test.done();
  },
});
