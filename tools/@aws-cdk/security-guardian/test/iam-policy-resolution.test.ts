import { IAMPolicyNormalizer } from '../src/policy-normalizer';
import { resolveIntrinsics, setGlobalRegistry } from '../src/cfn-resolver';

describe('IAM Policy Resolution', () => {
  beforeEach(() => {
    // Reset global registry before each test
    setGlobalRegistry({ resources: {}, exports: {}, parameters: {} });
  });

  describe('Policy Document Processing', () => {
    test('resolves intrinsic functions in Principal field', () => {
      const cfnResources = {
        'MyRole': { Type: 'AWS::IAM::Role' }
      };
      const normalizer = new IAMPolicyNormalizer(cfnResources);

      const policy = {
        Version: '2012-10-17',
        Statement: [{
          Effect: 'Allow',
          Principal: {
            AWS: { 'Fn::GetAtt': ['MyRole', 'Arn'] }
          },
          Action: 's3:GetObject'
        }]
      };

      const normalized = normalizer.normalizeIAMPolicy(policy, ['Principal']);
      expect(normalized.Statement[0].Principal.AWS).toBe('arn:aws:iam::123456789012:role/MyRole');
    });

    test('resolves intrinsic functions in Resource field', () => {
      const cfnResources = {
        'MyBucket': { Type: 'AWS::S3::Bucket' }
      };
      const normalizer = new IAMPolicyNormalizer(cfnResources);

      const policy = {
        Statement: [{
          Effect: 'Allow',
          Action: 's3:GetObject',
          Resource: {
            'Fn::Join': ['', [
              { 'Fn::GetAtt': ['MyBucket', 'Arn'] },
              '/*'
            ]]
          }
        }]
      };

      const normalized = normalizer.normalizeIAMPolicy(policy, ['Resource']);
      expect(normalized.Statement[0].Resource).toBe('arn:aws:s3:::MyBucket/*');
    });

    test('handles AssumeRolePolicyDocument with Fn::Sub', () => {
      const normalizer = new IAMPolicyNormalizer();

      const policy = {
        Statement: [{
          Effect: 'Allow',
          Principal: { Service: 'lambda.amazonaws.com' },
          Action: 'sts:AssumeRole',
          Condition: {
            StringEquals: {
              'aws:SourceAccount': { 'Fn::Sub': '${AWS::AccountId}' }
            }
          }
        }]
      };

      const normalized = normalizer.normalizeIAMPolicy(policy, ['Principal', 'Condition']);
      expect(normalized.Statement[0].Condition.StringEquals['aws:SourceAccount']).toBe('123456789012');
    });

    test('processes multiple statements with different intrinsics', () => {
      const cfnResources = {
        'Role1': { Type: 'AWS::IAM::Role' },
        'Bucket1': { Type: 'AWS::S3::Bucket' }
      };
      const normalizer = new IAMPolicyNormalizer(cfnResources);

      const policy = {
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: { 'Fn::GetAtt': ['Role1', 'Arn'] } },
            Action: 's3:ListBucket'
          },
          {
            Effect: 'Allow',
            Action: 's3:GetObject',
            Resource: { 'Fn::GetAtt': ['Bucket1', 'Arn'] }
          }
        ]
      };

      const normalized = normalizer.normalizeIAMPolicy(policy, ['Principal', 'Resource']);
      expect(normalized.Statement[0].Principal.AWS).toBe('arn:aws:iam::123456789012:role/Role1');
      expect(normalized.Statement[1].Resource).toBe('arn:aws:s3:::Bucket1');
    });
  });

  describe('Complex Intrinsic Resolution', () => {
    test('resolves nested Fn::Join with Fn::GetAtt in policy', () => {
      const cfnResources = {
        'MyQueue': { Type: 'AWS::SQS::Queue' }
      };
      const normalizer = new IAMPolicyNormalizer(cfnResources);

      const policy = {
        Statement: [{
          Effect: 'Allow',
          Action: 'sqs:SendMessage',
          Resource: {
            'Fn::Join': [':', [
              'arn:aws:sqs',
              { 'Fn::Sub': '${AWS::Region}' },
              { 'Fn::Sub': '${AWS::AccountId}' },
              { 'Fn::GetAtt': ['MyQueue', 'QueueName'] }
            ]]
          }
        }]
      };

      const normalized = normalizer.normalizeIAMPolicy(policy, ['Resource']);
      expect(normalized.Statement[0].Resource).toBe('arn:aws:sqs:us-west-2:123456789012:MyQueue');
    });

    test('handles Fn::ImportValue in policy conditions', () => {
      const registry = {
        resources: {},
        exports: { 'SharedVPC:Id': 'vpc-12345' },
        parameters: {}
      };
      setGlobalRegistry(registry);

      const normalizer = new IAMPolicyNormalizer();

      const policy = {
        Statement: [{
          Effect: 'Allow',
          Action: 'ec2:DescribeInstances',
          Condition: {
            StringEquals: {
              'ec2:vpc': { 'Fn::ImportValue': 'SharedVPC:Id' }
            }
          }
        }]
      };

      const normalized = normalizer.normalizeIAMPolicy(policy, ['Condition']);
      expect(normalized.Statement[0].Condition.StringEquals['ec2:vpc']).toBe('vpc-12345');
    });
  });

  describe('Policy Normalization Detection', () => {
    test('identifies fields needing normalization', () => {
      const cfnResources = {
        'MyRole': { Type: 'AWS::IAM::Role' }
      };
      const normalizer = new IAMPolicyNormalizer(cfnResources);

      const policy = {
        Statement: [{
          Effect: 'Allow',
          Principal: { AWS: { 'Fn::GetAtt': ['MyRole', 'Arn'] } },
          Action: 's3:GetObject',
          Resource: 'arn:aws:s3:::static-bucket/*'
        }]
      };

      const unnormalizedFields = normalizer.getUnnormalizedFields(policy);
      expect(unnormalizedFields.has('Principal')).toBe(true);
      expect(unnormalizedFields.has('Resource')).toBe(false);
      expect(unnormalizedFields.has('Action')).toBe(false);
    });

    test('detects nested intrinsics in arrays', () => {
      const normalizer = new IAMPolicyNormalizer();

      const policy = {
        Statement: [{
          Effect: 'Allow',
          Action: ['s3:GetObject', 's3:PutObject'],
          Resource: [
            'arn:aws:s3:::bucket1/*',
            { 'Fn::Sub': 'arn:aws:s3:::${BucketName}/*' }
          ]
        }]
      };

      const unnormalizedFields = normalizer.getUnnormalizedFields(policy);
      expect(unnormalizedFields.has('Resource')).toBe(true);
      expect(unnormalizedFields.has('Action')).toBe(false);
    });
  });

  describe('Integration with Template Processing', () => {
    test('processes policy within IAM role resource', () => {
      const cfnResources = {
        'MyBucket': { Type: 'AWS::S3::Bucket' },
        'MyRole': { Type: 'AWS::IAM::Role' }
      };

      const roleResource = {
        Type: 'AWS::IAM::Role',
        Properties: {
          AssumeRolePolicyDocument: {
            Statement: [{
              Effect: 'Allow',
              Principal: { Service: 'lambda.amazonaws.com' },
              Action: 'sts:AssumeRole'
            }]
          },
          Policies: [{
            PolicyName: 'S3Access',
            PolicyDocument: {
              Statement: [{
                Effect: 'Allow',
                Action: 's3:GetObject',
                Resource: {
                  'Fn::Join': ['', [
                    { 'Fn::GetAtt': ['MyBucket', 'Arn'] },
                    '/*'
                  ]]
                }
              }]
            }
          }]
        }
      };

      // Simulate template processing
      const resolved = resolveIntrinsics(roleResource, cfnResources);
      const normalizer = new IAMPolicyNormalizer(cfnResources);
      
      const normalizedPolicy = normalizer.normalizeIAMPolicy(
        resolved.Properties.Policies[0].PolicyDocument,
        ['Principal', 'Resource']
      );

      expect(normalizedPolicy.Statement[0].Resource).toBe('arn:aws:s3:::MyBucket/*');
    });
  });
});