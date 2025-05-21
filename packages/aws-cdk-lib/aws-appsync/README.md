# AWS AppSync Construct Library

The `aws-cdk-lib/aws-appsync` package contains constructs for building flexible
APIs that use [GraphQL](https://docs.aws.amazon.com/appsync/latest/devguide/what-is-appsync.html) and [Events](https://docs.aws.amazon.com/appsync/latest/eventapi/event-api-welcome.html).

```ts nofixture
import * as appsync from 'aws-cdk-lib/aws-appsync';
```

## GraphQL

### Example

#### DynamoDB

Example of a GraphQL API with `AWS_IAM` [authorization](#authorization) resolving into a DynamoDb
backend data source.

GraphQL schema file `schema.graphql`:

```gql
type demo {
  id: String!
  version: String!
}
type Query {
  getDemos: [ demo! ]
  getDemosConsistent: [demo!]
}
input DemoInput {
  version: String!
}
type Mutation {
  addDemo(input: DemoInput!): demo
}
```

CDK stack file `app-stack.ts`:

```ts
const api = new appsync.GraphqlApi(this, 'Api', {
  name: 'demo',
  definition: appsync.Definition.fromFile(path.join(__dirname, 'schema.graphql')),
  authorizationConfig: {
    defaultAuthorization: {
      authorizationType: appsync.AuthorizationType.IAM,
    },
  },
  xrayEnabled: true,
});

const demoTable = new dynamodb.Table(this, 'DemoTable', {
  partitionKey: {
    name: 'id',
    type: dynamodb.AttributeType.STRING,
  },
});

const demoDS = api.addDynamoDbDataSource('demoDataSource', demoTable);

// Resolver for the Query "getDemos" that scans the DynamoDb table and returns the entire list.
// Resolver Mapping Template Reference:
// https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-dynamodb.html
demoDS.createResolver('QueryGetDemosResolver', {
  typeName: 'Query',
  fieldName: 'getDemos',
  requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
  responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
});

// Resolver for the Mutation "addDemo" that puts the item into the DynamoDb table.
demoDS.createResolver('MutationAddDemoResolver', {
  typeName: 'Mutation',
  fieldName: 'addDemo',
  requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
    appsync.PrimaryKey.partition('id').auto(),
    appsync.Values.projecting('input'),
  ),
  responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
});

//To enable DynamoDB read consistency with the `MappingTemplate`:
demoDS.createResolver('QueryGetDemosConsistentResolver', {
  typeName: 'Query',
  fieldName: 'getDemosConsistent',
  requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(true),
  responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
});
```

#### Aurora Serverless

AppSync provides a data source for executing SQL commands against Amazon Aurora
Serverless clusters. You can use AppSync resolvers to execute SQL statements
against the Data API with GraphQL queries, mutations, and subscriptions.

##### Aurora Serverless V1 Cluster

```ts
// Create username and password secret for DB Cluster
const secret = new rds.DatabaseSecret(this, 'AuroraSecret', {
  username: 'clusteradmin',
});

// The VPC to place the cluster in
const vpc = new ec2.Vpc(this, 'AuroraVpc');

// Create the serverless cluster, provide all values needed to customise the database.
const cluster = new rds.ServerlessCluster(this, 'AuroraCluster', {
  engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
  vpc,
  credentials: { username: 'clusteradmin' },
  clusterIdentifier: 'db-endpoint-test',
  defaultDatabaseName: 'demos',
});

// Build a data source for AppSync to access the database.
declare const api: appsync.GraphqlApi;
const rdsDS = api.addRdsDataSource('rds', cluster, secret, 'demos');

// Set up a resolver for an RDS query.
rdsDS.createResolver('QueryGetDemosRdsResolver', {
  typeName: 'Query',
  fieldName: 'getDemosRds',
  requestMappingTemplate: appsync.MappingTemplate.fromString(`
  {
    "version": "2018-05-29",
    "statements": [
      "SELECT * FROM demos"
    ]
  }
  `),
  responseMappingTemplate: appsync.MappingTemplate.fromString(`
    $utils.toJson($utils.rds.toJsonObject($ctx.result)[0])
  `),
});

// Set up a resolver for an RDS mutation.
rdsDS.createResolver('MutationAddDemoRdsResolver', {
  typeName: 'Mutation',
  fieldName: 'addDemoRds',
  requestMappingTemplate: appsync.MappingTemplate.fromString(`
  {
    "version": "2018-05-29",
    "statements": [
      "INSERT INTO demos VALUES (:id, :version)",
      "SELECT * WHERE id = :id"
    ],
    "variableMap": {
      ":id": $util.toJson($util.autoId()),
      ":version": $util.toJson($ctx.args.version)
    }
  }
  `),
  responseMappingTemplate: appsync.MappingTemplate.fromString(`
    $utils.toJson($utils.rds.toJsonObject($ctx.result)[1][0])
  `),
});
```

##### Aurora Serverless V2 Cluster

```ts
// Create username and password secret for DB Cluster
const secret = new rds.DatabaseSecret(this, 'AuroraSecret', {
  username: 'clusteradmin',
});

// The VPC to place the cluster in
const vpc = new ec2.Vpc(this, 'AuroraVpc');

// Create the serverless cluster, provide all values needed to customise the database.
const cluster = new rds.DatabaseCluster(this, 'AuroraClusterV2', {
    engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_15_5 }),
    credentials: { username: 'clusteradmin' },
    clusterIdentifier: 'db-endpoint-test',
    writer: rds.ClusterInstance.serverlessV2('writer'),
    serverlessV2MinCapacity: 2,
    serverlessV2MaxCapacity: 10,
    vpc,
    defaultDatabaseName: 'demos',
    enableDataApi: true,  // has to be set to true to enable Data API as not enable by default
  });

// Build a data source for AppSync to access the database.
declare const api: appsync.GraphqlApi;
const rdsDS = api.addRdsDataSourceV2('rds', cluster, secret, 'demos');

// Set up a resolver for an RDS query.
rdsDS.createResolver('QueryGetDemosRdsResolver', {
  typeName: 'Query',
  fieldName: 'getDemosRds',
  requestMappingTemplate: appsync.MappingTemplate.fromString(`
  {
    "version": "2018-05-29",
    "statements": [
      "SELECT * FROM demos"
    ]
  }
  `),
  responseMappingTemplate: appsync.MappingTemplate.fromString(`
    $utils.toJson($utils.rds.toJsonObject($ctx.result)[0])
  `),
});

// Set up a resolver for an RDS mutation.
rdsDS.createResolver('MutationAddDemoRdsResolver', {
  typeName: 'Mutation',
  fieldName: 'addDemoRds',
  requestMappingTemplate: appsync.MappingTemplate.fromString(`
  {
    "version": "2018-05-29",
    "statements": [
      "INSERT INTO demos VALUES (:id, :version)",
      "SELECT * WHERE id = :id"
    ],
    "variableMap": {
      ":id": $util.toJson($util.autoId()),
      ":version": $util.toJson($ctx.args.version)
    }
  }
  `),
  responseMappingTemplate: appsync.MappingTemplate.fromString(`
    $utils.toJson($utils.rds.toJsonObject($ctx.result)[1][0])
  `),
});
```

#### HTTP Endpoints

GraphQL schema file `schema.graphql`:

```gql
type job {
  id: String!
  version: String!
}

input DemoInput {
  version: String!
}

type Mutation {
  callStepFunction(input: DemoInput!): job
}

type Query {
  _placeholder: String
}
```

GraphQL request mapping template `request.vtl`:

```json
{
  "version": "2018-05-29",
  "method": "POST",
  "resourcePath": "/",
  "params": {
    "headers": {
      "content-type": "application/x-amz-json-1.0",
      "x-amz-target":"AWSStepFunctions.StartExecution"
    },
    "body": {
      "stateMachineArn": "<your step functions arn>",
      "input": "{ \"id\": \"$context.arguments.id\" }"
    }
  }
}
```

GraphQL response mapping template `response.vtl`:

```json
{
  "id": "${context.result.id}"
}
```

CDK stack file `app-stack.ts`:

```ts
const api = new appsync.GraphqlApi(this, 'api', {
  name: 'api',
  definition: appsync.Definition.fromFile(path.join(__dirname, 'schema.graphql')),
});

const httpDs = api.addHttpDataSource(
  'ds',
  'https://states.amazonaws.com',
  {
    name: 'httpDsWithStepF',
    description: 'from appsync to StepFunctions Workflow',
    authorizationConfig: {
      signingRegion: 'us-east-1',
      signingServiceName: 'states',
    },
  },
);

httpDs.createResolver('MutationCallStepFunctionResolver', {
  typeName: 'Mutation',
  fieldName: 'callStepFunction',
  requestMappingTemplate: appsync.MappingTemplate.fromFile('request.vtl'),
  responseMappingTemplate: appsync.MappingTemplate.fromFile('response.vtl'),
});
```

#### EventBridge

Integrating AppSync with EventBridge enables developers to use EventBridge rules to route commands for GraphQL mutations
that need to perform any one of a variety of asynchronous tasks. More broadly, it enables teams to expose an event bus
as a part of a GraphQL schema.

GraphQL schema file `schema.graphql`:

```gql
schema {
    query: Query
    mutation: Mutation
}

type Query {
    event(id:ID!): Event
}

type Mutation {
    emitEvent(id: ID!, name: String): PutEventsResult!
}

type Event {
    id: ID!
    name: String!
}

type Entry {
    ErrorCode: String
    ErrorMessage: String
    EventId: String
}

type PutEventsResult {
    Entries: [Entry!]
    FailedEntry: Int
}
```

GraphQL request mapping template `request.vtl`:

```
{
    "version" : "2018-05-29",
    "operation": "PutEvents",
    "events" : [
        {
            "source": "integ.appsync.eventbridge",
            "detailType": "Mutation.emitEvent",
            "detail": $util.toJson($context.arguments)
        }
    ]
}
```

GraphQL response mapping template `response.vtl`:

```
$util.toJson($ctx.result)'
```

This response mapping template simply converts the EventBridge PutEvents result to JSON.
For details about the response see the
[documentation](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEvents.html).
Additional logic can be added to the response template to map the response type, or to error in the event of failed
events. More information can be found
[here](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-eventbridge.html).

CDK stack file `app-stack.ts`:

```ts
import * as events from 'aws-cdk-lib/aws-events';

const api = new appsync.GraphqlApi(this, 'EventBridgeApi', {
  name: 'EventBridgeApi',
  definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.eventbridge.graphql')),
});

const bus = new events.EventBus(this, 'DestinationEventBus', {});

const dataSource = api.addEventBridgeDataSource('NoneDS', bus);

dataSource.createResolver('EventResolver', {
  typeName: 'Mutation',
  fieldName: 'emitEvent',
  requestMappingTemplate: appsync.MappingTemplate.fromFile('request.vtl'),
  responseMappingTemplate: appsync.MappingTemplate.fromFile('response.vtl'),
});
```

#### Amazon OpenSearch Service

AppSync has builtin support for Amazon OpenSearch Service (successor to Amazon
Elasticsearch Service) from domains that are provisioned through your AWS account. You can
use AppSync resolvers to perform GraphQL operations such as queries, mutations, and
subscriptions.

```ts
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';

const user = new iam.User(this, 'User');
const domain = new opensearch.Domain(this, 'Domain', {
  version: opensearch.EngineVersion.OPENSEARCH_2_3,
  removalPolicy: RemovalPolicy.DESTROY,
  fineGrainedAccessControl: { masterUserArn: user.userArn },
  encryptionAtRest: { enabled: true },
  nodeToNodeEncryption: true,
  enforceHttps: true,
});

declare const api: appsync.GraphqlApi;
const ds = api.addOpenSearchDataSource('ds', domain);

ds.createResolver('QueryGetTestsResolver', {
  typeName: 'Query',
  fieldName: 'getTests',
  requestMappingTemplate: appsync.MappingTemplate.fromString(JSON.stringify({
    version: '2017-02-28',
    operation: 'GET',
    path: '/id/post/_search',
    params: {
      headers: {},
      queryString: {},
      body: { from: 0, size: 50 },
    },
  })),
  responseMappingTemplate: appsync.MappingTemplate.fromString(`[
    #foreach($entry in $context.result.hits.hits)
    #if( $velocityCount > 1 ) , #end
    $utils.toJson($entry.get("_source"))
    #end
  ]`),
});
```

### Merged APIs

AppSync supports [Merged APIs](https://docs.aws.amazon.com/appsync/latest/devguide/merged-api.html) which can be used to merge multiple source APIs into a single API.

```ts
import * as cdk from 'aws-cdk-lib';

// first source API
const firstApi = new appsync.GraphqlApi(this, 'FirstSourceAPI', {
  name: 'FirstSourceAPI',
  definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.merged-api-1.graphql')),
});

// second source API
const secondApi = new appsync.GraphqlApi(this, 'SecondSourceAPI', {
  name: 'SecondSourceAPI',
  definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.merged-api-2.graphql')),
});

// Merged API
const mergedApi = new appsync.GraphqlApi(this, 'MergedAPI', {
  name: 'MergedAPI',
  definition: appsync.Definition.fromSourceApis({
    sourceApis: [
      {
        sourceApi: firstApi,
        mergeType: appsync.MergeType.MANUAL_MERGE,
      },
      {
        sourceApi: secondApi,
        mergeType: appsync.MergeType.AUTO_MERGE,
      }
    ],
  }),
});
```

### Merged APIs Across Different Stacks

The SourceApiAssociation construct allows you to define a SourceApiAssociation to a Merged API in a different stack or account. This allows a source API owner the ability to associate it to an existing Merged API itself.

```ts
const sourceApi = new appsync.GraphqlApi(this, 'FirstSourceAPI', {
  name: 'FirstSourceAPI',
  definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.merged-api-1.graphql')),
});

const importedMergedApi = appsync.GraphqlApi.fromGraphqlApiAttributes(this, 'ImportedMergedApi', {
  graphqlApiId: 'MyApiId',
  graphqlApiArn: 'MyApiArn',
});

const importedExecutionRole = iam.Role.fromRoleArn(this, 'ExecutionRole', 'arn:aws:iam::ACCOUNT:role/MyExistingRole');
new appsync.SourceApiAssociation(this, 'SourceApiAssociation2', {
   sourceApi: sourceApi,
   mergedApi: importedMergedApi,
   mergeType: appsync.MergeType.MANUAL_MERGE,
   mergedApiExecutionRole: importedExecutionRole,
});
```

### Merge Source API Update Within CDK Deployment

The SourceApiAssociationMergeOperation construct available in the [awscdk-appsync-utils](https://github.com/cdklabs/awscdk-appsync-utils) package provides the ability to merge a source API to a Merged API via a custom
resource. If the merge operation fails with a conflict, the stack update will fail and rollback the changes to the source API in the stack in order to prevent merge conflicts and ensure the source API changes are always propagated to the Merged API.

### Custom Domain Names

For many use cases you may want to associate a custom domain name with your
GraphQL API. This can be done during the API creation.

```ts
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';

const myDomainName = 'api.example.com';
const certificate = new acm.Certificate(this, 'cert', { domainName: myDomainName });
const schema = new appsync.SchemaFile({ filePath: 'mySchemaFile' })
const api = new appsync.GraphqlApi(this, 'api', {
  name: 'myApi',
  definition: appsync.Definition.fromSchema(schema),
  domainName: {
    certificate,
    domainName: myDomainName,
  },
});

// hosted zone and route53 features
declare const hostedZoneId: string;
declare const zoneName = 'example.com';

// hosted zone for adding appsync domain
const zone = route53.HostedZone.fromHostedZoneAttributes(this, `HostedZone`, {
  hostedZoneId,
  zoneName,
});

// create a cname to the appsync domain. will map to something like xxxx.cloudfront.net
new route53.CnameRecord(this, `CnameApiRecord`, {
  recordName: 'api',
  zone,
  domainName: api.appSyncDomainName,
});
```

### Log Group

AppSync automatically create a log group with the name `/aws/appsync/apis/<graphql_api_id>` upon deployment with
log data set to never expire. If you want to set a different expiration period, use the `logConfig.retention` property.

Also you can choose the log level by setting the `logConfig.fieldLogLevel` property.

For more information, see [CloudWatch logs](https://docs.aws.amazon.com/en_us/appsync/latest/devguide/monitoring.html#cwl).

To obtain the GraphQL API's log group as a `logs.ILogGroup` use the `logGroup` property of the
`GraphqlApi` construct.

```ts
import * as logs from 'aws-cdk-lib/aws-logs';

new appsync.GraphqlApi(this, 'api', {
  authorizationConfig: {},
  name: 'myApi',
  definition: appsync.Definition.fromFile(path.join(__dirname, 'myApi.graphql')),
  logConfig: {
    fieldLogLevel: appsync.FieldLogLevel.INFO,
    retention: logs.RetentionDays.ONE_WEEK,
  },
});
```

### Schema

You can define a schema using from a local file using `Definition.fromFile`

```ts
const api = new appsync.GraphqlApi(this, 'api', {
  name: 'myApi',
  definition: appsync.Definition.fromFile(path.join(__dirname, 'schema.graphl')),
});
```

#### ISchema

Alternative schema sources can be defined by implementing the `ISchema`
interface. An example of this is the `CodeFirstSchema` class provided in
[awscdk-appsync-utils](https://github.com/cdklabs/awscdk-appsync-utils)

### Imports

Any GraphQL Api that has been created outside the stack can be imported from
another stack into your CDK app. Utilizing the `fromXxx` function, you have
the ability to add data sources and resolvers through a `IGraphqlApi` interface.

```ts
declare const api: appsync.GraphqlApi;
declare const table: dynamodb.Table;
const importedApi = appsync.GraphqlApi.fromGraphqlApiAttributes(this, 'IApi', {
  graphqlApiId: api.apiId,
  graphqlApiArn: api.arn,
});
importedApi.addDynamoDbDataSource('TableDataSource', table);
```

If you don't specify `graphqlArn` in `fromXxxAttributes`, CDK will autogenerate
the expected `arn` for the imported api, given the `apiId`. For creating data
sources and resolvers, an `apiId` is sufficient.

### Private APIs

By default all AppSync GraphQL APIs are public and can be accessed from the internet.
For customers that want to limit access to be from their VPC, the optional API `visibility` property can be set to `Visibility.PRIVATE`
at creation time. To explicitly create a public API, the `visibility` property should be set to `Visibility.GLOBAL`.
If visibility is not set, the service will default to `GLOBAL`.

CDK stack file `app-stack.ts`:

```ts
const api = new appsync.GraphqlApi(this, 'api', {
  name: 'MyPrivateAPI',
  definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.schema.graphql')),
  visibility: appsync.Visibility.PRIVATE,
});
```

See [documentation](https://docs.aws.amazon.com/appsync/latest/devguide/using-private-apis.html)
for more details about Private APIs

### Authorization

There are multiple authorization types available for GraphQL API to cater to different
access use cases. They are:

- API Keys (`AuthorizationType.API_KEY`)
- Amazon Cognito User Pools (`AuthorizationType.USER_POOL`)
- OpenID Connect (`AuthorizationType.OPENID_CONNECT`)
- AWS Identity and Access Management (`AuthorizationType.AWS_IAM`)
- AWS Lambda (`AuthorizationType.AWS_LAMBDA`)

These types can be used simultaneously in a single API, allowing different types of clients to
access data. When you specify an authorization type, you can also specify the corresponding
authorization mode to finish defining your authorization. For example, this is a GraphQL API
with AWS Lambda Authorization.

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';
declare const authFunction: lambda.Function;

new appsync.GraphqlApi(this, 'api', {
  name: 'api',
  definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.test.graphql')),
  authorizationConfig: {
    defaultAuthorization: {
      authorizationType: appsync.AuthorizationType.LAMBDA,
      lambdaAuthorizerConfig: {
        handler: authFunction,
        // can also specify `resultsCacheTtl` and `validationRegex`.
      },
    },
  },
});
```

### Permissions

When using `AWS_IAM` as the authorization type for GraphQL API, an IAM Role
with correct permissions must be used for access to API.

When configuring permissions, you can specify specific resources to only be
accessible by `IAM` authorization. For example, if you want to only allow mutability
for `IAM` authorized access you would configure the following.

In `schema.graphql`:

```gql
type Mutation {
  updateExample(...): ...
    @aws_iam
}
```

In `IAM`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "appsync:GraphQL"
      ],
      "Resource": [
        "arn:aws:appsync:REGION:ACCOUNT_ID:apis/GRAPHQL_ID/types/Mutation/fields/updateExample"
      ]
    }
  ]
}
```

See [documentation](https://docs.aws.amazon.com/appsync/latest/devguide/security.html#aws-iam-authorization) for more details.

To make this easier, CDK provides `grant` API.

Use the `grant` function for more granular authorization.

```ts
const role = new iam.Role(this, 'Role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});
declare const api: appsync.IGraphqlApi;

api.grant(role, appsync.IamResource.custom('types/Mutation/fields/updateExample'), 'appsync:GraphQL');
```

#### IamResource

In order to use the `grant` functions, you need to use the class `IamResource`.

- `IamResource.custom(...arns)` permits custom ARNs and requires an argument.

- `IamResouce.ofType(type, ...fields)` permits ARNs for types and their fields.

- `IamResource.all()` permits ALL resources.

#### Generic Permissions

Alternatively, you can use more generic `grant` functions to accomplish the same usage.

These include:

- grantMutation (use to grant access to Mutation fields)
- grantQuery (use to grant access to Query fields)
- grantSubscription (use to grant access to Subscription fields)

```ts
declare const api: appsync.IGraphqlApi;
declare const role: iam.Role;

// For generic types
api.grantMutation(role, 'updateExample');

// For custom types and granular design
api.grant(role, appsync.IamResource.ofType('Mutation', 'updateExample'), 'appsync:GraphQL');
```

### Pipeline Resolvers and AppSync Functions

AppSync Functions are local functions that perform certain operations onto a
backend data source. Developers can compose operations (Functions) and execute
them in sequence with Pipeline Resolvers.

```ts
declare const api: appsync.GraphqlApi;

const appsyncFunction = new appsync.AppsyncFunction(this, 'function', {
  name: 'appsync_function',
  api,
  dataSource: api.addNoneDataSource('none'),
  requestMappingTemplate: appsync.MappingTemplate.fromFile('request.vtl'),
  responseMappingTemplate: appsync.MappingTemplate.fromFile('response.vtl'),
});
```

When using the `LambdaDataSource`, you can control the maximum number of resolver request
inputs that will be sent to a single AWS Lambda function in a BatchInvoke operation
by setting the `maxBatchSize` property.

```ts
declare const api: appsync.GraphqlApi;
declare const lambdaDataSource: appsync.LambdaDataSource;

const appsyncFunction = new appsync.AppsyncFunction(this, 'function', {
  name: 'appsync_function',
  api,
  dataSource: lambdaDataSource,
  maxBatchSize: 10,
});
```

AppSync Functions are used in tandem with pipeline resolvers to compose multiple
operations.

```ts
declare const api: appsync.GraphqlApi;
declare const appsyncFunction: appsync.AppsyncFunction;

const pipelineResolver = new appsync.Resolver(this, 'pipeline', {
  api,
  dataSource: api.addNoneDataSource('none'),
  typeName: 'typeName',
  fieldName: 'fieldName',
  requestMappingTemplate: appsync.MappingTemplate.fromFile('beforeRequest.vtl'),
  pipelineConfig: [appsyncFunction],
  responseMappingTemplate: appsync.MappingTemplate.fromFile('afterResponse.vtl'),
});
```

#### JS Functions and Resolvers

JS Functions and resolvers are also supported. You can use a `.js` file within your CDK project, or specify your function code inline.

```ts
declare const api: appsync.GraphqlApi;

const myJsFunction = new appsync.AppsyncFunction(this, 'function', {
  name: 'my_js_function',
  api,
  dataSource: api.addNoneDataSource('none'),
  code: appsync.Code.fromAsset('directory/function_code.js'),
  runtime: appsync.FunctionRuntime.JS_1_0_0,
});

new appsync.Resolver(this, 'PipelineResolver', {
  api,
  typeName: 'typeName',
  fieldName: 'fieldName',
  code: appsync.Code.fromInline(`
    // The before step
    export function request(...args) {
      console.log(args);
      return {}
    }

    // The after step
    export function response(ctx) {
      return ctx.prev.result
    }
  `),
  runtime: appsync.FunctionRuntime.JS_1_0_0,
  pipelineConfig: [myJsFunction],
});
```

Learn more about Pipeline Resolvers and AppSync Functions [here](https://docs.aws.amazon.com/appsync/latest/devguide/pipeline-resolvers.html).

### Introspection

By default, AppSync allows you to use introspection queries.

For customers that want to limit access to be introspection queries, the `introspectionConfig` property can be set to `IntrospectionConfig.DISABLED` at creation time.
If `introspectionConfig` is not set, the service will default to `ENABLED`.

```ts
const api = new appsync.GraphqlApi(this, 'api', {
  name: 'DisableIntrospectionApi',
  definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.schema.graphql')),
  introspectionConfig: appsync.IntrospectionConfig.DISABLED,
});
```

### Query Depth Limits

By default, queries are able to process an unlimited amount of nested levels.
Limiting queries to a specified amount of nested levels has potential implications for the performance and flexibility of your project.

```ts
const api = new appsync.GraphqlApi(this, 'api', {
  name: 'LimitQueryDepths',
  definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.schema.graphql')),
  queryDepthLimit: 2,
});
```

### Resolver Count Limits

You can control how many resolvers each query can process.
By default, each query can process up to 10000 resolvers.
By setting a limit AppSync will not handle any resolvers past a certain number limit.

```ts
const api = new appsync.GraphqlApi(this, 'api', {
  name: 'LimitResolverCount',
  definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.schema.graphql')),
  resolverCountLimit: 2,
});
```

### Environment Variables

To use environment variables in resolvers, you can use the `environmentVariables` property and
the `addEnvironmentVariable` method.

```ts
const api = new appsync.GraphqlApi(this, 'api', {
  name: 'api',
  definition: appsync.Definition.fromFile(path.join(__dirname, 'appsync.schema.graphql')),
  environmentVariables: {
    EnvKey1: 'non-empty-1',
  },
});

api.addEnvironmentVariable('EnvKey2', 'non-empty-2');
```

### Configure an EventBridge target that invokes an AppSync GraphQL API

Configuring the target relies on the `graphQLEndpointArn` property.

Use the `AppSync` event target to trigger an AppSync GraphQL API. You need to
create an `AppSync.GraphqlApi` configured with `AWS_IAM` authorization mode.

The code snippet below creates a AppSync GraphQL API target that is invoked, calling the `publish` mutation.

```ts
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';

declare const rule: events.Rule;
declare const api: appsync.GraphqlApi;

rule.addTarget(new targets.AppSync(api, {
  graphQLOperation: 'mutation Publish($message: String!){ publish(message: $message) { message } }',
  variables: events.RuleTargetInput.fromObject({
    message: 'hello world',
  }),
}));
```

### Owner Contact

You can set the owner contact information for an API resource.
This field accepts any string input with a length of 0 - 256 characters.

```ts
const api = new appsync.GraphqlApi(this, 'OwnerContact', {
    name: 'OwnerContact',
    definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
    ownerContact: 'test-owner-contact',
});
```

## Events

### Example
AWS AppSync Events lets you create secure and performant serverless WebSocket APIs that can broadcast real-time event data to millions of subscribers, without you having to manage connections or resource scaling.

```ts
const apiKeyProvider: appsync.AppSyncAuthProvider = {
  authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
};

const api = new appsync.EventApi(this, 'api', {
  apiName: 'Api',
  ownerContact: 'OwnerContact',
  authorizationConfig: {
    authProviders: [
      apiKeyProvider,
    ],
    connectionAuthModeTypes: [
      appsync.AppSyncAuthorizationType.API_KEY,
    ],
    defaultPublishAuthModeTypes: [
      appsync.AppSyncAuthorizationType.API_KEY,
    ],
    defaultSubscribeAuthModeTypes: [
      appsync.AppSyncAuthorizationType.API_KEY,
    ],
  },
});

api.addChannelNamespace('default');
```

### Authorization

AWS AppSync Events offers the following authorization types to secure Event APIs: API keys, Lambda, IAM, OpenID Connect, and Amazon Cognito user pools.
Each option provides a different method of security:

- API Keys (`AppSyncAuthorizationType.API_KEY`)
- Amazon Cognito User Pools (`AppSyncAuthorizationType.USER_POOL`)
- OpenID Connect (`AppSyncAuthorizationType.OIDC`)
- AWS Identity and Access Management (`AppSyncAuthorizationType.IAM`)
- AWS Lambda (`AppSyncAuthorizationType.LAMBDA`)

When you define your API, you configure the authorization mode to connect to your Event API WebSocket.
You also configure the default authorization modes to use when publishing and subscribing to messages.
If you don't specify any authorization providers, an API key will be created for you as the authorization mode for the API.

For mor information, see [Configuring authorization and authentication to secure Event APIs](https://docs.aws.amazon.com/appsync/latest/eventapi/configure-event-api-auth.html).


```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';
declare const handler: lambda.Function;

const iamProvider: appsync.AppSyncAuthProvider = {
  authorizationType: appsync.AppSyncAuthorizationType.IAM,
};

const apiKeyProvider: appsync.AppSyncAuthProvider = {
  authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
};

const lambdaProvider: appsync.AppSyncAuthProvider = {
  authorizationType: appsync.AppSyncAuthorizationType.LAMBDA,
  lambdaAuthorizerConfig: {
    handler,
    resultsCacheTtl: Duration.minutes(6),
    validationRegex: 'test',
  },
};

const api = new appsync.EventApi(this, 'api', {
  apiName: 'api',
  authorizationConfig: {
    // set auth providers
    authProviders: [
      iamProvider,
      apiKeyProvider,
      lambdaProvider,
    ],
    connectionAuthModeTypes: [
      appsync.AppSyncAuthorizationType.IAM,  // IAM authorization to connect
    ],
    defaultPublishAuthModeTypes: [
      appsync.AppSyncAuthorizationType.API_KEY,  // API key authorization to publish
    ],
    defaultSubscribeAuthModeTypes: [
      appsync.AppSyncAuthorizationType.LAMBDA,  // Lambda authorization to subscribe
    ],
  }
});

api.addChannelNamespace('default');
```

If you don't specify any overrides for the `connectionAuthModeTypes`, `defaultPublishAuthModeTypes`, and `defaultSubscribeAuthModeTypes` parameters then all `authProviders` defined are included as default authorization mode types for connection, publish, and subscribe.

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';
declare const handler: lambda.Function;

const iamProvider: appsync.AppSyncAuthProvider = {
  authorizationType: appsync.AppSyncAuthorizationType.IAM,
};

const apiKeyProvider: appsync.AppSyncAuthProvider = {
  authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
};

/* API with IAM and API Key providers.
 * Connection, default publish and default subscribe
 * can be done with either IAM and API Key.
 */
const api = new appsync.EventApi(this, 'api', {
  apiName: 'api',
  authorizationConfig: {
    // set auth providers
    authProviders: [
      iamProvider,
      apiKeyProvider,
    ],
  }
});

api.addChannelNamespace('default');
```

### Data Sources

With AWS AppSync Events, you can configure data source integrations with Amazon DynamoDB, Amazon Aurora Serverless, Amazon EventBridge, Amazon Bedrock Runtime, AWS Lambda, Amazon OpenSearch Service, and HTTP endpoints. The Event API can be associated with the data source and you can use the data source as an integration in your channel namespace event handlers for `onPublish` and `onSubscribe` operations.

Below are examples for how you add the various data sources to you Event API.

#### Amazon DynamoDB

```ts
const api = new appsync.EventApi(this, 'EventApiDynamoDB', {
  apiName: 'DynamoDBEventApi',
});

const table = new dynamodb.Table(this, 'table', {
  tableName: 'event-messages',
  partitionKey: {
    name: 'id',
    type: dynamodb.AttributeType.STRING,
  },
});

const dataSource = api.addDynamoDbDataSource('ddbsource', table);
```

#### Amazon Aurora Serverless

```ts
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

declare const vpc: ec2.Vpc;
const databaseName = 'mydb';
const cluster = new rds.DatabaseCluster(this, 'Cluster', {
  engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_16_6 }),
  writer: rds.ClusterInstance.serverlessV2('writer'),
  vpc: vpc,
  credentials: { username: 'clusteradmin' },
  defaultDatabaseName: databaseName,
  enableDataApi: true,
});

const secret = secretsmanager.Secret.fromSecretNameV2(this, 'Secret', 'db-secretName');

const api = new appsync.EventApi(this, 'EventApiRds', {
  apiName: 'RdsEventApi',
});

const dataSource = api.addRdsDataSource('rdsds', cluster, secret, databaseName);
```

#### Amazon EventBridge

```ts
import * as events from 'aws-cdk-lib/aws-events';

const api = new appsync.EventApi(this, 'EventApiEventBridge', {
  apiName: 'EventBridgeEventApi',
});

const eventBus = new events.EventBus(this, 'test-bus');

const dataSource = api.addEventBridgeDataSource('eventbridgeds', eventBus);
```

#### AWS Lambda

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';

declare const lambdaDs: lambda.Function;

const api = new appsync.EventApi(this, 'EventApiLambda', {
  apiName: 'LambdaEventApi',
});

const dataSource = api.addLambdaDataSource('lambdads', lambdaDs);
```

#### Amazon OpenSearch Service

```ts
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';

const domain = new opensearch.Domain(this, 'Domain', {
  version: opensearch.EngineVersion.OPENSEARCH_2_17,
  encryptionAtRest: {
    enabled: true,
  },
  nodeToNodeEncryption: true,
  enforceHttps: true,
  capacity: {
    multiAzWithStandbyEnabled: false,
  },
  ebs: {
    enabled: true,
    volumeSize: 10,
  },
});
const api = new appsync.EventApi(this, 'EventApiOpenSearch', {
  apiName: 'OpenSearchEventApi',
});

const dataSource = api.addOpenSearchDataSource('opensearchds', domain);
```

#### HTTP Endpoints

```ts
import * as apigw from 'aws-cdk-lib/aws-apigateway';

const api = new appsync.EventApi(this, 'EventApiHttp', {
  apiName: 'HttpEventApi',
});

const randomApi = new apigw.RestApi(this, 'RandomApi');
const randomRoute = randomApi.root.addResource('random');
randomRoute.addMethod('GET', new apigw.MockIntegration({
  integrationResponses: [{
    statusCode: '200',
    responseTemplates: {
      'application/json': 'my-random-value',
    },
  }],
  passthroughBehavior: apigw.PassthroughBehavior.NEVER,
  requestTemplates: {
    'application/json': '{ "statusCode": 200 }',
  },
}), {
  methodResponses: [{ statusCode: '200' }],
});

const dataSource = api.addHttpDataSource('httpsource', `https://${randomApi.restApiId}.execute-api.${this.region}.amazonaws.com`);
```

### Custom Domain Names

With AWS AppSync, you can use custom domain names to configure a single, memorable domain that works for your Event APIs.
You can set custom domain by setting `domainName`. Also you can get custom HTTP/Realtime endpoint by `customHttpEndpoint`, `customRealtimeEndpoint`.

For more information, see [Configuring custom domain names for Event APIs](https://docs.aws.amazon.com/appsync/latest/eventapi/event-api-custom-domains.html).


```ts
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';

const myDomainName = 'api.example.com';
const certificate = new acm.Certificate(this, 'cert', { domainName: myDomainName });

const apiKeyProvider: appsync.AppSyncAuthProvider = {
  authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
};

const api = new appsync.EventApi(this, 'api', {
  apiName: 'Api',
  ownerContact: 'OwnerContact',
  authorizationConfig: {
    authProviders: [
      apiKeyProvider,
    ],
    connectionAuthModeTypes: [
      appsync.AppSyncAuthorizationType.API_KEY,
    ],
    defaultPublishAuthModeTypes: [
      appsync.AppSyncAuthorizationType.API_KEY,
    ],
    defaultSubscribeAuthModeTypes: [
      appsync.AppSyncAuthorizationType.API_KEY,
    ],
  },
  // Custom Domain Settings
  domainName: {
    certificate,
    domainName: myDomainName,
  },
});

api.addChannelNamespace('default');

// You can get custom HTTP/Realtime endpoint
new CfnOutput(this, 'AWS AppSync Events HTTP endpoint', { value: api.customHttpEndpoint });
new CfnOutput(this, 'AWS AppSync Events Realtime endpoint', { value: api.customRealtimeEndpoint });
```

### Log Group

AppSync automatically create a log group with the name `/aws/appsync/apis/<api_id>` upon deployment with log data set to never expire.
If you want to set a different expiration period, use the `logConfig.retention` property.

Also you can choose the log level by setting the `logConfig.fieldLogLevel` property.

For more information, see [Configuring CloudWatch Logs on Event APIs](https://docs.aws.amazon.com/appsync/latest/eventapi/event-api-monitoring-cw-logs.html).

To obtain the Event API's log group as a `logs.ILogGroup` use the `logGroup` property of the
`Api` construct.

```ts
import * as logs from 'aws-cdk-lib/aws-logs';

const apiKeyProvider: appsync.AppSyncAuthProvider = {
  authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
};

const api = new appsync.EventApi(this, 'api', {
  apiName: 'Api',
  ownerContact: 'OwnerContact',
  authorizationConfig: {
    authProviders: [
      apiKeyProvider,
    ],
    connectionAuthModeTypes: [
      appsync.AppSyncAuthorizationType.API_KEY,
    ],
    defaultPublishAuthModeTypes: [
      appsync.AppSyncAuthorizationType.API_KEY,
    ],
    defaultSubscribeAuthModeTypes: [
      appsync.AppSyncAuthorizationType.API_KEY,
    ],
  },
  logConfig: {
    fieldLogLevel: appsync.AppSyncFieldLogLevel.INFO,
    retention: logs.RetentionDays.ONE_WEEK,
  },
});

api.addChannelNamespace('default');
```

### WAF Protection

You can use AWS WAF to protect your AppSync API from common web exploits, such as SQL injection and cross-site scripting (XSS) attacks.
These could affect API availability and performance, compromise security, or consume excessive resources.

For more information, see [Using AWS WAF to protect AWS AppSync Event APIs](https://docs.aws.amazon.com/appsync/latest/eventapi/using-waf-protect-apis.html).

```ts
declare const api: appsync.EventApi;
declare const webAcl: wafv2.CfnWebACL;

// Associate waf with Event API
new wafv2.CfnWebACLAssociation(this, 'WafAssociation', {
  resourceArn: api.apiArn,
  webAclArn: webAcl.attrArn,
});
```

### Channel namespaces
Channel namespaces define the channels that are available on your Event API, and the capabilities and behaviors of these channels.
Channel namespaces provide a scalable approach to managing large numbers of channels.

Instead of configuring each channel individually, developers can apply settings across an entire namespace.

Channel namespace can optionally interact with data sources configured on the Event API by defining optional event handler code or using direct integrations with the data source where applicable.

For more information, see [Understanding channel namespaces](https://docs.aws.amazon.com/appsync/latest/eventapi/channel-namespaces.html).

```ts
declare const api: appsync.EventApi;

// create a channel namespace
new appsync.ChannelNamespace(this, 'Namespace', {
  api,
});

// You can also create a namespace through the addChannelNamespace method
api.addChannelNamespace('AnotherNameSpace', {});
```

The API's publishing and subscribing authorization configuration is automatically applied to all namespaces.
You can override this configuration at the namespace level. **Note**: the authorization type you select for a namespace must be defined as an authorization provider at the API level.

```ts
declare const api: appsync.EventApi;

new appsync.ChannelNamespace(this, 'Namespace', {
  api,
  authorizationConfig: {
    // Override publishing authorization to API Key
    publishAuthModeTypes: [appsync.AppSyncAuthorizationType.API_KEY],
    // Override subscribing authorization to Lambda
    subscribeAuthModeTypes: [appsync.AppSyncAuthorizationType.LAMBDA],
  },
});
```

You can define event handlers on channel namespaces. Event handlers are functions that run on AWS AppSync's JavaScript runtime and enable you to run custom business logic.
You can use an event handler to process published events or process and authorize subscribe requests.

For more information, see [Channel namespace handlers and event processing](https://docs.aws.amazon.com/appsync/latest/eventapi/channel-namespace-handlers.html).

```ts
declare const api: appsync.EventApi;

new appsync.ChannelNamespace(this, 'Namespace', {
  api,
  // set a handler from inline code
  code: appsync.Code.fromInline('/* event handler code here.*/'),
});

new appsync.ChannelNamespace(this, 'Namespace', {
  api,
  // set a handler from an asset
  code: appsync.Code.fromAsset('directory/function_code.js'),
});
```

You can define an integration in your event handler for `onPublish` and/or `onSubscribe` operations. When defining integrations on your channel namespace, you write code in the event handler to submit requests to and process responses from your data source. For example, if you configure an integration with Amazon DynamoDB for `onPublish` operations, you can persist those events to DynamoDB using a `batchPut` operation in the `request` method, and then return the events as normal in the `response` method. For an integration with Amazon OpenSearch Service, you may use this for `onPublish` operations to enrich the events.

When using the AWS Lambda data source integration, you can either invoke the Lambda function using the event handler code or you can directly invoke the Lambda function, bypassing the event handler code all together. When using direct invoke, you can choose to invoke the Lambda function synchronously or asynchronously by specifying the `invokeType` as `REQUEST_RESPONSE` or `EVENT` respectively.

Below are examples using Amazon DynamoDB, Amazon EventBridge, and AWS Lambda. You can leverage any supported data source in the same way.

#### Amazon DynamoDB & Amazon EventBridge

```ts
declare const api: appsync.EventApi;
declare const ddbDataSource: appsync.AppSyncDynamoDbDataSource;
declare const ebDataSource: appsync.AppSyncEventBridgeDataSource;

// DynamoDB data source for publish handler
api.addChannelNamespace('ddb-eb-ns', {
  code: appsync.Code.fromInline('/* event handler code here.*/'),
  publishHandlerConfig: {
    dataSource: ddbDataSource,
  },
  subscribeHandlerConfig: {
    dataSource: ebDataSource,
  },
});
```

#### AWS Lambda

```ts
declare const api: appsync.EventApi;
declare const lambdaDataSource: appsync.AppSyncLambdaDataSource;

// Lambda data source for publish handler
api.addChannelNamespace('lambda-ns', {
  code: appsync.Code.fromInline('/* event handler code here.*/'),
  publishHandlerConfig: {
    dataSource: lambdaDataSource,
  },
});

// Direct Lambda data source for publish handler
api.addChannelNamespace('lambda-direct-ns', {
  publishHandlerConfig: {
    dataSource: lambdaDataSource,
    direct: true,
  },
});

api.addChannelNamespace('lambda-direct-async-ns', {
  publishHandlerConfig: {
    dataSource: lambdaDataSource,
    direct: true,
    lambdaInvokeType: appsync.LambdaInvokeType.EVENT,
  },
});
```
