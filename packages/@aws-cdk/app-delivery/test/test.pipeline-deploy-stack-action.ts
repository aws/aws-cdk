import code = require('@aws-cdk/aws-codepipeline');
import api = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');
import cxapi = require('@aws-cdk/cx-api');
import fc = require('fast-check');
import nodeunit = require('nodeunit');
import { PipelineDeployStackAction } from '../lib/pipeline-deploy-stack-action';

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
            const fakeAction = new FakeAction(stack, 'Fake', pipeline);
            new PipelineDeployStackAction(stack, 'Action', {
              changeSetName: 'ChangeSet',
              inputArtifact: fakeAction.outputArtifact,
              stack: new cdk.Stack(app, 'DeployedStack', { env: { account: stackAccount } }),
              stage: pipeline.addStage('DeployStage'),
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
            const fakeAction = new FakeAction(stack, 'Fake', pipeline);
            new PipelineDeployStackAction(stack, 'Action', {
              changeSetName: 'ChangeSet',
              createChangeSetRunOrder: createRunOrder,
              executeChangeSetRunOrder: executeRunOrder,
              inputArtifact: fakeAction.outputArtifact,
              stack: new cdk.Stack(app, 'DeployedStack'),
              stage: pipeline.addStage('DeployStage'),
            });
          }, 'createChangeSetRunOrder must be < executeChangeSetRunOrder');
        }
      )
    );
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
          const fakeAction = new FakeAction(stack, 'Fake', pipeline);
          const deployedStack = new cdk.Stack(app, 'DeployedStack');
          const action = new PipelineDeployStackAction(stack, 'Action', {
            changeSetName: 'ChangeSet',
            inputArtifact: fakeAction.outputArtifact,
            stack: deployedStack,
            stage: pipeline.addStage('DeployStage'),
          });
          for (let i = 0 ; i < assetCount ; i++) {
            deployedStack.addMetadata(cxapi.ASSET_METADATA, {});
          }
          test.deepEqual(action.validate(),
                         [`Cannot deploy the stack DeployedStack because it references ${assetCount} asset(s)`]);
        }
      )
    );
    test.done();
  }
});

class FakeAction extends api.Action {
  public readonly outputArtifact: api.Artifact;

  constructor(parent: cdk.Construct, id: string, pipeline: code.Pipeline) {
    super(parent, id, {
      artifactBounds: api.defaultBounds(),
      category: api.ActionCategory.Test,
      provider: 'Test',
      stage: pipeline.addStage('FakeStage'),
    });

    this.outputArtifact = new api.Artifact(this, 'OutputArtifact');
  }
}
