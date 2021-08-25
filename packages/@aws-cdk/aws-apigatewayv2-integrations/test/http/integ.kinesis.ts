import { HttpApi } from '@aws-cdk/aws-apigatewayv2';
import { PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Stream } from '@aws-cdk/aws-kinesis';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { KinesisPutRecordIntegration, Mapping, StreamMappingExpression, StringMappingExpression } from '../../lib';

// Stack verification steps
// <step-1> deploy the stack and find the api URL and the kinesis stream name
// <step-2> make a POST request to the URL, with a message body
// verify that the message has been written to the kinesis stream:
// <step-3> aws kinesis get-shard-iterator --stream-name <stream name> --shard-id 0 --shard-iterator-type TRIM_HORIZON
// <step-4> aws kinesis get-records --shard-iterator <shard-iterator>
// The message will be base64 encoded in the Data attribute of the record
const app = new App();
const stack = new Stack(app, 'integ-kinesis');
const httpApi = new HttpApi(stack, 'IntegKinesisApi');
const stream = new Stream(stack, 'Stream');
const role = new Role(stack, 'Role', {
  assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
});
role.addToPrincipalPolicy(new PolicyStatement({
  actions: ['kinesis:PutRecord'],
  resources: [stream.streamArn],
}));
httpApi.addRoutes({
  path: '/',
  integration: new KinesisPutRecordIntegration({
    data: StringMappingExpression.fromMapping(Mapping.fromRequestBody()),
    stream: StreamMappingExpression.fromStream(stream),
    partitionKey: StringMappingExpression.fromValue('1'),
    role,
  }),
});

new CfnOutput(stack, 'ApiUrl', {
  value: httpApi.apiEndpoint,
});
new CfnOutput(stack, 'StreamName', {
  value: stream.streamName,
});
