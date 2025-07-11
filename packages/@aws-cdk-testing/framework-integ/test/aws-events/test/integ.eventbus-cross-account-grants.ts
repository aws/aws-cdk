import { App, Arn, PhysicalName, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Runtime, Function, Code } from 'aws-cdk-lib/aws-lambda';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { AccountPrincipal } from 'aws-cdk-lib/aws-iam';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

/*
How to run this integ test:
 - you should have 2 aws accounts set up one if them let's called testing account, and the other one is cross account
 - in the cross account run the following command
  `cdk bootstrap aws://<<cross_account>>/us-east-1 --trust <<testing_account>> --cloudformation-execution-policies 'arn:aws:iam::aws:policy/AdministratorAccess' --trust-for-lookup <<testing_account>>`
 - using the testing account credentials to run the current integration test case
 - before you commit, set both accounts to dummy values, run integ test in dry run mode, and then push the snapshot.
*/

const account = process.env.CDK_INTEG_ACCOUNT || '123456789012';

// As the integ-runner doesn't provide a default cross account, we make our own.
const crossAccount = process.env.CDK_INTEG_CROSS_ACCOUNT || '345678901234';
const region = process.env.CDK_INTEG_REGION || 'us-east-1';

const busName = 'testingBus';

const testingStack = new Stack(app, 'testingStack', {
  env: {
    account: account,
    region,
  },
});

const func: Function = new Function(testingStack, 'MyFunction', {
  functionName: PhysicalName.GENERATE_IF_NEEDED,
  runtime: Runtime.PYTHON_3_9,
  handler: 'index.handler',
  code: Code.fromInline(`
import boto3
import json
import os
 
def handler(event, context):
  try:
      client = boto3.client('events')
      
      # Reference the EventBus in the other account
      event_bus_name = os.environ['EVENT_BUS_NAME']
      event_bus_account = os.environ['EVENT_BUS_ACCOUNT']
      event_bus_arn = f"arn:aws:events:{os.environ.get('AWS_REGION')}:{event_bus_account}:event-bus/{event_bus_name}"
 
      response = client.put_events(
          Entries=[
              {
                  'Source': 'custom.myapp',
                  'DetailType': 'MyCustomEvent',
                  'Detail': json.dumps({'key': 'value'}),
                  'EventBusName': event_bus_arn
              }
          ]
      )
      
      return {
          'statusCode': 200
      }
  except Exception as e:
      return {
          'statusCode': 500
      }
    `),
  environment: {
    EVENT_BUS_NAME: busName,
    EVENT_BUS_ACCOUNT: crossAccount,
  },
});

func.grantInvoke(new AccountPrincipal(account));

const bus = EventBus.fromEventBusArn(
  testingStack,
  'importedbus',
  Arn.format({
    service: 'events',
    resource: 'event-bus',
    resourceName: busName,
    region: region,
    account: crossAccount,
  }, testingStack),
);
bus.grantPutEventsTo(func);

const crossAccountStack = new Stack(app, 'crossAccountStack', {
  env: {
    account: crossAccount,
    region,
  },
});
const originalBus = new EventBus(crossAccountStack, 'bus', {
  eventBusName: busName,
});
testingStack.addDependency(crossAccountStack);

originalBus.grantPutEventsTo(new AccountPrincipal(account), 'cross-account-access-sid');

const integ = new IntegTest(app, 'CrossAccountDeploy', {
  testCases: [
    testingStack,
  ],
});

integ.node.addDependency(testingStack);
integ.node.addDependency(crossAccountStack);

const result = integ.assertions.invokeFunction({
  functionName: func.functionName,
});

result.expect(ExpectedResult.objectLike({
  Payload: '{"statusCode": 200}',
}));
