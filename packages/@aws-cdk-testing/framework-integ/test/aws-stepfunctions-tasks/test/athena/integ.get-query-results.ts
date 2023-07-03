import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { AthenaStartQueryExecution, AthenaGetQueryResults, EncryptionOption } from 'aws-cdk-lib/aws-stepfunctions-tasks';

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> : should return status as SUCCEEDED and a query-execution-id
 * * aws athena get-query-results --query-execution-id <query-execution-id generated before> : should return query results
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-athena-get-query-results-integ');

const query = sfn.JsonPath.stringAt('$.queryString');

const startQueryExecutionJob = new AthenaStartQueryExecution(stack, 'Start Athena Query', {
  queryString: query,
  queryExecutionContext: {
    databaseName: 'mydatabase',
  },
  resultConfiguration: {
    encryptionConfiguration: {
      encryptionOption: EncryptionOption.S3_MANAGED,
    },
  },
});

const wait = new sfn.Wait(stack, 'Wait', {
  time: sfn.WaitTime.duration(cdk.Duration.seconds(10)),
});

const getQueryResultsJob = new AthenaGetQueryResults(stack, 'Get Query Results', {
  queryExecutionId: sfn.JsonPath.stringAt('$.QueryExecutionId'),
});

const chain = sfn.Chain
  .start(startQueryExecutionJob)
  .next(wait)
  .next(getQueryResultsJob);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});

app.synth();
