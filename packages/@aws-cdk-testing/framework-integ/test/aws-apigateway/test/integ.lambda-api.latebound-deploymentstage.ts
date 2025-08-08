import { Code, Function } from 'aws-cdk-lib/aws-lambda';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { Deployment, LambdaRestApi, Stage } from 'aws-cdk-lib/aws-apigateway';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

class LateBoundDeploymentStageStack extends Stack {
  constructor(scope: Construct) {
    super(scope, 'LateBoundDeploymentStageStack');

    const fn = new Function(this, 'myfn', {
      code: Code.fromInline('foo'),
      runtime: STANDARD_NODEJS_RUNTIME,
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

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new LateBoundDeploymentStageStack(app);
new IntegTest(app, 'lambda-api-latebound-deploymentstage', {
  testCases: [testCase],
});
