import * as iam from '@aws-cdk/aws-iam';
import * as cr from '@aws-cdk/custom-resources';
import { Construct } from 'constructs';
/**
 * Properties to configure a log group resource policy
 */
export interface LogGroupResourcePolicyProps {
    /**
     * The log group resource policy name
     */
    readonly policyName?: string;
    /**
     * The policy statements for the log group resource logs
     */
    readonly policyStatements: [iam.PolicyStatement];
}
/**
 * Creates LogGroup resource policies.
 */
export declare class LogGroupResourcePolicy extends cr.AwsCustomResource {
    constructor(scope: Construct, id: string, props: LogGroupResourcePolicyProps);
}
