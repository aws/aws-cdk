import * as s3 from '../../aws-s3';
import { CfnParameter, Stack } from '../../core';
import * as sfn from '../lib';

describe.each([
  ['JSON', sfn.S3JsonItemReader],
  ['JSONL', sfn.S3JsonLItemReader],
  ['CSV', sfn.S3CsvItemReader],
  ['MANIFEST', sfn.S3ManifestItemReader],
] as const)('%s file item reader keys', (_inputType, ItemReader) => {
  test('reads bucket name and key from the JSONPath state input', () => {
    const stack = new Stack();
    const map = new sfn.DistributedMap(stack, 'Map', {
      itemReader: new ItemReader({
        bucketNamePath: sfn.JsonPath.stringAt('$.manifest_bucket'),
        key: sfn.JsonPath.stringAt('$.data_manifest_key'),
      }),
    });
    map.itemProcessor(new sfn.Pass(stack, 'Pass'));

    const definition = stack.resolve(new sfn.StateGraph(map, 'Test Graph').toGraphJson());

    expect(definition.States.Map.ItemReader.Parameters).toEqual({
      'Bucket.$': '$.manifest_bucket',
      'Key.$': '$.data_manifest_key',
    });
  });

  test('reads a dynamic key from the JSONPath state input with a known bucket', () => {
    const stack = new Stack();
    const bucket = new s3.Bucket(stack, 'Bucket');
    const reader = new ItemReader({ bucket, key: sfn.JsonPath.stringAt('$.key') });

    expect(stack.resolve(reader.render()).Parameters).toEqual({
      'Bucket': { Ref: stack.getLogicalId(bucket.node.defaultChild as s3.CfnBucket) },
      'Key.$': '$.key',
    });
  });

  test('preserves plain JSONPath-looking strings as literal bucket names and keys', () => {
    const reader = new ItemReader({ bucketNamePath: '$.bucketName', key: '$.key' });

    expect(reader.render().Parameters).toEqual({ Bucket: '$.bucketName', Key: '$.key' });
  });

  test('preserves CloudFormation tokens as deployment-time keys', () => {
    const stack = new Stack();
    const key = new CfnParameter(stack, 'Key');
    const reader = new ItemReader({ bucketNamePath: 'my-bucket', key: key.valueAsString });

    expect(stack.resolve(reader.render()).Parameters).toEqual({
      Bucket: 'my-bucket',
      Key: { Ref: 'Key' },
    });
  });

  test('uses JSONata expressions in Arguments', () => {
    const reader = new ItemReader({
      bucketNamePath: '{% $states.input.bucketName %}',
      key: '{% $states.input.key %}',
    });
    const rendered = reader.render(sfn.QueryLanguage.JSONATA);

    expect(rendered.Arguments).toEqual({
      Bucket: '{% $states.input.bucketName %}',
      Key: '{% $states.input.key %}',
    });
    expect(rendered.Parameters).toBeUndefined();
  });
});
