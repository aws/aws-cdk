import { App, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as backup from 'aws-cdk-lib/aws-backup';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * Integration test for BackupSelection with conditions property.
 *
 * This test verifies that the `conditions` property correctly generates
 * CloudFormation `Conditions` (AND logic) instead of `ListOfTags` (OR logic).
 */
class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vault = new backup.BackupVault(this, 'Vault', {
      removalPolicy: RemovalPolicy.DESTROY,
      lockConfiguration: {
        minRetention: Duration.days(5),
      },
    });

    const plan = backup.BackupPlan.dailyWeeklyMonthly5YearRetention(this, 'Plan', vault);

    // Test 1: Selection with stringEquals condition (AND logic)
    plan.addSelection('SelectionWithConditions', {
      resources: [
        backup.BackupResource.fromArn('arn:aws:ec2:*:*:volume/*'),
      ],
      conditions: {
        stringEquals: [
          { key: 'backup-enabled', value: 'true' },
        ],
      },
    });

    // Test 2: Selection with multiple condition types
    plan.addSelection('SelectionWithMultipleConditions', {
      resources: [
        backup.BackupResource.fromArn('arn:aws:rds:*:*:db:*'),
      ],
      conditions: {
        stringEquals: [
          { key: 'environment', value: 'production' },
        ],
        stringLike: [
          { key: 'project', value: 'myproject-*' },
        ],
        stringNotEquals: [
          { key: 'temporary', value: 'true' },
        ],
      },
    });

    // Test 3: Selection with fromTag (OR logic) - verify backward compatibility
    plan.addSelection('SelectionWithFromTag', {
      resources: [
        backup.BackupResource.fromArn('arn:aws:dynamodb:*:*:table/*'),
        backup.BackupResource.fromTag('backup', 'daily'),
      ],
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-backup-selection-conditions');

new IntegTest(app, 'BackupSelectionConditionsTest', {
  testCases: [stack],
});
