import { CfnSpecValidator } from '../build-tools/validate-cfn';

describe('single-valued type', () => {
  test('error if Type and PrimitiveType are both absent', () => {
    expect(errorsFor(resourceTypeProperty({}))).toEqual([
      expect.stringContaining("must have exactly one of 'Type', 'PrimitiveType'"),
    ]);
  });

  test('error if referenced type does not exist', () => {
    expect(errorsFor(resourceTypeProperty({
      Type: 'Xyz',
    }))).toEqual([
      expect.stringContaining("unknown property type name 'Xyz'"),
    ]);
  });

  test('error if Type and PrimitiveType are both present', () => {
    expect(errorsFor(resourceTypeProperty({
      Type: 'Asdf',
      PrimitiveType: 'String',
    }))).toEqual([
      expect.stringContaining("must have exactly one of 'Type', 'PrimitiveType'"),
    ]);
  });

  test('error if ItemType is present', () => {
    expect(errorsFor(resourceTypeProperty({
      PrimitiveType: 'String',
      ItemType: 'Asdf',
    }))).toEqual([
      expect.stringContaining("only 'List' or 'Map' types"),
    ]);
  });

  test('error if PrimitiveItemType is present and Type is not a collection', () => {
    expect(errorsFor(resourceTypeProperty({
      PrimitiveType: 'String',
      PrimitiveItemType: 'Asdf',
    }))).toEqual([
      expect.stringContaining("only 'List' or 'Map' types"),
    ]);
  });
});

describe('collection type', () => {
  test('error if ItemType or PrimitiveItemType are both present', () => {
    expect(errorsFor(resourceTypeProperty({
      Type: 'List',
      PrimitiveItemType: 'String',
      ItemType: 'Asdf',
    }))).toEqual([
      expect.stringContaining("must have exactly one of 'ItemType', 'PrimitiveItemType'"),
    ]);
  });

  test('error if ItemType or PrimitiveItemType are both absent', () => {
    expect(errorsFor(resourceTypeProperty({
      Type: 'List',
    }))).toEqual([
      expect.stringContaining("must have exactly one of 'ItemType', 'PrimitiveItemType'"),
    ]);
  });
});

function errorsFor(spec: any) {
  return CfnSpecValidator.validate(spec).map(e => e.message);
}

function resourceTypeProperty(prop: any) {
  return {
    PropertyTypes: {
      'My::Resource::Type.Asdf': {
        Properties: {
          SomeString: { PrimitiveType: 'String' },
        },
      },
    },
    ResourceTypes: {
      'My::Resource::Type': {
        Properties: {
          MyProperty: prop,
        },
      },
    },
  };
}