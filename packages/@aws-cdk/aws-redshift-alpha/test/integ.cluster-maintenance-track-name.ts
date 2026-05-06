import * as integ from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { Stack, App, RemovalPolicy } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import type { Construct } from 'constructs';
import * as redshift from '../lib';

class RedshiftStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc');

    const cluster = new redshift.Cluster(this, 'Cluster', {
      vpc: vpc,
      masterUser: {
        masterUsername: 'admin',
        excludeCharacters: '"@/\\ \'`',
      },
      defaultDatabaseName: 'database',
      maintenanceTrackName: redshift.MaintenanceTrackName.TRAILING,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new redshift.User(this, 'User', {
      cluster,
      databaseName: 'database',
      excludeCharacters: '"@/\\ \'`',
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'aws-cdk-redshift-cluster-database');

new RedshiftStack(stack, 'RedshiftMaintenanceTrackNameIntegStack');

new integ.IntegTest(stack, 'RedshiftMaintenanceTrackNameInteg', {
  testCases: [stack],
});
