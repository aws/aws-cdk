import * as cdk from 'aws-cdk-lib';
import { Template, Capture } from 'aws-cdk-lib/assertions';
import * as glue from '../lib';
import { TriggerSchedule } from '../lib/triggers/trigger-options';
import * as iam from 'aws-cdk-lib/aws-iam';

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
      actions: [{ job }],
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
      actions: [{ job }],
      predicate: {
        conditions: [
          {
            job,
            state: glue.JobState.SUCCEEDED,
          },
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
      actions: [{ job }],
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
      actions: [{ job }],
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
      actions: [{ job }],
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
      actions: [{ job }],
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
