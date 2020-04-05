// tslint:disable: max-line-length
import { App, CfnOutput, CfnParameter, Stack } from '@aws-cdk/core';
import * as ssm from '../lib';

const app = new App();
const stack = new Stack(app, 'integ-parameter-arns');

const input = new CfnParameter(stack, 'ParameterNameParameter', { type: 'String', default: 'myParamName' });

const params = [
  new ssm.StringParameter(stack, 'StringAutogen', { stringValue: 'hello, world' }),
  new ssm.StringParameter(stack, 'StringSimple', { stringValue: 'hello, world', parameterName: 'simple-name' }),
  new ssm.StringParameter(stack, 'StringPath', { stringValue: 'hello, world', parameterName: '/path/name/foo/bar' }),
  new ssm.StringListParameter(stack, 'ListAutogen', { stringListValue: [ 'hello', 'world' ] }),
  new ssm.StringListParameter(stack, 'ListSimple', { stringListValue: [ 'hello', 'world' ], parameterName: 'list-simple-name' }),
  new ssm.StringListParameter(stack, 'ListPath', { stringListValue: [ 'hello', 'world' ], parameterName: '/list/path/name' }),
  new ssm.StringParameter(stack, 'ParameterizedSimple', { stringValue: 'hello, world', parameterName: input.valueAsString, simpleName: true }),
  new ssm.StringParameter(stack, 'ParameterizedNonSimple', { stringValue: 'hello, world', parameterName: `/${input.valueAsString}/non/simple`, simpleName: false }),
];

for (const p of params) {
  new CfnOutput(stack, `${p.node.id}Arn`, { value: p.parameterArn });
}

app.synth();
