import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { RuntimeValue } from '../lib';

// tslint:disable:no-console

export = {
  'RuntimeValue is awesome'(test: Test) {
    const stack = new cdk.Stack();

    new RuntimeValueTest(stack, 'RuntimeValue');

    test.done();
  }
};

class RuntimeValueTest extends cdk.Construct {

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const queue = new sqs.CfnQueue(this, 'Queue', {});

    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    new lambda.CfnFunction(this, 'Function', {
      runtime: 'nodejs6.10',
      handler: 'index.handler',
      code: {
        zipFile: `
        exports.handler = function(event, context, callback) {
          callback(undefined, "success");
        }
        `
      },
      role: role.roleArn,
      environment: {
        variables: {
          [RuntimeValue.ENV_NAME]: this.node.stack.stackName,
        }
      }
    });

    // used as a namespace to avoid collisions
    const RTV_PACKAGE = 'com.amazonaws.rtvtest';

    const runtimeValues = [
      new RuntimeValue(this, 'MyQueueURL', { package: RTV_PACKAGE, value: queue.ref }),
      new RuntimeValue(this, 'MyQueueName', { package: RTV_PACKAGE, value: queue.queueName })
    ];

    runtimeValues.forEach(rtv => rtv.grantRead(role));
  }
}
