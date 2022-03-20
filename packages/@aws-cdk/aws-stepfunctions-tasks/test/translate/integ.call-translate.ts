import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

/**
 *
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * *
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'status': should return status as SUCCEEDED
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'output': should return the number 42
 */
class CallTranslateStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const translateTextTask = new tasks.TranslateTranslateText(this, 'TranslateTranslateText', {
      sourceLanguageCode: 'en',
      targetLanguageCode: 'pt',
      text: 'translate this phrase',
    });

    const definition = new sfn.Pass(this, 'Start', {
      result: sfn.Result.fromObject({ bar: 'SomeValue' }),
    })
      .next(translateTextTask);

    const sm = new sfn.StateMachine(this, 'StateMachine', {
      definition,
    });

    new cdk.CfnOutput(this, 'stateMachineArn', {
      value: sm.stateMachineArn,
    });
  }
}

const app = new cdk.App();
new CallTranslateStack(app, 'aws-stepfunctions-tasks-translate-integ');
app.synth();