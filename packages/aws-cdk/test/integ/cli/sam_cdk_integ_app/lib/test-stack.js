var path = require('path');
var { NestedStack1 } = require('./nested-stack');
if (process.env.PACKAGE_LAYOUT_VERSION === '1') {
  var { Stack } = require('@aws-cdk/core');
  var { Runtime, LayerVersion, Code, Function, DockerImageFunction, DockerImageCode } = require('@aws-cdk/aws-lambda');
  var { SpecRestApi, ApiDefinition } = require('@aws-cdk/aws-apigateway');
  var { NodejsFunction } = require('@aws-cdk/aws-lambda-nodejs');
  var { GoFunction } = require('@aws-cdk/aws-lambda-go');
  var { PythonFunction, PythonLayerVersion } = require('@aws-cdk/aws-lambda-python');
  var { Role, ServicePrincipal, PolicyStatement } = require('@aws-cdk/aws-iam');
  var { RetentionDays } = require('@aws-cdk/aws-logs');
} else {
  var { Stack } = require('aws-cdk-lib');
  var { Runtime, LayerVersion, Code, Function, DockerImageFunction, DockerImageCode } = require('aws-cdk-lib/aws-lambda');
  var { SpecRestApi, ApiDefinition } = require('aws-cdk-lib/aws-apigateway');
  var { NodejsFunction } = require('aws-cdk-lib/aws-lambda-nodejs');
  var { GoFunction } = require('@aws-cdk/aws-lambda-go-alpha');
  var { PythonFunction, PythonLayerVersion } = require('@aws-cdk/aws-lambda-python-alpha');
  var { Role, ServicePrincipal, PolicyStatement } = require('aws-cdk-lib/aws-iam');
  var { RetentionDays } = require('aws-cdk-lib/aws-logs');
}

class CDKSupportDemoRootStack extends Stack{
  constructor(scope, id, props) {
    super(scope, id, props);
    // Python Runtime
    // Layers
    new PythonLayerVersion(this, 'PythonLayerVersion', {
      compatibleRuntimes: [
        Runtime.PYTHON_3_7,
      ],
      entry: './src/python/Layer',
    });
    new LayerVersion(this, 'LayerVersion', {
      compatibleRuntimes: [
        Runtime.PYTHON_3_7,
      ],
      code: Code.fromAsset('./src/python/Layer'),
    });
    new LayerVersion(this, 'BundledLayerVersionPythonRuntime', {
      compatibleRuntimes: [
        Runtime.PYTHON_3_7,
      ],
      code: Code.fromAsset('./src/python/Layer', {
        bundling: {
          command: [
            '/bin/sh',
            '-c',
            'rm -rf /tmp/asset-input && mkdir /tmp/asset-input && cp * /tmp/asset-input && cd /tmp/asset-input && pip install -r requirements.txt -t . && mkdir /asset-output/python && cp -R /tmp/asset-input/* /asset-output/python',
          ],
          image: Runtime.PYTHON_3_7.bundlingImage,
          user: 'root',
        }
      }),
    });

    // ZIP package type Functions
    new PythonFunction(this, 'PythonFunction', {
      entry: './src/python/Function',
      index: 'app.py',
      handler: 'lambda_handler',
      runtime: Runtime.PYTHON_3_7,
      functionName: 'pythonFunc',
      logRetention: RetentionDays.THREE_MONTHS,
    });
    new Function(this, 'FunctionPythonRuntime', {
      runtime: Runtime.PYTHON_3_7,
      code: Code.fromAsset('./src/python/Function'),
      handler: 'app.lambda_handler',
    });
    new Function(this, 'BundledFunctionPythonRuntime', {
      runtime: Runtime.PYTHON_3_7,
      code: Code.fromAsset('./src/python/Function/', {
        bundling: {
          command: [
            '/bin/sh',
            '-c',
            'rm -rf /tmp/asset-input && mkdir /tmp/asset-input && cp * /tmp/asset-input && cd /tmp/asset-input && pip install -r requirements.txt -t . && cp -R /tmp/asset-input/* /asset-output',
          ],
          image: Runtime.PYTHON_3_7.bundlingImage,
          user: 'root',
        }
      }),
      handler: 'app.lambda_handler',
    });

    // NodeJs Runtime
    new NodejsFunction(this, 'NodejsFunction', {
      entry: path.join(__dirname, '../src/nodejs/NodeJsFunctionConstruct/app.ts'),
      depsLockFilePath: path.join(__dirname, '../src/nodejs/NodeJsFunctionConstruct/package-lock.json'),
      bundling: {
        forceDockerBundling: true,
      },
      handler: 'lambdaHandler',
    });

    // Go Runtime
    new GoFunction(this, 'GoFunction', {
      entry: './src/go/GoFunctionConstruct',
      bundling: {
        forcedDockerBundling: true,
      },
    });

    // Image Package Type Functions
    new DockerImageFunction(this, 'DockerImageFunction', {
      code: DockerImageCode.fromImageAsset('./src/docker/DockerImageFunctionConstruct', {
        file: 'Dockerfile',
      }),
    });

    // Spec Rest Api
    new SpecRestApi(this, 'SpecRestAPI', {
      apiDefinition: ApiDefinition.fromAsset('./src/rest-api-definition.yaml'),
    });
    // Role to be used as credentials for the Spec rest APi
    // it is used inside the spec rest api definition file
    new Role(this, 'SpecRestApiRole', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
      roleName: 'SpecRestApiRole',
    }).addToPolicy(new PolicyStatement({
      actions: ['lambda:InvokeFunction'],
      resources: ['*'],
    }));

    // Nested Stack
    new NestedStack1(this, 'NestedStack', {});
  }
}
exports.CDKSupportDemoRootStack = CDKSupportDemoRootStack;
