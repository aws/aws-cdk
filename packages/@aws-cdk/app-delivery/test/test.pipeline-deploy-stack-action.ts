import cfn = require('@aws-cdk/aws-cloudformation');
import codebuild = require('@aws-cdk/aws-codebuild');
import code = require('@aws-cdk/aws-codepipeline');
import api = require('@aws-cdk/aws-codepipeline-api');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import cxapi = require('@aws-cdk/cx-api');
import fc = require('fast-check');
import nodeunit = require('nodeunit');

import { countResources, expect, haveResource, isSuperObject } from '@aws-cdk/assert';
import { PipelineDeployStackAction } from '../lib/pipeline-deploy-stack-action';

interface SelfUpdatingPipeline {
  synthesizedApp: api.Artifact;
  pipeline: code.Pipeline;
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
            const pipeline = new code.Pipeline(stack, 'Pipeline');
            const fakeAction = new FakeAction('Fake');
            pipeline.addStage({
              name: 'FakeStage',
              actions: [fakeAction],
            });
            new PipelineDeployStackAction(stack, 'Action', {
              changeSetName: 'ChangeSet',
              inputArtifact: fakeAction.outputArtifact,
              stack: new cdk.Stack(app, 'DeployedStack', { env: { account: stackAccount } }),
              stage: pipeline.addStage({ name: 'DeployStage' }),
              adminPermissions: false,
            });
          }, 'Cross-environment deployment is not supported');
        }
      )
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
            const pipeline = new code.Pipeline(stack, 'Pipeline');
            const fakeAction = new FakeAction('Fake');
            pipeline.addStage({
              name: 'FakeStage',
              actions: [fakeAction],
            });
            new PipelineDeployStackAction(stack, 'Action', {
              changeSetName: 'ChangeSet',
              createChangeSetRunOrder: createRunOrder,
              executeChangeSetRunOrder: executeRunOrder,
              inputArtifact: fakeAction.outputArtifact,
              stack: new cdk.Stack(app, 'DeployedStack'),
              stage: pipeline.addStage({ name: 'DeployStage' }),
              adminPermissions: false,
            });
          }, 'createChangeSetRunOrder must be < executeChangeSetRunOrder');
        }
      )
    );
    test.done();
  },
  'users can supply CloudFormation capabilities'(test: nodeunit.Test) {
    const pipelineStack = getTestStack();
    const stackWithNoCapability = new cdk.Stack(undefined, 'NoCapStack',
      { env: { account: '123456789012', region: 'us-east-1' } });

    const stackWithAnonymousCapability = new cdk.Stack(undefined, 'AnonymousIAM',
      { env: { account: '123456789012', region: 'us-east-1' } });

    const selfUpdatingStack = createSelfUpdatingStack(pipelineStack);

    const pipeline = selfUpdatingStack.pipeline;
    const selfUpdateStage1 = pipeline.addStage({ name: 'SelfUpdate1' });
    const selfUpdateStage2 = pipeline.addStage({ name: 'SelfUpdate2' });
    const selfUpdateStage3 = pipeline.addStage({ name: 'SelfUpdate3' });

    new PipelineDeployStackAction(pipelineStack, 'SelfUpdatePipeline', {
      stage: selfUpdateStage1,
      stack: pipelineStack,
      inputArtifact: selfUpdatingStack.synthesizedApp,
      capabilities: cfn.CloudFormationCapabilities.NamedIAM,
      adminPermissions: false,
    });
    new PipelineDeployStackAction(pipelineStack, 'DeployStack', {
      stage: selfUpdateStage2,
      stack: stackWithNoCapability,
      inputArtifact: selfUpdatingStack.synthesizedApp,
      capabilities: cfn.CloudFormationCapabilities.None,
      adminPermissions: false,
    });
    new PipelineDeployStackAction(pipelineStack, 'DeployStack2', {
      stage: selfUpdateStage3,
      stack: stackWithAnonymousCapability,
      inputArtifact: selfUpdatingStack.synthesizedApp,
      capabilities: cfn.CloudFormationCapabilities.AnonymousIAM,
      adminPermissions: false,
    });
    expect(pipelineStack).to(haveResource('AWS::CodePipeline::Pipeline', hasPipelineAction({
      Configuration: {
        StackName: "TestStack",
        ActionMode: "CHANGE_SET_REPLACE",
        Capabilities: "CAPABILITY_NAMED_IAM",
      }
    })));
    expect(pipelineStack).to(haveResource('AWS::CodePipeline::Pipeline', hasPipelineAction({
      Configuration: {
        StackName: "AnonymousIAM",
        ActionMode: "CHANGE_SET_REPLACE",
        Capabilities: "CAPABILITY_IAM",
      }
    })));
    expect(pipelineStack).notTo(haveResource('AWS::CodePipeline::Pipeline', hasPipelineAction({
      Configuration: {
        StackName: "NoCapStack",
        ActionMode: "CHANGE_SET_REPLACE",
        Capabilities: "CAPABILITY_NAMED_IAM",
      }
    })));
    expect(pipelineStack).notTo(haveResource('AWS::CodePipeline::Pipeline', hasPipelineAction({
      Configuration: {
        StackName: "NoCapStack",
        ActionMode: "CHANGE_SET_REPLACE",
        Capabilities: "CAPABILITY_IAM",
      }
    })));
    expect(pipelineStack).to(haveResource('AWS::CodePipeline::Pipeline', hasPipelineAction({
      Configuration: {
        StackName: "NoCapStack",
        ActionMode: "CHANGE_SET_REPLACE",
      }
    })));
    test.done();
  },
  'users can use admin permissions'(test: nodeunit.Test) {
    const pipelineStack = getTestStack();
    const selfUpdatingStack = createSelfUpdatingStack(pipelineStack);

    const pipeline = selfUpdatingStack.pipeline;
    const selfUpdateStage = pipeline.addStage({ name: 'SelfUpdate' });
    new PipelineDeployStackAction(pipelineStack, 'SelfUpdatePipeline', {
      stage: selfUpdateStage,
      stack: pipelineStack,
      inputArtifact: selfUpdatingStack.synthesizedApp,
      adminPermissions: true,
    });
    expect(pipelineStack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: '*',
            Effect: 'Allow',
            Resource: '*',
          }
        ],
      }
    }));
    expect(pipelineStack).to(haveResource('AWS::CodePipeline::Pipeline', hasPipelineAction({
      Configuration: {
        StackName: "TestStack",
        ActionMode: "CHANGE_SET_REPLACE",
        Capabilities: "CAPABILITY_NAMED_IAM",
      }
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
    const selfUpdateStage = pipeline.addStage({ name: 'SelfUpdate' });
    const deployAction = new PipelineDeployStackAction(pipelineStack, 'SelfUpdatePipeline', {
      stage: selfUpdateStage,
      stack: pipelineStack,
      inputArtifact: selfUpdatingStack.synthesizedApp,
      adminPermissions: false,
      role
    });
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
    const deployStage = pipeline.addStage({ name: 'Deploy' });
    const deployAction = new PipelineDeployStackAction(pipelineStack, 'DeployServiceStackA', {
      stage: deployStage,
      stack: emptyStack,
      inputArtifact: selfUpdatingStack.synthesizedApp,
      adminPermissions: false,
    });
    // we might need to add permissions
    deployAction.addToDeploymentRolePolicy( new iam.PolicyStatement().
      addActions(
        'ec2:AuthorizeSecurityGroupEgress',
        'ec2:AuthorizeSecurityGroupIngress',
        'ec2:DeleteSecurityGroup',
        'ec2:DescribeSecurityGroups',
        'ec2:CreateSecurityGroup',
        'ec2:RevokeSecurityGroupEgress',
        'ec2:RevokeSecurityGroupIngress'
      ).
      addAllResources());

    // THEN //
    // there should be 3 policies 1. CodePipeline, 2. Codebuild, 3.
    // ChangeSetDeploy Action
    expect(pipelineStack).to(countResources('AWS::IAM::Policy', 3));
    expect(pipelineStack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: [
              'ec2:AuthorizeSecurityGroupEgress',
              'ec2:AuthorizeSecurityGroupIngress',
              'ec2:DeleteSecurityGroup',
              'ec2:DescribeSecurityGroups',
              'ec2:CreateSecurityGroup',
              'ec2:RevokeSecurityGroupEgress',
              'ec2:RevokeSecurityGroupIngress'
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
          const stack = new cdk.Stack(app, 'Test');
          const pipeline = new code.Pipeline(stack, 'Pipeline');
          const fakeAction = new FakeAction('Fake');
          pipeline.addStage({
            name: 'FakeStage',
            actions: [fakeAction],
          });
          const deployedStack = new cdk.Stack(app, 'DeployedStack');
          const deployStage = pipeline.addStage({ name: 'DeployStage' });
          const action = new PipelineDeployStackAction(stack, 'Action', {
            changeSetName: 'ChangeSet',
            inputArtifact: fakeAction.outputArtifact,
            stack: deployedStack,
            stage: deployStage,
            adminPermissions: false,
          });
          for (let i = 0 ; i < assetCount ; i++) {
            deployedStack.node.addMetadata(cxapi.ASSET_METADATA, {});
          }
          test.deepEqual(action.node.validateTree().map(x => x.message),
            [`Cannot deploy the stack DeployedStack because it references ${assetCount} asset(s)`]);
        }
      )
    );
    test.done();
  }
});

class FakeAction extends api.Action {
  public readonly outputArtifact: api.Artifact;

  constructor(actionName: string) {
    super({
      actionName,
      artifactBounds: api.defaultBounds(),
      category: api.ActionCategory.Test,
      provider: 'Test',
    });

    this.outputArtifact = new api.Artifact('OutputArtifact');
  }

  protected bind(_info: api.ActionBind): void {
    // do nothing
  }
}

function getTestStack(): cdk.Stack {
  return new cdk.Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
}

function createSelfUpdatingStack(pipelineStack: cdk.Stack): SelfUpdatingPipeline {
  const pipeline = new code.Pipeline(pipelineStack, 'CodePipeline', {
    restartExecutionOnUpdate: true,
  });

  // simple source
  const bucket = s3.Bucket.import( pipeline, 'PatternBucket', { bucketArn: 'arn:aws:s3:::totally-fake-bucket' });
  const sourceAction = new s3.PipelineSourceAction({
    actionName: 'S3Source',
    bucket,
    bucketKey: 'the-great-key',
  });
  pipeline.addStage({
    name: 'source',
    actions: [sourceAction],
  });

  const project = new codebuild.PipelineProject(pipelineStack, 'CodeBuild');
  const buildAction = project.toCodePipelineBuildAction({
    actionName: 'CodeBuild',
    inputArtifact: sourceAction.outputArtifact,
  });
  pipeline.addStage({
    name: 'build',
    actions: [buildAction],
  });
  const synthesizedApp = buildAction.outputArtifact;
  return {synthesizedApp, pipeline};
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
