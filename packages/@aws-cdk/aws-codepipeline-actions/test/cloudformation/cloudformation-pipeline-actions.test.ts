import { Template, Match } from '@aws-cdk/assertions';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { TestFixture } from './test-fixture';
import * as cpactions from '../../lib';

/* eslint-disable quote-props */

describe('CloudFormation Pipeline Actions', () => {
  test('CreateChangeSetAction can be used to make a change set from a CodePipeline', () => {
    const stack = new cdk.Stack();

    const pipeline = new codepipeline.Pipeline(stack, 'MagicPipeline');

    const changeSetExecRole = new Role(stack, 'ChangeSetRole', {
      assumedBy: new ServicePrincipal('cloudformation.amazonaws.com'),
    });

    /** Source! */
    const repo = new codecommit.Repository(stack, 'MyVeryImportantRepo', {
      repositoryName: 'my-very-important-repo',
    });

    const sourceOutput = new codepipeline.Artifact('SourceArtifact');
    const source = new cpactions.CodeCommitSourceAction({
      actionName: 'source',
      output: sourceOutput,
      repository: repo,
      trigger: cpactions.CodeCommitTrigger.POLL,
    });
    pipeline.addStage({
      stageName: 'source',
      actions: [source],
    });

    /** Build! */

    const project = new codebuild.PipelineProject(stack, 'MyBuildProject');

    const buildOutput = new codepipeline.Artifact('OutputYo');
    const buildAction = new cpactions.CodeBuildAction({
      actionName: 'build',
      project,
      input: sourceOutput,
      outputs: [buildOutput],
    });
    pipeline.addStage({
      stageName: 'build',
      actions: [buildAction],
    });

    /** Deploy! */

    // To execute a change set - yes, you probably do need *:* 🤷‍♀️
    changeSetExecRole.addToPolicy(new PolicyStatement({ resources: ['*'], actions: ['*'] }));

    const stackName = 'BrelandsStack';
    const changeSetName = 'MyMagicalChangeSet';
    pipeline.addStage({
      stageName: 'prod',
      actions: [
        new cpactions.CloudFormationCreateReplaceChangeSetAction({
          actionName: 'BuildChangeSetProd',
          stackName,
          changeSetName,
          deploymentRole: changeSetExecRole,
          templatePath: new codepipeline.ArtifactPath(buildOutput, 'template.yaml'),
          templateConfiguration: new codepipeline.ArtifactPath(buildOutput, 'templateConfig.json'),
          adminPermissions: false,
        }),
        new cpactions.CloudFormationExecuteChangeSetAction({
          actionName: 'ExecuteChangeSetProd',
          stackName,
          changeSetName,
        }),
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'ArtifactStore': {
        'Location': {
          'Ref': 'MagicPipelineArtifactsBucket212FE7BF',
        },
        'Type': 'S3',
      },
      'RoleArn': {
        'Fn::GetAtt': ['MagicPipelineRoleFB2BD6DE',
          'Arn'],
      },
      'Stages': [{
        'Actions': [
          {
            'ActionTypeId': {
              'Category': 'Source',
              'Owner': 'AWS',
              'Provider': 'CodeCommit',
              'Version': '1',
            },
            'Configuration': {
              'RepositoryName': {
                'Fn::GetAtt': [
                  'MyVeryImportantRepo11BC3EBD',
                  'Name',
                ],
              },
              'BranchName': 'master',
              'PollForSourceChanges': true,
            },
            'Name': 'source',
            'OutputArtifacts': [
              {
                'Name': 'SourceArtifact',
              },
            ],
            'RunOrder': 1,
          },
        ],
        'Name': 'source',
      },
      {
        'Actions': [
          {
            'ActionTypeId': {
              'Category': 'Build',
              'Owner': 'AWS',
              'Provider': 'CodeBuild',
              'Version': '1',
            },
            'Configuration': {
              'ProjectName': {
                'Ref': 'MyBuildProject30DB9D6E',
              },
            },
            'InputArtifacts': [
              {
                'Name': 'SourceArtifact',
              },
            ],
            'Name': 'build',
            'OutputArtifacts': [
              {
                'Name': 'OutputYo',
              },
            ],
            'RunOrder': 1,
          },
        ],
        'Name': 'build',
      },
      {
        'Actions': [
          {
            'ActionTypeId': {
              'Category': 'Deploy',
              'Owner': 'AWS',
              'Provider': 'CloudFormation',
              'Version': '1',
            },
            'Configuration': {
              'ActionMode': 'CHANGE_SET_REPLACE',
              'ChangeSetName': 'MyMagicalChangeSet',
              'RoleArn': {
                'Fn::GetAtt': [
                  'ChangeSetRole0BCF99E6',
                  'Arn',
                ],
              },
              'StackName': 'BrelandsStack',
              'TemplatePath': 'OutputYo::template.yaml',
              'TemplateConfiguration': 'OutputYo::templateConfig.json',
            },
            'InputArtifacts': [{ 'Name': 'OutputYo' }],
            'Name': 'BuildChangeSetProd',
            'RunOrder': 1,
          },
          {
            'ActionTypeId': {
              'Category': 'Deploy',
              'Owner': 'AWS',
              'Provider': 'CloudFormation',
              'Version': '1',
            },
            'Configuration': {
              'ActionMode': 'CHANGE_SET_EXECUTE',
              'ChangeSetName': 'MyMagicalChangeSet',
            },
            'Name': 'ExecuteChangeSetProd',
            'RunOrder': 1,
          },
        ],
        'Name': 'prod',
      }],
    });


  });

  test('fullPermissions leads to admin role and full IAM capabilities with pipeline bucket+key read permissions', () => {
  // GIVEN
    const stack = new TestFixture();

    // WHEN
    stack.deployStage.addAction(new cpactions.CloudFormationCreateUpdateStackAction({
      actionName: 'CreateUpdate',
      stackName: 'MyStack',
      templatePath: stack.sourceOutput.atPath('template.yaml'),
      adminPermissions: true,
    }));

    const roleId = 'PipelineDeployCreateUpdateRole515CB7D4';

    // THEN: Action in Pipeline has named IAM capabilities
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        { 'Name': 'Source' /* don't care about the rest */ },
        {
          'Name': 'Deploy',
          'Actions': [
            {
              'Configuration': {
                'Capabilities': 'CAPABILITY_NAMED_IAM',
                'RoleArn': { 'Fn::GetAtt': [roleId, 'Arn'] },
                'ActionMode': 'CREATE_UPDATE',
                'StackName': 'MyStack',
                'TemplatePath': 'SourceArtifact::template.yaml',
              },
              'InputArtifacts': [{ 'Name': 'SourceArtifact' }],
              'Name': 'CreateUpdate',
            },
          ],
        },
      ],
    });

    // THEN: Role is created with full permissions
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            'Action': [
              's3:GetObject*',
              's3:GetBucket*',
              's3:List*',
            ],
            'Effect': 'Allow',
          },
          {
            'Action': [
              'kms:Decrypt',
              'kms:DescribeKey',
            ],
            'Effect': 'Allow',
          },
          {
            Action: '*',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
      Roles: [{ Ref: roleId }],
    });


  });

  test('outputFileName leads to creation of output artifact', () => {
  // GIVEN
    const stack = new TestFixture();

    // WHEN
    stack.deployStage.addAction(new cpactions.CloudFormationCreateUpdateStackAction({
      actionName: 'CreateUpdate',
      stackName: 'MyStack',
      templatePath: stack.sourceOutput.atPath('template.yaml'),
      outputFileName: 'CreateResponse.json',
      adminPermissions: false,
    }));

    // THEN: Action has output artifacts
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        { 'Name': 'Source' /* don't care about the rest */ },
        {
          'Name': 'Deploy',
          'Actions': [
            {
              'OutputArtifacts': [{ 'Name': 'CreateUpdate_MyStack_Artifact' }],
              'Name': 'CreateUpdate',
            },
          ],
        },
      ],
    });


  });

  test('replaceOnFailure switches action type', () => {
  // GIVEN
    const stack = new TestFixture();

    // WHEN
    stack.deployStage.addAction(new cpactions.CloudFormationCreateUpdateStackAction({
      actionName: 'CreateUpdate',
      stackName: 'MyStack',
      templatePath: stack.sourceOutput.atPath('template.yaml'),
      replaceOnFailure: true,
      adminPermissions: false,
    }));

    // THEN: Action has output artifacts
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        { 'Name': 'Source' /* don't care about the rest */ },
        {
          'Name': 'Deploy',
          'Actions': [
            {
              'Configuration': {
                'ActionMode': 'REPLACE_ON_FAILURE',
              },
              'Name': 'CreateUpdate',
            },
          ],
        },
      ],
    });


  });

  test('parameterOverrides are serialized as a string', () => {
  // GIVEN
    const stack = new TestFixture();

    // WHEN
    stack.deployStage.addAction(new cpactions.CloudFormationCreateUpdateStackAction({
      actionName: 'CreateUpdate',
      stackName: 'MyStack',
      templatePath: stack.sourceOutput.atPath('template.yaml'),
      adminPermissions: false,
      parameterOverrides: {
        RepoName: stack.repo.repositoryName,
      },
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        { 'Name': 'Source' /* don't care about the rest */ },
        {
          'Name': 'Deploy',
          'Actions': [
            {
              'Configuration': {
                'ParameterOverrides': {
                  'Fn::Join': ['', [
                    '{"RepoName":"',
                    { 'Fn::GetAtt': ['MyVeryImportantRepo11BC3EBD', 'Name'] },
                    '"}',
                  ]],
                },
              },
              'Name': 'CreateUpdate',
            },
          ],
        },
      ],
    });


  });

  test('Action service role is passed to template', () => {
    const stack = new TestFixture();

    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::000000000000:role/action-role');
    const freshRole = new Role(stack, 'FreshRole', {
      assumedBy: new ServicePrincipal('magicservice'),
    });

    stack.deployStage.addAction(new cpactions.CloudFormationExecuteChangeSetAction({
      actionName: 'ImportedRoleAction',
      role: importedRole,
      changeSetName: 'magicSet',
      stackName: 'magicStack',
    }));

    stack.deployStage.addAction(new cpactions.CloudFormationExecuteChangeSetAction({
      actionName: 'FreshRoleAction',
      role: freshRole,
      changeSetName: 'magicSet',
      stackName: 'magicStack',
    }));

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        {
          'Name': 'Source', /* don't care about the rest */
        },
        {
          'Name': 'Deploy',
          'Actions': [
            {
              'Name': 'ImportedRoleAction',
              'RoleArn': 'arn:aws:iam::000000000000:role/action-role',
            },
            {
              'Name': 'FreshRoleAction',
              'RoleArn': {
                'Fn::GetAtt': [
                  'FreshRole472F6E18',
                  'Arn',
                ],
              },
            },
          ],
        },
      ],
    });


  });

  test('Single capability is passed to template', () => {
  // GIVEN
    const stack = new TestFixture();

    // WHEN
    stack.deployStage.addAction(new cpactions.CloudFormationCreateUpdateStackAction({
      actionName: 'CreateUpdate',
      stackName: 'MyStack',
      templatePath: stack.sourceOutput.atPath('template.yaml'),
      adminPermissions: false,
      cfnCapabilities: [
        cdk.CfnCapabilities.NAMED_IAM,
      ],
    }));

    const roleId = 'PipelineDeployCreateUpdateRole515CB7D4';

    // THEN: Action in Pipeline has named IAM capabilities
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        { 'Name': 'Source' /* don't care about the rest */ },
        {
          'Name': 'Deploy',
          'Actions': [
            {
              'Configuration': {
                'Capabilities': 'CAPABILITY_NAMED_IAM',
                'RoleArn': { 'Fn::GetAtt': [roleId, 'Arn'] },
                'ActionMode': 'CREATE_UPDATE',
                'StackName': 'MyStack',
                'TemplatePath': 'SourceArtifact::template.yaml',
              },
              'InputArtifacts': [{ 'Name': 'SourceArtifact' }],
              'Name': 'CreateUpdate',
            },
          ],
        },
      ],
    });


  });

  test('Multiple capabilities are passed to template', () => {
  // GIVEN
    const stack = new TestFixture();

    // WHEN
    stack.deployStage.addAction(new cpactions.CloudFormationCreateUpdateStackAction({
      actionName: 'CreateUpdate',
      stackName: 'MyStack',
      templatePath: stack.sourceOutput.atPath('template.yaml'),
      adminPermissions: false,
      cfnCapabilities: [
        cdk.CfnCapabilities.NAMED_IAM,
        cdk.CfnCapabilities.AUTO_EXPAND,
      ],
    }));

    const roleId = 'PipelineDeployCreateUpdateRole515CB7D4';

    // THEN: Action in Pipeline has named IAM and AUTOEXPAND capabilities
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        { 'Name': 'Source' /* don't care about the rest */ },
        {
          'Name': 'Deploy',
          'Actions': [
            {
              'Configuration': {
                'Capabilities': 'CAPABILITY_NAMED_IAM,CAPABILITY_AUTO_EXPAND',
                'RoleArn': { 'Fn::GetAtt': [roleId, 'Arn'] },
                'ActionMode': 'CREATE_UPDATE',
                'StackName': 'MyStack',
                'TemplatePath': 'SourceArtifact::template.yaml',
              },
              'InputArtifacts': [{ 'Name': 'SourceArtifact' }],
              'Name': 'CreateUpdate',
            },
          ],
        },
      ],
    });


  });

  test('Empty capabilities is not passed to template', () => {
  // GIVEN
    const stack = new TestFixture();

    // WHEN
    stack.deployStage.addAction(new cpactions.CloudFormationCreateUpdateStackAction({
      actionName: 'CreateUpdate',
      stackName: 'MyStack',
      templatePath: stack.sourceOutput.atPath('template.yaml'),
      adminPermissions: false,
      cfnCapabilities: [
        cdk.CfnCapabilities.NONE,
      ],
    }));

    const roleId = 'PipelineDeployCreateUpdateRole515CB7D4';

    // THEN: Action in Pipeline has no capabilities
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        { 'Name': 'Source' /* don't care about the rest */ },
        {
          'Name': 'Deploy',
          'Actions': [
            {
              'Configuration': {
                'RoleArn': { 'Fn::GetAtt': [roleId, 'Arn'] },
                'ActionMode': 'CREATE_UPDATE',
                'StackName': 'MyStack',
                'TemplatePath': 'SourceArtifact::template.yaml',
              },
              'InputArtifacts': [{ 'Name': 'SourceArtifact' }],
              'Name': 'CreateUpdate',
            },
          ],
        },
      ],
    });


  });

  test('can use CfnCapabilities from the core module', () => {
    // GIVEN
    const stack = new TestFixture();

    // WHEN
    stack.deployStage.addAction(new cpactions.CloudFormationCreateUpdateStackAction({
      actionName: 'CreateUpdate',
      stackName: 'MyStack',
      templatePath: stack.sourceOutput.atPath('template.yaml'),
      adminPermissions: false,
      cfnCapabilities: [
        cdk.CfnCapabilities.NAMED_IAM,
        cdk.CfnCapabilities.AUTO_EXPAND,
      ],
    }));

    // THEN: Action in Pipeline has named IAM and AUTOEXPAND capabilities
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        { 'Name': 'Source' /* don't care about the rest */ },
        {
          'Name': 'Deploy',
          'Actions': [
            {
              'Configuration': {
                'Capabilities': 'CAPABILITY_NAMED_IAM,CAPABILITY_AUTO_EXPAND',
                'RoleArn': { 'Fn::GetAtt': ['PipelineDeployCreateUpdateRole515CB7D4', 'Arn'] },
                'ActionMode': 'CREATE_UPDATE',
                'StackName': 'MyStack',
                'TemplatePath': 'SourceArtifact::template.yaml',
              },
              'InputArtifacts': [{ 'Name': 'SourceArtifact' }],
              'Name': 'CreateUpdate',
            },
          ],
        },
      ],
    });


  });

  describe('cross-account CFN Pipeline', () => {
    test('correctly creates the deployment Role in the other account', () => {
      const app = new cdk.App();

      const pipelineStack = new cdk.Stack(app, 'PipelineStack', {
        env: {
          account: '234567890123',
          region: 'us-west-2',
        },
      });

      const sourceOutput = new codepipeline.Artifact();
      new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [
              new cpactions.CodeCommitSourceAction({
                actionName: 'CodeCommit',
                repository: codecommit.Repository.fromRepositoryName(pipelineStack, 'Repo', 'RepoName'),
                output: sourceOutput,
              }),
            ],
          },
          {
            stageName: 'Deploy',
            actions: [
              new cpactions.CloudFormationCreateUpdateStackAction({
                actionName: 'CFN',
                stackName: 'MyStack',
                adminPermissions: true,
                templatePath: sourceOutput.atPath('template.yaml'),
                account: '123456789012',
              }),
            ],
          },
        ],
      });

      Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        'Stages': [
          {
            'Name': 'Source',
          },
          {
            'Name': 'Deploy',
            'Actions': [
              {
                'Name': 'CFN',
                'RoleArn': {
                  'Fn::Join': ['', ['arn:', { 'Ref': 'AWS::Partition' },
                    ':iam::123456789012:role/pipelinestack-support-123loycfnactionrole56af64af3590f311bc50']],
                },
                'Configuration': {
                  'RoleArn': {
                    'Fn::Join': ['', ['arn:', { 'Ref': 'AWS::Partition' },
                      ':iam::123456789012:role/pipelinestack-support-123fndeploymentrole4668d9b5a30ce3dc4508']],
                  },
                },
              },
            ],
          },
        ],
      });

      // the pipeline's BucketPolicy should trust both CFN roles
      Template.fromStack(pipelineStack).hasResourceProperties('AWS::S3::BucketPolicy', {
        'PolicyDocument': Match.objectLike({
          'Statement': [
            {
              'Action': 's3:*',
              'Condition': {
                'Bool': { 'aws:SecureTransport': 'false' },
              },
              'Effect': 'Deny',
              'Principal': {
                'AWS': '*',
              },
              'Resource': Match.anyValue(),
            },
            {
              'Action': [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
              ],
              'Effect': 'Allow',
              'Principal': {
                'AWS': {
                  'Fn::Join': ['', ['arn:', { 'Ref': 'AWS::Partition' },
                    ':iam::123456789012:role/pipelinestack-support-123fndeploymentrole4668d9b5a30ce3dc4508']],
                },
              },
              'Resource': Match.anyValue(),
            },
            {
              'Action': [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
              ],
              'Effect': 'Allow',
              'Principal': {
                'AWS': {
                  'Fn::Join': ['', ['arn:', { 'Ref': 'AWS::Partition' },
                    ':iam::123456789012:role/pipelinestack-support-123loycfnactionrole56af64af3590f311bc50']],
                },
              },
              'Resource': Match.anyValue(),
            },
          ],
        }),
      });

      const otherStack = app.node.findChild('cross-account-support-stack-123456789012') as cdk.Stack;
      Template.fromStack(otherStack).hasResourceProperties('AWS::IAM::Role', {
        'RoleName': 'pipelinestack-support-123loycfnactionrole56af64af3590f311bc50',
      });
      Template.fromStack(otherStack).hasResourceProperties('AWS::IAM::Role', {
        'RoleName': 'pipelinestack-support-123fndeploymentrole4668d9b5a30ce3dc4508',
      });


    });
  });
});
