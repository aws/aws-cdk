import { Vpc } from '../../aws-ec2';
import * as elbv2 from '../../aws-elasticloadbalancingv2';
import * as lambda from '../../aws-lambda';
import * as s3 from '../../aws-s3';
import { IResolvable, Lazy, Stack, Token, Tokenization } from '../../core';
import { Source } from '../lib';
import { renderData } from '../lib/render-data';

const expectEqualIfResolved = (stack: Stack, a: any, b: any) => expect(stack.resolve(a)).toStrictEqual(stack.resolve(b));

test('simple string', () => {
  const stack = new Stack();
  expect(renderData('foo')).toStrictEqual({
    markers: {},
    text: 'foo',
  });
});

test('string with a "Ref" token', () => {
  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'Bucket');

  expect(renderData(`foo-${bucket.bucketName}`)).toStrictEqual({
    text: 'foo-<<marker:0xbaba:0>>',
    markers: { '<<marker:0xbaba:0>>': bucket.bucketName },
  });
});

test('string is a single "Ref" token', () => {
  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'Bucket');

  expect(renderData(bucket.bucketName)).toStrictEqual({
    text: '<<marker:0xbaba:0>>',
    markers: { '<<marker:0xbaba:0>>': bucket.bucketName },
  });
});

test('multiple markers', () => {
  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'Bucket');

  expect(renderData(`boom-${bucket.bucketName}-bam-${bucket.bucketArn}`)).toStrictEqual({
    text: 'boom-<<marker:0xbaba:0>>-bam-<<marker:0xbaba:1>>',
    markers: {
      '<<marker:0xbaba:0>>': bucket.bucketName,
      '<<marker:0xbaba:1>>': bucket.bucketArn,
    },
  });
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
  expect(renderedData.markers['<<marker:0xbaba:0>>']).toStrictEqual(bucket.bucketArn);
  expect(renderedData.markers['<<marker:0xbaba:1>>']).toStrictEqual(bucket.bucketName);
  expectEqualIfResolved(stack, renderedData.markers['<<marker:0xbaba:2>>'], firstLoadBalancerFullNameTokens[0].toString());
  expectEqualIfResolved(stack, renderedData.markers['<<marker:0xbaba:3>>'], firstLoadBalancerFullNameTokens[1].toString());
  expectEqualIfResolved(stack, renderedData.markers['<<marker:0xbaba:4>>'], firstLoadBalancerFullNameTokens[2].toString());
  expect(renderedData.markers['<<marker:0xbaba:5>>']).toStrictEqual(tg.targetGroupFullName);
});

test('markers are returned in the source config', () => {
  const stack = new Stack();
  const handler = new lambda.Function(stack, 'Handler', { runtime: lambda.Runtime.NODEJS_LATEST, code: lambda.Code.fromInline('foo'), handler: 'index.handler' });
  const actual = Source.data('file1.txt', `boom-${stack.account}`).bind(stack, { handlerRole: handler.role! });
  expect(actual.markers).toStrictEqual({
    '<<marker:0xbaba:0>>': stack.account,
  });
});

test('lazy string is not resolved', () => {
  const stack = new Stack();
  const token = Lazy.string({ produce: () => 'resolved!' });

  expect(renderData(token)).toStrictEqual({
    text: '<<marker:0xbaba:0>>',
    markers: {
      '<<marker:0xbaba:0>>': token,
    },
  });
});

test('lazy within a string is not resolved', () => {
  const stack = new Stack();
  const token = Lazy.string({ produce: () => 'resolved!' });

  expect(renderData(`hello, ${token}`)).toStrictEqual({
    text: 'hello, <<marker:0xbaba:0>>',
    markers: {
      '<<marker:0xbaba:0>>': token,
    },
  });
});
