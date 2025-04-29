import { Construct } from 'constructs';
import { IApi } from './api-base';
import { CfnDataSource } from './appsync.generated';
import { ITable } from '../../aws-dynamodb';
import { IEventBus } from '../../aws-events';
import {
  IRole,
  Role,
  ServicePrincipal,
  IPrincipal,
  IGrantable,
  Grant,
} from '../../aws-iam';
import { IFunction } from '../../aws-lambda';
import { IDomain } from '../../aws-opensearchservice';
import { IDatabaseCluster, IServerlessCluster } from '../../aws-rds';
import { ISecret } from '../../aws-secretsmanager';
import { IResolvable, Token, Lazy, Stack } from '../../core';

/**
 * Valid data source types for AppSync
 */
export enum AppSyncDataSourceType {
  /**
   * Lambda data source type
   */
  LAMBDA = 'AWS_LAMBDA',

  /**
   * DynamoDB data source type
   */
  DYNAMODB = 'AMAZON_DYNAMODB',

  /**
   * EventBridge data source type
   */
  EVENTBRIDGE = 'AMAZON_EVENTBRIDGE',

  /**
   * OpenSearch service data source type
   */
  OPENSEARCH_SERVICE = 'AMAZON_OPENSEARCH_SERVICE',

  /**
   * HTTP data source type
   */
  HTTP = 'HTTP',

  /**
   * Relational DB data source type
   */
  RELATIONAL_DATABASE = 'RELATIONAL_DATABASE',

  /**
   * Bedrock runtime data source type
   */
  BEDROCK = 'AMAZON_BEDROCK_RUNTIME',
}

/**
 * Invoke types for direct Lambda data sources
 */
export enum LambdaInvokeType {
  /**
   * Invoke function asynchronously
   */
  EVENT = 'EVENT',
  /**
   * Invoke function synchronously
   */
  REQUEST_RESPONSE = 'REQUEST_RESPONSE',
}

/**
 * Base properties for an AppSync datasource
 */
export interface AppSyncBaseDataSourceProps {
  /**
   * The API to attach this data source to
   */
  readonly api: IApi;
  /**
   * The name of the data source. The only allowed pattern is: {[_A-Za-z][_0-9A-Za-z]*}.
   * Any invalid characters will be automatically removed.
   *
   * @default - id of data source
   */
  readonly name?: string;
  /**
   * The description of the data source
   *
   * @default - None
   */
  readonly description?: string;
}

/**
 * Properties for an AppSync datasource backed by a resource
 */
export interface AppSyncBackedDataSourceProps extends AppSyncBaseDataSourceProps {
  /**
   * The IAM service role to be assumed by AppSync to interact with the data source
   *
   * @default -  Create a new role
   */
  readonly serviceRole?: IRole;
}

/**
 * Props used by implementations of BaseDataSource to provide configuration. Should not be used directly.
 */
export interface AppSyncExtendedDataSourceProps {
  /**
   * The type of the AppSync datasource
   */
  readonly type: AppSyncDataSourceType;
  /**
   * Configuration for DynamoDB Datasource
   *
   * @default - No config
   */
  readonly dynamoDbConfig?: CfnDataSource.DynamoDBConfigProperty | IResolvable;
  /**
   * Configuration for OpenSearch data source
   *
   * @default - No config
   */
  readonly openSearchServiceConfig?: CfnDataSource.OpenSearchServiceConfigProperty | IResolvable;
  /**
   * Configuration for HTTP Datasource
   *
   * @default - No config
   */
  readonly httpConfig?: CfnDataSource.HttpConfigProperty | IResolvable;
  /**
   * Configuration for EventBridge Datasource
   *
   * @default - No config
   */
  readonly eventBridgeConfig?: CfnDataSource.EventBridgeConfigProperty | IResolvable;

  /**
   * Configuration for Lambda Datasource
   *
   * @default - No config
   */
  readonly lambdaConfig?: CfnDataSource.LambdaConfigProperty | IResolvable;
  /**
   * Configuration for RDS Datasource
   *
   * @default - No config
   */
  readonly relationalDatabaseConfig?: CfnDataSource.RelationalDatabaseConfigProperty | IResolvable;
}

/**
 * Abstract AppSync datasource implementation. Do not use directly but use subclasses for concrete datasources
 */
export abstract class AppSyncBaseDataSource extends Construct {
  /**
   * The name of the data source
   */
  public readonly name: string;
  /**
   * The underlying CFN data source resource
   */
  public readonly resource: CfnDataSource;

  protected api: IApi;
  protected serviceRole?: IRole;

  constructor(scope: Construct, id: string, props: AppSyncBackedDataSourceProps, extended: AppSyncExtendedDataSourceProps) {
    super(scope, id);

    this.serviceRole = props.serviceRole || new Role(this, 'ServiceRole', { assumedBy: new ServicePrincipal('appsync.amazonaws.com') });

    // Replace unsupported characters from DataSource name. The only allowed pattern is: {[_A-Za-z][_0-9A-Za-z]*}
    const name = (props.name ?? id);
    const supportedName = Token.isUnresolved(name) ? name : name.replace(/[\W]+/g, '');
    this.resource = new CfnDataSource(this, 'Resource', {
      apiId: props.api.apiId,
      name: supportedName,
      description: props.description,
      serviceRoleArn: this.serviceRole?.roleArn,
      ...extended,
    });
    this.name = supportedName;
    this.api = props.api;
  }
}

/**
 * Abstract AppSync datasource implementation. Do not use directly but use subclasses for resource backed datasources
 */
export abstract class AppSyncBackedDataSource extends AppSyncBaseDataSource implements IGrantable {
  /**
   * The principal of the data source to be IGrantable
   */
  public readonly grantPrincipal: IPrincipal;

  constructor(scope: Construct, id: string, props: AppSyncBackedDataSourceProps, extended: AppSyncExtendedDataSourceProps) {
    super(scope, id, props, extended);

    this.grantPrincipal = this.serviceRole!;
  }
}

/**
 * Properties for an AppSync DynamoDB datasource
 */
export interface AppSyncDynamoDbDataSourceProps extends AppSyncBackedDataSourceProps {
  /**
   * The DynamoDB table backing this data source
   */
  readonly table: ITable;
  /**
   * Specify whether this Data Source is read only or has read and write permissions to the DynamoDB table
   *
   * @default false
   */
  readonly readOnlyAccess?: boolean;
  /**
   * Use credentials of caller to access DynamoDB
   *
   * @default false
   */
  readonly useCallerCredentials?: boolean;
}

/**
 * An AppSync datasource backed by a DynamoDB table
 */
export class AppSyncDynamoDbDataSource extends AppSyncBackedDataSource {
  constructor(scope: Construct, id: string, props: AppSyncDynamoDbDataSourceProps) {
    super(scope, id, props, {
      type: AppSyncDataSourceType.DYNAMODB,
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
export interface AppSyncAwsIamConfig {
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
 * Optional configuration for data sources
 */
export interface AppSyncDataSourceOptions {
  /**
   * The name of the data source, overrides the id given by CDK
   *
   * @default - generated by CDK given the id
   */
  readonly name?: string;

  /**
   * The description of the data source
   *
   * @default - No description
   */
  readonly description?: string;
}

/**
 * Optional configuration for Http data sources
 */
export interface AppSyncHttpDataSourceOptions extends AppSyncDataSourceOptions {
  /**
   * The authorization config in case the HTTP endpoint requires authorization
   *
   * @default - none
   */
  readonly authorizationConfig?: AppSyncAwsIamConfig;
}

/**
 * Properties for an AppSync http datasource
 */
export interface AppSyncHttpDataSourceProps extends AppSyncBackedDataSourceProps {
  /**
   * The http endpoint
   */
  readonly endpoint: string;

  /**
   * The authorization config in case the HTTP endpoint requires authorization
   *
   * @default - none
   */
  readonly authorizationConfig?: AppSyncAwsIamConfig;
}

/**
 * An AppSync datasource backed by a http endpoint
 */
export class AppSyncHttpDataSource extends AppSyncBackedDataSource {
  constructor(scope: Construct, id: string, props: AppSyncHttpDataSourceProps) {
    const authorizationConfig = props.authorizationConfig ? {
      authorizationType: 'AWS_IAM',
      awsIamConfig: props.authorizationConfig,
    } : undefined;
    super(scope, id, props, {
      type: AppSyncDataSourceType.HTTP,
      httpConfig: {
        endpoint: props.endpoint,
        authorizationConfig,
      },
    });
  }
}

/**
 * Properties for an AppSync EventBridge datasource
 */
export interface AppSyncEventBridgeDataSourceProps extends AppSyncBackedDataSourceProps {
  /**
   * The EventBridge EventBus
   */
  readonly eventBus: IEventBus;
}

/**
 * An AppSync datasource backed by EventBridge
 */
export class AppSyncEventBridgeDataSource extends AppSyncBackedDataSource {
  constructor(scope: Construct, id: string, props: AppSyncEventBridgeDataSourceProps) {
    super(scope, id, props, {
      type: AppSyncDataSourceType.EVENTBRIDGE,
      eventBridgeConfig: {
        eventBusArn: props.eventBus.eventBusArn,
      },
    });
    props.eventBus.grantPutEventsTo(this);
  }
}

/**
 * Properties for an AppSync Lambda datasource
 */
export interface AppSyncLambdaDataSourceProps extends AppSyncBackedDataSourceProps {
  /**
   * The Lambda function to call to interact with this data source
   */
  readonly lambdaFunction: IFunction;
}

/**
 * An AppSync datasource backed by a Lambda function
 */
export class AppSyncLambdaDataSource extends AppSyncBackedDataSource {
  constructor(scope: Construct, id: string, props: AppSyncLambdaDataSourceProps) {
    super(scope, id, props, {
      type: AppSyncDataSourceType.LAMBDA,
      lambdaConfig: {
        lambdaFunctionArn: props.lambdaFunction.functionArn,
      },
    });
    props.lambdaFunction.grantInvoke(this);
  }
}

/**
 * Properties for an AppSync RDS datasource Aurora Serverless V1
 */
export interface AppSyncRdsDataSourceProps extends AppSyncBackedDataSourceProps {
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
 * Properties for an AppSync RDS datasource Aurora Serverless V2
 */
export interface AppSyncRdsDataSourcePropsV2 extends AppSyncBackedDataSourceProps {
  /**
   * The serverless cluster to call to interact with this data source
   */
  readonly serverlessCluster: IDatabaseCluster;
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
export class AppSyncRdsDataSource extends AppSyncBackedDataSource {
  constructor(scope: Construct, id: string, props: AppSyncRdsDataSourceProps)
  constructor(scope: Construct, id: string, props: AppSyncRdsDataSourcePropsV2) {
    super(scope, id, props, {
      type: AppSyncDataSourceType.RELATIONAL_DATABASE,
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
 * Properties for the OpenSearch Data Source
 */
export interface AppSyncOpenSearchDataSourceProps extends AppSyncBackedDataSourceProps {
  /**
   * The OpenSearch domain containing the endpoint for the data source
   */
  readonly domain: IDomain;
}

/**
 * An Appsync datasource backed by OpenSearch
 */
export class AppSyncOpenSearchDataSource extends AppSyncBackedDataSource {
  constructor(scope: Construct, id: string, props: AppSyncOpenSearchDataSourceProps) {
    super(scope, id, props, {
      type: AppSyncDataSourceType.OPENSEARCH_SERVICE,
      openSearchServiceConfig: {
        awsRegion: props.domain.env.region,
        endpoint: `https://${props.domain.domainEndpoint}`,
      },
    });

    props.domain.grantReadWrite(this);
  }
}
