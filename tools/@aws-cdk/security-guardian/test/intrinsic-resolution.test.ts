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

  describe('Parameter Resolution and Short Forms', () => {
    beforeEach(() => {
      // Reset global registry before each test
      setGlobalRegistry({ resources: {}, exports: {}, parameters: {} });
    });

    describe('Ref Function - Parameter Resolution', () => {
      test('should resolve template parameters from globalRegistry', () => {
        // Test: Ref resolves custom template parameters
        setGlobalRegistry({
          resources: {},
          exports: {},
          parameters: {
            'EnvironmentName': 'production',
            'InstanceType': 't3.large'
          }
        });

        const result = resolveIntrinsics({ Ref: 'EnvironmentName' });
        expect(result).toBe('production');
      });

      test('should prioritize pseudoparameters over template parameters', () => {
        // Test: AWS::Region pseudoparameter takes precedence over custom parameter
        setGlobalRegistry({
          resources: {},
          exports: {},
          parameters: {
            'AWS::Region': 'should-not-use-this'
          }
        });

        const result = resolveIntrinsics({ Ref: 'AWS::Region' });
        expect(result).toBe('us-west-2');
      });

      test('should return literal name if not found in parameters or pseudoparameters', () => {
        // Test: Unknown parameter names are returned as-is
        const result = resolveIntrinsics({ Ref: 'UnknownParameter' });
        expect(result).toBe('UnknownParameter');
      });
    });

    describe('Fn::Sub - Literal Escaping', () => {
      test('should handle literal escaping with ${!Literal} syntax', () => {
        // Test: ${!AWS::Region} becomes literal ${AWS::Region} in output
        const result = resolveIntrinsics({
          'Fn::Sub': 'echo ${!AWS::Region} > /tmp/region.txt'
        });
        expect(result).toBe('echo ${AWS::Region} > /tmp/region.txt');
      });

      test('should handle multiple literal escapes', () => {
        // Test: Multiple ${!...} patterns are all escaped properly
        const result = resolveIntrinsics({
          'Fn::Sub': '${!Literal1} and ${!Literal2}'
        });
        expect(result).toBe('${Literal1} and ${Literal2}');
      });

      test('should resolve template parameters in Sub', () => {
        // Test: ${BucketPrefix} resolves to actual parameter value in Sub
        setGlobalRegistry({
          resources: {},
          exports: {},
          parameters: {
            'BucketPrefix': 'my-app'
          }
        });

        const result = resolveIntrinsics({
          'Fn::Sub': '${BucketPrefix}-${AWS::Region}-bucket'
        });
        expect(result).toBe('my-app-us-west-2-bucket');
      });

      test('should handle both literals and parameters', () => {
        // Test: Mix of ${!literal} and ${parameter} in same Sub string
        setGlobalRegistry({
          resources: {},
          exports: {},
          parameters: {
            'AppName': 'myapp'
          }
        });

        const result = resolveIntrinsics({
          'Fn::Sub': 'export ${!AppName}=${AppName}'
        });
        expect(result).toBe('export ${AppName}=myapp');
      });
    });

    describe('Fn::Select - Bounds Checking', () => {
      test('should return correct value for valid index', () => {
        // Test: Select[1, [a,b,c]] returns 'b'
        const result = resolveIntrinsics({
          'Fn::Select': [1, ['a', 'b', 'c']]
        });
        expect(result).toBe('b');
      });

      test('should return fallback for out of bounds index', () => {
        // Test: Select[5, [a,b,c]] returns fallback value
        const result = resolveIntrinsics({
          'Fn::Select': [5, ['a', 'b', 'c']]
        });
        expect(result).toBe('selected-value');
      });

      test('should return fallback for negative index', () => {
        // Test: Select[-1, array] returns fallback value
        const result = resolveIntrinsics({
          'Fn::Select': [-1, ['a', 'b', 'c']]
        });
        expect(result).toBe('selected-value');
      });

      test('should return fallback for non-array input', () => {
        // Test: Select[0, 'not-array'] returns fallback value
        const result = resolveIntrinsics({
          'Fn::Select': [0, 'not-an-array']
        });
        expect(result).toBe('selected-value');
      });
    });

    describe('Fn::Contains - Parameter Order', () => {
      test('should check if value exists in list (correct order)', () => {
        // Test: Contains([list], value) checks if value is in list
        const result = resolveIntrinsics({
          'Fn::Contains': [['t3.large', 't3.small'], 't3.large']
        });
        expect(result).toBe(true);
      });

      test('should return false if value not in list', () => {
        // Test: Contains returns false when value not found in list
        const result = resolveIntrinsics({
          'Fn::Contains': [['t3.large', 't3.small'], 't3.medium']
        });
        expect(result).toBe(false);
      });

      test('should handle non-array first parameter', () => {
        // Test: Contains('not-array', value) returns false
        const result = resolveIntrinsics({
          'Fn::Contains': ['not-array', 'value']
        });
        expect(result).toBe(false);
      });
    });

    describe('Short Forms Support', () => {
      test('should handle !Base64 short form', () => {
        // Test: !Base64 shorthand works same as Fn::Base64
        const result = resolveIntrinsics({
          '!Base64': 'hello world'
        });
        expect(result).toBe(Buffer.from('hello world').toString('base64'));
      });

      test('should handle !Select short form', () => {
        // Test: !Select shorthand works same as Fn::Select
        const result = resolveIntrinsics({
          '!Select': [0, ['first', 'second']]
        });
        expect(result).toBe('first');
      });

      test('should handle !Split short form', () => {
        // Test: !Split shorthand works same as Fn::Split
        const result = resolveIntrinsics({
          '!Split': ['-', 'my-test-bucket']
        });
        expect(result).toEqual(['my', 'test', 'bucket']);
      });

      test('should handle !GetAZs short form', () => {
        // Test: !GetAZs shorthand returns mock availability zones
        const result = resolveIntrinsics({
          '!GetAZs': ''
        });
        expect(result).toEqual(['us-west-2a', 'us-west-2b', 'us-west-2c']);
      });

      test('should handle !FindInMap short form', () => {
        // Test: !FindInMap shorthand returns mock mapped value
        const result = resolveIntrinsics({
          '!FindInMap': ['RegionMap', 'us-west-2', 'AMI']
        });
        expect(result).toBe('mapped-value');
      });

      test('should handle !ImportValue short form', () => {
        // Test: !ImportValue shorthand resolves from global exports
        setGlobalRegistry({
          resources: {},
          exports: {
            'MyExport': 'exported-value'
          },
          parameters: {}
        });

        const result = resolveIntrinsics({
          '!ImportValue': 'MyExport'
        });
        expect(result).toBe('exported-value');
      });
    });

    describe('Complex Nested Examples with Phase 1 Fixes', () => {
      test('should handle nested functions with parameters', () => {
        // Test: Sub with parameters and literal escaping combined
        setGlobalRegistry({
          resources: {},
          exports: {},
          parameters: {
            'Environment': 'prod',
            'AppName': 'myapp'
          }
        });

        const result = resolveIntrinsics({
          'Fn::Sub': '${AppName}-${Environment}-${!AWS::Region}'
        });
        expect(result).toBe('myapp-prod-${AWS::Region}');
      });

      test('should handle Select with Split using short forms', () => {
        // Test: !Select[0, !Split['-', 'my-test-bucket']] = 'my'
        const result = resolveIntrinsics({
          '!Select': [0, { '!Split': ['-', 'my-test-bucket'] }]
        });
        expect(result).toBe('my');
      });
    });
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
      const { files: processedFiles, mapping } = preprocessTemplates(testDir, outputDir);
      expect(processedFiles.length).toBeGreaterThan(0);

      // Check that files were processed
      const outputFiles = fs.readdirSync(outputDir);
      expect(outputFiles.length).toBe(processedFiles.length);
      
      // Verify file mapping is created
      expect(mapping.size).toBeGreaterThan(0);
      for (const [resolvedPath, originalPath] of mapping.entries()) {
        expect(resolvedPath).toContain(outputDir);
        expect(originalPath).toContain(testDir);
        expect(fs.existsSync(resolvedPath)).toBe(true);
      }
    });
    
    test('creates correct file mappings for resolved templates', () => {
      const { mapping } = preprocessTemplates(testDir, outputDir);
      
      // Find CMCMK template mapping
      const cmcmkMapping = Array.from(mapping.entries()).find(([resolved, original]) => 
        original.includes('CMCMK-Stack.template.json')
      );
      
      expect(cmcmkMapping).toBeDefined();
      expect(cmcmkMapping![0]).toContain('CMCMK-Stack.template.json');
      expect(cmcmkMapping![1]).toContain('CMCMK-Stack.template.json');
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

    test('resolves Fn::Not with nested condition', () => {
      const input = {
        'Fn::Not': {
          'Fn::Contains': [['prod', 'staging'], 'dev']
        }
      };
      const result = resolveIntrinsics(input);
      expect(result).toBe(true); // !false = true
    });

    test('resolves Fn::Contains with nested Fn::Split', () => {
      const input = {
        'Fn::Contains': [
          { 'Fn::Split': [',', 'apple,banana,cherry'] },
          'banana'
        ]
      };
      const result = resolveIntrinsics(input);
      expect(result).toBe(true);
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