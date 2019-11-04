// expected:
// {
//   "ListAutogenArn": "arn:aws:ssm:us-east-1:585695036304:parameter/CFN-ListAutogenC5DA1CAE-QmGaUkqhh6Au",
//   "ListPathArn": "arn:aws:ssm:us-east-1:585695036304:parameter/list/path/name",
//   "ListSimpleArn": "arn:aws:ssm:us-east-1:585695036304:parameter/list-simple-name",
//   "StringAutogenArn": "arn:aws:ssm:us-east-1:585695036304:parameter/CFN-StringAutogenE7E896E4-L0BHbfLgtgJT",
//   "StringPathArn": "arn:aws:ssm:us-east-1:585695036304:parameter/path/name/foo/bar",
//   "StringSimpleArn": "arn:aws:ssm:us-east-1:585695036304:parameter/simple-name",
// }

import { App, CfnOutput, Stack } from "@aws-cdk/core";
import ssm = require('../lib');

const app = new App();
const stack = new Stack(app, 'integ-parameter-arns');

const params = [
  new ssm.StringParameter(stack, 'StringAutogen', { stringValue: 'hello, world' }),
  new ssm.StringParameter(stack, 'StringSimple', { stringValue: 'hello, world', parameterName: 'simple-name' }),
  new ssm.StringParameter(stack, 'StringPath', { stringValue: 'hello, world', parameterName: '/path/name/foo/bar' }),
  new ssm.StringListParameter(stack, 'ListAutogen', { stringListValue: [ 'hello', 'world' ] }),
  new ssm.StringListParameter(stack, 'ListSimple', { stringListValue: [ 'hello', 'world' ], parameterName: 'list-simple-name' }),
  new ssm.StringListParameter(stack, 'ListPath', { stringListValue: [ 'hello', 'world' ], parameterName: '/list/path/name' }),
];

for (const p of params) {
  new CfnOutput(stack, `${p.node.id}Arn`, { value: p.parameterArn });
}

app.synth();