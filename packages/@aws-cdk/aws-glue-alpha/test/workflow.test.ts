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

describe('imported workflow', () => {
  let stack: cdk.Stack;
  let job: glue.Job;
  let securityConfiguration: glue.SecurityConfiguration;
  let triggerProps: glue.TriggerProps;

  beforeEach(() => {
    stack = new cdk.Stack();
    job = new glue.Job(stack, 'myJob', {
      executable: glue.JobExecutable.pythonEtl({
        glueVersion: glue.GlueVersion.V2_0,
        pythonVersion: glue.PythonVersion.THREE,
        script: glue.Code.fromBucket(Bucket.fromBucketName(stack, 'myBucket', 'my-bucket'), 'myKey'),
      }),
    });
    securityConfiguration = new glue.SecurityConfiguration(stack, 'mySecurityConfiguration', {
      s3Encryption: {
        mode: glue.S3EncryptionMode.S3_MANAGED,
      },
    });
    triggerProps = {
      actions: [{
        job: job,
        arguments: {
          foo: 'bar',
          key: 'value',
        },
        timeout: cdk.Duration.seconds(5 * 60),
        securityConfiguration: securityConfiguration,
        delayCloudwatchEvent: cdk.Duration.seconds(60),
      }],
    };
  });

  test('fromWorkflowArn', () => {
    // GIVEN
    const workflowArn = 'arn:aws:glue:us-east-1:123456789012:workflow/myWorkflow';
    const predicateJob = new glue.Job(stack, 'myJob2', {
      executable: glue.JobExecutable.pythonEtl({
        glueVersion: glue.GlueVersion.V2_0,
        pythonVersion: glue.PythonVersion.THREE,
        script: glue.Code.fromBucket(Bucket.fromBucketName(stack, 'myPredicateBucket', 'my-bucket'), 'myKey'),
      }),
    });

    // WHEN
    const imported = glue.Workflow.fromWorkflowArn(stack, 'myWorkflow', workflowArn);
    imported.addConditionalTrigger('ConditionalTrigger', {
      ...triggerProps,
      predicateCondition: glue.TriggerPredicateCondition.AND,
      jobPredicates: [{
        job: predicateJob,
        state: glue.PredicateState.SUCCEEDED,
      }],
    });

    // THEN
    expect(imported.workflowArn).toEqual(workflowArn);
    expect(imported.workflowName).toEqual('myWorkflow');
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Type: 'CONDITIONAL',
      Actions: [{
        JobName: { Ref: 'myJob9A6589B3' },
        Arguments: {
          foo: 'bar',
          key: 'value',
        },
        Timeout: 5,
        NotificationProperty: {
          NotifyDelayAfter: 1,
        },
      }],
      Predicate: {
        Conditions: [
          {
            JobName: { Ref: 'myJob2902BF595' },
            LogicalOperator: 'EQUALS',
            State: 'SUCCEEDED',
          },
        ],
        Logical: 'ALL',
      },
      WorkflowName: 'myWorkflow',
    });
  });

  test('fromWorkflowName', () => {
    // WHEN
    const imported = glue.Workflow.fromWorkflowName(stack, 'myWorkflow', 'myWorkflow');
    imported.addOnDemandTrigger('OnDemandTrigger', triggerProps);

    // THEN
    expect(imported.workflowName).toEqual('myWorkflow');
    expect(imported.workflowArn).toMatch(/^arn:.+:glue:.+:.+:workflow\/myWorkflow$/);
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Type: 'ON_DEMAND',
      Actions: [{
        JobName: { Ref: 'myJob9A6589B3' },
        SecurityConfiguration: { Ref: 'mySecurityConfiguration58B0C573' },
        Arguments: {
          foo: 'bar',
          key: 'value',
        },
        Timeout: 5,
        NotificationProperty: {
          NotifyDelayAfter: 1,
        },
      }],
      WorkflowName: 'myWorkflow',
    });
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
    securityConfiguration = new glue.SecurityConfiguration(stack, 'mySecurityConfiguration', {
      s3Encryption: {
        mode: glue.S3EncryptionMode.S3_MANAGED,
      },
    });
  });

  test('onDemand', () => {
    // WHEN
    workflow.addOnDemandTrigger('OnDemandTrigger', {
      triggerName: 'OnDemandTrigger',
      actions: [{
        job: job,
        arguments: {
          foo: 'bar',
          key: 'value',
        },
        delayCloudwatchEvent: cdk.Duration.seconds(60),
        timeout: cdk.Duration.seconds(5 * 60),
        securityConfiguration: securityConfiguration,
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Name: 'OnDemandTrigger',
      Type: 'ON_DEMAND',
      Actions: [{
        JobName: { Ref: 'myJob9A6589B3' },
        SecurityConfiguration: { Ref: 'mySecurityConfiguration58B0C573' },
        Arguments: {
          foo: 'bar',
          key: 'value',
        },
        Timeout: 5,
        NotificationProperty: {
          NotifyDelayAfter: 1,
        },
      }],
      WorkflowName: { Ref: 'myWorkflow931F3265' },
    });
  });

  test('dailySchedule', () => {
    // WHEN
    workflow.addDailyScheduleTrigger('DailyScheduleTrigger', {
      actions: [{
        crawler: crawler,
        arguments: {
          foo: 'bar',
          key: 'value',
        },
        timeout: cdk.Duration.seconds(5 * 60),
        securityConfiguration: securityConfiguration,
        delayCloudwatchEvent: cdk.Duration.seconds(60),
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Type: 'SCHEDULED',
      Schedule: 'cron(0 1 * * ? *)',
      Actions: [{
        CrawlerName: { Ref: 'myCrawler' },
        Arguments: {
          foo: 'bar',
          key: 'value',
        },
        Timeout: 5,
        SecurityConfiguration: { Ref: 'mySecurityConfiguration58B0C573' },
        NotificationProperty: {
          NotifyDelayAfter: 1,
        },
      }],
      WorkflowName: { Ref: 'myWorkflow931F3265' },
    });
  });

  test('weeklySchedule', () => {
    // WHEN
    workflow.addWeeklyScheduleTrigger('WeeklyScheduleTrigger', {
      actions: [{
        job: job,
        arguments: {
          foo: 'bar',
          key: 'value',
        },
        timeout: cdk.Duration.seconds(5 * 60),
        securityConfiguration: securityConfiguration,
        delayCloudwatchEvent: cdk.Duration.seconds(60),
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Type: 'SCHEDULED',
      Schedule: 'cron(0 1 ? * MON *)',
      Actions: [{
        JobName: { Ref: 'myJob9A6589B3' },
        SecurityConfiguration: { Ref: 'mySecurityConfiguration58B0C573' },
        Arguments: {
          foo: 'bar',
          key: 'value',
        },
        Timeout: 5,
        NotificationProperty: {
          NotifyDelayAfter: 1,
        },
      }],
      WorkflowName: { Ref: 'myWorkflow931F3265' },
    });
  });

  test('monthlySchedule', () => {
    // WHEN
    workflow.addMonthlyScheduleTrigger('MonthlyScheduleTrigger', {
      actions: [{
        crawler: crawler,
        arguments: {
          foo: 'bar',
          key: 'value',
        },
        timeout: cdk.Duration.seconds(5 * 60),
        securityConfiguration: securityConfiguration,
        delayCloudwatchEvent: cdk.Duration.seconds(60),
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Type: 'SCHEDULED',
      Schedule: 'cron(0 1 1 * ? *)',
      Actions: [{
        CrawlerName: { Ref: 'myCrawler' },
        Arguments: {
          foo: 'bar',
          key: 'value',
        },
        Timeout: 5,
        NotificationProperty: {
          NotifyDelayAfter: 1,
        },
      }],
      WorkflowName: { Ref: 'myWorkflow931F3265' },
    });
  });

  test('customSchedule', () => {
    // WHEN
    workflow.addCustomScheduleTrigger('CustomScheduleTrigger', {
      schedule: Schedule.cron({ minute: '0', hour: '1', day: '1', month: 'JAN', year: '?' }),
      actions: [{
        job: job,
        arguments: {
          foo: 'bar',
          key: 'value',
        },
        timeout: cdk.Duration.seconds(5 * 60),
        securityConfiguration: securityConfiguration,
        delayCloudwatchEvent: cdk.Duration.seconds(60),
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Type: 'SCHEDULED',
      Schedule: 'cron(0 1 1 JAN ? ?)',
      Actions: [{
        JobName: { Ref: 'myJob9A6589B3' },
        SecurityConfiguration: { Ref: 'mySecurityConfiguration58B0C573' },
        Arguments: {
          foo: 'bar',
          key: 'value',
        },
        Timeout: 5,
        NotificationProperty: {
          NotifyDelayAfter: 1,
        },
      }],
      WorkflowName: { Ref: 'myWorkflow931F3265' },
    });
  });

  test('notifyEvent', () => {
    // WHEN
    workflow.addNotifyEventTrigger('OnDemandTrigger', {
      batchSize: 50,
      batchWindow: cdk.Duration.minutes(5),
      actions: [{
        job: job,
        arguments: {
          foo: 'bar',
          key: 'value',
        },
        securityConfiguration: securityConfiguration,
        delayCloudwatchEvent: cdk.Duration.seconds(60),
        timeout: cdk.Duration.seconds(5 * 60),
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Type: 'CONDITIONAL',
      Actions: [{
        JobName: { Ref: 'myJob9A6589B3' },
        Arguments: {
          foo: 'bar',
          key: 'value',
        },
        NotificationProperty: {
          NotifyDelayAfter: 1,
        },
        Timeout: 5,
      }],
      EventBatchingCondition: {
        BatchSize: 50,
        BatchWindow: 300,
      },
      WorkflowName: { Ref: 'myWorkflow931F3265' },
    });
  });

  test('conditional', () => {
    // WHEN
    workflow.addConditionalTrigger('ConditionalTrigger', {
      actions: [{
        crawler: crawler,
        arguments: {
          foo: 'bar',
          key: 'value',
        },
        timeout: cdk.Duration.seconds(5 * 60),
        securityConfiguration: securityConfiguration,
        delayCloudwatchEvent: cdk.Duration.seconds(60),
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
      Type: 'CONDITIONAL',
      Actions: [{
        CrawlerName: { Ref: 'myCrawler' },
        Arguments: {
          foo: 'bar',
          key: 'value',
        },
        Timeout: 5,
        NotificationProperty: {
          NotifyDelayAfter: 1,
        },
      }],
      Predicate: {
        Conditions: [
          {
            JobName: { Ref: 'myJob9A6589B3' },
            LogicalOperator: 'EQUALS',
            State: 'SUCCEEDED',
          },
          {
            CrawlerName: { Ref: 'myCrawler' },
            LogicalOperator: 'EQUALS',
            CrawlState: 'SUCCEEDED',
          },
        ],
        Logical: 'ALL',
      },
      WorkflowName: { Ref: 'myWorkflow931F3265' },
    });
  });

  test('conditional with no predicates', () => {
    // WHEN
    expect(() =>
      workflow.addConditionalTrigger('ConditionalTrigger', {
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
      script: glue.Code.fromBucket(Bucket.fromBucketName(stack, 'myBucket', 'my-bucket'), 'myKey'),
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
  expect(() => workflow.addOnDemandTrigger('OnDemandTrigger', {
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
  expect(() => workflow.addOnDemandTrigger('OnDemandTrigger', {
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