/// !cdk-integ pragma:ignore-assets
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { App, CfnOutput, Stack, StackProps } from '@aws-cdk/core';
import { Construct, ConstructOrder } from 'constructs';
import * as lambda from '../lib';

/*
 * Stack verification steps:
 * aws lambda invoke --function-name <function name> --invocation-type Event --payload $(base64 <<<'"OK"') response.json
 */

class TestStack extends Stack {
  public readonly dependenciesAssetHash: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fn = new lambda.PythonFunction(this, 'function', {
      entry: workDir,
      runtime: Runtime.PYTHON_2_7,
    });

    new CfnOutput(this, 'Function', {
      value: fn.functionName,
    });

    // Find the asset hash of the dependencies
    this.dependenciesAssetHash = (fn.node.findAll(ConstructOrder.POSTORDER)
      .find(c => c.node.path.endsWith('Code')) as any)
      .assetHash;
  }
}

// This is a special integration test that synths twice to show that docker
// picks up a change in requirements.txt

// Create a working directory for messing around with requirements.txt
const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-integ'));
fs.copyFileSync(path.join(__dirname, 'lambda-handler', 'index.py'), path.join(workDir, 'index.py'));
const requirementsTxtPath = path.join(workDir, 'requirements.txt');

// Write a requirements.txt with an extraneous dependency (colorama)
const beforeDeps = 'certifi==2020.6.20\nchardet==3.0.4\nidna==2.10\nurllib3==1.25.11\nrequests==2.23.0\npillow==6.2.2\ncolorama==0.4.3\n';
fs.writeFileSync(requirementsTxtPath, beforeDeps);

// Synth the first time
const app = new App();
const stack1 = new TestStack(app, 'cdk-integ-lambda-python-requirements-removed1');
app.synth();

// Then, write a requirements.txt without the extraneous dependency and synth again
const afterDeps = 'certifi==2020.6.20\nchardet==3.0.4\nidna==2.10\nurllib3==1.25.11\nrequests==2.23.0\npillow==6.2.2\n';
fs.writeFileSync(requirementsTxtPath, afterDeps);

// Synth the same stack a second time with different requirements.txt contents
const app2 = new App();
const stack2 = new TestStack(app2, 'cdk-integ-lambda-python-requirements-removed2');
app2.synth();

if (!stack1.dependenciesAssetHash || !stack2.dependenciesAssetHash) {
  throw new Error('The asset hashes are not both truthy');
}

if (stack1.dependenciesAssetHash === stack2.dependenciesAssetHash) {
  throw new Error('Removing a dependency did not change the asset hash');
}
