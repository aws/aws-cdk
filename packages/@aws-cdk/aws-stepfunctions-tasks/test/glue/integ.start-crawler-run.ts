import * as glue from '@aws-cdk/aws-glue';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { GlueStartCrawlerRun } from '../../lib/glue/start-crawler-run';


const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-integ');

const jobRole = new iam.Role(stack, 'Glue Crawler Role', {
  assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole'),
  ],
});

const database = new glue.Database(stack, 'Glue Database', { databaseName: 'dbcrawler' });

const crawler = new glue.CfnCrawler(stack, 'Glue Crawler', {
  name: 'MyGlueCrawler',
  role: jobRole.roleArn,
  databaseName: database.databaseName,
  targets: {
    s3Targets: [{ path: 's3://aaa' }],
  },
});

const crawlerTask = new GlueStartCrawlerRun(stack, 'Glue Crawler Task', {
  glueCrawlerName: crawler.name!,
});

const startTask = new sfn.Pass(stack, 'Start Task');
const endTask = new sfn.Pass(stack, 'End Task');

const stateMachine = new sfn.StateMachine(stack, 'State Machine', {
  definition: sfn.Chain.start(startTask).next(crawlerTask).next(endTask),
});

new cdk.CfnOutput(stack, 'State Machine ARN Output', {
  value: stateMachine.stateMachineArn,
});

new integ.IntegTest(app, 'CrawlerTest', {
  testCases: [stack],
});

app.synth();
