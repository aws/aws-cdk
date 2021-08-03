import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as redshift from '@aws-cdk/aws-redshift';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import * as customresources from '@aws-cdk/custom-resources';
import { Construct } from 'constructs';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * Properties for configuring a Redshift user that Firehose will assume to load data.
 */
export interface FirehoseRedshiftUserProps {
  /**
   * The Redshift cluster to deliver data to.
   */
  readonly cluster: redshift.ICluster;

  /**
   * The secret containing credentials to a Redshift user with administrator privileges.
   */
  readonly adminUser: secretsmanager.ISecret;

  /**
   * The secret containing credentials to the Redshift user that Firehose will assume.
   */
  readonly userSecret: secretsmanager.ISecret;

  /**
   * The database containing the desired output table.
   */
  readonly database: string;

  /**
   * The table that data should be inserted into.
   */
  readonly tableName: string;
}

/**
 * Custom resource to create the Redshift user that Firehose will assume to load data.
 */
export class FirehoseRedshiftUser extends CoreConstruct {
  /**
   * The name of the user.
   */
  public readonly username: string;

  constructor(scope: Construct, id: string, props: FirehoseRedshiftUserProps) {
    super(scope, id);

    const handler = new lambda.SingletonFunction(this, 'Handler', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'create-table-user-provider')),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'user.handler',
      environment: {
        clusterName: props.cluster.clusterName,
        adminUserArn: props.adminUser.secretArn,
        database: props.database,
        userSecretArn: props.userSecret.secretArn,
        tableName: props.tableName,
      },
      timeout: cdk.Duration.seconds(10),
      uuid: 'bb38176c-277a-492c-be7d-3d1f842b1eab',
      lambdaPurpose: 'Create Firehose Redshift User',
    });
    handler.addToRolePolicy(new iam.PolicyStatement({
      actions: ['redshift-data:DescribeStatement', 'redshift-data:ExecuteStatement'],
      resources: ['*'],
    }));
    props.adminUser.grantRead(handler);
    props.userSecret.grantRead(handler);

    const provider = new customresources.Provider(this, 'Provider', {
      onEventHandler: handler,
    });

    const resource = new cdk.CustomResource(this, 'Default', {
      resourceType: 'Custom::FirehoseRedshiftUser',
      serviceToken: provider.serviceToken,
    });

    this.username = resource.ref;
  }
}
