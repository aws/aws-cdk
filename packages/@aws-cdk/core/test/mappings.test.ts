import { ArtifactMetadataEntryType } from '@aws-cdk/cloud-assembly-schema';
import { CloudAssembly } from '@aws-cdk/cx-api';
import { App, Aws, CfnMapping, CfnResource, Fn, Stack } from '../lib';
import { toCloudFormation } from './util';

describe('mappings', () => {
  test('mappings can be added as another type of entity, and mapping.findInMap can be used to get a token', () => {
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
    expect(() => mapping.findInMap('NotFoundTopLevel', 'NotFound')).toThrow('Mapping doesn\'t contain top-level key \'NotFoundTopLevel\'');
    expect(() => mapping.findInMap('TopLevelKey1', 'NotFound')).toThrow('Mapping doesn\'t contain second-level key \'NotFound\'');

    // set value can be used to set/modify a specific value
    mapping.setValue('TopLevelKey2', 'SecondLevelKey2', 'Hi');
    mapping.setValue('TopLevelKey1', 'SecondLevelKey1', [1, 2, 3, 4]);

    expect(toCloudFormation(stack)).toEqual({
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
  });

  test('allow using unresolved tokens in find-in-map', () => {
    const stack = new Stack();

    const mapping = new CfnMapping(stack, 'mapping', {
      mapping: {
        'us-east-1': {
          instanceCount: 12,
        },
      },
    });

    const v1 = mapping.findInMap(Aws.REGION, 'instanceCount');
    const v2 = Fn.findInMap(mapping.logicalId, Aws.REGION, 'instanceCount');

    const expected = { 'Fn::FindInMap': ['mapping', { Ref: 'AWS::Region' }, 'instanceCount'] };
    expect(stack.resolve(v1)).toEqual(expected);
    expect(stack.resolve(v2)).toEqual(expected);
    expect(toCloudFormation(stack).Mappings).toEqual({
      mapping: {
        'us-east-1': {
          instanceCount: 12,
        },
      },
    });
  });

  test('no validation if first key is token and second is a static string', () => {
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
    expect(stack.resolve(v)).toEqual({
      'Fn::FindInMap': ['mapping', { Ref: 'AWS::Region' }, 'size'],
    });
    expect(toCloudFormation(stack).Mappings).toEqual({
      mapping: {
        'us-east-1': {
          size: 12,
        },
      },
    });
  });

  test('validate first key if it is a string and second is a token', () => {
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
    expect(() => mapping.findInMap('not-found', 'size')).toThrow(/Mapping doesn't contain top-level key 'not-found'/);
    expect(stack.resolve(v)).toEqual({ 'Fn::FindInMap': ['mapping', { Ref: 'AWS::Region' }, 'size'] });
    expect(toCloudFormation(stack).Mappings).toEqual({
      mapping: {
        'us-east-1': {
          size: 12,
        },
      },
    });
  });

  test('throws if mapping attribute name not alphanumeric', () => {
    const stack = new Stack();
    expect(() => new CfnMapping(stack, 'mapping', {
      mapping: {
        size: {
          'us-east-1': 12,
        },
      },
    })).toThrowError(/Attribute name 'us-east-1' must contain only alphanumeric characters./);
  });
});

describe('lazy mapping', () => {
  let stack: Stack;
  let mapping: CfnMapping;
  const backing = {
    TopLevelKey1: {
      SecondLevelKey1: [1, 2, 3],
      SecondLevelKey2: { Hello: 'World' },
    },
  };

  beforeEach(() => {
    stack = new Stack();
    mapping = new CfnMapping(stack, 'Lazy Mapping', {
      mapping: backing,
      lazy: true,
    });
  });

  it('does not create CfnMapping if findInMap keys can be resolved', () => {
    const retrievedValue = mapping.findInMap('TopLevelKey1', 'SecondLevelKey1');

    expect(stack.resolve(retrievedValue)).toStrictEqual([1, 2, 3]);
    expect(toCloudFormation(stack)).toStrictEqual({});
  });

  it('does not create CfnMapping if findInMap is not called', () => {
    expect(toCloudFormation(stack)).toStrictEqual({});
  });

  it('creates CfnMapping if top level key cannot be resolved', () => {
    const retrievedValue = mapping.findInMap(Aws.REGION, 'SecondLevelKey1');

    expect(stack.resolve(retrievedValue)).toStrictEqual({ 'Fn::FindInMap': ['LazyMapping', { Ref: 'AWS::Region' }, 'SecondLevelKey1'] });
    expect(toCloudFormation(stack)).toStrictEqual({
      Mappings: {
        LazyMapping: backing,
      },
    });
  });

  it('creates CfnMapping if second level key cannot be resolved', () => {
    const retrievedValue = mapping.findInMap('TopLevelKey1', Aws.REGION);

    expect(stack.resolve(retrievedValue)).toStrictEqual({ 'Fn::FindInMap': ['LazyMapping', 'TopLevelKey1', { Ref: 'AWS::Region' }] });
    expect(toCloudFormation(stack)).toStrictEqual({
      Mappings: {
        LazyMapping: backing,
      },
    });
  });

  it('throws if keys can be resolved but are not found in backing', () => {
    expect(() => mapping.findInMap('NonExistentKey', 'SecondLevelKey1'))
      .toThrowError(/Mapping doesn't contain top-level key .*/);
    expect(() => mapping.findInMap('TopLevelKey1', 'NonExistentKey'))
      .toThrowError(/Mapping doesn't contain second-level key .*/);
  });
});

describe('eager by default', () => {
  const backing = {
    TopLevelKey1: {
      SecondLevelKey1: [1, 2, 3],
      SecondLevelKey2: { Hello: 'World' },
    },
  };

  let app: App;
  let stack: Stack;
  let mapping: CfnMapping;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack');
    mapping = new CfnMapping(stack, 'Lazy Mapping', {
      mapping: backing,
    });
  });

  it('emits warning if no findInMap called', () => {
    const assembly = app.synth();

    expect(getInfoAnnotations(assembly)).toStrictEqual([{
      path: '/Stack/Lazy Mapping',
      message: 'Consider making this CfnMapping a lazy mapping by providing `lazy: true`: either no findInMap was called or every findInMap could be immediately resolved without using Fn::FindInMap',
    }]);
  });

  it('emits warning if every findInMap resolves immediately', () => {
    mapping.findInMap('TopLevelKey1', 'SecondLevelKey1');

    const assembly = app.synth();

    expect(getInfoAnnotations(assembly)).toStrictEqual([{
      path: '/Stack/Lazy Mapping',
      message: 'Consider making this CfnMapping a lazy mapping by providing `lazy: true`: either no findInMap was called or every findInMap could be immediately resolved without using Fn::FindInMap',
    }]);
  });

  it('does not emit warning if a findInMap could not resolve immediately', () => {
    mapping.findInMap('TopLevelKey1', Aws.REGION);

    const assembly = app.synth();

    expect(getInfoAnnotations(assembly)).toStrictEqual([]);
  });
});

function getInfoAnnotations(casm: CloudAssembly) {
  const result = new Array<{ path: string, message: string }>();
  for (const stack of Object.values(casm.manifest.artifacts ?? {})) {
    for (const [path, md] of Object.entries(stack.metadata ?? {})) {
      for (const x of md) {
        if (x.type === ArtifactMetadataEntryType.INFO) {
          result.push({ path, message: x.data as string });
        }
      }
    }
  }
  return result;
}
