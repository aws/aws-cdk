import * as cdk from 'aws-cdk-lib';
import { Template, Capture } from 'aws-cdk-lib/assertions';
import { CfnCrawler } from 'aws-cdk-lib/aws-glue';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as glue from '../lib';
import { TriggerSchedule } from '../lib/triggers/trigger-options';

describe('Workflow and Triggers', () => {
  let stack: cdk.Stack;
  let workflow: glue.Workflow;
  let job: glue.PySparkEtlJob;
  let role: iam.Role;

  beforeEach(() => {
    stack = new cdk.Stack();
    workflow = new glue.Workflow(stack, 'Workflow', {
      description: 'MyWorkflow',
    });

    role = new iam.Role(stack, 'JobRole', {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
    });

    job = new glue.PySparkEtlJob(stack, 'Job', {
      script: glue.Code.fromAsset('test/job-script/hello_world.py'),
      role,
      glueVersion: glue.GlueVersion.V4_0,
      workerType: glue.WorkerType.G_1X,
      numberOfWorkers: 10,
    });
  });

  test('creates a workflow with triggers and actions', () => {
    workflow.addOnDemandTrigger('OnDemandTrigger', {
      actions: [glue.Action.job(job)],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Workflow', {
      Description: 'MyWorkflow',
    });

    Template.fromStack(stack).resourceCountIs('AWS::Glue::Trigger', 1);

    const workflowReference = new Capture();
    const actionReference = new Capture();
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Type: 'ON_DEMAND',
      WorkflowName: workflowReference,
      Actions: [actionReference],
    });

    expect(workflowReference.asObject()).toEqual(
      {
        Ref: 'Workflow193EF7C1',
      },
    );

    expect(actionReference.asObject()).toEqual(
      {
        JobName: {
          Ref: 'JobB9D00F9F',
        },
      },
    );
  });

  test('creates a workflow with conditional trigger', () => {
    workflow.addConditionalTrigger('ConditionalTrigger', {
      actions: [glue.Action.job(job)],
      predicate: {
        conditions: [
          glue.Condition.job(job, glue.JobState.SUCCEEDED),
        ],
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::Glue::Trigger', 1);

    const workflowReference = new Capture();
    const actionReference = new Capture();
    const predicateReference = new Capture();
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Type: 'CONDITIONAL',
      WorkflowName: workflowReference,
      Actions: [actionReference],
      Predicate: predicateReference,
    });

    expect(workflowReference.asObject()).toEqual(
      expect.objectContaining({
        Ref: 'Workflow193EF7C1',
      }),
    );

    expect(actionReference.asObject()).toEqual(
      expect.objectContaining({
        JobName: {
          Ref: 'JobB9D00F9F',
        },
      }),
    );

    expect(predicateReference.asObject()).toEqual(
      expect.objectContaining({
        Conditions: [
          {
            JobName: {
              Ref: 'JobB9D00F9F',
            },
            LogicalOperator: 'EQUALS',
            State: 'SUCCEEDED',
          },
        ],
      }),
    );
  });

  test('creates a workflow with daily scheduled trigger', () => {
    workflow.addDailyScheduledTrigger('DailyScheduledTrigger', {
      actions: [glue.Action.job(job)],
      startOnCreation: true,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Glue::Trigger', 1);

    const workflowReference = new Capture();
    const actionReference = new Capture();
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Type: 'SCHEDULED',
      WorkflowName: workflowReference,
      Schedule: 'cron(0 0 * * ? *)',
      StartOnCreation: true,
      Actions: [actionReference],
    });

    expect(workflowReference.asObject()).toEqual(
      expect.objectContaining({
        Ref: 'Workflow193EF7C1',
      }),
    );

    expect(actionReference.asObject()).toEqual(
      expect.objectContaining({
        JobName: {
          Ref: 'JobB9D00F9F',
        },
      }),
    );
  });

  test('creates a workflow with weekly scheduled trigger', () => {
    workflow.addWeeklyScheduledTrigger('WeeklyScheduledTrigger', {
      actions: [glue.Action.job(job)],
      startOnCreation: false,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Glue::Trigger', 1);

    const workflowReference = new Capture();
    const actionReference = new Capture();
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Type: 'SCHEDULED',
      WorkflowName: workflowReference,
      Schedule: 'cron(0 0 ? * SUN *)',
      StartOnCreation: false,
      Actions: [actionReference],
    });

    expect(workflowReference.asObject()).toEqual(
      expect.objectContaining({
        Ref: 'Workflow193EF7C1',
      }),
    );

    expect(actionReference.asObject()).toEqual(
      expect.objectContaining({
        JobName: {
          Ref: 'JobB9D00F9F',
        },
      }),
    );
  });

  test('creates a workflow with custom scheduled trigger', () => {
    const customSchedule = TriggerSchedule.cron({
      minute: '0',
      hour: '20',
      weekDay: 'THU',
    });

    workflow.addCustomScheduledTrigger('CustomScheduledTrigger', {
      actions: [glue.Action.job(job)],
      schedule: customSchedule,
      startOnCreation: true,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Glue::Trigger', 1);

    const workflowReference = new Capture();
    const actionReference = new Capture();
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Type: 'SCHEDULED',
      WorkflowName: workflowReference,
      Schedule: 'cron(0 20 ? * THU *)',
      StartOnCreation: true,
      Actions: [actionReference],
    });

    expect(workflowReference.asObject()).toEqual(
      expect.objectContaining({
        Ref: 'Workflow193EF7C1',
      }),
    );

    expect(actionReference.asObject()).toEqual(
      expect.objectContaining({
        JobName: {
          Ref: 'JobB9D00F9F',
        },
      }),
    );
  });

  test('creates a workflow with notify event trigger', () => {
    workflow.addNotifyEventTrigger('NotifyEventTrigger', {
      actions: [glue.Action.job(job)],
      eventBatchingCondition: {
        batchSize: 10,
        batchWindow: cdk.Duration.minutes(5),
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::Glue::Trigger', 1);

    const workflowReference = new Capture();
    const actionReference = new Capture();
    const eventBatchingConditionReference = new Capture();
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Type: 'EVENT',
      WorkflowName: workflowReference,
      Actions: [actionReference],
      EventBatchingCondition: eventBatchingConditionReference,
    });

    expect(workflowReference.asObject()).toEqual(
      expect.objectContaining({
        Ref: 'Workflow193EF7C1',
      }),
    );

    expect(actionReference.asObject()).toEqual(
      expect.objectContaining({
        JobName: {
          Ref: 'JobB9D00F9F',
        },
      }),
    );

    expect(eventBatchingConditionReference.asObject()).toEqual(
      expect.objectContaining({
        BatchSize: 10,
        BatchWindow: 300,
      }),
    );
  });

  test('renders a crawler action with its options', () => {
    const crawler = CfnCrawler.fromCrawlerName(stack, 'ImportedCrawler', 'my-crawler');

    workflow.addOnDemandTrigger('OnDemandTrigger', {
      actions: [glue.Action.crawler(crawler, {
        timeout: cdk.Duration.minutes(30),
      })],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Type: 'ON_DEMAND',
      Actions: [{
        CrawlerName: 'my-crawler',
        Timeout: 30,
      }],
    });
  });

  test('renders a crawler condition', () => {
    const crawler = CfnCrawler.fromCrawlerName(stack, 'ImportedCrawler', 'my-crawler');

    workflow.addConditionalTrigger('ConditionalTrigger', {
      actions: [glue.Action.job(job)],
      predicate: {
        conditions: [
          glue.Condition.crawler(crawler, glue.CrawlerState.SUCCEEDED),
        ],
      },
    });

    const predicateReference = new Capture();
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Type: 'CONDITIONAL',
      Predicate: predicateReference,
    });

    expect(predicateReference.asObject()).toEqual(
      expect.objectContaining({
        Conditions: [
          {
            CrawlerName: 'my-crawler',
            CrawlState: 'SUCCEEDED',
            LogicalOperator: 'EQUALS',
          },
        ],
      }),
    );
  });

  test('honors an overridden condition logical operator', () => {
    workflow.addConditionalTrigger('ConditionalTrigger', {
      actions: [glue.Action.job(job)],
      predicate: {
        conditions: [
          glue.Condition.job(job, glue.JobState.FAILED, {
            logicalOperator: glue.ConditionLogicalOperator.EQUALS,
          }),
        ],
      },
    });

    const predicateReference = new Capture();
    Template.fromStack(stack).hasResourceProperties('AWS::Glue::Trigger', {
      Type: 'CONDITIONAL',
      Predicate: predicateReference,
    });

    expect(predicateReference.asObject()).toEqual(
      expect.objectContaining({
        Conditions: [
          {
            JobName: { Ref: 'JobB9D00F9F' },
            State: 'FAILED',
            LogicalOperator: 'EQUALS',
          },
        ],
      }),
    );
  });
});

describe('.fromWorkflowAttributes()', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('with required attrs only', () => {
    const workflowName = 'my-existing-workflow';
    const importedWorkflow = glue.Workflow.fromWorkflowAttributes(stack, 'ImportedWorkflow', { workflowName });

    expect(importedWorkflow.workflowName).toEqual(workflowName);
    expect(importedWorkflow.workflowArn).toEqual(stack.formatArn({
      service: 'glue',
      resource: 'workflow',
      resourceName: workflowName,
    }));
  });
});

describe('import factories', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('fromWorkflowName derives the ARN from the name', () => {
    const imported = glue.Workflow.fromWorkflowName(stack, 'Imported', 'my-workflow');

    expect(imported.workflowName).toEqual('my-workflow');
    expect(imported.workflowArn).toEqual(stack.formatArn({
      service: 'glue',
      resource: 'workflow',
      resourceName: 'my-workflow',
    }));
  });

  test('fromWorkflowArn extracts the name from the ARN', () => {
    const workflowArn = 'arn:aws:glue:us-east-1:123456789012:workflow/my-workflow';

    const imported = glue.Workflow.fromWorkflowArn(stack, 'Imported', workflowArn);

    // The name is parsed out of the ARN, and the ARN is rebuilt from it in the
    // importing stack's environment.
    expect(imported.workflowName).toEqual('my-workflow');
    expect(imported.workflowArn).toEqual(stack.formatArn({
      service: 'glue',
      resource: 'workflow',
      resourceName: 'my-workflow',
    }));
  });
});
