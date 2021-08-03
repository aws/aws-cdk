import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as redshift from '@aws-cdk/aws-redshift';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import * as customresources from '@aws-cdk/custom-resources';
import { Construct } from 'constructs';
import { RedshiftColumn } from '../redshift-table';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * Properties for configuring a Redshift table that Firehose will load data into.
 */
export interface FirehoseRedshiftTableProps {
  /**
   * The Redshift cluster to deliver data to.
   */
  readonly cluster: redshift.ICluster;

  /**
   * The secret containing credentials to a Redshift user with administrator privileges.
   */
  readonly adminUser: secretsmanager.ISecret;

  /**
   * The database containing the desired output table.
   */
  readonly database: string;

  /**
   * The table columns that the source fields will be loaded into.
   */
  readonly tableColumns: RedshiftColumn[];
}

/**
 * Custom resource to create the Redshift table where Firehose will load data.
 */
export class FirehoseRedshiftTable extends CoreConstruct {
  /**
   * Name of the table.
   */
  public readonly tableName: string;

  constructor(scope: Construct, id: string, props: FirehoseRedshiftTableProps) {
    super(scope, id);

    const handler = new lambda.SingletonFunction(this, 'Handler', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'create-table-user-provider')),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'table.handler',
      environment: {
        clusterName: props.cluster.clusterName,
        adminUserArn: props.adminUser.secretArn,
        database: props.database,
        tableName: cdk.Names.uniqueId(this),
        tableColumns: JSON.stringify(props.tableColumns),
      },
      timeout: cdk.Duration.seconds(10),
      uuid: '002dbf33-b1a4-46fc-9ff7-dcde90588b0c',
      lambdaPurpose: 'Create Firehose Redshift Table',
    });
    handler.addToRolePolicy(new iam.PolicyStatement({
      actions: ['redshift-data:DescribeStatement', 'redshift-data:ExecuteStatement'],
      resources: ['*'],
    }));
    props.adminUser.grantRead(handler);

    const provider = new customresources.Provider(this, 'Provider', {
      onEventHandler: handler,
    });

    const table = new cdk.CustomResource(this, 'Default', {
      resourceType: 'Custom::FirehoseRedshiftTable',
      serviceToken: provider.serviceToken,
    });

    this.tableName = table.ref;
  }
}
