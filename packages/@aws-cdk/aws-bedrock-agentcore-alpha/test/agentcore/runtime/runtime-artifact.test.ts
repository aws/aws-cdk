import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as cdk from 'aws-cdk-lib';
import { AgentRuntimeArtifact } from '../../../lib/runtime/runtime-artifact';
import { Runtime } from '../../../lib/runtime/runtime';

describe('AgentRuntimeArtifact tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let repository: ecr.Repository;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    repository = new ecr.Repository(stack, 'TestRepository', {
      repositoryName: 'test-agent-runtime',
    });
  });

  test('Should use default tag when not specified', () => {
    // Call without specifying tag to use default 'latest'
    const artifact = AgentRuntimeArtifact.fromEcrRepository(repository);

    const runtime = new Runtime(stack, 'test-runtime', {
      runtimeName: 'test_runtime',
      agentRuntimeArtifact: artifact,
    });

    // Bind the artifact
    artifact.bind(stack, runtime);

    // Render and check the URI includes 'latest' tag
    const rendered: any = artifact._render();
    expect(rendered.containerUri).toContain(':latest');
  });

  test('Should use default options when not specified for asset', () => {
    // Call without specifying options to use default {}
    // Use the testArtifact directory that exists in tests
    const artifact = AgentRuntimeArtifact.fromAsset('test/agentcore/runtime/testArtifact');

    const runtime = new Runtime(stack, 'test-runtime', {
      runtimeName: 'test_runtime',
      agentRuntimeArtifact: artifact,
    });

    // Bind the artifact
    artifact.bind(stack, runtime);

    // Should work with default options
    const rendered: any = artifact._render();
    expect(rendered.containerUri).toBeDefined();
  });

  test('Should throw error if _render is called before bind for AssetImage', () => {
    const artifact = AgentRuntimeArtifact.fromAsset('test/agentcore/runtime/testArtifact');

    // Try to render without binding
    expect(() => {
      artifact._render();
    }).toThrow('Asset not initialized. Call bind() before _render()');
  });

  test('Should only bind once for ECR image', () => {
    const artifact = AgentRuntimeArtifact.fromEcrRepository(repository, 'v1.0.0');

    const runtime = new Runtime(stack, 'test-runtime', {
      runtimeName: 'test_runtime',
      agentRuntimeArtifact: artifact,
    });

    // Mock grantPull to track calls
    let grantPullCalls = 0;
    const originalGrantPull = repository.grantPull.bind(repository);
    repository.grantPull = jest.fn(() => {
      grantPullCalls++;
      return originalGrantPull(runtime.role);
    });

    // Bind multiple times
    artifact.bind(stack, runtime);
    artifact.bind(stack, runtime);
    artifact.bind(stack, runtime);

    // Should only grant pull once
    expect(grantPullCalls).toBe(1);
  });

  test('Should only bind once for asset image', () => {
    const artifact = AgentRuntimeArtifact.fromAsset('test/agentcore/runtime/testArtifact', {
      buildArgs: {
        TEST: 'value',
      },
    });

    const runtime = new Runtime(stack, 'test-runtime', {
      runtimeName: 'test_runtime',
      agentRuntimeArtifact: artifact,
    });

    // Bind multiple times
    artifact.bind(stack, runtime);
    artifact.bind(stack, runtime);

    // Check that asset is created only once
    const rendered1: any = artifact._render();
    const rendered2: any = artifact._render();

    // Should return the same URI
    expect(rendered1.containerUri).toBe(rendered2.containerUri);
  });
});
