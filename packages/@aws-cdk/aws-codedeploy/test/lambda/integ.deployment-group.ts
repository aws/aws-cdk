import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import codedeploy = require('../../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codedeploy-server-dg');

function makeAlias(id: string) {
  const func = new lambda.Function(stack, `Func${id}`, {
    code: lambda.Code.inline('exports.handler = function(){ return "test"; };'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NodeJS810
  });
  return new lambda.Alias(stack, `Alias${id}`, {
    aliasName: `alias-${id}`,
    version: new lambda.Version(stack, `Version${id}`, {
      lambda: func
    })
  });
}

const preHook = makeAlias('pre-hook');
const postHook = makeAlias('post-hook');

const application = new codedeploy.LambdaApplication(stack, 'App');
const inPlaceAlias = makeAlias('in-place');
new codedeploy.LambdaDeploymentGroup(stack, 'InPlaceDeployment', {
  alias: inPlaceAlias,
  application,
  deploymentConfig: codedeploy.LambdaDeploymentConfig.AllAtOnce,
  alarms: [
    new cloudwatch.Alarm(stack, 'InPlaceErrors', {
      comparisonOperator: cloudwatch.ComparisonOperator.GreaterThanThreshold,
      threshold: 1,
      evaluationPeriods: 1,
      metric: inPlaceAlias.metricErrors()
    })
  ],
  preHook,
  postHook
});

const blueGreenAlias = makeAlias('blue-green');
new codedeploy.LambdaDeploymentGroup(stack, 'BlueGreenDeployment', {
  alias: blueGreenAlias,
  application,
  deploymentConfig: codedeploy.LambdaDeploymentConfig.Canary10Percent10Minutes,
  alarms: [
    new cloudwatch.Alarm(stack, 'BlueGreenErrors', {
      comparisonOperator: cloudwatch.ComparisonOperator.GreaterThanThreshold,
      threshold: 1,
      evaluationPeriods: 1,
      metric: blueGreenAlias.metricErrors()
    })
  ],
  preHook,
  postHook
});

app.run();
