import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as gamelift from '../lib';

describe('build', () => {
  const buildId = 'test-identifier';
  const buildName = 'test-build';
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    stack = new cdk.Stack(app);
  });

  describe('.fromBuildId()', () => {
    test('with required fields', () => {
      const build = gamelift.Build.fromBuildId(stack, 'ImportedBuild', buildId);

      expect(build.buildId).toEqual(buildId);
      expect(build.grantPrincipal).toEqual(new iam.UnknownPrincipal({ resource: build }));
    });
  });

  describe('.fromBuildAttributes()', () => {
    test('with required attrs only', () => {
      const build = gamelift.Build.fromBuildAttributes(stack, 'ImportedBuild', { buildId });

      expect(build.buildId).toEqual(buildId);
      expect(build.grantPrincipal).toEqual(new iam.UnknownPrincipal({ resource: build }));
    });

    test('with all attrs', () => {
      const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/TestRole');
      const build = gamelift.Build.fromBuildAttributes(stack, 'ImportedBuild', { buildId, role });

      expect(buildId).toEqual(buildId);
      expect(build.grantPrincipal).toEqual(role);
    });
  });

  describe('new', () => {
    const localAsset = path.join(__dirname, 'my-game-build');
    const contentBucketName = 'bucketname';
    const contentBucketAccessStatement = {
      Action: [
        's3:GetObject',
        's3:GetObjectVersion',
      ],
      Effect: 'Allow',
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            `:s3:::${contentBucketName}/content`,
          ],
        ],
      },
    };
    let contentBucket: s3.IBucket;
    let content: gamelift.Content;
    let build: gamelift.Build;
    let defaultProps: gamelift.BuildProps;

    beforeEach(() => {
      contentBucket = s3.Bucket.fromBucketName(stack, 'ContentBucket', contentBucketName);
      content = gamelift.Content.fromBucket(contentBucket, 'content');
      defaultProps = {
        content,
      };
    });

    describe('.fromAsset()', () => {
      test('should create a new build from asset', () => {
        build = gamelift.Build.fromAsset(stack, 'ImportedBuild', localAsset);

        expect(stack.node.metadata.find(m => m.type === 'aws:cdk:asset')).toBeDefined();
        Template.fromStack(stack).hasResourceProperties('AWS::GameLift::Build', {
          StorageLocation: {
            Bucket: {
              Ref: 'AssetParametersb9a6ac85861c7bf3d745d9866a46a450a1b14afa77e28d2c2767e74ce4e37c03S3BucketAE342E3D',
            },
          },
        });

      });
    });

    describe('.fromBucket()', () => {
      test('should create a new build from bucket', () => {
        build = gamelift.Build.fromBucket(stack, 'ImportedBuild', contentBucket, 'content');

        Template.fromStack(stack).hasResourceProperties('AWS::GameLift::Build', {
          StorageLocation: {
            Bucket: 'bucketname',
            Key: 'content',
          },
        });

      });
    });

    describe('with necessary props only', () => {
      beforeEach(() => {
        build = new gamelift.Build(stack, 'Build', defaultProps);
      });

      test('should create a role and use it with the build', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
          AssumeRolePolicyDocument: {
            Statement: [
              {
                Action: 'sts:AssumeRole',
                Effect: 'Allow',
                Principal: {
                  Service: 'gamelift.amazonaws.com',
                },
              },
            ],
            Version: '2012-10-17',
          },
        });

        // Role policy should grant reading from the assets bucket
        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [
              contentBucketAccessStatement,
            ],
          },
          Roles: [
            {
              Ref: 'BuildServiceRole1F57E904',
            },
          ],
        });

        // check the build using the role
        Template.fromStack(stack).hasResourceProperties('AWS::GameLift::Build', {
          StorageLocation: {
            Bucket: 'bucketname',
            Key: 'content',
            RoleArn: {
              'Fn::GetAtt': [
                'BuildServiceRole1F57E904',
                'Arn',
              ],
            },
          },
        });
      });

      test('should return correct buildId from CloudFormation', () => {
        expect(stack.resolve(build.buildId)).toEqual({ Ref: 'Build45A36621' });
      });

      test('with a custom role should use it and set it in CloudFormation', () => {
        const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/TestRole');
        build = new gamelift.Build(stack, 'BuildWithRole', {
          ...defaultProps,
          role,
        });

        expect(build.grantPrincipal).toEqual(role);
        Template.fromStack(stack).hasResourceProperties('AWS::GameLift::Build', {
          StorageLocation: {
            RoleArn: role.roleArn,
          },
        });
      });

      test('with a custom buildName should set it in CloudFormation', () => {
        build = new gamelift.Build(stack, 'BuildWithName', {
          ...defaultProps,
          buildName: buildName,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::GameLift::Build', {
          Name: buildName,
        });
      });

      test('with all optional attributes should set it in CloudFormation', () => {
        build = new gamelift.Build(stack, 'BuildWithName', {
          ...defaultProps,
          buildName: buildName,
          operatingSystem: gamelift.OperatingSystem.AMAZON_LINUX_2,
          buildVersion: '1.0',
        });

        Template.fromStack(stack).hasResourceProperties('AWS::GameLift::Build', {
          Name: buildName,
          OperatingSystem: gamelift.OperatingSystem.AMAZON_LINUX_2,
          Version: '1.0',
        });
      });

      test('with an incorrect buildName (>1024)', () => {
        let incorrectBuildName = '';
        for (let i = 0; i < 1025; i++) {
          incorrectBuildName += 'A';
        }

        expect(() => new gamelift.Build(stack, 'BuildWithWrongName', {
          content,
          buildName: incorrectBuildName,
        })).toThrow(/Build name can not be longer than 1024 characters but has 1025 characters./);
      });
    });
  });
});


