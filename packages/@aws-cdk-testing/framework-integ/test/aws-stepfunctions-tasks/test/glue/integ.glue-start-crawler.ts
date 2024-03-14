import * as glue from 'aws-cdk-lib/aws-glue';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const jobRole = new iam.Role(this, 'Glue crawlwer Role', {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole'),
      ],
    });

    const database = new glue.CfnDatabase(this, 'Database', {
      catalogId: Stack.of(this).account,
      databaseInput: {
        name: 'my-database',
        description: 'My database',
      },
    });

    const crawler = new glue.CfnCrawler(this, 'Crawler', {
      databaseName: database.ref,
      role: jobRole.roleArn,
      targets: {
        s3Targets: [
          {
            path: `s3://${bucket.bucketName}/`,
          },
        ],
      },
    });

    const crawlerTask = new tasks.GlueStartCrawlerRun(this, 'Glue Crawler Task', {
      crawlerName: crawler.ref,
    });

    const startTask = new sfn.Pass(this, 'Start Task');
    const endTask = new sfn.Pass(this, 'End Task');

    new sfn.StateMachine(this, 'State Machine', {
      definition: sfn.Chain.start(startTask).next(crawlerTask).next(endTask),
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'aws-cdk-glue-crawler');

new integ.IntegTest(app, 'EcsDeploymentConfigTest', {
  testCases: [stack],
});
