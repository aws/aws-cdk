//import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { EmrContainersStartJobRun } from '../../lib';
import { Classification, ReleaseLabel } from '../../lib/emrcontainers/start-job-run';

/**
 * Stack verification steps:
 * Everything in the link below must be setup before running the state machine.
 * @see https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up.html
 *
 * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> : should return status as SUCCEEDED
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-emr-containers-start-job-run-integ');

const startJobRunJob = new EmrContainersStartJobRun(stack, 'EMR Containers Start Job Run', {
  virtualClusterId: sfn.TaskInput.fromText('llr8lezdxlonrv3orxvufp9p0'),
  jobName: 'Run-EMR-Containers-Job',
  // executionRole: iam.Role.fromRoleArn(stack, 'Job-Execution-Role-Arn', 'arn:aws:iam::070850498885:role/Job-Execution-Role'),
  releaseLabel: ReleaseLabel.EMR_6_2_0,
  jobDriver: {
    sparkSubmitJobDriver: {
      entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/jars/spark-examples.jar'),
      entryPointArguments: sfn.TaskInput.fromObject(['2']),
      sparkSubmitParameters: '--class org.apache.spark.examples.SparkPi --conf spark.driver.memory=512M --conf spark.kubernetes.driver.request.cores=0.2 --conf spark.kubernetes.executor.request.cores=0.2 --conf spark.sql.shuffle.partitions=60 --conf spark.dynamicAllocation.enabled=false',
    },
  },
  monitoring: {
    logging: true,
  },
  applicationConfig: [{
    classification: Classification.SPARK_DEFAULTS,
    properties: {
      'spark.executor.instances': '1',
      'spark.executor.memory': '512M',
    },
  }],
});

const chain = sfn.Chain.start(startJobRunJob);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(1000),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});


app.synth();
