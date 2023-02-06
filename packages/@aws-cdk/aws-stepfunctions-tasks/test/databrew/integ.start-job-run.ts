import * as databrew from '@aws-cdk/aws-databrew';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { GlueDataBrewStartJobRun } from '../../lib';

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> : should return status as SUCCEEDED
 */

class GlueDataBrewJobStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const region = this.region;

    const outputBucket = new s3.Bucket(this, 'JobOutputBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const role = new iam.Role(this, 'DataBrew Role', {
      managedPolicies: [{
        managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSGlueDataBrewServiceRole',
      }],
      path: '/',
      assumedBy: new iam.ServicePrincipal('databrew.amazonaws.com'),
      inlinePolicies: {
        DataBrewPolicy: iam.PolicyDocument.fromJson({
          Statement: [{
            Effect: 'Allow',
            Action: [
              's3:GetObject',
              's3:PutObject',
              's3:DeleteObject',
              's3:ListBucket',
            ],
            Resource: [
              `arn:aws:s3:::databrew-public-datasets-${region}/*`,
              `arn:aws:s3:::databrew-public-datasets-${region}`,
              `${outputBucket.bucketArn}/*`,
              `${outputBucket.bucketArn}`,
            ],
          }],
        }),
      },
    });

    const recipe = new databrew.CfnRecipe(this, 'DataBrew Recipe', {
      name: 'recipe-1',
      steps: [
        {
          action: {
            operation: 'UPPER_CASE',
            parameters: {
              sourceColumn: 'description',
            },
          },
        },
        {
          action: {
            operation: 'DELETE',
            parameters: {
              sourceColumn: 'doc_id',
            },
          },
        },
      ],
    });

    const dataset = new databrew.CfnDataset(this, 'DataBrew Dataset', {
      input: {
        s3InputDefinition: {
          bucket: `databrew-public-datasets-${region}`,
          key: 'votes.csv',
        },
      },
      name: 'dataset-1',
    });

    const project = new databrew.CfnProject(this, 'DataBrew Project', {
      name: 'project-1',
      roleArn: role.roleArn,
      datasetName: dataset.name,
      recipeName: recipe.name,
    });
    project.addDependency(dataset);
    project.addDependency(recipe);

    const job = new databrew.CfnJob(this, 'DataBrew Job', {
      name: 'job-1',
      type: 'RECIPE',
      projectName: project.name,
      roleArn: role.roleArn,
      outputs: [{
        location: {
          bucket: outputBucket.bucketName,
        },
      }],
    });
    job.addDependency(project);

    const startGlueDataBrewJob = new GlueDataBrewStartJobRun(this, 'Start DataBrew Job run', {
      name: job.name,
    });

    const chain = sfn.Chain.start(startGlueDataBrewJob);

    const sm = new sfn.StateMachine(this, 'StateMachine', {
      definition: chain,
      timeout: cdk.Duration.seconds(30),
    });

    new cdk.CfnOutput(this, 'stateMachineArn', {
      value: sm.stateMachineArn,
    });
  }
}

const app = new cdk.App();
new GlueDataBrewJobStack(app, 'aws-stepfunctions-tasks-databrew-start-job-run-integ');
app.synth();
