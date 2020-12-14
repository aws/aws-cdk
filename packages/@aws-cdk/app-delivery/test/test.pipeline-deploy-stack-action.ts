import { expect, haveResource, haveResourceLike, isSuperObject } from '@aws-cdk/assert';
import * as cfn from '@aws-cdk/aws-cloudformation';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as cpactions from '@aws-cdk/aws-codepipeline-actions';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import * as fc from 'fast-check';
import * as nodeunit from 'nodeunit';
import { PipelineDeployStackAction } from '../lib/pipeline-deploy-stack-action';

interface SelfUpdatingPipeline {
  synthesizedApp: codepipeline.Artifact;
  pipeline: codepipeline.Pipeline;
}
const accountId = fc.array(fc.integer(0, 9), 12, 12).map(arr => arr.join());

export = nodeunit.testCase({
  'rejects cross-environment deployment'(test: nodeunit.Test) {
    fc.assert(
      fc.property(
        accountId, accountId,
        (pipelineAccount, stackAccount) => {
          fc.pre(pipelineAccount !== stackAccount);
          test.throws(() => {
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
          }, 'Cross-environment deployment is not supported');
        },
      ),
    );
    test.done();
  },

  'rejects createRunOrder >= executeRunOrder'(test: nodeunit.Test) {
    fc.assert(
      fc.property(
        fc.integer(1, 999), fc.integer(1, 999),
        (createRunOrder, executeRunOrder) => {
          fc.pre(createRunOrder >= executeRunOrder);
          test.throws(() => {
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
          }, 'createChangeSetRunOrder must be < executeChangeSetRunOrder');
        },
      ),
    );
    test.done();
  },
  'users can supply CloudFormation capabilities'(test: nodeunit.Test) {
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
    expect(pipelineStack).to(haveResource('AWS::CodePipeline::Pipeline', hasPipelineAction({
      Configuration: {
        StackName: 'TestStack',
        ActionMode: 'CHANGE_SET_REPLACE',
        Capabilities: 'CAPABILITY_NAMED_IAM',
      },
    })));
    expect(pipelineStack).to(haveResource('AWS::CodePipeline::Pipeline', hasPipelineAction({
      Configuration: {
        StackName: 'AnonymousIAM',
        ActionMode: 'CHANGE_SET_REPLACE',
        Capabilities: 'CAPABILITY_IAM',
      },
    })));
    expect(pipelineStack).notTo(haveResource('AWS::CodePipeline::Pipeline', hasPipelineAction({
      Configuration: {
        StackName: 'NoCapStack',
        ActionMode: 'CHANGE_SET_REPLACE',
        Capabilities: 'CAPABILITY_NAMED_IAM',
      },
    })));
    expect(pipelineStack).notTo(haveResource('AWS::CodePipeline::Pipeline', hasPipelineAction({
      Configuration: {
        StackName: 'NoCapStack',
        ActionMode: 'CHANGE_SET_REPLACE',
        Capabilities: 'CAPABILITY_IAM',
      },
    })));
    expect(pipelineStack).to(haveResource('AWS::CodePipeline::Pipeline', hasPipelineAction({
      Configuration: {
        StackName: 'NoCapStack',
        ActionMode: 'CHANGE_SET_REPLACE',
      },
    })));
    expect(pipelineStack).to(haveResource('AWS::CodePipeline::Pipeline', hasPipelineAction({
      Configuration: {
        StackName: 'AutoExpand',
        ActionMode: 'CHANGE_SET_REPLACE',
        Capabilities: 'CAPABILITY_AUTO_EXPAND',
      },
    })));
    expect(pipelineStack).to(haveResource('AWS::CodePipeline::Pipeline', hasPipelineAction({
      Configuration: {
        StackName: 'AnonymousIAMAndAutoExpand',
        ActionMode: 'CHANGE_SET_REPLACE',
        Capabilities: 'CAPABILITY_IAM,CAPABILITY_AUTO_EXPAND',
      },
    })));
    test.done();
  },
  'users can use admin permissions'(test: nodeunit.Test) {
    const pipelineStack = getTestStack();
    const selfUpdatingStack = createSelfUpdatingStack(pipelineStack);

    const pipeline = selfUpdatingStack.pipeline;
    const selfUpdateStage = pipeline.addStage({ stageName: 'SelfUpdate' });
    selfUpdateStage.addAction(new PipelineDeployStackAction({
      stack: pipelineStack,
      input: selfUpdatingStack.synthesizedApp,
      adminPermissions: true,
    }));
    expect(pipelineStack).to(haveResource('AWS::IAM::Policy', {
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
    }));
    expect(pipelineStack).to(haveResource('AWS::CodePipeline::Pipeline', hasPipelineAction({
      Configuration: {
        StackName: 'TestStack',
        ActionMode: 'CHANGE_SET_REPLACE',
        Capabilities: 'CAPABILITY_NAMED_IAM,CAPABILITY_AUTO_EXPAND',
      },
    })));
    test.done();
  },
  'users can supply a role for deploy action'(test: nodeunit.Test) {
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
    test.same(deployAction.deploymentRole, role);
    test.done();
  },
  'users can specify IAM permissions for the deploy action'(test: nodeunit.Test) {
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
    expect(pipelineStack).to(haveResource('AWS::IAM::Policy', {
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
    }));
    test.done();
  },
  'rejects stacks with assets'(test: nodeunit.Test) {
    fc.assert(
      fc.property(
        fc.integer(1, 5),
        (assetCount) => {
          const app = new cdk.App();

          const deployedStack = new cdk.Stack(app, 'DeployedStack');
          for (let i = 0 ; i < assetCount ; i++) {
            deployedStack.node.addMetadata(cxschema.ArtifactMetadataEntryType.ASSET, {});
          }

          test.throws(() => {
            new PipelineDeployStackAction({
              changeSetName: 'ChangeSet',
              input: new codepipeline.Artifact(),
              stack: deployedStack,
              adminPermissions: false,
            });
          }, /Cannot deploy the stack DeployedStack because it references/);
        },
      ),
    );
    test.done();
  },

  'allows overriding the ChangeSet and Execute action names'(test: nodeunit.Test) {
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

    expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
      Stages: [
        {},
        {},
        {
          Name: 'Deploy',
          Actions: [
            {
              Name: 'Prepare',
            },
            {
              Name: 'Deploy',
            },
          ],
        },
      ],
    }));

    test.done();
  },
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
  const bucket = s3.Bucket.fromBucketArn( pipeline, 'PatternBucket', 'arn:aws:s3:::totally-fake-bucket');
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

function hasPipelineAction(expectedAction: any): (props: any) => boolean {
  return (props: any) => {
    for (const stage of props.Stages) {
      for (const action of stage.Actions) {
        if (isSuperObject(action, expectedAction, [], true)) {
          return true;
        }
      }
    }
    return false;
  };
}
