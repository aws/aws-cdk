import { Token } from '../../../core';

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
        throw new Error(`\`version\` must be between 1 and 99999999, got ${version}.`);
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
      const guardrailPattern = /^(([a-z0-9]+)|(arn:aws(-[^:]+)?:bedrock:[a-z0-9-]{1,20}:[0-9]{12}:guardrail\/[a-z0-9]+))$/;

      if (!guardrailPattern.test(guardrailIdentifier)) {
        throw new Error(`You must set guardrailIdentifier to the id or the arn of Guardrail, got ${guardrailIdentifier}`);
      }

      if (guardrailIdentifier.length > 2048) {
        throw new Error(`\`guardrailIdentifier\` length must be between 0 and 2048, got ${guardrailIdentifier.length}.`);
      }
    }
  }
}
