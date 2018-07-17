import { Environment } from '@aws-cdk/cx-api';
import { CloudFormation } from 'aws-sdk';
import * as colors from 'colors/safe';
import { debug } from '../logging';
import { Mode } from './aws-auth/credentials';
import { BUCKET_DOMAIN_NAME_OUTPUT, BUCKET_NAME_OUTPUT  } from './bootstrap-environment';
import { waitForStack } from './util/cloudformation';
import { SDK } from './util/sdk';

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
    return {
        bucketName: getOutputValue(stack, BUCKET_NAME_OUTPUT),
        bucketEndpoint: getOutputValue(stack, BUCKET_DOMAIN_NAME_OUTPUT)
    };
}

function getOutputValue(stack: CloudFormation.Stack, output: string): string {
    let result: string | undefined;
    if (stack.Outputs) {
        const found = stack.Outputs.find(o => o.OutputKey === output);
        result = found && found.OutputValue;
    }
    if (result === undefined) {
        throw new Error(`The CDK toolkit stack (${stack.StackName}) does not have an output named ${output}. Use 'cdk bootstrap' to correct this.`);
    }
    return result;
}
