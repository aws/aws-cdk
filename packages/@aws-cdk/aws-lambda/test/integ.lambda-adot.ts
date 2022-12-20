import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import { StackProps, Stack } from '../../core/lib/stack';
import {
  AdotLambdaLayerPythonSdkVersion,
  AdotLambdaLayerJavaSdkVersion,
  AdotLambdaExecWrapper,
  AdotLambdaLayerJavaScriptSdkVersion,
  AdotLambdaLayerJavaAutoInstrumentationVersion,
  AdotLambdaLayerGenericVersion,
  Code,
  Architecture,
  Function,
  Runtime,
  AdotLayerVersion,
} from '../lib';

const app = new cdk.App();

interface StackUnderTestProps extends StackProps {
  architecture?: Architecture;
}

class StackUnderTest extends Stack {
  constructor(scope: Construct, id: string, props: StackUnderTestProps) {
    super(scope, id, props);

    new Function(this, 'MyFunc1', {
      runtime: Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: Code.fromInline(`exports.handler = ${handler.toString()}`),
      architecture: props.architecture,
      adotInstrumentation: {
        layerVersion: AdotLayerVersion.fromJavaScriptSdkLayerVersion(AdotLambdaLayerJavaScriptSdkVersion.LATEST),
        execWrapper: AdotLambdaExecWrapper.REGULAR_HANDLER,
      },
    });

    new Function(this, 'MyFunc2', {
      runtime: Runtime.PYTHON_3_9,
      handler: 'index.handler',
      code: Code.fromInline('def handler(event, context): pass'),
      adotInstrumentation: {
        layerVersion: AdotLayerVersion.fromPythonSdkLayerVersion(AdotLambdaLayerPythonSdkVersion.LATEST),
        execWrapper: AdotLambdaExecWrapper.REGULAR_HANDLER,
      },
    });

    new Function(this, 'MyFunc3', {
      runtime: Runtime.PYTHON_3_9,
      handler: 'index.handler',
      code: Code.fromInline('def handler(event, context): pass'),
      adotInstrumentation: {
        layerVersion: AdotLayerVersion.fromJavaSdkLayerVersion(AdotLambdaLayerJavaSdkVersion.LATEST),
        execWrapper: AdotLambdaExecWrapper.REGULAR_HANDLER,
      },
    });

    new Function(this, 'MyFunc4', {
      runtime: Runtime.PYTHON_3_9,
      handler: 'index.handler',
      code: Code.fromInline('def handler(event, context): pass'),
      adotInstrumentation: {
        layerVersion: AdotLayerVersion.fromJavaAutoInstrumentationLayerVersion(AdotLambdaLayerJavaAutoInstrumentationVersion.LATEST),
        execWrapper: AdotLambdaExecWrapper.REGULAR_HANDLER,
      },
    });

    new Function(this, 'MyFunc5', {
      runtime: Runtime.PYTHON_3_9,
      handler: 'index.handler',
      code: Code.fromInline('def handler(event, context): pass'),
      adotInstrumentation: {
        layerVersion: AdotLayerVersion.fromGenericLayerVersion(AdotLambdaLayerGenericVersion.LATEST),
        execWrapper: AdotLambdaExecWrapper.REGULAR_HANDLER,
      },
    });
  }
}

/* eslint-disable no-console */
function handler(event: any, _context: any, callback: any) {
  console.log(JSON.stringify(event, undefined, 2));
  return callback();
}

new IntegTest(app, 'IntegTest', {
  testCases: [
    new StackUnderTest(app, 'Stack1', {
      architecture: Architecture.ARM_64,
    }),
    new StackUnderTest(app, 'Stack2', {
      architecture: Architecture.X86_64,
    }),
  ],
});
