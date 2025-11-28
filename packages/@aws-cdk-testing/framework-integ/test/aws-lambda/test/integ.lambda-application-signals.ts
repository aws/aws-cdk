import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { StackProps, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import {
  ApplicationSignalsLambdaLayerPythonVersion,
  ApplicationSignalsLambdaLayerNodeJsVersion,
  AdotLayerVersion,
  AdotLambdaExecWrapper,
  Code,
  Architecture,
  Function,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

interface StackUnderTestProps extends StackProps {
  architecture?: Architecture;
}

class StackUnderTest extends Stack {
  constructor(scope: Construct, id: string, props: StackUnderTestProps) {
    super(scope, id, props);

    // Python function with Application Signals using adotInstrumentation
    const pythonFn = new Function(this, 'PythonFunc', {
      runtime: Runtime.PYTHON_3_12,
      handler: 'index.handler',
      code: Code.fromInline('def handler(event, context): return {"statusCode": 200}'),
      architecture: props.architecture,
      adotInstrumentation: {
        layerVersion: AdotLayerVersion.fromApplicationSignalsPythonLayerVersion(
          ApplicationSignalsLambdaLayerPythonVersion.LATEST,
        ),
        execWrapper: AdotLambdaExecWrapper.APPLICATION_SIGNALS,
      },
    });

    pythonFn.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaApplicationSignalsExecutionRolePolicy'),
    );

    // Node.js function with Application Signals using adotInstrumentation
    const nodeFn = new Function(this, 'NodeFunc', {
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: Code.fromInline('exports.handler = async () => ({ statusCode: 200 })'),
      architecture: props.architecture,
      adotInstrumentation: {
        layerVersion: AdotLayerVersion.fromApplicationSignalsNodeJsLayerVersion(
          ApplicationSignalsLambdaLayerNodeJsVersion.LATEST,
        ),
        execWrapper: AdotLambdaExecWrapper.APPLICATION_SIGNALS,
      },
    });

    nodeFn.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaApplicationSignalsExecutionRolePolicy'),
    );
  }
}

new IntegTest(app, 'ApplicationSignalsIntegTest', {
  testCases: [
    new StackUnderTest(app, 'ApplicationSignalsStack1', {
      architecture: Architecture.ARM_64,
    }),
    new StackUnderTest(app, 'ApplicationSignalsStack2', {
      architecture: Architecture.X86_64,
    }),
  ],
});
