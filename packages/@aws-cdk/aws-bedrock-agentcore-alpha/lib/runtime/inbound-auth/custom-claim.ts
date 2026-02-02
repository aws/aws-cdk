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

import { Token } from 'aws-cdk-lib';
import type { CfnRuntime } from 'aws-cdk-lib/aws-bedrockagentcore';
import { CustomClaimOperator, CustomClaimValueType } from '../../common/types';
import { ValidationError } from '../validation-helpers';

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
    // Validate operator is valid for STRING_ARRAY type
    if (operator !== CustomClaimOperator.CONTAINS && operator !== CustomClaimOperator.CONTAINS_ANY) {
      throw new ValidationError(
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
    if (Token.isUnresolved(value)) {
      return;
    }
    // Validate that value matches the valueType
    if (valueType === CustomClaimValueType.STRING && typeof value !== 'string') {
      throw new ValidationError(`Custom claim '${name}': STRING type requires a string value, got ${typeof value}`);
    }
    if (valueType === CustomClaimValueType.STRING_ARRAY && !Array.isArray(value)) {
      throw new ValidationError(`Custom claim '${name}': STRING_ARRAY type requires an array value, got ${typeof value}`);
    }
  }

  /**
   * Render the custom claim as a CloudFormation property
   * @internal
   */
  public _render(): CfnRuntime.CustomClaimValidationTypeProperty {
    // Build the claim match value based on operator and value type
    let claimMatchValue: CfnRuntime.ClaimMatchValueTypeProperty;
    if (this.valueType === CustomClaimValueType.STRING) {
      // STRING type always uses matchValueString with EQUALS operator
      claimMatchValue = {
        matchValueString: this.value as string,
      };
    } else {
      // STRING_ARRAY type: CONTAINS uses matchValueString, CONTAINS_ANY uses matchValueStringList
      if (this.operator === CustomClaimOperator.CONTAINS) {
        // CONTAINS requires a single string value (check if claim array contains this string)
        const values = this.value as string[];
        if (!Token.isUnresolved(values[0]) && values.length !== 1) {
          throw new ValidationError(
            `Custom claim '${this.name}': CONTAINS operator requires exactly one value, got ${values.length} values`,
          );
        }
        claimMatchValue = {
          matchValueString: values[0],
        };
      } else {
        // CONTAINS_ANY uses matchValueStringList
        claimMatchValue = {
          matchValueStringList: this.value as string[],
        };
      }
    }

    return {
      inboundTokenClaimName: this.name,
      inboundTokenClaimValueType: this.valueType,
      authorizingClaimMatchValue: {
        claimMatchOperator: this.operator,
        claimMatchValue: claimMatchValue,
      },
    };
  }
}
