import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_AURORA_POSTGRES } from './db-versions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

class PostgresS3TestStack extends IntegTestBaseStack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    const instanceProps = {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
      isFromLegacyInstanceProps: true,
    };

    const importExportBucket = new s3.Bucket(this, 'ImportExportBucket', {
    });

    new rds.DatabaseCluster(this, 'PostgresDatabase', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: INTEG_TEST_LATEST_AURORA_POSTGRES,
      }),
      readers: [rds.ClusterInstance.provisioned('ReaderInstance', instanceProps)],
      writer: rds.ClusterInstance.provisioned('WriterInstance', instanceProps),
      vpc,
      s3ImportBuckets: [importExportBucket],
      s3ExportBuckets: [importExportBucket],
    });
  }
}

new IntegTest(app, 'postgres-s3-integ-test', {
  testCases: [new PostgresS3TestStack(app, 'aws-cdk-rds-s3-postgres-15-integ')],
});
