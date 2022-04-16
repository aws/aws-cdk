import { massageSpec } from '../build-tools/massage-spec';
import { schema } from '../lib';

test('dropTypelessAttributes works correctly', () => {
  const spec: schema.Specification = {
    Fingerprint: 'some-fingerprint',
    PropertyTypes: {
      'CDK::Test::Property': {
        Properties: {
          Type: ({
            PrimitiveType: 'String',
          } as schema.ScalarProperty), // ts is being weird and doesn't correctly match the type
        },
      },
    },
    ResourceTypes: {
      'CDK::Test::Resource': {
        Attributes: {
          Attribute1: ({
            PrimitiveType: 'String',
          } as schema.PrimitiveAttribute), // ts is being weird and doesn't correctly match the type
          Attribute2: ({} as schema.PrimitiveAttribute),
        },
        Documentation: 'https://documentation-url/cdk/test/resource',
        Properties: {
          ResourceArn: ({
            PrimitiveType: 'String',
          } as schema.PrimitiveProperty), // ts is being weird and doesn't correctly match the type
        },
      },
    },
  };

  massageSpec(spec);

  expect(spec).toEqual({
    Fingerprint: 'some-fingerprint',
    PropertyTypes: {
      'CDK::Test::Property': {
        Properties: {
          Type: ({
            PrimitiveType: 'String',
          } as schema.ScalarProperty), // ts is being weird and doesn't correctly match the type
        },
      },
    },
    ResourceTypes: {
      'CDK::Test::Resource': {
        Attributes: {
          Attribute1: ({
            PrimitiveType: 'String',
          }),
        },
        Documentation: 'https://documentation-url/cdk/test/resource',
        Properties: {
          ResourceArn: {
            PrimitiveType: 'String',
          },
        },
      },
    },
  });
});
