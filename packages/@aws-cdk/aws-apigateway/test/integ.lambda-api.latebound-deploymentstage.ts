import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Deployment, LambdaRestApi, Stage } from '../lib';

class LateBoundDeploymentStageStack extends Stack {
  constructor(scope: Construct) {
    super(scope, 'LateBoundDeploymentStageStack');

    const fn = new Function(this, 'myfn', {
      code: Code.fromInline('foo'),
      runtime: Runtime.NODEJS_14_X,
      handler: 'index.handler',
    });

    const api = new LambdaRestApi(this, 'lambdarestapi', {
      cloudWatchRole: true,
      deploy: false,
      handler: fn,
    });

    api.deploymentStage = new Stage(this, 'stage', {
      deployment: new Deployment(this, 'deployment', {
        api,
      }),
    });
  }
}

const app = new App();
new LateBoundDeploymentStageStack(app);
