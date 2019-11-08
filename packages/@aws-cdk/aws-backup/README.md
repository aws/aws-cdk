## AWS Backup Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**
>
> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->


This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

```ts
import backup = require('@aws-cdk/aws-backup');
```

### Backup vaults

The place where all backups will be stores is called a vault.
Create a backup vault for all the backups.

```ts
new backup.BackupVault(this, 'MyVault', {
  backupVaultName: 'MyVault',
});
```

You can also provide your own encryption key to encrypt your backups in the vault.

```ts
new backup.BackupVault(this, 'MyVault', {
  backupVaultName: 'MyVault',
  encryptionKey: new iam.Key(this, 'MyKey', {
    enabled: true,
  }),
});
```

### Backup Plan

A backup plan specifies the frequency of the backups and the lifecycle of the backups.

```ts
new backup.BackupPlan(this, 'MyBackupPlan', {
  backupPlanName: 'MyBackupPlan',
  vault: backupVault,
  rules: [
    {
      ruleName: 'HourlyBackups',
      schedule: Schedule.cron({
        hour: '0'
      }),
      lifecycle: {
        deleteAfter: Duration.days(270),
        moveToColdStorageAfter: Duration.days(90),
      },
    },
  ],
});
```

### Backup selections

```ts
new backup.BackupSelection(this, 'MySelections', {
  backupPlan: backupPlan,
  resources: dynamoTables.map(table => table.tableArn),
});
```

### Wiring it all up together

Since all backups require a BackupVault, we will of course need to create one first.

```ts
const backupVault = new BackupVault(this, 'MyBackupVault', {
  backupVaultName: 'WhereMyBackupsLive',
});

const backupPlan = new BackupPlan(this, 'BackupPlan', {
  backupPlanName: 'MyPlannedBackup',
  vault: backupVault,
});

backupPlan.addPlanRule({
  ruleName: 'HourlyBackups',
  schedule: Schedule.cron({hour: '1'}),
  completionWindow: Duration.hours(1),
  startWindowAfter: Duration.hours(1),
  lifecycle: {
    deleteAfter: Duration.days(270),
    moveToColdStorageAfter: Duration(90),
  },
});

new BackupSelection(this, 'DynamoDBSelections', {
  backupPlan: backupPlan,
  resources: dynamoTables.map(table => table.tableArn),
});
```
