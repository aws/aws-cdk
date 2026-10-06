import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cdk from 'aws-cdk-lib/core';
import { APIGATEWAY_LOG_GROUP_DESTINATION_ARN_WITHOUT_WILDCARD } from 'aws-cdk-lib/cx-api';

const app = new cdk.App({
  postCliContext: {
    [APIGATEWAY_LOG_GROUP_DESTINATION_ARN_WITHOUT_WILDCARD]: true,
  },
});
const stack = new cdk.Stack(app, 'ApiGatewayAccessLogArnWithoutWildcard');
const logGroup = new logs.LogGroup(stack, 'AccessLogs', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const api = new apigateway.RestApi(stack, 'Api', {
  cloudWatchRole: true,
  deployOptions: {
    accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
    accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields(),
  },
});
api.root.addMethod('GET');

const integ = new IntegTest(app, 'AccessLogArnWithoutWildcard', {
  testCases: [stack],
});
const getStage = integ.assertions.awsApiCall('APIGateway', 'getStage', {
  restApiId: api.restApiId,
  stageName: api.deploymentStage.stageName,
});
getStage.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['apigateway:GET'],
  Resource: [stack.formatArn({
    service: 'apigateway',
    account: '',
    resource: `/restapis/${api.restApiId}/stages/${api.deploymentStage.stageName}`,
    arnFormat: cdk.ArnFormat.NO_RESOURCE_NAME,
  })],
});
getStage.expect(ExpectedResult.objectLike({
  accessLogSettings: {
    destinationArn: stack.formatArn({
      service: 'logs',
      resource: 'log-group',
      resourceName: logGroup.logGroupName,
      arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
    }),
  },
}));
