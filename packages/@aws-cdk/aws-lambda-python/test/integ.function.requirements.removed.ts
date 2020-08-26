import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { App, CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';
import { ConstructOrder } from 'constructs';
import * as lambda from '../lib';

/*
 * Stack verification steps:
 * aws lambda invoke --function-name <function name> --invocation-type Event --payload $(base64 <<<'"OK"') response.json
 */

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create a working directory for messing around with requirements.txt
    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-integ'));
    fs.copyFileSync(path.join(__dirname, 'lambda-handler-requirements', 'index.py'), path.join(workDir, 'index.py'));
    const requirementsTxtPath = path.join(workDir, 'requirements.txt');

    // Write a requirements.txt with an extraneous dependency (colorama)
    const beforeDeps = 'requests==2.23.0\npillow==6.2.2\ncolorama==0.4.3\n';
    fs.writeFileSync(requirementsTxtPath, beforeDeps);

    const fnBefore = new lambda.PythonFunction(this, 'before', {
      entry: workDir,
      runtime: Runtime.PYTHON_2_7,
    });

    new CfnOutput(this, 'FunctionBefore', {
      value: fnBefore.functionName,
    });

    // Then, write a requirements.txt without the extraneous dependency
    const afterDeps = 'requests==2.23.0\npillow==6.2.2\n';
    fs.writeFileSync(requirementsTxtPath, afterDeps);

    const fnAfter = new lambda.PythonFunction(this, 'after', {
      entry: workDir,
      runtime: Runtime.PYTHON_2_7,
    });

    new CfnOutput(this, 'FunctionAfter', {
      value: fnAfter.functionName,
    });

    // Ensure that the fnBefore and fnAfter assets are different
    const fnBeforeAssetHash = (fnBefore.node.findAll(ConstructOrder.POSTORDER)
      .find(c => c.node.path.endsWith('Dependencies/Code')) as any)
      .assetHash;
    const fnAfterAssetHash = (fnAfter.node.findAll(ConstructOrder.POSTORDER)
      .find(c => c.node.path.endsWith('Dependencies/Code')) as any)
      .assetHash;

    if (!fnBeforeAssetHash || !fnAfterAssetHash) {
      throw new Error('The asset hashes are not both defined');
    }

    if (fnBeforeAssetHash === fnAfterAssetHash) {
      throw new Error('Despite removing a dependency, the assets for the two lambdas are the same');
    }
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-lambda-python-requirements-removed');
app.synth();
