import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { EMRContainersStartJobRun } from '../../lib';

/**
 * Stack verification steps:
 * Everything in the link below must be setup before running the state machine.
 * @see https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up.html
 *
 * DataSet for testing: TODO: USE PUBLIC DATASET
 * https://registry.opendata.aws/nyc-tlc-trip-records-pds/
 *
 * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> : should return status as SUCCEEDED
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-emr-containers-start-job-run-integ');


// TODO: MAYBE CREATE JOB EXECUTION ROLE?, FINISH CREATE STARTJOBRUN OBJECT
// https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/creating-job-execution-role.html
const startJobRunJob = new EMRContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
  virtualClusterId: 'z0yghc9wfddurogzx9ws12qr0',
  jobName: 'Run EMR Containers Job',
  executionRoleArn: 'arn:aws:iam::123456789:role/job-execution-role',
  releaseLabel: 'emr-6.2.0-latest',
  jobDriver: {
    sparkSubmitJobDriver: {

    },
  },
});

const chain = sfn.Chain.start(startJobRunJob);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});


app.synth();
