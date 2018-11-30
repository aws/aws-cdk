import { Test } from 'nodeunit';
import { unCloudFormation } from '../lib/uncfn';

export = {
  'resolves Ref'(test: Test) {
    test.equals(
      unCloudFormation({ Ref: 'SomeLogicalId' }),
      '${SomeLogicalId}'
    );
    test.done();
  },

  'resolves Fn::GetAtt'(test: Test) {
    test.equals(
      unCloudFormation({ 'Fn::GetAtt': ['SomeLogicalId', 'Attribute'] }),
      '${SomeLogicalId.Attribute}'
    );
    test.done();
  },

  'resolves Fn::Join'(test: Test) {
    test.equals(
      unCloudFormation({ 'Fn::Join': ['/', ['a', 'b', 'c']] }),
      'a/b/c'
    );

    test.done();
  },

  'does not resolve Fn::Join if the second argument is not a list literal'(test: Test) {
    test.equals(
      unCloudFormation({ 'Fn::Join': ['/', { Ref: 'ListParameter' }] }),
      '{"Fn::Join":["/","${ListParameter}"]}'
    );

    test.done();
  },

  'deep resolves intrinsics in object'(test: Test) {
    test.deepEqual(
      unCloudFormation({
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
      unCloudFormation([
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
};
