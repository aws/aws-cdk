import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws codebuild list-builds-for-project --project-name <deployed project name>: should return a list of projects with size greater than 0
 * *
 * * aws codebuild batch-get-builds --ids <build id returned by list-builds-for-project> --query 'builds[0].buildStatus': wait until the status is 'SUCCEEDED'
 * * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> --query 'status': should return status as SUCCEEDED
 */
class StartBuildStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const batchDeleteBuildsJob = new tasks.CodeBuildBatchDeleteBuilds(this, 'batch-delete-builds', {
      ids: ['ids'],
    });

    const definition = sfn.Chain.start(batchDeleteBuildsJob);

    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition,
    });

    new cdk.CfnOutput(this, 'StateMachineArn', {
      value: stateMachine.stateMachineArn,
    });
  }
}

const app = new cdk.App();
new StartBuildStack(app, 'aws-stepfunctions-tasks-codebuild-batch-delete-builds-integ');
app.synth();
