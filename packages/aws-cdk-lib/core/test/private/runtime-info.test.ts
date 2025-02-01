import { MetadataEntry } from 'constructs';
import { Code, Function, Runtime } from '../../../aws-lambda';
import { Stack, App } from '../../lib';
import { MetadataType, redactMetadata } from '../../lib/metadata-resource';
import {
  constructInfoFromConstruct,
  filterMetadataType,
} from '../../lib/private/runtime-info';

test('test constructInfoFromConstruct can correctly get metadata information', () => {
  const app = new App();
  app.node.setContext('@aws-cdk/core:enableAdditionalMetadataCollection', true);
  const stack = new Stack(app);
  const myFunction = new Function(stack, 'MyFunction', {
    runtime: Runtime.PYTHON_3_9,
    handler: 'index.handler',
    code: Code.fromInline(
      "def handler(event, context):\n\tprint('The function has been invoked.')",
    ),
  });

  const constructInfo = constructInfoFromConstruct(myFunction);
  expect(constructInfo?.metadata).toMatchObject(['*']);
});

test('test filterMetadataType correct filter', () => {
  const metadata: MetadataEntry[] = [
    { type: MetadataType.CONSTRUCT, data: { hello: 'world' } },
    {
      type: MetadataType.METHOD,
      data: {
        bool: true,
        nested: { foo: 'bar' },
        arr: [1, 2, 3],
        str: 'foo',
        arrOfObjects: [{ foo: { hello: 'world' } }],
      },
    },
    {
      type: 'hello',
      data: { bool: true, nested: { foo: 'bar' }, arr: [1, 2, 3], str: 'foo' },
    },
    {
      type: MetadataType.FEATURE_FLAG,
      data: 'foobar',
    },
  ];

  expect(filterMetadataType(metadata)).toEqual([
    { hello: 'world' },
    {
      bool: true,
      nested: { foo: 'bar' },
      arr: [1, 2, 3],
      str: 'foo',
      arrOfObjects: [{ foo: { hello: 'world' } }],
    },
    'foobar',
  ]);
});
