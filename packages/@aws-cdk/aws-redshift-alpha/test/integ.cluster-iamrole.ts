import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, Aspects, CfnResource, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct, IConstruct } from 'constructs';
import * as redshift from '../lib';

class RedshiftEnv extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { restrictDefaultSecurityGroup: false });
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

class SingleProviderRoleStack extends Stack {
  private static databaseName = 'single-provider-role-integ-test.db';
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { restrictDefaultSecurityGroup: false });
    const cluster = new redshift.Cluster(this, 'Cluster', {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      masterUser: {
        masterUsername: 'admin',
      },
      defaultDatabaseName: SingleProviderRoleStack.databaseName,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    for (let i = 0; i < 3; i++) {
      new redshift.Table(this, `Table${i}`, {
        cluster: cluster,
        databaseName: SingleProviderRoleStack.databaseName,
        tableColumns: [
          { name: 'col1', dataType: 'varchar(4)', distKey: true, comment: 'A test column', encoding: redshift.ColumnEncoding.LZO },
          { name: 'col2', dataType: 'float', sortKey: true, comment: 'A test column' },
          { name: 'col3', dataType: 'float', comment: 'A test column', encoding: redshift.ColumnEncoding.RAW },
        ],
        distStyle: redshift.TableDistStyle.KEY,
        sortStyle: redshift.TableSortStyle.INTERLEAVED,
        tableComment: `A test table #${i}`,
      });
    }
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
  },
});

const singleProviderRoleTestStack = new SingleProviderRoleStack(app, 'single-provider-role-integ');
Aspects.of(singleProviderRoleTestStack).add({
  visit(node: IConstruct) {
    if (CfnResource.isCfnResource(node)) {
      node.applyRemovalPolicy(RemovalPolicy.DESTROY);
    }
  },
});

new integ.IntegTest(app, 'IamRoleInteg', {
  testCases: [
    new RedshiftEnv(app, 'redshift-iamrole-integ'),
    singleProviderRoleTestStack,
  ],
});
