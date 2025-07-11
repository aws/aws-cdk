import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as secretmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as iam from 'aws-cdk-lib/aws-iam';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class EventApiRdsStack extends cdk.Stack {
  public readonly lambdaTestFn: nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'Integ-VPC');

    const credentialsBaseOptions: rds.CredentialsBaseOptions = {
      secretName: 'integ-secretName-v2',
    };

    const databaseName = 'integdb';
    const cluster = new rds.DatabaseCluster(this, 'Integ-Cluster', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_16_6 }),
      writer: rds.ClusterInstance.serverlessV2('writer'),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      vpc,
      credentials: rds.Credentials.fromGeneratedSecret('clusteradmin', credentialsBaseOptions),
      defaultDatabaseName: databaseName,
      enableDataApi: true,
    });

    const secret = secretmanager.Secret.fromSecretNameV2(this, 'Secret', 'integ-secretName-v2');

    // Create table in database
    const schemaName = 'public';
    const tableDefinition = 'event_id UUID PRIMARY KEY, message TEXT NOT NULL, ds_type VARCHAR(50) NOT NULL';
    const tableName = 'events';

    const createTableSql = `CREATE TABLE IF NOT EXISTS ${schemaName}.${tableName} (${tableDefinition})`;
    const resourceId = `${cluster.clusterArn}/${databaseName}/${schemaName}/${tableName}`;

    const parameters = {
      resourceArn: cluster.clusterArn,
      secretArn: secret.secretArn,
      database: databaseName,
    };

    const tableResource = new cr.AwsCustomResource(this, 'PostgresTableResource', {
      resourceType: 'Custom::PostgreSQLTable',
      onCreate: {
        service: 'RDSDataService',
        action: 'executeStatement',
        parameters: {
          ...parameters,
          sql: createTableSql,
        },
        physicalResourceId: cr.PhysicalResourceId.of(resourceId),
      },
      onUpdate: {
        service: 'RDSDataService',
        action: 'executeStatement',
        parameters: {
          ...parameters,
          sql: createTableSql,
        },
        physicalResourceId: cr.PhysicalResourceId.of(resourceId),
      },
      onDelete: {
        service: 'RDSDataService',
        action: 'executeStatement',
        parameters: {
          ...parameters,
          sql: `DROP TABLE IF EXISTS ${schemaName}.${tableName}`,
        },
      },
      // Configure timeout for database operations (especially important for first connection)
      timeout: cdk.Duration.minutes(5),
      policy: cr.AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          actions: [
            'rds-data:ExecuteStatement',
          ],
          resources: [cluster.clusterArn],
        }),
        new iam.PolicyStatement({
          actions: [
            'secretsmanager:GetSecretValue',
          ],
          resources: [secret.secretArn],
        }),
      ]),
    });
    secret.grantRead(tableResource);
    cluster.grantDataApiAccess(tableResource);
    tableResource.node.addDependency(cluster);
    tableResource.node.addDependency(secret);

    const api = new appsync.EventApi(this, 'EventApiRds', {
      apiName: 'RdsEventApi',
    });

    const dataSource = api.addRdsDataSource('rdsds', cluster, secret, databaseName);

    api.addChannelNamespace('chat', {
      code: appsync.Code.fromAsset(path.join(__dirname, 'integ-assets', 'eventapi-handlers', 'rds.js')),
      publishHandlerConfig: {
        dataSource: dataSource,
      },
    });

    const lambdaConfig: nodejs.NodejsFunctionProps = {
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: {
        EVENT_API_REALTIME_URL: `wss://${api.realtimeDns}/event/realtime`,
        EVENT_API_HTTP_URL: `https://${api.httpDns}/event`,
        API_KEY: api.apiKeys.Default.attrApiKey,
      },
      bundling: {
        bundleAwsSDK: true,
      },
      entry: path.join(__dirname, 'integ-assets', 'eventapi-grant-assertion', 'index.js'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(15),
    };

    this.lambdaTestFn = new nodejs.NodejsFunction(this, 'EventApiRdsTestFunction', lambdaConfig);
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/custom-resources:logApiResponseDataPropertyTrueDefault': true,
  },
});
const stack = new EventApiRdsStack(app, 'EventApiRdsStack');

const integTest = new IntegTest(app, 'appsync-eventapi-rds-test', {
  testCases: [stack],
});

integTest.assertions.invokeFunction({
  functionName: stack.lambdaTestFn.functionName,
  payload: JSON.stringify({
    channel: 'chat/add',
    action: 'pubSub',
    authMode: 'API_KEY',
    eventPayload: [{
      message: 'hello1',
    }],
  }),
}).expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 200,
    msg: 'subscribe_success',
    pubStatusCode: 200,
    pubMsg: [{
      message: 'hello1',
      ds_type: 'rds',
    }],
  }),
}));
