import * as path from 'path';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';
import { AthenaDatasetDefinitionProps, ProcessingInput, RedshiftDatasetDefinitionProps, S3InputProps, S3Location, S3Output } from '../../lib';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';


/*
 * Creates a state machine with a task states needed to execute a SageMaker processing job
 *
 * Stack verification steps:
 * The generated State Machine can be executed from the CLI (or Step Functions console)
 * and runs with an execution status of `Succeeded`.
 *
 * -- aws stepfunctions start-execution --state-machine-arn <state-machine-arn-from-output> provides execution arn
 * -- aws stepfunctions describe-execution --execution-arn <state-machine-arn-from-output> returns a status of `Succeeded`
 */


class CallSageMakerStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const redshiftClusterRole = new Role(this, 'RedshiftClusterRole', {
      assumedBy: new ServicePrincipal('sagemaker.amazonaws.com'),
    });

    const redshiftDataset: RedshiftDatasetDefinitionProps = {
      clusterId: sfn.JsonPath.stringAt('$.RedshiftClusterId'),
      dbUser: sfn.JsonPath.stringAt('$.RedshiftUser'),
      clusterRole: redshiftClusterRole,
      database: sfn.JsonPath.stringAt('$.AthenaDB'),
      s3Location: S3Location.fromJsonExpression("$.s3QueryOutputLocation"),
      queryString: sfn.JsonPath.stringAt('$.RedshiftSqlString'),
    };

    const athenaDataset: AthenaDatasetDefinitionProps = {
      catalog: sfn.JsonPath.stringAt('$.AthenaCatalog'),
      database: sfn.JsonPath.stringAt('$.AthenaDB'),
      s3Location: S3Location.fromJsonExpression("$.s3QueryOutputLocation"),
      queryString: sfn.JsonPath.stringAt('$.AthenaSqlQuery'),
    };

    const s3Input: S3InputProps = {
      s3Location: S3Location.fromJsonExpression("$.s3OutputLocation"),
    };

    const processingJob = new tasks.SageMakerCreateProcessingJob(this, 'Process Task', {
      processingJobName: sfn.JsonPath.stringAt('$.JobName'),
      image: tasks.DockerImage.fromAsset(this, 'Image', { directory: path.resolve(__dirname, 'processing-image') }),
      processingInputs: [
        ProcessingInput.fromRedshiftDatasetDefinition(redshiftDataset),
        ProcessingInput.fromAthenaDatasetDefinition(athenaDataset),
        ProcessingInput.fromS3Input(s3Input)
      ],
      resultPath: '$.ProcessingJob',
    });

    const definition = new sfn.Pass(this, 'Start', {
      result: sfn.Result.fromObject(
        {
          JobName: 'mysagemakerprocessjob',
        }),
    }).next(processingJob);

    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition,
    });

    new cdk.CfnOutput(this, 'StateMachineArn', {
      value: stateMachine.stateMachineArn,
    });
  }
}

const app = new cdk.App();
new CallSageMakerStack(app, 'aws-stepfunctions-integ-sagemaker');
app.synth();

