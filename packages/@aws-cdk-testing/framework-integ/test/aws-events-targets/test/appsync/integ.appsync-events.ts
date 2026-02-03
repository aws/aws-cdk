import * as events from 'aws-cdk-lib/aws-events';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as path from 'path';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

class AwsAppSyncEvent extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, 'baseApi', {
      name: 'aws-cdk-aws-appsync-target-integ-api',
      definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.test.graphql')),
      authorizationConfig: { defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM } },
    });
    const none = api.addNoneDataSource('none');
    none.createResolver('publisher', {
      typeName: 'Mutation',
      fieldName: 'publish',
      code: appsync.AssetCode.fromInline(`
export const request = (ctx) => ({payload: null})
export const response = (ctx) => ctx.args.message
`.trim()),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    const graphQLOperation = 'mutation Publish($message: String!){ publish(message: $message) { message } }';
    const queue = new sqs.Queue(this, 'Queue');

    const timer = new events.Rule(this, 'Timer', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });
    timer.addTarget(new targets.AppSync(api, {
      graphQLOperation,
      variables: events.RuleTargetInput.fromObject({
        message: 'hello world',
      }),
      deadLetterQueue: queue,
    }));
  }
}

const stack = new AwsAppSyncEvent(app, 'aws-cdk-aws-appsync-target-integ');
new IntegTest(app, 'aws-appsync-integ', { testCases: [stack] });
