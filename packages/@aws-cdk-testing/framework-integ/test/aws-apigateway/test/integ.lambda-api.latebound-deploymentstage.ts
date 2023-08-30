import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { Deployment, LambdaRestApi, Stage } from 'aws-cdk-lib/aws-apigateway';

class LateBoundDeploymentStageStack extends Stack {
  constructor(scope: Construct) {
    super(scope, 'LateBoundDeploymentStageStack');

    const fn = new Function(this, 'myfn', {
      code: Code.fromInline('foo'),
      runtime: Runtime.NODEJS_16_X,
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
const testCase = new LateBoundDeploymentStageStack(app);
new IntegTest(app, 'lambda-api-latebound-deploymentstage', {
  testCases: [testCase],
});
