import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class EventApiOpenSearchStack extends cdk.Stack {
  public readonly lambdaTestFn: nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const domain = new opensearch.Domain(this, 'Domain', {
      version: opensearch.EngineVersion.OPENSEARCH_2_17,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
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

    const createIndexFunction = new nodejs.NodejsFunction(this, 'createIndexFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, 'integ-assets', 'eventapi-integrations', 'create-index-oss', 'index.js'),
      handler: 'handler',
      environment: {
        DOMAIN_ENDPOINT: domain.domainEndpoint,
      },
      bundling: {
        bundleAwsSDK: true,
      },
      timeout: cdk.Duration.seconds(15),
    });

    domain.grantReadWrite(createIndexFunction);

    const provider = new cr.Provider(this, 'provider', {
      onEventHandler: createIndexFunction,
    });

    new cdk.CustomResource(this, 'OpenSearchIndexResource', {
      serviceToken: provider.serviceToken,
      properties: {
        IndexName: 'movies',
        DomainEndpoint: domain.domainEndpoint,
      },
    });

    const api = new appsync.EventApi(this, 'EventApiOpenSearch', {
      apiName: 'OpenSearchEventApi',
    });

    const dataSource = api.addOpenSearchDataSource('opensearchds', domain);
    domain.grantReadWrite(dataSource);

    api.addChannelNamespace('search', {
      code: appsync.Code.fromAsset(path.join(__dirname, 'integ-assets', 'eventapi-handlers', 'oss.js')),
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

    this.lambdaTestFn = new nodejs.NodejsFunction(this, 'EventApiOpenSearchTestFunction', lambdaConfig);
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new EventApiOpenSearchStack(app, 'EventApiOpenSearchStack');

const integTest = new IntegTest(app, 'appsync-eventapi-opensearch-test', {
  testCases: [stack],
});

integTest.assertions.invokeFunction({
  functionName: stack.lambdaTestFn.functionName,
  payload: JSON.stringify({
    channel: 'search',
    action: 'pubSub',
    authMode: 'API_KEY',
    eventPayload: [{
      id: '2',
    }],
  }),
}).expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 200,
    msg: 'subscribe_success',
    pubStatusCode: 200,
    pubMsg: [{
      id: 2,
      title: 'The Last Canvas',
      year: 2023,
      genres: ['Thriller', 'Art', 'Crime'],
      director: 'Marcus Blackwood',
      actors: ['Isabella Romano', 'James Fletcher', 'Sophie Laurent'],
      plot: 'When a renowned art restorer discovers a hidden message in a Renaissance masterpiece, she becomes entangled in a centuries-old conspiracy that puts her life at risk.',
      rating: 8.4,
      runtime: 155,
    }],
  }),
}));
