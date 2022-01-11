import * as iot from '@aws-cdk/aws-iot';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const func = new lambda.Function(this, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = (event) => {
          console.log("It is test for lambda action of AWS IoT Rule.", event);
        };"`,
      ),
    });

    new iot.TopicRule(this, 'TopicRule', {
      sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id, timestamp() as timestamp, temperature FROM 'device/+/data'"),
      actions: [new actions.LambdaFunctionAction(func)],
    });
  }
}

new TestStack(app, 'test-stack');
app.synth();
