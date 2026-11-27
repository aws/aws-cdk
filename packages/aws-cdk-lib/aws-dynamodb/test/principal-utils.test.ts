import type * as iam from '../../aws-iam';
import { Lazy } from '../../core';
import type { IResolvable } from '../../core';
import { findFgacConditionKey } from '../lib/private/principal-utils';

// A principal whose policy fragment carries the given conditions unchanged, as
// iam.FederatedPrincipal and iam.ServicePrincipal do. iam.PrincipalWithConditions
// copies its conditions into a new object, so it cannot pass conditions that are
// a token.
function principalWithFragmentConditions(conditions: any): iam.IPrincipal {
  return {
    policyFragment: { principalJson: { AWS: ['arn:aws:iam::111122223333:root'] }, conditions },
  } as unknown as iam.IPrincipal;
}

// A token that resolves to `value` and also holds the fields of `value` as its
// own fields, so a check that read the token's fields would find them.
function tokenOf(value: { [key: string]: unknown }): IResolvable {
  return Object.assign(Lazy.any({ produce: () => value }), value);
}

describe('findFgacConditionKey', () => {
  test('returns the key as written when a block names a fine-grained access control key', () => {
    expect(findFgacConditionKey(principalWithFragmentConditions({
      'ForAllValues:StringEquals': { 'DynamoDB:LeadingKeys': ['x'] },
    }))).toEqual('DynamoDB:LeadingKeys');
  });

  test('returns undefined when the principal has no conditions', () => {
    expect(findFgacConditionKey(principalWithFragmentConditions({}))).toBeUndefined();
  });

  test('does not look inside conditions that are a token', () => {
    expect(findFgacConditionKey(principalWithFragmentConditions(tokenOf({
      'ForAllValues:StringEquals': { 'dynamodb:LeadingKeys': ['x'] },
    })))).toBeUndefined();
  });

  test('does not look inside a condition block that is a token', () => {
    expect(findFgacConditionKey(principalWithFragmentConditions({
      'ForAllValues:StringEquals': tokenOf({ 'dynamodb:LeadingKeys': ['x'] }),
    }))).toBeUndefined();
  });

  test('skips condition blocks that are null or not objects', () => {
    // Object.keys() throws on null and undefined but not on a string, so the null
    // entry needs the null check and the undefined entry needs the typeof check.
    expect(findFgacConditionKey(principalWithFragmentConditions({
      'StringEquals': null,
      'StringLike': undefined,
      'Bool': 'true',
      'ForAllValues:StringEquals': { 'dynamodb:Select': ['SPECIFIC_ATTRIBUTES'] },
    }))).toEqual('dynamodb:Select');
  });
});
