"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalTableCoordinator = void 0;
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
/**
 * A stack that will make a Lambda that will launch a lambda to glue
 * together all the DynamoDB tables into a global table
 */
class GlobalTableCoordinator extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const lambdaFunction = new lambda.SingletonFunction(this, 'SingletonLambda', {
            code: lambda.Code.fromAsset(path.resolve(__dirname, '../', 'lambda-packages', 'aws-global-table-coordinator', 'lib')),
            description: 'Lambda to make DynamoDB a global table',
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            timeout: cdk.Duration.minutes(5),
            uuid: 'D38B65A6-6B54-4FB6-9BAD-9CD40A6DAC12',
        });
        grantCreateGlobalTableLambda(lambdaFunction.role);
        new cdk.CustomResource(this, 'CfnCustomResource', {
            serviceToken: lambdaFunction.functionArn,
            pascalCaseProperties: true,
            properties: {
                regions: props.regions,
                resourceType: 'Custom::DynamoGlobalTableCoordinator',
                tableName: props.tableName,
            },
            removalPolicy: props.removalPolicy,
        });
    }
}
exports.GlobalTableCoordinator = GlobalTableCoordinator;
/**
 * Permits an IAM Principal to create a global dynamodb table.
 * @param principal The principal (no-op if undefined)
 */
function grantCreateGlobalTableLambda(principal) {
    if (principal) {
        principal.addToPrincipalPolicy(new iam.PolicyStatement({
            resources: ['*'],
            actions: [
                'iam:CreateServiceLinkedRole',
                'application-autoscaling:DeleteScalingPolicy',
                'application-autoscaling:DeregisterScalableTarget',
                'dynamodb:CreateGlobalTable', 'dynamodb:DescribeLimits',
                'dynamodb:DeleteTable', 'dynamodb:DescribeGlobalTable',
                'dynamodb:UpdateGlobalTable',
            ],
        }));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLXRhYmxlLWNvb3JkaW5hdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2xvYmFsLXRhYmxlLWNvb3JkaW5hdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUE2QjtBQUM3Qix3Q0FBd0M7QUFDeEMsOENBQThDO0FBQzlDLHFDQUFxQztBQUlyQzs7O0dBR0c7QUFDSCxNQUFhLHNCQUF1QixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ25ELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBdUI7UUFDL0QsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEIsTUFBTSxjQUFjLEdBQUcsSUFBSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQzNFLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsOEJBQThCLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDckgsV0FBVyxFQUFFLHdDQUF3QztZQUNyRCxPQUFPLEVBQUUsZUFBZTtZQUN4QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDaEMsSUFBSSxFQUFFLHNDQUFzQztTQUM3QyxDQUFDLENBQUM7UUFFSCw0QkFBNEIsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbEQsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUNoRCxZQUFZLEVBQUUsY0FBYyxDQUFDLFdBQVc7WUFDeEMsb0JBQW9CLEVBQUUsSUFBSTtZQUMxQixVQUFVLEVBQUU7Z0JBQ1YsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO2dCQUN0QixZQUFZLEVBQUUsc0NBQXNDO2dCQUNwRCxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVM7YUFDM0I7WUFDRCxhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWE7U0FDbkMsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQXpCRCx3REF5QkM7QUFFRDs7O0dBR0c7QUFDSCxTQUFTLDRCQUE0QixDQUFDLFNBQTBCO0lBQzlELElBQUksU0FBUyxFQUFFO1FBQ2IsU0FBUyxDQUFDLG9CQUFvQixDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUNyRCxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFDaEIsT0FBTyxFQUFFO2dCQUNQLDZCQUE2QjtnQkFDN0IsNkNBQTZDO2dCQUM3QyxrREFBa0Q7Z0JBQ2xELDRCQUE0QixFQUFFLHlCQUF5QjtnQkFDdkQsc0JBQXNCLEVBQUUsOEJBQThCO2dCQUN0RCw0QkFBNEI7YUFDN0I7U0FDRixDQUFDLENBQUMsQ0FBQztLQUNMO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEdsb2JhbFRhYmxlUHJvcHMgfSBmcm9tICcuL2F3cy1keW5hbW9kYi1nbG9iYWwnO1xuXG4vKipcbiAqIEEgc3RhY2sgdGhhdCB3aWxsIG1ha2UgYSBMYW1iZGEgdGhhdCB3aWxsIGxhdW5jaCBhIGxhbWJkYSB0byBnbHVlXG4gKiB0b2dldGhlciBhbGwgdGhlIER5bmFtb0RCIHRhYmxlcyBpbnRvIGEgZ2xvYmFsIHRhYmxlXG4gKi9cbmV4cG9ydCBjbGFzcyBHbG9iYWxUYWJsZUNvb3JkaW5hdG9yIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEdsb2JhbFRhYmxlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcbiAgICBjb25zdCBsYW1iZGFGdW5jdGlvbiA9IG5ldyBsYW1iZGEuU2luZ2xldG9uRnVuY3Rpb24odGhpcywgJ1NpbmdsZXRvbkxhbWJkYScsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vJywgJ2xhbWJkYS1wYWNrYWdlcycsICdhd3MtZ2xvYmFsLXRhYmxlLWNvb3JkaW5hdG9yJywgJ2xpYicpKSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTGFtYmRhIHRvIG1ha2UgRHluYW1vREIgYSBnbG9iYWwgdGFibGUnLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24ubWludXRlcyg1KSxcbiAgICAgIHV1aWQ6ICdEMzhCNjVBNi02QjU0LTRGQjYtOUJBRC05Q0Q0MEE2REFDMTInLFxuICAgIH0pO1xuXG4gICAgZ3JhbnRDcmVhdGVHbG9iYWxUYWJsZUxhbWJkYShsYW1iZGFGdW5jdGlvbi5yb2xlKTtcblxuICAgIG5ldyBjZGsuQ3VzdG9tUmVzb3VyY2UodGhpcywgJ0NmbkN1c3RvbVJlc291cmNlJywge1xuICAgICAgc2VydmljZVRva2VuOiBsYW1iZGFGdW5jdGlvbi5mdW5jdGlvbkFybixcbiAgICAgIHBhc2NhbENhc2VQcm9wZXJ0aWVzOiB0cnVlLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICByZWdpb25zOiBwcm9wcy5yZWdpb25zLFxuICAgICAgICByZXNvdXJjZVR5cGU6ICdDdXN0b206OkR5bmFtb0dsb2JhbFRhYmxlQ29vcmRpbmF0b3InLFxuICAgICAgICB0YWJsZU5hbWU6IHByb3BzLnRhYmxlTmFtZSxcbiAgICAgIH0sXG4gICAgICByZW1vdmFsUG9saWN5OiBwcm9wcy5yZW1vdmFsUG9saWN5LFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogUGVybWl0cyBhbiBJQU0gUHJpbmNpcGFsIHRvIGNyZWF0ZSBhIGdsb2JhbCBkeW5hbW9kYiB0YWJsZS5cbiAqIEBwYXJhbSBwcmluY2lwYWwgVGhlIHByaW5jaXBhbCAobm8tb3AgaWYgdW5kZWZpbmVkKVxuICovXG5mdW5jdGlvbiBncmFudENyZWF0ZUdsb2JhbFRhYmxlTGFtYmRhKHByaW5jaXBhbD86IGlhbS5JUHJpbmNpcGFsKTogdm9pZCB7XG4gIGlmIChwcmluY2lwYWwpIHtcbiAgICBwcmluY2lwYWwuYWRkVG9QcmluY2lwYWxQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgJ2lhbTpDcmVhdGVTZXJ2aWNlTGlua2VkUm9sZScsXG4gICAgICAgICdhcHBsaWNhdGlvbi1hdXRvc2NhbGluZzpEZWxldGVTY2FsaW5nUG9saWN5JyxcbiAgICAgICAgJ2FwcGxpY2F0aW9uLWF1dG9zY2FsaW5nOkRlcmVnaXN0ZXJTY2FsYWJsZVRhcmdldCcsXG4gICAgICAgICdkeW5hbW9kYjpDcmVhdGVHbG9iYWxUYWJsZScsICdkeW5hbW9kYjpEZXNjcmliZUxpbWl0cycsXG4gICAgICAgICdkeW5hbW9kYjpEZWxldGVUYWJsZScsICdkeW5hbW9kYjpEZXNjcmliZUdsb2JhbFRhYmxlJyxcbiAgICAgICAgJ2R5bmFtb2RiOlVwZGF0ZUdsb2JhbFRhYmxlJyxcbiAgICAgIF0sXG4gICAgfSkpO1xuICB9XG59XG4iXX0=