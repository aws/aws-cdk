import * as iot from '@aws-cdk/aws-iot';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topicRule = new iot.TopicRule(this, 'TopicRule', {
      sql: iot.IotSql.fromStringAsVer20160323("SELECT * FROM 'device/+/data'"),
    });

    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition: new sfn.Pass(this, 'StartPass'),
    });

    topicRule.addAction(new actions.StepFunctionsAction(stateMachine));
  }
}

new TestStack(app, 'test-stack');
app.synth();
