import { ITable } from '@aws-cdk/aws-dynamodb';
import { IDomain as IElasticsearchDomain } from '@aws-cdk/aws-elasticsearch';
import { Grant, IGrantable, IPrincipal, IRole, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { IFunction } from '@aws-cdk/aws-lambda';
import { IDomain as IOpenSearchDomain } from '@aws-cdk/aws-opensearchservice';
import { IServerlessCluster } from '@aws-cdk/aws-rds';
import { ISecret } from '@aws-cdk/aws-secretsmanager';
import { IResolvable, Lazy, Stack, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { BaseAppsyncFunctionProps, AppsyncFunction } from './appsync-function';
import { CfnDataSource } from './appsync.generated';
import { IGraphqlApi } from './graphqlapi-base';
import { BaseResolverProps, Resolver } from './resolver';

/**
 * Base properties for an AppSync datasource
 */
export interface BaseDataSourceProps {
  /**
   * The API to attach this data source to
   */
  readonly api: IGraphqlApi;
  /**
   * The name of the data source
   *
   * @default - id of data source
   */
  readonly name?: string;
  /**
   * the description of the data source
   *
   * @default - None
   */
  readonly description?: string;
}

/**
 * properties for an AppSync datasource backed by a resource
 */
export interface BackedDataSourceProps extends BaseDataSourceProps {
  /**
   * The IAM service role to be assumed by AppSync to interact with the data source
   *
   * @default -  Create a new role
   */
  readonly serviceRole?: IRole;
}

/**
 * props used by implementations of BaseDataSource to provide configuration. Should not be used directly.
 */
export interface ExtendedDataSourceProps {
  /**
   * the type of the AppSync datasource
   */
  readonly type: string;
  /**
   * configuration for DynamoDB Datasource
   *
   * @default - No config
   */
  readonly dynamoDbConfig?: CfnDataSource.DynamoDBConfigProperty | IResolvable;
  /**
   * configuration for Elasticsearch data source
   *
   * @deprecated - use `openSearchConfig`
   * @default - No config
   */
  readonly elasticsearchConfig?: CfnDataSource.ElasticsearchConfigProperty | IResolvable;
  /**
   * configuration for OpenSearch data source
   *
   * @default - No config
   */
  readonly openSearchServiceConfig?: CfnDataSource.OpenSearchServiceConfigProperty | IResolvable;
  /**
   * configuration for HTTP Datasource
   *
   * @default - No config
   */
  readonly httpConfig?: CfnDataSource.HttpConfigProperty | IResolvable;
  /**
   * configuration for Lambda Datasource
   *
   * @default - No config
   */
  readonly lambdaConfig?: CfnDataSource.LambdaConfigProperty | IResolvable;
  /**
   * configuration for RDS Datasource
   *
   * @default - No config
   */
  readonly relationalDatabaseConfig?: CfnDataSource.RelationalDatabaseConfigProperty | IResolvable;
}

/**
 * Abstract AppSync datasource implementation. Do not use directly but use subclasses for concrete datasources
 */
export abstract class BaseDataSource extends Construct {
  /**
   * the name of the data source
   */
  public readonly name: string;
  /**
   * the underlying CFN data source resource
   */
  public readonly ds: CfnDataSource;

  protected api: IGraphqlApi;
  protected serviceRole?: IRole;

  constructor(scope: Construct, id: string, props: BackedDataSourceProps, extended: ExtendedDataSourceProps) {
    super(scope, id);

    if (extended.type !== 'NONE') {
      this.serviceRole = props.serviceRole || new Role(this, 'ServiceRole', { assumedBy: new ServicePrincipal('appsync.amazonaws.com') });
    }
    // Replace unsupported characters from DataSource name. The only allowed pattern is: {[_A-Za-z][_0-9A-Za-z]*}
    const name = (props.name ?? id);
    const supportedName = Token.isUnresolved(name) ? name : name.replace(/[\W]+/g, '');
    this.ds = new CfnDataSource(this, 'Resource', {
      apiId: props.api.apiId,
      name: supportedName,
      description: props.description,
      serviceRoleArn: this.serviceRole?.roleArn,
      ...extended,
    });
    this.name = supportedName;
    this.api = props.api;
  }

  /**
   * creates a new resolver for this datasource and API using the given properties
   */
  public createResolver(id: string, props: BaseResolverProps): Resolver {
    return new Resolver(this.api, id, {
      api: this.api,
      dataSource: this,
      ...props,
    });
  }

  /**
   * creates a new appsync function for this datasource and API using the given properties
   */
  public createFunction(id: string, props: BaseAppsyncFunctionProps): AppsyncFunction {
    return new AppsyncFunction(this.api, id, {
      api: this.api,
      dataSource: this,
      ...props,
    });
  }
}

/**
 * Abstract AppSync datasource implementation. Do not use directly but use subclasses for resource backed datasources
 */
export abstract class BackedDataSource extends BaseDataSource implements IGrantable {
  /**
   * the principal of the data source to be IGrantable
   */
  public readonly grantPrincipal: IPrincipal;

  constructor(scope: Construct, id: string, props: BackedDataSourceProps, extended: ExtendedDataSourceProps) {
    super(scope, id, props, extended);

    this.grantPrincipal = this.serviceRole!;
  }
}

/**
 * Properties for an AppSync dummy datasource
 */
export interface NoneDataSourceProps extends BaseDataSourceProps {
}

/**
 * An AppSync dummy datasource
 */
export class NoneDataSource extends BaseDataSource {
  constructor(scope: Construct, id: string, props: NoneDataSourceProps) {
    super(scope, id, props, {
      type: 'NONE',
    });
  }
}

/**
 * Properties for an AppSync DynamoDB datasource
 */
export interface DynamoDbDataSourceProps extends BackedDataSourceProps {
  /**
   * The DynamoDB table backing this data source
   */
  readonly table: ITable;
  /**
   * Specify whether this DS is read only or has read and write permissions to the DynamoDB table
   *
   * @default false
   */
  readonly readOnlyAccess?: boolean;
  /**
   * use credentials of caller to access DynamoDB
   *
   * @default false
   */
  readonly useCallerCredentials?: boolean;
}

/**
 * An AppSync datasource backed by a DynamoDB table
 */
export class DynamoDbDataSource extends BackedDataSource {
  constructor(scope: Construct, id: string, props: DynamoDbDataSourceProps) {
    super(scope, id, props, {
      type: 'AMAZON_DYNAMODB',
      dynamoDbConfig: {
        tableName: props.table.tableName,
        awsRegion: props.table.env.region,
        useCallerCredentials: props.useCallerCredentials,
      },
    });
    if (props.readOnlyAccess) {
      props.table.grantReadData(this);
    } else {
      props.table.grantReadWriteData(this);
    }
  }
}

/**
 * The authorization config in case the HTTP endpoint requires authorization
 */
export interface AwsIamConfig {
  /**
   * The signing region for AWS IAM authorization
   */
  readonly signingRegion: string;

  /**
   * The signing service name for AWS IAM authorization
   */
  readonly signingServiceName: string;
}

/**
 * Properties for an AppSync http datasource
 */
export interface HttpDataSourceProps extends BaseDataSourceProps {
  /**
   * The http endpoint
   */
  readonly endpoint: string;

  /**
   * The authorization config in case the HTTP endpoint requires authorization
   *
   * @default - none
   *
   */
  readonly authorizationConfig?: AwsIamConfig;
}

/**
 * An AppSync datasource backed by a http endpoint
 */
export class HttpDataSource extends BackedDataSource {
  constructor(scope: Construct, id: string, props: HttpDataSourceProps) {
    const authorizationConfig = props.authorizationConfig ? {
      authorizationType: 'AWS_IAM',
      awsIamConfig: props.authorizationConfig,
    } : undefined;
    super(scope, id, props, {
      type: 'HTTP',
      httpConfig: {
        endpoint: props.endpoint,
        authorizationConfig,
      },
    });
  }
}

/**
 * Properties for an AppSync Lambda datasource
 */
export interface LambdaDataSourceProps extends BackedDataSourceProps {
  /**
   * The Lambda function to call to interact with this data source
   */
  readonly lambdaFunction: IFunction;
}

/**
 * An AppSync datasource backed by a Lambda function
 */
export class LambdaDataSource extends BackedDataSource {
  constructor(scope: Construct, id: string, props: LambdaDataSourceProps) {
    super(scope, id, props, {
      type: 'AWS_LAMBDA',
      lambdaConfig: {
        lambdaFunctionArn: props.lambdaFunction.functionArn,
      },
    });
    props.lambdaFunction.grantInvoke(this);
  }
}

/**
 * Properties for an AppSync RDS datasource
 */
export interface RdsDataSourceProps extends BackedDataSourceProps {
  /**
   * The serverless cluster to call to interact with this data source
   */
  readonly serverlessCluster: IServerlessCluster;
  /**
   * The secret containing the credentials for the database
   */
  readonly secretStore: ISecret;
  /**
   * The name of the database to use within the cluster
   *
   * @default - None
   */
  readonly databaseName?: string;
}

/**
 * An AppSync datasource backed by RDS
 */
export class RdsDataSource extends BackedDataSource {
  constructor(scope: Construct, id: string, props: RdsDataSourceProps) {
    super(scope, id, props, {
      type: 'RELATIONAL_DATABASE',
      relationalDatabaseConfig: {
        rdsHttpEndpointConfig: {
          awsRegion: props.serverlessCluster.env.region,
          dbClusterIdentifier: Lazy.string({
            produce: () => {
              return Stack.of(this).formatArn({
                service: 'rds',
                resource: `cluster:${props.serverlessCluster.clusterIdentifier}`,
              });
            },
          }),
          awsSecretStoreArn: props.secretStore.secretArn,
          databaseName: props.databaseName,
        },
        relationalDatabaseSourceType: 'RDS_HTTP_ENDPOINT',
      },
    });
    const clusterArn = Stack.of(this).formatArn({
      service: 'rds',
      resource: `cluster:${props.serverlessCluster.clusterIdentifier}`,
    });
    props.secretStore.grantRead(this);

    // Change to grant with RDS grant becomes implemented

    props.serverlessCluster.grantDataApiAccess(this);

    Grant.addToPrincipal({
      grantee: this,
      actions: [
        'rds-data:DeleteItems',
        'rds-data:ExecuteSql',
        'rds-data:GetItems',
        'rds-data:InsertItems',
        'rds-data:UpdateItems',
      ],
      resourceArns: [clusterArn, `${clusterArn}:*`],
      scope: this,
    });
  }
}

/**
 * Properties for the Elasticsearch Data Source
 *
 * @deprecated - use `OpenSearchDataSourceProps` with `OpenSearchDataSource`
 */
export interface ElasticsearchDataSourceProps extends BackedDataSourceProps {
  /**
   * The elasticsearch domain containing the endpoint for the data source
   */
  readonly domain: IElasticsearchDomain;
}

/**
 * An Appsync datasource backed by Elasticsearch
 *
 * @deprecated - use `OpenSearchDataSource`
 */
export class ElasticsearchDataSource extends BackedDataSource {
  constructor(scope: Construct, id: string, props: ElasticsearchDataSourceProps) {
    super(scope, id, props, {
      type: 'AMAZON_ELASTICSEARCH',
      elasticsearchConfig: {
        awsRegion: props.domain.env.region,
        endpoint: `https://${props.domain.domainEndpoint}`,
      },
    });

    props.domain.grantReadWrite(this);
  }
}

/**
 * Properties for the OpenSearch Data Source
 */
export interface OpenSearchDataSourceProps extends BackedDataSourceProps {
  /**
   * The OpenSearch domain containing the endpoint for the data source
   */
  readonly domain: IOpenSearchDomain;
}

/**
 * An Appsync datasource backed by OpenSearch
 */
export class OpenSearchDataSource extends BackedDataSource {
  constructor(scope: Construct, id: string, props: OpenSearchDataSourceProps) {
    super(scope, id, props, {
      type: 'AMAZON_OPENSEARCH_SERVICE',
      openSearchServiceConfig: {
        awsRegion: props.domain.env.region,
        endpoint: `https://${props.domain.domainEndpoint}`,
      },
    });

    props.domain.grantReadWrite(this);
  }
}
