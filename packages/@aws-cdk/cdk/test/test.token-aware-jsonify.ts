import { Test } from 'nodeunit';
import { AwsRegion, resolve, tokenAwareJsonify, FnConcat } from '../lib';

export = {
  'substitutes tokens'(test: Test)  {
    // WHEN
    const result = tokenAwareJsonify({
      'the region': new AwsRegion(),
      'the king': 'me',
    });

    // THEN
    test.deepEqual(resolve(result), {
      'Fn::Sub': [
        '{"the region":"${ref0}","the king":"me"}',
        { ref0: { Ref: 'AWS::Region' } }
      ]
    });

    test.done();
  },

  'reuse token substitutions'(test: Test)  {
    // WHEN
    const result = tokenAwareJsonify({
      'the region': new AwsRegion(),
      'other region': new AwsRegion(),
      'the king': 'me',
    });

    // THEN
    test.deepEqual(resolve(result), {
      'Fn::Sub': [
        '{"the region":"${ref0}","other region":"${ref0}","the king":"me"}',
        { ref0: { Ref: 'AWS::Region' } }
      ]
    });

    test.done();
  },

  'escape things that look like FnSub values'(test: Test)  {
    // WHEN
    const result = tokenAwareJsonify({
      'the region': new AwsRegion(),
      'the king': '${Me}',
    });

    // THEN
    test.deepEqual(resolve(result), {
      'Fn::Sub': [
        '{"the region":"${ref0}","the king":"${!Me}"}',
        { ref0: { Ref: 'AWS::Region' } }
      ]
    });

    test.done();
  },

  'string values in resolved tokens should be represented as stringified strings'(test: Test) {
    // WHEN
    const result = tokenAwareJsonify({
      test1: new FnConcat('Hello', 'This\nIs', 'Very "cool"'),
    });

    // THEN
    test.deepEqual(resolve(result), { 'Fn::Sub':
    [ '{"test1":"${ref0}"}',
      { ref0:
         { 'Fn::Join': [ '', [ 'Hello', 'This\\nIs', 'Very \\"cool\\"' ] ] } } ] });

    test.done();
  }
};
