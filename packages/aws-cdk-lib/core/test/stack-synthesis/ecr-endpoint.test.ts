import { Template } from '../../../assertions';
import { App, CfnOutput } from '../../lib';
import { Stack } from '../../lib/stack';
import { DefaultStackSynthesizer } from '../../lib/stack-synthesizers/default-synthesizer';

describe('ECR Endpoint Support in Stack Synthesizers', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Clean environment before each test
    delete process.env.AWS_USE_DUALSTACK_ENDPOINT;
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  test('DefaultStackSynthesizer: generates IPv4-only ECR endpoints by default', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'Stack', {
      synthesizer: new DefaultStackSynthesizer(),
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    // WHEN
    const location = stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'dockerHash',
    });

    new CfnOutput(stack, 'ImageUri', {
      value: location.imageUri,
    });

    // THEN
    const template = Template.fromStack(stack);
    const outputs = template.findOutputs('ImageUri');
    const imageUri = outputs.ImageUri.Value;
    
    // Check that it uses IPv4 format and contains expected components
    if (typeof imageUri === 'string') {
      expect(imageUri).toMatch(/\.dkr\.ecr\./);
      expect(imageUri).toMatch(/\.amazonaws\.com\//);
      expect(imageUri).toContain('123456789012');
      expect(imageUri).toContain('us-east-1');
    } else {
      // CloudFormation intrinsic function
      expect(imageUri['Fn::Sub']).toMatch(/\.dkr\.ecr\./);
      expect(imageUri['Fn::Sub']).toMatch(/\$\{AWS::URLSuffix\}/);
    }
  });

  test('DefaultStackSynthesizer: generates dual-stack ECR endpoints when AWS_USE_DUALSTACK_ENDPOINT=true', () => {
    // GIVEN
    process.env.AWS_USE_DUALSTACK_ENDPOINT = 'true';
    const app = new App();
    const stack = new Stack(app, 'Stack', {
      synthesizer: new DefaultStackSynthesizer(),
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    // WHEN
    const location = stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'dockerHash',
    });

    new CfnOutput(stack, 'ImageUri', {
      value: location.imageUri,
    });

    // THEN
    const template = Template.fromStack(stack);
    const outputs = template.findOutputs('ImageUri');
    const imageUri = outputs.ImageUri.Value;
    
    // Check that it uses dual-stack format
    expect(imageUri).toMatch(/\.dkr-ecr\./);
    expect(imageUri).toMatch(/\.on\.aws\//);
    expect(imageUri).toContain('123456789012');
    expect(imageUri).toContain('us-east-1');
  });

  test('DefaultStackSynthesizer: works with CloudFormation intrinsics for dual-stack', () => {
    // GIVEN
    process.env.AWS_USE_DUALSTACK_ENDPOINT = 'true';
    const app = new App();
    const stack = new Stack(app, 'Stack', {
      synthesizer: new DefaultStackSynthesizer(),
      // No explicit env - will use CloudFormation intrinsics
    });

    // WHEN
    const location = stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'dockerHash',
    });

    new CfnOutput(stack, 'ImageUri', {
      value: location.imageUri,
    });

    // THEN
    const template = Template.fromStack(stack);
    const outputs = template.findOutputs('ImageUri');
    const imageUri = outputs.ImageUri.Value;
    
    // Should use CloudFormation Fn::Sub with dual-stack format
    expect(imageUri).toHaveProperty('Fn::Sub');
    expect(imageUri['Fn::Sub']).toMatch(/\.dkr-ecr\./);
    expect(imageUri['Fn::Sub']).toMatch(/\.on\.aws\//);
  });
});
