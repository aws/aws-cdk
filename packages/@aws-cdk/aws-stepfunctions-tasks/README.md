# Tasks for AWS Step Functions
<!--BEGIN STABILITY BANNER-->
---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

[AWS Step Functions](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html) is a web service that enables you to coordinate the
components of distributed applications and microservices using visual workflows.
You build applications from individual components that each perform a discrete
function, or task, allowing you to scale and change applications quickly.

A [Task](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-task-state.html) state represents a single unit of work performed by a state machine.
All work in your state machine is performed by tasks.

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## Table Of Contents

- [Task](#task)
- [Parameters](#task-parameters-from-the-state-json)
- [Evaluate Expression](#evaluate-expression)
- [Batch](#batch)
  - [SubmitJob](#submitjob)
- [DynamoDB](#dynamodb)
  - [GetItem](#getitem)
  - [PutItem](#putitem)
  - [DeleteItem](#deleteitem)
  - [UpdateItem](#updateitem)
- [ECS](#ecs)
  - [RunTask](#runtask)
- [EMR](#emr)
  - [Create Cluster](#create-cluster)
  - [Termination Protection](#termination-protection)
  - [Terminate Cluster](#terminate-cluster)
  - [Add Step](#add-step)
  - [Cancel Step](#cancel-step)
  - [Modify Instance Fleet](#modify-instance-fleet)
  - [Modify Instance Group](#modify-instance-group)
- [Glue](#glue)
- [Lambda](#lambda)
- [SageMaker](#sagemaker)
  - [Create Training Job](#create-training-job)
  - [Create Transform Job](#create-transform-job)
- [SNS](#sns)
- [Step Functions](#step-functions)
- [SQS](#sqs)

## Task

A Task state represents a single unit of work performed by a state machine. In the
CDK, the exact work to be In the CDK, the exact work to be done is determined by
a class that implements `IStepFunctionsTask`.

AWS Step Functions [integrates](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-service-integrations.html) with some AWS services so that you can call API
actions, and coordinate executions directly from the Amazon States Language in
Step Functions. You can directly call and pass parameters to the APIs of those
services.

## Task parameters from the state JSON

Most tasks take parameters. Parameter values can either be static, supplied directly
in the workflow definition (by specifying their values), or a value available at runtime
in the state machine's execution (either as its input or an output of a prior state).
Parameter values available at runtime can be specified via the `Data` class,
using methods such as `Data.stringAt()`.

If so, the value is taken from the indicated location in the state JSON,
similar to (for example) `inputPath`.

## Evaluate Expression

Use the `EvaluateExpression` to perform simple operations referencing state paths. The
`expression` referenced in the task will be evaluated in a Lambda function
(`eval()`). This allows you to not have to write Lambda code for simple operations.

Example: convert a wait time from milliseconds to seconds, concat this in a message and wait:

```ts
const convertToSeconds = new sfn.Task(this, 'Convert to seconds', {
  task: new tasks.EvaluateExpression({ expression: '$.waitMilliseconds / 1000' }),
  resultPath: '$.waitSeconds'
});

const createMessage = new sfn.Task(this, 'Create message', {
  // Note: this is a string inside a string.
  task: new tasks.EvaluateExpression({
    expression: '`Now waiting ${$.waitSeconds} seconds...`',
    runtime: lambda.Runtime.NODEJS_10_X,
  }),
  resultPath: '$.message'
});

const publishMessage = new sfn.Task(this, 'Publish message', {
  task: new tasks.PublishToTopic(topic, {
    message: sfn.TaskInput.fromDataAt('$.message'),
  }),
  resultPath: '$.sns'
});

const wait = new sfn.Wait(this, 'Wait', {
  time: sfn.WaitTime.secondsPath('$.waitSeconds')
});

new sfn.StateMachine(this, 'StateMachine', {
  definition: convertToSeconds
    .next(createMessage)
    .next(publishMessage)
    .next(wait)
});
```

The `EvaluateExpression` supports a `runtime` prop to specify the Lambda
runtime to use to evaluate the expression. Currently, the only runtime
supported is `lambda.Runtime.NODEJS_10_X`.

## Batch

Step Functions supports [Batch](https://docs.aws.amazon.com/step-functions/latest/dg/connect-batch.html) through the service integration pattern.

### SubmitJob

The [SubmitJob](https://docs.aws.amazon.com/batch/latest/APIReference/API_SubmitJob.html) API submits an AWS Batch job from a job definition.

```ts
import * as batch from '@aws-cdk/aws-batch';

const batchQueue = new batch.JobQueue(this, 'JobQueue', {
  computeEnvironments: [
    {
      order: 1,
      computeEnvironment: new batch.ComputeEnvironment(this, 'ComputeEnv', {
        computeResources: { vpc },
      }),
    },
  ],
});

const batchJobDefinition = new batch.JobDefinition(this, 'JobDefinition', {
  container: {
    image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, 'batchjob-image')),
  },
});

const task = new sfn.Task(this, 'Submit Job', {
  task: new tasks.RunBatchJob({
    jobDefinition: batchJobDefinition,
    jobName: 'MyJob',
    jobQueue: batchQueue,
  }),
});
```

## DynamoDB

You can call DynamoDB APIs from a `Task` state.
Read more about calling DynamoDB APIs [here](https://docs.aws.amazon.com/step-functions/latest/dg/connect-ddb.html)

### GetItem

The [GetItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html) operation returns a set of attributes for the item with the given primary key.

```ts
new sfn.Task(this, 'Get Item', {
  task: tasks.CallDynamoDB.getItem({
    partitionKey: {
      name: 'messageId',
      value: new tasks.DynamoAttributeValue().withS('message-007'),
    },
    tableName: 'my-table',
  }),
});
```

### PutItem

The [PutItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html) operation creates a new item, or replaces an old item with a new item.

```ts
new sfn.Task(this, 'PutItem', {
  task: tasks.CallDynamoDB.putItem({
    item: {
      MessageId: new tasks.DynamoAttributeValue().withS('message-007'),
      Text: new tasks.DynamoAttributeValue().withS(sfn.Data.stringAt('$.bar')),
      TotalCount: new tasks.DynamoAttributeValue().withN('10'),
    },
    tableName: 'my-table',
  }),
});
```

### DeleteItem

The [DeleteItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html) operation deletes a single item in a table by primary key.

```ts
new sfn.Task(this, 'DeleteItem', {
  task: tasks.CallDynamoDB.deleteItem({
    partitionKey: {
      name: 'MessageId',
      value: new tasks.DynamoAttributeValue().withS('message-007'),
    },
    tableName: 'my-table',
  }),
  resultPath: 'DISCARD',
});
```

### UpdateItem

The [UpdateItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html) operation edits an existing item's attributes, or adds a new item
to the table if it does not already exist.

```ts
const updateItemTask = new sfn.Task(this, 'UpdateItem', {
  task: tasks.CallDynamoDB.updateItem({
    partitionKey: {
      name: 'MessageId',
      value: new tasks.DynamoAttributeValue().withS('message-007'),
    },
    tableName: 'my-table',
    expressionAttributeValues: {
      ':val': new tasks.DynamoAttributeValue().withN(sfn.Data.stringAt('$.Item.TotalCount.N')),
      ':rand': new tasks.DynamoAttributeValue().withN('20'),
    },
    updateExpression: 'SET TotalCount = :val + :rand',
  }),
});
```

## ECS

Step Functions supports [ECS/Fargate](https://docs.aws.amazon.com/step-functions/latest/dg/connect-ecs.html) through the service integration pattern.

### RunTask

[RunTask](https://docs.aws.amazon.com/step-functions/latest/dg/connect-ecs.html) starts a new task using the specified task definition.

```ts
import * as ecs from '@aws-cdk/aws-ecs';

// See examples in ECS library for initialization of 'cluster' and 'taskDefinition'

new ecs.RunEcsFargateTask({
  cluster,
  taskDefinition,
  containerOverrides: [
    {
      containerName: 'TheContainer',
      environment: [
        {
          name: 'CONTAINER_INPUT',
          value: Data.stringAt('$.valueFromStateData'),
        }
      ]
    }
  ]
});

fargateTask.connections.allowToDefaultPort(rdsCluster, 'Read the database');

new sfn.Task(this, 'CallFargate', {
  task: fargateTask
});
```

## EMR

Step Functions supports Amazon EMR through the service integration pattern.
The service integration APIs correspond to Amazon EMR APIs but differ in the
parameters that are used.

[Read more](https://docs.aws.amazon.com/step-functions/latest/dg/connect-emr.html) about the differences when using these service integrations.

### Create Cluster

Creates and starts running a cluster (job flow).
Corresponds to the [`runJobFlow`](https://docs.aws.amazon.com/emr/latest/APIReference/API_RunJobFlow.html) API in EMR.

```ts

const clusterRole = new iam.Role(stack, 'ClusterRole', {
  assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
});

const serviceRole = new iam.Role(stack, 'ServiceRole', {
  assumedBy: new iam.ServicePrincipal('elasticmapreduce.amazonaws.com'),
});

const autoScalingRole = new iam.Role(stack, 'AutoScalingRole', {
  assumedBy: new iam.ServicePrincipal('elasticmapreduce.amazonaws.com'),
});

autoScalingRole.assumeRolePolicy?.addStatements(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    principals: [
      new iam.ServicePrincipal('application-autoscaling.amazonaws.com'),
    ],
    actions: [
      'sts:AssumeRole',
    ],
  });
)

new sfn.Task(stack, 'Create Cluster', {
  task: new tasks.EmrCreateCluster({
    instances: {},
    clusterRole,
    name: sfn.TaskInput.fromDataAt('$.ClusterName').value,
    serviceRole,
    autoScalingRole,
    integrationPattern: sfn.ServiceIntegrationPattern.FIRE_AND_FORGET,
  }),
});
```

### Termination Protection

Locks a cluster (job flow) so the EC2 instances in the cluster cannot be
terminated by user intervention, an API call, or a job-flow error.

Corresponds to the [`setTerminationProtection`](https://docs.aws.amazon.com/step-functions/latest/dg/connect-emr.html) API in EMR.

```ts
new sfn.Task(stack, 'Task', {
  task: new tasks.EmrSetClusterTerminationProtection({
    clusterId: 'ClusterId',
    terminationProtected: false,
  }),
});
```

### Terminate Cluster

Shuts down a cluster (job flow).
Corresponds to the [`terminateJobFlows`](https://docs.aws.amazon.com/emr/latest/APIReference/API_TerminateJobFlows.html) API in EMR.

```ts
new sfn.Task(stack, 'Task', {
  task: new tasks.EmrTerminateCluster({
    clusterId: 'ClusterId'
  }),
});
```

### Add Step

Adds a new step to a running cluster.
Corresponds to the [`addJobFlowSteps`](https://docs.aws.amazon.com/emr/latest/APIReference/API_AddJobFlowSteps.html) API in EMR.

```ts
new sfn.Task(stack, 'Task', {
  task: new tasks.EmrAddStep({
    clusterId: 'ClusterId',
    name: 'StepName',
    jar: 'Jar',
    actionOnFailure: tasks.ActionOnFailure.CONTINUE,
  }),
});
```

### Cancel Step

Cancels a pending step in a running cluster.
Corresponds to the [`cancelSteps`](https://docs.aws.amazon.com/emr/latest/APIReference/API_CancelSteps.html) API in EMR.

```ts
new sfn.Task(stack, 'Task', {
  task: new tasks.EmrCancelStep({
    clusterId: 'ClusterId',
    stepId: 'StepId',
  }),
});
```

### Modify Instance Fleet

Modifies the target On-Demand and target Spot capacities for the instance
fleet with the specified InstanceFleetName.

Corresponds to the [`modifyInstanceFleet`](https://docs.aws.amazon.com/emr/latest/APIReference/API_ModifyInstanceFleet.html) API in EMR.

```ts
new sfn.Task(stack, 'Task', {
  task: new tasks.EmrModifyInstanceFleetByName({
    clusterId: 'ClusterId',
    instanceFleetName: 'InstanceFleetName',
    targetOnDemandCapacity: 2,
    targetSpotCapacity: 0,
  }),
});
```

### Modify Instance Group

Modifies the number of nodes and configuration settings of an instance group.

Corresponds to the [`modifyInstanceGroups`](https://docs.aws.amazon.com/emr/latest/APIReference/API_ModifyInstanceGroups.html) API in EMR.

```ts
new sfn.Task(stack, 'Task', {
  task: new tasks.EmrModifyInstanceGroupByName({
    clusterId: 'ClusterId',
    instanceGroupName: sfn.Data.stringAt('$.InstanceGroupName'),
    instanceGroup: {
      instanceCount: 1,
    },
  }),
});
```

## Glue

Step Functions supports [AWS Glue](https://docs.aws.amazon.com/step-functions/latest/dg/connect-glue.html) through the service integration pattern.

You can call the [`StartJobRun`](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-jobs-runs.html#aws-glue-api-jobs-runs-StartJobRun) API from a `Task` state.

```ts
new sfn.Task(stack, 'Task', {
  task: new tasks.RunGlueJobTask(jobName, {
    arguments: {
      key: 'value',
    },
    timeout: cdk.Duration.minutes(30),
    notifyDelayAfter: cdk.Duration.minutes(5),
  }),
});
```

## Lambda

[Invoke](https://docs.aws.amazon.com/lambda/latest/dg/API_Invoke.html) a Lambda function.

You can specify the input to your Lambda function through the `payload` attribute.
By default, Step Functions invokes Lambda function with the state input (JSON path '$')
as the input.

The following snippet invokes a Lambda Function with the state input as the payload
by referencing the `$` path.

```ts
new sfn.Task(this, 'Invoke with state input');
```

When a function is invoked, the Lambda service sends  [these response
elements](https://docs.aws.amazon.com/lambda/latest/dg/API_Invoke.html#API_Invoke_ResponseElements)
back.

⚠️ The response from the Lambda function is in an attribute called `Payload`

The following snippet invokes a Lambda Function by referencing the `$.Payload` path
to reference the output of a Lambda executed before it.

```ts
new sfn.Task(this, 'Invoke with empty object as payload', {
  task: new tasks.RunLambdaTask(myLambda, {
    payload: sfn.TaskInput.fromObject({})
  }),
});

new sfn.Task(this, 'Invoke with payload field in the state input', {
  task: new tasks.RunLambdaTask(myOtherLambda, {
    payload: sfn.TaskInput.fromDataAt('$.Payload'),
  }),
});
```

The following snippet invokes a Lambda and sets the task output to only include
the Lambda function response.

```ts
new sfn.Task(this, 'Invoke and set function response as task output', {
  task: new tasks.RunLambdaTask(myLambda, {
    payload: sfn.TaskInput.fromDataAt('$'),
  }),
  outputPath: '$.Payload',
});
```

You can have Step Functions pause a task, and wait for an external process to
return a task token. Read more about the [callback pattern](https://docs.aws.amazon.com/step-functions/latest/dg/callback-task-sample-sqs.html#call-back-lambda-example)

To use the callback pattern, set the `token` property on the task. Call the Step
Functions `SendTaskSuccess` or `SendTaskFailure` APIs with the token to
indicate that the task has completed and the state machine should resume execution.

The following snippet invokes a Lambda with the task token as part of the input
to the Lambda.

```ts
  const task = new sfn.Task(stack, 'Invoke with callback', {
    task: new tasks.RunLambdaTask(myLambda, {
      integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
      payload: {
        token: sfn.Context.taskToken,
        input: sfn.TaskInput.fromDataAt('$.someField'),
      }
    })
  });
```

⚠️ The task will pause until it receives that task token back with a `SendTaskSuccess` or `SendTaskFailure`
call. Learn more about [Callback with the Task
Token](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-wait-token).

## SageMaker

Step Functions supports [AWS SageMaker](https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html) through the service integration pattern.

### Create Training Job

You can call the [`CreateTrainingJob`](https://docs.aws.amazon.com/sagemaker/latest/dg/API_CreateTrainingJob.html) API from a `Task` state.

```ts
new sfn.Task(stack, 'TrainSagemaker', {
  task: new tasks.SagemakerTrainTask({
    trainingJobName: sfn.Data.stringAt('$.JobName'),
    role,
    algorithmSpecification: {
      algorithmName: 'BlazingText',
      trainingInputMode: tasks.InputMode.FILE,
    },
    inputDataConfig: [
      {
        channelName: 'train',
        dataSource: {
          s3DataSource: {
            s3DataType: tasks.S3DataType.S3_PREFIX,
            s3Location: tasks.S3Location.fromJsonExpression('$.S3Bucket'),
          },
        },
      },
    ],
    outputDataConfig: {
      s3OutputLocation: tasks.S3Location.fromBucket(s3.Bucket.fromBucketName(stack, 'Bucket', 'mybucket'), 'myoutputpath'),
    },
    resourceConfig: {
      instanceCount: 1,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.P3, ec2.InstanceSize.XLARGE2),
      volumeSizeInGB: 50,
    },
    stoppingCondition: {
      maxRuntime: cdk.Duration.hours(1),
    },
  }),
});
```

### Create Transform Job

You can call the [`CreateTransformJob`](https://docs.aws.amazon.com/sagemaker/latest/dg/API_CreateTransformJob.html) API from a `Task` state.

```ts
const transformJob = new tasks.SagemakerTransformTask(
    transformJobName: "MyTransformJob",
    modelName: "MyModelName",
    role,
    transformInput: {
        transformDataSource: {
            s3DataSource: {
                s3Uri: 's3://inputbucket/train',
                s3DataType: S3DataType.S3Prefix,
            }
        }
    },
    transformOutput: {
        s3OutputPath: 's3://outputbucket/TransformJobOutputPath',
    },
    transformResources: {
        instanceCount: 1,
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.XLarge),
});

const task = new sfn.Task(this, 'Batch Inference', {
    task: transformJob
});
```

## SNS

Step Functions supports [Amazon SNS](https://docs.aws.amazon.com/step-functions/latest/dg/connect-sns.html) through the service integration pattern.

You can call the [`Publish`](https://docs.aws.amazon.com/sns/latest/api/API_Publish.html) API from a `Task` state to publish to an SNS topic.

```ts
import * as sns from '@aws-cdk/aws-sns';

// ...

const topic = new sns.Topic(this, 'Topic');

// Use a field from the execution data as message.
const task1 = new sfn.Task(this, 'Publish1', {
    task: new tasks.PublishToTopic(topic, {
        integrationPattern: sfn.ServiceIntegrationPattern.FIRE_AND_FORGET,
        message: TaskInput.fromDataAt('$.state.message'),
    })
});

// Combine a field from the execution data with
// a literal object.
const task2 = new sfn.Task(this, 'Publish2', {
    task: new tasks.PublishToTopic(topic, {
        message: TaskInput.fromObject({
            field1: 'somedata',
            field2: Data.stringAt('$.field2'),
        })
    })
});
```

## Step Functions

You can manage [AWS Step Functions](https://docs.aws.amazon.com/step-functions/latest/dg/connect-stepfunctions.html) executions.

AWS Step Functions supports it's own [`StartExecution`](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html) API as a service integration.

```ts
// Define a state machine with one Pass state
const child = new sfn.StateMachine(stack, 'ChildStateMachine', {
    definition: sfn.Chain.start(new sfn.Pass(stack, 'PassState')),
});

// Include the state machine in a Task state with callback pattern
const task = new sfn.Task(stack, 'ChildTask', {
  task: new tasks.ExecuteStateMachine(child, {
    integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
    input: {
      token: sfn.Context.taskToken,
      foo: 'bar'
    },
    name: 'MyExecutionName'
  })
});

// Define a second state machine with the Task state above
new sfn.StateMachine(stack, 'ParentStateMachine', {
  definition: task
});
```

## SQS

Step Functions supports [Amazon SQS](https://docs.aws.amazon.com/step-functions/latest/dg/connect-sqs.html)

You can call the [`SendMessage`](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SendMessage.html) API from a `Task` state
to send a message to an SQS queue.

```ts
import * as sqs from '@aws-cdk/aws-sqs';

// ...

const queue = new sns.Queue(this, 'Queue');

// Use a field from the execution data as message.
const task1 = new sfn.Task(this, 'Send1', {
    task: new tasks.SendToQueue(queue, {
        messageBody: TaskInput.fromDataAt('$.message'),
        // Only for FIFO queues
        messageGroupId: '1234'
    })
});

// Combine a field from the execution data with
// a literal object.
const task2 = new sfn.Task(this, 'Send2', {
    task: new tasks.SendToQueue(queue, {
        messageBody: TaskInput.fromObject({
            field1: 'somedata',
            field2: Data.stringAt('$.field2'),
        }),
        // Only for FIFO queues
        messageGroupId: '1234'
    })
});
```
