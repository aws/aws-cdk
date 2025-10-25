/**
 * Integration test for Bedrock AgentCore Runtime constructs with imported role
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime

import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as agentcore from '../../../agentcore';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';

const app = new cdk.App();

// Pre stack for imported resources
class PreStack extends cdk.Stack {
  public readonly role: iam.Role;
  public readonly asset: DockerImageAsset;

  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    this.role = new iam.Role(this, 'ExecutionRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
    });
    this.asset = new DockerImageAsset(this, 'TestAsset', {
      directory: path.join(__dirname, 'testArtifact'),
    });
    this.asset.repository.grantPull(this.role);
  }
}

interface TestStackProps extends cdk.StackProps {
  readonly role: iam.IRole;
  readonly asset: DockerImageAsset;
}

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: TestStackProps) {
    super(scope, id);

    const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromEcrRepository(props.asset.repository, props.asset.imageTag);
    const imported = iam.Role.fromRoleArn(this, 'ImportedRole', props.role.roleArn);
    const runtime = new agentcore.Runtime(this, 'TestRuntime', {
      runtimeName: 'integ_test_runtime',
      agentRuntimeArtifact: runtimeArtifact,
      executionRole: imported,
    });

    runtime.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: ['arn:aws:s3:::my-bucket/my-object'],
    }));
    runtime.addToRolePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:Query'],
      resources: ['arn:aws:dynamodb:us-east-1:123456789012:table/my-table'],
    }));
  }
}

const preStack = new PreStack(app, 'pre-stack');

const stack = new TestStack(app, 'aws-cdk-bedrock-agentcore-runtime-with-imported-role', {
  role: preStack.role,
  asset: preStack.asset,
});

new integ.IntegTest(app, 'BedrockAgentCoreRuntimeWithImportedRole', {
  testCases: [stack], // don't need to check preStack
});
