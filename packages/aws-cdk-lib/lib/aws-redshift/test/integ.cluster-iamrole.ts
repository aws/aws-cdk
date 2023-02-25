import * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
import { App, RemovalPolicy, Stack, StackProps } from '../../core';
import * as integ from '../../integ-tests';
import { Construct } from 'constructs';
import * as redshift from '../lib';

class RedshiftEnv extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');
    const role = new iam.Role(this, 'RoleA', {
      assumedBy: new iam.ServicePrincipal('redshift.amazonaws.com'),
    });

    // Adding iam role after cluster creation
    const redshiftCluster = new redshift.Cluster(this, 'Cluster', {
      vpc: vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      masterUser: {
        masterUsername: 'admin',
      },
      roles: [new iam.Role(this, 'RoleB', {
        assumedBy: new iam.ServicePrincipal('redshift.amazonaws.com'),
      })],
      removalPolicy: RemovalPolicy.DESTROY,
    });

    redshiftCluster.addIamRole(role);
  }
}

const app = new App();

new integ.IntegTest(app, 'IamRoleInteg', {
  testCases: [new RedshiftEnv(app, 'redshift-iamrole-integ')],
});

app.synth();
