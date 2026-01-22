import { Template, Match } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App } from 'aws-cdk-lib/core';
import * as core from 'aws-cdk-lib/core';
import * as bedrockAlpha from '../../../bedrock';

describe('CrossRegionInferenceProfile', () => {
  let stack: core.Stack;

  beforeEach(() => {
    const app = new App();
    stack = new core.Stack(app, 'test-stack', {
      env: { region: 'us-east-1' },
    });
  });

  test('creates cross-region inference profile with US region', () => {
    const profile = bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
      geoRegion: bedrockAlpha.CrossRegionInferenceProfileRegion.US,
      model: bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
    });

    expect(profile.inferenceProfileId).toBe('us.anthropic.claude-3-5-sonnet-20240620-v1:0');
    expect(profile.type).toBe(bedrockAlpha.InferenceProfileType.SYSTEM_DEFINED);
    expect(profile.inferenceProfileModel).toBe(bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0);
    expect(profile.invokableArn).toBe(profile.inferenceProfileArn);
  });

  test('creates cross-region inference profile with EU region', () => {
    const profile = bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
      geoRegion: bedrockAlpha.CrossRegionInferenceProfileRegion.EU,
      model: bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
    });

    expect(profile.inferenceProfileId).toBe('eu.anthropic.claude-3-5-sonnet-20240620-v1:0');
    expect(profile.type).toBe(bedrockAlpha.InferenceProfileType.SYSTEM_DEFINED);
  });

  test('creates cross-region inference profile with APAC region', () => {
    const profile = bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
      geoRegion: bedrockAlpha.CrossRegionInferenceProfileRegion.APAC,
      model: bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
    });

    expect(profile.inferenceProfileId).toBe('apac.anthropic.claude-3-5-sonnet-20240620-v1:0');
    expect(profile.type).toBe(bedrockAlpha.InferenceProfileType.SYSTEM_DEFINED);
  });

  test('generates correct ARN format', () => {
    const profile = bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
      geoRegion: bedrockAlpha.CrossRegionInferenceProfileRegion.US,
      model: bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
    });

    // The ARN contains CloudFormation tokens, so we check the structure
    expect(profile.inferenceProfileArn).toContain('arn:');
    expect(profile.inferenceProfileArn).toContain('bedrock');
    expect(profile.inferenceProfileArn).toContain('inference-profile/us.anthropic.claude-3-5-sonnet-20240620-v1:0');
  });

  test('throws error when model does not support cross-region', () => {
    const nonCrossRegionModel = new bedrockAlpha.BedrockFoundationModel('test.model-v1:0', {
      supportsCrossRegion: false,
    });

    expect(() => {
      bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
        geoRegion: bedrockAlpha.CrossRegionInferenceProfileRegion.US,
        model: nonCrossRegionModel,
      });
    }).toThrow('Model test.model-v1:0 does not support cross-region inference');
  });

  describe('validation', () => {
    test('throws error when geoRegion is not provided', () => {
      expect(() => {
        bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
          geoRegion: undefined as any,
          model: bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
        });
      }).toThrow('geoRegion is required');
    });

    test('throws error when geoRegion is null', () => {
      expect(() => {
        bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
          geoRegion: null as any,
          model: bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
        });
      }).toThrow('geoRegion is required');
    });

    test('throws error when model is not provided', () => {
      expect(() => {
        bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
          geoRegion: bedrockAlpha.CrossRegionInferenceProfileRegion.US,
          model: undefined as any,
        });
      }).toThrow('model is required');
    });

    test('throws error when model is null', () => {
      expect(() => {
        bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
          geoRegion: bedrockAlpha.CrossRegionInferenceProfileRegion.US,
          model: null as any,
        });
      }).toThrow('model is required');
    });

    test('throws error when both geoRegion and model are missing', () => {
      expect(() => {
        bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
          geoRegion: undefined as any,
          model: undefined as any,
        });
      }).toThrow('geoRegion is required');
    });
  });

  test('grantInvoke adds correct permissions', () => {
    const profile = bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
      geoRegion: bedrockAlpha.CrossRegionInferenceProfileRegion.US,
      model: bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
    });

    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    profile.grantInvoke(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          // Should grant permissions to invoke model in all regions
          Match.objectLike({
            Action: ['bedrock:InvokeModel*', 'bedrock:GetFoundationModel'],
            Effect: 'Allow',
            Resource: Match.anyValue(),
          }),
          // Should grant permissions to use the inference profile
          Match.objectLike({
            Action: ['bedrock:GetInferenceProfile', 'bedrock:InvokeModel*'],
            Effect: 'Allow',
            Resource: Match.anyValue(),
          }),
        ]),
      },
    });
  });

  describe('grantProfileUsage multi-region ARN generation', () => {
    test('generates multiple ARNs for US geoRegion', () => {
      const profile = bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
        geoRegion: bedrockAlpha.CrossRegionInferenceProfileRegion.US,
        model: bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
      });

      const role = new iam.Role(stack, 'TestRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      profile.grantProfileUsage(role);

      const template = Template.fromStack(stack);

      // Verify the policy has multiple resources (one per US region)
      const policyResources = template.findResources('AWS::IAM::Policy');
      const policyKey = Object.keys(policyResources)[0];
      const statements = policyResources[policyKey].Properties.PolicyDocument.Statement;
      const grantStatement = statements.find((s: any) =>
        s.Action.includes('bedrock:GetInferenceProfile'),
      );

      // Should have multiple resources (one per US region)
      expect(Array.isArray(grantStatement.Resource)).toBe(true);
      expect(grantStatement.Resource.length).toBeGreaterThan(1);
    });

    test('generates multiple ARNs for EU geoRegion', () => {
      const profile = bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
        geoRegion: bedrockAlpha.CrossRegionInferenceProfileRegion.EU,
        model: bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
      });

      const role = new iam.Role(stack, 'TestRoleEU', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      profile.grantProfileUsage(role);

      const template = Template.fromStack(stack);
      const policyResources = template.findResources('AWS::IAM::Policy');
      const policyKey = Object.keys(policyResources)[0];
      const statements = policyResources[policyKey].Properties.PolicyDocument.Statement;
      const grantStatement = statements.find((s: any) =>
        s.Action.includes('bedrock:GetInferenceProfile'),
      );

      // Should have multiple resources (one per EU region)
      expect(Array.isArray(grantStatement.Resource)).toBe(true);
      expect(grantStatement.Resource.length).toBeGreaterThan(1);
    });

    test('generates multiple ARNs for APAC geoRegion', () => {
      const profile = bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
        geoRegion: bedrockAlpha.CrossRegionInferenceProfileRegion.APAC,
        model: bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
      });

      const role = new iam.Role(stack, 'TestRoleAPAC', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      profile.grantProfileUsage(role);

      const template = Template.fromStack(stack);
      const policyResources = template.findResources('AWS::IAM::Policy');
      const policyKey = Object.keys(policyResources)[0];
      const statements = policyResources[policyKey].Properties.PolicyDocument.Statement;
      const grantStatement = statements.find((s: any) =>
        s.Action.includes('bedrock:GetInferenceProfile'),
      );

      // Should have multiple resources (one per APAC region)
      expect(Array.isArray(grantStatement.Resource)).toBe(true);
      expect(grantStatement.Resource.length).toBeGreaterThan(1);
    });

    test('generates wildcard ARN for GLOBAL geoRegion', () => {
      const profile = bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
        geoRegion: bedrockAlpha.CrossRegionInferenceProfileRegion.GLOBAL,
        model: bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
      });

      const role = new iam.Role(stack, 'TestRoleGlobal', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      profile.grantProfileUsage(role);

      const template = Template.fromStack(stack);
      const policyResources = template.findResources('AWS::IAM::Policy');
      const policyKey = Object.keys(policyResources)[0];
      const statements = policyResources[policyKey].Properties.PolicyDocument.Statement;
      const grantStatement = statements.find((s: any) =>
        s.Action.includes('bedrock:GetInferenceProfile'),
      );

      // For GLOBAL, should have a single resource with wildcard region
      // When there's only one resource, CDK may not wrap it in an array
      const resources = Array.isArray(grantStatement.Resource)
        ? grantStatement.Resource
        : [grantStatement.Resource];
      expect(resources.length).toBe(1);
    });

    test('generates specific ARNs for JP geoRegion', () => {
      const profile = bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
        geoRegion: bedrockAlpha.CrossRegionInferenceProfileRegion.JP,
        model: bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
      });

      const role = new iam.Role(stack, 'TestRoleJP', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      profile.grantProfileUsage(role);

      const template = Template.fromStack(stack);
      const policyResources = template.findResources('AWS::IAM::Policy');
      const policyKey = Object.keys(policyResources)[0];
      const statements = policyResources[policyKey].Properties.PolicyDocument.Statement;
      const grantStatement = statements.find((s: any) =>
        s.Action.includes('bedrock:GetInferenceProfile'),
      );

      // Should have exactly 2 resources (ap-northeast-1 and ap-northeast-3)
      expect(Array.isArray(grantStatement.Resource)).toBe(true);
      expect(grantStatement.Resource.length).toBe(2);
    });

    test('generates specific ARNs for AU geoRegion', () => {
      const profile = bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
        geoRegion: bedrockAlpha.CrossRegionInferenceProfileRegion.AU,
        model: bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
      });

      const role = new iam.Role(stack, 'TestRoleAU', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      profile.grantProfileUsage(role);

      const template = Template.fromStack(stack);
      const policyResources = template.findResources('AWS::IAM::Policy');
      const policyKey = Object.keys(policyResources)[0];
      const statements = policyResources[policyKey].Properties.PolicyDocument.Statement;
      const grantStatement = statements.find((s: any) =>
        s.Action.includes('bedrock:GetInferenceProfile'),
      );

      // Should have exactly 2 resources (ap-southeast-2 and ap-southeast-4)
      expect(Array.isArray(grantStatement.Resource)).toBe(true);
      expect(grantStatement.Resource.length).toBe(2);
    });
  });

  describe('region mapping', () => {
    test('REGION_TO_GEO_AREA contains correct mappings', () => {
      expect(bedrockAlpha.REGION_TO_GEO_AREA['us-east-1']).toBe(bedrockAlpha.CrossRegionInferenceProfileRegion.US);
      expect(bedrockAlpha.REGION_TO_GEO_AREA['us-east-2']).toBe(bedrockAlpha.CrossRegionInferenceProfileRegion.US);
      expect(bedrockAlpha.REGION_TO_GEO_AREA['us-west-2']).toBe(bedrockAlpha.CrossRegionInferenceProfileRegion.US);

      expect(bedrockAlpha.REGION_TO_GEO_AREA['eu-central-1']).toBe(bedrockAlpha.CrossRegionInferenceProfileRegion.EU);
      expect(bedrockAlpha.REGION_TO_GEO_AREA['eu-west-1']).toBe(bedrockAlpha.CrossRegionInferenceProfileRegion.EU);
      expect(bedrockAlpha.REGION_TO_GEO_AREA['eu-west-3']).toBe(bedrockAlpha.CrossRegionInferenceProfileRegion.EU);

      expect(bedrockAlpha.REGION_TO_GEO_AREA['ap-northeast-1']).toBe(bedrockAlpha.CrossRegionInferenceProfileRegion.APAC);
      expect(bedrockAlpha.REGION_TO_GEO_AREA['ap-northeast-2']).toBe(bedrockAlpha.CrossRegionInferenceProfileRegion.APAC);
      expect(bedrockAlpha.REGION_TO_GEO_AREA['ap-south-1']).toBe(bedrockAlpha.CrossRegionInferenceProfileRegion.APAC);
      expect(bedrockAlpha.REGION_TO_GEO_AREA['ap-southeast-1']).toBe(bedrockAlpha.CrossRegionInferenceProfileRegion.APAC);
      expect(bedrockAlpha.REGION_TO_GEO_AREA['ap-southeast-2']).toBe(bedrockAlpha.CrossRegionInferenceProfileRegion.APAC);
    });
  });

  describe('integration with application inference profiles', () => {
    test('can be used as model source for application inference profile', () => {
      const crossRegionProfile = bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
        geoRegion: bedrockAlpha.CrossRegionInferenceProfileRegion.US,
        model: bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
      });

      new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
        applicationInferenceProfileName: 'test-profile',
        modelSource: crossRegionProfile,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::ApplicationInferenceProfile', {
        ModelSource: {
          CopyFrom: Match.anyValue(),
        },
      });
    });
  });

  describe('integration with agents', () => {
    test('can be used as foundation model for agent', () => {
      const profile = bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
        geoRegion: bedrockAlpha.CrossRegionInferenceProfileRegion.US,
        model: bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
      });

      new bedrockAlpha.Agent(stack, 'TestAgent', {
        instruction: 'You are a helpful assistant that uses cross-region inference for better availability.',
        foundationModel: profile,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        FoundationModel: Match.anyValue(),
      });
    });
  });
});
