//import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { EmrContainersStartJobRun } from '../../lib';
import { Classification, ReleaseLabel, VirtualClusterInput } from '../../lib/emrcontainers/start-job-run';

/**
 * Stack verification steps:
 * Everything in the link below must be setup before running the state machine.
 * @see https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up.html
 *
 * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> : should return status as SUCCEEDED
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-emr-containers-start-job-run-integ-test');

const virtualCluster = new cdk.CfnResource(stack, 'Virtual Cluster', {
  type: 'AWS::EMRContainers::VirtualCluster',
  properties: {
    ContainerProvider: {
      Id: 'test-eks',
      Info: {
        EksInfo: {
          Namespace: 'spark2',
        },
      },
      Type: 'EKS',
    },
    Name: 'Virtual-Cluster-Name',
  },
});

const startJobRunJob = new EmrContainersStartJobRun(stack, 'Start a Job Run', {
  virtualCluster: VirtualClusterInput.fromVirtualClusterId(createVirtualCluster.getAtt('Id').toString()),
  releaseLabel: ReleaseLabel.EMR_6_2_0,
  jobName: 'EMR-Containers-Job',
  jobDriver: {
    sparkSubmitJobDriver: {
      entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
      entryPointArguments: sfn.TaskInput.fromObject(['2']),
      sparkSubmitParameters: '--conf spark.driver.memory=512M --conf spark.kubernetes.driver.request.cores=0.2 --conf spark.kubernetes.executor.request.cores=0.2 --conf spark.sql.shuffle.partitions=60 --conf spark.dynamicAllocation.enabled=false',
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
