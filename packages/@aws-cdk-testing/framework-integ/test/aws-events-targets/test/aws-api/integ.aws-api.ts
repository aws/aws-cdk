import * as events from 'aws-cdk-lib/aws-events';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Key } from 'aws-cdk-lib/aws-kms';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

class AwsApi extends cdk.Stack {
  public parameterUnderTest: StringParameter;
  public encryptionKey: Key;

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

    // A custom rule & target to encrypt data with a KMS key
    // This operation has no effect on state, so cannot be asserted.
    this.encryptionKey = new Key(this, 'EncryptionKey');

    const encryptData = new events.Rule(this, 'EncryptDataRule', {
      eventPattern: {
        source: ['cdk.integ'],
        detailType: ['EncryptData'],
        detail: {
          KeyId: [this.encryptionKey.keyId],
        },
      },
    });
    this.encryptionKey.node.addDependency(this.encryptionKey);

    encryptData.addTarget(new targets.AwsApi({
      service: 'KMS',
      action: 'encrypt',
      parameters: {
        KeyId: events.EventField.fromPath('$.detail.KeyId'),
        Plaintext: events.EventField.fromPath('$.detail.Plaintext'),
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
    },
    {
      Source: 'cdk.integ',
      DetailType: 'EncryptData',
      Detail: JSON.stringify({
        KeyId: stack.encryptionKey.keyId,
        Plaintext: 'some-secret-data',
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
