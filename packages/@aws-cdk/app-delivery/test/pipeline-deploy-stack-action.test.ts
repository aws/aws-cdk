import { Match, Matcher, Template } from '@aws-cdk/assertions';
import * as cfn from '@aws-cdk/aws-cloudformation';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as cpactions from '@aws-cdk/aws-codepipeline-actions';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { describeDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import * as fc from 'fast-check';
import { PipelineDeployStackAction } from '../lib/pipeline-deploy-stack-action';

interface SelfUpdatingPipeline {
  synthesizedApp: codepipeline.Artifact;
  pipeline: codepipeline.Pipeline;
}
const accountId = fc.array(fc.integer(0, 9), 12, 12).map(arr => arr.join());

describeDeprecated('pipeline deploy stack action', () => {
  test('rejects cross-environment deployment', () => {
    fc.assert(
      fc.property(
        accountId, accountId,
        (pipelineAccount, stackAccount) => {
          fc.pre(pipelineAccount !== stackAccount);
          expect(() => {
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'Test', { env: { account: pipelineAccount } });
            const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
            const fakeAction = new FakeAction('Fake');
            pipeline.addStage({
              stageName: 'FakeStage',
              actions: [fakeAction],
            });

            const deployStage = pipeline.addStage({ stageName: 'DeployStage' });
            deployStage.addAction(new PipelineDeployStackAction({
              changeSetName: 'ChangeSet',
              input: fakeAction.outputArtifact,
              stack: new cdk.Stack(app, 'DeployedStack', { env: { account: stackAccount } }),
              adminPermissions: false,
            }));
          }).toThrow('Cross-environment deployment is not supported');
        },
      ),
    );

  });

  test('rejects createRunOrder >= executeRunOrder', () => {
    fc.assert(
      fc.property(
        fc.integer(1, 999), fc.integer(1, 999),
        (createRunOrder, executeRunOrder) => {
          fc.pre(createRunOrder >= executeRunOrder);
          expect(() => {
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'Test');
            const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
            const fakeAction = new FakeAction('Fake');
            pipeline.addStage({
              stageName: 'FakeStage',
              actions: [fakeAction],
            });
            const deployStage = pipeline.addStage({ stageName: 'DeployStage' });
            deployStage.addAction(new PipelineDeployStackAction({
              changeSetName: 'ChangeSet',
              createChangeSetRunOrder: createRunOrder,
              executeChangeSetRunOrder: executeRunOrder,
              input: fakeAction.outputArtifact,
              stack: new cdk.Stack(app, 'DeployedStack'),
              adminPermissions: false,
            }));
          }).toThrow(/createChangeSetRunOrder .* must be < executeChangeSetRunOrder/);
        },
      ),
    );

  });
  test('users can supply CloudFormation capabilities', () => {
    const pipelineStack = getTestStack();
    const stackWithNoCapability = new cdk.Stack(undefined, 'NoCapStack',
      { env: { account: '123456789012', region: 'us-east-1' } });

    const stackWithAnonymousCapability = new cdk.Stack(undefined, 'AnonymousIAM',
      { env: { account: '123456789012', region: 'us-east-1' } });

    const stackWithAutoExpandCapability = new cdk.Stack(undefined, 'AutoExpand',
      { env: { account: '123456789012', region: 'us-east-1' } });

    const stackWithAnonymousAndAutoExpandCapability = new cdk.Stack(undefined, 'AnonymousIAMAndAutoExpand',
      { env: { account: '123456789012', region: 'us-east-1' } });

    const selfUpdatingStack = createSelfUpdatingStack(pipelineStack);

    const pipeline = selfUpdatingStack.pipeline;

    const selfUpdateStage1 = pipeline.addStage({ stageName: 'SelfUpdate1' });
    const selfUpdateStage2 = pipeline.addStage({ stageName: 'SelfUpdate2' });
    const selfUpdateStage3 = pipeline.addStage({ stageName: 'SelfUpdate3' });
    const selfUpdateStage4 = pipeline.addStage({ stageName: 'SelfUpdate4' });
    const selfUpdateStage5 = pipeline.addStage({ stageName: 'SelfUpdate5' });

    selfUpdateStage1.addAction(new PipelineDeployStackAction({
      stack: pipelineStack,
      input: selfUpdatingStack.synthesizedApp,
      capabilities: [cfn.CloudFormationCapabilities.NAMED_IAM],
      adminPermissions: false,
    }));
    selfUpdateStage2.addAction(new PipelineDeployStackAction({
      stack: stackWithNoCapability,
      input: selfUpdatingStack.synthesizedApp,
      capabilities: [cfn.CloudFormationCapabilities.NONE],
      adminPermissions: false,
    }));
    selfUpdateStage3.addAction(new PipelineDeployStackAction({
      stack: stackWithAnonymousCapability,
      input: selfUpdatingStack.synthesizedApp,
      capabilities: [cfn.CloudFormationCapabilities.ANONYMOUS_IAM],
      adminPermissions: false,
    }));
    selfUpdateStage4.addAction(new PipelineDeployStackAction({
      stack: stackWithAutoExpandCapability,
      input: selfUpdatingStack.synthesizedApp,
      capabilities: [cfn.CloudFormationCapabilities.AUTO_EXPAND],
      adminPermissions: false,
    }));
    selfUpdateStage5.addAction(new PipelineDeployStackAction({
      stack: stackWithAnonymousAndAutoExpandCapability,
      input: selfUpdatingStack.synthesizedApp,
      capabilities: [cfn.CloudFormationCapabilities.ANONYMOUS_IAM, cfn.CloudFormationCapabilities.AUTO_EXPAND],
      adminPermissions: false,
    }));

    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', hasPipelineActionConfiguration({
      StackName: 'TestStack',
      ActionMode: 'CHANGE_SET_REPLACE',
      Capabilities: 'CAPABILITY_NAMED_IAM',
    }));
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', hasPipelineActionConfiguration({
      StackName: 'AnonymousIAM',
      ActionMode: 'CHANGE_SET_REPLACE',
      Capabilities: 'CAPABILITY_IAM',
    }));
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', Match.not(hasPipelineActionConfiguration({
      StackName: 'NoCapStack',
      ActionMode: 'CHANGE_SET_REPLACE',
      Capabilities: 'CAPABILITY_NAMED_IAM',
    })));
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', Match.not(hasPipelineActionConfiguration({
      StackName: 'NoCapStack',
      ActionMode: 'CHANGE_SET_REPLACE',
      Capabilities: 'CAPABILITY_IAM',
    })));
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', hasPipelineActionConfiguration({
      StackName: 'NoCapStack',
      ActionMode: 'CHANGE_SET_REPLACE',
    }));
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', hasPipelineActionConfiguration({
      StackName: 'AutoExpand',
      ActionMode: 'CHANGE_SET_REPLACE',
      Capabilities: 'CAPABILITY_AUTO_EXPAND',
    }));
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', hasPipelineActionConfiguration({
      StackName: 'AnonymousIAMAndAutoExpand',
      ActionMode: 'CHANGE_SET_REPLACE',
      Capabilities: 'CAPABILITY_IAM,CAPABILITY_AUTO_EXPAND',
    }));
  });

  test('users can use admin permissions', () => {
    const pipelineStack = getTestStack();
    const selfUpdatingStack = createSelfUpdatingStack(pipelineStack);

    const pipeline = selfUpdatingStack.pipeline;
    const selfUpdateStage = pipeline.addStage({ stageName: 'SelfUpdate' });
    selfUpdateStage.addAction(new PipelineDeployStackAction({
      stack: pipelineStack,
      input: selfUpdatingStack.synthesizedApp,
      adminPermissions: true,
    }));
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: [
              's3:GetObject*',
              's3:GetBucket*',
              's3:List*',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'CodePipelineArtifactsBucketF1E925CF',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'CodePipelineArtifactsBucketF1E925CF',
                        'Arn',
                      ],
                    },
                    '/*',
                  ],
                ],
              },
            ],
          },
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'CodePipelineArtifactsBucketEncryptionKey85407CB4',
                'Arn',
              ],
            },
          },
          {
            Action: '*',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    });
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', hasPipelineActionConfiguration({
      StackName: 'TestStack',
      ActionMode: 'CHANGE_SET_REPLACE',
      Capabilities: 'CAPABILITY_NAMED_IAM,CAPABILITY_AUTO_EXPAND',
    }));
  });

  test('users can supply a role for deploy action', () => {
    const pipelineStack = getTestStack();
    const selfUpdatingStack = createSelfUpdatingStack(pipelineStack);

    const role = new iam.Role(pipelineStack, 'MyRole', {
      assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
    });
    const pipeline = selfUpdatingStack.pipeline;
    const selfUpdateStage = pipeline.addStage({ stageName: 'SelfUpdate' });
    const deployAction = new PipelineDeployStackAction({
      stack: pipelineStack,
      input: selfUpdatingStack.synthesizedApp,
      adminPermissions: false,
      role,
    });
    selfUpdateStage.addAction(deployAction);
    expect(deployAction.deploymentRole).toEqual(role);

  });
  test('users can specify IAM permissions for the deploy action', () => {
    // GIVEN //
    const pipelineStack = getTestStack();

    // the fake stack to deploy
    const emptyStack = getTestStack();

    const selfUpdatingStack = createSelfUpdatingStack(pipelineStack);
    const pipeline = selfUpdatingStack.pipeline;

    // WHEN //
    // this our app/service/infra to deploy
    const deployStage = pipeline.addStage({ stageName: 'Deploy' });
    const deployAction = new PipelineDeployStackAction({
      stack: emptyStack,
      input: selfUpdatingStack.synthesizedApp,
      adminPermissions: false,
    });
    deployStage.addAction(deployAction);
    // we might need to add permissions
    deployAction.addToDeploymentRolePolicy(new iam.PolicyStatement({
      actions: [
        'ec2:AuthorizeSecurityGroupEgress',
        'ec2:AuthorizeSecurityGroupIngress',
        'ec2:DeleteSecurityGroup',
        'ec2:DescribeSecurityGroups',
        'ec2:CreateSecurityGroup',
        'ec2:RevokeSecurityGroupEgress',
        'ec2:RevokeSecurityGroupIngress',
      ],
      resources: ['*'],
    }));

    // THEN //
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: [
              's3:GetObject*',
              's3:GetBucket*',
              's3:List*',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'CodePipelineArtifactsBucketF1E925CF',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'CodePipelineArtifactsBucketF1E925CF',
                        'Arn',
                      ],
                    },
                    '/*',
                  ],
                ],
              },
            ],
          },
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'CodePipelineArtifactsBucketEncryptionKey85407CB4',
                'Arn',
              ],
            },
          },
          {
            Action: [
              'ec2:AuthorizeSecurityGroupEgress',
              'ec2:AuthorizeSecurityGroupIngress',
              'ec2:DeleteSecurityGroup',
              'ec2:DescribeSecurityGroups',
              'ec2:CreateSecurityGroup',
              'ec2:RevokeSecurityGroupEgress',
              'ec2:RevokeSecurityGroupIngress',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
      Roles: [
        {
          Ref: 'CodePipelineDeployChangeSetRoleF9F2B343',
        },
      ],
    });

  });
  test('rejects stacks with assets', () => {
    fc.assert(
      fc.property(
        fc.integer(1, 5),
        (assetCount) => {
          const app = new cdk.App();

          const deployedStack = new cdk.Stack(app, 'DeployedStack');
          for (let i = 0; i < assetCount; i++) {
            deployedStack.node.addMetadata(cxschema.ArtifactMetadataEntryType.ASSET, {});
          }

          expect(() => {
            new PipelineDeployStackAction({
              changeSetName: 'ChangeSet',
              input: new codepipeline.Artifact(),
              stack: deployedStack,
              adminPermissions: false,
            });
          }).toThrow(/Cannot deploy the stack DeployedStack because it references/);
        },
      ),
    );
  });

  test('allows overriding the ChangeSet and Execute action names', () => {
    const stack = getTestStack();
    const selfUpdatingPipeline = createSelfUpdatingStack(stack);
    selfUpdatingPipeline.pipeline.addStage({
      stageName: 'Deploy',
      actions: [
        new PipelineDeployStackAction({
          input: selfUpdatingPipeline.synthesizedApp,
          adminPermissions: true,
          stack,
          createChangeSetActionName: 'Prepare',
          executeChangeSetActionName: 'Deploy',
        }),
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([
        Match.objectLike({
          Name: 'Deploy',
          Actions: Match.arrayWith([
            Match.objectLike({
              Name: 'Prepare',
            }),
            Match.objectLike({
              Name: 'Deploy',
            }),
          ]),
        }),
      ]),
    });
  });
});

class FakeAction implements codepipeline.IAction {
  public readonly actionProperties: codepipeline.ActionProperties;
  public readonly outputArtifact: codepipeline.Artifact;

  constructor(actionName: string) {
    this.actionProperties = {
      actionName,
      artifactBounds: { minInputs: 0, maxInputs: 5, minOutputs: 0, maxOutputs: 5 },
      category: codepipeline.ActionCategory.TEST,
      provider: 'Test',
    };
    this.outputArtifact = new codepipeline.Artifact('OutputArtifact');
  }

  public bind(_scope: constructs.Construct, _stage: codepipeline.IStage, _options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    return {};
  }

  public onStateChange(_name: string, _target?: events.IRuleTarget, _options?: events.RuleProps): events.Rule {
    throw new Error('onStateChange() is not available on FakeAction');
  }
}

function getTestStack(): cdk.Stack {
  return new cdk.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
}

function createSelfUpdatingStack(pipelineStack: cdk.Stack): SelfUpdatingPipeline {
  const pipeline = new codepipeline.Pipeline(pipelineStack, 'CodePipeline', {
    restartExecutionOnUpdate: true,
  });

  // simple source
  const bucket = s3.Bucket.fromBucketArn(pipeline, 'PatternBucket', 'arn:aws:s3:::totally-fake-bucket');
  const sourceOutput = new codepipeline.Artifact('SourceOutput');
  const sourceAction = new cpactions.S3SourceAction({
    actionName: 'S3Source',
    bucket,
    bucketKey: 'the-great-key',
    output: sourceOutput,
  });
  pipeline.addStage({
    stageName: 'source',
    actions: [sourceAction],
  });

  const project = new codebuild.PipelineProject(pipelineStack, 'CodeBuild');
  const buildOutput = new codepipeline.Artifact('BuildOutput');
  const buildAction = new cpactions.CodeBuildAction({
    actionName: 'CodeBuild',
    project,
    input: sourceOutput,
    outputs: [buildOutput],
  });
  pipeline.addStage({
    stageName: 'build',
    actions: [buildAction],
  });
  return { synthesizedApp: buildOutput, pipeline };
}

function hasPipelineActionConfiguration(expectedActionConfiguration: any): Matcher {
  return Match.objectLike({
    Stages: Match.arrayWith([
      Match.objectLike({
        Actions: Match.arrayWith([
          Match.objectLike({
            Configuration: expectedActionConfiguration,
          }),
        ]),
      }),
    ]),
  });
}