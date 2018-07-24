import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import logs = require('@aws-cdk/aws-logs');
import cdk = require('@aws-cdk/cdk');
import { cloudformation, FunctionArn } from './lambda.generated';
import { LambdaPermission } from './permission';

/**
 * Represents a Lambda function defined outside of this stack.
 */
export interface LambdaRefProps {
    /**
     * The ARN of the Lambda function.
     * Format: arn:<partition>:lambda:<region>:<account-id>:function:<function-name>
     */
    functionArn: FunctionArn;

    /**
     * The IAM execution role associated with this function.
     * If the role is not specified, any role-related operations will no-op.
     */
    role?: iam.Role;
}

export abstract class LambdaRef extends cdk.Construct implements events.IEventRuleTarget, logs.ILogSubscriptionDestination {
    /**
     * Creates a Lambda function object which represents a function not defined
     * within this stack.
     *
     *      Lambda.import(this, 'MyImportedFunction', { lambdaArn: new LambdaArn('arn:aws:...') });
     *
     * @param parent The parent construct
     * @param name The name of the lambda construct
     * @param ref A reference to a Lambda function. Can be created manually (see
     * example above) or obtained through a call to `lambda.export()`.
     */
    public static import(parent: cdk.Construct, name: string, ref: LambdaRefProps): LambdaRef {
        return new LambdaRefImport(parent, name, ref);
    }

    /**
     * Return the given named metric for this Lambda
     */
    public static metricAll(metricName: string, props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return new cloudwatch.Metric({
            namespace: 'AWS/Lambda',
            metricName,
            ...props
        });
    }
    /**
     * Metric for the number of Errors executing all Lambdas
     *
     * @default sum over 5 minutes
     */
    public static metricAllErrors(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return LambdaRef.metricAll('Errors', { statistic: 'sum', ...props });
    }

    /**
     * Metric for the Duration executing all Lambdas
     *
     * @default average over 5 minutes
     */
    public static metricAllDuration(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return LambdaRef.metricAll('Duration', props);
    }

    /**
     * Metric for the number of invocations of all Lambdas
     *
     * @default sum over 5 minutes
     */
    public static metricAllInvocations(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return LambdaRef.metricAll('Invocations', { statistic: 'sum', ...props });
    }

    /**
     * Metric for the number of throttled invocations of all Lambdas
     *
     * @default sum over 5 minutes
     */
    public static metricAllThrottles(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return LambdaRef.metricAll('Throttles', { statistic: 'sum', ...props });
    }

    /**
     * Metric for the number of concurrent executions across all Lambdas
     *
     * @default max over 5 minutes
     */
    public static metricAllConcurrentExecutions(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        // Mini-FAQ: why max? This metric is a gauge that is emitted every
        // minute, so either max or avg or a percentile make sense (but sum
        // doesn't). Max is more sensitive to spiky load changes which is
        // probably what you're interested in if you're looking at this metric
        // (Load spikes may lead to concurrent execution errors that would
        // otherwise not be visible in the avg)
        return LambdaRef.metricAll('ConcurrentExecutions', { statistic: 'max', ...props });
    }

    /**
     * Metric for the number of unreserved concurrent executions across all Lambdas
     *
     * @default max over 5 minutes
     */
    public static metricAllUnreservedConcurrentExecutions(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return LambdaRef.metricAll('UnreservedConcurrentExecutions', { statistic: 'max', ...props });
    }

    /**
     * The name of the function.
     */
    public abstract readonly functionName: FunctionName;

    /**
     * The ARN fo the function.
     */
    public abstract readonly functionArn: FunctionArn;

    /**
     * The IAM role associated with this function.
     */
    public abstract readonly role?: iam.Role;

    /**
     * Whether the addPermission() call adds any permissions
     *
     * True for new Lambdas, false for imported Lambdas (they might live in different accounts).
     */
    protected abstract readonly canCreatePermissions: boolean;

    /**
     * Indicates if the resource policy that allows CloudWatch events to publish
     * notifications to this lambda have been added.
     */
    private eventRuleTargetPolicyAdded = false;

    /**
     * Indicates if the policy that allows CloudWatch logs to publish to this lambda has been added.
     */
    private logSubscriptionDestinationPolicyAddedFor: logs.LogGroupArn[] = [];

    /**
     * Adds a permission to the Lambda resource policy.
     * @param name A name for the permission construct
     */
    public addPermission(name: string, permission: LambdaPermission) {
        if (!this.canCreatePermissions) {
            // FIXME: Report metadata
            return;
        }

        const principal = this.parsePermissionPrincipal(permission.principal);
        const action = permission.action || 'lambda:InvokeFunction';

        new cloudformation.PermissionResource(this, name, {
            action,
            principal,
            functionName: this.functionName,
            eventSourceToken: permission.eventSourceToken,
            sourceAccount: permission.sourceAccount,
            sourceArn: permission.sourceArn,
        });
    }

    public addToRolePolicy(statement: cdk.PolicyStatement) {
        if (!this.role) {
            return;
        }

        this.role.addToPolicy(statement);
    }

    /**
     * Returns a RuleTarget that can be used to trigger this Lambda as a
     * result from a CloudWatch event.
     */
    public get eventRuleTarget(): events.EventRuleTarget {
        if (!this.eventRuleTargetPolicyAdded) {
            this.addPermission('InvokedByCloudWatch', {
                action: 'lambda:InvokeFunction',
                principal: new cdk.ServicePrincipal('events.amazonaws.com')
            });

            this.eventRuleTargetPolicyAdded = true;
        }

        return {
            id: this.name,
            arn: this.functionArn,
        };
    }

    /**
     * Return the given named metric for this Lambda
     */
    public metric(metricName: string, props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return new cloudwatch.Metric({
            namespace: 'AWS/Lambda',
            metricName,
            dimensions: { FunctionName: this.functionName },
            ...props
        });
    }

    /**
     * Metric for the Errors executing this Lambda
     *
     * @default sum over 5 minutes
     */
    public metricErrors(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.metric('Errors', { statistic: 'sum', ...props });
    }

    /**
     * Metric for the Duration of this Lambda
     *
     * @default average over 5 minutes
     */
    public metricDuration(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.metric('Duration', props);
    }

    /**
     * Metric for the number of invocations of this Lambda
     *
     * @default sum over 5 minutes
     */
    public metricInvocations(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.metric('Invocations', { statistic: 'sum', ...props });
    }

    /**
     * Metric for the number of throttled invocations of this Lambda
     *
     * @default sum over 5 minutes
     */
    public metricThrottles(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.metric('Throttles', { statistic: 'sum', ...props });
    }

    public logSubscriptionDestination(sourceLogGroup: logs.LogGroup): logs.LogSubscriptionDestination {
        const arn = sourceLogGroup.logGroupArn;

        if (this.logSubscriptionDestinationPolicyAddedFor.indexOf(arn) === -1) {
            // NOTE: the use of {AWS::Region} limits this to the same region, which shouldn't really be an issue,
            // since the Lambda must be in the same region as the SubscriptionFilter anyway.
            //
            // (Wildcards in principals are unfortunately not supported.
            this.addPermission('InvokedByCloudWatchLogs', {
                principal: new cdk.ServicePrincipal(new cdk.FnConcat('logs.', new cdk.AwsRegion(), '.amazonaws.com')),
                sourceArn: arn
            });
            this.logSubscriptionDestinationPolicyAddedFor.push(arn);
        }
        return { arn: this.functionArn };
    }

    /**
     * Export this Function (without the role)
     */
    public export(): LambdaRefProps {
        return {
            functionArn: new cdk.Output(this, 'FunctionArn', { value: this.functionArn }).makeImportValue(),
        };
    }

    private parsePermissionPrincipal(principal?: cdk.PolicyPrincipal) {
        if (!principal) {
            return undefined;
        }

        // use duck-typing, not instance of

        if ('accountId' in principal) {
            return (principal as cdk.AccountPrincipal).accountId;
        }

        if (`service` in principal) {
            return (principal as cdk.ServicePrincipal).service;
        }

        throw new Error(`Invalid principal type for Lambda permission statement: ${JSON.stringify(cdk.resolve(principal))}. ` +
            'Supported: AccountPrincipal, ServicePrincipal');
    }
}

class LambdaRefImport extends LambdaRef {
    public readonly functionName: FunctionName;
    public readonly functionArn: FunctionArn;
    public readonly role?: iam.Role;

    protected readonly canCreatePermissions = false;

    constructor(parent: cdk.Construct, name: string, props: LambdaRefProps) {
        super(parent, name);

        this.functionArn = props.functionArn;
        this.functionName = this.extractNameFromArn(props.functionArn);
        this.role = props.role;
    }

    /**
     * Given an opaque (token) ARN, returns a CloudFormation expression that extracts the function
     * name from the ARN.
     *
     * Function ARNs look like this:
     *
     *     arn:aws:lambda:region:account-id:function:function-name
     *
     * ..which means that in order to extract the `function-name` component from the ARN, we can
     * split the ARN using ":" and select the component in index 6.
     *
     * @returns `FnSelect(6, FnSplit(':', arn))`
     */
    private extractNameFromArn(arn: cdk.Arn) {
        return new cdk.FnSelect(6, new cdk.FnSplit(':', arn));

    }
}
export class FunctionName extends cdk.Token { }
