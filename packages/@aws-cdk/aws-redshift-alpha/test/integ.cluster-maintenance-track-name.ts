import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Stack, App, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as redshift from '../lib';

class RedshiftStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc');

    const cluster = new redshift.Cluster(this, 'Cluster', {
      vpc: vpc,
      masterUser: {
        masterUsername: 'admin',
        excludeCharacters: '"@/\\\ \'`',
      },
      defaultDatabaseName: 'database',
      maintenanceTrackName: redshift.MaintenanceTrackName.TRAILING,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new redshift.User(this, 'User', {
      cluster,
      databaseName: 'database',
      excludeCharacters: '"@/\\\ \'`',
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'RedshiftMaintenanceTrackNameInteg', {
  testCases: [new RedshiftStack(app, 'RedshiftMaintenanceTrackNameIntegStack')],
});
