import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { SecurityGroup, Vpc } from '@aws-cdk/aws-ec2';
import { AccountRootPrincipal, Role } from '@aws-cdk/aws-iam';
import { App, Duration, Stack, StackProps } from '@aws-cdk/core';
import { Cluster } from '../lib';

class ClusterIntegrationTest extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'MyVpc');
    const securityGroupOne = new SecurityGroup(this, 'MySecurityGroupOne', { vpc });
    const securityGroupTwo = new SecurityGroup(this, 'MySecurityGroupTwo', { vpc });

    const cluster = new Cluster(this, 'MyCluster', {
      tables: [new Table(this, 'Table', {
        partitionKey: {
          name: 'PrimaryKey',
          type: AttributeType.STRING,
        },
      })],
      recordTtl: Duration.minutes(10),
      subnets: vpc.privateSubnets,
      serverSideEncryption: true,
      securityGroups: [securityGroupOne, securityGroupTwo],
    });

    const appRole = new Role(this, 'ApplicationRole', {
      assumedBy: new AccountRootPrincipal(),
    });
    cluster.grantReadWriteData(appRole);
  }
}

const app = new App();

new ClusterIntegrationTest(app, 'ClusterIntegrationTest');

app.synth();
