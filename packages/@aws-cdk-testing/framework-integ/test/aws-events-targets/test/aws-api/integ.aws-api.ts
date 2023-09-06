import * as events from 'aws-cdk-lib/aws-events';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

const app = new cdk.App();

class AwsApi extends cdk.Stack {
  public parameterUnderTest: StringParameter;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Force new deployment of 'cool-service' and stop 'dev-instance' at midnight everyday
    const scheduleRule = new events.Rule(this, 'ScheduleRule', {
      schedule: events.Schedule.cron({
        hour: '0',
        minute: '0',
      }),
    });

    scheduleRule.addTarget(new targets.AwsApi({
      service: 'ECS',
      action: 'updateService',
      parameters: {
        service: 'cool-service',
        forceNewDeployment: true,
      },
    }));

    scheduleRule.addTarget(new targets.AwsApi({
      service: 'RDS',
      action: 'stopDBInstance',
      parameters: {
        DBInstanceIdentifier: 'dev-instance',
      },
    }));

    // Create snapshots when a DB instance restarts
    const patternRule = new events.Rule(this, 'PatternRule', {
      eventPattern: {
        detailType: ['RDS DB Instance Event'],
        detail: {
          Message: ['DB instance restarted'],
        },
      },
    });

    patternRule.addTarget(new targets.AwsApi({
      service: 'RDS',
      action: 'createDBSnapshot',
      parameters: {
        DBInstanceIdentifier: events.EventField.fromPath('$.detail.SourceArn'),
      },
    }));

    // A custom rule & target to update a SSM Parameter
    // In assertions a custom event will be fired to update the parameter value and the new value will be asserted on
    this.parameterUnderTest = new StringParameter(this, 'TestParameter', {
      parameterName: '/cdk-integ/aws-event-targets/aws-api-target/default-param',
      stringValue: 'default-value',
    });

    const updateSsmRule = new events.Rule(this, 'UpdateSSMRule', {
      eventPattern: {
        source: ['cdk.integ'],
        detailType: ['SSMUpdateParameter'],
        detail: {
          Name: [this.parameterUnderTest.parameterName],
        },
      },
    });
    updateSsmRule.node.addDependency(this.parameterUnderTest);

    updateSsmRule.addTarget(new targets.AwsApi({
      service: 'SSM',
      action: 'putParameter',
      parameters: {
        Name: events.EventField.fromPath('$.detail.Name'),
        Value: events.EventField.fromPath('$.detail.Value'),
        Overwrite: true,
      },
    }));
  }
}

const stack = new AwsApi(app, 'aws-cdk-aws-api-target-integ');

const test = new IntegTest(app, 'aws-api-integ', {
  testCases: [stack],
});

const putEvent = test.assertions
  .awsApiCall('EventBridge', 'putEvents', {
    Entries: [{
      Source: 'cdk.integ',
      DetailType: 'SSMUpdateParameter',
      Detail: JSON.stringify({
        Name: stack.parameterUnderTest.parameterName,
        Value: 'new-value',
      }),
    }],
  });

putEvent.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['events:PutEvents'],
  Resource: ['*'],
});

putEvent.next(
  test.assertions
    .awsApiCall('SSM', 'getParameter', {
      Name: stack.parameterUnderTest.parameterName,
    }, ['Parameter.Value'])
    .assertAtPath('Parameter.Value', ExpectedResult.stringLikeRegexp('new-value'))
    .waitForAssertions({ totalTimeout: cdk.Duration.minutes(1) }),
);
