import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as glueCfn from 'aws-cdk-lib/aws-glue';
import * as glue from '../lib';

test('workflow', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new glue.Workflow(stack, 'Workflow');

  // THEN
  Template.fromStack(stack).hasResource('AWS::Glue::Workflow', {
    Name: 'Workflow',
  });
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
  Template.fromStack(stack).hasResource('AWS::Glue::Workflow', {
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
        script: glue.Code.fromAsset('myScript'),
      })
    });
    crawler = new glueCfn.CfnCrawler(stack, 'myCrawler', {
      role: 'myRole',
      databaseName: 'myDatabase',
      targets: {
        s3Targets: [{ path: 'myPath' }]
      }
    });
    securityConfiguration = new glue.SecurityConfiguration(stack, 'mySecurityConfiguration');
  });

  test('workflow with triggers', () => {
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
      }]
    });
  
    // THEN
    Template.fromStack(stack).hasResource('AWS::Glue::Trigger', {
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
    })
  });
  const crawler = new glueCfn.CfnCrawler(stack, 'myCrawler', {
    role: 'myRole',
    databaseName: 'myDatabase',
    targets: {
      s3Targets: [{ path: 'myPath' }]
    }
  });

  // WHEN
  expect(() =>  workflow.addOnDemandTrigger(stack, 'OnDemandTrigger', {
    actions: [{
      job: job,
      crawler: crawler,
    }]
  }), 

  // THEN
  ).toThrow(/Only one of job or crawler can be specified in an action/);
});

test('workflow with trigger that has neither job nor crawler as one action', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const workflow = new glue.Workflow(stack, 'myWorkflow');

  // WHEN
  expect(() =>  workflow.addOnDemandTrigger(stack, 'OnDemandTrigger', {
    actions: [{
      arguments: {
        foo: 'bar',
        key: 'value',
      },
    }]
  }), 

  // THEN
  ).toThrow(/Either job or crawler must be specified in an action/);
});