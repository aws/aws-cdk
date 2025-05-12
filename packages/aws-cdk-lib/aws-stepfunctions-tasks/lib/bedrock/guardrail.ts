import { Arn, ArnFormat, Token, UnscopedValidationError } from '../../../core';

/**
 * Guradrail settings for BedrockInvokeModel
 */
export class Guardrail {
  /**
   * Enable guardrail
   *
   * @param identifier The id or arn of the guardrail.
   * @param version The version of the guardrail.
   */
  public static enable(identifier: string, version: number): Guardrail {
    if (!Token.isUnresolved(version)) {
      if (version < 1 || version > 99999999) {
        throw new UnscopedValidationError(`\`version\` must be between 1 and 99999999, got ${version}.`);
      }
    }
    return new Guardrail(identifier, version.toString());
  }

  /**
   * Enable guardrail with DRAFT version
   *
   * @param identifier The identifier of the guardrail. Must be between 1 and 2048 characters in length.
   */
  public static enableDraft(identifier: string): Guardrail {
    return new Guardrail(identifier, 'DRAFT');
  }

  /**
   * @param guardrailIdentifier The identitifier of guardrail.
   * @param guardrailVersion The version of guardrail.
   */
  private constructor(public readonly guardrailIdentifier: string, public readonly guardrailVersion: string) {
    if (!Token.isUnresolved(guardrailIdentifier)) {
      let gurdrailId = undefined;

      if (guardrailIdentifier.startsWith('arn:')) {
        const arn = Arn.split(guardrailIdentifier, ArnFormat.SLASH_RESOURCE_NAME);
        if (!arn.resourceName) {
          throw new UnscopedValidationError(`Invalid ARN format. The ARN of Guradrail should have the format: \`arn:<partition>:bedrock:<region>:<account-id>:guardrail/<guardrail-name>\`, got ${guardrailIdentifier}.`);
        }
        gurdrailId = arn.resourceName;
      } else {
        gurdrailId = guardrailIdentifier;
      }

      const guardrailPattern = /^[a-z0-9]+$/;
      if (!guardrailPattern.test(gurdrailId)) {
        throw new UnscopedValidationError(`The id of Guardrail must contain only lowercase letters and numbers, got ${gurdrailId}.`);
      }

      if (guardrailIdentifier.length > 2048) {
        throw new UnscopedValidationError(`\`guardrailIdentifier\` length must be between 0 and 2048, got ${guardrailIdentifier.length}.`);
      }
    }
  }
}
