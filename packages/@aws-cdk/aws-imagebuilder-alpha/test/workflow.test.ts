import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {
  Workflow,
  WorkflowAction,
  WorkflowData,
  WorkflowOnFailure,
  WorkflowParameterType,
  WorkflowSchemaVersion,
  WorkflowType,
} from '../lib';

describe('Workflow', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('imported by arn', () => {
    const workflow = Workflow.fromWorkflowArn(
      stack,
      'Workflow',
      'arn:aws:imagebuilder:us-east-1:123456789012:workflow/build/imported-workflow/1.2.3',
    );

    expect(workflow.workflowArn).toEqual(
      'arn:aws:imagebuilder:us-east-1:123456789012:workflow/build/imported-workflow/1.2.3',
    );
    expect(workflow.workflowName).toEqual('imported-workflow');
    expect(workflow.workflowType).toEqual('BUILD');
    expect(workflow.workflowVersion).toEqual('1.2.3');

    expect(stack.resolve(workflow.workflowLatestVersion.workflowArn)).toEqual(
      'arn:aws:imagebuilder:us-east-1:123456789012:workflow/build/imported-workflow/x.x.x',
    );
    expect(stack.resolve(workflow.workflowLatestVersion.workflowName)).toEqual('imported-workflow');
    expect(stack.resolve(workflow.workflowLatestVersion.workflowVersion)).toEqual('x.x.x');
    expect(stack.resolve(workflow.workflowLatestMajorVersion.workflowArn)).toEqual(
      'arn:aws:imagebuilder:us-east-1:123456789012:workflow/build/imported-workflow/1.x.x',
    );
    expect(stack.resolve(workflow.workflowLatestMajorVersion.workflowName)).toEqual('imported-workflow');
    expect(stack.resolve(workflow.workflowLatestMajorVersion.workflowVersion)).toEqual('1.x.x');
    expect(stack.resolve(workflow.workflowLatestMinorVersion.workflowArn)).toEqual(
      'arn:aws:imagebuilder:us-east-1:123456789012:workflow/build/imported-workflow/1.2.x',
    );
    expect(stack.resolve(workflow.workflowLatestMinorVersion.workflowName)).toEqual('imported-workflow');
    expect(stack.resolve(workflow.workflowLatestMinorVersion.workflowVersion)).toEqual('1.2.x');
    expect(stack.resolve(workflow.workflowLatestPatchVersion.workflowArn)).toEqual(
      'arn:aws:imagebuilder:us-east-1:123456789012:workflow/build/imported-workflow/1.2.3',
    );
    expect(stack.resolve(workflow.workflowLatestPatchVersion.workflowName)).toEqual('imported-workflow');
    expect(stack.resolve(workflow.workflowLatestPatchVersion.workflowVersion)).toEqual('1.2.3');
  });

  test('imported by attributes', () => {
    const workflow = Workflow.fromWorkflowAttributes(stack, 'Workflow', {
      workflowName: 'imported-workflow-by-attributes',
      workflowType: WorkflowType.BUILD,
      workflowVersion: '1.2.3',
    });

    expect(stack.resolve(workflow.workflowArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:workflow/build/imported-workflow-by-attributes/1.2.3',
        ],
      ],
    });
    expect(workflow.workflowName).toEqual('imported-workflow-by-attributes');
    expect(workflow.workflowType).toEqual('BUILD');
    expect(workflow.workflowVersion).toEqual('1.2.3');
  });

  test('imported by attributes with name as an unresolved token', () => {
    const workflow = Workflow.fromWorkflowAttributes(stack, 'Workflow', {
      workflowName: `test-workflow-${stack.partition}`,
      workflowType: WorkflowType.TEST,
    });

    expect(stack.resolve(workflow.workflowArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':imagebuilder:us-east-1:123456789012:workflow/test/test-workflow-',
          { Ref: 'AWS::Partition' },
          '/x.x.x',
        ],
      ],
    });
    expect(stack.resolve(workflow.workflowName)).toEqual({
      'Fn::Join': ['', ['test-workflow-', { Ref: 'AWS::Partition' }]],
    });
    expect(workflow.workflowType).toEqual('TEST');
    expect(workflow.workflowVersion).toEqual('x.x.x');
  });

  test('with all parameters', () => {
    const workflow = new Workflow(stack, 'Workflow', {
      workflowName: 'build-workflow',
      workflowVersion: '1.0.0',
      workflowType: WorkflowType.BUILD,
      description: 'This is a build workflow',
      changeDescription: 'This is a change description',
      kmsKey: kms.Key.fromKeyArn(
        stack,
        'WorkflowKey',
        stack.formatArn({ service: 'kms', resource: 'key', resourceName: '1234abcd-12ab-34cd-56ef-1234567890ab' }),
      ),
      tags: { Environment: 'test', Project: 'imagebuilder' },
      data: WorkflowData.fromJsonObject({
        name: 'build-image',
        description: 'Workflow to build an AMI',
        schemaVersion: WorkflowSchemaVersion.V1_0,
        parameters: [
          {
            name: 'snsTopicArn',
            description: 'SNS topic to publish waiting event to',
            type: WorkflowParameterType.STRING,
            default: 'none',
          },
        ],
        steps: [
          {
            name: 'LaunchBuildInstance',
            action: WorkflowAction.LAUNCH_INSTANCE,
            onFailure: WorkflowOnFailure.ABORT,
            inputs: {
              waitFor: 'ssmAgent',
            },
          },
          {
            name: 'ApplyBuildComponents',
            action: WorkflowAction.EXECUTE_COMPONENTS,
            onFailure: WorkflowOnFailure.ABORT,
            inputs: {
              'instanceId.$': '$.stepOutputs.LaunchBuildInstance.instanceId',
            },
          },
          {
            name: 'InventoryCollection',
            action: WorkflowAction.COLLECT_IMAGE_METADATA,
            onFailure: WorkflowOnFailure.ABORT,
            if: {
              and: [
                {
                  stringEquals: 'AMI',
                  value: '$.imagebuilder.imageType',
                },
                {
                  booleanEquals: true,
                  value: '$.imagebuilder.collectImageMetadata',
                },
              ],
            },
            inputs: {
              'instanceId.$': '$.stepOutputs.LaunchBuildInstance.instanceId',
            },
          },
          {
            name: 'RunSanitizeScript',
            action: WorkflowAction.SANITIZE_INSTANCE,
            onFailure: WorkflowOnFailure.ABORT,
            if: {
              and: [
                {
                  stringEquals: 'AMI',
                  value: '$.imagebuilder.imageType',
                },
                {
                  not: {
                    stringEquals: 'Windows',
                    value: '$.imagebuilder.platform',
                  },
                },
              ],
            },
            inputs: {
              'instanceId.$': '$.stepOutputs.LaunchBuildInstance.instanceId',
            },
          },
          {
            name: 'RunSysPrepScript',
            action: WorkflowAction.RUN_SYS_PREP,
            onFailure: WorkflowOnFailure.ABORT,
            if: {
              and: [
                {
                  stringEquals: 'AMI',
                  value: '$.imagebuilder.imageType',
                },
                {
                  stringEquals: 'Windows',
                  value: '$.imagebuilder.platform',
                },
              ],
            },
            inputs: {
              'instanceId.$': '$.stepOutputs.LaunchBuildInstance.instanceId',
            },
          },
          {
            name: 'CreateOutputAMI',
            action: WorkflowAction.CREATE_IMAGE,
            onFailure: WorkflowOnFailure.ABORT,
            if: {
              stringEquals: 'AMI',
              value: '$.imagebuilder.imageType',
            },
            inputs: {
              'instanceId.$': '$.stepOutputs.LaunchBuildInstance.instanceId',
            },
          },
          {
            name: 'WaitForApproval',
            action: WorkflowAction.WAIT_FOR_ACTION,
            onFailure: WorkflowOnFailure.ABORT,
            inputs: {
              'snsTopicArn.$': '$.parameters.snsTopicArn',
            },
          },
          {
            name: 'TerminateBuildInstance',
            action: WorkflowAction.TERMINATE_INSTANCE,
            onFailure: WorkflowOnFailure.CONTINUE,
            inputs: {
              'instanceId.$': '$.stepOutputs.LaunchBuildInstance.instanceId',
            },
          },
        ],
        outputs: [
          {
            name: 'ImageId',
            value: '$.stepOutputs.CreateOutputAMI.imageId',
          },
        ],
      }),
    });

    expect(Workflow.isWorkflow(workflow as unknown)).toBeTruthy();
    expect(Workflow.isWorkflow('Workflow')).toBeFalsy();

    expect(stack.resolve(workflow.workflowLatestVersion.workflowArn)).toEqual({
      'Fn::GetAtt': ['Workflow193EF7C1', 'LatestVersion.Arn'],
    });
    expect(stack.resolve(workflow.workflowLatestMajorVersion.workflowArn)).toEqual({
      'Fn::GetAtt': ['Workflow193EF7C1', 'LatestVersion.Major'],
    });
    expect(stack.resolve(workflow.workflowLatestMinorVersion.workflowArn)).toEqual({
      'Fn::GetAtt': ['Workflow193EF7C1', 'LatestVersion.Minor'],
    });
    expect(stack.resolve(workflow.workflowLatestPatchVersion.workflowArn)).toEqual({
      'Fn::GetAtt': ['Workflow193EF7C1', 'LatestVersion.Patch'],
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        Workflow193EF7C1: Match.objectEquals({
          Type: 'AWS::ImageBuilder::Workflow',
          Properties: {
            Name: 'build-workflow',
            Version: '1.0.0',
            Type: 'BUILD',
            Description: 'This is a build workflow',
            ChangeDescription: 'This is a change description',
            KmsKeyId: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':kms:us-east-1:123456789012:key/1234abcd-12ab-34cd-56ef-1234567890ab',
                ],
              ],
            },
            Tags: {
              Environment: 'test',
              Project: 'imagebuilder',
            },
            Data: `name: build-image
description: Workflow to build an AMI
schemaVersion: "1.0"
parameters:
  - name: snsTopicArn
    description: SNS topic to publish waiting event to
    type: string
    default: none
steps:
  - name: LaunchBuildInstance
    action: LaunchInstance
    onFailure: Abort
    inputs:
      waitFor: ssmAgent
  - name: ApplyBuildComponents
    action: ExecuteComponents
    onFailure: Abort
    inputs:
      instanceId.$: $.stepOutputs.LaunchBuildInstance.instanceId
  - name: InventoryCollection
    action: CollectImageMetadata
    onFailure: Abort
    if:
      and:
        - stringEquals: AMI
          value: $.imagebuilder.imageType
        - booleanEquals: true
          value: $.imagebuilder.collectImageMetadata
    inputs:
      instanceId.$: $.stepOutputs.LaunchBuildInstance.instanceId
  - name: RunSanitizeScript
    action: SanitizeInstance
    onFailure: Abort
    if:
      and:
        - stringEquals: AMI
          value: $.imagebuilder.imageType
        - not:
            stringEquals: Windows
            value: $.imagebuilder.platform
    inputs:
      instanceId.$: $.stepOutputs.LaunchBuildInstance.instanceId
  - name: RunSysPrepScript
    action: RunSysPrep
    onFailure: Abort
    if:
      and:
        - stringEquals: AMI
          value: $.imagebuilder.imageType
        - stringEquals: Windows
          value: $.imagebuilder.platform
    inputs:
      instanceId.$: $.stepOutputs.LaunchBuildInstance.instanceId
  - name: CreateOutputAMI
    action: CreateImage
    onFailure: Abort
    if:
      stringEquals: AMI
      value: $.imagebuilder.imageType
    inputs:
      instanceId.$: $.stepOutputs.LaunchBuildInstance.instanceId
  - name: WaitForApproval
    action: WaitForAction
    onFailure: Abort
    inputs:
      snsTopicArn.$: $.parameters.snsTopicArn
  - name: TerminateBuildInstance
    action: TerminateInstance
    onFailure: Continue
    inputs:
      instanceId.$: $.stepOutputs.LaunchBuildInstance.instanceId
outputs:
  - name: ImageId
    value: $.stepOutputs.CreateOutputAMI.imageId
`,
          },
        }),
      },
    });
  });

  test('with required parameters', () => {
    new Workflow(stack, 'Workflow', {
      workflowType: WorkflowType.TEST,
      data: WorkflowData.fromJsonObject({
        name: 'test-workflow',
        schemaVersion: WorkflowSchemaVersion.V1_0,
        steps: [
          {
            name: 'launch-instance',
            action: WorkflowAction.LAUNCH_INSTANCE,
          },
          {
            name: 'run-command',
            action: WorkflowAction.RUN_COMMAND,
            inputs: {
              commands: ['echo "Running tests"'],
            },
          },
          {
            name: 'terminate-instance',
            action: WorkflowAction.TERMINATE_INSTANCE,
          },
        ],
      }),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        Workflow193EF7C1: Match.objectEquals({
          Type: 'AWS::ImageBuilder::Workflow',
          Properties: {
            Name: 'stack-workflow-83655b4d',
            Version: '1.0.0',
            Type: 'TEST',
            Data: `name: test-workflow
schemaVersion: "1.0"
steps:
  - name: launch-instance
    action: LaunchInstance
  - name: run-command
    action: RunCommand
    inputs:
      commands:
        - echo "Running tests"
  - name: terminate-instance
    action: TerminateInstance
`,
          },
        }),
      },
    });
  });

  test('with workflow data as a file asset', () => {
    new Workflow(stack, 'Workflow', {
      workflowType: WorkflowType.DISTRIBUTION,
      data: WorkflowData.fromAsset(stack, 'WorkflowData', path.join(__dirname, 'assets', 'workflow-data.yaml')),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        Workflow193EF7C1: Match.objectEquals({
          Type: 'AWS::ImageBuilder::Workflow',
          Properties: {
            Name: 'stack-workflow-83655b4d',
            Version: '1.0.0',
            Type: 'DISTRIBUTION',
            Uri: 's3://cdk-hnb659fds-assets-123456789012-us-east-1/6c2589532cc1551b2029f968e301fcbfc599120cb34cc72f8d59321b025ef594.yaml',
          },
        }),
      },
    });
  });

  test('with workflow data as an S3 location', () => {
    const bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'workflow-bucket-123456789012-us-east-1');
    new Workflow(stack, 'Workflow', {
      workflowType: WorkflowType.BUILD,
      data: WorkflowData.fromS3(bucket, 'workflows/workflow.yaml'),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        Workflow193EF7C1: {
          Type: 'AWS::ImageBuilder::Workflow',
          Properties: {
            Name: 'stack-workflow-83655b4d',
            Version: '1.0.0',
            Type: 'BUILD',
            Uri: 's3://workflow-bucket-123456789012-us-east-1/workflows/workflow.yaml',
          },
        },
      },
    });
  });

  test('with workflow data as an inline string', () => {
    new Workflow(stack, 'Workflow', {
      workflowType: WorkflowType.TEST,
      data: WorkflowData.fromInline(`name: test-workflow
schemaVersion: "1.0"
steps:
  - name: launch-instance
    action: LaunchInstance
  - name: terminate-instance
    action: TerminateInstance
`),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        Workflow193EF7C1: Match.objectEquals({
          Type: 'AWS::ImageBuilder::Workflow',
          Properties: {
            Name: 'stack-workflow-83655b4d',
            Version: '1.0.0',
            Type: 'TEST',
            Data: `name: test-workflow
schemaVersion: "1.0"
steps:
  - name: launch-instance
    action: LaunchInstance
  - name: terminate-instance
    action: TerminateInstance
`,
          },
        }),
      },
    });
  });

  test('grants read access to IAM roles', () => {
    const workflow = new Workflow(stack, 'Workflow', {
      workflowType: WorkflowType.BUILD,
      data: WorkflowData.fromJsonObject({
        name: 'test-workflow',
        schemaVersion: WorkflowSchemaVersion.V1_0,
        steps: [
          {
            name: 'launch-instance',
            action: WorkflowAction.LAUNCH_INSTANCE,
          },
        ],
      }),
    });

    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    workflow.grantRead(role);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::Workflow', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(3);

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::123456789012:root']],
              },
            },
          },
        ],
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: 'imagebuilder:GetWorkflow',
            Resource: {
              'Fn::GetAtt': ['Workflow193EF7C1', 'Arn'],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('grants permissions to IAM roles', () => {
    const workflow = new Workflow(stack, 'Workflow', {
      workflowType: WorkflowType.BUILD,
      data: WorkflowData.fromJsonObject({
        name: 'test-workflow',
        schemaVersion: WorkflowSchemaVersion.V1_0,
        steps: [
          {
            name: 'launch-instance',
            action: WorkflowAction.LAUNCH_INSTANCE,
          },
        ],
      }),
    });

    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });

    workflow.grant(role, 'imagebuilder:DeleteWorkflow', 'imagebuilder:GetWorkflow');

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::Workflow', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(3);

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::123456789012:root']],
              },
            },
          },
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: ['imagebuilder:DeleteWorkflow', 'imagebuilder:GetWorkflow'],
            Resource: {
              'Fn::GetAtt': ['Workflow193EF7C1', 'Arn'],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('grants S3 put permissions on S3 asset to IAM roles', () => {
    const bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'workflow-bucket-123456789012-us-east-1');
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });
    const workflowData = WorkflowData.fromS3(bucket, 'workflows/workflow.yaml');
    new Workflow(stack, 'Workflow', {
      workflowType: WorkflowType.BUILD,
      data: workflowData,
    });

    workflowData.grantPut(role);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::Workflow', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(3);

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::123456789012:root']],
              },
            },
          },
        ],
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: Match.arrayWith(['s3:PutObject']),
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':s3:::workflow-bucket-123456789012-us-east-1/workflows/workflow.yaml',
                ],
              ],
            },
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('grants S3 read permissions on S3 asset to IAM roles', () => {
    const bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'workflow-bucket-123456789012-us-east-1');
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountPrincipal('123456789012') });
    const workflowData = WorkflowData.fromS3(bucket, 'workflows/workflow.yaml');
    new Workflow(stack, 'Workflow', {
      workflowType: WorkflowType.BUILD,
      data: workflowData,
    });

    workflowData.grantRead(role);

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Policy', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::ImageBuilder::Workflow', 1);
    expect(Object.keys(template.toJSON().Resources)).toHaveLength(3);

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::123456789012:root']],
              },
            },
          },
        ],
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Action: Match.arrayWith(['s3:GetObject*']),
            Resource: [
              {
                'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::workflow-bucket-123456789012-us-east-1']],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':s3:::workflow-bucket-123456789012-us-east-1/workflows/workflow.yaml',
                  ],
                ],
              },
            ],
          },
        ],
      },
      Roles: [Match.anyValue()],
    });
  });

  test('throws a validation error when the resource name is too long', () => {
    expect(
      () =>
        new Workflow(stack, 'Workflow', {
          workflowName: 'a'.repeat(129),
          workflowType: WorkflowType.BUILD,
          data: WorkflowData.fromJsonObject({
            schemaVersion: WorkflowSchemaVersion.V1_0,
            steps: [
              {
                name: 'launch-instance',
                action: WorkflowAction.LAUNCH_INSTANCE,
              },
            ],
          }),
        }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains spaces', () => {
    expect(
      () =>
        new Workflow(stack, 'Workflow', {
          workflowName: 'workflow with spaces',
          workflowType: WorkflowType.BUILD,
          data: WorkflowData.fromJsonObject({
            schemaVersion: WorkflowSchemaVersion.V1_0,
            steps: [
              {
                name: 'launch-instance',
                action: WorkflowAction.LAUNCH_INSTANCE,
              },
            ],
          }),
        }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains underscores', () => {
    expect(
      () =>
        new Workflow(stack, 'Workflow', {
          workflowName: 'workflow_with_underscores',
          workflowType: WorkflowType.BUILD,
          data: WorkflowData.fromJsonObject({
            schemaVersion: WorkflowSchemaVersion.V1_0,
            steps: [
              {
                name: 'launch-instance',
                action: WorkflowAction.LAUNCH_INSTANCE,
              },
            ],
          }),
        }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when the resource name contains uppercase characters', () => {
    expect(
      () =>
        new Workflow(stack, 'Workflow', {
          workflowName: 'WorkflowWithUppercase',
          workflowType: WorkflowType.BUILD,
          data: WorkflowData.fromJsonObject({
            schemaVersion: WorkflowSchemaVersion.V1_0,
            steps: [
              {
                name: 'launch-instance',
                action: WorkflowAction.LAUNCH_INSTANCE,
              },
            ],
          }),
        }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when neither a workflowName/workflowType or workflowArn are provided when importing by attributes', () => {
    expect(() => Workflow.fromWorkflowAttributes(stack, 'Workflow', {})).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when workflow type within a workflowArn is an unresolved token when importing by attributes', () => {
    expect(() =>
      Workflow.fromWorkflowAttributes(stack, 'Workflow', {
        workflowArn: `arn:aws:imagebuilder:us-east-1:123456789012:workflow/${cdk.Token.asString({ Ref: 'WorkflowType' })}/imported-workflow/x.x.x`,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when workflowType is an unresolved token when importing by attributes', () => {
    expect(() =>
      Workflow.fromWorkflowAttributes(stack, 'Workflow', {
        workflowName: 'imported-workflow',
        workflowType: cdk.Token.asString({ Ref: 'WorkflowType' }) as unknown as WorkflowType,
      }),
    ).toThrow(cdk.ValidationError);
  });

  test('throws a validation error when imported by arn as an unresolved token', () => {
    expect(() =>
      Workflow.fromWorkflowArn(
        stack,
        'Workflow',
        `arn:aws:imagebuilder:us-east-1:123456789012:workflow/build/imported-workflow-${stack.partition}/1.2.3`,
      ),
    ).toThrow(cdk.ValidationError);
  });

  test('throws an error when importing an invalid workflow ARN', () => {
    expect(() =>
      Workflow.fromWorkflowArn(
        stack,
        'Workflow',
        'arn:aws:imagebuilder:us-east-1:123456789012:workflow/build/imported-workflow',
      ),
    ).toThrow(cdk.ValidationError);
  });
});
