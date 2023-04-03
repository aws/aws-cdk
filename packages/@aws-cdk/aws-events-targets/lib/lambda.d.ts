import * as events from '@aws-cdk/aws-events';
import * as lambda from '@aws-cdk/aws-lambda';
import { TargetBaseProps } from './util';
/**
 * Customize the Lambda Event Target
 */
export interface LambdaFunctionProps extends TargetBaseProps {
    /**
     * The event to send to the Lambda
     *
     * This will be the payload sent to the Lambda Function.
     *
     * @default the entire EventBridge event
     */
    readonly event?: events.RuleTargetInput;
}
/**
 * Use an AWS Lambda function as an event rule target.
 */
export declare class LambdaFunction implements events.IRuleTarget {
    private readonly handler;
    private readonly props;
    constructor(handler: lambda.IFunction, props?: LambdaFunctionProps);
    /**
     * Returns a RuleTarget that can be used to trigger this Lambda as a
     * result from an EventBridge event.
     */
    bind(rule: events.IRule, _id?: string): events.RuleTargetConfig;
}
