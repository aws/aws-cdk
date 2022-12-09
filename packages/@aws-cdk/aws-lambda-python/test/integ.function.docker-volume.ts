import { spawnSync } from 'child_process';
import * as crypto from 'crypto';
import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as lambda from '../lib';

// We need to ensure the container and volume name is unique and not re-used eg in parallel runs
const containerName = crypto.randomBytes(12).toString('hex');
const volumeName = crypto.randomBytes(12).toString('hex');

// create a named volume that will be used in our source container
const createVolume = spawnSync('docker', ['volume', 'create', volumeName]);
if (createVolume.error) {
  throw createVolume.error;
}
if (createVolume.status !== 0) {
  if (createVolume.stdout || createVolume.stderr) {
    throw new Error(`[Status ${createVolume.status}] stdout: ${createVolume.stdout?.toString().trim()}\n\n\nstderr: ${createVolume.stderr?.toString().trim()}`);
  }
  throw new Error(`exited with status ${createVolume.status}`);
}

// run a source container that mounts the created volume with a fixed name. this will be used as source for the bundling container to retrieve the files from
// this will exit immediately, but keep the container running for a while so the actual bundle can use it
const command = ['run', '-d', '--name', containerName, '-v', `${volumeName}:/test-data`, 'alpine', 'sh -c \'echo \"test-data\" > /test-data/test.txt && sleep 120\''];
const dkr = spawnSync('docker', command, { shell: true });

if (dkr.error) {
  throw dkr.error;
}

if (dkr.status !== 0) {
  if (dkr.stdout || dkr.stderr) {
    throw new Error(`[Status ${dkr.status}] stdout: ${dkr.stdout?.toString().trim()}\n\n\nstderr: ${dkr.stderr?.toString().trim()}\nCommand: docker ${command.join(' ')}`);
  }
  throw new Error(`exited with status ${dkr.status}`);
}

class TestStack extends Stack {
  public readonly functionName: string;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const entry = path.join(__dirname, 'lambda-handler-docker-volume');
    const fn = new lambda.PythonFunction(this, 'my_handler', {
      entry: entry,
      bundling: { volumesFrom: [containerName], customCommands: ['sleep 10', 'cp /test-data/* .'] }, // wait a bit until files are available in volume and then copy it over
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
  Payload: '\"test-data\"', // string that is defined in the creation of the source container
}));
app.synth();
