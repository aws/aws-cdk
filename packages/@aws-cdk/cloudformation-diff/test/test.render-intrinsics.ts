import { Test } from 'nodeunit';
import { renderIntrinsics } from '../lib/render-intrinsics';

export = {
  'resolves Ref'(test: Test) {
    test.equals(
      renderIntrinsics({ Ref: 'SomeLogicalId' }),
      '${SomeLogicalId}'
    );
    test.done();
  },

  'resolves Fn::GetAtt'(test: Test) {
    test.equals(
      renderIntrinsics({ 'Fn::GetAtt': ['SomeLogicalId', 'Attribute'] }),
      '${SomeLogicalId.Attribute}'
    );
    test.done();
  },

  'resolves Fn::Join'(test: Test) {
    test.equals(
      renderIntrinsics({ 'Fn::Join': ['/', ['a', 'b', 'c']] }),
      'a/b/c'
    );

    test.done();
  },

  'removes AWS::NoValue from Fn::Join'(test: Test) {
    test.equals(
      renderIntrinsics({ 'Fn::Join': ['/', ['a', { Ref: 'AWS::NoValue' }, 'b', 'c']] }),
      'a/b/c'
    );

    test.done();
  },

  'does not resolve Fn::Join if the second argument is not a list literal'(test: Test) {
    test.equals(
      renderIntrinsics({ 'Fn::Join': ['/', { Ref: 'ListParameter' }] }),
      '{"Fn::Join":["/","${ListParameter}"]}'
    );

    test.done();
  },

  'deep resolves intrinsics in object'(test: Test) {
    test.deepEqual(
      renderIntrinsics({
        Deeper1: { Ref: 'SomeLogicalId' },
        Deeper2: 'Do not replace',
      }),
      {
        Deeper1: '${SomeLogicalId}',
        Deeper2: 'Do not replace',
      }
    );
    test.done();
  },

  'deep resolves intrinsics in array'(test: Test) {
    test.deepEqual(
      renderIntrinsics([
        { Ref: 'SomeLogicalId' },
        'Do not replace',
      ]),
      [
        '${SomeLogicalId}',
        'Do not replace',
      ]
    );
    test.done();
  },

  'removes NoValue from object'(test: Test) {
    test.deepEqual(
      renderIntrinsics({
        Deeper1: { Ref: 'SomeLogicalId' },
        Deeper2: { Ref: 'AWS::NoValue' }
      }),
      {
        Deeper1: '${SomeLogicalId}',
      }
    );
    test.done();
  },

  'removes NoValue from array'(test: Test) {
    test.deepEqual(
      renderIntrinsics([
        { Ref: 'SomeLogicalId' },
        { Ref: 'AWS::NoValue' },
      ]),
      [
        '${SomeLogicalId}',
      ]
    );
    test.done();
  },
};
