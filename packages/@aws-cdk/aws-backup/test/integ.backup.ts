import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as efs from '@aws-cdk/aws-efs';
import { App, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as backup from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new dynamodb.Table(this, 'Table', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const fs = new efs.CfnFileSystem(this, 'FileSystem');
    fs.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const vault = new backup.BackupVault(this, 'Vault', {
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const plan = backup.BackupPlan.dailyWeeklyMonthly5YearRetention(this, 'Plan', vault);

    plan.addSelection('Selection', {
      resources: [
        backup.BackupResource.fromConstruct(this), // All backupable resources in this construct
        backup.BackupResource.fromTag('stage', 'prod'), // Resources that are tagged stage=prod
      ],
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-backup');
app.synth();
