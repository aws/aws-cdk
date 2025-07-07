import * as s3 from '../../aws-s3';
import { Lazy, Stack } from '../../core';
import { renderData } from '../lib/render-data';

test('simple string', () => {
  const stack = new Stack();
  expect(renderData('foo')).toStrictEqual({
    markers: {},
    text: 'foo',
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

test('string is a lazy token', () => {
  const stack = new Stack();

  const token = Lazy.string({ produce: () => 'resolved!' });

  expect(renderData(token)).toStrictEqual({
    text: '<<marker:0xbaba:0>>',
    markers: { '<<marker:0xbaba:0>>': token },
  });
});

test('string is a complex token', () => {
  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'Bucket');

  expect(renderData(`foo-${bucket.bucketArn}`)).toStrictEqual({
    text: '<<marker:0xbaba:0>>',
    markers: { '<<marker:0xbaba:0>>': `foo-${bucket.bucketArn}` },
  });
});
