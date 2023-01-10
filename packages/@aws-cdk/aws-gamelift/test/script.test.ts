import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as gamelift from '../lib';

describe('script', () => {
  const scriptId = 'script-test-identifier';
  const scriptArn = `arn:aws:gamelift:script-region:123456789012:script/${scriptId}`;
  const scriptName = 'test-script';
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    stack = new cdk.Stack(app, 'Base', {
      env: { account: '111111111111', region: 'stack-region' },
    });
  });

  describe('.fromScriptArn()', () => {
    test('with required fields', () => {
      const script = gamelift.Script.fromScriptArn(stack, 'ImportedScript', scriptArn);

      expect(script.scriptArn).toEqual(scriptArn);
      expect(script.grantPrincipal).toEqual(new iam.UnknownPrincipal({ resource: script }));
    });
  });

  describe('.fromScriptAttributes()', () => {
    test('with required attrs only', () => {
      const script = gamelift.Script.fromScriptAttributes(stack, 'ImportedScript', { scriptArn });

      expect(script.scriptId).toEqual(scriptId);
      expect(script.scriptArn).toEqual(scriptArn);
      expect(script.env.account).toEqual('123456789012');
      expect(script.env.region).toEqual('script-region');
      expect(script.grantPrincipal).toEqual(new iam.UnknownPrincipal({ resource: script }));
    });

    test('with all attrs', () => {
      const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/TestRole');
      const script = gamelift.Script.fromScriptAttributes(stack, 'ImportedScript', { scriptArn, role });

      expect(scriptId).toEqual(scriptId);
      expect(script.grantPrincipal).toEqual(role);
    });
  });

  describe('new', () => {
    const localAsset = path.join(__dirname, 'my-game-script');
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
    let script: gamelift.Script;
    let defaultProps: gamelift.ScriptProps;

    beforeEach(() => {
      contentBucket = s3.Bucket.fromBucketName(stack, 'ContentBucket', contentBucketName);
      content = gamelift.Content.fromBucket(contentBucket, 'content');
      defaultProps = {
        content,
      };
    });

    describe('.fromAsset()', () => {
      test('should create a new script from asset', () => {
        script = gamelift.Script.fromAsset(stack, 'ImportedScript', localAsset);

        expect(stack.node.metadata.find(m => m.type === 'aws:cdk:asset')).toBeDefined();
        Template.fromStack(stack).hasResourceProperties('AWS::GameLift::Script', {
          StorageLocation: {
            Bucket: {
              Ref: 'AssetParameters6019bfc8ab05a24b0ae9b5d8f4585cbfc7d1c30a23286d0b25ce7066a368a5d7S3Bucket72AA8348',
            },
          },
        });

      });
    });

    describe('.fromBucket()', () => {
      test('should create a new script from bucket', () => {
        script = gamelift.Script.fromBucket(stack, 'ImportedScript', contentBucket, 'content');

        Template.fromStack(stack).hasResourceProperties('AWS::GameLift::Script', {
          StorageLocation: {
            Bucket: 'bucketname',
            Key: 'content',
          },
        });

      });
    });

    describe('with necessary props only', () => {
      beforeEach(() => {
        script = new gamelift.Script(stack, 'Script', defaultProps);
      });

      test('should create a role and use it with the script', () => {
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
              Ref: 'ScriptServiceRole23DD8079',
            },
          ],
        });

        // check the script using the role
        Template.fromStack(stack).hasResourceProperties('AWS::GameLift::Script', {
          StorageLocation: {
            Bucket: 'bucketname',
            Key: 'content',
            RoleArn: {
              'Fn::GetAtt': [
                'ScriptServiceRole23DD8079',
                'Arn',
              ],
            },
          },
        });
      });

      test('should return correct script attributes from CloudFormation', () => {
        expect(stack.resolve(script.scriptId)).toEqual({ Ref: 'Script09016516' });
        expect(stack.resolve(script.scriptArn)).toEqual({
          'Fn::GetAtt': [
            'Script09016516',
            'Arn',
          ],
        });
      });

      test('with a custom role should use it and set it in CloudFormation', () => {
        const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/TestRole');
        script = new gamelift.Script(stack, 'ScriptWithRole', {
          ...defaultProps,
          role,
        });

        expect(script.grantPrincipal).toEqual(role);
        Template.fromStack(stack).hasResourceProperties('AWS::GameLift::Script', {
          StorageLocation: {
            RoleArn: role.roleArn,
          },
        });
      });

      test('with a custom scriptName should set it in CloudFormation', () => {
        script = new gamelift.Script(stack, 'ScriptWithName', {
          ...defaultProps,
          scriptName: scriptName,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::GameLift::Script', {
          Name: scriptName,
        });
      });

      test('with all optional attributes should set it in CloudFormation', () => {
        script = new gamelift.Script(stack, 'ScriptWithName', {
          ...defaultProps,
          scriptName: scriptName,
          scriptVersion: '1.0',
        });

        Template.fromStack(stack).hasResourceProperties('AWS::GameLift::Script', {
          Name: scriptName,
          Version: '1.0',
        });
      });

      test('with an incorrect scriptName (>1024)', () => {
        let incorrectScriptName = '';
        for (let i = 0; i < 1025; i++) {
          incorrectScriptName += 'A';
        }

        expect(() => new gamelift.Script(stack, 'ScriptWithWrongName', {
          content,
          scriptName: incorrectScriptName,
        })).toThrow(/Script name can not be longer than 1024 characters but has 1025 characters./);
      });
    });
  });
});


