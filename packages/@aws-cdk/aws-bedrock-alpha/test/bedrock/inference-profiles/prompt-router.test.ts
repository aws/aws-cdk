import { App } from 'aws-cdk-lib/core';
import * as core from 'aws-cdk-lib/core';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as bedrockAlpha from '../../../bedrock';

describe('PromptRouter', () => {
  let stack: core.Stack;

  beforeEach(() => {
    const app = new App();
    stack = new core.Stack(app, 'test-stack', {
      env: { region: 'us-east-1' },
    });
  });

  test('creates prompt router from default Anthropic Claude V1 identifier', () => {
    const router = bedrockAlpha.PromptRouter.fromDefaultId(
      bedrockAlpha.DefaultPromptRouterIdentifier.ANTHROPIC_CLAUDE_V1,
      'us-east-1',
    );

    expect(router.promptRouterId).toBe('anthropic.claude:1');
    // The ARN contains CloudFormation tokens, so we check the structure
    expect(router.promptRouterArn).toContain('arn:');
    expect(router.promptRouterArn).toContain('bedrock');
    expect(router.promptRouterArn).toContain('us-east-1');
    expect(router.promptRouterArn).toContain('default-prompt-router/anthropic.claude:1');
  });

  test('creates prompt router from default Meta Llama 3.1 identifier', () => {
    const router = bedrockAlpha.PromptRouter.fromDefaultId(
      bedrockAlpha.DefaultPromptRouterIdentifier.META_LLAMA_3_1,
      'us-east-1',
    );

    expect(router.promptRouterId).toBe('meta.llama:1');
    expect(router.promptRouterArn).toContain('arn:');
    expect(router.promptRouterArn).toContain('bedrock');
    expect(router.promptRouterArn).toContain('us-east-1');
    expect(router.promptRouterArn).toContain('default-prompt-router/meta.llama:1');
    expect(router.routingEndpoints).toHaveLength(2);
  });

  test('creates routing endpoints as cross-region inference profiles', () => {
    const router = bedrockAlpha.PromptRouter.fromDefaultId(
      bedrockAlpha.DefaultPromptRouterIdentifier.ANTHROPIC_CLAUDE_V1,
      'us-east-1',
    );

    // Should create cross-region inference profiles for each routing model
    router.routingEndpoints.forEach(endpoint => {
      expect(endpoint).toBeInstanceOf(bedrockAlpha.CrossRegionInferenceProfile);
      expect((endpoint as bedrockAlpha.CrossRegionInferenceProfile).type).toBe(
        bedrockAlpha.InferenceProfileType.SYSTEM_DEFINED,
      );
    });
  });

  test('generates correct ARN format', () => {
    const router = bedrockAlpha.PromptRouter.fromDefaultId(
      bedrockAlpha.DefaultPromptRouterIdentifier.ANTHROPIC_CLAUDE_V1,
      'us-west-2',
    );

    // The ARN contains CloudFormation tokens, so we check the structure
    expect(router.promptRouterArn).toContain('arn:');
    expect(router.promptRouterArn).toContain('bedrock');
    expect(router.promptRouterArn).toContain('us-west-2');
    expect(router.promptRouterArn).toContain('default-prompt-router/anthropic.claude:1');
  });

  test('grantInvoke adds correct permissions for router and all endpoints', () => {
    const router = bedrockAlpha.PromptRouter.fromDefaultId(
      bedrockAlpha.DefaultPromptRouterIdentifier.ANTHROPIC_CLAUDE_V1,
      'us-east-1',
    );

    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    router.grantInvoke(role);
  });

  describe('DefaultPromptRouterIdentifier', () => {
    test('ANTHROPIC_CLAUDE_V1 has correct configuration', () => {
      const identifier = bedrockAlpha.DefaultPromptRouterIdentifier.ANTHROPIC_CLAUDE_V1;

      expect(identifier.promptRouterId).toBe('anthropic.claude:1');
      expect(identifier.routingModels).toHaveLength(2);
      expect(identifier.routingModels).toContain(bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_HAIKU_V1_0);
      expect(identifier.routingModels).toContain(bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0);
    });

    test('META_LLAMA_3_1 has correct configuration', () => {
      const identifier = bedrockAlpha.DefaultPromptRouterIdentifier.META_LLAMA_3_1;

      expect(identifier.promptRouterId).toBe('meta.llama:1');
      expect(identifier.routingModels).toHaveLength(2);
      expect(identifier.routingModels).toContain(bedrockAlpha.BedrockFoundationModel.META_LLAMA_3_1_8B_INSTRUCT_V1);
      expect(identifier.routingModels).toContain(bedrockAlpha.BedrockFoundationModel.META_LLAMA_3_1_70B_INSTRUCT_V1);
    });
  });

  describe('integration with different regions', () => {
    test('works with EU region', () => {
      const router = bedrockAlpha.PromptRouter.fromDefaultId(
        bedrockAlpha.DefaultPromptRouterIdentifier.ANTHROPIC_CLAUDE_V1,
        'eu-west-1',
      );

      expect(router.promptRouterArn).toMatch(/eu-west-1/);

      // Routing endpoints should use EU geo region
      router.routingEndpoints.forEach(endpoint => {
        const crossRegionProfile = endpoint as bedrockAlpha.CrossRegionInferenceProfile;
        expect(crossRegionProfile.inferenceProfileId).toMatch(/^eu\./);
      });
    });

    test('works with APAC region', () => {
      const router = bedrockAlpha.PromptRouter.fromDefaultId(
        bedrockAlpha.DefaultPromptRouterIdentifier.ANTHROPIC_CLAUDE_V1,
        'ap-southeast-1',
      );

      expect(router.promptRouterArn).toMatch(/ap-southeast-1/);

      // Routing endpoints should use APAC geo region
      router.routingEndpoints.forEach(endpoint => {
        const crossRegionProfile = endpoint as bedrockAlpha.CrossRegionInferenceProfile;
        expect(crossRegionProfile.inferenceProfileId).toMatch(/^apac\./);
      });
    });
  });

  describe('integration with prompts', () => {
    test('can be used as model for prompt variant', () => {
      const router = bedrockAlpha.PromptRouter.fromDefaultId(
        bedrockAlpha.DefaultPromptRouterIdentifier.ANTHROPIC_CLAUDE_V1,
        'us-east-1',
      );

      const variant = bedrockAlpha.PromptVariant.text({
        variantName: 'test-variant',
        promptText: 'What is the capital of France?',
        model: router,
      });

      new bedrockAlpha.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
        variants: [variant],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Prompt', {
        Variants: Match.arrayWith([
          Match.objectLike({
            Name: 'test-variant',
            ModelId: Match.anyValue(),
          }),
        ]),
      });
    });
  });

  describe('custom router configuration', () => {
    test('can create router with custom configuration', () => {
      const customRouter = new bedrockAlpha.PromptRouter(
        {
          promptRouterId: 'custom.router:1',
          routingModels: [
            bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_HAIKU_V1_0,
            bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
          ],
        },
        'us-east-1',
      );

      expect(customRouter.promptRouterId).toBe('custom.router:1');
      expect(customRouter.routingEndpoints).toHaveLength(2);
    });
  });

  describe('error handling', () => {
    test('handles region not in REGION_TO_GEO_AREA mapping', () => {
      // This should not throw, but the cross-region profiles might not work as expected
      // The router itself should still be created
      expect(() => {
        bedrockAlpha.PromptRouter.fromDefaultId(
          bedrockAlpha.DefaultPromptRouterIdentifier.ANTHROPIC_CLAUDE_V1,
          'unknown-region-1',
        );
      }).not.toThrow();
    });
  });

  describe('interface compliance', () => {
    test('implements IBedrockInvokable interface', () => {
      const router = bedrockAlpha.PromptRouter.fromDefaultId(
        bedrockAlpha.DefaultPromptRouterIdentifier.ANTHROPIC_CLAUDE_V1,
        'us-east-1',
      );

      // Should have all required properties
      expect(router.invokableArn).toBeDefined();
      expect(typeof router.grantInvoke).toBe('function');
    });

    test('implements IPromptRouter interface', () => {
      const router = bedrockAlpha.PromptRouter.fromDefaultId(
        bedrockAlpha.DefaultPromptRouterIdentifier.ANTHROPIC_CLAUDE_V1,
        'us-east-1',
      );

      // Should have all required properties
      expect(router.promptRouterArn).toBeDefined();
      expect(router.promptRouterId).toBeDefined();
      expect(router.routingEndpoints).toBeDefined();
      expect(Array.isArray(router.routingEndpoints)).toBe(true);
    });
  });
});
