import { App } from 'aws-cdk-lib/core';
import * as core from 'aws-cdk-lib/core';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as bedrockAlpha from '../../../bedrock';

describe('ApplicationInferenceProfile', () => {
  let app: App;
  let stack: core.Stack;
  let foundationModel: bedrockAlpha.IBedrockInvokable;

  beforeEach(() => {
    app = new App();
    stack = new core.Stack(app, 'test-stack');
    foundationModel = bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0;
  });

  // Helper function to create a fresh stack for tests that need isolation
  const createFreshStack = () => {
    const freshApp = new App();
    return new core.Stack(freshApp, `teststack${Date.now()}${Math.floor(Math.random() * 1000)}`);
  };

  test('creates application inference profile with foundation model', () => {
    new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
      applicationInferenceProfileName: 'test-profile',
      modelSource: foundationModel,
      description: 'Test application inference profile',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::ApplicationInferenceProfile', {
      InferenceProfileName: 'test-profile',
      Description: 'Test application inference profile',
      ModelSource: {
        CopyFrom: Match.anyValue(),
      },
    });
  });

  test('creates application inference profile with cross-region profile', () => {
    const crossRegionProfile = bedrockAlpha.CrossRegionInferenceProfile.fromConfig({
      geoRegion: bedrockAlpha.CrossRegionInferenceProfileRegion.US,
      model: bedrockAlpha.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
    });

    new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
      applicationInferenceProfileName: 'test-profile',
      modelSource: crossRegionProfile,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::ApplicationInferenceProfile', {
      InferenceProfileName: 'test-profile',
      ModelSource: {
        CopyFrom: Match.anyValue(),
      },
    });
  });

  test('creates application inference profile with tags', () => {
    new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
      applicationInferenceProfileName: 'test-profile',
      modelSource: foundationModel,
      tags: {
        Environment: 'Test',
        Project: 'CDK',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::ApplicationInferenceProfile', {
      Tags: [
        { Key: 'Environment', Value: 'Test' },
        { Key: 'Project', Value: 'CDK' },
      ],
    });
  });

  describe('validation', () => {
    test('throws error when inference profile name is empty', () => {
      expect(() => {
        new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
          applicationInferenceProfileName: '',
          modelSource: foundationModel,
        });
      }).toThrow('applicationInferenceProfileName is required and cannot be empty');
    });

    test('throws error when inference profile name is only whitespace', () => {
      expect(() => {
        new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
          applicationInferenceProfileName: '   ',
          modelSource: foundationModel,
        });
      }).toThrow('applicationInferenceProfileName is required and cannot be empty');
    });

    test('throws error when inference profile name is undefined', () => {
      expect(() => {
        new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
          applicationInferenceProfileName: undefined as any,
          modelSource: foundationModel,
        });
      }).toThrow('applicationInferenceProfileName is required and cannot be empty');
    });

    test('throws error when inference profile name exceeds 64 characters', () => {
      const longName = 'a'.repeat(65); // 65 characters
      expect(() => {
        new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
          applicationInferenceProfileName: longName,
          modelSource: foundationModel,
        });
      }).toThrow('applicationInferenceProfileName cannot exceed 64 characters');
    });

    test('accepts inference profile name with exactly 64 characters', () => {
      const maxLengthName = 'a'.repeat(64); // 64 characters
      expect(() => {
        new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
          applicationInferenceProfileName: maxLengthName,
          modelSource: foundationModel,
        });
      }).not.toThrow();
    });

    describe('name pattern validation', () => {
      test('accepts valid names with alphanumeric characters', () => {
        const validNames = [
          'test123',
          'MyProfile',
          'profile1',
          'A1B2C3',
        ];

        validNames.forEach((name, index) => {
          expect(() => {
            new bedrockAlpha.ApplicationInferenceProfile(stack, `TestProfile${index}`, {
              applicationInferenceProfileName: name,
              modelSource: foundationModel,
            });
          }).not.toThrow();
        });
      });

      test('accepts valid names with spaces', () => {
        const validNames = [
          'test profile',
          'My Profile 123',
          'profile 1',
          'A B C',
        ];

        validNames.forEach((name, index) => {
          expect(() => {
            new bedrockAlpha.ApplicationInferenceProfile(stack, `TestProfile${index}`, {
              applicationInferenceProfileName: name,
              modelSource: foundationModel,
            });
          }).not.toThrow();
        });
      });

      test('accepts valid names with underscores', () => {
        const validNames = [
          'test_profile',
          'My_Profile_123',
          'profile_1',
          'A_B_C',
        ];

        validNames.forEach((name, index) => {
          expect(() => {
            new bedrockAlpha.ApplicationInferenceProfile(stack, `TestProfile${index}`, {
              applicationInferenceProfileName: name,
              modelSource: foundationModel,
            });
          }).not.toThrow();
        });
      });

      test('accepts valid names with hyphens', () => {
        const validNames = [
          'test-profile',
          'My-Profile-123',
          'profile-1',
          'A-B-C',
        ];

        validNames.forEach((name, index) => {
          expect(() => {
            new bedrockAlpha.ApplicationInferenceProfile(stack, `TestProfile${index}`, {
              applicationInferenceProfileName: name,
              modelSource: foundationModel,
            });
          }).not.toThrow();
        });
      });

      test('accepts valid names with mixed separators', () => {
        const validNames = [
          'test_profile-123',
          'My Profile_123',
          'profile-1 test',
          'A_B-C 123',
        ];

        validNames.forEach((name, index) => {
          expect(() => {
            new bedrockAlpha.ApplicationInferenceProfile(stack, `TestProfile${index}`, {
              applicationInferenceProfileName: name,
              modelSource: foundationModel,
            });
          }).not.toThrow();
        });
      });

      test('accepts valid names with colons', () => {
        const validNames = [
          'test:profile',
          'My:Profile:123',
          'profile:1',
          'A:B:C',
          'test: profile',
          'profile :test',
        ];

        validNames.forEach((name, index) => {
          expect(() => {
            new bedrockAlpha.ApplicationInferenceProfile(stack, `TestProfileColon${index}`, {
              applicationInferenceProfileName: name,
              modelSource: foundationModel,
            });
          }).not.toThrow();
        });
      });

      test('accepts valid names with periods', () => {
        const validNames = [
          'test.profile',
          'My.Profile.123',
          'profile.1',
          'A.B.C',
          'test. profile',
          'profile .test',
        ];

        validNames.forEach((name, index) => {
          expect(() => {
            new bedrockAlpha.ApplicationInferenceProfile(stack, `TestProfilePeriod${index}`, {
              applicationInferenceProfileName: name,
              modelSource: foundationModel,
            });
          }).not.toThrow();
        });
      });

      test('accepts valid names with colons and periods mixed', () => {
        const validNames = [
          'test:profile.123',
          'My.Profile:123',
          'profile.1:test',
          'A:B.C',
          'test: profile.name',
          'profile .test:name',
        ];

        validNames.forEach((name, index) => {
          expect(() => {
            new bedrockAlpha.ApplicationInferenceProfile(stack, `TestProfileMixed${index}`, {
              applicationInferenceProfileName: name,
              modelSource: foundationModel,
            });
          }).not.toThrow();
        });
      });

      test('throws error for names starting with space', () => {
        expect(() => {
          new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
            applicationInferenceProfileName: ' test',
            modelSource: foundationModel,
          });
        }).toThrow('applicationInferenceProfileName must match pattern ^([0-9a-zA-Z:.][ _-]?)+$');
      });

      test('throws error for names starting with underscore', () => {
        expect(() => {
          new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
            applicationInferenceProfileName: '_test',
            modelSource: foundationModel,
          });
        }).toThrow('applicationInferenceProfileName must match pattern ^([0-9a-zA-Z:.][ _-]?)+$');
      });

      test('throws error for names starting with hyphen', () => {
        expect(() => {
          new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
            applicationInferenceProfileName: '-test',
            modelSource: foundationModel,
          });
        }).toThrow('applicationInferenceProfileName must match pattern ^([0-9a-zA-Z:.][ _-]?)+$');
      });

      test('throws error for names with invalid characters', () => {
        const invalidNames = [
          'test@profile',
          'test#profile',
          'test$profile',
          'test%profile',
          'test&profile',
          'test*profile',
          'test+profile',
          'test=profile',
          'test!profile',
          'test?profile',
          'test,profile',
          'test;profile',
          'test|profile',
          'test\\profile',
          'test/profile',
          'test<profile',
          'test>profile',
          'test[profile',
          'test]profile',
          'test{profile',
          'test}profile',
          'test(profile',
          'test)profile',
          'test"profile',
          "test'profile",
          'test`profile',
          'test~profile',
        ];

        invalidNames.forEach((name, index) => {
          const freshStack = createFreshStack();
          expect(() => {
            new bedrockAlpha.ApplicationInferenceProfile(freshStack, `TestProfile${index}`, {
              applicationInferenceProfileName: name,
              modelSource: foundationModel,
            });
          }).toThrow('applicationInferenceProfileName must match pattern ^([0-9a-zA-Z:.][ _-]?)+$');
        });
      });

      test('accepts names ending with space', () => {
        expect(() => {
          new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfileEndingSpace', {
            applicationInferenceProfileName: 'test ',
            modelSource: foundationModel,
          });
        }).not.toThrow();
      });

      test('accepts names ending with underscore', () => {
        expect(() => {
          new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfileEndingUnderscore', {
            applicationInferenceProfileName: 'test_',
            modelSource: foundationModel,
          });
        }).not.toThrow();
      });

      test('accepts names ending with hyphen', () => {
        expect(() => {
          new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfileEndingHyphen', {
            applicationInferenceProfileName: 'test-',
            modelSource: foundationModel,
          });
        }).not.toThrow();
      });

      test('throws error for names with consecutive separators', () => {
        const invalidNames = [
          'test  profile',
          'test__profile',
          'test--profile',
          'test_ profile',
          'test- profile',
          'test _profile',
          'test -profile',
        ];

        invalidNames.forEach((name, index) => {
          const freshStack = createFreshStack();
          expect(() => {
            new bedrockAlpha.ApplicationInferenceProfile(freshStack, `TestProfile${index}`, {
              applicationInferenceProfileName: name,
              modelSource: foundationModel,
            });
          }).toThrow('applicationInferenceProfileName must match pattern ^([0-9a-zA-Z:.][ _-]?)+$');
        });
      });
    });

    test('throws error when model source is not provided', () => {
      expect(() => {
        new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
          applicationInferenceProfileName: 'test-profile',
          modelSource: undefined as any,
        });
      }).toThrow('modelSource is required');
    });

    test('throws error when model source is null', () => {
      expect(() => {
        new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
          applicationInferenceProfileName: 'test-profile',
          modelSource: null as any,
        });
      }).toThrow('modelSource is required');
    });

    test('throws error when description exceeds 200 characters', () => {
      const longDescription = 'a'.repeat(201); // 201 characters
      expect(() => {
        new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
          applicationInferenceProfileName: 'test-profile',
          modelSource: foundationModel,
          description: longDescription,
        });
      }).toThrow('description cannot exceed 200 characters');
    });

    test('accepts description with exactly 200 characters', () => {
      const maxLengthDescription = 'a'.repeat(200); // 200 characters
      expect(() => {
        new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
          applicationInferenceProfileName: 'test-profile',
          modelSource: foundationModel,
          description: maxLengthDescription,
        });
      }).not.toThrow();
    });

    test('accepts undefined description', () => {
      expect(() => {
        new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
          applicationInferenceProfileName: 'test-profile',
          modelSource: foundationModel,
          description: undefined,
        });
      }).not.toThrow();
    });

    test('accepts empty description', () => {
      expect(() => {
        new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
          applicationInferenceProfileName: 'test-profile',
          modelSource: foundationModel,
          description: '',
        });
      }).not.toThrow();
    });

    test('validation order - checks required fields first', () => {
      expect(() => {
        new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
          applicationInferenceProfileName: undefined as any,
          modelSource: undefined as any,
        });
      }).toThrow('applicationInferenceProfileName is required and cannot be empty');
    });
  });

  test('grantInvoke adds correct permissions', () => {
    const profile = new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
      applicationInferenceProfileName: 'test-profile',
      modelSource: foundationModel,
    });

    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    profile.grantInvoke(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: ['bedrock:InvokeModel*', 'bedrock:GetFoundationModel'],
            Effect: 'Allow',
            Resource: Match.anyValue(),
          }),
          Match.objectLike({
            Action: ['bedrock:GetInferenceProfile', 'bedrock:InvokeModel'],
            Effect: 'Allow',
            Resource: Match.anyValue(),
          }),
        ]),
      },
    });
  });

  test('grantProfileUsage adds correct permissions', () => {
    const profile = new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
      applicationInferenceProfileName: 'test-profile',
      modelSource: foundationModel,
    });

    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    profile.grantProfileUsage(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: ['bedrock:GetInferenceProfile', 'bedrock:InvokeModel'],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [Match.stringLikeRegexp('TestProfile[A-Z0-9]+'), 'InferenceProfileArn'],
            },
          }),
        ]),
      },
    });
  });

  describe('static methods', () => {
    test('fromApplicationInferenceProfileAttributes creates profile from attributes', () => {
      const importedProfile = bedrockAlpha.ApplicationInferenceProfile.fromApplicationInferenceProfileAttributes(
        stack,
        'ImportedProfile',
        {
          inferenceProfileArn: 'arn:aws:bedrock:us-east-1:123456789012:application-inference-profile/test-profile-id',
          inferenceProfileIdentifier: 'test-profile-id',
        },
      );

      expect(importedProfile.inferenceProfileArn).toBe(
        'arn:aws:bedrock:us-east-1:123456789012:application-inference-profile/test-profile-id',
      );
      expect(importedProfile.inferenceProfileId).toBe('test-profile-id');
      expect(importedProfile.type).toBe(bedrockAlpha.InferenceProfileType.APPLICATION);
    });

    test('fromCfnApplicationInferenceProfile creates profile from L1 construct', () => {
      const cfnProfile = new bedrock.CfnApplicationInferenceProfile(stack, 'CfnProfile', {
        inferenceProfileName: 'test-profile',
        modelSource: {
          copyFrom: foundationModel.invokableArn,
        },
      });

      const importedProfile = bedrockAlpha.ApplicationInferenceProfile.fromCfnApplicationInferenceProfile(cfnProfile);

      expect(importedProfile.inferenceProfileArn).toBe(cfnProfile.attrInferenceProfileArn);
      expect(importedProfile.inferenceProfileId).toBe(cfnProfile.attrInferenceProfileId);
      expect(importedProfile.type).toBe(bedrockAlpha.InferenceProfileType.APPLICATION);
    });

    test('fromCfnApplicationInferenceProfile returns same instance when called multiple times (singleton pattern)', () => {
      const cfnProfile = new bedrock.CfnApplicationInferenceProfile(stack, 'CfnProfile', {
        inferenceProfileName: 'test-profile',
        modelSource: {
          copyFrom: foundationModel.invokableArn,
        },
      });

      // Call the method multiple times
      const importedProfile1 = bedrockAlpha.ApplicationInferenceProfile.fromCfnApplicationInferenceProfile(cfnProfile);
      const importedProfile2 = bedrockAlpha.ApplicationInferenceProfile.fromCfnApplicationInferenceProfile(cfnProfile);
      const importedProfile3 = bedrockAlpha.ApplicationInferenceProfile.fromCfnApplicationInferenceProfile(cfnProfile);

      // All calls should return the exact same instance (reference equality)
      expect(importedProfile1).toBe(importedProfile2);
      expect(importedProfile2).toBe(importedProfile3);
      expect(importedProfile1).toBe(importedProfile3);

      // Verify the properties are still correct
      expect(importedProfile1.inferenceProfileArn).toBe(cfnProfile.attrInferenceProfileArn);
      expect(importedProfile1.inferenceProfileId).toBe(cfnProfile.attrInferenceProfileId);
      expect(importedProfile1.type).toBe(bedrockAlpha.InferenceProfileType.APPLICATION);
    });
  });

  describe('attributes', () => {
    test('exposes correct attributes', () => {
      const profile = new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
        applicationInferenceProfileName: 'test-profile',
        modelSource: foundationModel,
        description: 'Test profile',
      });

      // The ARN contains CloudFormation tokens, so we check it's defined
      expect(profile.inferenceProfileArn).toBeDefined();
      expect(profile.inferenceProfileModel).toBe(foundationModel);
      expect(profile.type).toBe(bedrockAlpha.InferenceProfileType.APPLICATION);
      expect(profile.invokableArn).toBe(profile.inferenceProfileArn);
    });

    test('CloudFormation attributes are accessible', () => {
      const profile = new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
        applicationInferenceProfileName: 'test-profile',
        modelSource: foundationModel,
      });

      // These should be accessible without throwing errors
      expect(profile.inferenceProfileArn).toBeDefined();
      expect(profile.inferenceProfileId).toBeDefined();
      expect(profile.status).toBeDefined();
      expect(profile.createdAt).toBeDefined();
      expect(profile.updatedAt).toBeDefined();
    });
  });

  describe('integration with agents', () => {
    test('can be used as foundation model for agent', () => {
      const profile = new bedrockAlpha.ApplicationInferenceProfile(stack, 'TestProfile', {
        applicationInferenceProfileName: 'test-profile',
        modelSource: foundationModel,
      });

      new bedrockAlpha.Agent(stack, 'TestAgent', {
        instruction: 'You are a helpful assistant that uses an application inference profile for cost tracking.',
        foundationModel: profile,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        FoundationModel: {
          'Fn::GetAtt': [Match.stringLikeRegexp('TestProfile[A-Z0-9]+'), 'InferenceProfileArn'],
        },
      });
    });
  });
});
