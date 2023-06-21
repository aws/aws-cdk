// disabling update workflow because we don't want to include the assets in the snapshot
// python bundling changes the asset hash pretty frequently
/// !cdk-integ pragma:disable-update-workflow
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { App, Stack, StackProps, AssetHashType } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as lambda from '../lib';

/*
 * Stack verification steps:
 * * aws lambda invoke --function-name <deployed fn name> --invocation-type Event --payload '"OK"' response.json
 */

class TestStack extends Stack {
  public readonly functionName: string;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const code = `

def handler(event, context):
  return {"helloFrom": "LocalBundle"}

`;

    const fn = new lambda.PythonFunction(this, 'my_handler', {
      entry: path.join(__dirname, 'lambda-handler-nodeps'),
      runtime: Runtime.PYTHON_3_9,
      bundling: {
        // Because we customize the contents and it is not based on the source at all
        assetHash: crypto.createHash('sha256').update(code).digest('hex'),
        assetHashType: AssetHashType.CUSTOM,
        local: {
          tryBundle(outputDir) {
            fs.writeFileSync(path.join(outputDir, 'index.py'), code);
            return true;
          },
        },
      },
    });
    this.functionName = fn.functionName;
  }
}

const app = new App();
const testCase = new TestStack(app, 'integ-lambda-python-function-local');
const integ = new IntegTest(app, 'lambda-python-function-local', {
  testCases: [testCase],
  stackUpdateWorkflow: false,
});

const invoke = integ.assertions.invokeFunction({
  functionName: testCase.functionName,
});

invoke.expect(ExpectedResult.objectLike({
  Payload: '{"helloFrom": "LocalBundle"}',
}));

app.synth();
