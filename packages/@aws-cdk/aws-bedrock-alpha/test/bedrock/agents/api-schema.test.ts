import { Stack } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { ApiSchema, AssetApiSchema, InlineApiSchema, S3ApiSchema } from '../../../bedrock/agents/api-schema';

describe('ApiSchema', () => {
  test('fromLocalAsset creates AssetApiSchema', () => {
    const schema = ApiSchema.fromLocalAsset('path/to/schema.yaml');
    expect(schema).toBeInstanceOf(AssetApiSchema);
  });

  test('fromInline creates InlineApiSchema', () => {
    const schema = ApiSchema.fromInline('{"openapi": "3.0.0"}');
    expect(schema).toBeInstanceOf(InlineApiSchema);
  });

  test('fromS3File creates S3ApiSchema', () => {
    const bucket = s3.Bucket.fromBucketName(new Stack(), 'TestBucket', 'test-bucket');
    const schema = ApiSchema.fromS3File(bucket, 'path/to/schema.yaml');
    expect(schema).toBeInstanceOf(S3ApiSchema);
  });
});

describe('AssetApiSchema', () => {
  test('bind initializes asset', () => {
    const stack = new Stack();
    const schema = new AssetApiSchema('test/bedrock/agents/test-schema.yaml');
    // Before binding, asset should be undefined
    expect((schema as any).asset).toBeUndefined();
    schema.bind(stack);
    // After binding, asset should be defined
    expect((schema as any).asset).toBeDefined();
  });

  test('bind only initializes asset once', () => {
    const stack = new Stack();
    const schema = new AssetApiSchema('test/bedrock/agents/test-schema.yaml');
    schema.bind(stack);
    const firstAsset = (schema as any).asset;
    schema.bind(stack);
    const secondAsset = (schema as any).asset;
    // The asset should be the same instance
    expect(firstAsset).toBe(secondAsset);
  });

  test('_render throws error if not bound', () => {
    const schema = new AssetApiSchema('test/bedrock/agents/test-schema.yaml');
    expect(() => {
      schema._render();
    }).toThrow('ApiSchema must be bound to a scope before rendering');
  });

  test('_render returns correct structure after binding', () => {
    const stack = new Stack();
    const schema = new AssetApiSchema('test/bedrock/agents/test-schema.yaml');
    schema.bind(stack);
    const rendered = schema._render();
    expect(rendered).toHaveProperty('s3');
    expect(rendered.s3).toHaveProperty('s3BucketName');
    expect(rendered.s3).toHaveProperty('s3ObjectKey');
  });
});

describe('InlineApiSchema', () => {
  test('constructor sets inlineSchema', () => {
    const schemaContent = '{"openapi": "3.0.0"}';
    const schema = new InlineApiSchema(schemaContent);
    expect(schema.inlineSchema).toBe(schemaContent);
  });

  test('_render returns payload property', () => {
    const schemaContent = '{"openapi": "3.0.0"}';
    const schema = new InlineApiSchema(schemaContent);
    const rendered = schema._render();
    expect(rendered).toEqual({
      payload: schemaContent,
    });
  });
});

describe('S3ApiSchema', () => {
  test('constructor sets s3File', () => {
    const location = {
      bucketName: 'test-bucket',
      objectKey: 'path/to/schema.yaml',
    };
    const schema = new S3ApiSchema(location);
    expect(schema.s3File).toBe(location);
  });

  test('_render returns s3 property', () => {
    const location = {
      bucketName: 'test-bucket',
      objectKey: 'path/to/schema.yaml',
    };
    const schema = new S3ApiSchema(location);
    const rendered = schema._render();
    expect(rendered).toEqual({
      s3: {
        s3BucketName: 'test-bucket',
        s3ObjectKey: 'path/to/schema.yaml',
      },
    });
  });
});
