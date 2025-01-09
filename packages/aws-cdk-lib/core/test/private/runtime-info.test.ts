import { MetadataEntry } from 'constructs';
import { Code, Function, Runtime } from '../../../aws-lambda';
import { Stack } from '../../lib';
import { MetadataType } from '../../lib/metadata-resource';
import {
  constructInfoFromConstruct,
  redactTelemetryData,
} from '../../lib/private/runtime-info';

test('test constructInfoFromConstruct can correctly get metadata information', () => {
  const stack = new Stack();
  const myFunction = new Function(stack, 'MyFunction', {
    runtime: Runtime.PYTHON_3_9,
    handler: 'index.handler',
    code: Code.fromInline(
      "def handler(event, context):\n\tprint('The function has been invoked.')",
    ),
  });
  myFunction.node.addMetadata('hello', 'foo');
  myFunction.node.addMetadata(MetadataType.CONSTRUCT, { foo: 'bar' });

  const constructInfo = constructInfoFromConstruct(myFunction);
  expect(constructInfo?.metadata).toEqual([
    { type: MetadataType.CONSTRUCT, data: { foo: '*' } },
  ]);
});

test('test metadata is redacted correctly', () => {
  const stack = new Stack();
  const myFunction = new Function(stack, 'MyFunction', {
    runtime: Runtime.PYTHON_3_9,
    handler: 'index.handler',
    code: Code.fromInline(
      "def handler(event, context):\n\tprint('The function has been invoked.')",
    ),
  });

  const metadata: MetadataEntry[] = [
    { type: 'foo', data: { hello: 'world' } },
    {
      type: MetadataType.CONSTRUCT,
      data: {
        bool: true,
        nested: { foo: 'bar' },
        arr: [1, 2, 3],
        str: 'foo',
        arrOfObjects: [{ foo: { hello: 'world' } }, { myFunc: myFunction }],
      },
    },
    {
      type: MetadataType.METHOD,
      data: { bool: true, nested: { foo: 'bar' }, arr: [1, 2, 3], str: 'foo' },
    },
    {
      type: MetadataType.FEATURE_FLAGS,
      data: 'foobar',
    },
    {
      type: 'aws:cdk:analytics:construct',
      data: 'foo',
    },
  ];

  expect(redactTelemetryData(metadata)).toEqual([
    {
      type: MetadataType.CONSTRUCT,
      data: {
        bool: true,
        nested: { foo: '*' },
        arr: ['*', '*', '*'],
        str: '*',
        arrOfObjects: [{ foo: { hello: '*' } }, { myFunc: '*' }],
      },
    },
    {
      type: MetadataType.METHOD,
      data: {
        bool: true,
        nested: { foo: '*' },
        arr: ['*', '*', '*'],
        str: '*',
      },
    },
    {
      type: MetadataType.FEATURE_FLAGS,
      data: '*',
    },
    {
      type: 'aws:cdk:analytics:construct',
      data: '*',
    },
  ]);
});
