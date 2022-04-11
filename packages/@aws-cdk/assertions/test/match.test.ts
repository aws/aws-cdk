import { Matcher, Match } from '../lib';

describe('Matchers', () => {


  describe('resolveCfnIntrinsic()', () => {
    describe('Ref:PseudoParameter', () => {
      test('resolve AWS::AccountId', () => {
        expectPass(Match.resolveCfnIntrinsic('123456789012'), { Ref: 'AWS::AccountId' });
        expectPass(Match.resolveCfnIntrinsic({ Ref: 'AWS::AccountId' }, { resolvePseudoParameters: false } ), { Ref: 'AWS::AccountId' });
        expectPass(Match.resolveCfnIntrinsic('012123456789', {}, { cfnPseudoParameters: { awsAccountId: '012123456789' } } ), { Ref: 'AWS::AccountId' });
      });
      test('resolve AWS::NotificationARNs', () => {
        expectPass(Match.resolveCfnIntrinsic([]), { Ref: 'AWS::NotificationARNs' });
        expectPass(Match.resolveCfnIntrinsic({ Ref: 'AWS::NotificationARNs' }, { resolvePseudoParameters: false } ), { Ref: 'AWS::NotificationARNs' });
        expectPass(Match.resolveCfnIntrinsic(['arn1', 'arn2'], {}, { cfnPseudoParameters: { awsNotificationARNs: ['arn1', 'arn2'] } } ), { Ref: 'AWS::NotificationARNs' });

    test('simple literals', () => {
      matcher = Match.exact('foo');
      expectPass(matcher, 'foo');
      expectFailure(matcher, 'bar', [/Expected foo but received bar/]);
      expectFailure(matcher, 5, [/Expected type string but received number/]);

      matcher = Match.exact(3);
      expectPass(matcher, 3);
      expectFailure(matcher, 5, [/Expected 3 but received 5/]);
      expectFailure(matcher, 'foo', [/Expected type number but received string/]);

      matcher = Match.exact(true);
      expectPass(matcher, true);
      expectFailure(matcher, false, [/Expected true but received false/]);
      expectFailure(matcher, 'foo', [/Expected type boolean but received string/]);
    });

    test('arrays', () => {
      matcher = Match.exact([4]);
      expectPass(matcher, [4]);
      expectFailure(matcher, [4, 5], [/Expected array of length 1 but received 2/]);
      expectFailure(matcher, 'foo', [/Expected type array but received string/]);

      matcher = Match.exact(['foo', 3]);
      expectPass(matcher, ['foo', 3]);
      expectFailure(matcher, ['bar', 3], [/Expected foo but received bar at \[0\]/]);
      expectFailure(matcher, ['foo', 5], [/Expected 3 but received 5 at \[1\]/]);

      matcher = Match.exact([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred', wobble: 'flob' }]);
      expectPass(matcher, [{ foo: 'bar', baz: 'qux' }, { waldo: 'fred', wobble: 'flob' }]);
      expectFailure(matcher, [{ foo: 'bar', baz: 'qux' }], [/Expected array of length 2 but received 1/]);
      expectFailure(matcher, [{ foo: 'bar', baz: 'qux' }, { waldo: 'flob', wobble: 'fred' }], [
        'Expected fred but received flob at [1]/waldo',
        'Expected flob but received fred at [1]/wobble',
      ]);
      expectFailure(matcher, [{ foo: 'bar', baz: 'qux' }, { waldo: 'fred' }], [/Missing key at \[1\]\/wobble/]);
    });

    test('objects', () => {
      matcher = Match.exact({ foo: 'bar' });
      expectPass(matcher, { foo: 'bar' });
      expectFailure(matcher, 5, [/Expected type object but received number/]);
      expectFailure(matcher, ['3', 5], [/Expected type object but received array/]);
      expectFailure(matcher, { baz: 'qux' }, [
        'Unexpected key at /baz',
        'Missing key at /foo',
      ]);

      matcher = Match.exact({ foo: 'bar', baz: 5 });
      expectFailure(matcher, { foo: 'bar', baz: '5' }, [/Expected type number but received string at \/baz/]);
      expectFailure(matcher, { foo: 'bar', baz: 5, qux: 7 }, [/Unexpected key at \/qux/]);

      matcher = Match.exact({ foo: [2, 3], bar: 'baz' });
      expectPass(matcher, { foo: [2, 3], bar: 'baz' });
      expectFailure(matcher, {}, [
        'Missing key at /foo',
        'Missing key at /bar',
      ]);
      expectFailure(matcher, { bar: [2, 3], foo: 'baz' }, [
        'Expected type array but received string at /foo',
        'Expected type string but received array at /bar',
      ]);
      expectFailure(matcher, { foo: [3, 5], bar: 'baz' }, [
        'Expected 2 but received 3 at /foo[0]',
        'Expected 3 but received 5 at /foo[1]',
      ]);
    });

    test('nesting', () => {
      expect(() => Match.exact(Match.arrayWith(['foo']))).toThrow(/cannot directly contain another matcher/);
    });

    test('absent', () => {
      expect(() => Match.exact(Match.absent())).toThrow(/cannot directly contain another matcher/);
    });
  });

  describe('arrayWith()', () => {
    let matcher: Matcher;

    test('subset match', () => {
      matcher = Match.arrayWith([]);
      expectPass(matcher, []);
      expectPass(matcher, [3]);

      matcher = Match.arrayWith([3]);
      expectPass(matcher, [3]);
      expectPass(matcher, [3, 5]);
      expectPass(matcher, [1, 3, 5]);
      expectFailure(matcher, [5], [/Missing element \[3\] at pattern index 0/]);

      matcher = Match.arrayWith([5, false]);
      expectPass(matcher, [5, false, 'foo']);
      expectPass(matcher, [5, 'foo', false]);
      expectFailure(matcher, [5, 'foo'], [/Missing element \[false\] at pattern index 1/]);

      matcher = Match.arrayWith([{ foo: 'bar' }]);
      expectPass(matcher, [{ fred: 'waldo' }, { foo: 'bar' }, { baz: 'qux' }]);
      expectPass(matcher, [{ foo: 'bar' }]);
      expectFailure(matcher, [{ foo: 'baz' }], [/Missing element at pattern index 0/]);
      expectFailure(matcher, [{ baz: 'qux' }], [/Missing element at pattern index 0/]);
    });

    test('not array', () => {
      matcher = Match.arrayWith([3]);
      expectFailure(matcher, 3, [/Expected type array but received number/]);
      expectFailure(matcher, { val: 3 }, [/Expected type array but received object/]);
    });

    test('out of order', () => {
      matcher = Match.arrayWith([3, 5]);
      expectFailure(matcher, [5, 3], [/Missing element \[5\] at pattern index 1/]);
    });

    test('nested with ObjectLike', () => {
      matcher = Match.arrayWith([Match.objectLike({ foo: 'bar' })]);
      expectPass(matcher, [{ baz: 'qux' }, { foo: 'bar' }]);
      expectPass(matcher, [{ baz: 'qux' }, { foo: 'bar', fred: 'waldo' }]);
      expectFailure(matcher, [{ foo: 'baz', fred: 'waldo' }], [/Missing element at pattern index 0/]);
    });

    test('incompatible with absent', () => {
      matcher = Match.arrayWith(['foo', Match.absent()]);
      expect(() => matcher.test(['foo', 'bar'])).toThrow(/absent\(\) cannot be nested within arrayWith\(\)/);
    });

    test('incompatible with anyValue', () => {
      matcher = Match.arrayWith(['foo', Match.anyValue()]);
      expect(() => matcher.test(['foo', 'bar'])).toThrow(/anyValue\(\) cannot be nested within arrayWith\(\)/);
    });
  });

  describe('arrayEquals', () => {
    let matcher: Matcher;

    test('exact match', () => {
      matcher = Match.arrayEquals([5, false]);
      expectPass(matcher, [5, false]);
      expectFailure(matcher, [5, 'foo', false], [/Expected array of length 2 but received 3/]);
      expectFailure(matcher, [5, 'foo'], [/Expected type boolean but received string at \[1\]/]);
    });
  });

  describe('objectLike()', () => {
    let matcher: Matcher;

    test('basic', () => {
      matcher = Match.objectLike({ foo: 'bar' });
      expectPass(matcher, { foo: 'bar' });
      expectFailure(matcher, { foo: 'baz' }, [/Expected bar but received baz at \/foo/]);
      expectFailure(matcher, { foo: ['bar'] }, [/Expected type string but received array at \/foo/]);
      expectFailure(matcher, { bar: 'foo' }, [/Missing key at \/foo/]);
      expectPass(matcher, { foo: 'bar', baz: 'qux' });
    });

    test('not an object', () => {
      matcher = Match.objectLike({ foo: 'bar' });
      expectFailure(matcher, ['foo', 'bar'], [/Expected type object but received array/]);
      expectFailure(matcher, 'foo', [/Expected type object but received string/]);

      matcher = Match.objectLike({ foo: Match.objectLike({ baz: 'qux' }) });
      expectFailure(matcher, { foo: 'baz' }, [/Expected type object but received string at \/foo/]);
    });

    test('partial', () => {
      matcher = Match.objectLike({ foo: 'bar' });
      expectPass(matcher, { foo: 'bar', baz: { fred: 'waldo' } });

      matcher = Match.objectLike({ baz: { fred: 'waldo' } });
      expectPass(matcher, { foo: 'bar', baz: { fred: 'waldo', wobble: 'flob' } });
    });

    test('ArrayMatch nested inside ObjectMatch', () => {
      matcher = Match.objectLike({
        foo: Match.arrayWith(['bar']),
      });
      expectPass(matcher, { foo: ['bar', 'baz'], fred: 'waldo' });
      expectFailure(matcher, { foo: ['baz'], fred: 'waldo' }, [/Missing element \[bar\] at pattern index 0 at \/foo/]);
    });

    test('Partiality is maintained throughout arrays', () => {
      // Before this fix:
      //
      //   - objectLike({ x: { LITERAL }) ==> LITERAL would be matched partially as well
      //   - objectLike({ xs: [ { LITERAL } ] }) ==> but here LITERAL would be matched fully
      //
      // That passing through an array resets the partial matching to full is a
      // surprising inconsistency.
      //
      matcher = Match.objectLike({
        foo: [{ bar: 'bar' }],
      });
      expectPass(matcher, { foo: [{ bar: 'bar' }] }); // Trivially true
      expectPass(matcher, { boo: 'boo', foo: [{ bar: 'bar' }] }); // Additional members at top level okay
      expectPass(matcher, { foo: [{ bar: 'bar', boo: 'boo' }] }); // Additional members at inner level okay
    });

    test('absent', () => {
      matcher = Match.objectLike({ foo: Match.absent() });
      expectPass(matcher, { bar: 'baz' });
      expectFailure(matcher, { foo: 'baz' }, [/key should be absent at \/foo/]);
    });
  });

  describe('objectEquals()', () => {
    let matcher: Matcher;

    test('exact match', () => {
      matcher = Match.objectEquals({ foo: 'bar' });
      expectPass(matcher, { foo: 'bar' });
      expectFailure(matcher, { foo: 'bar', baz: 'qux' }, [/Unexpected key at \/baz/]);
    });
  });

  describe('not()', () => {
    let matcher: Matcher;

    test('literal', () => {
      matcher = Match.not('foo');
      expectPass(matcher, 'bar');
      expectPass(matcher, 3);

      expectFailure(matcher, 'foo', ['Found unexpected match: "foo"']);
    });

    test('object', () => {
      matcher = Match.not({ foo: 'bar' });
      expectPass(matcher, 'bar');
      expectPass(matcher, 3);
      expectPass(matcher, { foo: 'baz' });
      expectPass(matcher, { bar: 'foo' });

      const msg = [
        'Found unexpected match: {',
        '  "foo": "bar"',
        '}',
      ].join('\n');
      expectFailure(matcher, { foo: 'bar' }, [msg]);
    });

    test('array', () => {
      matcher = Match.not(['foo', 'bar']);
      expectPass(matcher, 'foo');
      expectPass(matcher, []);
      expectPass(matcher, ['bar']);
      expectPass(matcher, ['foo', 3]);

      const msg = [
        'Found unexpected match: [',
        '  "foo",',
        '  "bar"',
        ']',
      ].join('\n');
      expectFailure(matcher, ['foo', 'bar'], [msg]);
    });

    test('as a nested matcher', () => {
      matcher = Match.exact({
        foo: { bar: Match.not([1, 2]) },

      });
      test('resolve AWS::Partition', () => {
        expectPass(Match.resolveCfnIntrinsic('aws'), { Ref: 'AWS::Partition' });
        expectPass(Match.resolveCfnIntrinsic({ Ref: 'AWS::Partition' }, { resolvePseudoParameters: false } ), { Ref: 'AWS::Partition' });
        expectPass(Match.resolveCfnIntrinsic('aws-cn', {}, { cfnPseudoParameters: { awsPartition: 'aws-cn' } } ), { Ref: 'AWS::Partition' });
      });
      test('resolve AWS::Region', () => {
        expectPass(Match.resolveCfnIntrinsic('us-east-1'), { Ref: 'AWS::Region' });
        expectPass(Match.resolveCfnIntrinsic({ Ref: 'AWS::Region' }, { resolvePseudoParameters: false } ), { Ref: 'AWS::Region' });
        expectPass(Match.resolveCfnIntrinsic('eu-central-1', {}, { cfnPseudoParameters: { awsRegion: 'eu-central-1' } } ), { Ref: 'AWS::Region' });
      });
      test('resolve AWS::StackId', () => {
        expectPass(Match.resolveCfnIntrinsic('arn:aws:cloudformation:us-east-1:123456789012:stack/teststack/51af3dc0-da77-11e4-872e-1234567db123'), { Ref: 'AWS::StackId' });
        expectPass(Match.resolveCfnIntrinsic({ Ref: 'AWS::StackId' }, { resolvePseudoParameters: false } ), { Ref: 'AWS::StackId' });
        expectPass(Match.resolveCfnIntrinsic('arn:aws:cloudformation:us-east-1:123456789012:stack/anotherstack/51af3dc0-da77-11e4-872e-1234567db123', {}, { cfnPseudoParameters: { awsStackId: 'arn:aws:cloudformation:us-east-1:123456789012:stack/anotherstack/51af3dc0-da77-11e4-872e-1234567db123' } } ), { Ref: 'AWS::StackId' });
      });
      test('resolve AWS::StackName', () => {
        expectPass(Match.resolveCfnIntrinsic('teststack'), { Ref: 'AWS::StackName' });
        expectPass(Match.resolveCfnIntrinsic({ Ref: 'AWS::StackName' }, { resolvePseudoParameters: false } ), { Ref: 'AWS::StackName' });
        expectPass(Match.resolveCfnIntrinsic('anotherstack', {}, { cfnPseudoParameters: { awsStackName: 'anotherstack' } } ), { Ref: 'AWS::StackName' });
      });
      test('resolve AWS::URLSuffix', () => {
        expectPass(Match.resolveCfnIntrinsic('amazonaws.com'), { Ref: 'AWS::URLSuffix' });
        expectPass(Match.resolveCfnIntrinsic({ Ref: 'AWS::URLSuffix' }, { resolvePseudoParameters: false } ), { Ref: 'AWS::URLSuffix' });
        expectPass(Match.resolveCfnIntrinsic('amazonaws.com.cn', {}, { cfnPseudoParameters: { awsURLSuffix: 'amazonaws.com.cn' } } ), { Ref: 'AWS::URLSuffix' });
      });
    });
    describe('Fn::Join', () => {
      test('simple join', () => {
        expectPass(Match.resolveCfnIntrinsic('Join some strings'), { 'Fn::Join': [' ', ['Join', 'some', 'strings']] });
      });
      test('resolveFnJoin:false', () => {
        expectPass(Match.resolveCfnIntrinsic({ 'Fn::Join': [' ', ['Join', 'some', 'strings']] }, { resolveFnJoin: false }), { 'Fn::Join': [' ', ['Join', 'some', 'strings']] });
      });
      test('recursive join', () => {
        expectPass(Match.resolveCfnIntrinsic('Join some more strings'), { 'Fn::Join': [' ', ['Join', 'some', { 'Fn::Join': [' ', ['more', 'strings']] }]] });
      });
      test('recursive join with recursiv:false', () => {
        expectFailure(Match.resolveCfnIntrinsic(Match.objectEquals({}), { recursive: false }), { 'Fn::Join': [' ', ['Join', 'some', { 'Fn::Join': [] }]] }, ['Error: Fn::Join valueList are not allowed to contain objects']);
      });
      test('wrong usage', () => {
        expectFailure(Match.resolveCfnIntrinsic(Match.objectEquals({})), { 'Fn::Join': [{}, ['Join', 'some', 'strings']] }, ['Error: Fn::Join delimiter must be a string value']);
        expectFailure(Match.resolveCfnIntrinsic(Match.objectEquals({})), { 'Fn::Join': ['', [{}]] }, ['Error: Fn::Join valueList are not allowed to contain objects']);
        expectFailure(Match.resolveCfnIntrinsic(Match.objectEquals({})), { 'Fn::Join': ['', ''] }, ['Error: Fn::Join expecting an array as valuesList']);
      });
    });
    describe('Fn::GetAtt', () => {
      test('simple getAtt', () => {
        expectPass(Match.resolveCfnIntrinsic('SomeResolvedAttribute', {}, { cfnResources: { Resource: { Attribute: 'SomeResolvedAttribute' } } }), { 'Fn::GetAtt': ['Resource', 'Attribute'] });
        expectPass(Match.resolveCfnIntrinsic(12345, {}, { cfnResources: { Resource: { Attribute: 12345 } } }), { 'Fn::GetAtt': ['Resource', 'Attribute'] });
      });
      test('wrong usage', () => {
        expectFailure(Match.resolveCfnIntrinsic(''), { 'Fn::GetAtt': [{}, ''] }, ['Error: Fn::GetAtt logicalNameOfResource must be typeof string']);
        expectFailure(Match.resolveCfnIntrinsic(''), { 'Fn::GetAtt': ['', {}] }, ['Error: Fn::GetAtt attributeName must be typeof string']);
      });
    });
    describe('Fn::GetAZs', () => {
      test('simple getAZs', () => {
        expectPass(Match.resolveCfnIntrinsic(Match.arrayEquals(['us-east-1a', 'us-east-1b', 'us-east-1c', 'us-east-1d', 'us-east-1e', 'us-east-1f'])), { 'Fn::GetAZs': '' });
        expectPass(Match.resolveCfnIntrinsic(Match.arrayEquals(['eu-central-1a', 'eu-central-1b', 'eu-central-1c'])), { 'Fn::GetAZs': 'eu-central-1' });
      });
    });
    describe('Fn::Select', () => {
      test('simple select', () => {
        expectPass(Match.resolveCfnIntrinsic(1), { 'Fn::Select': ['1', [0, 1, 2]] });
        expectPass(Match.resolveCfnIntrinsic(1), { 'Fn::Select': [1, [0, 1, 2]] });
        expectPass(Match.resolveCfnIntrinsic('1'), { 'Fn::Select': [1, ['0', '1', '2']] });
        expectPass(Match.resolveCfnIntrinsic({ some: 'object' }), { 'Fn::Select': [0, [{ some: 'object' }, '1', '2']] });
      });
    });
  });

  describe('stringLikeRegexp', () => {
    let matcher: Matcher;

    test('simple', () => {
      matcher = Match.stringLikeRegexp('.*includeHeaders = true.*');
      expectFailure(matcher, 'const includeHeaders = false;', [/did not match pattern/]);
      expectPass(matcher, 'const includeHeaders = true;');
    });

    test('nested in object', () => {
      matcher = Match.objectLike({ foo: Match.stringLikeRegexp('.*includeHeaders = true.*') });
      expectFailure(matcher, { foo: 'const includeHeaders = false;' }, [/did not match pattern/]);
      expectPass(matcher, { foo: 'const includeHeaders = true;' });
    });
  });
});

function expectPass(matcher: Matcher, target: any): void {
  const result = matcher.test(target);
  if (result.hasFailed()) {
    throw new Error(result.toHumanStrings().join('\n')); // eslint-disable-line jest/no-jasmine-globals
  }
}

function expectFailure(matcher: Matcher, target: any, expected: (string | RegExp)[] = []): void {
  const result = matcher.test(target);
  expect(result.failCount).toBeGreaterThan(0);
  const actual = result.toHumanStrings();
  if (expected.length > 0 && actual.length !== expected.length) {
    // only do this if the lengths are different, so as to display a nice failure message.
    // otherwise need to use `toMatch()` to support RegExp
    expect(actual).toEqual(expected);
  }
  for (let i = 0; i < expected.length; i++) {
    const e = expected[i];
    expect(actual[i]).toMatch(e);
  }
}