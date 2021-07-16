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

describe('lazy mapping', () => {
  let stack: Stack;
  const backing = {
    TopLevelKey1: {
      SecondLevelKey1: [1, 2, 3],
      SecondLevelKey2: { Hello: 'World' },
    },
  };
  const mappingId = '@aws-cdk/core.TestLazyMapping';

  beforeAll(() => {
    CfnMapping.registerLazyMap(mappingId, backing);
  });

  beforeEach(() => {
    stack = new Stack();
  });

  it('does not create CfnMapping if keys can be resolved', () => {
    const retrievedValue = CfnMapping.findInLazyMap(stack, mappingId, 'TopLevelKey1', 'SecondLevelKey1');

    expect(stack.resolve(retrievedValue)).toStrictEqual([1, 2, 3]);
    expect(toCloudFormation(stack)).toStrictEqual({});
  });

  it('creates CfnMapping if top level key cannot be resolved', () => {
    const retrievedValue = CfnMapping.findInLazyMap(stack, mappingId, Aws.REGION, 'SecondLevelKey1');

    expect(stack.resolve(retrievedValue)).toStrictEqual({ 'Fn::FindInMap': ['awscdkcoreTestLazyMapping', { Ref: 'AWS::Region' }, 'SecondLevelKey1'] });
    expect(toCloudFormation(stack)).toStrictEqual({
      Mappings: {
        awscdkcoreTestLazyMapping: {
          TopLevelKey1: {
            SecondLevelKey1: [1, 2, 3],
            SecondLevelKey2: { Hello: 'World' },
          },
        },
      },
    });
  });

  it('creates CfnMapping if second level key cannot be resolved', () => {
    const retrievedValue = CfnMapping.findInLazyMap(stack, mappingId, 'TopLevelKey1', Aws.REGION);

    expect(stack.resolve(retrievedValue)).toStrictEqual({ 'Fn::FindInMap': ['awscdkcoreTestLazyMapping', 'TopLevelKey1', { Ref: 'AWS::Region' }] });
    expect(toCloudFormation(stack)).toStrictEqual({
      Mappings: {
        awscdkcoreTestLazyMapping: {
          TopLevelKey1: {
            SecondLevelKey1: [1, 2, 3],
            SecondLevelKey2: { Hello: 'World' },
          },
        },
      },
    });
  });

  it('only creates CfnMapping once if key cannot be resolved', () => {
    CfnMapping.findInLazyMap(stack, mappingId, Aws.REGION, 'SecondLevelKey1');

    expect(() => CfnMapping.findInLazyMap(stack, mappingId, Aws.REGION, 'SecondLevelKey2')).not.toThrow();
    expect(toCloudFormation(stack)).toStrictEqual({
      Mappings: {
        awscdkcoreTestLazyMapping: {
          TopLevelKey1: {
            SecondLevelKey1: [1, 2, 3],
            SecondLevelKey2: { Hello: 'World' },
          },
        },
      },
    });
  });

  it('does not throw if mapping has already been registered with the same backing', () => {
    expect(() => CfnMapping.registerLazyMap(mappingId, backing)).not.toThrow();
  });

  it('throws if mapping has already been registered with a different backing', () => {
    expect(() => CfnMapping.registerLazyMap(mappingId, {
      TopLevelKey2: {
        SecondLevelKey3: 'somevalue',
      },
    })).toThrowError(/Attempted to register mapping .* but a different mapping has already been registered with this ID/);
  });

  it('throws if mapping has not been registered', () => {
    expect(() => CfnMapping.findInLazyMap(stack, 'NonExistentMappingId', 'TopLevelKey1', 'SecondLevelKey1'))
      .toThrowError(/Mapping .* is not registered as a lazy map/);
  });

  it('throws if keys can be resolved but are not found in backing', () => {
    expect(() => CfnMapping.findInLazyMap(stack, mappingId, 'NonExistentKey', 'SecondLevelKey1'))
      .toThrowError(/Mapping .* does not contain top-level key .*/);
    expect(() => CfnMapping.findInLazyMap(stack, mappingId, 'TopLevelKey1', 'NonExistentKey'))
      .toThrowError(/Mapping .* does not contain second-level key .*/);
  });
});
