import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import * as stepfunctions from "../lib";

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-stepfunctions-logging');

const log = new logs.LogGroup(stack, 'MyLogGroup');

new stepfunctions.StateMachine(stack, 'MyStateMachine', {
    definition: stepfunctions.Chain.start(new stepfunctions.Pass(stack, 'Pass')),
    loggingConfiguration: {
      destinations: [log],
      level: stepfunctions.LoggingLevel.FATAL,
      includeExecutionData: false
    }
});

app.synth();
