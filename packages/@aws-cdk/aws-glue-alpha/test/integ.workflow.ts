import * as cdk from 'aws-cdk-lib';
import * as glueCfn from 'aws-cdk-lib/aws-glue';
import * as path from 'path';
import * as glue from '../lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-glue-workflow');

new glue.Workflow(stack, 'MyWorkflowTask');
const glueRole = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
});
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
  role: glueRole.roleArn,
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
  role: glueRole.roleArn,
});
const securityConfiguration = new glue.SecurityConfiguration(stack, 'MySecurityConfiguration', {
  s3Encryption: {
    mode: glue.S3EncryptionMode.S3_MANAGED,
  },
});

const onDemandWorkflow = new glue.Workflow(stack, 'MyWorkflow', {
  workflowName: 'my_on_demand_workflow',
  description: 'my_on_demand_workflow_description',
});

onDemandWorkflow.addOnDemandTrigger('MyOnDemandTrigger', {
  triggerName: 'my_on_demand_trigger',
  description: 'my_on_demand_trigger_description',
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

onDemandWorkflow.addConditionalTrigger('MyConditionalTrigger', {
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

const dailyWorkflow = new glue.Workflow(stack, 'MyDailyWorkflow', {
  workflowName: 'my_daily_workflow',
  description: 'my_daily_workflow_description',
});

dailyWorkflow.addDailyScheduleTrigger('MyDailySchedule', {
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

const weeklyWorkflow = new glue.Workflow(stack, 'MyWeeklyWorkflow', {
  workflowName: 'my_weekly_workflow',
  description: 'my_weekly_workflow_description',
});

weeklyWorkflow.addWeeklyScheduleTrigger('MyWeeklySchedule', {
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

const monthlyWorkflow = new glue.Workflow(stack, 'MyMonthlyWorkflow', {
  workflowName: 'my_monthly_workflow',
  description: 'my_monthly_workflow_description',
});

monthlyWorkflow.addMonthlyScheduleTrigger('MyMonthlySchedule', {
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

const eventWorkflow = new glue.Workflow(stack, 'MyEventWorkflow', {
  workflowName: 'my_event_workflow',
  description: 'my_event_workflow_description',
});

eventWorkflow.addNotifyEventTrigger('MyNotifyEvent', {
  triggerName: 'my_notify_event',
  description: 'my_notify_event_description',
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

const importedWorkflowByName = glue.Workflow.fromWorkflowName(stack, 'imported-workflow-name', monthlyWorkflow.workflowName);

glue.Workflow.fromWorkflowArn(stack, 'imported-workflow-arn', importedWorkflowByName.workflowArn);

new integ.IntegTest(app, 'aws-cdk-glue-table-integ', {
  testCases: [stack],
});

app.synth();
