import * as path from 'path';
import { App, Stack } from '@aws-cdk/core';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests';
import { DockerImageCode, DockerImageFunction, Function } from '../lib';

class TestStack extends Stack {
  public fn: Function
  constructor(scope: App, id: string) {
    super(scope, id);

    this.fn = new DockerImageFunction(this, 'MyLambda', {
      code: DockerImageCode.fromImageAsset(path.join(__dirname, 'docker-lambda-handler')),
    });
  }
}

const app = new App();
const testStack = new TestStack(app, 'lambda-ecr-docker');
const integ = new IntegTest(app, 'integ', {
  testCases: [testStack],
});

const invoke = integ.assertions.invokeFunction({
  functionName: testStack.fn.functionName,
});

invoke.expect(ExpectedResult.objectLike({
  Payload: Match.serializedJson({ statusCode: 200 }),
}));

app.synth();
