import * as cxapi from '../../../cx-api';
import { Aws } from '../cfn-pseudo';
import { UnscopedValidationError } from '../errors';
import { Stack } from '../stack';
import { Token } from '../token';

/**
 * A "replace-all" function that doesn't require us escaping a literal string to a regex
 */
function replaceAll(s: string, search: string, replace: string) {
  return s.split(search).join(replace);
}

export class StringSpecializer {
  /**
   * Validate that the given string does not contain tokens
   */
  public static validateNoTokens(s: string, what: string) {
    if (Token.isUnresolved(s)) {
      throw new UnscopedValidationError(`${what} may not contain tokens; only the following literal placeholder strings are allowed: ` + [
        '${Qualifier}',
        cxapi.EnvironmentPlaceholders.CURRENT_REGION,
        cxapi.EnvironmentPlaceholders.CURRENT_ACCOUNT,
        cxapi.EnvironmentPlaceholders.CURRENT_PARTITION,
      ].join(', ') + `. Got: ${s}`);
    }
  }

  constructor(private readonly stack: Stack, private readonly qualifier: string) { }

  /**
   * Function to replace placeholders in the input string as much as possible
   *
   * We replace:
   * - ${Qualifier}: always
   * - ${AWS::AccountId}, ${AWS::Region}: only if we have the actual values available
   * - ${AWS::Partition}: never, since we never have the actual partition value.
   */
  public specialize(s: string): string {
    s = replaceAll(s, '${Qualifier}', this.qualifier);
    return cxapi.EnvironmentPlaceholders.replace(s, {
      region: resolvedOr(this.stack.region, cxapi.EnvironmentPlaceholders.CURRENT_REGION),
      accountId: resolvedOr(this.stack.account, cxapi.EnvironmentPlaceholders.CURRENT_ACCOUNT),
      partition: cxapi.EnvironmentPlaceholders.CURRENT_PARTITION,
    });
  }

  /**
   * Specialize the given string, make sure it doesn't contain tokens
   */
  public specializeNoTokens(s: string, what: string): string {
    StringSpecializer.validateNoTokens(s, what);
    return this.specialize(s);
  }

  /**
   * Specialize only the qualifier
   */
  public qualifierOnly(s: string): string {
    return replaceAll(s, '${Qualifier}', this.qualifier);
  }
}

/**
 * Return the given value if resolved or fall back to a default
 */
export function resolvedOr<A>(x: string, def: A): string | A {
  return Token.isUnresolved(x) ? def : x;
}

const ASSET_TOKENS = ['${AWS::Partition}', '${AWS::Region}', '${AWS::AccountId}'];
const CFN_TOKENS = [Aws.PARTITION, Aws.REGION, Aws.ACCOUNT_ID];

/**
 * Replaces CloudFormation Tokens (i.e. 'Aws.PARTITION') with corresponding
 * Asset Tokens (i.e. '${AWS::Partition}').
 */
export function translateCfnTokenToAssetToken(arn: string) {
  for (let i = 0; i < CFN_TOKENS.length; i++) {
    arn = replaceAll(arn, CFN_TOKENS[i], ASSET_TOKENS[i]);
  }
  return arn;
}

/**
 * Replaces Asset Tokens (i.e. '${AWS::Partition}') with corresponding
 * CloudFormation Tokens (i.e. 'Aws.PARTITION').
 */
export function translateAssetTokenToCfnToken(arn: string) {
  for (let i = 0; i < ASSET_TOKENS.length; i++) {
    arn = replaceAll(arn, ASSET_TOKENS[i], CFN_TOKENS[i]);
  }
  return arn;
}
