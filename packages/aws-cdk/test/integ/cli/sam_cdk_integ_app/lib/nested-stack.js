if (process.env.PACKAGE_LAYOUT_VERSION === '1') {
  var { NestedStack } = require('@aws-cdk/core');
  var { Runtime, LayerVersion, Code, Tracing } = require('@aws-cdk/aws-lambda');
  var { HttpApi, HttpMethod } = require('@aws-cdk/aws-apigatewayv2');
  var { HttpLambdaIntegration } = require('@aws-cdk/aws-apigatewayv2-integrations');
  var { PythonFunction, PythonLayerVersion } = require('@aws-cdk/aws-lambda-python');
} else {
  var { NestedStack } = require('aws-cdk-lib');
  var { Runtime, LayerVersion, Code, Tracing } = require('aws-cdk-lib/aws-lambda');
  var { HttpApi, HttpMethod } = require('@aws-cdk/aws-apigatewayv2-alpha');
  var { HttpLambdaIntegration } = require('@aws-cdk/aws-apigatewayv2-integrations-alpha');
  var { PythonFunction, PythonLayerVersion } = require('@aws-cdk/aws-lambda-python-alpha');
}

class NestedStack1 extends NestedStack {
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
    // ZIP package type Functions
    // Functions Built by CDK - Runtime Functions Constructs
    var nestedPythonFunction = new PythonFunction(this, 'NestedPythonFunction', {
      entry: './src/python/NestedPythonFunctionConstruct',
      index: 'app.py',
      handler: 'lambda_handler',
      runtime: Runtime.PYTHON_3_9,
      layers: [pythonLayerVersion, layerVersion],
      tracing: Tracing.ACTIVE,
    });
    var httpApi = new HttpApi(this, 'httpAPi', {});
    httpApi.addRoutes({
      path: '/httpapis/nestedPythonFunction',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration('httpApiRandomNameIntegration', nestedPythonFunction, {}),
    });
    return this;
  }
}
exports.NestedStack1 = NestedStack1;
