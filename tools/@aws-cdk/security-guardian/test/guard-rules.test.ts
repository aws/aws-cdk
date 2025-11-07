import { preprocessTemplates } from '../src/template-preprocessor';
import { runCfnGuardValidation } from '../src/cfn-guard-runner';
import * as fs from 'fs';
import * as path from 'path';

describe('Guard Rules Validation', () => {
  const templatesDir = path.join(__dirname, 'templates');
  const outputDir = path.join(__dirname, 'guard-test-output');
  const rulesDir = path.join(__dirname, '..', 'rules');

  beforeAll(() => {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  });

  afterAll(() => {
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

  describe('Trust Scope Rules (IAM_ROLE_NO_BROAD_PRINCIPALS)', () => {
    test('should detect broad principals in IAM roles using existing templates', async () => {
      // Process existing templates that contain IAM roles with root principals
      preprocessTemplates(templatesDir, outputDir);
      
      const flaggedFiles: string[] = [];
      const errors: string[] = [];
      
      // Run validation with trust_scope_rules.guard
      const failures = await runCfnGuardValidation(
        outputDir,
        path.join(rulesDir, 'trust_scope_rules.guard'),
        path.join(outputDir, 'trust-scope-test.xml'),
        'Trust Scope',
        new Map()
      );
      
      // Should detect broad principals (validation should fail)
      expect(typeof failures).toBe('boolean');
      expect(failures).toBe(false);
    });
  });

  describe('Guard Hooks Rules (NO_ROOT_PRINCIPALS_EXCEPT_KMS_SECRETS)', () => {
    test('should allow root principals in KMS keys but block in other resources', async () => {
      // Process existing templates that contain KMS keys with root principals
      preprocessTemplates(templatesDir, outputDir);
      
      const flaggedFiles: string[] = [];
      const errors: string[] = [];
      
      // Run validation with guard-hooks rule
      const failures = await runCfnGuardValidation(
        outputDir,
        path.join(rulesDir, 'guard-hooks-no-root-principals.guard'),
        path.join(outputDir, 'guard-hooks-test.xml'),
        'Guard Hooks',
        new Map()
      );
      
      // Should detect violations in non-KMS resources (validation should fail)
      expect(typeof failures).toBe('boolean');
      expect(failures).toBe(false);
    });
  });

  describe('IAM Rules', () => {
    test('IAM_NO_WILDCARD_ACTIONS - should validate existing templates for wildcard actions', async () => {
      // Process existing templates that may contain IAM policies
      preprocessTemplates(templatesDir, outputDir);
      
      const flaggedFiles: string[] = [];
      const errors: string[] = [];
      
      // Run validation with IAM rules
      const failures = await runCfnGuardValidation(
        outputDir,
        path.join(rulesDir, 'iam.guard'),
        path.join(outputDir, 'iam-test.xml'),
        'IAM',
        new Map()
      );
      
      // Should detect IAM violations (validation should fail)
      expect(typeof failures).toBe('boolean');
      expect(failures).toBe(false);
    });
  });

  describe('S3 Rules', () => {
    test('S3_ENCRYPTION_ENABLED - should validate S3 buckets in existing templates', async () => {
      // Process existing templates that contain S3 buckets
      preprocessTemplates(templatesDir, outputDir);
      
      const flaggedFiles: string[] = [];
      const errors: string[] = [];
      
      // Run validation with S3 rules
      const failures = await runCfnGuardValidation(
        outputDir,
        path.join(rulesDir, 's3.guard'),
        path.join(outputDir, 's3-test.xml'),
        'S3',
        new Map()
      );
      
      // Should detect S3 violations (validation should fail)
      expect(typeof failures).toBe('boolean');
      expect(failures).toBe(false);
    });
  });

  describe('Template Processing', () => {
    test('should successfully process all existing templates', () => {
      // Process all existing templates in test/templates
      const processedFiles = preprocessTemplates(templatesDir, outputDir);
      
      // Should process all template files
      expect(processedFiles.length).toBeGreaterThan(0);
      
      // Check that resolved templates exist
      processedFiles.forEach(file => {
        expect(fs.existsSync(path.join(outputDir, file))).toBe(true);
      });
    });
  });

  describe('Intrinsic Function Resolution', () => {
    test('should resolve intrinsic functions in existing templates', () => {
      // Process templates with intrinsic functions
      const processedFiles = preprocessTemplates(templatesDir, outputDir);
      
      // Read a resolved template to verify intrinsics were processed
      const resolvedTemplate = JSON.parse(
        fs.readFileSync(path.join(outputDir, 'CMCMK-Stack.template.json'), 'utf8')
      );
      
      // Check that Fn::Join in ManagedPolicyArns was resolved
      const role = resolvedTemplate.Resources.LambdaExecutionRoleD5C26073;
      const managedPolicyArn = role.Properties.ManagedPolicyArns[0];
      expect(managedPolicyArn).toBe('arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole');
    });
  });

  describe('Policy Normalization', () => {
    test('should normalize IAM policies with intrinsic functions', () => {
      // Process templates with IAM policies containing intrinsics
      preprocessTemplates(templatesDir, outputDir);
      
      // Read resolved staging template
      const resolvedTemplate = JSON.parse(
        fs.readFileSync(path.join(outputDir, 'StagingStack-default-resourcesmax-ACCOUNT-REGION.template.json'), 'utf8')
      );
      
      // Check that IAM policy principals were resolved
      const bucketPolicy = resolvedTemplate.Resources.CdkStagingBucketPolicy42BD1F92;
      const statement = bucketPolicy.Properties.PolicyDocument.Statement[1];
      const principal = statement.Principal.AWS;
      
      // Should have resolved Fn::GetAtt to actual ARN
      expect(principal).toContain('arn:aws:iam::123456789012:role/');
    });
  });

  describe('CodePipeline Cross-Account Rules', () => {
    test('CODEPIPELINE_CROSS_ACCOUNT_ROLE_TRUST_SCOPE - should detect overly broad cross-account trust policies', async () => {
      // Process existing templates that may contain CodePipeline cross-account roles
      preprocessTemplates(templatesDir, outputDir);
      
      const flaggedFiles: string[] = [];
      const errors: string[] = [];
      
      // Run validation with CodePipeline rules
      const failures = await runCfnGuardValidation(
        outputDir,
        path.join(rulesDir, 'codepipeline.guard'),
        path.join(outputDir, 'codepipeline-test.xml'),
        'CodePipeline',
        new Map()
      );
      
      // Should detect CodePipeline violations (validation should fail)
      expect(typeof failures).toBe('boolean');
      expect(failures).toBe(false);
    });
  });

  describe('Compliant Templates', () => {
    const compliantTemplate = path.join(templatesDir, 'compliant-secure.template.json');

    test('should pass validation with compliant IAM role', async () => {
      // Run validation with trust scope rules on compliant template
      const failures = await runCfnGuardValidation(
        compliantTemplate,
        path.join(rulesDir, 'trust_scope_rules.guard'),
        path.join(outputDir, 'compliant-trust-test.xml'),
        'Compliant Trust',
        new Map()
      );
      
      // Should pass validation (no violations found)
      expect(typeof failures).toBe('boolean');
      expect(failures).toBe(true);
    });

    test('should pass validation with compliant S3 bucket', async () => {
      // Run validation with S3 rules on compliant template
      const failures = await runCfnGuardValidation(
        compliantTemplate,
        path.join(rulesDir, 's3.guard'),
        path.join(outputDir, 'compliant-s3-test.xml'),
        'Compliant S3',
        new Map()
      );
      
      // Should pass validation (encryption enabled)
      expect(typeof failures).toBe('boolean');
      expect(failures).toBe(true);
    });

    test('should pass validation with compliant EBS volume', async () => {
      // Run validation with EC2 rules on compliant template
      const failures = await runCfnGuardValidation(
        compliantTemplate,
        path.join(rulesDir, 'ec2.guard'),
        path.join(outputDir, 'compliant-ebs-test.xml'),
        'Compliant EBS',
        new Map()
      );
      
      // Should pass validation (encryption enabled)
      expect(typeof failures).toBe('boolean');
      expect(failures).toBe(true);
    });
  });
});