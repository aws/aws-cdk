import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import lambda = require('@aws-cdk/aws-lambda');
import { App, Construct, Stack } from '@aws-cdk/core';
import targets = require('../lib');

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Stack', { maxAzs: 2, natGateways: 1 });

    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', { vpc, internetFacing: true });
    const listener = lb.addListener('Listener', { port: 80 });

    const fn = new lambda.Function(this, 'Fun', {
      code: lambda.Code.inline(`
def handler(event, context):
  return {
    "isBase64Encoded": False,
    "statusCode": 200,
    "statusDescription": "200 OK",
    "headers": {
        "Set-cookie": "cookies",
        "Content-Type": "application/json"
    },
    "body": "Hello from Lambda"
  }
      `),
      runtime: lambda.Runtime.PYTHON_3_6,
      handler: 'index.handler',
    });

    listener.addTargets('Targets', {
      targets: [new targets.LambdaTarget(fn)]
    });
  }
}

const app = new App();
new TestStack(app, 'TestStack');
app.synth();