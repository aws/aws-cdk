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
_a = JSII_RTTI_SYMBOL_1;
LogRetention[_a] = { fqn: "@aws-cdk/aws-logs.LogRetention", version: "0.0.0" };
exports.LogRetention = LogRetention;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLXJldGVudGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvZy1yZXRlbnRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNkJBQTZCO0FBQzdCLHdDQUF3QztBQUN4QyxvREFBb0Q7QUFDcEQscUNBQXFDO0FBQ3JDLHdDQUEwQztBQUMxQywyQ0FBdUM7QUFDdkMsMkNBQTRDO0FBNkQ1Qzs7Ozs7O0dBTUc7QUFDSCxNQUFhLFlBQWEsU0FBUSxzQkFBUztJQU96QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXdCO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0FSUixZQUFZOzs7O1FBVXJCLDJCQUEyQjtRQUMzQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsbUNBQW1DLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFakUsNkRBQTZEO1FBQzdELElBQUksS0FBSyxDQUFDLGFBQWEsS0FBSyxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRTtZQUNyRCxRQUFRLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ2xEO1FBRUQsb0VBQW9FO1FBQ3BFLG9GQUFvRjtRQUNwRixNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsd0JBQXdCLENBQUM7UUFDcEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDckQsSUFBSSxFQUFFLHNCQUFzQjtZQUM1QixVQUFVLEVBQUU7Z0JBQ1YsWUFBWSxFQUFFLFFBQVEsQ0FBQyxXQUFXO2dCQUNsQyxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7Z0JBQ2hDLGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYztnQkFDcEMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ3ZCLFVBQVUsRUFBRSxZQUFZLENBQUMsVUFBVTtvQkFDbkMsSUFBSSxF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QUFDO1lBQ2hDLDZDQUE2QztZQUM3QyxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUM7b0JBQ3ZDLE9BQU8sRUFBRSxNQUFNO29CQUNmLFFBQVEsRUFBRSxXQUFXO29CQUNyQixZQUFZLEVBQUUsR0FBRyxZQUFZLElBQUk7b0JBQ2pDLFNBQVMsRUFBRSxnQkFBUyxDQUFDLG1CQUFtQjtpQkFDekMsQ0FBQyxDQUFDO1NBQ0osQ0FBQyxDQUFDLENBQUM7S0FDTDtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHMzX2Fzc2V0cyBmcm9tICdAYXdzLWNkay9hd3MtczMtYXNzZXRzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEFybkZvcm1hdCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBSZXRlbnRpb25EYXlzIH0gZnJvbSAnLi9sb2ctZ3JvdXAnO1xuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIGZvciBhIExvZ1JldGVudGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2dSZXRlbnRpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbG9nIGdyb3VwIG5hbWUuXG4gICAqL1xuICByZWFkb25seSBsb2dHcm91cE5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJlZ2lvbiB3aGVyZSB0aGUgbG9nIGdyb3VwIHNob3VsZCBiZSBjcmVhdGVkXG4gICAqIEBkZWZhdWx0IC0gc2FtZSByZWdpb24gYXMgdGhlIHN0YWNrXG4gICAqL1xuICByZWFkb25seSBsb2dHcm91cFJlZ2lvbj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBkYXlzIGxvZyBldmVudHMgYXJlIGtlcHQgaW4gQ2xvdWRXYXRjaCBMb2dzLlxuICAgKi9cbiAgcmVhZG9ubHkgcmV0ZW50aW9uOiBSZXRlbnRpb25EYXlzO1xuXG4gIC8qKlxuICAgKiBUaGUgSUFNIHJvbGUgZm9yIHRoZSBMYW1iZGEgZnVuY3Rpb24gYXNzb2NpYXRlZCB3aXRoIHRoZSBjdXN0b20gcmVzb3VyY2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSBuZXcgcm9sZSBpcyBjcmVhdGVkXG4gICAqL1xuICByZWFkb25seSByb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBSZXRyeSBvcHRpb25zIGZvciBhbGwgQVdTIEFQSSBjYWxscy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBV1MgU0RLIGRlZmF1bHQgcmV0cnkgb3B0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgbG9nUmV0ZW50aW9uUmV0cnlPcHRpb25zPzogTG9nUmV0ZW50aW9uUmV0cnlPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVtb3ZhbFBvbGljeSBmb3IgdGhlIGxvZyBncm91cCB3aGVuIHRoZSBzdGFjayBpcyBkZWxldGVkXG4gICAqIEBkZWZhdWx0IFJlbW92YWxQb2xpY3kuUkVUQUlOXG4gICAqL1xuICByZWFkb25seSByZW1vdmFsUG9saWN5PzogY2RrLlJlbW92YWxQb2xpY3k7XG59XG5cbi8qKlxuICogUmV0cnkgb3B0aW9ucyBmb3IgYWxsIEFXUyBBUEkgY2FsbHMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTG9nUmV0ZW50aW9uUmV0cnlPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIGFtb3VudCBvZiByZXRyaWVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAzIChBV1MgU0RLIGRlZmF1bHQpXG4gICAqL1xuICByZWFkb25seSBtYXhSZXRyaWVzPzogbnVtYmVyO1xuICAvKipcbiAgICogVGhlIGJhc2UgZHVyYXRpb24gdG8gdXNlIGluIHRoZSBleHBvbmVudGlhbCBiYWNrb2ZmIGZvciBvcGVyYXRpb24gcmV0cmllcy5cbiAgICpcbiAgICogQGRlZmF1bHQgRHVyYXRpb24ubWlsbGlzKDEwMCkgKEFXUyBTREsgZGVmYXVsdClcbiAgICovXG4gIHJlYWRvbmx5IGJhc2U/OiBjZGsuRHVyYXRpb247XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGN1c3RvbSByZXNvdXJjZSB0byBjb250cm9sIHRoZSByZXRlbnRpb24gcG9saWN5IG9mIGEgQ2xvdWRXYXRjaCBMb2dzXG4gKiBsb2cgZ3JvdXAuIFRoZSBsb2cgZ3JvdXAgaXMgY3JlYXRlZCBpZiBpdCBkb2Vzbid0IGFscmVhZHkgZXhpc3QuIFRoZSBwb2xpY3lcbiAqIGlzIHJlbW92ZWQgd2hlbiBgcmV0ZW50aW9uRGF5c2AgaXMgYHVuZGVmaW5lZGAgb3IgZXF1YWwgdG8gYEluZmluaXR5YC5cbiAqIExvZyBncm91cCBjYW4gYmUgY3JlYXRlZCBpbiB0aGUgcmVnaW9uIHRoYXQgaXMgZGlmZmVyZW50IGZyb20gc3RhY2sgcmVnaW9uIGJ5XG4gKiBzcGVjaWZ5aW5nIGBsb2dHcm91cFJlZ2lvbmBcbiAqL1xuZXhwb3J0IGNsYXNzIExvZ1JldGVudGlvbiBleHRlbmRzIENvbnN0cnVjdCB7XG5cbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIExvZ0dyb3VwLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGxvZ0dyb3VwQXJuOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IExvZ1JldGVudGlvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIC8vIEN1c3RvbSByZXNvdXJjZSBwcm92aWRlclxuICAgIGNvbnN0IHByb3ZpZGVyID0gdGhpcy5lbnN1cmVTaW5nbGV0b25Mb2dSZXRlbnRpb25GdW5jdGlvbihwcm9wcyk7XG5cbiAgICAvLyBpZiByZW1vdmFsUG9saWN5IGlzIERFU1RST1ksIGFkZCBhY3Rpb24gZm9yIERlbGV0ZUxvZ0dyb3VwXG4gICAgaWYgKHByb3BzLnJlbW92YWxQb2xpY3kgPT09IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1kpIHtcbiAgICAgIHByb3ZpZGVyLmdyYW50RGVsZXRlTG9nR3JvdXAocHJvcHMubG9nR3JvdXBOYW1lKTtcbiAgICB9XG5cbiAgICAvLyBOZWVkIHRvIHVzZSBhIENmblJlc291cmNlIGhlcmUgdG8gcHJldmVudCBsZXJuYSBkZXBlbmRlbmN5IGN5Y2xlc1xuICAgIC8vIEBhd3MtY2RrL2F3cy1jbG91ZGZvcm1hdGlvbiAtPiBAYXdzLWNkay9hd3MtbGFtYmRhIC0+IEBhd3MtY2RrL2F3cy1jbG91ZGZvcm1hdGlvblxuICAgIGNvbnN0IHJldHJ5T3B0aW9ucyA9IHByb3BzLmxvZ1JldGVudGlvblJldHJ5T3B0aW9ucztcbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBjZGsuQ2ZuUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgdHlwZTogJ0N1c3RvbTo6TG9nUmV0ZW50aW9uJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgU2VydmljZVRva2VuOiBwcm92aWRlci5mdW5jdGlvbkFybixcbiAgICAgICAgTG9nR3JvdXBOYW1lOiBwcm9wcy5sb2dHcm91cE5hbWUsXG4gICAgICAgIExvZ0dyb3VwUmVnaW9uOiBwcm9wcy5sb2dHcm91cFJlZ2lvbixcbiAgICAgICAgU2RrUmV0cnk6IHJldHJ5T3B0aW9ucyA/IHtcbiAgICAgICAgICBtYXhSZXRyaWVzOiByZXRyeU9wdGlvbnMubWF4UmV0cmllcyxcbiAgICAgICAgICBiYXNlOiByZXRyeU9wdGlvbnMuYmFzZT8udG9NaWxsaXNlY29uZHMoKSxcbiAgICAgICAgfSA6IHVuZGVmaW5lZCxcbiAgICAgICAgUmV0ZW50aW9uSW5EYXlzOiBwcm9wcy5yZXRlbnRpb24gPT09IFJldGVudGlvbkRheXMuSU5GSU5JVEUgPyB1bmRlZmluZWQgOiBwcm9wcy5yZXRlbnRpb24sXG4gICAgICAgIFJlbW92YWxQb2xpY3k6IHByb3BzLnJlbW92YWxQb2xpY3ksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgbG9nR3JvdXBOYW1lID0gcmVzb3VyY2UuZ2V0QXR0KCdMb2dHcm91cE5hbWUnKS50b1N0cmluZygpO1xuICAgIC8vIEFwcGVuZCAnOionIGF0IHRoZSBlbmQgb2YgdGhlIEFSTiB0byBtYXRjaCB3aXRoIGhvdyBDbG91ZEZvcm1hdGlvbiBkb2VzIHRoaXMgZm9yIExvZ0dyb3VwIEFSTnNcbiAgICAvLyBTZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbG9nZ3JvdXAuaHRtbCNhd3MtcmVzb3VyY2UtbG9ncy1sb2dncm91cC1yZXR1cm4tdmFsdWVzXG4gICAgdGhpcy5sb2dHcm91cEFybiA9IGNkay5TdGFjay5vZih0aGlzKS5mb3JtYXRBcm4oe1xuICAgICAgcmVnaW9uOiBwcm9wcy5sb2dHcm91cFJlZ2lvbixcbiAgICAgIHNlcnZpY2U6ICdsb2dzJyxcbiAgICAgIHJlc291cmNlOiAnbG9nLWdyb3VwJyxcbiAgICAgIHJlc291cmNlTmFtZTogYCR7bG9nR3JvdXBOYW1lfToqYCxcbiAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIG1ldGhvZCB0byBlbnN1cmUgdGhhdCBvbmx5IG9uZSBpbnN0YW5jZSBvZiBMb2dSZXRlbnRpb25GdW5jdGlvbiByZXNvdXJjZXMgYXJlIGluIHRoZSBzdGFjayBtaW1pY2tpbmcgdGhlXG4gICAqIGJlaGF2aW91ciBvZiBAYXdzLWNkay9hd3MtbGFtYmRhJ3MgU2luZ2xldG9uRnVuY3Rpb24gdG8gcHJldmVudCBjaXJjdWxhciBkZXBlbmRlbmNpZXNcbiAgICovXG4gIHByaXZhdGUgZW5zdXJlU2luZ2xldG9uTG9nUmV0ZW50aW9uRnVuY3Rpb24ocHJvcHM6IExvZ1JldGVudGlvblByb3BzKSB7XG4gICAgY29uc3QgZnVuY3Rpb25Mb2dpY2FsSWQgPSAnTG9nUmV0ZW50aW9uYWFlMGFhM2M1YjRkNGY4N2IwMmQ4NWIyMDFlZmRkOGEnO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gY2RrLlN0YWNrLm9mKHRoaXMpLm5vZGUudHJ5RmluZENoaWxkKGZ1bmN0aW9uTG9naWNhbElkKTtcbiAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgIHJldHVybiBleGlzdGluZyBhcyBMb2dSZXRlbnRpb25GdW5jdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBMb2dSZXRlbnRpb25GdW5jdGlvbihjZGsuU3RhY2sub2YodGhpcyksIGZ1bmN0aW9uTG9naWNhbElkLCBwcm9wcyk7XG4gIH1cbn1cblxuLyoqXG4gKiBQcml2YXRlIHByb3ZpZGVyIExhbWJkYSBmdW5jdGlvbiB0byBzdXBwb3J0IHRoZSBsb2cgcmV0ZW50aW9uIGN1c3RvbSByZXNvdXJjZS5cbiAqL1xuY2xhc3MgTG9nUmV0ZW50aW9uRnVuY3Rpb24gZXh0ZW5kcyBDb25zdHJ1Y3QgaW1wbGVtZW50cyBjZGsuSVRhZ2dhYmxlIHtcbiAgcHVibGljIHJlYWRvbmx5IGZ1bmN0aW9uQXJuOiBjZGsuUmVmZXJlbmNlO1xuXG4gIHB1YmxpYyByZWFkb25seSB0YWdzOiBjZGsuVGFnTWFuYWdlciA9IG5ldyBjZGsuVGFnTWFuYWdlcihjZGsuVGFnVHlwZS5LRVlfVkFMVUUsICdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IHJvbGU6IGlhbS5JUm9sZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTG9nUmV0ZW50aW9uUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgYXNzZXQgPSBuZXcgczNfYXNzZXRzLkFzc2V0KHRoaXMsICdDb2RlJywge1xuICAgICAgcGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2xvZy1yZXRlbnRpb24tcHJvdmlkZXInKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJvbGUgPSBwcm9wcy5yb2xlIHx8IG5ldyBpYW0uUm9sZSh0aGlzLCAnU2VydmljZVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbGFtYmRhLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIG1hbmFnZWRQb2xpY2llczogW2lhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnc2VydmljZS1yb2xlL0FXU0xhbWJkYUJhc2ljRXhlY3V0aW9uUm9sZScpXSxcbiAgICB9KTtcbiAgICAvLyBEdXBsaWNhdGUgc3RhdGVtZW50cyB3aWxsIGJlIGRlZHVwbGljYXRlZCBieSBgUG9saWN5RG9jdW1lbnRgXG4gICAgcm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ2xvZ3M6UHV0UmV0ZW50aW9uUG9saWN5JywgJ2xvZ3M6RGVsZXRlUmV0ZW50aW9uUG9saWN5J10sXG4gICAgICAvLyBXZSBuZWVkICcqJyBoZXJlIGJlY2F1c2Ugd2Ugd2lsbCBhbHNvIHB1dCBhIHJldGVudGlvbiBwb2xpY3kgb25cbiAgICAgIC8vIHRoZSBsb2cgZ3JvdXAgb2YgdGhlIHByb3ZpZGVyIGZ1bmN0aW9uLiBSZWZlcmVuY2luZyBpdHMgbmFtZVxuICAgICAgLy8gY3JlYXRlcyBhIENGIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgIH0pKTtcbiAgICB0aGlzLnJvbGUgPSByb2xlO1xuXG4gICAgLy8gTGFtYmRhIGZ1bmN0aW9uXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgY2RrLkNmblJlc291cmNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBIYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIFJ1bnRpbWU6ICdub2RlanMxNC54JywgLy8gRXF1aXZhbGVudCB0byBSdW50aW1lLk5PREVKU18xNF9YXG4gICAgICAgIENvZGU6IHtcbiAgICAgICAgICBTM0J1Y2tldDogYXNzZXQuczNCdWNrZXROYW1lLFxuICAgICAgICAgIFMzS2V5OiBhc3NldC5zM09iamVjdEtleSxcbiAgICAgICAgfSxcbiAgICAgICAgUm9sZTogcm9sZS5yb2xlQXJuLFxuICAgICAgICBUYWdzOiB0aGlzLnRhZ3MucmVuZGVyZWRUYWdzLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICB0aGlzLmZ1bmN0aW9uQXJuID0gcmVzb3VyY2UuZ2V0QXR0KCdBcm4nKTtcblxuICAgIGFzc2V0LmFkZFJlc291cmNlTWV0YWRhdGEocmVzb3VyY2UsICdDb2RlJyk7XG5cbiAgICAvLyBGdW5jdGlvbiBkZXBlbmRlbmNpZXNcbiAgICByb2xlLm5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGlmIChjZGsuQ2ZuUmVzb3VyY2UuaXNDZm5SZXNvdXJjZShjaGlsZCkpIHtcbiAgICAgICAgcmVzb3VyY2UuYWRkRGVwZW5kZW5jeShjaGlsZCk7XG4gICAgICB9XG4gICAgICBpZiAoQ29uc3RydWN0LmlzQ29uc3RydWN0KGNoaWxkKSAmJiBjaGlsZC5ub2RlLmRlZmF1bHRDaGlsZCAmJiBjZGsuQ2ZuUmVzb3VyY2UuaXNDZm5SZXNvdXJjZShjaGlsZC5ub2RlLmRlZmF1bHRDaGlsZCkpIHtcbiAgICAgICAgcmVzb3VyY2UuYWRkRGVwZW5kZW5jeShjaGlsZC5ub2RlLmRlZmF1bHRDaGlsZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgZ3JhbnREZWxldGVMb2dHcm91cChsb2dHcm91cE5hbWU6IHN0cmluZykge1xuICAgIHRoaXMucm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ2xvZ3M6RGVsZXRlTG9nR3JvdXAnXSxcbiAgICAgIC8vT25seSBhbGxvdyBkZWxldGluZyB0aGUgc3BlY2lmaWMgbG9nIGdyb3VwLlxuICAgICAgcmVzb3VyY2VzOiBbY2RrLlN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICAgIHNlcnZpY2U6ICdsb2dzJyxcbiAgICAgICAgcmVzb3VyY2U6ICdsb2ctZ3JvdXAnLFxuICAgICAgICByZXNvdXJjZU5hbWU6IGAke2xvZ0dyb3VwTmFtZX06KmAsXG4gICAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUsXG4gICAgICB9KV0sXG4gICAgfSkpO1xuICB9XG59XG4iXX0=