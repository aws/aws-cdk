import { Stack } from '@aws-cdk/core';
import { SynthesisMessage } from '@aws-cdk/cx-api';
/**
 * Suite of assertions that can be run on a CDK Stack.
 * Focused on asserting annotations.
 */
export declare class Annotations {
    /**
     * Base your assertions on the messages returned by a synthesized CDK `Stack`.
     * @param stack the CDK Stack to run assertions on
     */
    static fromStack(stack: Stack): Annotations;
    private readonly _messages;
    private constructor();
    /**
     * Assert that an error with the given message exists in the synthesized CDK `Stack`.
     *
     * @param constructPath the construct path to the error. Provide `'*'` to match all errors in the template.
     * @param message the error message as should be expected. This should be a string or Matcher object.
     */
    hasError(constructPath: string, message: any): void;
    /**
     * Assert that an error with the given message does not exist in the synthesized CDK `Stack`.
     *
     * @param constructPath the construct path to the error. Provide `'*'` to match all errors in the template.
     * @param message the error message as should be expected. This should be a string or Matcher object.
     */
    hasNoError(constructPath: string, message: any): void;
    /**
     * Get the set of matching errors of a given construct path and message.
     *
     * @param constructPath the construct path to the error. Provide `'*'` to match all errors in the template.
     * @param message the error message as should be expected. This should be a string or Matcher object.
     */
    findError(constructPath: string, message: any): SynthesisMessage[];
    /**
     * Assert that an warning with the given message exists in the synthesized CDK `Stack`.
     *
     * @param constructPath the construct path to the warning. Provide `'*'` to match all warnings in the template.
     * @param message the warning message as should be expected. This should be a string or Matcher object.
     */
    hasWarning(constructPath: string, message: any): void;
    /**
     * Assert that an warning with the given message does not exist in the synthesized CDK `Stack`.
     *
     * @param constructPath the construct path to the warning. Provide `'*'` to match all warnings in the template.
     * @param message the warning message as should be expected. This should be a string or Matcher object.
     */
    hasNoWarning(constructPath: string, message: any): void;
    /**
     * Get the set of matching warning of a given construct path and message.
     *
     * @param constructPath the construct path to the warning. Provide `'*'` to match all warnings in the template.
     * @param message the warning message as should be expected. This should be a string or Matcher object.
     */
    findWarning(constructPath: string, message: any): SynthesisMessage[];
    /**
     * Assert that an info with the given message exists in the synthesized CDK `Stack`.
     *
     * @param constructPath the construct path to the info. Provide `'*'` to match all info in the template.
     * @param message the info message as should be expected. This should be a string or Matcher object.
     */
    hasInfo(constructPath: string, message: any): void;
    /**
     * Assert that an info with the given message does not exist in the synthesized CDK `Stack`.
     *
     * @param constructPath the construct path to the info. Provide `'*'` to match all info in the template.
     * @param message the info message as should be expected. This should be a string or Matcher object.
     */
    hasNoInfo(constructPath: string, message: any): void;
    /**
     * Get the set of matching infos of a given construct path and message.
     *
     * @param constructPath the construct path to the info. Provide `'*'` to match all infos in the template.
     * @param message the info message as should be expected. This should be a string or Matcher object.
     */
    findInfo(constructPath: string, message: any): SynthesisMessage[];
}
