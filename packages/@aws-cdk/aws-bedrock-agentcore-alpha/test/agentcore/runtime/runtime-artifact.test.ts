import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Runtime } from '../../../lib/runtime/runtime';
import { AgentRuntimeArtifact, AgentCoreRuntime } from '../../../lib/runtime/runtime-artifact';

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

  test('Should create artifact from image URI', () => {
    const containerUri = '123456789012.dkr.ecr.us-east-1.amazonaws.com/my-repo:v1.0.0';
    const artifact = AgentRuntimeArtifact.fromImageUri(containerUri);

    const runtime = new Runtime(stack, 'test-runtime', {
      runtimeName: 'test_runtime',
      agentRuntimeArtifact: artifact,
    });

    artifact.bind(stack, runtime);
    const rendered: any = artifact._render();

    expect(rendered.containerUri).toBe(containerUri);
  });

  test('Should support CloudFormation tokens in image URI', () => {
    const token = cdk.Fn.ref('ImageUriParameter');
    const artifact = AgentRuntimeArtifact.fromImageUri(token);

    const runtime = new Runtime(stack, 'test-runtime', {
      runtimeName: 'test_runtime',
      agentRuntimeArtifact: artifact,
    });

    artifact.bind(stack, runtime);
    const rendered: any = artifact._render();

    expect(rendered.containerUri).toBe(token);
  });

  test('Should not require permissions for image URI', () => {
    const artifact = AgentRuntimeArtifact.fromImageUri('123456789012.dkr.ecr.us-east-1.amazonaws.com/my-repo:latest');

    const runtime = new Runtime(stack, 'test-runtime', {
      runtimeName: 'test_runtime',
      agentRuntimeArtifact: artifact,
    });

    // Bind should not throw or require any permissions
    expect(() => artifact.bind(stack, runtime)).not.toThrow();

    const rendered: any = artifact._render();
    expect(rendered.containerUri).toBe('123456789012.dkr.ecr.us-east-1.amazonaws.com/my-repo:latest');
  });

  test('Should reject non-ECR container URIs', () => {
    expect(() => {
      AgentRuntimeArtifact.fromImageUri('docker.io/myimage:latest');
    }).toThrow(/Invalid ECR container URI format/);

    expect(() => {
      AgentRuntimeArtifact.fromImageUri('ghcr.io/owner/repo:tag');
    }).toThrow(/Invalid ECR container URI format/);
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

    const runtime1 = new Runtime(stack1, 'test-runtime', {
      runtimeName: 'test_runtime_1',
      agentRuntimeArtifact: AgentRuntimeArtifact.fromAsset(testArtifactPath),
    });
    const runtime2 = new Runtime(stack2, 'test-runtime', {
      runtimeName: 'test_runtime_2',
      agentRuntimeArtifact: AgentRuntimeArtifact.fromAsset(testArtifactPath),
    });

    // Both stacks should synthesize successfully with the static construct ID
    const template1 = Template.fromStack(stack1);
    const template2 = Template.fromStack(stack2);

    template1.hasResourceProperties('AWS::BedrockAgentCore::Runtime', {
      AgentRuntimeName: 'test_runtime_1',
    });
    template2.hasResourceProperties('AWS::BedrockAgentCore::Runtime', {
      AgentRuntimeName: 'test_runtime_2',
    });

    // Verify both runtimes have the same static construct ID for the asset
    const assetNode1 = runtime1.node.findChild('AgentRuntimeArtifact');
    const assetNode2 = runtime2.node.findChild('AgentRuntimeArtifact');
    expect(assetNode1.node.id).toBe('AgentRuntimeArtifact');
    expect(assetNode1.node.id).toEqual(assetNode2.node.id);
  });

  test('internal: should throw when binding different asset artifacts to same scope', () => {
    const testArtifactPath = path.join(__dirname, 'testArtifact');

    const runtime = new Runtime(stack, 'test-runtime', {
      runtimeName: 'test_runtime',
      agentRuntimeArtifact: AgentRuntimeArtifact.fromAsset(testArtifactPath),
    });

    // Synthesize to trigger lazy asset creation
    Template.fromStack(stack);

    const artifact2 = AgentRuntimeArtifact.fromAsset(testArtifactPath);

    expect(() => {
      artifact2.bind(runtime, runtime);
    }).toThrow(/There is already a Construct with name 'AgentRuntimeArtifact'/);
  });

  describe('fromCodeAsset', () => {
    test('Should create artifact from code asset', () => {
      const artifact = AgentRuntimeArtifact.fromCodeAsset({
        path: path.join(__dirname, 'testArtifact'),
        runtime: AgentCoreRuntime.PYTHON_3_12,
        entrypoint: ['main.py'],
      });

      const runtime = new Runtime(stack, 'test-runtime', {
        runtimeName: 'test_runtime',
        agentRuntimeArtifact: artifact,
      });

      artifact.bind(stack, runtime);
      const rendered: any = artifact._render();

      expect(rendered.code).toBeDefined();
      expect(rendered.code.s3).toBeDefined();
      expect(rendered.code.s3.bucket).toBeDefined();
      expect(rendered.code.s3.prefix).toBeDefined();
      expect(rendered.runtime).toBe('PYTHON_3_12');
      expect(rendered.entryPoint).toEqual(['main.py']);
    });

    test('Should throw error if _render is called before bind for CodeAsset', () => {
      const artifact = AgentRuntimeArtifact.fromCodeAsset({
        path: path.join(__dirname, 'testArtifact'),
        runtime: AgentCoreRuntime.PYTHON_3_12,
        entrypoint: ['main.py'],
      });

      expect(() => {
        artifact._render();
      }).toThrow('Asset not initialized. Call bind() before _render()');
    });

    test('Should only bind once for code asset', () => {
      const artifact = AgentRuntimeArtifact.fromCodeAsset({
        path: path.join(__dirname, 'testArtifact'),
        runtime: AgentCoreRuntime.PYTHON_3_12,
        entrypoint: ['main.py'],
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

      // Should return the same bucket and key
      expect(rendered1.code.s3.bucket).toBe(rendered2.code.s3.bucket);
      expect(rendered1.code.s3.prefix).toBe(rendered2.code.s3.prefix);
    });

    test('Should grant read permissions to runtime role for code asset', () => {
      const artifact = AgentRuntimeArtifact.fromCodeAsset({
        path: path.join(__dirname, 'testArtifact'),
        runtime: AgentCoreRuntime.PYTHON_3_12,
        entrypoint: ['main.py'],
      });

      const runtime = new Runtime(stack, 'test-runtime', {
        runtimeName: 'test_runtime',
        agentRuntimeArtifact: artifact,
      });

      artifact.bind(stack, runtime);

      const template = Template.fromStack(stack);

      // Verify that IAM permissions are granted
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: Match.arrayWith(['s3:GetObject*', 's3:GetBucket*', 's3:List*']),
              Effect: 'Allow',
            }),
          ]),
        },
      });
    });
  });
});
