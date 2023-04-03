import { IResource } from '@aws-cdk/core';
/**
 * Represents an EventBridge Rule
 */
export interface IRule extends IResource {
    /**
     * The value of the event rule Amazon Resource Name (ARN), such as
     * arn:aws:events:us-east-2:123456789012:rule/example.
     *
     * @attribute
     */
    readonly ruleArn: string;
    /**
     * The name event rule
     *
     * @attribute
     */
    readonly ruleName: string;
}
