import * as cdk from 'aws-cdk-lib';
import * as glueCfn from 'aws-cdk-lib/aws-glue';
import * as path from 'path';
import * as glue from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-glue-workflow');

new glue.Workflow(stack, 'MyWorkflowTask');
const script = glue.Code.fromAsset(path.join(__dirname, 'job-script', 'hello_world.py'));
const glueJob = new glue.Job(stack, 'MyJob', {
  executable: glue.JobExecutable.pythonShell({
    glueVersion: glue.GlueVersion.V1_0,
    pythonVersion: glue.PythonVersion.THREE,
    script,
  }),
});
const crawler = new glueCfn.CfnCrawler(stack, 'MyCrawler', {
  databaseName: 'my_database',
  targets: {
    s3Targets: [{ path: 's3://my_bucket' }],
  },
  role: 'my_role',
});
const predicateGlueJob = new glue.Job(stack, 'MyPredicateJob', {
  executable: glue.JobExecutable.pythonShell({
    glueVersion: glue.GlueVersion.V1_0,
    pythonVersion: glue.PythonVersion.THREE,
    script,
  }),
});
const predicateCrawler = new glueCfn.CfnCrawler(stack, 'MyPredicateCrawler', {
  databaseName: 'my_database',
  targets: {
    s3Targets: [{ path: 's3://my_bucket' }],
  },
  role: 'my_role',
});
const securityConfiguration = new glue.SecurityConfiguration(stack, 'MySecurityConfiguration', {
  s3Encryption: {
    mode: glue.S3EncryptionMode.S3_MANAGED,
  },
});

const workflow = new glue.Workflow(stack, 'MyWorkflow', {
  workflowName: 'my_workflow',
  description: 'my_workflow_description',
});

workflow.addConditionalTrigger('MyConditionalTrigger', {
  triggerName: 'my_conditional_trigger',
  description: 'my_conditional_trigger_description',
  enabled: true,
  predicateCondition: glue.TriggerPredicateCondition.AND,
  jobPredicates: [{
    job: predicateGlueJob,
    state: glue.PredicateState.SUCCEEDED,
  }],
  crawlerPredicates: [{
    crawler: predicateCrawler,
    state: glue.PredicateState.SUCCEEDED,
  }],
  actions: [
    {
      job: glueJob,
      delayCloudwatchEvent: cdk.Duration.minutes(5),
      arguments: {
        '--arg1': 'value1',
      },
      securityConfiguration: securityConfiguration,
      timeout: cdk.Duration.minutes(10),
    },
    {
      crawler: crawler,
      delayCloudwatchEvent: cdk.Duration.minutes(5),
      securityConfiguration: securityConfiguration,
      timeout: cdk.Duration.minutes(10),
    },
  ],
});

workflow.addOnDemandTrigger('MyOnDemandTrigger', {
  triggerName: 'my_on_demand_trigger',
  description: 'my_on_demand_trigger_description',
  enabled: true,
  actions: [
    {
      job: glueJob,
      arguments: {
        '--arg1': 'value1',
      },
      securityConfiguration: securityConfiguration,
      timeout: cdk.Duration.minutes(10),
    },
    {
      crawler: crawler,
      securityConfiguration: securityConfiguration,
      timeout: cdk.Duration.minutes(10),
    },
  ],
});

workflow.addDailyScheduleTrigger('MyDailySchedule', {
  triggerName: 'my_daily_schedule',
  description: 'my_daily_schedule_description',
  enabled: true,
  actions: [
    {
      job: glueJob,
      delayCloudwatchEvent: cdk.Duration.minutes(5),
      arguments: {
        '--arg1': 'value1',
      },
      securityConfiguration: securityConfiguration,
      timeout: cdk.Duration.minutes(10),
    },
    {
      crawler: crawler,
      delayCloudwatchEvent: cdk.Duration.minutes(5),
      securityConfiguration: securityConfiguration,
      timeout: cdk.Duration.minutes(10),
    },
  ],
});

workflow.addWeeklyScheduleTrigger('MyWeeklySchedule', {
  triggerName: 'my_weekly_schedule',
  description: 'my_weekly_schedule_description',
  enabled: true,
  actions: [
    {
      job: glueJob,
      delayCloudwatchEvent: cdk.Duration.minutes(5),
      arguments: {
        '--arg1': 'value1',
      },
      securityConfiguration: securityConfiguration,
      timeout: cdk.Duration.minutes(10),
    },
    {
      crawler: crawler,
      delayCloudwatchEvent: cdk.Duration.minutes(5),
      securityConfiguration: securityConfiguration,
      timeout: cdk.Duration.minutes(10),
    },
  ],
});

workflow.addMonthlyScheduleTrigger('MyMonthlySchedule', {
  triggerName: 'my_monthly_schedule',
  description: 'my_monthly_schedule_description',
  enabled: true,
  actions: [
    {
      job: glueJob,
      delayCloudwatchEvent: cdk.Duration.minutes(5),
      arguments: {
        '--arg1': 'value1',
      },
      securityConfiguration: securityConfiguration,
      timeout: cdk.Duration.minutes(10),
    },
    {
      crawler: crawler,
      delayCloudwatchEvent: cdk.Duration.minutes(5),
      securityConfiguration: securityConfiguration,
      timeout: cdk.Duration.minutes(10),
    },
  ],
});

workflow.addNotifyEventTrigger('MyNotifyEvent', {
  triggerName: 'my_notify_event',
  description: 'my_notify_event_description',
  enabled: true,
  batchSize: 10,
  batchWindow: cdk.Duration.minutes(10),
  actions: [
    {
      job: glueJob,
      delayCloudwatchEvent: cdk.Duration.minutes(5),
      arguments: {
        '--arg1': 'value1',
      },
      securityConfiguration: securityConfiguration,
      timeout: cdk.Duration.minutes(10),
    },
    {
      crawler: crawler,
      delayCloudwatchEvent: cdk.Duration.minutes(5),
      securityConfiguration: securityConfiguration,
      timeout: cdk.Duration.minutes(10),
    },
  ],
});

glue.Workflow.fromWorkflowName(stack, 'imported-workflow', workflow.workflowName);
