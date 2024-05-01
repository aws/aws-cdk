import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as efs from 'aws-cdk-lib/aws-efs';
import { App, Duration, RemovalPolicy, Stack, StackProps, CfnParameter } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as backup from 'aws-cdk-lib/aws-backup';

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
      lockConfiguration: {
        minRetention: Duration.days(5),
      },
    });
    const secondaryVault = new backup.BackupVault(this, 'SecondaryVault', {
      removalPolicy: RemovalPolicy.DESTROY,
      lockConfiguration: {
        minRetention: Duration.days(5),
      },
    });

    const env = new CfnParameter(this, 'Env', { type: 'String', description: 'Env', default: 'test' });

    new backup.BackupVault(this, 'ThirdVault', {
      removalPolicy: RemovalPolicy.DESTROY,
      backupVaultName: `backupVault-${env.valueAsString}`,
      lockConfiguration: {
        minRetention: Duration.days(5),
      },
    });

    const plan = backup.BackupPlan.dailyWeeklyMonthly5YearRetention(this, 'Plan', vault);

    plan.addSelection('Selection', {
      resources: [
        backup.BackupResource.fromConstruct(this), // All backupable resources in this construct
        backup.BackupResource.fromTag('stage', 'prod'), // Resources that are tagged stage=prod
      ],
    });

    plan.addRule(new backup.BackupPlanRule({
      copyActions: [{
        destinationBackupVault: secondaryVault,
        moveToColdStorageAfter: Duration.days(30),
        deleteAfter: Duration.days(120),
      }],
      recoveryPointTags: {
        stage: 'prod',
      },
    }));
  }
}

const app = new App();
new TestStack(app, 'cdk-backup');
app.synth();
