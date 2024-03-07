# Tasks for AWS Step Functions


[AWS Step Functions](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html) is a web service that enables you to coordinate the
components of distributed applications and microservices using visual workflows.
You build applications from individual components that each perform a discrete
function, or task, allowing you to scale and change applications quickly.

A [Task](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-task-state.html) state represents a single unit of work performed by a state machine.
All work in your state machine is performed by tasks.  This module contains a collection of classes that allow you to call various AWS services
from your Step Functions state machine.

Be sure to familiarize yourself with the [`aws-stepfunctions` module documentation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_stepfunctions-readme.html) first.

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

## Table Of Contents

- [Tasks for AWS Step Functions](#tasks-for-aws-step-functions)
  - [Table Of Contents](#table-of-contents)
  - [Paths](#paths)
  - [Evaluate Expression](#evaluate-expression)
  - [API Gateway](#api-gateway)
    - [Call REST API Endpoint](#call-rest-api-endpoint)
    - [Call HTTP API Endpoint](#call-http-api-endpoint)
    - [AWS SDK](#aws-sdk)
  - [Athena](#athena)
    - [StartQueryExecution](#startqueryexecution)
    - [GetQueryExecution](#getqueryexecution)
    - [GetQueryResults](#getqueryresults)
    - [StopQueryExecution](#stopqueryexecution)
  - [Batch](#batch)
    - [SubmitJob](#submitjob)
  - [Bedrock](#bedrock)
    - [InvokeModel](#invokemodel)
  - [CodeBuild](#codebuild)
    - [StartBuild](#startbuild)
  - [DynamoDB](#dynamodb)
    - [GetItem](#getitem)
    - [PutItem](#putitem)
    - [DeleteItem](#deleteitem)
    - [UpdateItem](#updateitem)
  - [ECS](#ecs)
    - [RunTask](#runtask)
      - [EC2](#ec2)
      - [Fargate](#fargate)
  - [EMR](#emr)
    - [Create Cluster](#create-cluster)
    - [Termination Protection](#termination-protection)
    - [Terminate Cluster](#terminate-cluster)
    - [Add Step](#add-step)
    - [Cancel Step](#cancel-step)
    - [Modify Instance Fleet](#modify-instance-fleet)
    - [Modify Instance Group](#modify-instance-group)
  - [EMR on EKS](#emr-on-eks)
    - [Create Virtual Cluster](#create-virtual-cluster)
    - [Delete Virtual Cluster](#delete-virtual-cluster)
    - [Start Job Run](#start-job-run)
  - [EKS](#eks)
    - [Call](#call)
  - [EventBridge](#eventbridge)
    - [Put Events](#put-events)
  - [Glue](#glue)
  - [Glue DataBrew](#glue-databrew)
  - [Lambda](#lambda)
  - [SageMaker](#sagemaker)
    - [Create Training Job](#create-training-job)
    - [Create Transform Job](#create-transform-job)
    - [Create Endpoint](#create-endpoint)
    - [Create Endpoint Config](#create-endpoint-config)
    - [Create Model](#create-model)
    - [Update Endpoint](#update-endpoint)
  - [SNS](#sns)
  - [Step Functions](#step-functions)
    - [Start Execution](#start-execution)
    - [Invoke Activity](#invoke-activity)
  - [SQS](#sqs)

## Paths

Learn more about input and output processing in Step Functions [here](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-input-output-filtering.html)

## Evaluate Expression

Use the `EvaluateExpression` to perform simple operations referencing state paths. The
`expression` referenced in the task will be evaluated in a Lambda function
(`eval()`). This allows you to not have to write Lambda code for simple operations.

Example: convert a wait time from milliseconds to seconds, concat this in a message and wait:

```ts
const convertToSeconds = new tasks.EvaluateExpression(this, 'Convert to seconds', {
  expression: '$.waitMilliseconds / 1000',
  resultPath: '$.waitSeconds',
});

const createMessage = new tasks.EvaluateExpression(this, 'Create message', {
  // Note: this is a string inside a string.
  expression: '`Now waiting ${$.waitSeconds} seconds...`',
  runtime: lambda.Runtime.NODEJS_LATEST,
  resultPath: '$.message',
});

const publishMessage = new tasks.SnsPublish(this, 'Publish message', {
  topic: new sns.Topic(this, 'cool-topic'),
  message: sfn.TaskInput.fromJsonPathAt('$.message'),
  resultPath: '$.sns',
});

const wait = new sfn.Wait(this, 'Wait', {
  time: sfn.WaitTime.secondsPath('$.waitSeconds'),
});

new sfn.StateMachine(this, 'StateMachine', {
  definition: convertToSeconds
    .next(createMessage)
    .next(publishMessage)
    .next(wait),
});
```

The `EvaluateExpression` supports a `runtime` prop to specify the Lambda
runtime to use to evaluate the expression. Currently, only runtimes
of the Node.js family are supported.

## API Gateway

Step Functions supports [API Gateway](https://docs.aws.amazon.com/step-functions/latest/dg/connect-api-gateway.html) through the service integration pattern.

HTTP APIs are designed for low-latency, cost-effective integrations with AWS services, including AWS Lambda, and HTTP endpoints.
HTTP APIs support OIDC and OAuth 2.0 authorization, and come with built-in support for CORS and automatic deployments.
Previous-generation REST APIs currently offer more features. More details can be found [here](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html).

### Call REST API Endpoint

The `CallApiGatewayRestApiEndpoint` calls the REST API endpoint.

```ts
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
const restApi = new apigateway.RestApi(this, 'MyRestApi');

const invokeTask = new tasks.CallApiGatewayRestApiEndpoint(this, 'Call REST API', {
  api: restApi,
  stageName: 'prod',
  method: tasks.HttpMethod.GET,
});
```

Be aware that the header values must be arrays. When passing the Task Token
in the headers field `WAIT_FOR_TASK_TOKEN` integration, use
`JsonPath.array()` to wrap the token in an array:

```ts
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
declare const api: apigateway.RestApi;

new tasks.CallApiGatewayRestApiEndpoint(this, 'Endpoint', {
  api,
  stageName: 'Stage',
  method: tasks.HttpMethod.PUT,
  integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  headers: sfn.TaskInput.fromObject({
    TaskToken: sfn.JsonPath.array(sfn.JsonPath.taskToken),
  }),
});
```

### Call HTTP API Endpoint

The `CallApiGatewayHttpApiEndpoint` calls the HTTP API endpoint.

```ts
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
const httpApi = new apigatewayv2.HttpApi(this, 'MyHttpApi');

const invokeTask = new tasks.CallApiGatewayHttpApiEndpoint(this, 'Call HTTP API', {
  apiId: httpApi.apiId,
  apiStack: Stack.of(httpApi),
  method: tasks.HttpMethod.GET,
});
```

### AWS SDK

Step Functions supports calling [AWS service's API actions](https://docs.aws.amazon.com/step-functions/latest/dg/supported-services-awssdk.html)
through the service integration pattern.

You can use Step Functions' AWS SDK integrations to call any of the over two hundred AWS services
directly from your state machine, giving you access to over nine thousand API actions.

```ts
declare const myBucket: s3.Bucket;
const getObject = new tasks.CallAwsService(this, 'GetObject', {
  service: 's3',
  action: 'getObject',
  parameters: {
    Bucket: myBucket.bucketName,
    Key: sfn.JsonPath.stringAt('$.key')
  },
  iamResources: [myBucket.arnForObjects('*')],
});
```

Use camelCase for actions and PascalCase for parameter names.

The task automatically adds an IAM statement to the state machine role's policy based on the
service and action called. The resources for this statement must be specified in `iamResources`.

Use the `iamAction` prop to manually specify the IAM action name in the case where the IAM
action name does not match with the API service/action name:

```ts
const listBuckets = new tasks.CallAwsService(this, 'ListBuckets', {
  service: 's3',
  action: 'listBuckets',
  iamResources: ['*'],
  iamAction: 's3:ListAllMyBuckets',
});
```

Use the `additionalIamStatements` prop to pass additional IAM statements that will be added to the
state machine role's policy. Use it in the case where the call requires more than a single statement
to be executed:

```ts
const detectLabels = new tasks.CallAwsService(this, 'DetectLabels', {
  service: 'rekognition',
  action: 'detectLabels',
  iamResources: ['*'],
  additionalIamStatements: [
    new iam.PolicyStatement({
      actions: ['s3:getObject'],
      resources: ['arn:aws:s3:::my-bucket/*'],
    }),
  ],
});
```

## Athena

Step Functions supports [Athena](https://docs.aws.amazon.com/step-functions/latest/dg/connect-athena.html) through the service integration pattern.

### StartQueryExecution

The [StartQueryExecution](https://docs.aws.amazon.com/athena/latest/APIReference/API_StartQueryExecution.html) API runs the SQL query statement.

```ts
const startQueryExecutionJob = new tasks.AthenaStartQueryExecution(this, 'Start Athena Query', {
  queryString: sfn.JsonPath.stringAt('$.queryString'),
  queryExecutionContext: {
    databaseName: 'mydatabase',
  },
  resultConfiguration: {
    encryptionConfiguration: {
      encryptionOption: tasks.EncryptionOption.S3_MANAGED,
    },
    outputLocation: {
      bucketName: 'query-results-bucket',
      objectKey: 'folder',
    },
  },
  executionParameters: ['param1', 'param2'],
});
```

### GetQueryExecution

The [GetQueryExecution](https://docs.aws.amazon.com/athena/latest/APIReference/API_GetQueryExecution.html) API gets information about a single execution of a query.

```ts
const getQueryExecutionJob = new tasks.AthenaGetQueryExecution(this, 'Get Query Execution', {
  queryExecutionId: sfn.JsonPath.stringAt('$.QueryExecutionId'),
});
```

### GetQueryResults

The [GetQueryResults](https://docs.aws.amazon.com/athena/latest/APIReference/API_GetQueryResults.html) API that streams the results of a single query execution specified by QueryExecutionId from S3.

```ts
const getQueryResultsJob = new tasks.AthenaGetQueryResults(this, 'Get Query Results', {
  queryExecutionId: sfn.JsonPath.stringAt('$.QueryExecutionId'),
});
```

### StopQueryExecution

The [StopQueryExecution](https://docs.aws.amazon.com/athena/latest/APIReference/API_StopQueryExecution.html) API that stops a query execution.

```ts
const stopQueryExecutionJob = new tasks.AthenaStopQueryExecution(this, 'Stop Query Execution', {
  queryExecutionId: sfn.JsonPath.stringAt('$.QueryExecutionId'),
});
```

## Batch

Step Functions supports [Batch](https://docs.aws.amazon.com/step-functions/latest/dg/connect-batch.html) through the service integration pattern.

### SubmitJob

The [SubmitJob](https://docs.aws.amazon.com/batch/latest/APIReference/API_SubmitJob.html) API submits an AWS Batch job from a job definition.

```ts
import * as batch from 'aws-cdk-lib/aws-batch';
declare const batchJobDefinition: batch.EcsJobDefinition;
declare const batchQueue: batch.JobQueue;

const task = new tasks.BatchSubmitJob(this, 'Submit Job', {
  jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
  jobName: 'MyJob',
  jobQueueArn: batchQueue.jobQueueArn,
});
```

## Bedrock

Step Functions supports [Bedrock](https://docs.aws.amazon.com/step-functions/latest/dg/connect-bedrock.html) through the service integration pattern.

### InvokeModel

The [InvokeModel](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InvokeModel.html) API
invokes the specified Bedrock model to run inference using the input provided.
The format of the input body and the response body depend on the model selected.

```ts
import * as bedrock from 'aws-cdk-lib/aws-bedrock';

const model = bedrock.FoundationModel.fromFoundationModelId(
  this,
  'Model',
  bedrock.FoundationModelIdentifier.AMAZON_TITAN_TEXT_G1_EXPRESS_V1,
);

const task = new tasks.BedrockInvokeModel(this, 'Prompt Model', {
  model,
  body: sfn.TaskInput.fromObject(
    {
      inputText: 'Generate a list of five first names.',
      textGenerationConfig: {
        maxTokenCount: 100,
        temperature: 1,
      },
    },
  ),
  resultSelector: {
    names: sfn.JsonPath.stringAt('$.Body.results[0].outputText'),
  },
});
```

## CodeBuild

Step Functions supports [CodeBuild](https://docs.aws.amazon.com/step-functions/latest/dg/connect-codebuild.html) through the service integration pattern.

### StartBuild

[StartBuild](https://docs.aws.amazon.com/codebuild/latest/APIReference/API_StartBuild.html) starts a CodeBuild Project by Project Name.

```ts
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

const codebuildProject = new codebuild.Project(this, 'Project', {
  projectName: 'MyTestProject',
  buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
    phases: {
      build: {
        commands: [
          'echo "Hello, CodeBuild!"',
        ],
      },
    },
  }),
});

const task = new tasks.CodeBuildStartBuild(this, 'Task', {
  project: codebuildProject,
  integrationPattern: sfn.IntegrationPattern.RUN_JOB,
  environmentVariablesOverride: {
    ZONE: {
      type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
      value: sfn.JsonPath.stringAt('$.envVariables.zone'),
    },
  },
});
```

## DynamoDB

You can call DynamoDB APIs from a `Task` state.
Read more about calling DynamoDB APIs [here](https://docs.aws.amazon.com/step-functions/latest/dg/connect-ddb.html)

### GetItem

The [GetItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html) operation returns a set of attributes for the item with the given primary key.

```ts
declare const myTable: dynamodb.Table;
new tasks.DynamoGetItem(this, 'Get Item', {
  key: { messageId: tasks.DynamoAttributeValue.fromString('message-007') },
  table: myTable,
});
```

### PutItem

The [PutItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html) operation creates a new item, or replaces an old item with a new item.

```ts
declare const myTable: dynamodb.Table;
new tasks.DynamoPutItem(this, 'PutItem', {
  item: {
    MessageId: tasks.DynamoAttributeValue.fromString('message-007'),
    Text: tasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.bar')),
    TotalCount: tasks.DynamoAttributeValue.fromNumber(10),
  },
  table: myTable,
});
```

### DeleteItem

The [DeleteItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html) operation deletes a single item in a table by primary key.

```ts
declare const myTable: dynamodb.Table;
new tasks.DynamoDeleteItem(this, 'DeleteItem', {
  key: { MessageId: tasks.DynamoAttributeValue.fromString('message-007') },
  table: myTable,
  resultPath: sfn.JsonPath.DISCARD,
});
```

### UpdateItem

The [UpdateItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html) operation edits an existing item's attributes, or adds a new item
to the table if it does not already exist.

```ts
declare const myTable: dynamodb.Table;
new tasks.DynamoUpdateItem(this, 'UpdateItem', {
  key: {
    MessageId: tasks.DynamoAttributeValue.fromString('message-007')
  },
  table: myTable,
  expressionAttributeValues: {
    ':val': tasks.DynamoAttributeValue.numberFromString(sfn.JsonPath.stringAt('$.Item.TotalCount.N')),
    ':rand': tasks.DynamoAttributeValue.fromNumber(20),
  },
  updateExpression: 'SET TotalCount = :val + :rand',
});
```

## ECS

Step Functions supports [ECS/Fargate](https://docs.aws.amazon.com/step-functions/latest/dg/connect-ecs.html) through the service integration pattern.

### RunTask

[RunTask](https://docs.aws.amazon.com/step-functions/latest/dg/connect-ecs.html) starts a new task using the specified task definition.

#### EC2

The EC2 launch type allows you to run your containerized applications on a cluster
of Amazon EC2 instances that you manage.

When a task that uses the EC2 launch type is launched, Amazon ECS must determine where
to place the task based on the requirements specified in the task definition, such as
CPU and memory. Similarly, when you scale down the task count, Amazon ECS must determine
which tasks to terminate. You can apply task placement strategies and constraints to
customize how Amazon ECS places and terminates tasks. Learn more about [task placement](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement.html)

The latest ACTIVE revision of the passed task definition is used for running the task.

The following example runs a job from a task definition on EC2

```ts
const vpc = ec2.Vpc.fromLookup(this, 'Vpc', {
  isDefault: true,
});

const cluster = new ecs.Cluster(this, 'Ec2Cluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro'),
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
});

const taskDefinition = new ecs.TaskDefinition(this, 'TD', {
  compatibility: ecs.Compatibility.EC2,
});

taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('foo/bar'),
  memoryLimitMiB: 256,
});

const runTask = new tasks.EcsRunTask(this, 'Run', {
  integrationPattern: sfn.IntegrationPattern.RUN_JOB,
  cluster,
  taskDefinition,
  launchTarget: new tasks.EcsEc2LaunchTarget({
    placementStrategies: [
      ecs.PlacementStrategy.spreadAcrossInstances(),
      ecs.PlacementStrategy.packedByCpu(),
      ecs.PlacementStrategy.randomly(),
    ],
    placementConstraints: [
      ecs.PlacementConstraint.memberOf('blieptuut'),
    ],
  }),
  propagatedTagSource: ecs.PropagatedTagSource.TASK_DEFINITION,
});
```

#### Fargate

AWS Fargate is a serverless compute engine for containers that works with Amazon
Elastic Container Service (ECS). Fargate makes it easy for you to focus on building
your applications. Fargate removes the need to provision and manage servers, lets you
specify and pay for resources per application, and improves security through application
isolation by design. Learn more about [Fargate](https://aws.amazon.com/fargate/)

The Fargate launch type allows you to run your containerized applications without the need
to provision and manage the backend infrastructure. Just register your task definition and
Fargate launches the container for you. The latest ACTIVE revision of the passed
task definition is used for running the task. Learn more about
[Fargate Versioning](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_DescribeTaskDefinition.html)

The following example runs a job from a task definition on Fargate

```ts
const vpc = ec2.Vpc.fromLookup(this, 'Vpc', {
  isDefault: true,
});

const cluster = new ecs.Cluster(this, 'FargateCluster', { vpc });

const taskDefinition = new ecs.TaskDefinition(this, 'TD', {
  memoryMiB: '512',
  cpu: '256',
  compatibility: ecs.Compatibility.FARGATE,
});

const containerDefinition = taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('foo/bar'),
  memoryLimitMiB: 256,
});

const runTask = new tasks.EcsRunTask(this, 'RunFargate', {
  integrationPattern: sfn.IntegrationPattern.RUN_JOB,
  cluster,
  taskDefinition,
  assignPublicIp: true,
  containerOverrides: [{
    containerDefinition,
    environment: [{ name: 'SOME_KEY', value: sfn.JsonPath.stringAt('$.SomeKey') }],
  }],
  launchTarget: new tasks.EcsFargateLaunchTarget(),
  propagatedTagSource: ecs.PropagatedTagSource.TASK_DEFINITION,
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
const clusterRole = new iam.Role(this, 'ClusterRole', {
  assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
});

const serviceRole = new iam.Role(this, 'ServiceRole', {
  assumedBy: new iam.ServicePrincipal('elasticmapreduce.amazonaws.com'),
});

const autoScalingRole = new iam.Role(this, 'AutoScalingRole', {
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
  }));
)

new tasks.EmrCreateCluster(this, 'Create Cluster', {
  instances: {},
  clusterRole,
  name: sfn.TaskInput.fromJsonPathAt('$.ClusterName').value,
  serviceRole,
  autoScalingRole,
});
```

You can use the launch specification for On-Demand and Spot instances in the fleet.

```ts
new tasks.EmrCreateCluster(this, 'OnDemandSpecification', {
  instances: {
    instanceFleets: [{
      instanceFleetType: tasks.EmrCreateCluster.InstanceRoleType.MASTER,
      launchSpecifications: {
        onDemandSpecification: {
          allocationStrategy: tasks.EmrCreateCluster.OnDemandAllocationStrategy.LOWEST_PRICE,
        },
      },
    }],
  },
  name: 'OnDemandCluster',
  integrationPattern: sfn.IntegrationPattern.RUN_JOB,
});

new tasks.EmrCreateCluster(this, 'SpotSpecification', {
  instances: {
    instanceFleets: [{
      instanceFleetType: tasks.EmrCreateCluster.InstanceRoleType.MASTER,
      launchSpecifications: {
        spotSpecification: {
          allocationStrategy: tasks.EmrCreateCluster.SpotAllocationStrategy.CAPACITY_OPTIMIZED,
          timeoutAction: tasks.EmrCreateCluster.SpotTimeoutAction.TERMINATE_CLUSTER,
          timeout: Duration.minutes(5),
        },
      },
    }],
  },
  name: 'SpotCluster',
  integrationPattern: sfn.IntegrationPattern.RUN_JOB,
});
```

If you want to run multiple steps in [parallel](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-concurrent-steps.html),
you can specify the `stepConcurrencyLevel` property. The concurrency range is between 1
and 256 inclusive, where the default concurrency of 1 means no step concurrency is allowed.
`stepConcurrencyLevel` requires the EMR release label to be 5.28.0 or above.

```ts
new tasks.EmrCreateCluster(this, 'Create Cluster', {
  instances: {},
  name: sfn.TaskInput.fromJsonPathAt('$.ClusterName').value,
  stepConcurrencyLevel: 10,
});
```

### Termination Protection

Locks a cluster (job flow) so the EC2 instances in the cluster cannot be
terminated by user intervention, an API call, or a job-flow error.

Corresponds to the [`setTerminationProtection`](https://docs.aws.amazon.com/step-functions/latest/dg/connect-emr.html) API in EMR.

```ts
new tasks.EmrSetClusterTerminationProtection(this, 'Task', {
  clusterId: 'ClusterId',
  terminationProtected: false,
});
```

### Terminate Cluster

Shuts down a cluster (job flow).
Corresponds to the [`terminateJobFlows`](https://docs.aws.amazon.com/emr/latest/APIReference/API_TerminateJobFlows.html) API in EMR.

```ts
new tasks.EmrTerminateCluster(this, 'Task', {
  clusterId: 'ClusterId',
});
```

### Add Step

Adds a new step to a running cluster.
Corresponds to the [`addJobFlowSteps`](https://docs.aws.amazon.com/emr/latest/APIReference/API_AddJobFlowSteps.html) API in EMR.

```ts
new tasks.EmrAddStep(this, 'Task', {
  clusterId: 'ClusterId',
  name: 'StepName',
  jar: 'Jar',
  actionOnFailure: tasks.ActionOnFailure.CONTINUE,
});
```

To specify a custom runtime role use the `executionRoleArn` property.

**Note:** The EMR cluster must be created with a security configuration and the runtime role must have a specific trust policy. 
See this [blog post](https://aws.amazon.com/blogs/big-data/introducing-runtime-roles-for-amazon-emr-steps-use-iam-roles-and-aws-lake-formation-for-access-control-with-amazon-emr/) for more details.

```ts
import * as emr from 'aws-cdk-lib/aws-emr';

const cfnSecurityConfiguration = new emr.CfnSecurityConfiguration(this, 'EmrSecurityConfiguration', {
  name: 'AddStepRuntimeRoleSecConfig',
  securityConfiguration: JSON.parse(`
    {
      "AuthorizationConfiguration": {
          "IAMConfiguration": {
              "EnableApplicationScopedIAMRole": true,
              "ApplicationScopedIAMRoleConfiguration": 
                  {
                      "PropagateSourceIdentity": true
                  }
          },
          "LakeFormationConfiguration": {
              "AuthorizedSessionTagValue": "Amazon EMR"
          }
      }
    }`),
});

const task = new tasks.EmrCreateCluster(this, 'Create Cluster', {
  instances: {},
  name: sfn.TaskInput.fromJsonPathAt('$.ClusterName').value,
  securityConfiguration: cfnSecurityConfiguration.name,
});

const executionRole = new iam.Role(this, 'Role', {
  assumedBy: new iam.ArnPrincipal(task.clusterRole.roleArn),
});

executionRole.assumeRolePolicy?.addStatements(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    principals: [
      task.clusterRole,
    ],
    actions: [
      'sts:SetSourceIdentity',
    ],
  }),
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    principals: [
      task.clusterRole,
    ],
    actions: [
      'sts:TagSession',
    ],
    conditions: {
      StringEquals: {
        'aws:RequestTag/LakeFormationAuthorizedCaller': 'Amazon EMR',
      },
    },
  }),
);

new tasks.EmrAddStep(this, 'Task', {
  clusterId: 'ClusterId',
  executionRoleArn: executionRole.roleArn,
  name: 'StepName',
  jar: 'Jar',
  actionOnFailure: tasks.ActionOnFailure.CONTINUE,
});
```

### Cancel Step

Cancels a pending step in a running cluster.
Corresponds to the [`cancelSteps`](https://docs.aws.amazon.com/emr/latest/APIReference/API_CancelSteps.html) API in EMR.

```ts
new tasks.EmrCancelStep(this, 'Task', {
  clusterId: 'ClusterId',
  stepId: 'StepId',
});
```

### Modify Instance Fleet

Modifies the target On-Demand and target Spot capacities for the instance
fleet with the specified InstanceFleetName.

Corresponds to the [`modifyInstanceFleet`](https://docs.aws.amazon.com/emr/latest/APIReference/API_ModifyInstanceFleet.html) API in EMR.

```ts
new tasks.EmrModifyInstanceFleetByName(this, 'Task', {
  clusterId: 'ClusterId',
  instanceFleetName: 'InstanceFleetName',
  targetOnDemandCapacity: 2,
  targetSpotCapacity: 0,
});
```

### Modify Instance Group

Modifies the number of nodes and configuration settings of an instance group.

Corresponds to the [`modifyInstanceGroups`](https://docs.aws.amazon.com/emr/latest/APIReference/API_ModifyInstanceGroups.html) API in EMR.

```ts
new tasks.EmrModifyInstanceGroupByName(this, 'Task', {
  clusterId: 'ClusterId',
  instanceGroupName: sfn.JsonPath.stringAt('$.InstanceGroupName'),
  instanceGroup: {
    instanceCount: 1,
  },
});
```

## EMR on EKS

Step Functions supports Amazon EMR on EKS through the service integration pattern.
The service integration APIs correspond to Amazon EMR on EKS APIs, but differ in the parameters that are used.

[Read more](https://docs.aws.amazon.com/step-functions/latest/dg/connect-emr-eks.html) about the differences when using these service integrations.

[Setting up](https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up.html) the EKS cluster is required.

### Create Virtual Cluster

The [CreateVirtualCluster](https://docs.aws.amazon.com/emr-on-eks/latest/APIReference/API_CreateVirtualCluster.html) API creates a single virtual cluster that's mapped to a single Kubernetes namespace.

The EKS cluster containing the Kubernetes namespace where the virtual cluster will be mapped can be passed in from the task input.

```ts
new tasks.EmrContainersCreateVirtualCluster(this, 'Create a Virtual Cluster', {
  eksCluster: tasks.EksClusterInput.fromTaskInput(sfn.TaskInput.fromText('clusterId')),
});
```

The EKS cluster can also be passed in directly.

```ts
import * as eks from 'aws-cdk-lib/aws-eks';

declare const eksCluster: eks.Cluster;

new tasks.EmrContainersCreateVirtualCluster(this, 'Create a Virtual Cluster', {
  eksCluster: tasks.EksClusterInput.fromCluster(eksCluster),
});
```

By default, the Kubernetes namespace that a virtual cluster maps to is "default", but a specific namespace within an EKS cluster can be selected.

```ts
new tasks.EmrContainersCreateVirtualCluster(this, 'Create a Virtual Cluster', {
  eksCluster: tasks.EksClusterInput.fromTaskInput(sfn.TaskInput.fromText('clusterId')),
  eksNamespace: 'specified-namespace',
});
```

### Delete Virtual Cluster

The [DeleteVirtualCluster](https://docs.aws.amazon.com/emr-on-eks/latest/APIReference/API_DeleteVirtualCluster.html) API deletes a virtual cluster.

```ts
new tasks.EmrContainersDeleteVirtualCluster(this, 'Delete a Virtual Cluster', {
  virtualClusterId: sfn.TaskInput.fromJsonPathAt('$.virtualCluster'),
});
```

### Start Job Run

The [StartJobRun](https://docs.aws.amazon.com/emr-on-eks/latest/APIReference/API_StartJobRun.html) API starts a job run. A job is a unit of work that you submit to Amazon EMR on EKS for execution. The work performed by the job can be defined by a Spark jar, PySpark script, or SparkSQL query. A job run is an execution of the job on the virtual cluster.

Required setup:

 - If not done already, follow the [steps](https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up.html) to setup EMR on EKS and [create an EKS Cluster](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-eks-readme.html#quick-start).
 - Enable [Cluster access](https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up-cluster-access.html)
 - Enable [IAM Role access](https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up-enable-IAM.html)

The following actions must be performed if the virtual cluster ID is supplied from the task input. Otherwise, if it is supplied statically in the state machine definition, these actions will be done automatically.

 - Create an [IAM role](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-iam.Role.html)
 - Update the [Role Trust Policy](https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up-trust-policy.html) of the Job Execution Role.

The job can be configured with spark submit parameters:

```ts
new tasks.EmrContainersStartJobRun(this, 'EMR Containers Start Job Run', {
  virtualCluster: tasks.VirtualClusterInput.fromVirtualClusterId('de92jdei2910fwedz'),
  releaseLabel: tasks.ReleaseLabel.EMR_6_2_0,
  jobDriver: {
    sparkSubmitJobDriver: {
      entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
      sparkSubmitParameters: '--conf spark.executor.instances=2 --conf spark.executor.memory=2G --conf spark.executor.cores=2 --conf spark.driver.cores=1',
    },
  },
});
```

Configuring the job can also be done via application configuration:

```ts
new tasks.EmrContainersStartJobRun(this, 'EMR Containers Start Job Run', {
  virtualCluster: tasks.VirtualClusterInput.fromVirtualClusterId('de92jdei2910fwedz'),
  releaseLabel: tasks.ReleaseLabel.EMR_6_2_0,
  jobName: 'EMR-Containers-Job',
  jobDriver: {
    sparkSubmitJobDriver: {
      entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
    },
  },
  applicationConfig: [{
    classification: tasks.Classification.SPARK_DEFAULTS,
    properties: {
      'spark.executor.instances': '1',
      'spark.executor.memory': '512M',
    },
  }],
});
```

Job monitoring can be enabled if `monitoring.logging` is set true. This automatically generates an S3 bucket and CloudWatch logs.

```ts
new tasks.EmrContainersStartJobRun(this, 'EMR Containers Start Job Run', {
  virtualCluster: tasks.VirtualClusterInput.fromVirtualClusterId('de92jdei2910fwedz'),
  releaseLabel: tasks.ReleaseLabel.EMR_6_2_0,
  jobDriver: {
    sparkSubmitJobDriver: {
      entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
      sparkSubmitParameters: '--conf spark.executor.instances=2 --conf spark.executor.memory=2G --conf spark.executor.cores=2 --conf spark.driver.cores=1',
    },
  },
  monitoring: {
    logging: true,
  },
});
```

Otherwise, providing monitoring for jobs with existing log groups and log buckets is also available.

```ts
import * as logs from 'aws-cdk-lib/aws-logs';

const logGroup = new logs.LogGroup(this, 'Log Group');
const logBucket = new s3.Bucket(this, 'S3 Bucket')

new tasks.EmrContainersStartJobRun(this, 'EMR Containers Start Job Run', {
  virtualCluster: tasks.VirtualClusterInput.fromVirtualClusterId('de92jdei2910fwedz'),
  releaseLabel: tasks.ReleaseLabel.EMR_6_2_0,
  jobDriver: {
    sparkSubmitJobDriver: {
      entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
      sparkSubmitParameters: '--conf spark.executor.instances=2 --conf spark.executor.memory=2G --conf spark.executor.cores=2 --conf spark.driver.cores=1',
    },
  },
  monitoring: {
    logGroup: logGroup,
    logBucket: logBucket,
  },
});
```

Users can provide their own existing Job Execution Role.

```ts
new tasks.EmrContainersStartJobRun(this, 'EMR Containers Start Job Run', {
  virtualCluster:tasks.VirtualClusterInput.fromTaskInput(sfn.TaskInput.fromJsonPathAt('$.VirtualClusterId')),
  releaseLabel: tasks.ReleaseLabel.EMR_6_2_0,
  jobName: 'EMR-Containers-Job',
  executionRole: iam.Role.fromRoleArn(this, 'Job-Execution-Role', 'arn:aws:iam::xxxxxxxxxxxx:role/JobExecutionRole'),
  jobDriver: {
    sparkSubmitJobDriver: {
      entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
      sparkSubmitParameters: '--conf spark.executor.instances=2 --conf spark.executor.memory=2G --conf spark.executor.cores=2 --conf spark.driver.cores=1',
    },
  },
});
```

## EKS

Step Functions supports Amazon EKS through the service integration pattern.
The service integration APIs correspond to Amazon EKS APIs.

[Read more](https://docs.aws.amazon.com/step-functions/latest/dg/connect-eks.html) about the differences when using these service integrations.

### Call

Read and write Kubernetes resource objects via a Kubernetes API endpoint.
Corresponds to the [`call`](https://docs.aws.amazon.com/step-functions/latest/dg/connect-eks.html) API in Step Functions Connector.

The following code snippet includes a Task state that uses eks:call to list the pods.

```ts
import * as eks from 'aws-cdk-lib/aws-eks';

const myEksCluster = new eks.Cluster(this, 'my sample cluster', {
  version: eks.KubernetesVersion.V1_18,
  clusterName: 'myEksCluster',
});

new tasks.EksCall(this, 'Call a EKS Endpoint', {
  cluster: myEksCluster,
  httpMethod: tasks.HttpMethods.GET,
  httpPath: '/api/v1/namespaces/default/pods',
});
```

## EventBridge

Step Functions supports Amazon EventBridge through the service integration pattern.
The service integration APIs correspond to Amazon EventBridge APIs.

[Read more](https://docs.aws.amazon.com/step-functions/latest/dg/connect-eventbridge.html) about the differences when using these service integrations.

### Put Events

Send events to an EventBridge bus.
Corresponds to the [`put-events`](https://docs.aws.amazon.com/step-functions/latest/dg/connect-eventbridge.html) API in Step Functions Connector.

The following code snippet includes a Task state that uses events:putevents to send an event to the default bus.

```ts
import * as events from 'aws-cdk-lib/aws-events';

const myEventBus = new events.EventBus(this, 'EventBus', {
  eventBusName: 'MyEventBus1',
});

new tasks.EventBridgePutEvents(this, 'Send an event to EventBridge', {
  entries: [{
    detail: sfn.TaskInput.fromObject({
      Message: 'Hello from Step Functions!',
    }),
    eventBus: myEventBus,
    detailType: 'MessageFromStepFunctions',
    source: 'step.functions',
  }],
});
```

## Glue

Step Functions supports [AWS Glue](https://docs.aws.amazon.com/step-functions/latest/dg/connect-glue.html) through the service integration pattern.

You can call the [`StartJobRun`](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-jobs-runs.html#aws-glue-api-jobs-runs-StartJobRun) API from a `Task` state.

```ts
new tasks.GlueStartJobRun(this, 'Task', {
  glueJobName: 'my-glue-job',
  arguments: sfn.TaskInput.fromObject({
    key: 'value',
  }),
  taskTimeout: sfn.Timeout.duration(Duration.minutes(30)),
  notifyDelayAfter: Duration.minutes(5),
});
```

## Glue DataBrew

Step Functions supports [AWS Glue DataBrew](https://docs.aws.amazon.com/step-functions/latest/dg/connect-databrew.html) through the service integration pattern.

You can call the [`StartJobRun`](https://docs.aws.amazon.com/databrew/latest/dg/API_StartJobRun.html) API from a `Task` state.

```ts
new tasks.GlueDataBrewStartJobRun(this, 'Task', {
  name: 'databrew-job',
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
declare const fn: lambda.Function;
new tasks.LambdaInvoke(this, 'Invoke with state input', {
  lambdaFunction: fn,
});
```

When a function is invoked, the Lambda service sends  [these response
elements](https://docs.aws.amazon.com/lambda/latest/dg/API_Invoke.html#API_Invoke_ResponseElements)
back.

⚠️ The response from the Lambda function is in an attribute called `Payload`

The following snippet invokes a Lambda Function by referencing the `$.Payload` path
to reference the output of a Lambda executed before it.

```ts
declare const fn: lambda.Function;
new tasks.LambdaInvoke(this, 'Invoke with empty object as payload', {
  lambdaFunction: fn,
  payload: sfn.TaskInput.fromObject({}),
});

// use the output of fn as input
new tasks.LambdaInvoke(this, 'Invoke with payload field in the state input', {
  lambdaFunction: fn,
  payload: sfn.TaskInput.fromJsonPathAt('$.Payload'),
});
```

The following snippet invokes a Lambda and sets the task output to only include
the Lambda function response.

```ts
declare const fn: lambda.Function;
new tasks.LambdaInvoke(this, 'Invoke and set function response as task output', {
  lambdaFunction: fn,
  outputPath: '$.Payload',
});
```

If you want to combine the input and the Lambda function response you can use
the `payloadResponseOnly` property and specify the `resultPath`. This will put the
Lambda function ARN directly in the "Resource" string, but it conflicts with the
integrationPattern, invocationType, clientContext, and qualifier properties.

```ts
declare const fn: lambda.Function;
new tasks.LambdaInvoke(this, 'Invoke and combine function response with task input', {
  lambdaFunction: fn,
  payloadResponseOnly: true,
  resultPath: '$.fn',
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
declare const fn: lambda.Function;
new tasks.LambdaInvoke(this, 'Invoke with callback', {
  lambdaFunction: fn,
  integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  payload: sfn.TaskInput.fromObject({
    token: sfn.JsonPath.taskToken,
    input: sfn.JsonPath.stringAt('$.someField'),
  }),
});
```

⚠️ The task will pause until it receives that task token back with a `SendTaskSuccess` or `SendTaskFailure`
call. Learn more about [Callback with the Task
Token](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-wait-token).

AWS Lambda can occasionally experience transient service errors. In this case, invoking Lambda
results in a 500 error, such as `ClientExecutionTimeoutException`, `ServiceException`, `AWSLambdaException`, or `SdkClientException`.
As a best practice, the `LambdaInvoke` task will retry on those errors with an interval of 2 seconds,
a back-off rate of 2 and 6 maximum attempts. Set the `retryOnServiceExceptions` prop to `false` to
disable this behavior.

## SageMaker

Step Functions supports [AWS SageMaker](https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html) through the service integration pattern.

If your training job or model uses resources from AWS Marketplace,
[network isolation is required](https://docs.aws.amazon.com/sagemaker/latest/dg/mkt-algo-model-internet-free.html).
To do so, set the `enableNetworkIsolation` property to `true` for `SageMakerCreateModel` or `SageMakerCreateTrainingJob`.

To set environment variables for the Docker container use the `environment` property.

### Create Training Job

You can call the [`CreateTrainingJob`](https://docs.aws.amazon.com/sagemaker/latest/dg/API_CreateTrainingJob.html) API from a `Task` state.

```ts
new tasks.SageMakerCreateTrainingJob(this, 'TrainSagemaker', {
  trainingJobName: sfn.JsonPath.stringAt('$.JobName'),
  algorithmSpecification: {
    algorithmName: 'BlazingText',
    trainingInputMode: tasks.InputMode.FILE,
  },
  inputDataConfig: [{
    channelName: 'train',
    dataSource: {
      s3DataSource: {
        s3DataType: tasks.S3DataType.S3_PREFIX,
        s3Location: tasks.S3Location.fromJsonExpression('$.S3Bucket'),
      },
    },
  }],
  outputDataConfig: {
    s3OutputLocation: tasks.S3Location.fromBucket(s3.Bucket.fromBucketName(this, 'Bucket', 'mybucket'), 'myoutputpath'),
  },
  resourceConfig: {
    instanceCount: 1,
    instanceType: new ec2.InstanceType(sfn.JsonPath.stringAt('$.InstanceType')),
    volumeSize: Size.gibibytes(50),
  }, // optional: default is 1 instance of EC2 `M4.XLarge` with `10GB` volume
  stoppingCondition: {
    maxRuntime: Duration.hours(2),
  }, // optional: default is 1 hour
});
```

You can specify [TrainingInputMode](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_AlgorithmSpecification.html#API_AlgorithmSpecification_Contents) via the trainingInputMode property.

- To download the data from Amazon Simple Storage Service (Amazon S3) to the provisioned ML storage volume, and mount the directory to a Docker volume, choose `InputMode.FILE` if an algorithm supports it.
- To stream data directly from Amazon S3 to the container, choose `InputMode.PIPE` if an algorithm supports it.
- To stream data directly from Amazon S3 to the container with no code changes and to provide file system access to the data, choose `InputMode.FAST_FILE` if an algorithm supports it.

### Create Transform Job

You can call the [`CreateTransformJob`](https://docs.aws.amazon.com/sagemaker/latest/dg/API_CreateTransformJob.html) API from a `Task` state.

```ts
new tasks.SageMakerCreateTransformJob(this, 'Batch Inference', {
  transformJobName: 'MyTransformJob',
  modelName: 'MyModelName',
  modelClientOptions: {
    invocationsMaxRetries: 3,  // default is 0
    invocationsTimeout: Duration.minutes(5),  // default is 60 seconds
  },
  transformInput: {
    transformDataSource: {
      s3DataSource: {
        s3Uri: 's3://inputbucket/train',
        s3DataType: tasks.S3DataType.S3_PREFIX,
      }
    }
  },
  transformOutput: {
    s3OutputPath: 's3://outputbucket/TransformJobOutputPath',
  },
  transformResources: {
    instanceCount: 1,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.XLARGE),
  }
});

```

### Create Endpoint

You can call the [`CreateEndpoint`](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateEndpoint.html) API from a `Task` state.

```ts
new tasks.SageMakerCreateEndpoint(this, 'SagemakerEndpoint', {
  endpointName: sfn.JsonPath.stringAt('$.EndpointName'),
  endpointConfigName: sfn.JsonPath.stringAt('$.EndpointConfigName'),
});
```

### Create Endpoint Config

You can call the [`CreateEndpointConfig`](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateEndpointConfig.html) API from a `Task` state.

```ts
new tasks.SageMakerCreateEndpointConfig(this, 'SagemakerEndpointConfig', {
  endpointConfigName: 'MyEndpointConfig',
  productionVariants: [{
  initialInstanceCount: 2,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE),
    modelName: 'MyModel',
    variantName: 'awesome-variant',
  }],
});
```

### Create Model

You can call the [`CreateModel`](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateModel.html) API from a `Task` state.

```ts
new tasks.SageMakerCreateModel(this, 'Sagemaker', {
  modelName: 'MyModel',
  primaryContainer: new tasks.ContainerDefinition({
    image: tasks.DockerImage.fromJsonExpression(sfn.JsonPath.stringAt('$.Model.imageName')),
    mode: tasks.Mode.SINGLE_MODEL,
    modelS3Location: tasks.S3Location.fromJsonExpression('$.TrainingJob.ModelArtifacts.S3ModelArtifacts'),
  }),
});
```

### Update Endpoint

You can call the [`UpdateEndpoint`](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_UpdateEndpoint.html) API from a `Task` state.

```ts
new tasks.SageMakerUpdateEndpoint(this, 'SagemakerEndpoint', {
  endpointName: sfn.JsonPath.stringAt('$.Endpoint.Name'),
  endpointConfigName: sfn.JsonPath.stringAt('$.Endpoint.EndpointConfig'),
});
```

## SNS

Step Functions supports [Amazon SNS](https://docs.aws.amazon.com/step-functions/latest/dg/connect-sns.html) through the service integration pattern.

You can call the [`Publish`](https://docs.aws.amazon.com/sns/latest/api/API_Publish.html) API from a `Task` state to publish to an SNS topic.

```ts
const topic = new sns.Topic(this, 'Topic');

// Use a field from the execution data as message.
const task1 = new tasks.SnsPublish(this, 'Publish1', {
  topic,
  integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
  message: sfn.TaskInput.fromDataAt('$.state.message'),
  messageAttributes: {
    place: {
      value: sfn.JsonPath.stringAt('$.place'),
    },
    pic: {
      // BINARY must be explicitly set
      dataType: tasks.MessageAttributeDataType.BINARY,
      value: sfn.JsonPath.stringAt('$.pic'),
    },
    people: {
      value: 4,
    },
    handles: {
      value: ['@kslater', '@jjf', null, '@mfanning'],
    },
  },
});

// Combine a field from the execution data with
// a literal object.
const task2 = new tasks.SnsPublish(this, 'Publish2', {
  topic,
  message: sfn.TaskInput.fromObject({
    field1: 'somedata',
    field2: sfn.JsonPath.stringAt('$.field2'),
  }),
});
```

## Step Functions

### Start Execution

You can manage [AWS Step Functions](https://docs.aws.amazon.com/step-functions/latest/dg/connect-stepfunctions.html) executions.

AWS Step Functions supports it's own [`StartExecution`](https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html) API as a service integration.

```ts
// Define a state machine with one Pass state
const child = new sfn.StateMachine(this, 'ChildStateMachine', {
  definition: sfn.Chain.start(new sfn.Pass(this, 'PassState')),
});

// Include the state machine in a Task state with callback pattern
const task = new tasks.StepFunctionsStartExecution(this, 'ChildTask', {
  stateMachine: child,
  integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  input: sfn.TaskInput.fromObject({
    token: sfn.JsonPath.taskToken,
    foo: 'bar',
  }),
  name: 'MyExecutionName',
});

// Define a second state machine with the Task state above
new sfn.StateMachine(this, 'ParentStateMachine', {
  definition: task,
});
```

You can utilize [Associate Workflow Executions](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-nested-workflows.html#nested-execution-startid)
via the `associateWithParent` property. This allows the Step Functions UI to link child
executions from parent executions, making it easier to trace execution flow across state machines.

```ts
declare const child: sfn.StateMachine;
const task = new tasks.StepFunctionsStartExecution(this, 'ChildTask', {
  stateMachine: child,
  associateWithParent: true,
});
```

This will add the payload `AWS_STEP_FUNCTIONS_STARTED_BY_EXECUTION_ID.$: $$.Execution.Id` to the
`input`property for you, which will pass the execution ID from the context object to the
execution input. It requires `input` to be an object or not be set at all.

### Invoke Activity

You can invoke a [Step Functions Activity](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-activities.html) which enables you to have
a task in your state machine where the work is performed by a *worker* that can
be hosted on Amazon EC2, Amazon ECS, AWS Lambda, basically anywhere. Activities
are a way to associate code running somewhere (known as an activity worker) with
a specific task in a state machine.

When Step Functions reaches an activity task state, the workflow waits for an
activity worker to poll for a task. An activity worker polls Step Functions by
using GetActivityTask, and sending the ARN for the related activity.

After the activity worker completes its work, it can provide a report of its
success or failure by using `SendTaskSuccess` or `SendTaskFailure`. These two
calls use the taskToken provided by GetActivityTask to associate the result
with that task.

The following example creates an activity and creates a task that invokes the activity.

```ts
const submitJobActivity = new sfn.Activity(this, 'SubmitJob');

new tasks.StepFunctionsInvokeActivity(this, 'Submit Job', {
  activity: submitJobActivity,
});
```

Use the [Parameters](https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-parameters) field to create a collection of key-value pairs that are passed as input.
The values of each can either be static values that you include in your state machine definition, or selected from either the input or the context object with a path.

```ts
const submitJobActivity = new sfn.Activity(this, 'SubmitJob');

new tasks.StepFunctionsInvokeActivity(this, 'Submit Job', {
  activity: submitJobActivity,
  parameters: {
    comment: 'Selecting what I care about.',
    MyDetails: {
      size: sfn.JsonPath.stringAt('$.product.details.size'),
      exists: sfn.JsonPath.stringAt('$.product.availability'),
      StaticValue: 'foo'
    },
  },
});
```

## SQS

Step Functions supports [Amazon SQS](https://docs.aws.amazon.com/step-functions/latest/dg/connect-sqs.html)

You can call the [`SendMessage`](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SendMessage.html) API from a `Task` state
to send a message to an SQS queue.

```ts
const queue = new sqs.Queue(this, 'Queue');

// Use a field from the execution data as message.
const task1 = new tasks.SqsSendMessage(this, 'Send1', {
  queue,
  messageBody: sfn.TaskInput.fromJsonPathAt('$.message'),
});

// Combine a field from the execution data with
// a literal object.
const task2 = new tasks.SqsSendMessage(this, 'Send2', {
  queue,
  messageBody: sfn.TaskInput.fromObject({
    field1: 'somedata',
    field2: sfn.JsonPath.stringAt('$.field2'),
  }),
});
```
