import {expect, haveResource} from '@aws-cdk/assert';
import {Schedule} from '@aws-cdk/aws-events';
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/core');
import {Test, testCase} from 'nodeunit';
import {BackupPlan, BackupSelection, BackupVault, EventType} from '../lib';

// tslint:disable:object-literal-key-quotes

export = testCase({
  'default backup vault is created'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new BackupVault(stack, 'MyTestVault', {
      backupVaultName: 'MyVault',
    });

    // THEN
    expect(stack).toMatch({
      Resources: {
        MyTestVault8A7DCE60: {
          Type: 'AWS::Backup::BackupVault',
          Properties: {
            BackupVaultName: 'MyVault',
          }
        }
      }
    });

    test.done();
  },

  'backup vault with encryption key'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new BackupVault(stack, 'MyVault', {
      backupVaultName: 'MyVault',
      encryptionKey: new kms.Key(stack, 'MyKey'),
    });

    // THEN
    expect(stack).to(haveResource('AWS::Backup::BackupVault', {
      BackupVaultName: 'MyVault',
      EncryptionKeyArn: {
        'Fn::GetAtt': [
          'MyKey6AB29FA6',
          'Arn'
        ]
      }
    }));

    test.done();
  },

  'backup vault with SNS Topic notification'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new BackupVault(stack, 'MyVault', {
      backupVaultName: 'MyVault',
      notifications: {
        topic: new sns.Topic(stack, 'MyTopic'),
        events: [
          EventType.BACKUP_JOB_STARTED,
        ],
      },
    });

    // THEN
    expect(stack).to(haveResource('AWS::Backup::BackupVault', {
      BackupVaultName: 'MyVault',
      Notifications: {
        SNSTopicArn: {
          Ref: 'MyTopic86869434',
        },
        BackupVaultEvents: [
          EventType.BACKUP_JOB_STARTED,
        ],
      }
    }));

    test.done();
  },

  'backup vault with access policy'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // create a random policy statement
    const policyStatement = new iam.PolicyStatement();
    policyStatement.addAnyPrincipal();
    policyStatement.addAllResources();

    // WHEN
    new BackupVault(stack, 'MyVault', {
      backupVaultName: 'MyVault',
      accessPolicy: new iam.PolicyDocument({
        statements: [policyStatement],
      }),
    });

    // THEN
    expect(stack).to(haveResource('AWS::Backup::BackupVault', {
      BackupVaultName: 'MyVault',
      AccessPolicy: {
        Statement: [
          {
            Effect: iam.Effect.ALLOW,
            Principal: '*',
            Resource: '*',
          }
        ],
        Version: '2012-10-17',
      }
    }));

    test.done();
  },

  'simple backup plan'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vault = new BackupVault(stack, 'MyVault', {
      backupVaultName: 'MyVault'
    });
    const schedule = Schedule.cron({hour: '2'});

    // WHEN
    new BackupPlan(stack, 'MyBackupPlan', {
      backupPlanName: 'ThePlanArises',
      rules: [
        {
          ruleName: 'MyFirstRule',
          schedule,
        },
      ],
      vault,
    });

    // THEN
    expect(stack).to(haveResource('AWS::Backup::BackupVault', {
      BackupVaultName: 'MyVault',
    }));
    expect(stack).to(haveResource('AWS::Backup::BackupPlan', {
      BackupPlan: {
        BackupPlanName: 'ThePlanArises',
        BackupPlanRule: [
          {
            RuleName: 'MyFirstRule',
            ScheduleExpression: schedule.expressionString,
            TargetBackupVault: {
              Ref: 'MyVault803A42DC',
            },
          }
        ],
      }
    }));

    test.done();
  },

  'add backup rules into backup plan'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vault = new BackupVault(stack, 'MyVault', {
      backupVaultName: 'MyVault'
    });
    const schedule = Schedule.cron({hour: '2'});

    // WHEN
    const backupPlan = new BackupPlan(stack, 'MyPlan', {
      backupPlanName: 'TheReturnOfThePlan',
      rules: [{
        ruleName: 'MyFirstRule',
        schedule,
      }],
      vault,
    });

    backupPlan.addPlanRule({
      ruleName: 'MySecondRule',
      schedule,
    });

    // THEN
    expect(stack).to(haveResource('AWS::Backup::BackupVault', {
      BackupVaultName: 'MyVault'
    }));
    expect(stack).to(haveResource('AWS::Backup::BackupPlan', {
      BackupPlan: {
        BackupPlanName: 'TheReturnOfThePlan',
        BackupPlanRule: [
          {
            RuleName: 'MyFirstRule',
            ScheduleExpression: schedule.expressionString,
            TargetBackupVault: {
              Ref: 'MyVault803A42DC',
            }
          },
          {
            RuleName: 'MySecondRule',
            ScheduleExpression: schedule.expressionString,
            TargetBackupVault: {
              Ref: 'MyVault803A42DC',
            },
          },
        ]
      }
    }));

    test.done();
  },

  'backup plan with rules and lifecycles'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vault = new BackupVault(stack, 'BearVault', {
      backupVaultName: 'BearVault',
    });
    const schedule = Schedule.cron({hour: '4'});
    const deleteAfter = cdk.Duration.days(270);
    const moveToColdStorageAfter = cdk.Duration.days(120);

    // WHEN
    const backupPlan = new BackupPlan(stack, 'MyBearlyPlan', {
      backupPlanName: 'BearlyPlan',
      rules: [],
      vault,
    });
    backupPlan.addPlanRule({
      ruleName: 'PandaRule',
      lifecycle: {
        deleteAfter,
        moveToColdStorageAfter,
      },
      schedule,
    });

    // THEN
    expect(stack).to(haveResource('AWS::Backup::BackupVault', {
      BackupVaultName: 'BearVault',
    }));
    expect(stack).to(haveResource('AWS::Backup::BackupPlan', {
      BackupPlan: {
        BackupPlanName: 'BearlyPlan',
        BackupPlanRule: [
          {
            RuleName: 'PandaRule',
            ScheduleExpression: schedule.expressionString,
            TargetBackupVault: {
              Ref: 'BearVault02C72C73'
            },
            Lifecycle: {
              DeleteAfterDays: deleteAfter.toDays(),
              MoveToColdStorageAfterDays: moveToColdStorageAfter.toDays(),
            },
          }
        ],
      },
    }));

    test.done();
  },

  'backup plan with rule and window support'(test: Test) {
    // GIVE
    const stack = new cdk.Stack();
    const vault = new BackupVault(stack, 'MyBackupVault', {
      backupVaultName: 'MyVault',
    });
    const schedule = Schedule.cron({hour: '4'});
    const completionWindow = cdk.Duration.hours(2);
    const startWindowAfter = cdk.Duration.hours(1);

    // WHEN
    new BackupPlan(stack, 'Plan Z', {
      backupPlanName: 'Plan Z',
      rules: [{
        ruleName: 'Plan Z v1',
        schedule,
        completionWindow,
        startWindowAfter,
      }],
      vault,
    });

    // THEN
    expect(stack).to(haveResource('AWS::Backup::BackupPlan', {
      BackupPlan: {
        BackupPlanName: 'Plan Z',
        BackupPlanRule: [
          {
            RuleName: 'Plan Z v1',
            ScheduleExpression: schedule.expressionString,
            TargetBackupVault: {
              Ref: 'MyBackupVaultC4DF6F64',
            },
            CompletionWindowMinutes: completionWindow.toMinutes(),
            StartWindowMinutes: startWindowAfter.toMinutes(),
          }
        ],
      }
    }));

    // THEN
    test.done();
  },

  'backup plan with selection without given IAM Role'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vault = new BackupVault(stack, 'Vault', {
      backupVaultName: 'Vault',
    });
    const plan = new BackupPlan(stack, 'Plan', {
      backupPlanName: 'Plan X',
      rules: [],
      vault,
    });

    // WHEN
    new BackupSelection(stack, 'BackupSelection', {
      backupPlan: plan,
      backupSelectionName: 'MySelection',
    });

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'backup.amazonaws.com',
            },
          },
        ],
      },
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup',
            ]
          ],
        }
      ],
    }));
    expect(stack).to(haveResource('AWS::Backup::BackupSelection', {
      BackupPlanId: 'Plan X',
      BackupSelection: {
        IamRoleArn: {
          'Fn::GetAtt': [
            'BackupSelectionRoleD4B27382',
            'Arn',
          ],
        },
        SelectionName: 'MySelection',
      },
    }));

    test.done();
  },

  'backup plan with selection with given IAM Role'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vault = new BackupVault(stack, 'Vault', {
      backupVaultName: 'Vault',
    });
    const plan = new BackupPlan(stack, 'Plan', {
      backupPlanName: 'Plan X',
      rules: [],
      vault,
    });
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('backup.amazonaws.com'),
    });

    // WHEN
    new BackupSelection(stack, 'BackupSelection', {
      backupPlan: plan,
      backupSelectionName: 'MySelection',
      role,
    });

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'backup.amazonaws.com',
            },
          },
        ],
      },
    }));
    expect(stack).to(haveResource('AWS::Backup::BackupSelection', {
      BackupPlanId: 'Plan X',
      BackupSelection: {
        IamRoleArn: {
          'Fn::GetAtt': [
            'Role1ABCC5F0',
            'Arn',
          ],
        },
        SelectionName: 'MySelection',
      },
    }));

    test.done();
  },

});
