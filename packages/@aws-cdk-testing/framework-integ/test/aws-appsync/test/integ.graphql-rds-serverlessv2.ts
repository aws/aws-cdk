/// !cdk-integ *

import * as path from 'path';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as secretmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * Creates an Appsync GraphQL API and schema with Aurora Serverless V2 as datasource
 *
 * - build RDS Aurora Serverless V2 construct
 * - Build AppSync API
 * - Add RDS as Datasource
 * - Create query and mutation for RDS table
 */

class TestStack extends cdk.Stack {
  constructor(scope: Construct) {
    super(scope, 'appsync-rds-serverlessV2');

    const vpc = new Vpc(this, 'Integ-VPC');

    const credentialsBaseOptions: rds.CredentialsBaseOptions = {
      secretName: 'integ-secretName',
    };

    const cluster = new rds.DatabaseCluster(this, 'Integ-Cluster', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_15_5 }),
      writer: rds.ClusterInstance.serverlessV2('writer'),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      vpc,
      credentials: rds.Credentials.fromGeneratedSecret('clusteradmin', credentialsBaseOptions),
      defaultDatabaseName: 'integdb',
    });

    const secret = secretmanager.Secret.fromSecretNameV2(this, 'Secret', 'integ-secretName');

    const api = new appsync.GraphqlApi(this, 'RdsServerlessV2API', {
      name: 'RdsServerlessV2API',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.rds-serverlessv2.graphql')),
    });

    const serverlessV2DS = api.addRdsDataSourceV2('ds', cluster, secret, 'integdb');

    const queryAllPostReqTemplate: string = `{
      "version": "2018-05-29",
      "statements": [
        "SELECT * FROM integdb"
      ]
    }`;

    const queryAllPostsResolver: appsync.BaseResolverProps = {
      typeName: 'Query',
      fieldName: 'allPosts',
      requestMappingTemplate:
        appsync.MappingTemplate.fromString(queryAllPostReqTemplate),
      responseMappingTemplate: appsync.MappingTemplate.fromString(`
        #if($ctx.error)
            $utils.error($ctx.error.message, $ctx.error.type)
        #end
        $utils.toJson($utils.rds.toJsonObject($ctx.result)[0])`,
      ),
    };

    serverlessV2DS.createResolver('QueryGetallPostsResolver', queryAllPostsResolver);

    const queryPostReqTemplate: string = `{
      "version": "2018-05-29",
      "statements": [
        "SELECT * FROM integdb WHERE id = :id"
      ]
    }`;

    const queryPostResolver: appsync.BaseResolverProps = {
      typeName: 'Query',
      fieldName: 'getPost',
      requestMappingTemplate:
        appsync.MappingTemplate.fromString(queryPostReqTemplate),
      responseMappingTemplate: appsync.MappingTemplate.fromString(`
        #if($ctx.error)
            $utils.error($ctx.error.message, $ctx.error.type)
        #end
        $utils.toJson($utils.rds.toJsonObject($ctx.result)[0])`,
      ),
    };

    serverlessV2DS.createResolver('QueryGetPostResolver', queryPostResolver);

    const mutationAddPostReqTemplate: string = `
    {
      "version": "2018-05-29",
      "statements": [
        "INSERT INTO integdb VALUES (:id, :author, :title, :content, :url )",
        "SELECT * WHERE id = :id"
      ],
      "variableMap": {
        ":id": $util.toJson($util.autoId()),
        ":author": $util.toJson($ctx.args.author)
        ":title": $util.toJson($ctx.args.title)
        ":content": $util.toJson($ctx.args.content)
        ":url": $util.toJson($ctx.args.url)
      }
    }`;

    const mutationAddPostResolver: appsync.BaseResolverProps = {
      typeName: 'Mutation',
      fieldName: 'addPost',
      requestMappingTemplate:
        appsync.MappingTemplate.fromString(mutationAddPostReqTemplate),
      responseMappingTemplate: appsync.MappingTemplate.fromString(`
        #if($ctx.error)
            $utils.error($ctx.error.message, $ctx.error.type)
        #end
        $utils.toJson($utils.rds.toJsonObject($ctx.result)[0])`,
      ),
    };

    serverlessV2DS.createResolver('MutationAddPostResolver', mutationAddPostResolver);
  }
}

const app = new cdk.App();
const testCase = new TestStack(app);

new IntegTest(app, 'rds-serverlessV2-stack', {
  testCases: [testCase],
});

app.synth();
