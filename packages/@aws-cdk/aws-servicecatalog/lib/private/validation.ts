import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

/**
 * Class to validate that inputs match requirements.
 */
export class InputValidator {
  /**
   * Validates length is between allowed min and max lengths.
   */
  public static validateLength(resourceName: string, inputName: string, minLength: number, maxLength: number, inputString?: string): void {
    if (!cdk.Token.isUnresolved(inputString) && inputString !== undefined && (inputString.length < minLength || inputString.length > maxLength)) {
      throw new Error(`Invalid ${inputName} for resource ${resourceName}, must have length between ${minLength} and ${maxLength}, got: '${this.truncateString(inputString, 100)}'`);
    }
  }

  /**
   * Validates string matches the allowed regex pattern.
   */
  public static validateRegex(resourceName: string, inputName: string, regexp: RegExp, inputString?: string): void {
    if (!cdk.Token.isUnresolved(inputString) && inputString !== undefined && !regexp.test(inputString)) {
      throw new Error(`Invalid ${inputName} for resource ${resourceName}, must match regex pattern ${regexp}, got: '${this.truncateString(inputString, 100)}'`);
    }
  }

  /**
   * Validates string matches the valid URL regex pattern.
   */
  public static validateUrl(resourceName: string, inputName: string, inputString?: string): void {
    this.validateRegex(resourceName, inputName, /^https?:\/\/.*/, inputString);
  }

  /**
  * Validates string matches the valid email regex pattern.
  */
  public static validateEmail(resourceName: string, inputName: string, inputString?: string): void {
    this.validateRegex(resourceName, inputName, /^[\w\d.%+\-]+@[a-z\d.\-]+\.[a-z]{2,4}$/i, inputString);
  }

  /**
  * Validates that a role being used as a local launch role has the role name set
  */
  public static validateRoleNameSetForLocalLaunchRole(role: iam.IRole): void {
    if (role.node.defaultChild) {
      if (cdk.Token.isUnresolved((role.node.defaultChild as iam.CfnRole).roleName)) {
        throw new Error(`Role ${role.node.id} used for Local Launch Role must have roleName explicitly set`);
      }
    }
  }

  private static truncateString(string: string, maxLength: number): string {
    if (string.length > maxLength) {
      return string.substring(0, maxLength) + '[truncated]';
    }
    return string;
  }
}