/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import type { CfnRuntime } from '../../../../aws-bedrockagentcore';
import { Token } from '../../../../core';
import { UnscopedValidationError } from '../../../../core/lib/errors';
import { lit } from '../../../../core/lib/helpers-internal';
import { renderCustomClaim } from '../../common/custom-claim-helpers';
import { CustomClaimOperator, CustomClaimValueType } from '../../common/types';

/**
 * Represents a custom claim validation configuration for Runtime JWT authorizers.
 * Custom claims allow you to validate additional fields in JWT tokens beyond
 * the standard audience, client, and scope validations.
 */
export class RuntimeCustomClaim {
  /**
   * Create a custom claim with a string value.
   * String claims must use the EQUALS operator.
   *
   * @param name The name of the claim in the JWT token
   * @param value The string value to match (must exactly equal)
   * @returns A RuntimeCustomClaim configured for string validation
   */
  public static withStringValue(name: string, value: string): RuntimeCustomClaim {
    return new RuntimeCustomClaim(name, CustomClaimValueType.STRING, CustomClaimOperator.EQUALS, value);
  }

  /**
   * Create a custom claim with a string array value.
   * String array claims can use CONTAINS (default) or CONTAINS_ANY operator.
   *
   * @param name The name of the claim in the JWT token
   * @param values The array of string values to match. For CONTAINS operator, must contain exactly one value.
   * @param operator The match operator (defaults to CONTAINS)
   * @returns A RuntimeCustomClaim configured for string array validation
   */
  public static withStringArrayValue(
    name: string,
    values: string[],
    operator: CustomClaimOperator = CustomClaimOperator.CONTAINS,
  ): RuntimeCustomClaim {
    if (operator !== CustomClaimOperator.CONTAINS && operator !== CustomClaimOperator.CONTAINS_ANY) {
      throw new UnscopedValidationError(
        lit`InvalidOperatorForStringArray`,
        `Custom claim '${name}': STRING_ARRAY type only supports CONTAINS or CONTAINS_ANY operators, got ${operator}`,
      );
    }
    return new RuntimeCustomClaim(name, CustomClaimValueType.STRING_ARRAY, operator, values);
  }

  private constructor(
    private readonly name: string,
    private readonly valueType: CustomClaimValueType,
    private readonly operator: CustomClaimOperator,
    private readonly value: string | string[],
  ) {
    if (Token.isUnresolved(value)) return;
    if (valueType === CustomClaimValueType.STRING && typeof value !== 'string') {
      throw new UnscopedValidationError(lit`InvalidValueTypeForString`, `Custom claim '${name}': STRING type requires a string value, got ${typeof value}`);
    }
    if (valueType === CustomClaimValueType.STRING_ARRAY && !Array.isArray(value)) {
      throw new UnscopedValidationError(lit`InvalidValueTypeForStringArray`, `Custom claim '${name}': STRING_ARRAY type requires an array value, got ${typeof value}`);
    }
  }

  /**
   * Render the custom claim as a CloudFormation property
   * @internal
   */
  public _render(): CfnRuntime.CustomClaimValidationTypeProperty {
    if (this.operator === CustomClaimOperator.CONTAINS) {
      const values = this.value as string[];
      if (!Token.isUnresolved(values[0]) && values.length !== 1) {
        throw new UnscopedValidationError(
          lit`InvalidContainsOperatorValueCount`,
          `Custom claim '${this.name}': CONTAINS operator requires exactly one value, got ${values.length} values`,
        );
      }
    }
    return renderCustomClaim(this.name, this.valueType, this.operator, this.value);
  }
}
