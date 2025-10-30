import { resolveIntrinsics, buildResourceRegistry, setGlobalRegistry } from '../src/cfn-resolver';
import { preprocessTemplates } from '../src/template-preprocessor';
import * as fs from 'fs';
import * as path from 'path';

describe('Intrinsic Function Resolution', () => {
  const testDir = path.join(__dirname, 'templates');
  const outputDir = path.join(__dirname, 'test-output');

  beforeAll(() => {
    // Create output directory
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  });

  afterAll(() => {
    // Cleanup output directory only
    if (fs.existsSync(outputDir)) fs.rmSync(outputDir, { recursive: true });
  });

  beforeEach(() => {
    // Clean output directory before each test
    if (fs.existsSync(outputDir)) {
      fs.readdirSync(outputDir).forEach(file => {
        fs.unlinkSync(path.join(outputDir, file));
      });
    }
  });

  describe('Basic Intrinsic Functions', () => {
    test('resolves Fn::Join', () => {
      const input = { 'Fn::Join': ['', ['http://', '192.168.1.1', ':8080']] };
      const result = resolveIntrinsics(input);
      expect(result).toBe('http://192.168.1.1:8080');
    });

    test('resolves Fn::Sub with pseudo-parameters', () => {
      const input = { 'Fn::Sub': 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/MyRole' };
      const result = resolveIntrinsics(input);
      expect(result).toBe('arn:aws:iam::123456789012:role/MyRole');
    });

    test('resolves Fn::GetAtt with resource context', () => {
      const resources = {
        'MyRole': { Type: 'AWS::IAM::Role' }
      };
      const input = { 'Fn::GetAtt': ['MyRole', 'Arn'] };
      const result = resolveIntrinsics(input, resources);
      expect(result).toBe('arn:aws:iam::123456789012:role/MyRole');
    });

    test('resolves Fn::Select', () => {
      const input = { 'Fn::Select': [1, ['first', 'second', 'third']] };
      const result = resolveIntrinsics(input);
      expect(result).toBe('second');
    });

    test('resolves Fn::Cidr', () => {
      const input = { 'Fn::Cidr': ['10.0.0.0/16', 4, '8'] };
      const result = resolveIntrinsics(input);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(4);
      expect(result[0]).toBe('10.0.0.0/24');
    });
  });

  describe('Cross-Stack Resolution', () => {
    test('builds registry from multiple templates', () => {
      const template1 = {
        Resources: {
          MyVPC: { Type: 'AWS::EC2::VPC', Properties: { CidrBlock: '10.0.0.0/16' } }
        },
        Outputs: {
          VPCId: {
            Value: { Ref: 'MyVPC' },
            Export: { Name: 'MyStack:VPCId' }
          }
        }
      };

      const template2 = {
        Resources: {
          MySubnet: { Type: 'AWS::EC2::Subnet' }
        }
      };

      const templates = { 'stack1': template1, 'stack2': template2 };
      const registry = buildResourceRegistry(templates);

      expect(registry.resources).toHaveProperty('MyVPC');
      expect(registry.resources).toHaveProperty('MySubnet');
      expect(registry.exports).toHaveProperty('MyStack:VPCId');
      expect(registry.exports['MyStack:VPCId']).toBe('MyVPC');
    });

    test('resolves Fn::ImportValue using registry', () => {
      const registry = {
        resources: {},
        exports: { 'MyStack:VPCId': 'vpc-12345' },
        parameters: {}
      };
      setGlobalRegistry(registry);

      const input = { 'Fn::ImportValue': 'MyStack:VPCId' };
      const result = resolveIntrinsics(input);
      expect(result).toBe('vpc-12345');
    });
  });

  describe('Template Preprocessing', () => {
    test('processes existing templates with intrinsic functions', () => {
      // Process existing templates
      const processedFiles = preprocessTemplates(testDir, outputDir);
      expect(processedFiles.length).toBeGreaterThan(0);

      // Check that files were processed
      const outputFiles = fs.readdirSync(outputDir);
      expect(outputFiles.length).toBe(processedFiles.length);
    });

    test('resolves Fn::Join in existing CMCMK template', () => {
      preprocessTemplates(testDir, outputDir);

      const resolved = JSON.parse(
        fs.readFileSync(path.join(outputDir, 'CMCMK-Stack.template.json'), 'utf8')
      );

      // Check that Fn::Join in ManagedPolicyArns is resolved
      const role = resolved.Resources.LambdaExecutionRoleD5C26073;
      const managedPolicyArn = role.Properties.ManagedPolicyArns[0];
      expect(managedPolicyArn).toBe('arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole');
    });

    test('resolves Fn::GetAtt in existing templates', () => {
      preprocessTemplates(testDir, outputDir);

      const resolved = JSON.parse(
        fs.readFileSync(path.join(outputDir, 'CMCMK-Stack.template.json'), 'utf8')
      );

      // Check that Fn::GetAtt for KMS key ARN is resolved
      const policy = resolved.Resources.LambdaExecutionRoleDefaultPolicy6D69732F;
      const resource = policy.Properties.PolicyDocument.Statement[0].Resource;
      expect(resource).toBe('arn:aws:kms:us-west-2:123456789012:key/myImportedKey10DE2890');
    });

    test('resolves Fn::Sub in existing templates', () => {
      preprocessTemplates(testDir, outputDir);

      const resolved = JSON.parse(
        fs.readFileSync(path.join(outputDir, 'StagingStack-default-resourcesmax-ACCOUNT-REGION.template.json'), 'utf8')
      );

      // Check that Fn::Sub in S3 bucket name is resolved
      const bucket = resolved.Resources.CdkStagingBucket1636058C;
      const bucketName = bucket.Properties.BucketName;
      expect(bucketName).toBe('cdk-default-resourcesmax-staging-123456789012-us-west-2');
    });
  });

  describe('Recursive Resolution', () => {
    test('resolves nested Fn::Join with Fn::GetAtt', () => {
      const resources = {
        'MyBucket': { Type: 'AWS::S3::Bucket' }
      };
      const input = {
        'Fn::Join': ['', [
          'arn:aws:s3:::', 
          { 'Fn::GetAtt': ['MyBucket', 'Arn'] },
          '/*'
        ]]
      };
      const result = resolveIntrinsics(input, resources);
      expect(result).toBe('arn:aws:s3:::arn:aws:s3:::MyBucket/*');
    });

    test('resolves Fn::Sub with nested Fn::Join', () => {
      const input = {
        'Fn::Sub': [
          'https://${Domain}/path',
          {
            'Domain': {
              'Fn::Join': ['.', ['api', 'example', 'com']]
            }
          }
        ]
      };
      const result = resolveIntrinsics(input);
      expect(result).toBe('https://api.example.com/path');
    });

    test('resolves deep nesting (3 levels)', () => {
      const resources = {
        'MyRole': { Type: 'AWS::IAM::Role' }
      };
      const input = {
        'Fn::Sub': [
          'Policy for ${RoleName}',
          {
            'RoleName': {
              'Fn::Select': [0, [
                { 'Fn::GetAtt': ['MyRole', 'RoleId'] }
              ]]
            }
          }
        ]
      };
      const result = resolveIntrinsics(input, resources);
      expect(result).toBe('Policy for AIDACKCEVSQ6C2EXAMPLE');
    });

    test('handles circular reference gracefully', () => {
      const input = {
        'Fn::Sub': [
          '${Var1}',
          {
            'Var1': { 'Fn::Sub': '${Var1}' }
          }
        ]
      };
      const result = resolveIntrinsics(input);
      expect(result).toBe('Var1');
    });

    test('resolves Fn::Select with nested Fn::Cidr', () => {
      const input = {
        'Fn::Select': [0, {
          'Fn::Cidr': ['10.0.0.0/16', 2, '8']
        }]
      };
      const result = resolveIntrinsics(input);
      expect(result).toBe('10.0.0.0/24');
    });
  });

  describe('Complex Scenarios', () => {
    test('handles IAM policies with intrinsic functions in existing templates', () => {
      preprocessTemplates(testDir, outputDir);

      const resolved = JSON.parse(
        fs.readFileSync(path.join(outputDir, 'StagingStack-default-resourcesmax-ACCOUNT-REGION.template.json'), 'utf8')
      );

      // Check S3 bucket policy with Fn::GetAtt and Fn::Join
      const bucketPolicy = resolved.Resources.CdkStagingBucketPolicy42BD1F92;
      const statement = bucketPolicy.Properties.PolicyDocument.Statement[1];
      const resources = statement.Resource;
      
      // Should have resolved bucket ARN and bucket ARN with /*
      expect(resources).toContain('arn:aws:s3:::CdkStagingBucket1636058C');
      expect(resources).toContain('arn:aws:s3:::CdkStagingBucket1636058C/*');
    });

    test('resolves complex nested functions in CodePipeline template', () => {
      preprocessTemplates(testDir, outputDir);

      const resolved = JSON.parse(
        fs.readFileSync(path.join(outputDir, 'codepipelinenestedstackPipelineCrossRegionStack37C990C7.nested.template.json'), 'utf8')
      );

      // Check that KMS key ARN in alias is resolved
      const alias = resolved.Resources.PipelineArtifactsBucketEncryptionKeyAlias5C510EEE;
      const targetKeyId = alias.Properties.TargetKeyId;
      expect(targetKeyId).toBe('arn:aws:kms:us-west-2:123456789012:key/PipelineArtifactsBucketEncryptionKey01D58D69');
    });
  });
});