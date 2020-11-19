import * as path from 'path';
import { App, Aspects, IAspect, Stack } from '@aws-cdk/core';
import { IConstruct } from 'constructs';
import { CfnFunction, Code, Function, Runtime } from '../lib';

class TestStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id, {
      env: { region: 'sa-east-1' }, // the feature is available only in sa-east-1 during private beta. Remove after launch.
    });

    new Function(this, 'MyLambda', {
      code: Code.fromImageAsset(path.join(__dirname, 'docker-lambda-handler')),
      handler: 'app.handler',
      runtime: Runtime.NODEJS_12_X,
    });
  }
}

class PrivateResourceAspect implements IAspect {
  visit(construct: IConstruct): void {
    if (construct instanceof CfnFunction) {
      (construct as any).cfnResourceType = 'AWSLambdaBeta::Lambda::Function';
    }
  }
}

const app = new App();
const stack = new TestStack(app, 'lambda-ecr-docker');

// the feature is available as an CFN private resource during private beta. Remove after launch.
Aspects.of(stack).add(new PrivateResourceAspect());

app.synth();