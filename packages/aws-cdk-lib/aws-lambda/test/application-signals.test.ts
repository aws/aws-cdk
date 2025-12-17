import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import * as lambda from '../lib';

describe('Application Signals', () => {
  test('Python Application Signals layer can be added to a function', () => {
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'MyFunction', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'index.handler',
      code: lambda.Code.fromInline('def handler(event, context): return {"statusCode": 200}'),
    });

    fn.addLayers(
      lambda.LayerVersion.fromLayerVersionArn(
        stack,
        'AppSignalsLayer',
        lambda.ApplicationSignalsLambdaLayerPythonVersion.LATEST.layerArn(stack, fn.architecture),
      ),
    );

    fn.addEnvironment('AWS_LAMBDA_EXEC_WRAPPER', '/opt/otel-instrument');

    fn.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaApplicationSignalsExecutionRolePolicy'),
    );

    const template = Template.fromStack(stack);

    // Verify the layer is added (ARN will be resolved via CloudFormation mapping)
    template.resourceCountIs('AWS::Lambda::Function', 1);
    const functions = template.findResources('AWS::Lambda::Function');
    const functionResource = Object.values(functions)[0];
    expect(functionResource.Properties.Layers).toHaveLength(1);
    expect(functionResource.Properties.Environment.Variables.AWS_LAMBDA_EXEC_WRAPPER).toBe('/opt/otel-instrument');

    // Verify the IAM policy is attached
    template.hasResourceProperties('AWS::IAM::Role', {
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
            ],
          ],
        },
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::aws:policy/CloudWatchLambdaApplicationSignalsExecutionRolePolicy',
            ],
          ],
        },
      ],
    });
  });

  test('Node.js Application Signals layer can be added to a function', () => {
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => {}'),
    });

    fn.addLayers(
      lambda.LayerVersion.fromLayerVersionArn(
        stack,
        'AppSignalsLayer',
        lambda.ApplicationSignalsLambdaLayerNodeJsVersion.LATEST.layerArn(stack, fn.architecture),
      ),
    );

    const template = Template.fromStack(stack);

    // Verify the layer is added (ARN will be resolved via CloudFormation mapping)
    template.resourceCountIs('AWS::Lambda::Function', 1);
    const functions = template.findResources('AWS::Lambda::Function');
    const functionResource = Object.values(functions)[0];
    expect(functionResource.Properties.Layers).toHaveLength(1);
  });

  test('Application Signals layer ARN is resolved correctly for specific region', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { region: 'us-east-1' },
    });

    const fn = new lambda.Function(stack, 'MyFunction', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'index.handler',
      code: lambda.Code.fromInline('def handler(event, context): pass'),
    });

    const layerArn = lambda.ApplicationSignalsLambdaLayerPythonVersion.LATEST.layerArn(stack, fn.architecture);

    expect(layerArn).toContain('arn:aws:lambda:us-east-1:615299751070:layer:AWSOpenTelemetryDistroPython:19');
  });

  test('Application Signals layer with adotInstrumentation requires APPLICATION_SIGNALS wrapper', () => {
    const stack = new cdk.Stack();

    expect(() => {
      new lambda.Function(stack, 'MyFunction', {
        runtime: lambda.Runtime.PYTHON_3_12,
        handler: 'index.handler',
        code: lambda.Code.fromInline('def handler(event, context): pass'),
        adotInstrumentation: {
          layerVersion: lambda.AdotLayerVersion.fromApplicationSignalsPythonLayerVersion(
            lambda.ApplicationSignalsLambdaLayerPythonVersion.LATEST,
          ),
          execWrapper: lambda.AdotLambdaExecWrapper.REGULAR_HANDLER, // Wrong wrapper!
        },
      });
    }).toThrow(/Application Signals Lambda layers require AdotLambdaExecWrapper.APPLICATION_SIGNALS/);
  });

  test('Application Signals layer with correct wrapper succeeds', () => {
    const stack = new cdk.Stack();

    const fn = new lambda.Function(stack, 'MyFunction', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'index.handler',
      code: lambda.Code.fromInline('def handler(event, context): pass'),
      adotInstrumentation: {
        layerVersion: lambda.AdotLayerVersion.fromApplicationSignalsPythonLayerVersion(
          lambda.ApplicationSignalsLambdaLayerPythonVersion.LATEST,
        ),
        execWrapper: lambda.AdotLambdaExecWrapper.APPLICATION_SIGNALS,
      },
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          AWS_LAMBDA_EXEC_WRAPPER: '/opt/otel-instrument',
        },
      },
    });
  });

  test('Node.js Application Signals layer with wrong wrapper throws error', () => {
    const stack = new cdk.Stack();

    expect(() => {
      new lambda.Function(stack, 'MyFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
        adotInstrumentation: {
          layerVersion: lambda.AdotLayerVersion.fromApplicationSignalsNodeJsLayerVersion(
            lambda.ApplicationSignalsLambdaLayerNodeJsVersion.LATEST,
          ),
          execWrapper: lambda.AdotLambdaExecWrapper.PROXY_HANDLER, // Wrong wrapper!
        },
      });
    }).toThrow(/Application Signals Lambda layers require AdotLambdaExecWrapper.APPLICATION_SIGNALS/);
  });

  test('Standard ADOT layer still works with other wrappers', () => {
    const stack = new cdk.Stack();

    const fn = new lambda.Function(stack, 'MyFunction', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'index.handler',
      code: lambda.Code.fromInline('def handler(event, context): pass'),
      adotInstrumentation: {
        layerVersion: lambda.AdotLayerVersion.fromPythonSdkLayerVersion(
          lambda.AdotLambdaLayerPythonSdkVersion.LATEST,
        ),
        execWrapper: lambda.AdotLambdaExecWrapper.INSTRUMENT_HANDLER,
      },
    });

    const template = Template.fromStack(stack);

    // Should not throw and should create the function successfully
    template.hasResourceProperties('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          AWS_LAMBDA_EXEC_WRAPPER: '/opt/otel-instrument',
        },
      },
    });
  });

  test('Application Signals throws error for unsupported Python version', () => {
    const stack = new cdk.Stack();

    expect(() => {
      new lambda.Function(stack, 'MyFunction', {
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'index.handler',
        code: lambda.Code.fromInline('def handler(event, context): pass'),
        adotInstrumentation: {
          layerVersion: lambda.AdotLayerVersion.fromApplicationSignalsPythonLayerVersion(
            lambda.ApplicationSignalsLambdaLayerPythonVersion.LATEST,
          ),
          execWrapper: lambda.AdotLambdaExecWrapper.APPLICATION_SIGNALS,
        },
      });
    }).toThrow(/Application Signals does not support python3.8.*Supported runtimes.*Python \(3.9\+\)/);
  });

  test('Application Signals throws error for unsupported Node.js version', () => {
    const stack = new cdk.Stack();

    expect(() => {
      new lambda.Function(stack, 'MyFunction', {
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
        adotInstrumentation: {
          layerVersion: lambda.AdotLayerVersion.fromApplicationSignalsNodeJsLayerVersion(
            lambda.ApplicationSignalsLambdaLayerNodeJsVersion.LATEST,
          ),
          execWrapper: lambda.AdotLambdaExecWrapper.APPLICATION_SIGNALS,
        },
      });
    }).toThrow(/Application Signals does not support nodejs12.x.*Supported runtimes.*Node.js/);
  });

  test('Application Signals throws error for unsupported runtime family', () => {
    const stack = new cdk.Stack();

    expect(() => {
      new lambda.Function(stack, 'MyFunction', {
        runtime: lambda.Runtime.PROVIDED_AL2023,
        handler: 'bootstrap',
        code: lambda.Code.fromAsset(__dirname),
        adotInstrumentation: {
          layerVersion: lambda.AdotLayerVersion.fromApplicationSignalsPythonLayerVersion(
            lambda.ApplicationSignalsLambdaLayerPythonVersion.LATEST,
          ),
          execWrapper: lambda.AdotLambdaExecWrapper.APPLICATION_SIGNALS,
        },
      });
    }).toThrow(/Application Signals does not support provided.al2023.*Supported runtimes/);
  });

  test('Application Signals accepts supported Python 3.12', () => {
    const stack = new cdk.Stack();

    expect(() => {
      new lambda.Function(stack, 'MyFunction', {
        runtime: lambda.Runtime.PYTHON_3_12,
        handler: 'index.handler',
        code: lambda.Code.fromInline('def handler(event, context): pass'),
        adotInstrumentation: {
          layerVersion: lambda.AdotLayerVersion.fromApplicationSignalsPythonLayerVersion(
            lambda.ApplicationSignalsLambdaLayerPythonVersion.LATEST,
          ),
          execWrapper: lambda.AdotLambdaExecWrapper.APPLICATION_SIGNALS,
        },
      });
    }).not.toThrow();
  });

  test('Application Signals accepts supported Node.js 20', () => {
    const stack = new cdk.Stack();

    expect(() => {
      new lambda.Function(stack, 'MyFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {}'),
        adotInstrumentation: {
          layerVersion: lambda.AdotLayerVersion.fromApplicationSignalsNodeJsLayerVersion(
            lambda.ApplicationSignalsLambdaLayerNodeJsVersion.LATEST,
          ),
          execWrapper: lambda.AdotLambdaExecWrapper.APPLICATION_SIGNALS,
        },
      });
    }).not.toThrow();
  });
});
