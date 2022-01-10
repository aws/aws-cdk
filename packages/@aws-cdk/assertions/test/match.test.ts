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
      test('delimiter must be a string value', () => {
        expectFailure(Match.resolveCfnIntrinsic(Match.objectEquals({}), { recursive: false }), { 'Fn::Join': [{}, ['Join', 'some', 'strings']] }, ['Error: Fn::Join delimiter must be a string value']);
      });
    });
  });
});

function expectPass(matcher: Matcher, target: any): void {
  const result = matcher.test(target);
  if (result.hasFailed()) {
    fail(result.toHumanStrings()); // eslint-disable-line jest/no-jasmine-globals
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