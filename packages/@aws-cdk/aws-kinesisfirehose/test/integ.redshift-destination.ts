import * as ec2 from '@aws-cdk/aws-ec2';
import * as redshift from '@aws-cdk/aws-redshift';
import { App, CfnOutput, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as firehose from '../lib';

/**
 * Stack verification steps:
 * * stack_outputs=`aws cloudformation describe-stacks --stack-name <deployed stack name> | jq '.Stacks | .[0] | .Outputs'`
 * * get_output() { echo $stack_outputs | jq -r --arg key $1 'map(select(.OutputKey == key)) | .OutputValue'`
 * * master_secret_arn=`get_output ClusterMasterSecretArn`
 * * cluster_id=`get_output ClusterName`
 * * database=`get_output Database`
 * * firehose_user_secret_arn=`get_output FirehoseUserSecretArn`
 * * aws redshift-data execute-statement --secret-arn $master_secret_arn --cluster-identifier $cluster_id --database $database --sql "create user
 */

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc');
    const database = 'my_db';
    const cluster = new redshift.Cluster(this, 'Cluster', {
      vpc: vpc,
      masterUser: {
        masterUsername: 'master',
      },
      defaultDatabaseName: database,
    });

    const redshiftDestination = new firehose.RedshiftDestination({
      cluster: cluster,
      user: {
        username: 'firehose',
      },
      database: database,
      tableName: 'table',
    });
    new firehose.DeliveryStream(this, 'Firehose', {
      destination: redshiftDestination,
    });

    // Outputs for verification
    if (cluster.secret) {
      new CfnOutput(this, 'Cluster Master Secret Arn', {
        value: cluster.secret.secretArn,
      });
    }
    new CfnOutput(this, 'Cluster Name', {
      value: cluster.clusterName,
    });
    new CfnOutput(this, 'Database', {
      value: database,
    });
    if (redshiftDestination.secret) {
      new CfnOutput(this, 'Firehose User Secret Arn', {
        value: redshiftDestination.secret.secretArn,
      });
    }
  }
}

const app = new App();

new TestStack(app, 'aws-cdk-firehose-redshift-destination');

app.synth();
