import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as redshift from '../lib';

class RedshiftEnv extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { restrictDefaultSecurityGroup: false });

    const databaseName = 'default_db';

    const cluster = new redshift.Cluster(this, 'Cluster', {
      vpc: vpc,
      defaultDatabaseName: databaseName,
      masterUser: {
        masterUsername: 'admin',
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const user = new redshift.User(this, 'User', {
      cluster,
      databaseName,
      adminUser: cluster.secret,
    });

    cluster.addRotationMultiUser('UserRotation', {
      secret: user.secret,
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'ClusterMultiUserRotationInteg', {
  testCases: [new RedshiftEnv(app, 'redshift-cluster-rotationmultiuser-integ')],
});

app.synth();
