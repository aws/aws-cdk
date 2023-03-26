"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogRetention = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const s3_assets = require("@aws-cdk/aws-s3-assets");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const log_group_1 = require("./log-group");
/**
 * Creates a custom resource to control the retention policy of a CloudWatch Logs
 * log group. The log group is created if it doesn't already exist. The policy
 * is removed when `retentionDays` is `undefined` or equal to `Infinity`.
 * Log group can be created in the region that is different from stack region by
 * specifying `logGroupRegion`
 */
class LogRetention extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_logs_LogRetentionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, LogRetention);
            }
            throw error;
        }
        // Custom resource provider
        const provider = this.ensureSingletonLogRetentionFunction(props);
        // if removalPolicy is DESTROY, add action for DeleteLogGroup
        if (props.removalPolicy === cdk.RemovalPolicy.DESTROY) {
            provider.grantDeleteLogGroup(props.logGroupName);
        }
        // Need to use a CfnResource here to prevent lerna dependency cycles
        // @aws-cdk/aws-cloudformation -> @aws-cdk/aws-lambda -> @aws-cdk/aws-cloudformation
        const retryOptions = props.logRetentionRetryOptions;
        const resource = new cdk.CfnResource(this, 'Resource', {
            type: 'Custom::LogRetention',
            properties: {
                ServiceToken: provider.functionArn,
                LogGroupName: props.logGroupName,
                LogGroupRegion: props.logGroupRegion,
                SdkRetry: retryOptions ? {
                    maxRetries: retryOptions.maxRetries,
                    base: retryOptions.base?.toMilliseconds(),
                } : undefined,
                RetentionInDays: props.retention === log_group_1.RetentionDays.INFINITE ? undefined : props.retention,
                RemovalPolicy: props.removalPolicy,
            },
        });
        const logGroupName = resource.getAtt('LogGroupName').toString();
        // Append ':*' at the end of the ARN to match with how CloudFormation does this for LogGroup ARNs
        // See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#aws-resource-logs-loggroup-return-values
        this.logGroupArn = cdk.Stack.of(this).formatArn({
            region: props.logGroupRegion,
            service: 'logs',
            resource: 'log-group',
            resourceName: `${logGroupName}:*`,
            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
        });
    }
    /**
     * Helper method to ensure that only one instance of LogRetentionFunction resources are in the stack mimicking the
     * behaviour of @aws-cdk/aws-lambda's SingletonFunction to prevent circular dependencies
     */
    ensureSingletonLogRetentionFunction(props) {
        const functionLogicalId = 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a';
        const existing = cdk.Stack.of(this).node.tryFindChild(functionLogicalId);
        if (existing) {
            return existing;
        }
        return new LogRetentionFunction(cdk.Stack.of(this), functionLogicalId, props);
    }
}
exports.LogRetention = LogRetention;
_a = JSII_RTTI_SYMBOL_1;
LogRetention[_a] = { fqn: "@aws-cdk/aws-logs.LogRetention", version: "0.0.0" };
/**
 * Private provider Lambda function to support the log retention custom resource.
 */
class LogRetentionFunction extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.tags = new cdk.TagManager(cdk.TagType.KEY_VALUE, 'AWS::Lambda::Function');
        const asset = new s3_assets.Asset(this, 'Code', {
            path: path.join(__dirname, 'log-retention-provider'),
        });
        const role = props.role || new iam.Role(this, 'ServiceRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
        });
        // Duplicate statements will be deduplicated by `PolicyDocument`
        role.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['logs:PutRetentionPolicy', 'logs:DeleteRetentionPolicy'],
            // We need '*' here because we will also put a retention policy on
            // the log group of the provider function. Referencing its name
            // creates a CF circular dependency.
            resources: ['*'],
        }));
        this.role = role;
        // Lambda function
        const resource = new cdk.CfnResource(this, 'Resource', {
            type: 'AWS::Lambda::Function',
            properties: {
                Handler: 'index.handler',
                Runtime: 'nodejs14.x',
                Code: {
                    S3Bucket: asset.s3BucketName,
                    S3Key: asset.s3ObjectKey,
                },
                Role: role.roleArn,
                Tags: this.tags.renderedTags,
            },
        });
        this.functionArn = resource.getAtt('Arn');
        asset.addResourceMetadata(resource, 'Code');
        // Function dependencies
        role.node.children.forEach((child) => {
            if (cdk.CfnResource.isCfnResource(child)) {
                resource.addDependency(child);
            }
            if (constructs_1.Construct.isConstruct(child) && child.node.defaultChild && cdk.CfnResource.isCfnResource(child.node.defaultChild)) {
                resource.addDependency(child.node.defaultChild);
            }
        });
    }
    /**
     * @internal
     */
    grantDeleteLogGroup(logGroupName) {
        this.role.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['logs:DeleteLogGroup'],
            //Only allow deleting the specific log group.
            resources: [cdk.Stack.of(this).formatArn({
                    service: 'logs',
                    resource: 'log-group',
                    resourceName: `${logGroupName}:*`,
                    arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
                })],
        }));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLXJldGVudGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvZy1yZXRlbnRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNkJBQTZCO0FBQzdCLHdDQUF3QztBQUN4QyxvREFBb0Q7QUFDcEQscUNBQXFDO0FBQ3JDLHdDQUEwQztBQUMxQywyQ0FBdUM7QUFDdkMsMkNBQTRDO0FBNkQ1Qzs7Ozs7O0dBTUc7QUFDSCxNQUFhLFlBQWEsU0FBUSxzQkFBUztJQU96QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXdCO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0FSUixZQUFZOzs7O1FBVXJCLDJCQUEyQjtRQUMzQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsbUNBQW1DLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFakUsNkRBQTZEO1FBQzdELElBQUksS0FBSyxDQUFDLGFBQWEsS0FBSyxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRTtZQUNyRCxRQUFRLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ2xEO1FBRUQsb0VBQW9FO1FBQ3BFLG9GQUFvRjtRQUNwRixNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsd0JBQXdCLENBQUM7UUFDcEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDckQsSUFBSSxFQUFFLHNCQUFzQjtZQUM1QixVQUFVLEVBQUU7Z0JBQ1YsWUFBWSxFQUFFLFFBQVEsQ0FBQyxXQUFXO2dCQUNsQyxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7Z0JBQ2hDLGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYztnQkFDcEMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ3ZCLFVBQVUsRUFBRSxZQUFZLENBQUMsVUFBVTtvQkFDbkMsSUFBSSxFQUFFLFlBQVksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO2lCQUMxQyxDQUFDLENBQUMsQ0FBQyxTQUFTO2dCQUNiLGVBQWUsRUFBRSxLQUFLLENBQUMsU0FBUyxLQUFLLHlCQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTO2dCQUN6RixhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWE7YUFDbkM7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hFLGlHQUFpRztRQUNqRyw4SUFBOEk7UUFDOUksSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDOUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxjQUFjO1lBQzVCLE9BQU8sRUFBRSxNQUFNO1lBQ2YsUUFBUSxFQUFFLFdBQVc7WUFDckIsWUFBWSxFQUFFLEdBQUcsWUFBWSxJQUFJO1lBQ2pDLFNBQVMsRUFBRSxnQkFBUyxDQUFDLG1CQUFtQjtTQUN6QyxDQUFDLENBQUM7S0FDSjtJQUVEOzs7T0FHRztJQUNLLG1DQUFtQyxDQUFDLEtBQXdCO1FBQ2xFLE1BQU0saUJBQWlCLEdBQUcsOENBQThDLENBQUM7UUFDekUsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3pFLElBQUksUUFBUSxFQUFFO1lBQ1osT0FBTyxRQUFnQyxDQUFDO1NBQ3pDO1FBQ0QsT0FBTyxJQUFJLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQy9FOztBQTNESCxvQ0E0REM7OztBQUVEOztHQUVHO0FBQ0gsTUFBTSxvQkFBcUIsU0FBUSxzQkFBUztJQU8xQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXdCO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFMSCxTQUFJLEdBQW1CLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1FBT3hHLE1BQU0sS0FBSyxHQUFHLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQzlDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSx3QkFBd0IsQ0FBQztTQUNyRCxDQUFDLENBQUM7UUFFSCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQzNELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQztZQUMzRCxlQUFlLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLDBDQUEwQyxDQUFDLENBQUM7U0FDMUcsQ0FBQyxDQUFDO1FBQ0gsZ0VBQWdFO1FBQ2hFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDaEQsT0FBTyxFQUFFLENBQUMseUJBQXlCLEVBQUUsNEJBQTRCLENBQUM7WUFDbEUsa0VBQWtFO1lBQ2xFLCtEQUErRDtZQUMvRCxvQ0FBb0M7WUFDcEMsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO1NBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBQ0osSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFFakIsa0JBQWtCO1FBQ2xCLE1BQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3JELElBQUksRUFBRSx1QkFBdUI7WUFDN0IsVUFBVSxFQUFFO2dCQUNWLE9BQU8sRUFBRSxlQUFlO2dCQUN4QixPQUFPLEVBQUUsWUFBWTtnQkFDckIsSUFBSSxFQUFFO29CQUNKLFFBQVEsRUFBRSxLQUFLLENBQUMsWUFBWTtvQkFDNUIsS0FBSyxFQUFFLEtBQUssQ0FBQyxXQUFXO2lCQUN6QjtnQkFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ2xCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVk7YUFDN0I7U0FDRixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUU1Qyx3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDbkMsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDeEMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUMvQjtZQUNELElBQUksc0JBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDckgsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ2pEO1FBQ0gsQ0FBQyxDQUFDLENBQUM7S0FDSjtJQUVEOztPQUVHO0lBQ0ksbUJBQW1CLENBQUMsWUFBb0I7UUFDN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDckQsT0FBTyxFQUFFLENBQUMscUJBQXFCLENBQUM7WUFDaEMsNkNBQTZDO1lBQzdDLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQztvQkFDdkMsT0FBTyxFQUFFLE1BQU07b0JBQ2YsUUFBUSxFQUFFLFdBQVc7b0JBQ3JCLFlBQVksRUFBRSxHQUFHLFlBQVksSUFBSTtvQkFDakMsU0FBUyxFQUFFLGdCQUFTLENBQUMsbUJBQW1CO2lCQUN6QyxDQUFDLENBQUM7U0FDSixDQUFDLENBQUMsQ0FBQztLQUNMO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgczNfYXNzZXRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMy1hc3NldHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQXJuRm9ybWF0IH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFJldGVudGlvbkRheXMgfSBmcm9tICcuL2xvZy1ncm91cCc7XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgZm9yIGEgTG9nUmV0ZW50aW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIExvZ1JldGVudGlvblByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBsb2cgZ3JvdXAgbmFtZS5cbiAgICovXG4gIHJlYWRvbmx5IGxvZ0dyb3VwTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVnaW9uIHdoZXJlIHRoZSBsb2cgZ3JvdXAgc2hvdWxkIGJlIGNyZWF0ZWRcbiAgICogQGRlZmF1bHQgLSBzYW1lIHJlZ2lvbiBhcyB0aGUgc3RhY2tcbiAgICovXG4gIHJlYWRvbmx5IGxvZ0dyb3VwUmVnaW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGRheXMgbG9nIGV2ZW50cyBhcmUga2VwdCBpbiBDbG91ZFdhdGNoIExvZ3MuXG4gICAqL1xuICByZWFkb25seSByZXRlbnRpb246IFJldGVudGlvbkRheXM7XG5cbiAgLyoqXG4gICAqIFRoZSBJQU0gcm9sZSBmb3IgdGhlIExhbWJkYSBmdW5jdGlvbiBhc3NvY2lhdGVkIHdpdGggdGhlIGN1c3RvbSByZXNvdXJjZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIG5ldyByb2xlIGlzIGNyZWF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IHJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIFJldHJ5IG9wdGlvbnMgZm9yIGFsbCBBV1MgQVBJIGNhbGxzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFXUyBTREsgZGVmYXVsdCByZXRyeSBvcHRpb25zXG4gICAqL1xuICByZWFkb25seSBsb2dSZXRlbnRpb25SZXRyeU9wdGlvbnM/OiBMb2dSZXRlbnRpb25SZXRyeU9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIFRoZSByZW1vdmFsUG9saWN5IGZvciB0aGUgbG9nIGdyb3VwIHdoZW4gdGhlIHN0YWNrIGlzIGRlbGV0ZWRcbiAgICogQGRlZmF1bHQgUmVtb3ZhbFBvbGljeS5SRVRBSU5cbiAgICovXG4gIHJlYWRvbmx5IHJlbW92YWxQb2xpY3k/OiBjZGsuUmVtb3ZhbFBvbGljeTtcbn1cblxuLyoqXG4gKiBSZXRyeSBvcHRpb25zIGZvciBhbGwgQVdTIEFQSSBjYWxscy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2dSZXRlbnRpb25SZXRyeU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIG1heGltdW0gYW1vdW50IG9mIHJldHJpZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IDMgKEFXUyBTREsgZGVmYXVsdClcbiAgICovXG4gIHJlYWRvbmx5IG1heFJldHJpZXM/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBUaGUgYmFzZSBkdXJhdGlvbiB0byB1c2UgaW4gdGhlIGV4cG9uZW50aWFsIGJhY2tvZmYgZm9yIG9wZXJhdGlvbiByZXRyaWVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5taWxsaXMoMTAwKSAoQVdTIFNESyBkZWZhdWx0KVxuICAgKi9cbiAgcmVhZG9ubHkgYmFzZT86IGNkay5EdXJhdGlvbjtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgY3VzdG9tIHJlc291cmNlIHRvIGNvbnRyb2wgdGhlIHJldGVudGlvbiBwb2xpY3kgb2YgYSBDbG91ZFdhdGNoIExvZ3NcbiAqIGxvZyBncm91cC4gVGhlIGxvZyBncm91cCBpcyBjcmVhdGVkIGlmIGl0IGRvZXNuJ3QgYWxyZWFkeSBleGlzdC4gVGhlIHBvbGljeVxuICogaXMgcmVtb3ZlZCB3aGVuIGByZXRlbnRpb25EYXlzYCBpcyBgdW5kZWZpbmVkYCBvciBlcXVhbCB0byBgSW5maW5pdHlgLlxuICogTG9nIGdyb3VwIGNhbiBiZSBjcmVhdGVkIGluIHRoZSByZWdpb24gdGhhdCBpcyBkaWZmZXJlbnQgZnJvbSBzdGFjayByZWdpb24gYnlcbiAqIHNwZWNpZnlpbmcgYGxvZ0dyb3VwUmVnaW9uYFxuICovXG5leHBvcnQgY2xhc3MgTG9nUmV0ZW50aW9uIGV4dGVuZHMgQ29uc3RydWN0IHtcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgTG9nR3JvdXAuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbG9nR3JvdXBBcm46IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTG9nUmV0ZW50aW9uUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8gQ3VzdG9tIHJlc291cmNlIHByb3ZpZGVyXG4gICAgY29uc3QgcHJvdmlkZXIgPSB0aGlzLmVuc3VyZVNpbmdsZXRvbkxvZ1JldGVudGlvbkZ1bmN0aW9uKHByb3BzKTtcblxuICAgIC8vIGlmIHJlbW92YWxQb2xpY3kgaXMgREVTVFJPWSwgYWRkIGFjdGlvbiBmb3IgRGVsZXRlTG9nR3JvdXBcbiAgICBpZiAocHJvcHMucmVtb3ZhbFBvbGljeSA9PT0gY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSkge1xuICAgICAgcHJvdmlkZXIuZ3JhbnREZWxldGVMb2dHcm91cChwcm9wcy5sb2dHcm91cE5hbWUpO1xuICAgIH1cblxuICAgIC8vIE5lZWQgdG8gdXNlIGEgQ2ZuUmVzb3VyY2UgaGVyZSB0byBwcmV2ZW50IGxlcm5hIGRlcGVuZGVuY3kgY3ljbGVzXG4gICAgLy8gQGF3cy1jZGsvYXdzLWNsb3VkZm9ybWF0aW9uIC0+IEBhd3MtY2RrL2F3cy1sYW1iZGEgLT4gQGF3cy1jZGsvYXdzLWNsb3VkZm9ybWF0aW9uXG4gICAgY29uc3QgcmV0cnlPcHRpb25zID0gcHJvcHMubG9nUmV0ZW50aW9uUmV0cnlPcHRpb25zO1xuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IGNkay5DZm5SZXNvdXJjZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnQ3VzdG9tOjpMb2dSZXRlbnRpb24nLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46IHByb3ZpZGVyLmZ1bmN0aW9uQXJuLFxuICAgICAgICBMb2dHcm91cE5hbWU6IHByb3BzLmxvZ0dyb3VwTmFtZSxcbiAgICAgICAgTG9nR3JvdXBSZWdpb246IHByb3BzLmxvZ0dyb3VwUmVnaW9uLFxuICAgICAgICBTZGtSZXRyeTogcmV0cnlPcHRpb25zID8ge1xuICAgICAgICAgIG1heFJldHJpZXM6IHJldHJ5T3B0aW9ucy5tYXhSZXRyaWVzLFxuICAgICAgICAgIGJhc2U6IHJldHJ5T3B0aW9ucy5iYXNlPy50b01pbGxpc2Vjb25kcygpLFxuICAgICAgICB9IDogdW5kZWZpbmVkLFxuICAgICAgICBSZXRlbnRpb25JbkRheXM6IHByb3BzLnJldGVudGlvbiA9PT0gUmV0ZW50aW9uRGF5cy5JTkZJTklURSA/IHVuZGVmaW5lZCA6IHByb3BzLnJldGVudGlvbixcbiAgICAgICAgUmVtb3ZhbFBvbGljeTogcHJvcHMucmVtb3ZhbFBvbGljeSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBsb2dHcm91cE5hbWUgPSByZXNvdXJjZS5nZXRBdHQoJ0xvZ0dyb3VwTmFtZScpLnRvU3RyaW5nKCk7XG4gICAgLy8gQXBwZW5kICc6KicgYXQgdGhlIGVuZCBvZiB0aGUgQVJOIHRvIG1hdGNoIHdpdGggaG93IENsb3VkRm9ybWF0aW9uIGRvZXMgdGhpcyBmb3IgTG9nR3JvdXAgQVJOc1xuICAgIC8vIFNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1sb2dncm91cC5odG1sI2F3cy1yZXNvdXJjZS1sb2dzLWxvZ2dyb3VwLXJldHVybi12YWx1ZXNcbiAgICB0aGlzLmxvZ0dyb3VwQXJuID0gY2RrLlN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICByZWdpb246IHByb3BzLmxvZ0dyb3VwUmVnaW9uLFxuICAgICAgc2VydmljZTogJ2xvZ3MnLFxuICAgICAgcmVzb3VyY2U6ICdsb2ctZ3JvdXAnLFxuICAgICAgcmVzb3VyY2VOYW1lOiBgJHtsb2dHcm91cE5hbWV9OipgLFxuICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgbWV0aG9kIHRvIGVuc3VyZSB0aGF0IG9ubHkgb25lIGluc3RhbmNlIG9mIExvZ1JldGVudGlvbkZ1bmN0aW9uIHJlc291cmNlcyBhcmUgaW4gdGhlIHN0YWNrIG1pbWlja2luZyB0aGVcbiAgICogYmVoYXZpb3VyIG9mIEBhd3MtY2RrL2F3cy1sYW1iZGEncyBTaW5nbGV0b25GdW5jdGlvbiB0byBwcmV2ZW50IGNpcmN1bGFyIGRlcGVuZGVuY2llc1xuICAgKi9cbiAgcHJpdmF0ZSBlbnN1cmVTaW5nbGV0b25Mb2dSZXRlbnRpb25GdW5jdGlvbihwcm9wczogTG9nUmV0ZW50aW9uUHJvcHMpIHtcbiAgICBjb25zdCBmdW5jdGlvbkxvZ2ljYWxJZCA9ICdMb2dSZXRlbnRpb25hYWUwYWEzYzViNGQ0Zjg3YjAyZDg1YjIwMWVmZGQ4YSc7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBjZGsuU3RhY2sub2YodGhpcykubm9kZS50cnlGaW5kQ2hpbGQoZnVuY3Rpb25Mb2dpY2FsSWQpO1xuICAgIGlmIChleGlzdGluZykge1xuICAgICAgcmV0dXJuIGV4aXN0aW5nIGFzIExvZ1JldGVudGlvbkZ1bmN0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IExvZ1JldGVudGlvbkZ1bmN0aW9uKGNkay5TdGFjay5vZih0aGlzKSwgZnVuY3Rpb25Mb2dpY2FsSWQsIHByb3BzKTtcbiAgfVxufVxuXG4vKipcbiAqIFByaXZhdGUgcHJvdmlkZXIgTGFtYmRhIGZ1bmN0aW9uIHRvIHN1cHBvcnQgdGhlIGxvZyByZXRlbnRpb24gY3VzdG9tIHJlc291cmNlLlxuICovXG5jbGFzcyBMb2dSZXRlbnRpb25GdW5jdGlvbiBleHRlbmRzIENvbnN0cnVjdCBpbXBsZW1lbnRzIGNkay5JVGFnZ2FibGUge1xuICBwdWJsaWMgcmVhZG9ubHkgZnVuY3Rpb25Bcm46IGNkay5SZWZlcmVuY2U7XG5cbiAgcHVibGljIHJlYWRvbmx5IHRhZ3M6IGNkay5UYWdNYW5hZ2VyID0gbmV3IGNkay5UYWdNYW5hZ2VyKGNkay5UYWdUeXBlLktFWV9WQUxVRSwgJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgcm9sZTogaWFtLklSb2xlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBMb2dSZXRlbnRpb25Qcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBhc3NldCA9IG5ldyBzM19hc3NldHMuQXNzZXQodGhpcywgJ0NvZGUnLCB7XG4gICAgICBwYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnbG9nLXJldGVudGlvbi1wcm92aWRlcicpLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgcm9sZSA9IHByb3BzLnJvbGUgfHwgbmV3IGlhbS5Sb2xlKHRoaXMsICdTZXJ2aWNlUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICAgICAgbWFuYWdlZFBvbGljaWVzOiBbaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdzZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJyldLFxuICAgIH0pO1xuICAgIC8vIER1cGxpY2F0ZSBzdGF0ZW1lbnRzIHdpbGwgYmUgZGVkdXBsaWNhdGVkIGJ5IGBQb2xpY3lEb2N1bWVudGBcbiAgICByb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnbG9nczpQdXRSZXRlbnRpb25Qb2xpY3knLCAnbG9nczpEZWxldGVSZXRlbnRpb25Qb2xpY3knXSxcbiAgICAgIC8vIFdlIG5lZWQgJyonIGhlcmUgYmVjYXVzZSB3ZSB3aWxsIGFsc28gcHV0IGEgcmV0ZW50aW9uIHBvbGljeSBvblxuICAgICAgLy8gdGhlIGxvZyBncm91cCBvZiB0aGUgcHJvdmlkZXIgZnVuY3Rpb24uIFJlZmVyZW5jaW5nIGl0cyBuYW1lXG4gICAgICAvLyBjcmVhdGVzIGEgQ0YgY2lyY3VsYXIgZGVwZW5kZW5jeS5cbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgfSkpO1xuICAgIHRoaXMucm9sZSA9IHJvbGU7XG5cbiAgICAvLyBMYW1iZGEgZnVuY3Rpb25cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBjZGsuQ2ZuUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgdHlwZTogJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIEhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgUnVudGltZTogJ25vZGVqczE0LngnLCAvLyBFcXVpdmFsZW50IHRvIFJ1bnRpbWUuTk9ERUpTXzE0X1hcbiAgICAgICAgQ29kZToge1xuICAgICAgICAgIFMzQnVja2V0OiBhc3NldC5zM0J1Y2tldE5hbWUsXG4gICAgICAgICAgUzNLZXk6IGFzc2V0LnMzT2JqZWN0S2V5LFxuICAgICAgICB9LFxuICAgICAgICBSb2xlOiByb2xlLnJvbGVBcm4sXG4gICAgICAgIFRhZ3M6IHRoaXMudGFncy5yZW5kZXJlZFRhZ3MsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRoaXMuZnVuY3Rpb25Bcm4gPSByZXNvdXJjZS5nZXRBdHQoJ0FybicpO1xuXG4gICAgYXNzZXQuYWRkUmVzb3VyY2VNZXRhZGF0YShyZXNvdXJjZSwgJ0NvZGUnKTtcblxuICAgIC8vIEZ1bmN0aW9uIGRlcGVuZGVuY2llc1xuICAgIHJvbGUubm9kZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgaWYgKGNkay5DZm5SZXNvdXJjZS5pc0NmblJlc291cmNlKGNoaWxkKSkge1xuICAgICAgICByZXNvdXJjZS5hZGREZXBlbmRlbmN5KGNoaWxkKTtcbiAgICAgIH1cbiAgICAgIGlmIChDb25zdHJ1Y3QuaXNDb25zdHJ1Y3QoY2hpbGQpICYmIGNoaWxkLm5vZGUuZGVmYXVsdENoaWxkICYmIGNkay5DZm5SZXNvdXJjZS5pc0NmblJlc291cmNlKGNoaWxkLm5vZGUuZGVmYXVsdENoaWxkKSkge1xuICAgICAgICByZXNvdXJjZS5hZGREZXBlbmRlbmN5KGNoaWxkLm5vZGUuZGVmYXVsdENoaWxkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBncmFudERlbGV0ZUxvZ0dyb3VwKGxvZ0dyb3VwTmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5yb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnbG9nczpEZWxldGVMb2dHcm91cCddLFxuICAgICAgLy9Pbmx5IGFsbG93IGRlbGV0aW5nIHRoZSBzcGVjaWZpYyBsb2cgZ3JvdXAuXG4gICAgICByZXNvdXJjZXM6IFtjZGsuU3RhY2sub2YodGhpcykuZm9ybWF0QXJuKHtcbiAgICAgICAgc2VydmljZTogJ2xvZ3MnLFxuICAgICAgICByZXNvdXJjZTogJ2xvZy1ncm91cCcsXG4gICAgICAgIHJlc291cmNlTmFtZTogYCR7bG9nR3JvdXBOYW1lfToqYCxcbiAgICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgICAgIH0pXSxcbiAgICB9KSk7XG4gIH1cbn1cbiJdfQ==