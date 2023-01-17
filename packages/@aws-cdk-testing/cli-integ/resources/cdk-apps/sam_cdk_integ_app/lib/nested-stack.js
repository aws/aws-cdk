if (process.env.PACKAGE_LAYOUT_VERSION === '1') {
  var { NestedStack } = require('@aws-cdk/core');
  var { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
} else {
  var { NestedStack } = require('aws-cdk-lib');
  var { Function, Runtime, Code } = require('aws-cdk-lib/aws-lambda');
}

class NestedStack1 extends NestedStack {
  constructor(scope, id, props) {
    super(scope, id, props);
    new Function(this, 'FunctionPythonRuntime', {
      runtime: Runtime.PYTHON_3_7,
      code: Code.fromAsset('./src/python/Function'),
      handler: 'app.lambda_handler',
    });
  }
}
exports.NestedStack1 = NestedStack1;
