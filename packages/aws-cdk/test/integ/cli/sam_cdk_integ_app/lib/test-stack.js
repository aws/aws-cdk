var path = require('path');
var { NestedStack1 } = require('./nested-stack');
if (process.env.PACKAGE_LAYOUT_VERSION === '1') {
  var { Stack, Duration } = require('@aws-cdk/core');
  var { Runtime, LayerVersion, Code, Tracing, Function, DockerImageFunction, DockerImageCode, Handler } = require('@aws-cdk/aws-lambda');
  var { SpecRestApi, ApiDefinition, RestApi, LambdaIntegration } = require('@aws-cdk/aws-apigateway');
  var { NodejsFunction } = require('@aws-cdk/aws-lambda-nodejs');
  var { GoFunction } = require('@aws-cdk/aws-lambda-go');
  var { PythonFunction, PythonLayerVersion } = require('@aws-cdk/aws-lambda-python');
  var { Role, ServicePrincipal, PolicyStatement } = require('@aws-cdk/aws-iam');
  var { RetentionDays } = require('@aws-cdk/aws-logs');

} else {
  var { Stack, Duration } = require('aws-cdk-lib');
  var { Runtime, LayerVersion, Code, Tracing, Function, DockerImageFunction, DockerImageCode, Handler } = require('aws-cdk-lib/aws-lambda');
  var { SpecRestApi, ApiDefinition, RestApi, LambdaIntegration } = require('aws-cdk-lib/aws-apigateway');
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
    var pythonLayerVersion = new PythonLayerVersion(this, 'PythonLayerVersion', {
      compatibleRuntimes: [
        Runtime.PYTHON_3_7,
        Runtime.PYTHON_3_8,
        Runtime.PYTHON_3_9,
      ],
      entry: './src/python/layers/PythonLayerVersion',
    });
    var layerVersion = new LayerVersion(this, 'LayerVersion', {
      compatibleRuntimes: [
        Runtime.PYTHON_3_7,
        Runtime.PYTHON_3_8,
        Runtime.PYTHON_3_9,
      ],
      code: Code.fromAsset('./src/python/layers/LayerVersion'),
    });
    // add SAM metadata to build layer
    var cfnLayerVersion = layerVersion.node.defaultChild;
    cfnLayerVersion.addMetadata('BuildMethod', 'python3.7');
    // Lambda LayerVersion with bundled Asset that will be built by CDK
    var bundledLayerVersionPythonRuntime = new LayerVersion(this, 'BundledLayerVersionPythonRuntime', {
      compatibleRuntimes: [
        Runtime.PYTHON_3_7,
        Runtime.PYTHON_3_8,
        Runtime.PYTHON_3_9,
      ],
      code: Code.fromAsset('./src/python/layers/BundledLayerVersion', {
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
    // Functions Built by CDK - Runtime Functions Constructs
    var pythonFunction = new PythonFunction(this, 'PythonFunction', {
      entry: './src/python/PythonFunctionConstruct',
      index: 'app.py',
      handler: 'lambda_handler',
      runtime: Runtime.PYTHON_3_9,
      functionName: 'pythonFunc',
      logRetention: RetentionDays.THREE_MONTHS,
      layers: [pythonLayerVersion, layerVersion],
      tracing: Tracing.ACTIVE,
    });
    // Normal Lambda Function Construct - Python Runtime
    var functionPythonRuntime = new Function(this, 'FunctionPythonRuntime', {
      runtime: Runtime.PYTHON_3_7,
      code: Code.fromAsset('./src/python/FunctionConstruct'),
      handler: 'app.lambda_handler',
      layers: [pythonLayerVersion, layerVersion],
      tracing: Tracing.ACTIVE,
    });
    // Normal Lambda Function Construct - Python Runtime - with skip build metadata
    var preBuiltFunctionPythonRuntime = new Function(this, 'PreBuiltFunctionPythonRuntime', {
      runtime: Runtime.PYTHON_3_7,
      code: Code.fromAsset('./src/python/BuiltFunctionConstruct'),
      handler: 'app.lambda_handler',
      layers: [pythonLayerVersion, layerVersion],
      tracing: Tracing.ACTIVE,
    });
    // add SkipBuild Metadata, so SAM will skip building this function
    var cfnPreBuiltFunctionPythonRuntime = preBuiltFunctionPythonRuntime.node.defaultChild;
    cfnPreBuiltFunctionPythonRuntime.addMetadata('SkipBuild', true);
    // Normal Lambda Function with bundled Asset will be built by CDK
    var bundledFunctionPythonRuntime = new Function(this, 'BundledFunctionPythonRuntime', {
      runtime: Runtime.PYTHON_3_7,
      code: Code.fromAsset('./src/python/BundledFunctionConstruct/', {
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
      layers: [bundledLayerVersionPythonRuntime, pythonLayerVersion],
      timeout: Duration.seconds(120),
      tracing: Tracing.ACTIVE,
    });
    // NodeJs Runtime
    //Layers
    var layerVersionNodeJsRuntime = new LayerVersion(this, 'LayerVersionNodeJsRuntime', {
      compatibleRuntimes: [
        Runtime.NODEJS_14_X,
      ],
      code: Code.fromAsset('./src/nodejs/layers/LayerVersion'),
    });
    // add SAM metadata to build layer
    var cfnLayerVersionNodeJsRuntime = layerVersionNodeJsRuntime.node.defaultChild;
    cfnLayerVersionNodeJsRuntime.addMetadata('BuildMethod', 'nodejs14.x');
    var nodejsFunction = new NodejsFunction(this, 'NodejsFunction', {
      entry: path.join(__dirname, '../src/nodejs/NodeJsFunctionConstruct/app.ts'),
      depsLockFilePath: path.join(__dirname, '../src/nodejs/NodeJsFunctionConstruct/package-lock.json'),
      bundling: {
        forceDockerBundling: true,
        externalModules: ['/opt/nodejs/layer_version_dependency'],
      },
      handler: 'lambdaHandler',
      layers: [layerVersionNodeJsRuntime],
      tracing: Tracing.ACTIVE,
    });
    // Normal Lambda Function Construct - NodeJs Runtime
    var functionNodeJsRuntime = new Function(this, 'FunctionNodeJsRuntime', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('./src/nodejs/FunctionConstruct'),
      handler: 'app.lambdaHandler',
      layers: [layerVersionNodeJsRuntime],
      tracing: Tracing.ACTIVE,
    });
    // Normal Lambda Function Construct - NodeJs Runtime - with skip build metadata
    var preBuiltFunctionNodeJsRuntime = new Function(this, 'PreBuiltFunctionNodeJsRuntime', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('./src/nodejs/BuiltFunctionConstruct'),
      handler: 'app.lambdaHandler',
      layers: [layerVersionNodeJsRuntime],
      tracing: Tracing.ACTIVE,
    });
    // add SkipBuild Metadata, so SAM will skip building this function
    var cfnPreBuiltFunctionNodeJsRuntime = preBuiltFunctionNodeJsRuntime.node.defaultChild;
    cfnPreBuiltFunctionNodeJsRuntime.addMetadata('SkipBuild', true);
    // Go Runtime
    var goFunction = new GoFunction(this, 'GoFunction', {
      entry: './src/go/GoFunctionConstruct',
      bundling: {
        forcedDockerBundling: true,
      },
    });
    // Normal Lambda Function Construct - Go Runtime
    var functionGoRuntime = new Function(this, 'FunctionGoRuntime', {
      runtime: Runtime.GO_1_X,
      code: Code.fromAsset('./src/go/FunctionConstruct'),
      handler: 'FunctionConstruct',
    });
    // Image Package Type Functions
    // One way to define an Image Package Type Function
    var dockerImageFunction = new DockerImageFunction(this, 'DockerImageFunction', {
      code: DockerImageCode.fromImageAsset('./src/docker/DockerImageFunctionConstruct', {
        file: 'Dockerfile',
      }),
      tracing: Tracing.ACTIVE,
    });
    // another way
    var functionImageAsset = new Function(this, 'FunctionImageAsset', {
      code: Code.fromAssetImage('./src/docker/FunctionConstructWithImageAssetCode', {
        file: 'Dockerfile',
      }),
      handler: Handler.FROM_IMAGE,
      runtime: Runtime.FROM_IMAGE,
      tracing: Tracing.ACTIVE,
    });
    //Rest APIs
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
    // Rest Api
    var restApi = new RestApi(this, 'RestAPI', {});
    var normalRootResource = restApi.root.addResource('restapis')
      .addResource('normal');
    normalRootResource.addResource('pythonFunction')
      .addMethod('GET', new LambdaIntegration(pythonFunction));
    normalRootResource.addResource('functionPythonRuntime')
      .addMethod('GET', new LambdaIntegration(functionPythonRuntime));
    normalRootResource.addResource('preBuiltFunctionPythonRuntime')
      .addMethod('GET', new LambdaIntegration(preBuiltFunctionPythonRuntime));
    normalRootResource.addResource('bundledFunctionPythonRuntime')
      .addMethod('GET', new LambdaIntegration(bundledFunctionPythonRuntime));
    normalRootResource.addResource('nodejsFunction')
      .addMethod('GET', new LambdaIntegration(nodejsFunction));
    normalRootResource.addResource('functionNodeJsRuntime')
      .addMethod('GET', new LambdaIntegration(functionNodeJsRuntime));
    normalRootResource.addResource('preBuiltFunctionNodeJsRuntime')
      .addMethod('GET', new LambdaIntegration(preBuiltFunctionNodeJsRuntime));
    normalRootResource.addResource('goFunction')
      .addMethod('GET', new LambdaIntegration(goFunction));
    normalRootResource.addResource('functionGoRuntime')
      .addMethod('GET', new LambdaIntegration(functionGoRuntime));
    normalRootResource.addResource('dockerImageFunction')
      .addMethod('GET', new LambdaIntegration(dockerImageFunction));
    normalRootResource.addResource('functionImageAsset')
      .addMethod('GET', new LambdaIntegration(functionImageAsset));
    // Nested Stack
    new NestedStack1(this, 'NestedStack', {});
  }
}
exports.CDKSupportDemoRootStack = CDKSupportDemoRootStack;
