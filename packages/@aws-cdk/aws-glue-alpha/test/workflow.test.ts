import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Schedule } from 'aws-cdk-lib/aws-events';
import * as glueCfn from 'aws-cdk-lib/aws-glue';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as glue from '../lib';

test('workflow', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new glue.Workflow(stack, 'Workflow');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Workflow', {});
});

test('workflow with props', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new glue.Workflow(stack, 'myWorkflow', {
    workflowName: 'myWorkflow',
    description: 'myDescription',
    maxConcurrentRuns: 1,
    defaultRunProperties: {
      foo: 'bar',
      key: 'value',
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Workflow', {
    Name: 'myWorkflow',
    Description: 'myDescription',
    MaxConcurrentRuns: 1,
    DefaultRunProperties: {
      foo: 'bar',
      key: 'value',
    },
  });
});

describe('workflow with triggers', () => {
  let stack: cdk.Stack;
  let workflow: glue.Workflow;
  let job: glue.Job;
  let crawler: glueCfn.CfnCrawler;
  let securityConfiguration: glue.SecurityConfiguration;

  beforeEach(() => {
    stack = new cdk.Stack();
    workflow = new glue.Workflow(stack, 'myWorkflow');
    job = new glue.Job(stack, 'myJob', {
      executable: glue.JobExecutable.pythonEtl({
        glueVersion: glue.GlueVersion.V2_0,
        pythonVersion: glue.PythonVersion.THREE,
        script: glue.Code.fromBucket(Bucket.fromBucketName(stack, 'myBucket', 'my-bucket'), 'myKey'),
      }),
    });
    crawler = new glueCfn.CfnCrawler(stack, 'myCrawler', {
      role: 'myRole',
      databaseName: 'myDatabase',
      targets: {
        s3Targets: [{ path: 'myPath' }],
      },
    });
    securityConfiguration = new glue.SecurityConfiguration(stack, 'mySecurityConfiguration');
  });

  test('onDemand', () => {
    // WHEN
    workflow.addOnDemandTrigger(stack, 'OnDemandTrigger', {
      actions: [{
        job: job,
        arguments: {
          foo: 'bar',
          key: 'value',
        },
        delayCloudwatchEvent: cdk.Duration.seconds(5),
        timeout: cdk.Duration.seconds(5 * 60),
        securityConfiguration: securityConfiguration,
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Name: 'OnDemandTrigger',
      Type: 'ON_DEMAND',
      Actions: [{
        JobName: { 'Fn::GetAtt': ['myJobC2A9F6D7', 'Name'] },
        SecurityConfiguration: { 'Fn::GetAtt': ['mySecurityConfigurationC2A9F6D7', 'Name'] },
        Arguments: {
          foo: 'bar',
          key: 'value',
        },
        Timeout: 300,
        NotificationProperty: {
          NotifyDelayAfter: 5,
        },
      }],
      WorkflowName: { Ref: 'myWorkflowC2A9F6D7' },
    });
  });

  test('dailySchedule', () => {
    // WHEN
    workflow.addDailyScheduleTrigger(stack, 'DailyScheduleTrigger', {
      actions: [{
        crawler: crawler,
        arguments: {
          foo: 'bar',
          key: 'value',
        },
        timeout: cdk.Duration.seconds(5 * 60),
        securityConfiguration: securityConfiguration,
        delayCloudwatchEvent: cdk.Duration.seconds(5),
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Name: 'DailyScheduleTrigger',
      Type: 'SCHEDULED',
      Schedule: 'cron(0 1 * * ? *)',
      Actions: [{
        CrawlerName: { 'Fn::GetAtt': ['myCrawlerC2A9F6D7', 'Name'] },
        Arguments: {
          foo: 'bar',
          key: 'value',
        },
        Timeout: 300,
      }],
      WorkflowName: { Ref: 'myWorkflowC2A9F6D7' },
    });
  });

  test('weeklySchedule', () => {
    // WHEN
    workflow.addWeeklyScheduleTrigger(stack, 'WeeklyScheduleTrigger', {
      actions: [{
        job: job,
        arguments: {
          foo: 'bar',
          key: 'value',
        },
        timeout: cdk.Duration.seconds(5 * 60),
        securityConfiguration: securityConfiguration,
        delayCloudwatchEvent: cdk.Duration.seconds(5),
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Name: 'WeeklyScheduleTrigger',
      Type: 'SCHEDULED',
      Schedule: 'cron(0 1 ? * MON *)',
      Actions: [{
        JobName: { 'Fn::GetAtt': ['myJobC2A9F6D7', 'Name'] },
        SecurityConfiguration: { 'Fn::GetAtt': ['mySecurityConfigurationC2A9F6D7', 'Name'] },
        Arguments: {
          foo: 'bar',
          key: 'value',
        },
        Timeout: 300,
        NotificationProperty: {
          NotifyDelayAfter: 5,
        },
      }],
      WorkflowName: { Ref: 'myWorkflowC2A9F6D7' },
    });
  });

  test('monthlySchedule', () => {
    // WHEN
    workflow.addMonthlyScheduleTrigger(stack, 'MonthlyScheduleTrigger', {
      actions: [{
        crawler: crawler,
        arguments: {
          foo: 'bar',
          key: 'value',
        },
        timeout: cdk.Duration.seconds(5 * 60),
        securityConfiguration: securityConfiguration,
        delayCloudwatchEvent: cdk.Duration.seconds(5),
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Name: 'MonthlyScheduleTrigger',
      Type: 'SCHEDULED',
      Schedule: 'cron(0 1 1 * ? *)',
      Actions: [{
        CrawlerName: { 'Fn::GetAtt': ['myCrawlerC2A9F6D7', 'Name'] },
        Arguments: {
          foo: 'bar',
          key: 'value',
        },
        Timeout: 300,
      }],
      WorkflowName: { Ref: 'myWorkflowC2A9F6D7' },
    });
  });

  test('customSchedule', () => {
    // WHEN
    workflow.addCustomScheduleTrigger(stack, 'CustomScheduleTrigger', {
      schedule: Schedule.cron({ minute: '0', hour: '1', day: '1', month: 'JAN', year: '?' }),
      actions: [{
        job: job,
        arguments: {
          foo: 'bar',
          key: 'value',
        },
        timeout: cdk.Duration.seconds(5 * 60),
        securityConfiguration: securityConfiguration,
        delayCloudwatchEvent: cdk.Duration.seconds(5),
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Name: 'CustomScheduleTrigger',
      Type: 'SCHEDULED',
      Schedule: 'cron(0 1 1 JAN ? *)',
      Actions: [{
        JobName: { 'Fn::GetAtt': ['myJobC2A9F6D7', 'Name'] },
        SecurityConfiguration: { 'Fn::GetAtt': ['mySecurityConfigurationC2A9F6D7', 'Name'] },
        Arguments: {
          foo: 'bar',
          key: 'value',
        },
        Timeout: 300,
        NotificationProperty: {
          NotifyDelayAfter: 5,
        },
      }],
      WorkflowName: { Ref: 'myWorkflowC2A9F6D7' },
    });
  });

  test('notifyEvent', () => {
    // WHEN
    workflow.addNotifyEventTrigger(stack, 'OnDemandTrigger', {
      batchSize: 50,
      batchWindow: cdk.Duration.minutes(5),
      actions: [{
        job: job,
        arguments: {
          foo: 'bar',
          key: 'value',
        },
        securityConfiguration: securityConfiguration,
        delayCloudwatchEvent: cdk.Duration.seconds(5),
        timeout: cdk.Duration.seconds(5 * 60),
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Name: 'OnDemandTrigger',
      Type: 'CONDITIONAL',
      Actions: [{
        JobName: { 'Fn::GetAtt': ['myJobC2A9F6D7', 'Name'] },
        Arguments: {
          foo: 'bar',
          key: 'value',
        },
        NotificationProperty: {
          NotifyDelayAfter: 0,
          NotifyDelayAfterEvent: 'ON_FAILURE',
        },
      }],
      EventBatchingCondition: {
        BatchSize: 50,
        BatchWindow: 300,
      },
      WorkflowName: { Ref: 'myWorkflowC2A9F6D7' },
    });
  });

  test('conditional', () => {
    // WHEN
    workflow.addConditionalTrigger(stack, 'ConditionalTrigger', {
      actions: [{
        crawler: crawler,
        arguments: {
          foo: 'bar',
          key: 'value',
        },
        timeout: cdk.Duration.seconds(5 * 60),
        securityConfiguration: securityConfiguration,
        delayCloudwatchEvent: cdk.Duration.seconds(5),
      }],
      predicateCondition: glue.TriggerPredicateCondition.AND,
      jobPredicates: [{
        job: job,
        state: glue.PredicateState.SUCCEEDED,
      }],
      crawlerPredicates: [{
        crawler: crawler,
        state: glue.PredicateState.SUCCEEDED,
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Name: 'ConditionalTrigger',
      Type: 'CONDITIONAL',
      Actions: [{
        CrawlerName: { 'Fn::GetAtt': ['myCrawlerC2A9F6D7', 'Name'] },
        Arguments: {
          foo: 'bar',
          key: 'value',
        },
        Timeout: 300,
      }],
      Predicate: {
        Conditions: ['AND'],
        Logical: {
          JobName: { 'Fn::GetAtt': ['myJobC2A9F6D7', 'Name'] },
          State: 'SUCCEEDED',
        },
        State: 'SUCCEEDED',
      },
      WorkflowName: { Ref: 'myWorkflowC2A9F6D7' },
    });
  });

  test('conditional with no predicates', () => {
    // WHEN
    expect(() =>
      workflow.addConditionalTrigger(stack, 'ConditionalTrigger', {
        actions: [{
          crawler: crawler,
          arguments: {
            foo: 'bar',
            key: 'value',
          },
          timeout: cdk.Duration.seconds(5 * 60),
          securityConfiguration: securityConfiguration,
          delayCloudwatchEvent: cdk.Duration.seconds(5),
        }],
      }),

    // THEN
    ).toThrow(/At least one job predicate or crawler predicate must be specified./);
  });
});

test('workflow with trigger that has both job and crawler as one action', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const workflow = new glue.Workflow(stack, 'myWorkflow');
  const job = new glue.Job(stack, 'myJob', {
    executable: glue.JobExecutable.pythonEtl({
      glueVersion: glue.GlueVersion.V2_0,
      pythonVersion: glue.PythonVersion.THREE,
      script: glue.Code.fromAsset('myScript'),
    }),
  });
  const crawler = new glueCfn.CfnCrawler(stack, 'myCrawler', {
    role: 'myRole',
    databaseName: 'myDatabase',
    targets: {
      s3Targets: [{ path: 'myPath' }],
    },
  });

  // WHEN
  expect(() => workflow.addOnDemandTrigger(stack, 'OnDemandTrigger', {
    actions: [{
      job: job,
      crawler: crawler,
    }],
  }),

  // THEN
  ).toThrow(/Only one of job or crawler can be specified in an action/);
});

test('workflow with trigger that has neither job nor crawler as one action', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const workflow = new glue.Workflow(stack, 'myWorkflow');

  // WHEN
  expect(() => workflow.addOnDemandTrigger(stack, 'OnDemandTrigger', {
    actions: [{
      arguments: {
        foo: 'bar',
        key: 'value',
      },
    }],
  }),

  // THEN
  ).toThrow(/Either job or crawler must be specified in an action/);
});