import { validateSnsTopicArn } from '../../lib/util/validate-notification-arn';

describe('validate sns arns', () => {
  test('empty string', () => {
    const arn = '';
    expect(validateSnsTopicArn(arn)).toEqual(false);
  });

  test('colon in topic name', () => {
    const arn = 'arn:aws:sns:eu-west-1:abc:foo';
    expect(validateSnsTopicArn(arn)).toEqual(false);
  });

  test('missing :aws: in arn', () => {
    const arn = 'arn:sns:eu-west-1:foobar';
    expect(validateSnsTopicArn(arn)).toEqual(false);
  });

  test('dash in topic name', () => {
    const arn = 'arn:aws:sns:eu-west-1:123456789876:foo-bar';
    expect(validateSnsTopicArn(arn)).toEqual(true);
  });

  test('underscore in topic name', () => {
    const arn = 'arn:aws:sns:eu-west-1:123456789876:foo-bar_baz';
    expect(validateSnsTopicArn(arn)).toEqual(true);
  });
});

