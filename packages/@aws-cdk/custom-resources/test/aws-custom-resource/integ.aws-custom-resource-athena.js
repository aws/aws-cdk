"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_iam_1 = require("@aws-cdk/aws-iam");
const aws_s3_1 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../../lib");
/*
 *
 * Stack verification steps:
 *
 * 1) Deploy app.
 *    $ yarn build && yarn integ --update-on-failed --no-clean
 * 2) Change `notebookName` to perform an update.
 *    $ yarn build && yarn integ --update-on-failed --no-clean
 * 3) Check if PhysicalResourceId is consistent.
 *    $ aws cloudformation describe-stack-events \
 *      --stack-name aws-cdk-customresources-athena \
 *      --query 'StackEvents[?starts_with(LogicalResourceId,`AthenaNotebook`)]'
 *
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-customresources-athena');
const athenaResultBucket = new aws_s3_1.Bucket(stack, 'AthenaResultBucket');
const athenaExecutionRole = new aws_iam_1.Role(stack, 'AthenaExecRole', {
    assumedBy: new aws_iam_1.ServicePrincipal('athena.amazonaws.com'),
    managedPolicies: [
        aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('AmazonAthenaFullAccess'),
    ],
});
// To avoid the Lambda Function from failing due to delays
// in policy propagation, this role should be created explicitly.
const customResourceRole = new aws_iam_1.Role(stack, 'CustomResourceRole', {
    assumedBy: new aws_iam_1.ServicePrincipal('lambda.amazonaws.com'),
    managedPolicies: [
        aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
    ],
    inlinePolicies: {
        PassRolePolicy: new aws_iam_1.PolicyDocument({
            statements: [new aws_iam_1.PolicyStatement({
                    actions: ['iam:PassRole'],
                    resources: [athenaExecutionRole.roleArn],
                })],
        }),
        AthenaWorkGroupPolicy: new aws_iam_1.PolicyDocument({
            statements: [new aws_iam_1.PolicyStatement({
                    actions: [
                        'athena:CreateWorkGroup',
                        'athena:DeleteWorkGroup',
                    ],
                    resources: ['*'],
                })],
        }),
        AthenaNotebookPolicy: new aws_iam_1.PolicyDocument({
            statements: [new aws_iam_1.PolicyStatement({
                    actions: [
                        'athena:CreateNotebook',
                        'athena:UpdateNotebookMetadata',
                        'athena:DeleteNotebook',
                    ],
                    resources: ['*'],
                })],
        }),
    },
});
const workgroupName = 'TestWG';
const workgroup = new lib_1.AwsCustomResource(stack, 'AthenaWorkGroup', {
    role: customResourceRole,
    resourceType: 'Custom::AthenaWorkGroup',
    installLatestAwsSdk: true,
    onCreate: {
        service: 'Athena',
        action: 'createWorkGroup',
        physicalResourceId: lib_1.PhysicalResourceId.of(workgroupName),
        parameters: {
            Name: workgroupName,
            Configuration: {
                ExecutionRole: athenaExecutionRole.roleArn,
                ResultConfiguration: {
                    OutputLocation: athenaResultBucket.s3UrlForObject(),
                },
                EngineVersion: {
                    SelectedEngineVersion: 'PySpark engine version 3',
                },
            },
        },
    },
    onDelete: {
        service: 'Athena',
        action: 'deleteWorkGroup',
        parameters: {
            WorkGroup: workgroupName,
        },
    },
    timeout: cdk.Duration.minutes(3),
});
// Athena.updateNotebook responses with empty body.
// This test case expects physicalResourceId to remain unchanged
// even if the user is unable to explicitly specify it because of empty response.
// https://docs.aws.amazon.com/athena/latest/APIReference/API_UpdateNotebook.html
const notebookName = 'MyNotebook1'; // Update name for test
const notebook = new lib_1.AwsCustomResource(stack, 'AthenaNotebook', {
    role: customResourceRole,
    resourceType: 'Custom::AthenaNotebook',
    installLatestAwsSdk: true,
    onCreate: {
        service: 'Athena',
        action: 'createNotebook',
        physicalResourceId: lib_1.PhysicalResourceId.fromResponse('NotebookId'),
        parameters: {
            WorkGroup: workgroupName,
            Name: notebookName,
        },
    },
    onUpdate: {
        service: 'Athena',
        action: 'updateNotebookMetadata',
        parameters: {
            Name: notebookName,
            NotebookId: new lib_1.PhysicalResourceIdReference(),
        },
    },
    onDelete: {
        service: 'Athena',
        action: 'deleteNotebook',
        parameters: {
            NotebookId: new lib_1.PhysicalResourceIdReference(),
        },
    },
    timeout: cdk.Duration.minutes(3),
});
notebook.node.addDependency(workgroup);
new integ_tests_1.IntegTest(app, 'CustomResourceAthena', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXdzLWN1c3RvbS1yZXNvdXJjZS1hdGhlbmEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5hd3MtY3VzdG9tLXJlc291cmNlLWF0aGVuYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhDQUEwRztBQUMxRyw0Q0FBeUM7QUFDekMscUNBQXFDO0FBQ3JDLHNEQUFpRDtBQUNqRCxtQ0FBK0Y7QUFFL0Y7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztBQUVuRSxNQUFNLGtCQUFrQixHQUFHLElBQUksZUFBTSxDQUFDLEtBQUssRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0FBQ25FLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxjQUFJLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO0lBQzVELFNBQVMsRUFBRSxJQUFJLDBCQUFnQixDQUFDLHNCQUFzQixDQUFDO0lBQ3ZELGVBQWUsRUFBRTtRQUNmLHVCQUFhLENBQUMsd0JBQXdCLENBQUMsd0JBQXdCLENBQUM7S0FDakU7Q0FDRixDQUFDLENBQUM7QUFFSCwwREFBMEQ7QUFDMUQsaUVBQWlFO0FBQ2pFLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxjQUFJLENBQUMsS0FBSyxFQUFFLG9CQUFvQixFQUFFO0lBQy9ELFNBQVMsRUFBRSxJQUFJLDBCQUFnQixDQUFDLHNCQUFzQixDQUFDO0lBQ3ZELGVBQWUsRUFBRTtRQUNmLHVCQUFhLENBQUMsd0JBQXdCLENBQUMsMENBQTBDLENBQUM7S0FDbkY7SUFDRCxjQUFjLEVBQUU7UUFDZCxjQUFjLEVBQUUsSUFBSSx3QkFBYyxDQUFDO1lBQ2pDLFVBQVUsRUFBRSxDQUFDLElBQUkseUJBQWUsQ0FBQztvQkFDL0IsT0FBTyxFQUFFLENB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QUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0NBQ2pDLENBQUMsQ0FBQztBQUNILFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRXZDLElBQUksdUJBQVMsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLEVBQUU7SUFDekMsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hbmFnZWRQb2xpY3ksIFBvbGljeURvY3VtZW50LCBQb2xpY3lTdGF0ZW1lbnQsIFJvbGUsIFNlcnZpY2VQcmluY2lwYWwgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IEJ1Y2tldCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgeyBBd3NDdXN0b21SZXNvdXJjZSwgUGh5c2ljYWxSZXNvdXJjZUlkLCBQaHlzaWNhbFJlc291cmNlSWRSZWZlcmVuY2UgfSBmcm9tICcuLi8uLi9saWInO1xuXG4vKlxuICpcbiAqIFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiAqXG4gKiAxKSBEZXBsb3kgYXBwLlxuICogICAgJCB5YXJuIGJ1aWxkICYmIHlhcm4gaW50ZWcgLS11cGRhdGUtb24tZmFpbGVkIC0tbm8tY2xlYW5cbiAqIDIpIENoYW5nZSBgbm90ZWJvb2tOYW1lYCB0byBwZXJmb3JtIGFuIHVwZGF0ZS5cbiAqICAgICQgeWFybiBidWlsZCAmJiB5YXJuIGludGVnIC0tdXBkYXRlLW9uLWZhaWxlZCAtLW5vLWNsZWFuXG4gKiAzKSBDaGVjayBpZiBQaHlzaWNhbFJlc291cmNlSWQgaXMgY29uc2lzdGVudC5cbiAqICAgICQgYXdzIGNsb3VkZm9ybWF0aW9uIGRlc2NyaWJlLXN0YWNrLWV2ZW50cyBcXFxuICogICAgICAtLXN0YWNrLW5hbWUgYXdzLWNkay1jdXN0b21yZXNvdXJjZXMtYXRoZW5hIFxcXG4gKiAgICAgIC0tcXVlcnkgJ1N0YWNrRXZlbnRzWz9zdGFydHNfd2l0aChMb2dpY2FsUmVzb3VyY2VJZCxgQXRoZW5hTm90ZWJvb2tgKV0nXG4gKlxuICovXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstY3VzdG9tcmVzb3VyY2VzLWF0aGVuYScpO1xuXG5jb25zdCBhdGhlbmFSZXN1bHRCdWNrZXQgPSBuZXcgQnVja2V0KHN0YWNrLCAnQXRoZW5hUmVzdWx0QnVja2V0Jyk7XG5jb25zdCBhdGhlbmFFeGVjdXRpb25Sb2xlID0gbmV3IFJvbGUoc3RhY2ssICdBdGhlbmFFeGVjUm9sZScsIHtcbiAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnYXRoZW5hLmFtYXpvbmF3cy5jb20nKSxcbiAgbWFuYWdlZFBvbGljaWVzOiBbXG4gICAgTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FtYXpvbkF0aGVuYUZ1bGxBY2Nlc3MnKSxcbiAgXSxcbn0pO1xuXG4vLyBUbyBhdm9pZCB0aGUgTGFtYmRhIEZ1bmN0aW9uIGZyb20gZmFpbGluZyBkdWUgdG8gZGVsYXlzXG4vLyBpbiBwb2xpY3kgcHJvcGFnYXRpb24sIHRoaXMgcm9sZSBzaG91bGQgYmUgY3JlYXRlZCBleHBsaWNpdGx5LlxuY29uc3QgY3VzdG9tUmVzb3VyY2VSb2xlID0gbmV3IFJvbGUoc3RhY2ssICdDdXN0b21SZXNvdXJjZVJvbGUnLCB7XG4gIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gIG1hbmFnZWRQb2xpY2llczogW1xuICAgIE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdzZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJyksXG4gIF0sXG4gIGlubGluZVBvbGljaWVzOiB7XG4gICAgUGFzc1JvbGVQb2xpY3k6IG5ldyBQb2xpY3lEb2N1bWVudCh7XG4gICAgICBzdGF0ZW1lbnRzOiBbbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFsnaWFtOlBhc3NSb2xlJ10sXG4gICAgICAgIHJlc291cmNlczogW2F0aGVuYUV4ZWN1dGlvblJvbGUucm9sZUFybl0sXG4gICAgICB9KV0sXG4gICAgfSksXG4gICAgQXRoZW5hV29ya0dyb3VwUG9saWN5OiBuZXcgUG9saWN5RG9jdW1lbnQoe1xuICAgICAgc3RhdGVtZW50czogW25ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgJ2F0aGVuYTpDcmVhdGVXb3JrR3JvdXAnLFxuICAgICAgICAgICdhdGhlbmE6RGVsZXRlV29ya0dyb3VwJyxcbiAgICAgICAgXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgIH0pXSxcbiAgICB9KSxcbiAgICBBdGhlbmFOb3RlYm9va1BvbGljeTogbmV3IFBvbGljeURvY3VtZW50KHtcbiAgICAgIHN0YXRlbWVudHM6IFtuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICdhdGhlbmE6Q3JlYXRlTm90ZWJvb2snLFxuICAgICAgICAgICdhdGhlbmE6VXBkYXRlTm90ZWJvb2tNZXRhZGF0YScsXG4gICAgICAgICAgJ2F0aGVuYTpEZWxldGVOb3RlYm9vaycsXG4gICAgICAgIF0sXG4gICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICB9KV0sXG4gICAgfSksXG4gIH0sXG59KTtcblxuY29uc3Qgd29ya2dyb3VwTmFtZSA9ICdUZXN0V0cnO1xuY29uc3Qgd29ya2dyb3VwID0gbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXRoZW5hV29ya0dyb3VwJywge1xuICByb2xlOiBjdXN0b21SZXNvdXJjZVJvbGUsXG4gIHJlc291cmNlVHlwZTogJ0N1c3RvbTo6QXRoZW5hV29ya0dyb3VwJyxcbiAgaW5zdGFsbExhdGVzdEF3c1NkazogdHJ1ZSxcbiAgb25DcmVhdGU6IHtcbiAgICBzZXJ2aWNlOiAnQXRoZW5hJyxcbiAgICBhY3Rpb246ICdjcmVhdGVXb3JrR3JvdXAnLFxuICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLm9mKHdvcmtncm91cE5hbWUpLFxuICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgIE5hbWU6IHdvcmtncm91cE5hbWUsXG4gICAgICBDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIEV4ZWN1dGlvblJvbGU6IGF0aGVuYUV4ZWN1dGlvblJvbGUucm9sZUFybixcbiAgICAgICAgUmVzdWx0Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIE91dHB1dExvY2F0aW9uOiBhdGhlbmFSZXN1bHRCdWNrZXQuczNVcmxGb3JPYmplY3QoKSxcbiAgICAgICAgfSxcbiAgICAgICAgRW5naW5lVmVyc2lvbjoge1xuICAgICAgICAgIFNlbGVjdGVkRW5naW5lVmVyc2lvbjogJ1B5U3BhcmsgZW5naW5lIHZlcnNpb24gMycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIG9uRGVsZXRlOiB7XG4gICAgc2VydmljZTogJ0F0aGVuYScsXG4gICAgYWN0aW9uOiAnZGVsZXRlV29ya0dyb3VwJyxcbiAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICBXb3JrR3JvdXA6IHdvcmtncm91cE5hbWUsXG4gICAgfSxcbiAgfSxcbiAgdGltZW91dDogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMyksXG59KTtcblxuLy8gQXRoZW5hLnVwZGF0ZU5vdGVib29rIHJlc3BvbnNlcyB3aXRoIGVtcHR5IGJvZHkuXG4vLyBUaGlzIHRlc3QgY2FzZSBleHBlY3RzIHBoeXNpY2FsUmVzb3VyY2VJZCB0byByZW1haW4gdW5jaGFuZ2VkXG4vLyBldmVuIGlmIHRoZSB1c2VyIGlzIHVuYWJsZSB0byBleHBsaWNpdGx5IHNwZWNpZnkgaXQgYmVjYXVzZSBvZiBlbXB0eSByZXNwb25zZS5cbi8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hdGhlbmEvbGF0ZXN0L0FQSVJlZmVyZW5jZS9BUElfVXBkYXRlTm90ZWJvb2suaHRtbFxuY29uc3Qgbm90ZWJvb2tOYW1lID0gJ015Tm90ZWJvb2sxJzsgLy8gVXBkYXRlIG5hbWUgZm9yIHRlc3RcbmNvbnN0IG5vdGVib29rID0gbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXRoZW5hTm90ZWJvb2snLCB7XG4gIHJvbGU6IGN1c3RvbVJlc291cmNlUm9sZSxcbiAgcmVzb3VyY2VUeXBlOiAnQ3VzdG9tOjpBdGhlbmFOb3RlYm9vaycsXG4gIGluc3RhbGxMYXRlc3RBd3NTZGs6IHRydWUsXG4gIG9uQ3JlYXRlOiB7XG4gICAgc2VydmljZTogJ0F0aGVuYScsXG4gICAgYWN0aW9uOiAnY3JlYXRlTm90ZWJvb2snLFxuICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLmZyb21SZXNwb25zZSgnTm90ZWJvb2tJZCcpLFxuICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgIFdvcmtHcm91cDogd29ya2dyb3VwTmFtZSxcbiAgICAgIE5hbWU6IG5vdGVib29rTmFtZSxcbiAgICB9LFxuICB9LFxuICBvblVwZGF0ZToge1xuICAgIHNlcnZpY2U6ICdBdGhlbmEnLFxuICAgIGFjdGlvbjogJ3VwZGF0ZU5vdGVib29rTWV0YWRhdGEnLFxuICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgIE5hbWU6IG5vdGVib29rTmFtZSxcbiAgICAgIE5vdGVib29rSWQ6IG5ldyBQaHlzaWNhbFJlc291cmNlSWRSZWZlcmVuY2UoKSxcbiAgICB9LFxuICB9LFxuICBvbkRlbGV0ZToge1xuICAgIHNlcnZpY2U6ICdBdGhlbmEnLFxuICAgIGFjdGlvbjogJ2RlbGV0ZU5vdGVib29rJyxcbiAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICBOb3RlYm9va0lkOiBuZXcgUGh5c2ljYWxSZXNvdXJjZUlkUmVmZXJlbmNlKCksXG4gICAgfSxcbiAgfSxcbiAgdGltZW91dDogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMyksXG59KTtcbm5vdGVib29rLm5vZGUuYWRkRGVwZW5kZW5jeSh3b3JrZ3JvdXApO1xuXG5uZXcgSW50ZWdUZXN0KGFwcCwgJ0N1c3RvbVJlc291cmNlQXRoZW5hJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=