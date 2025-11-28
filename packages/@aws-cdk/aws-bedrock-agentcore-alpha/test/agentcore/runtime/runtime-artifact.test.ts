import * as path from 'path';
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
    const artifact = AgentRuntimeArtifact.fromAsset(path.join(__dirname, 'testArtifact'));

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
    const artifact = AgentRuntimeArtifact.fromAsset(path.join(__dirname, 'testArtifact'));

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
    const artifact = AgentRuntimeArtifact.fromAsset(path.join(__dirname, 'testArtifact'), {
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

  test('Should use static construct ID for asset image regardless of directory', () => {
    // Create two separate stacks to test that the construct ID is always 'AgentRuntimeArtifact'
    const stack1 = new cdk.Stack(app, 'test-stack-1', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    const stack2 = new cdk.Stack(app, 'test-stack-2', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const testArtifactPath = path.join(__dirname, 'testArtifact');
    const artifact1 = AgentRuntimeArtifact.fromAsset(testArtifactPath);
    const artifact2 = AgentRuntimeArtifact.fromAsset(testArtifactPath);

    const runtime1 = new Runtime(stack1, 'test-runtime', {
      runtimeName: 'test_runtime_1',
      agentRuntimeArtifact: artifact1,
    });
    const runtime2 = new Runtime(stack2, 'test-runtime', {
      runtimeName: 'test_runtime_2',
      agentRuntimeArtifact: artifact2,
    });

    artifact1.bind(stack1, runtime1);
    artifact2.bind(stack2, runtime2);

    // Both should succeed - if the ID was dynamic based on directory hash,
    // different directories would produce different IDs, but now it's static
    const rendered1: any = artifact1._render();
    const rendered2: any = artifact2._render();

    expect(rendered1.containerUri).toBeDefined();
    expect(rendered2.containerUri).toBeDefined();
  });

  test('Should fail when binding different asset artifacts to same scope', () => {
    // This test verifies the static ID behavior - binding different artifacts
    // to the same scope should fail because the construct ID is static
    const testArtifactPath = path.join(__dirname, 'testArtifact');
    const artifact = AgentRuntimeArtifact.fromAsset(testArtifactPath);

    const runtime = new Runtime(stack, 'test-runtime', {
      runtimeName: 'test_runtime',
      agentRuntimeArtifact: artifact,
    });

    // First bind should succeed
    artifact.bind(stack, runtime);

    // Create a new artifact (same directory, but different artifact instance)
    const artifact2 = AgentRuntimeArtifact.fromAsset(testArtifactPath);

    // Second bind to the same scope should fail because the construct ID 'AgentRuntimeArtifact' already exists
    expect(() => {
      artifact2.bind(stack, runtime);
    }).toThrow(/There is already a Construct with name 'AgentRuntimeArtifact'/);
  });
});
