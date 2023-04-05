# AWS AppSync Construct Library


The `@aws-cdk/aws-appsync` package contains constructs for building flexible
APIs that use GraphQL.

```ts nofixture
import * as appsync from 'aws-cdk-lib/aws-appsync';
```

## Example

### DynamoDB

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
  schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'schema.graphql')),
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



### Aurora Serverless

AppSync provides a data source for executing SQL commands against Amazon Aurora
Serverless clusters. You can use AppSync resolvers to execute SQL statements
against the Data API with GraphQL queries, mutations, and subscriptions.

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

### HTTP Endpoints

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
  schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'schema.graphql')),
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
    }
  }
);

httpDs.createResolver('MutationCallStepFunctionResolver', {
  typeName: 'Mutation',
  fieldName: 'callStepFunction',
  requestMappingTemplate: appsync.MappingTemplate.fromFile('request.vtl'),
  responseMappingTemplate: appsync.MappingTemplate.fromFile('response.vtl'),
});
```

### Amazon OpenSearch Service

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

## Custom Domain Names

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
  schema,
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

## Log Group

AppSync automatically create a log group with the name `/aws/appsync/apis/<graphql_api_id>` upon deployment with
log data set to never expire. If you want to set a different expiration period, use the `logConfig.retention` property.

To obtain the GraphQL API's log group as a `logs.ILogGroup` use the `logGroup` property of the
`GraphqlApi` construct.

```ts
import * as logs from 'aws-cdk-lib/aws-logs';

const logConfig: appsync.LogConfig = {
  retention: logs.RetentionDays.ONE_WEEK,
};

new appsync.GraphqlApi(this, 'api', {
  authorizationConfig: {},
  name: 'myApi',
  schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'myApi.graphql')),
  logConfig,
});
```

## Schema

You can define a schema using from a local file using `SchemaFile.fromAsset`

```ts
const api = new appsync.GraphqlApi(this, 'api', {
  name: 'myApi',
  schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'schema.graphl')),
});
```

### ISchema

Alternative schema sources can be defined by implementing the `ISchema`
interface. An example of this is the `CodeFirstSchema` class provided in
[awscdk-appsync-utils](https://github.com/cdklabs/awscdk-appsync-utils)

## Imports

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

## Authorization

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
  schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
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

## Permissions

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
declare const api: appsync.GraphqlApi;

api.grant(role, appsync.IamResource.custom('types/Mutation/fields/updateExample'), 'appsync:GraphQL');
```

### IamResource

In order to use the `grant` functions, you need to use the class `IamResource`.

- `IamResource.custom(...arns)` permits custom ARNs and requires an argument.

- `IamResouce.ofType(type, ...fields)` permits ARNs for types and their fields.

- `IamResource.all()` permits ALL resources.

### Generic Permissions

Alternatively, you can use more generic `grant` functions to accomplish the same usage.

These include:

- grantMutation (use to grant access to Mutation fields)
- grantQuery (use to grant access to Query fields)
- grantSubscription (use to grant access to Subscription fields)

```ts
declare const api: appsync.GraphqlApi;
declare const role: iam.Role;

// For generic types
api.grantMutation(role, 'updateExample');

// For custom types and granular design
api.grant(role, appsync.IamResource.ofType('Mutation', 'updateExample'), 'appsync:GraphQL');
```

## Pipeline Resolvers and AppSync Functions

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

### JS Functions and Resolvers

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
