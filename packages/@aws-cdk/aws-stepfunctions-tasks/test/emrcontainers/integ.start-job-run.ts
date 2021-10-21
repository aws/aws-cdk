//import * as iam from '@aws-cdk/aws-iam';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as eks from '@aws-cdk/aws-eks';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { EmrContainersStartJobRun } from '../../lib';
import { ReleaseLabel, VirtualClusterInput } from '../../lib/emrcontainers/start-job-run';

/**
 * Stack verification steps:
 * Everything in the link below must be setup before running the state machine.
 * @see https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up-cluster-access.html
 * @see https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up-enable-IAM.html
 * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> : should return status as SUCCEEDED
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-emr-containers-start-job-run-integ-test');

const eksCluster = new eks.Cluster(stack, 'integration-test-eks-cluster', {
  version: eks.KubernetesVersion.V1_21,
  defaultCapacity: 3,
  defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE),
});

const virtualCluster = new cdk.CfnResource(stack, 'Virtual Cluster', {
  type: 'AWS::EMRContainers::VirtualCluster',
  properties: {
    ContainerProvider: {
      Id: eksCluster.clusterName,
      Info: {
        EksInfo: {
          Namespace: 'default',
        },
      },
      Type: 'EKS',
    },
    Name: 'Virtual-Cluster-Name',
  },
});

const startJobRunJob = new EmrContainersStartJobRun(stack, 'Start a Job Run', {
  virtualCluster: VirtualClusterInput.fromVirtualClusterId(virtualCluster.getAtt('Id').toString()),
  releaseLabel: ReleaseLabel.EMR_6_2_0,
  jobName: 'EMR-Containers-Job',
  jobDriver: {
    sparkSubmitJobDriver: {
      entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
      entryPointArguments: sfn.TaskInput.fromObject(['2']),
      sparkSubmitParameters: '--conf spark.driver.memory=512M --conf spark.kubernetes.driver.request.cores=0.2 --conf spark.kubernetes.executor.request.cores=0.2 --conf spark.sql.shuffle.partitions=60 --conf spark.dynamicAllocation.enabled=false',
    },
  },
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