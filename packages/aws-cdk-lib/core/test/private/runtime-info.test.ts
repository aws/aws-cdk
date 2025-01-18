import { MetadataEntry } from 'constructs';
import { Code, Function, Runtime } from '../../../aws-lambda';
import { Stack } from '../../lib';
import { MetadataType, redactTelemetryDataHelper } from '../../lib/metadata-resource';
import {
  constructInfoFromConstruct,
  filterMetadataType,
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

  const constructInfo = constructInfoFromConstruct(myFunction);
  expect(constructInfo?.metadata).toMatchObject([
    {
      type: 'aws:cdk:analytics:construct',
      trace: undefined,
      data: expect.any(Object), // Matches any object for `data`
    },
  ]);
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
      type: MetadataType.FEATURE_FLAG,
      data: 'foobar',
    },
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

  const metadata = [
    { data: { hello: 'world' } },
    {
      data: {
        bool: true,
        nested: { foo: 'bar' },
        arr: [1, 2, 3],
        str: 'foo',
        arrOfObjects: [{ foo: { hello: 'world' } }, { myFunc: myFunction }],
      },
    },
    {
      data: { bool: true, nested: { foo: 'bar' }, arr: [1, 2, 3], str: 'foo' },
    },
    {
      data: 'foobar',
    },
    {
      data: 'foo',
    },
  ];

  // TODO: change this test case to verify that we only collect objects
  // that's part of CDK and redact any customer provided object.
  expect(redactTelemetryDataHelper(metadata)).toEqual([
    { data: { hello: '*' } },
    {
      data: {
        bool: true,
        nested: { foo: '*' },
        arr: ['*', '*', '*'],
        str: '*',
        arrOfObjects: [{ foo: { hello: '*' } }, { myFunc: '*' }],
      },
    },
    {
      data: {
        bool: true,
        nested: { foo: '*' },
        arr: ['*', '*', '*'],
        str: '*',
      },
    },
    {
      data: '*',
    },
    {
      data: '*',
    },
  ]);
});
