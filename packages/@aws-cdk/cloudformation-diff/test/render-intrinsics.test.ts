import { renderIntrinsics } from '../lib/render-intrinsics';

test('resolves Ref', () =>
  expect(renderIntrinsics({ Ref: 'SomeLogicalId' })).toEqual('${SomeLogicalId}'));

test('resolves Fn::GetAtt', () =>
  expect(renderIntrinsics({ 'Fn::GetAtt': ['SomeLogicalId', 'Attribute'] })).toEqual('${SomeLogicalId.Attribute}'));

test('resolves Fn::Join', () =>
  expect(renderIntrinsics({ 'Fn::Join': ['/', ['a', 'b', 'c']] })).toEqual('a/b/c'));

test('removes AWS::NoValue from Fn::Join', () =>
  expect(renderIntrinsics({ 'Fn::Join': ['/', ['a', { Ref: 'AWS::NoValue' }, 'b', 'c']] })).toEqual('a/b/c'));

test('does not resolve Fn::Join if the second argument is not a list literal', () =>
  expect(renderIntrinsics({ 'Fn::Join': ['/', { Ref: 'ListParameter' }] })).toEqual('{"Fn::Join":["/","${ListParameter}"]}'));

test('deep resolves intrinsics in object', () =>
  expect(renderIntrinsics({
    Deeper1: { Ref: 'SomeLogicalId' },
    Deeper2: 'Do not replace',
  })).toEqual({
    Deeper1: '${SomeLogicalId}',
    Deeper2: 'Do not replace',
  }));

test('deep resolves intrinsics in array', () =>
  expect(renderIntrinsics([
    { Ref: 'SomeLogicalId' },
    'Do not replace',
  ])).toEqual([
    '${SomeLogicalId}',
    'Do not replace',
  ]));

test('removes NoValue from object', () =>
  expect(renderIntrinsics({
    Deeper1: { Ref: 'SomeLogicalId' },
    Deeper2: { Ref: 'AWS::NoValue' },
  })).toEqual({
    Deeper1: '${SomeLogicalId}',
  }));

test('removes NoValue from array', () =>
  expect(renderIntrinsics([
    { Ref: 'SomeLogicalId' },
    { Ref: 'AWS::NoValue' },
  ])).toEqual([
    '${SomeLogicalId}',
  ]));
