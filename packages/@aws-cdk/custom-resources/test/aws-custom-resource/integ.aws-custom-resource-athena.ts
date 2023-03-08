import { ManagedPolicy, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Bucket } from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { AwsCustomResource, PhysicalResourceId, PhysicalResourceIdReference } from '../../lib';

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

const athenaResultBucket = new Bucket(stack, 'AthenaResultBucket');
const athenaExecutionRole = new Role(stack, 'AthenaExecRole', {
  assumedBy: new ServicePrincipal('athena.amazonaws.com'),
  managedPolicies: [
    ManagedPolicy.fromAwsManagedPolicyName('AmazonAthenaFullAccess'),
  ],
});

// To avoid the Lambda Function from failing due to delays
// in policy propagation, this role should be created explicitly.
const customResourceRole = new Role(stack, 'CustomResourceRole', {
  assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
  managedPolicies: [
    ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
  ],
  inlinePolicies: {
    PassRolePolicy: new PolicyDocument({
      statements: [new PolicyStatement({
        actions: ['iam:PassRole'],
        resources: [athenaExecutionRole.roleArn],
      })],
    }),
    AthenaWorkGroupPolicy: new PolicyDocument({
      statements: [new PolicyStatement({
        actions: [
          'athena:CreateWorkGroup',
          'athena:DeleteWorkGroup',
        ],
        resources: ['*'],
      })],
    }),
    AthenaNotebookPolicy: new PolicyDocument({
      statements: [new PolicyStatement({
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
const workgroup = new AwsCustomResource(stack, 'AthenaWorkGroup', {
  role: customResourceRole,
  resourceType: 'Custom::AthenaWorkGroup',
  installLatestAwsSdk: true,
  onCreate: {
    service: 'Athena',
    action: 'createWorkGroup',
    physicalResourceId: PhysicalResourceId.of(workgroupName),
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
const notebook = new AwsCustomResource(stack, 'AthenaNotebook', {
  role: customResourceRole,
  resourceType: 'Custom::AthenaNotebook',
  installLatestAwsSdk: true,
  onCreate: {
    service: 'Athena',
    action: 'createNotebook',
    physicalResourceId: PhysicalResourceId.fromResponse('NotebookId'),
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
      NotebookId: new PhysicalResourceIdReference(),
    },
  },
  onDelete: {
    service: 'Athena',
    action: 'deleteNotebook',
    parameters: {
      NotebookId: new PhysicalResourceIdReference(),
    },
  },
  timeout: cdk.Duration.minutes(3),
});
notebook.node.addDependency(workgroup);

new IntegTest(app, 'CustomResourceAthena', {
  testCases: [stack],
});

app.synth();
