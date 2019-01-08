import { IPipeline } from '@aws-cdk/aws-codepipeline-api';
import * as iam from '@aws-cdk/aws-iam';
import { App, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { Bucket, PipelineSourceAction } from '../../aws-s3/lib';
import { PipelineDeployAction, ServerDeploymentGroup  } from '../lib';

export = {
  'test passing properties to action'(test: Test) {
    const app = new TestApp();

    const source = new PipelineSourceAction(app.stack, 'Src', {
      bucket: Bucket.import(app.stack, 'Bucket', {bucketName: 'someName'}),
      bucketKey: 'bkkey',
      stage: {
        node: app.stack.node,
        name: 'Source',
        pipeline: {
          role: iam.Role.import(app.stack, 'r1', { roleArn: 'arn:aws:iam::123456789012:role/superUser1'} )
        } as IPipeline,
        _internal: {
          _attachAction: () => null,
          _findInputArtifact: () => { throw new Error('X'); },
          _generateOutputArtifactName: () => 'SourceOut'
        }
      }
    });

    const action = new PipelineDeployAction(app.stack, 'Id', {
      runOrder: 456,
      stage: {
        node: app.stack.node,
        name: 'Source',
        pipeline: {
          role: iam.Role.import(app.stack, 'r2', { roleArn: 'arn:aws:iam::123456789012:role/superUser2'} )
        } as IPipeline,
        _internal: {
          _attachAction: () => null,
          _findInputArtifact: () => { throw new Error('X'); },
          _generateOutputArtifactName: () => 'DeployOut'
        }
      },
      role: iam.Role.import(app.stack, 'Role', {
        roleArn: 'arn:aws:iam::123456789012:role/superUser'
      }),
      deploymentGroup: new ServerDeploymentGroup(app.stack, 'DeployGroup', {
        deploymentGroupName: 'DGName'
      }),
      inputArtifact: source.outputArtifact
    });

    test.equals(action.runOrder, 456);
    test.equals(action.role!.roleArn, 'arn:aws:iam::123456789012:role/superUser');
    test.done();
  }
};

class TestApp {
  private readonly app = new App();
  // tslint:disable-next-line:member-ordering
  public readonly stack: Stack = new Stack(this.app, 'MyStack');

  public synthesizeTemplate() {
    return this.app.synthesizeStack(this.stack.name).template;
  }
}
