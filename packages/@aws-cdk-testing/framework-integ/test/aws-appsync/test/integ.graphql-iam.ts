import { join } from 'path';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Code, Function } from 'aws-cdk-lib/aws-lambda';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import {
  AuthorizationType,
  GraphqlApi,
  MappingTemplate,
  PrimaryKey,
  UserPoolDefaultAction,
  Values,
  IamResource,
  SchemaFile,
} from 'aws-cdk-lib/aws-appsync';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

/*
 * Creates an Appsync GraphQL API and Lambda with IAM Roles.
 * Testing for IAM Auth and grantFullAccess.
 *
 * Stack verification steps:
 * Install dependencies and deploy integration test. Invoke Lambda
 * function with different permissions to test policies.
 *
 * -- bash verify.integ.graphql-iam.sh --start             -- get dependencies/deploy    --
 * -- aws lambda list-functions                            -- obtain testFail/testQuery  --
 * -- aws lambda invoke /dev/stdout --function-name [FAIL] -- fails beacuse no IAM Role` --
 * -- aws lambda invoke /dev/stdout --function-name [Query]-- succeeds with empty get  ` --
 * -- bash verify.integ.graphql-iam.sh --clean             -- clean dependencies/deploy  --
 */

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'aws-appsync-integ');
const userPool = new UserPool(stack, 'Pool', {
  userPoolName: 'myPool',
});

const api = new GraphqlApi(stack, 'Api', {
  name: 'Integ_Test_IAM',
  schema: SchemaFile.fromAsset(join(__dirname, 'integ.graphql-iam.graphql')),
  authorizationConfig: {
    defaultAuthorization: {
      authorizationType: AuthorizationType.USER_POOL,
      userPoolConfig: {
        userPool,
        defaultAction: UserPoolDefaultAction.ALLOW,
      },
    },
    additionalAuthorizationModes: [
      {
        authorizationType: AuthorizationType.IAM,
      },
    ],
  },
});

const testTable = new Table(stack, 'TestTable', {
  billingMode: BillingMode.PAY_PER_REQUEST,
  partitionKey: {
    name: 'id',
    type: AttributeType.STRING,
  },
  removalPolicy: RemovalPolicy.DESTROY,
});

const testDS = api.addDynamoDbDataSource('ds', testTable, { name: 'testDataSource' });

testDS.createResolver('QueryGetTest', {
  typeName: 'Query',
  fieldName: 'getTest',
  requestMappingTemplate: MappingTemplate.dynamoDbGetItem('id', 'id'),
  responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
});

testDS.createResolver('QueryGetTests', {
  typeName: 'Query',
  fieldName: 'getTests',
  requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
  responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
});

testDS.createResolver('MutationAddTest', {
  typeName: 'Mutation',
  fieldName: 'addTest',
  requestMappingTemplate: MappingTemplate.dynamoDbPutItem(PrimaryKey.partition('id').auto(), Values.projecting('test')),
  responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
});

const lambdaIAM = new Role(stack, 'LambdaIAM', { assumedBy: new ServicePrincipal('lambda.amazonaws.com') });

api.grant(lambdaIAM, IamResource.custom('types/Query/fields/getTests'), 'appsync:graphql');
api.grant(lambdaIAM, IamResource.ofType('test'), 'appsync:GraphQL');
api.grantMutation(lambdaIAM, 'addTest');

new Function(stack, 'testQuery', {
  code: Code.fromAsset(join(__dirname, 'verify/iam-query')),
  handler: 'iam-query.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
  environment: { APPSYNC_ENDPOINT: api.graphqlUrl },
  role: lambdaIAM,
});
new Function(stack, 'testFail', {
  code: Code.fromAsset(join(__dirname, 'verify/iam-query')),
  handler: 'iam-query.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
  environment: { APPSYNC_ENDPOINT: api.graphqlUrl },
});

app.synth();
