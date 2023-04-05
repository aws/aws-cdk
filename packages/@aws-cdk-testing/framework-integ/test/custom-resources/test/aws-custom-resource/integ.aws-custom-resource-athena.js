"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const aws_s3_1 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const custom_resources_1 = require("aws-cdk-lib/custom-resources");
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
const workgroup = new custom_resources_1.AwsCustomResource(stack, 'AthenaWorkGroup', {
    role: customResourceRole,
    resourceType: 'Custom::AthenaWorkGroup',
    installLatestAwsSdk: true,
    onCreate: {
        service: 'Athena',
        action: 'createWorkGroup',
        physicalResourceId: custom_resources_1.PhysicalResourceId.of(workgroupName),
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
const notebook = new custom_resources_1.AwsCustomResource(stack, 'AthenaNotebook', {
    role: customResourceRole,
    resourceType: 'Custom::AthenaNotebook',
    installLatestAwsSdk: true,
    onCreate: {
        service: 'Athena',
        action: 'createNotebook',
        physicalResourceId: custom_resources_1.PhysicalResourceId.fromResponse('NotebookId'),
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
            NotebookId: new custom_resources_1.PhysicalResourceIdReference(),
        },
    },
    onDelete: {
        service: 'Athena',
        action: 'deleteNotebook',
        parameters: {
            NotebookId: new custom_resources_1.PhysicalResourceIdReference(),
        },
    },
    timeout: cdk.Duration.minutes(3),
});
notebook.node.addDependency(workgroup);
new integ_tests_alpha_1.IntegTest(app, 'CustomResourceAthena', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXdzLWN1c3RvbS1yZXNvdXJjZS1hdGhlbmEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5hd3MtY3VzdG9tLXJlc291cmNlLWF0aGVuYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUE2RztBQUM3RywrQ0FBNEM7QUFDNUMsbUNBQW1DO0FBQ25DLGtFQUF1RDtBQUN2RCxtRUFBa0g7QUFFbEg7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztBQUVuRSxNQUFNLGtCQUFrQixHQUFHLElBQUksZUFBTSxDQUFDLEtBQUssRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0FBQ25FLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxjQUFJLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO0lBQzVELFNBQVMsRUFBRSxJQUFJLDBCQUFnQixDQUFDLHNCQUFzQixDQUFDO0lBQ3ZELGVBQWUsRUFBRTtRQUNmLHVCQUFhLENBQUMsd0JBQXdCLENBQUMsd0JBQXdCLENBQUM7S0FDakU7Q0FDRixDQUFDLENBQUM7QUFFSCwwREFBMEQ7QUFDMUQsaUVBQWlFO0FBQ2pFLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxjQUFJLENBQUMsS0FBSyxFQUFFLG9CQUFvQixFQUFFO0lBQy9ELFNBQVMsRUFBRSxJQUFJLDBCQUFnQixDQUFDLHNCQUFzQixDQUFDO0lBQ3ZELGVBQWUsRUFBRTtRQUNmLHVCQUFhLENBQUMsd0JBQXdCLENBQUMsMENBQTBDLENBQUM7S0FDbkY7SUFDRCxjQUFjLEVBQUU7UUFDZCxjQUFjLEVBQUUsSUFBSSx3QkFBYyxDQUFDO1lBQ2pDLFVBQVUsRUFBRSxDQUFDLElBQUkseUJBQWUsQ0FBQztvQkFDL0IsT0FBTyxFQUFFLENB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QUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0NBQ2pDLENBQUMsQ0FBQztBQUNILFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRXZDLElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLEVBQUU7SUFDekMsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hbmFnZWRQb2xpY3ksIFBvbGljeURvY3VtZW50LCBQb2xpY3lTdGF0ZW1lbnQsIFJvbGUsIFNlcnZpY2VQcmluY2lwYWwgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IEJ1Y2tldCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgQXdzQ3VzdG9tUmVzb3VyY2UsIFBoeXNpY2FsUmVzb3VyY2VJZCwgUGh5c2ljYWxSZXNvdXJjZUlkUmVmZXJlbmNlIH0gZnJvbSAnYXdzLWNkay1saWIvY3VzdG9tLXJlc291cmNlcyc7XG5cbi8qXG4gKlxuICogU3RhY2sgdmVyaWZpY2F0aW9uIHN0ZXBzOlxuICpcbiAqIDEpIERlcGxveSBhcHAuXG4gKiAgICAkIHlhcm4gYnVpbGQgJiYgeWFybiBpbnRlZyAtLXVwZGF0ZS1vbi1mYWlsZWQgLS1uby1jbGVhblxuICogMikgQ2hhbmdlIGBub3RlYm9va05hbWVgIHRvIHBlcmZvcm0gYW4gdXBkYXRlLlxuICogICAgJCB5YXJuIGJ1aWxkICYmIHlhcm4gaW50ZWcgLS11cGRhdGUtb24tZmFpbGVkIC0tbm8tY2xlYW5cbiAqIDMpIENoZWNrIGlmIFBoeXNpY2FsUmVzb3VyY2VJZCBpcyBjb25zaXN0ZW50LlxuICogICAgJCBhd3MgY2xvdWRmb3JtYXRpb24gZGVzY3JpYmUtc3RhY2stZXZlbnRzIFxcXG4gKiAgICAgIC0tc3RhY2stbmFtZSBhd3MtY2RrLWN1c3RvbXJlc291cmNlcy1hdGhlbmEgXFxcbiAqICAgICAgLS1xdWVyeSAnU3RhY2tFdmVudHNbP3N0YXJ0c193aXRoKExvZ2ljYWxSZXNvdXJjZUlkLGBBdGhlbmFOb3RlYm9va2ApXSdcbiAqXG4gKi9cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLWNkay1jdXN0b21yZXNvdXJjZXMtYXRoZW5hJyk7XG5cbmNvbnN0IGF0aGVuYVJlc3VsdEJ1Y2tldCA9IG5ldyBCdWNrZXQoc3RhY2ssICdBdGhlbmFSZXN1bHRCdWNrZXQnKTtcbmNvbnN0IGF0aGVuYUV4ZWN1dGlvblJvbGUgPSBuZXcgUm9sZShzdGFjaywgJ0F0aGVuYUV4ZWNSb2xlJywge1xuICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdhdGhlbmEuYW1hem9uYXdzLmNvbScpLFxuICBtYW5hZ2VkUG9saWNpZXM6IFtcbiAgICBNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQW1hem9uQXRoZW5hRnVsbEFjY2VzcycpLFxuICBdLFxufSk7XG5cbi8vIFRvIGF2b2lkIHRoZSBMYW1iZGEgRnVuY3Rpb24gZnJvbSBmYWlsaW5nIGR1ZSB0byBkZWxheXNcbi8vIGluIHBvbGljeSBwcm9wYWdhdGlvbiwgdGhpcyByb2xlIHNob3VsZCBiZSBjcmVhdGVkIGV4cGxpY2l0bHkuXG5jb25zdCBjdXN0b21SZXNvdXJjZVJvbGUgPSBuZXcgUm9sZShzdGFjaywgJ0N1c3RvbVJlc291cmNlUm9sZScsIHtcbiAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnbGFtYmRhLmFtYXpvbmF3cy5jb20nKSxcbiAgbWFuYWdlZFBvbGljaWVzOiBbXG4gICAgTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ3NlcnZpY2Utcm9sZS9BV1NMYW1iZGFCYXNpY0V4ZWN1dGlvblJvbGUnKSxcbiAgXSxcbiAgaW5saW5lUG9saWNpZXM6IHtcbiAgICBQYXNzUm9sZVBvbGljeTogbmV3IFBvbGljeURvY3VtZW50KHtcbiAgICAgIHN0YXRlbWVudHM6IFtuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogWydpYW06UGFzc1JvbGUnXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbYXRoZW5hRXhlY3V0aW9uUm9sZS5yb2xlQXJuXSxcbiAgICAgIH0pXSxcbiAgICB9KSxcbiAgICBBdGhlbmFXb3JrR3JvdXBQb2xpY3k6IG5ldyBQb2xpY3lEb2N1bWVudCh7XG4gICAgICBzdGF0ZW1lbnRzOiBbbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAnYXRoZW5hOkNyZWF0ZVdvcmtHcm91cCcsXG4gICAgICAgICAgJ2F0aGVuYTpEZWxldGVXb3JrR3JvdXAnLFxuICAgICAgICBdLFxuICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgfSldLFxuICAgIH0pLFxuICAgIEF0aGVuYU5vdGVib29rUG9saWN5OiBuZXcgUG9saWN5RG9jdW1lbnQoe1xuICAgICAgc3RhdGVtZW50czogW25ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgJ2F0aGVuYTpDcmVhdGVOb3RlYm9vaycsXG4gICAgICAgICAgJ2F0aGVuYTpVcGRhdGVOb3RlYm9va01ldGFkYXRhJyxcbiAgICAgICAgICAnYXRoZW5hOkRlbGV0ZU5vdGVib29rJyxcbiAgICAgICAgXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgIH0pXSxcbiAgICB9KSxcbiAgfSxcbn0pO1xuXG5jb25zdCB3b3JrZ3JvdXBOYW1lID0gJ1Rlc3RXRyc7XG5jb25zdCB3b3JrZ3JvdXAgPSBuZXcgQXdzQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdBdGhlbmFXb3JrR3JvdXAnLCB7XG4gIHJvbGU6IGN1c3RvbVJlc291cmNlUm9sZSxcbiAgcmVzb3VyY2VUeXBlOiAnQ3VzdG9tOjpBdGhlbmFXb3JrR3JvdXAnLFxuICBpbnN0YWxsTGF0ZXN0QXdzU2RrOiB0cnVlLFxuICBvbkNyZWF0ZToge1xuICAgIHNlcnZpY2U6ICdBdGhlbmEnLFxuICAgIGFjdGlvbjogJ2NyZWF0ZVdvcmtHcm91cCcsXG4gICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQub2Yod29ya2dyb3VwTmFtZSksXG4gICAgcGFyYW1ldGVyczoge1xuICAgICAgTmFtZTogd29ya2dyb3VwTmFtZSxcbiAgICAgIENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgRXhlY3V0aW9uUm9sZTogYXRoZW5hRXhlY3V0aW9uUm9sZS5yb2xlQXJuLFxuICAgICAgICBSZXN1bHRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgT3V0cHV0TG9jYXRpb246IGF0aGVuYVJlc3VsdEJ1Y2tldC5zM1VybEZvck9iamVjdCgpLFxuICAgICAgICB9LFxuICAgICAgICBFbmdpbmVWZXJzaW9uOiB7XG4gICAgICAgICAgU2VsZWN0ZWRFbmdpbmVWZXJzaW9uOiAnUHlTcGFyayBlbmdpbmUgdmVyc2lvbiAzJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgb25EZWxldGU6IHtcbiAgICBzZXJ2aWNlOiAnQXRoZW5hJyxcbiAgICBhY3Rpb246ICdkZWxldGVXb3JrR3JvdXAnLFxuICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgIFdvcmtHcm91cDogd29ya2dyb3VwTmFtZSxcbiAgICB9LFxuICB9LFxuICB0aW1lb3V0OiBjZGsuRHVyYXRpb24ubWludXRlcygzKSxcbn0pO1xuXG4vLyBBdGhlbmEudXBkYXRlTm90ZWJvb2sgcmVzcG9uc2VzIHdpdGggZW1wdHkgYm9keS5cbi8vIFRoaXMgdGVzdCBjYXNlIGV4cGVjdHMgcGh5c2ljYWxSZXNvdXJjZUlkIHRvIHJlbWFpbiB1bmNoYW5nZWRcbi8vIGV2ZW4gaWYgdGhlIHVzZXIgaXMgdW5hYmxlIHRvIGV4cGxpY2l0bHkgc3BlY2lmeSBpdCBiZWNhdXNlIG9mIGVtcHR5IHJlc3BvbnNlLlxuLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2F0aGVuYS9sYXRlc3QvQVBJUmVmZXJlbmNlL0FQSV9VcGRhdGVOb3RlYm9vay5odG1sXG5jb25zdCBub3RlYm9va05hbWUgPSAnTXlOb3RlYm9vazEnOyAvLyBVcGRhdGUgbmFtZSBmb3IgdGVzdFxuY29uc3Qgbm90ZWJvb2sgPSBuZXcgQXdzQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdBdGhlbmFOb3RlYm9vaycsIHtcbiAgcm9sZTogY3VzdG9tUmVzb3VyY2VSb2xlLFxuICByZXNvdXJjZVR5cGU6ICdDdXN0b206OkF0aGVuYU5vdGVib29rJyxcbiAgaW5zdGFsbExhdGVzdEF3c1NkazogdHJ1ZSxcbiAgb25DcmVhdGU6IHtcbiAgICBzZXJ2aWNlOiAnQXRoZW5hJyxcbiAgICBhY3Rpb246ICdjcmVhdGVOb3RlYm9vaycsXG4gICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQuZnJvbVJlc3BvbnNlKCdOb3RlYm9va0lkJyksXG4gICAgcGFyYW1ldGVyczoge1xuICAgICAgV29ya0dyb3VwOiB3b3JrZ3JvdXBOYW1lLFxuICAgICAgTmFtZTogbm90ZWJvb2tOYW1lLFxuICAgIH0sXG4gIH0sXG4gIG9uVXBkYXRlOiB7XG4gICAgc2VydmljZTogJ0F0aGVuYScsXG4gICAgYWN0aW9uOiAndXBkYXRlTm90ZWJvb2tNZXRhZGF0YScsXG4gICAgcGFyYW1ldGVyczoge1xuICAgICAgTmFtZTogbm90ZWJvb2tOYW1lLFxuICAgICAgTm90ZWJvb2tJZDogbmV3IFBoeXNpY2FsUmVzb3VyY2VJZFJlZmVyZW5jZSgpLFxuICAgIH0sXG4gIH0sXG4gIG9uRGVsZXRlOiB7XG4gICAgc2VydmljZTogJ0F0aGVuYScsXG4gICAgYWN0aW9uOiAnZGVsZXRlTm90ZWJvb2snLFxuICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgIE5vdGVib29rSWQ6IG5ldyBQaHlzaWNhbFJlc291cmNlSWRSZWZlcmVuY2UoKSxcbiAgICB9LFxuICB9LFxuICB0aW1lb3V0OiBjZGsuRHVyYXRpb24ubWludXRlcygzKSxcbn0pO1xubm90ZWJvb2subm9kZS5hZGREZXBlbmRlbmN5KHdvcmtncm91cCk7XG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnQ3VzdG9tUmVzb3VyY2VBdGhlbmEnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==