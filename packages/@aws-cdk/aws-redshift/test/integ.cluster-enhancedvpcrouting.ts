#!/usr/bin/env node
import * as ec2 from '@aws-cdk/aws-ec2';
import { Stack, App, StackProps } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as redshift from '../lib';

class RedshiftEnv extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    new redshift.Cluster(this, 'Cluster', {
      vpc: vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      masterUser: {
        masterUsername: 'admin',
      },
      enhancedVpcRouting: true,
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'EnhancedVpcRouting', {
  testCases: [new RedshiftEnv(app, 'redshift-enhancedvpcrouting-integ')],
});

app.synth();
