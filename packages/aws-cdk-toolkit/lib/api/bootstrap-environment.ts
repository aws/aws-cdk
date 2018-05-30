import { App } from 'aws-cdk';
import { Environment } from 'aws-cdk-cx-api';
import { deployStack, DeployStackResult } from './deploy-stack';
import { SDK } from './util/sdk';
import { ToolkitStack } from './util/toolkit-stack';

export async function bootstrapEnvironment(environment: Environment, aws: SDK, toolkitStackName: string): Promise<DeployStackResult> {
    const app = new App();
    const stack = new ToolkitStack(app, toolkitStackName, { env: environment });
    const synthesizedStack = await app.synthesizeStack(stack.name);
    return await deployStack(synthesizedStack, aws);
}
