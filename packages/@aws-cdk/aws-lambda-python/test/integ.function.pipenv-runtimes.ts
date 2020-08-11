import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { App, CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as lambda from '../lib';

/*
 * Stack verification steps:
 * cdk deploy --app "node integ.function.pipenv-runtimes.js"
 * aws lambda invoke --function-name <function name> --invocation-type Event --payload $(base64 <<<'"OK"') response.json
 */

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Python 3
    const testedRuntimes = [
      Runtime.PYTHON_3_6,
      Runtime.PYTHON_3_7,
      Runtime.PYTHON_3_8,
    ];

    testedRuntimes.forEach(runtime => {
      const displayName = runtime.name;

      const fn = new lambda.PythonFunction(this, `runtime_${displayName}`, {
        entry: path.join(__dirname, 'lambda-handler-pipenv'),
        runtime: runtime,
        dependenciesLocation: lambda.DependenciesLocation.LAYER,
      });

      new CfnOutput(this, `FunctionName_${displayName}`, {
        value: fn.functionName,
      });
    });

    // Python 2
    const fn = new lambda.PythonFunction(this, `runtime_${Runtime.PYTHON_2_7.name}`, {
      entry: path.join(__dirname, 'lambda-handler-pipenv'),
      runtime: Runtime.PYTHON_2_7,
      dependenciesLocation: lambda.DependenciesLocation.LAYER,
    });

    new CfnOutput(this, `FunctionName_${Runtime.PYTHON_2_7.name}`, {
      value: fn.functionName,
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-lambda-pipenv-runtimes');
app.synth();
