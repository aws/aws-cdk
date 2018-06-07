import { App, Output } from '@aws-cdk/core';
import { Environment } from 'aws-cdk-cx-api';
import { CloudFormation } from 'aws-sdk';
import * as colors from 'colors/safe';
import { debug } from '../logging';
import { Mode } from './aws-auth/credentials';
import { waitForStack } from './util/cloudformation';
import { SDK } from './util/sdk';
import { ToolkitStack } from './util/toolkit-stack';

export interface ToolkitInfo {
    bucketName: string
    bucketEndpoint: string
}

export async function loadToolkitInfo(environment: Environment, sdk: SDK, stackName: string): Promise<ToolkitInfo | undefined> {
    const cfn = await sdk.cloudFormation(environment, Mode.ForReading);
    const stack = await waitForStack(cfn, stackName);
    if (!stack) {
        debug('The environment %s doesn\'t have the CDK toolkit stack (%s) installed. Use %s to setup your environment for use with the toolkit.',
                environment.name, stackName, colors.blue(`cdk bootstrap "${environment.name}"`));
        return undefined;
    }
    const stackModel = new ToolkitStack(new App(), 'ToolkitStack', { env: environment });
    return {
        bucketName: getOutputValue(stack, stackModel.bucketNameOutput),
        bucketEndpoint: getOutputValue(stack, stackModel.bucketDomainNameOutput)
    };
}

function getOutputValue(stack: CloudFormation.Stack, output: Output): string {
    const name = output.name;
    let result: string | undefined;
    if (stack.Outputs) {
        const found = stack.Outputs.find(o => o.OutputKey === name);
        result = found && found.OutputValue;
    }
    if (result === undefined) {
        throw new Error(`The CDK toolkit stack (${stack.StackName}) does not have an output named ${name}. Use 'cdk bootstrap' to correct this.`);
    }
    return result;
}
