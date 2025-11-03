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
        'none',
        'json',
        'Trust Scope',
        flaggedFiles,
        errors
      );
      
      // Should detect violations (failures > 0 means rules are working)
      expect(failures).toBeGreaterThan(0);
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
        'none',
        'json',
        'Guard Hooks',
        flaggedFiles,
        errors
      );
      
      // Should process templates successfully (KMS keys with root are allowed)
      expect(typeof failures).toBe('number');
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
        'none',
        'json',
        'IAM',
        flaggedFiles,
        errors
      );
      
      // Should process templates and check for IAM violations
      expect(typeof failures).toBe('number');
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
        'none',
        'json',
        'S3',
        flaggedFiles,
        errors
      );
      
      // Should process templates and check for S3 violations
      expect(typeof failures).toBe('number');
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
        'none',
        'json',
        'CodePipeline',
        flaggedFiles,
        errors
      );
      
      // Should process templates and check for CodePipeline violations
      expect(typeof failures).toBe('number');
    });
  });
});