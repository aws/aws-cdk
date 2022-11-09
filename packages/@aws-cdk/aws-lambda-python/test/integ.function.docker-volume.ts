import { spawnSync } from 'child_process';
import * as crypto from 'crypto';
import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as lambda from '../lib';

/*
 * Stack verification steps:
 * * aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"OK"' response.json
 */

// We need to ensure the container name is unique and not re-used eg in parallel runs
const containerName = crypto.randomBytes(12).toString('hex');

// this is to simulate the situation that a volume can be mounted from another container
spawnSync('docker', ['run', '-d', '--name', containerName, 'alpine', 'sleep 60']);

class TestStack extends Stack {
  public readonly functionName: string;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const entry = path.join(__dirname, 'lambda-handler-docker-volume');
    const fn = new lambda.PythonFunction(this, 'my_handler', {
      entry: entry,
      bundling: { volumesFrom: containerName },
      runtime: Runtime.PYTHON_3_8,
    });
    this.functionName = fn.functionName;
  }
}

const app = new App();
const testCase = new TestStack(app, 'cdk-integ-lambda-docker-volume');
const integ = new IntegTest(app, 'lambda-python-docker-volume', {
  testCases: [testCase],
  stackUpdateWorkflow: false,
});

const invoke = integ.assertions.invokeFunction({
  functionName: testCase.functionName,
});

invoke.expect(ExpectedResult.objectLike({
  Payload: '200',
}));
app.synth();
