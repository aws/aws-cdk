import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  public readonly lb: elbv2.IApplicationLoadBalancer;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Stack', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });

    this.lb = new elbv2.ApplicationLoadBalancer(this, 'LB', { vpc, internetFacing: true });
    const listener = this.lb.addListener('Listener', { port: 80 });

    const fn = new lambda.Function(this, 'Fun', {
      code: lambda.Code.fromInline(`
import json
def handler(event, context):
  return {
    "isBase64Encoded": False,
    "statusCode": 200,
    "statusDescription": "200 OK",
    "headers": {
        "Set-cookie": "cookies",
        "Content-Type": "application/json"
    },
    "body": json.dumps({ "message": "Hello from Lambda" })
  }
      `),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.handler',
    });

    listener.addTargets('Targets', {
      targets: [new targets.LambdaTarget(fn)],
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new TestStack(app, 'TestStack');
const integ = new IntegTest(app, 'integ-test', {
  testCases: [testCase],
});

const call = integ.assertions.httpApiCall(`http://${testCase.lb.loadBalancerDnsName}`, { });
call.expect(ExpectedResult.objectLike({
  status: 200,
  headers: {
    'content-type': ['application/json'],
  },
  body: { message: 'Hello from Lambda' },
}));
