import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as gamelift from '../lib';

describe('build', () => {

  describe('new', () => {
    const localAsset = path.join(__dirname, 'my-game-build');
    const contentBucketName = 'bucketname';
    const buildName = 'test-build';
    let stack: cdk.Stack;
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
      const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
      stack = new cdk.Stack(app);
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
              Ref: 'AssetParametersb95e4173bc399a8f686a4951aa26e01de1ed1e9d981ee1a7f18a15512dbdcb37S3Bucket3626B74C',
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

  describe('test import methods', () => {
    test('Build.fromBuildArn', () => {
      // GIVEN
      const stack2 = new cdk.Stack();

      // WHEN
      const imported = gamelift.Build.fromBuildArn(stack2, 'Imported', 'arn:aws:gamelift:us-east-1:123456789012:build/sample-build-id');

      // THEN
      expect(imported.buildArn).toEqual('arn:aws:gamelift:us-east-1:123456789012:build/sample-build-id');
      expect(imported.buildId).toEqual('sample-build-id');
    });

    test('Build.fromBuildId', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const imported = gamelift.Build.fromBuildId(stack, 'Imported', 'sample-build-id');

      // THEN
      expect(stack.resolve(imported.buildArn)).toStrictEqual({
        'Fn::Join': ['', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':gamelift:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':build/sample-build-id',
        ]],
      });
      expect(stack.resolve(imported.buildId)).toStrictEqual('sample-build-id');
    });
  });

  describe('Build.fromBuildAttributes()', () => {
    let stack: cdk.Stack;
    const buildId = 'build-test-identifier';
    const buildArn = `arn:aws:gamelift:build-region:123456789012:build/${buildId}`;

    beforeEach(() => {
      const app = new cdk.App();
      stack = new cdk.Stack(app, 'Base', {
        env: { account: '111111111111', region: 'stack-region' },
      });
    });

    describe('', () => {
      test('with required attrs only', () => {
        const importedFleet = gamelift.Build.fromBuildAttributes(stack, 'ImportedBuild', { buildArn });

        expect(importedFleet.buildId).toEqual(buildId);
        expect(importedFleet.buildArn).toEqual(buildArn);
        expect(importedFleet.env.account).toEqual('123456789012');
        expect(importedFleet.env.region).toEqual('build-region');
      });

      test('with missing attrs', () => {
        expect(() => gamelift.Build.fromBuildAttributes(stack, 'ImportedBuild', { }))
          .toThrow(/Either buildId or buildArn must be provided in BuildAttributes/);
      });

      test('with invalid ARN', () => {
        expect(() => gamelift.Build.fromBuildAttributes(stack, 'ImportedBuild', { buildArn: 'arn:aws:gamelift:build-region:123456789012:build' }))
          .toThrow(/No build identifier found in ARN: 'arn:aws:gamelift:build-region:123456789012:build'/);
      });
    });

    describe('for an build in a different account and region', () => {
      let build: gamelift.IBuild;

      beforeEach(() => {
        build = gamelift.Build.fromBuildAttributes(stack, 'ImportedBuild', { buildArn });
      });

      test("the build's region is taken from the ARN", () => {
        expect(build.env.region).toBe('build-region');
      });

      test("the build's account is taken from the ARN", () => {
        expect(build.env.account).toBe('123456789012');
      });
    });
  });
});


