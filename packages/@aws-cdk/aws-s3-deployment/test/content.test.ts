import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import { Lazy, Stack } from '@aws-cdk/core';
import { Source } from '../lib';
import { renderData } from '../lib/render-data';

test('simple string', () => {
  const stack = new Stack();
  expect(renderData(stack, 'foo')).toStrictEqual({
    markers: {},
    text: 'foo',
  });
});

test('string with a "Ref" token', () => {
  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'Bucket');

  expect(renderData(stack, `foo-${bucket.bucketName}`)).toStrictEqual({
    text: 'foo-<<marker:0xbaba:0>>',
    markers: { '<<marker:0xbaba:0>>': { Ref: 'Bucket83908E77' } },
  });
});

test('string is a single "Ref" token', () => {
  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'Bucket');

  expect(renderData(stack, bucket.bucketName)).toStrictEqual({
    text: '<<marker:0xbaba:0>>',
    markers: { '<<marker:0xbaba:0>>': { Ref: 'Bucket83908E77' } },
  });
});

test('string is a single "Fn::GetAtt" token', () => {
  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'Bucket');

  expect(renderData(stack, bucket.bucketRegionalDomainName)).toStrictEqual({
    text: '<<marker:0xbaba:0>>',
    markers: { '<<marker:0xbaba:0>>': { 'Fn::GetAtt': ['Bucket83908E77', 'RegionalDomainName'] } },
  });
});

test('string with a "Fn::GetAtt" token', () => {
  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'Bucket');

  expect(renderData(stack, `foo-${bucket.bucketArn}`)).toStrictEqual({
    text: 'foo-<<marker:0xbaba:0>>',
    markers: { '<<marker:0xbaba:0>>': { 'Fn::GetAtt': ['Bucket83908E77', 'Arn'] } },
  });
});

test('multiple markers', () => {
  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'Bucket');

  expect(renderData(stack, `boom-${bucket.bucketName}-bam-${bucket.bucketArn}`)).toStrictEqual({
    text: 'boom-<<marker:0xbaba:0>>-bam-<<marker:0xbaba:1>>',
    markers: {
      '<<marker:0xbaba:0>>': { Ref: 'Bucket83908E77' },
      '<<marker:0xbaba:1>>': { 'Fn::GetAtt': ['Bucket83908E77', 'Arn'] },
    },
  });
});

test('json-encoded string', () => {
  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'Bucket');
  const json = {
    BucketArn: bucket.bucketArn,
    BucketName: bucket.bucketName,
  };

  expect(renderData(stack, JSON.stringify(json))).toStrictEqual({
    text: JSON.stringify({ BucketArn: '<<marker:0xbaba:0>>', BucketName: '<<marker:0xbaba:1>>' }),
    markers: {
      '<<marker:0xbaba:0>>': { 'Fn::GetAtt': ['Bucket83908E77', 'Arn'] },
      '<<marker:0xbaba:1>>': { Ref: 'Bucket83908E77' },
    },
  });
});

test('markers are returned in the source config', () => {
  const stack = new Stack();
  const handler = new lambda.Function(stack, 'Handler', { runtime: lambda.Runtime.NODEJS_14_X, code: lambda.Code.fromInline('foo'), handler: 'index.handler' });
  const actual = Source.data('file1.txt', `boom-${stack.account}`).bind(stack, { handlerRole: handler.role! });
  expect(actual.markers).toStrictEqual({
    '<<marker:0xbaba:0>>': { Ref: 'AWS::AccountId' },
  });
});

test('lazy string which can be fully resolved', () => {
  const stack = new Stack();

  expect(renderData(stack, Lazy.string({ produce: () => 'resolved!' }))).toStrictEqual({
    text: 'resolved!',
    markers: { },
  });
});

test('lazy within a string which can be fully resolved', () => {
  const stack = new Stack();
  const token = Lazy.string({ produce: () => 'resolved!' });

  expect(renderData(stack, `hello, ${token}`)).toStrictEqual({
    text: 'hello, resolved!',
    markers: { },
  });
});

test('lazy string which resolves to something with a deploy-time value', () => {
  const stack = new Stack();
  const token = Lazy.string({ produce: () => 'resolved!' });

  expect(renderData(stack, `hello, ${token}`)).toStrictEqual({
    text: 'hello, resolved!',
    markers: { },
  });

});