import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as constructs from 'constructs';
import * as redshift from '../lib';

/**
 * This test does the following
 *
 * 1. Creates a stack with a Redshift cluster with a table without distkey
 * 2. Creates a stack with the same cluster to update the table and cause the disktkey creation.
 */

const app = new cdk.App();

interface RedshiftDistKeyStackProps extends cdk.StackProps {
  hasDistKey: boolean;
}

class RedshiftDistKeyStack extends cdk.Stack {
  constructor(scope: constructs.Construct, id: string, props: RedshiftDistKeyStackProps) {
    super(scope, id, props);

    const key = new kms.Key(this, 'custom-kms-key');
    const vpc = new ec2.Vpc(this, 'Vpc', { restrictDefaultSecurityGroup: false });
    const databaseName = 'my_db';

    const cluster = new redshift.Cluster(this, 'Cluster', {
      vpc: vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      masterUser: {
        masterUsername: 'admin',
      },
      defaultDatabaseName: databaseName,
      publiclyAccessible: true,
      encryptionKey: key,
    });

    cluster.addToParameterGroup('enable_user_activity_logging', 'true');

    const databaseOptions = {
      cluster: cluster,
      databaseName: databaseName,
    };

    const tableOptions = {
      tableName: 'mytable',
      sortStyle: redshift.TableSortStyle.AUTO,
      tableComment: 'A test table',
    };
    new redshift.Table(this, 'Table', {
      ...databaseOptions,
      tableColumns: [
        { name: 'col1', dataType: 'varchar(4)', distKey: props.hasDistKey, comment: 'A test column' },
      ],
      ...tableOptions,
    });
  }
}

const createStack = new RedshiftDistKeyStack(app, 'aws-cdk-redshift-distkey-create', {
  hasDistKey: false,
});

const updateStack = new RedshiftDistKeyStack(app, 'aws-cdk-redshift-distkey-update', {
  hasDistKey: true,
});

updateStack.addDependency(createStack);
const stacks = [createStack, updateStack];
stacks.forEach(s => {
  cdk.Aspects.of(s).add({
    visit(node: constructs.IConstruct) {
      if (cdk.CfnResource.isCfnResource(node)) {
        node.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
      }
    },
  });
});

new integ.IntegTest(app, 'aws-cdk-redshift-distkey-test', {
  testCases: stacks,
  diffAssets: true,
});

app.synth();
