import { ChangeMetricProps, Metric } from '@aws-cdk/cloudwatch';
import { AccountPrincipal, Arn, Construct, FnSelect, FnSplit, PolicyPrincipal,
         PolicyStatement, resolve, ServicePrincipal, Token } from '@aws-cdk/core';
import { EventRuleTarget, IEventRuleTarget } from '@aws-cdk/events';
import { Role } from '@aws-cdk/iam';
import { lambda } from '@aws-cdk/resources';
import { LambdaPermission } from './permission';

/**
 * Represents a Lambda function defined outside of this stack.
 */
export interface LambdaRefProps {
    /**
     * The ARN of the Lambda function.
     * Format: arn:<partition>:lambda:<region>:<account-id>:function:<function-name>
     */
    functionArn: lambda.FunctionArn;

    /**
     * The IAM execution role associated with this function.
     * If the role is not specified, any role-related operations will no-op.
     */
    role?: Role;
}

export abstract class LambdaRef extends Construct implements IEventRuleTarget {
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
    public static import(parent: Construct, name: string, ref: LambdaRefProps): LambdaRef {
        return new LambdaRefImport(parent, name, ref);
    }

    /**
     * Return the given named metric for this Lambda
     */
    public static metricAll(metricName: string, props?: ChangeMetricProps): Metric {
        return new Metric({
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
    public static metricAllErrors(props?: ChangeMetricProps): Metric {
        return LambdaRef.metricAll('Errors', { statistic: 'sum', ...props });
    }

    /**
     * Metric for the Duration executing all Lambdas
     *
     * @default average over 5 minutes
     */
    public static metricAllDuration(props?: ChangeMetricProps): Metric {
        return LambdaRef.metricAll('Duration', props);
    }

    /**
     * Metric for the number of invocations of all Lambdas
     *
     * @default sum over 5 minutes
     */
    public static metricAllInvocations(props?: ChangeMetricProps): Metric {
        return LambdaRef.metricAll('Invocations', { statistic: 'sum', ...props });
    }

    /**
     * Metric for the number of throttled invocations of all Lambdas
     *
     * @default sum over 5 minutes
     */
    public static metricAllThrottles(props?: ChangeMetricProps): Metric {
        return LambdaRef.metricAll('Throttles', { statistic: 'sum', ...props });
    }

    /**
     * The name of the function.
     */
    public abstract readonly functionName: FunctionName;

    /**
     * The ARN fo the function.
     */
    public abstract readonly functionArn: lambda.FunctionArn;

    /**
     * The IAM role associated with this function.
     */
    public abstract readonly role?: Role;

    /**
     * Whether the addPermission() call adds any permissions
     *
     * True for new Lambdas, false for imported Lambdas (they might live in different accounts).
     */
    protected abstract readonly canCreatePermissions: boolean;

    /**
     * Indicates if the resource policy that allows CloudWatch events to publish
     * notifications to this topic have been added.
     */
    private eventRuleTargetPolicyAdded = false;

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

        new lambda.PermissionResource(this, name, {
            action,
            principal,
            functionName: this.functionName,
            eventSourceToken: permission.eventSourceToken,
            sourceAccount: permission.sourceAccount,
            sourceArn: permission.sourceArn,
        });
    }

    public addToRolePolicy(statement: PolicyStatement) {
        if (!this.role) {
            return;
        }

        this.role.addToPolicy(statement);
    }

    /**
     * Returns a RuleTarget that can be used to trigger this Lambda as a
     * result from a CloudWatch event.
     */
    public get eventRuleTarget(): EventRuleTarget {
        if (!this.eventRuleTargetPolicyAdded) {
            this.addPermission('InvokedByCloudWatch', {
                action: 'lambda:InvokeFunction',
                principal: new ServicePrincipal('events.amazonaws.com')
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
    public metric(metricName: string, props?: ChangeMetricProps): Metric {
        return new Metric({
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
    public metricErrors(props?: ChangeMetricProps): Metric {
        return this.metric('Errors', { statistic: 'sum', ...props });
    }

    /**
     * Metric for the Duration of this Lambda
     *
     * @default average over 5 minutes
     */
    public metricDuration(props?: ChangeMetricProps): Metric {
        return this.metric('Duration', props);
    }

    /**
     * Metric for the number of invocations of this Lambda
     *
     * @default sum over 5 minutes
     */
    public metricInvocations(props?: ChangeMetricProps): Metric {
        return this.metric('Invocations', { statistic: 'sum', ...props });
    }

    /**
     * Metric for the number of throttled invocations of this Lambda
     *
     * @default sum over 5 minutes
     */
    public metricThrottles(props?: ChangeMetricProps): Metric {
        return this.metric('Throttles', { statistic: 'sum', ...props });
    }

    private parsePermissionPrincipal(principal?: PolicyPrincipal) {
        if (!principal) {
            return undefined;
        }

        // use duck-typing, not instance of

        if ('accountId' in principal) {
            return (principal as AccountPrincipal).accountId;
        }

        if (`service` in principal) {
            return (principal as ServicePrincipal).service;
        }

        throw new Error(`Invalid principal type for Lambda permission statement: ${JSON.stringify(resolve(principal))}. ` +
            'Supported: AccountPrincipal, ServicePrincipal');
    }
}

class LambdaRefImport extends LambdaRef {
    public readonly functionName: FunctionName;
    public readonly functionArn: lambda.FunctionArn;
    public readonly role?: Role;

    protected readonly canCreatePermissions = false;

    constructor(parent: Construct, name: string, props: LambdaRefProps) {
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
    private extractNameFromArn(arn: Arn) {
        return new FnSelect(6, new FnSplit(':', arn));

    }
}
export class FunctionName extends Token { }
