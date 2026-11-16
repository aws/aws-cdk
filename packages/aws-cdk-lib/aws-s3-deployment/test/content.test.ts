import { Vpc } from '../../aws-ec2';
import * as elbv2 from '../../aws-elasticloadbalancingv2';
import * as lambda from '../../aws-lambda';
import * as s3 from '../../aws-s3';
import * as ssm from '../../aws-ssm';
import { Lazy, Stack, Token, Tokenization } from '../../core';
import { Source } from '../lib';
import { renderData } from '../lib/private/render-data';

const expectEqualIfResolved = (stack: Stack, a: any, b: any) => expect(stack.resolve(a)).toStrictEqual(stack.resolve(b));

/** The token object behind an encoded token string, which is what a marker refers to. */
const tokenOf = (encoded: string) => Tokenization.reverseCompleteString(encoded);

test('simple string', () => {
  expect(renderData('foo')).toStrictEqual({
    markers: {},
    markerEncodings: {},
    text: 'foo',
  });
});

test('string with a "Ref" token', () => {
  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'Bucket');

  const rendered = renderData(`foo-${bucket.bucketName}`);

  expect(rendered.text).toEqual('foo-<<marker:0xbaba:0>>');
  expect(Object.keys(rendered.markers)).toEqual(['<<marker:0xbaba:0>>']);
  expect(rendered.markers['<<marker:0xbaba:0>>']).toBe(tokenOf(bucket.bucketName));
  expect(rendered.markerEncodings).toEqual({});
});

test('string is a single "Ref" token', () => {
  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'Bucket');

  const rendered = renderData(bucket.bucketName);

  expect(rendered.text).toEqual('<<marker:0xbaba:0>>');
  expect(rendered.markers['<<marker:0xbaba:0>>']).toBe(tokenOf(bucket.bucketName));
});

test('multiple markers', () => {
  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'Bucket');

  const rendered = renderData(`boom-${bucket.bucketName}-bam-${bucket.bucketArn}`);

  expect(rendered.text).toEqual('boom-<<marker:0xbaba:0>>-bam-<<marker:0xbaba:1>>');
  expect(Object.keys(rendered.markers)).toEqual(['<<marker:0xbaba:0>>', '<<marker:0xbaba:1>>']);
  expect(rendered.markers['<<marker:0xbaba:0>>']).toBe(tokenOf(bucket.bucketName));
  expect(rendered.markers['<<marker:0xbaba:1>>']).toBe(tokenOf(bucket.bucketArn));
});

test('json-encoded string', () => {
  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'Bucket');
  const tg = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup');
  const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc: new Vpc(stack, 'vpc') });
  lb.addListener('Listener', { port: 80, defaultTargetGroups: [tg] });
  const json = {
    BucketArn: bucket.bucketArn,
    BucketName: bucket.bucketName,
    ComplexFnSelect: tg.firstLoadBalancerFullName + '/' + tg.targetGroupFullName,
  };
  const firstLoadBalancerFullNameTokens = Tokenization.reverseString(tg.firstLoadBalancerFullName).tokens;

  const expectedTextResult = {
    BucketArn: '<<marker:0xbaba:0>>',
    BucketName: '<<marker:0xbaba:1>>',
    ComplexFnSelect: '<<marker:0xbaba:2>>/<<marker:0xbaba:3>>/<<marker:0xbaba:4>>/<<marker:0xbaba:5>>',
  };

  const renderedData = renderData(JSON.stringify(json));

  expect(renderedData.text).toStrictEqual(JSON.stringify(expectedTextResult));
  expect(renderedData.markers['<<marker:0xbaba:0>>']).toBe(tokenOf(bucket.bucketArn));
  expect(renderedData.markers['<<marker:0xbaba:1>>']).toBe(tokenOf(bucket.bucketName));
  expectEqualIfResolved(stack, renderedData.markers['<<marker:0xbaba:2>>'], firstLoadBalancerFullNameTokens[0].toString());
  expectEqualIfResolved(stack, renderedData.markers['<<marker:0xbaba:3>>'], firstLoadBalancerFullNameTokens[1].toString());
  expectEqualIfResolved(stack, renderedData.markers['<<marker:0xbaba:4>>'], firstLoadBalancerFullNameTokens[2].toString());
  expect(renderedData.markers['<<marker:0xbaba:5>>']).toBe(tokenOf(tg.targetGroupFullName));
});

test('markers are returned in the source config', () => {
  const stack = new Stack();
  const handler = new lambda.Function(stack, 'Handler', { runtime: lambda.Runtime.NODEJS_LATEST, code: lambda.Code.fromInline('foo'), handler: 'index.handler' });
  const actual = Source.data('file1.txt', `boom-${stack.account}`).bind(stack, { handlerRole: handler.role! });
  expect(Object.keys(actual.markers ?? {})).toEqual(['<<marker:0xbaba:0>>']);
  expect(actual.markers!['<<marker:0xbaba:0>>']).toBe(tokenOf(stack.account));
});

test('lazy string is not resolved', () => {
  const token = Lazy.string({ produce: () => 'resolved!' });

  const rendered = renderData(token);

  // The marker refers to the Lazy itself, so it is only produced when the template is resolved.
  expect(rendered.text).toEqual('<<marker:0xbaba:0>>');
  expect(rendered.markers['<<marker:0xbaba:0>>']).toBe(tokenOf(token));
});

test('lazy within a string is not resolved', () => {
  const token = Lazy.string({ produce: () => 'resolved!' });

  const rendered = renderData(`hello, ${token}`);

  expect(rendered.text).toEqual('hello, <<marker:0xbaba:0>>');
  expect(rendered.markers['<<marker:0xbaba:0>>']).toBe(tokenOf(token));
});

test('renderData can render empty string data', () => {
  expect(renderData('')).toStrictEqual({
    markers: {},
    markerEncodings: {},
    text: '',
  });
});

test('Source.data with empty string does not throw error', () => {
  const stack = new Stack();
  const handler = new lambda.Function(stack, 'Handler', {
    runtime: lambda.Runtime.NODEJS_LATEST,
    code: lambda.Code.fromInline('foo'),
    handler: 'index.handler',
  });

  // This is the exact reproduction case from issue #35809
  // Before the fix, this would throw: "The "data" argument must be of type string... Received undefined"
  expect(() => {
    const source = Source.data('path/to/empty', '');
    const actual = source.bind(stack, { handlerRole: handler.role! });
    expect(actual.markers).toStrictEqual({});
    expect(actual.bucket).toBeDefined();
    expect(actual.zipObjectKey).toBeDefined();
  }).not.toThrow();
});

describe('Source.data() validates objectKey stays within the staging directory', () => {
  const makeHandler = (stack: Stack) => new lambda.Function(stack, 'Handler', {
    runtime: lambda.Runtime.NODEJS_LATEST,
    code: lambda.Code.fromInline('foo'),
    handler: 'index.handler',
  });

  test.each([
    '../outside.txt',
    '../../outside.txt',
    'a/../../outside.txt',
  ])('Source.data() throws when objectKey %s resolves outside the staging directory', (objectKey) => {
    const stack = new Stack();
    const handler = makeHandler(stack);

    expect(() => {
      Source.data(objectKey, 'hello, world').bind(stack, { handlerRole: handler.role! });
    }).toThrow(/points outside the deployment root/);
  });

  test('Source.jsonData() inherits the same validation', () => {
    const stack = new Stack();
    const handler = makeHandler(stack);

    expect(() => {
      Source.jsonData('../outside.json', { foo: 'bar' }).bind(stack, { handlerRole: handler.role! });
    }).toThrow(/points outside the deployment root/);
  });

  test('Source.yamlData() inherits the same validation', () => {
    const stack = new Stack();
    const handler = makeHandler(stack);

    expect(() => {
      Source.yamlData('../outside.yaml', { foo: 'bar' }).bind(stack, { handlerRole: handler.role! });
    }).toThrow(/points outside the deployment root/);
  });

  test('Source.data() still accepts normal nested keys', () => {
    const stack = new Stack();
    const handler = makeHandler(stack);

    expect(() => {
      const actual = Source.data('nested/dir/config.txt', 'hello, world').bind(stack, { handlerRole: handler.role! });
      expect(actual.bucket).toBeDefined();
      expect(actual.zipObjectKey).toBeDefined();
    }).not.toThrow();
  });

  test('Source.data() accepts a key with interior ".." that stays within the staging dir', () => {
    const stack = new Stack();
    const handler = makeHandler(stack);

    // 'a/../b.txt' normalizes to 'b.txt', which is still inside the staging directory.
    expect(() => {
      Source.data('a/../b.txt', 'hello, world').bind(stack, { handlerRole: handler.role! });
    }).not.toThrow();
  });
});

describe('Source.data() rejects list tokens embedded in the content', () => {
  // A list token concatenated into a string becomes its `#{Token[...]}` encoding, which marker
  // substitution does not recognize. Without this check it is deployed as that literal text.
  const makeHandler = (stack: Stack) => new lambda.Function(stack, 'Handler', {
    runtime: lambda.Runtime.NODEJS_LATEST,
    code: lambda.Code.fromInline('foo'),
    handler: 'index.handler',
  });

  test('Source.data() throws for a concatenated list token', () => {
    const stack = new Stack();
    const handler = makeHandler(stack);
    const ports = ssm.StringListParameter.fromStringListParameterName(stack, 'Ports', '/ports').stringListValue;

    expect(() => {
      Source.data('config.json', '{"ports": ' + ports + '}').bind(stack, { handlerRole: handler.role! });
    }).toThrow(/the content of "config.json" contains a list token/);
  });

  test('Source.jsonData() throws for a list token concatenated into a string value', () => {
    const stack = new Stack();
    const handler = makeHandler(stack);
    const ports = ssm.StringListParameter.fromStringListParameterName(stack, 'Ports', '/ports').stringListValue;

    expect(() => {
      Source.jsonData('config.json', { ports: `ports: ${ports}` }).bind(stack, { handlerRole: handler.role! });
    }).toThrow(/contains a list token/);
  });

  test('a list token passed through Token.asString() becomes a marker', () => {
    const stack = new Stack();
    const handler = makeHandler(stack);
    const ports = ssm.StringListParameter.fromStringListParameterName(stack, 'Ports', '/ports').stringListValue;

    const actual = Source.data('config.json', '{"ports": ' + Token.asString(ports) + '}', { jsonEscape: true })
      .bind(stack, { handlerRole: handler.role! });

    expect(Object.keys(actual.markers ?? {})).toEqual(['<<marker:0xbaba:0>>']);
  });

  test('a list token used whole by Source.jsonData() is still accepted', () => {
    const stack = new Stack();
    const handler = makeHandler(stack);
    const ports = ssm.StringListParameter.fromStringListParameterName(stack, 'Ports', '/ports').stringListValue;

    expect(() => {
      Source.jsonData('config.json', { ports }).bind(stack, { handlerRole: handler.role! });
    }).not.toThrow();
  });
});
