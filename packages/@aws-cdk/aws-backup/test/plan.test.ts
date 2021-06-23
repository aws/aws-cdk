import '@aws-cdk/assert-internal/jest';
import * as events from '@aws-cdk/aws-events';
import { App, Duration, Stack } from '@aws-cdk/core';
import { BackupPlan, BackupPlanRule, BackupVault } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('create a plan and add rules', () => {
  // GIVEN
  const vault = new BackupVault(stack, 'Vault');
  const otherVault = new BackupVault(stack, 'OtherVault');

  // WHEN
  const plan = new BackupPlan(stack, 'Plan', {
    backupVault: vault,
    backupPlanRules: [
      new BackupPlanRule({
        completionWindow: Duration.hours(2),
        startWindow: Duration.hours(1),
        scheduleExpression: events.Schedule.cron({
          day: '15',
          hour: '3',
          minute: '30',
        }),
        moveToColdStorageAfter: Duration.days(30),
      }),
    ],
  });
  plan.addRule(BackupPlanRule.monthly5Year(otherVault));

  // THEN
  expect(stack).toHaveResource('AWS::Backup::BackupPlan', {
    BackupPlan: {
      BackupPlanName: 'Plan',
      BackupPlanRule: [
        {
          CompletionWindowMinutes: 120,
          Lifecycle: {
            MoveToColdStorageAfterDays: 30,
          },
          RuleName: 'PlanRule0',
          ScheduleExpression: 'cron(30 3 15 * ? *)',
          StartWindowMinutes: 60,
          TargetBackupVault: {
            'Fn::GetAtt': [
              'Vault23237E5B',
              'BackupVaultName',
            ],
          },
        },
        {
          Lifecycle: {
            DeleteAfterDays: 1825,
            MoveToColdStorageAfterDays: 90,
          },
          RuleName: 'Monthly5Year',
          ScheduleExpression: 'cron(0 5 1 * ? *)',
          TargetBackupVault: {
            'Fn::GetAtt': [
              'OtherVault3C99BCE2',
              'BackupVaultName',
            ],
          },
        },
      ],
    },
  });
});

test('daily35DayRetention', () => {
  // WHEN
  BackupPlan.daily35DayRetention(stack, 'D35');

  // THEN
  expect(stack).toHaveResource('AWS::Backup::BackupPlan', {
    BackupPlan: {
      BackupPlanName: 'D35',
      BackupPlanRule: [
        {
          Lifecycle: {
            DeleteAfterDays: 35,
          },
          RuleName: 'Daily',
          ScheduleExpression: 'cron(0 5 * * ? *)',
          TargetBackupVault: {
            'Fn::GetAtt': [
              'D35Vault2A9EB06F',
              'BackupVaultName',
            ],
          },
        },
      ],
    },
  });
});

test('dailyWeeklyMonthly7YearRetention', () => {
  // WHEN
  BackupPlan.dailyWeeklyMonthly7YearRetention(stack, 'DWM7');

  // THEN
  expect(stack).toHaveResource('AWS::Backup::BackupPlan', {
    BackupPlan: {
      BackupPlanName: 'DWM7',
      BackupPlanRule: [
        {
          Lifecycle: {
            DeleteAfterDays: 35,
          },
          RuleName: 'Daily',
          ScheduleExpression: 'cron(0 5 * * ? *)',
          TargetBackupVault: {
            'Fn::GetAtt': [
              'DWM7Vault21F17E61',
              'BackupVaultName',
            ],
          },
        },
        {
          Lifecycle: {
            DeleteAfterDays: 90,
          },
          RuleName: 'Weekly',
          ScheduleExpression: 'cron(0 5 ? * SAT *)',
          TargetBackupVault: {
            'Fn::GetAtt': [
              'DWM7Vault21F17E61',
              'BackupVaultName',
            ],
          },
        },
        {
          Lifecycle: {
            DeleteAfterDays: 2555,
            MoveToColdStorageAfterDays: 90,
          },
          RuleName: 'Monthly7Year',
          ScheduleExpression: 'cron(0 5 1 * ? *)',
          TargetBackupVault: {
            'Fn::GetAtt': [
              'DWM7Vault21F17E61',
              'BackupVaultName',
            ],
          },
        },
      ],
    },
  });
});

test('automatically creates a new vault', () => {
  // GIVEN
  const plan = new BackupPlan(stack, 'Plan');

  // WHEN
  plan.addRule(BackupPlanRule.daily());

  // THEN
  expect(stack).toHaveResource('AWS::Backup::BackupPlan', {
    BackupPlan: {
      BackupPlanName: 'Plan',
      BackupPlanRule: [
        {
          Lifecycle: {
            DeleteAfterDays: 35,
          },
          RuleName: 'Daily',
          ScheduleExpression: 'cron(0 5 * * ? *)',
          TargetBackupVault: {
            'Fn::GetAtt': [
              'PlanVault0284B0C2',
              'BackupVaultName',
            ],
          },
        },
      ],
    },
  });
});

test('throws when deleteAfter is not greater than moveToColdStorageAfter', () => {
  expect(() => new BackupPlanRule({
    deleteAfter: Duration.days(5),
    moveToColdStorageAfter: Duration.days(6),
  })).toThrow(/`deleteAfter` must be greater than `moveToColdStorageAfter`/);
});

test('throws when scheduleExpression is not of type cron', () => {
  expect(() => new BackupPlanRule({
    scheduleExpression: events.Schedule.rate(Duration.hours(5)),
  })).toThrow(/`scheduleExpression` must be of type `cron`/);
});

test('synth fails when plan has no rules', () => {
  // GIVEN
  const app = new App();
  const myStack = new Stack(app, 'Stack');

  // WHEN
  new BackupPlan(myStack, 'Plan');

  expect(() => app.synth()).toThrow(/A backup plan must have at least 1 rule/);
});
