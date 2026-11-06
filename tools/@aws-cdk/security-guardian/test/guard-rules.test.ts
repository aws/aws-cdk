import { preprocessTemplates } from '../src/template-preprocessor';
import { runCfnGuardValidation } from '../src/cfn-guard-runner';
import { failedRules } from './junit-report';
import * as fs from 'fs';
import * as path from 'path';

describe('Guard Rules Validation', () => {
  const templatesDir = path.join(__dirname, 'templates');
  const ruleFixturesDir = path.join(__dirname, 'rule-fixtures');
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
      
      // Run validation with IAM role rules
      const success = await runCfnGuardValidation(
        outputDir,
        path.join(rulesDir, 'iam/iam-role-no-broad-principals.guard'),
        path.join(outputDir, 'trust-scope-test.xml'),
        'Trust Scope',
        new Map(),
        false
      );
      
      // Should detect broad principals (validation should fail)
      expect(typeof success).toBe('boolean');
      expect(success).toBe(false);
      expect(failedRules(path.join(outputDir, 'trust-scope-test.xml'))).toContain('IAM_ROLE_NO_BROAD_PRINCIPALS');
    });
  });

  describe('Resource Policy Rules (RESOURCE_POLICY_ROOT_PRINCIPAL_NEEDS_CONDITIONS)', () => {
    test('should detect root principals without conditions in resource policies', async () => {
      // Process existing templates that contain resource policies with root principals
      preprocessTemplates(templatesDir, outputDir);
      
      // Run validation with resource-policies rule
      const success = await runCfnGuardValidation(
        outputDir,
        path.join(rulesDir, 'resource-policies/resource-policy-root-principal-needs-conditions.guard'),
        path.join(outputDir, 'resource-policy-test.xml'),
        'Resource Policy',
        new Map(),
        false
      );
      
      // Should detect root principals without conditions (validation should fail)
      expect(typeof success).toBe('boolean');
      expect(success).toBe(false);
      expect(failedRules(path.join(outputDir, 'resource-policy-test.xml'))).toContain('RESOURCE_POLICY_ROOT_PRINCIPAL_NEEDS_CONDITIONS');
    });
  });

  describe('IAM Rules', () => {
    test('IAM_NO_WILDCARD_ACTIONS - should detect wildcard actions in IAM policies', async () => {
      // Process the rule's own fixtures; no template in test/templates uses a wildcard action
      preprocessTemplates(path.join(ruleFixturesDir, 'iam/iam-no-wildcard-actions'), outputDir);
      
      // Run validation with IAM rules
      const success = await runCfnGuardValidation(
        outputDir,
        path.join(rulesDir, 'iam/'),
        path.join(outputDir, 'iam-test.xml'),
        'IAM',
        new Map(),
        false
      );
      
      // Should detect IAM violations (validation should fail)
      expect(typeof success).toBe('boolean');
      expect(success).toBe(false);
      expect(failedRules(path.join(outputDir, 'iam-test.xml'))).toContain('IAM_NO_WILDCARD_ACTIONS');
    });

    describe('IAM_NO_WORLD_ACCESSIBLE_TRUST_POLICY', () => {
      const worldAccessibleTemplate = path.join(templatesDir, 'world-accessible-trust-policy.template.json');
      const compliantIntrinsicTemplate = path.join(templatesDir, 'compliant-intrinsic-trust-policy.template.json');

      test('Static: should detect Principal: "*" in trust policies', async () => {
        // Run validation directly on static template (no preprocessing)
        const success = await runCfnGuardValidation(
          worldAccessibleTemplate,
          path.join(rulesDir, 'iam/iam-no-world-accessible-trust-policy.guard'),
          path.join(outputDir, 'world-accessible-static-test.xml'),
          'World Accessible Static',
          new Map(),
          false
        );
        
        // Should detect world-accessible trust policies (validation should fail)
        expect(success).toBe(false);
        expect(failedRules(path.join(outputDir, 'world-accessible-static-test.xml'))).toContain('IAM_NO_WORLD_ACCESSIBLE_TRUST_POLICY');
      });

      test('Resolved: should detect Principal: "*" after intrinsic resolution', async () => {
        // Process templates to resolve intrinsic functions
        preprocessTemplates(templatesDir, outputDir);
        
        // Run validation on resolved template
        const success = await runCfnGuardValidation(
          path.join(outputDir, 'world-accessible-trust-policy.template.json'),
          path.join(rulesDir, 'iam/iam-no-world-accessible-trust-policy.guard'),
          path.join(outputDir, 'world-accessible-resolved-test.xml'),
          'World Accessible Resolved',
          new Map(),
          false
        );
        
        // Should detect world-accessible trust policies (validation should fail)
        expect(success).toBe(false);
        expect(failedRules(path.join(outputDir, 'world-accessible-resolved-test.xml'))).toContain('IAM_NO_WORLD_ACCESSIBLE_TRUST_POLICY');
      });

      test('Static: should not flag intrinsic functions as world-accessible', async () => {
        // Run validation on static template with intrinsic functions
        const success = await runCfnGuardValidation(
          compliantIntrinsicTemplate,
          path.join(rulesDir, 'iam/iam-no-world-accessible-trust-policy.guard'),
          path.join(outputDir, 'compliant-intrinsic-static-test.xml'),
          'Compliant Intrinsic Static',
          new Map(),
          true
        );
        
        // Should pass - intrinsic functions are not "*"
        expect(success).toBe(true);
      });

      test('Resolved: should pass when intrinsic functions resolve to valid ARNs', async () => {
        // Process templates to resolve intrinsic functions
        // Fn::GetAtt resolves to "arn:aws:iam::123456789012:role/OtherRole"
        // Fn::Sub resolves to "arn:aws:iam::123456789012:root"
        preprocessTemplates(templatesDir, outputDir);
        
        // Run validation on resolved template
        const success = await runCfnGuardValidation(
          path.join(outputDir, 'compliant-intrinsic-trust-policy.template.json'),
          path.join(rulesDir, 'iam/iam-no-world-accessible-trust-policy.guard'),
          path.join(outputDir, 'compliant-intrinsic-resolved-test.xml'),
          'Compliant Intrinsic Resolved',
          new Map(),
          true
        );
        
        // Should pass - resolved values are valid ARNs, not "*"
        expect(success).toBe(true);
      });
    });

    describe('IAM_NO_OVERLY_PERMISSIVE_PASSROLE', () => {
      const passroleFixturesDir = path.join(ruleFixturesDir, 'iam/iam-no-overly-permissive-passrole');
      const passroleRule = path.join(rulesDir, 'iam/iam-no-overly-permissive-passrole.guard');

      test('Static: should not flag a PassRole scoped to a list of Fn::GetAtt role ARNs', async () => {
        // The EKS FargateCluster creation-role pattern (aws/aws-cdk#39501): a resource list of
        // intrinsic objects is correctly scoped and must pass without intrinsic resolution.
        const success = await runCfnGuardValidation(
          path.join(passroleFixturesDir, 'compliant-intrinsic-arn-list.json'),
          passroleRule,
          path.join(outputDir, 'passrole-intrinsic-list-static-test.xml'),
          'PassRole Intrinsic List Static',
          new Map(),
          true,
        );

        // Should pass - a list of intrinsic ARNs is not a wildcard
        expect(success).toBe(true);
      });

      test('Static: should not flag a PassRole scoped to a single specific ARN', async () => {
        const success = await runCfnGuardValidation(
          path.join(passroleFixturesDir, 'compliant-single-arn.json'),
          passroleRule,
          path.join(outputDir, 'passrole-single-arn-static-test.xml'),
          'PassRole Single Arn Static',
          new Map(),
          true,
        );

        // Should pass - a single specific ARN is not a wildcard
        expect(success).toBe(true);
      });

      test('Static: should flag a PassRole with Resource "*"', async () => {
        const success = await runCfnGuardValidation(
          path.join(passroleFixturesDir, 'non-compliant-wildcard.json'),
          passroleRule,
          path.join(outputDir, 'passrole-wildcard-static-test.xml'),
          'PassRole Wildcard Static',
          new Map(),
          false,
        );

        // Should fail - a bare "*" resource lets any role be passed
        expect(success).toBe(false);
        expect(failedRules(path.join(outputDir, 'passrole-wildcard-static-test.xml'))).toContain('IAM_NO_OVERLY_PERMISSIVE_PASSROLE');
      });

      test('Static: should flag a PassRole whose resource list contains "*"', async () => {
        const success = await runCfnGuardValidation(
          path.join(passroleFixturesDir, 'non-compliant-wildcard-in-list.json'),
          passroleRule,
          path.join(outputDir, 'passrole-wildcard-in-list-static-test.xml'),
          'PassRole Wildcard In List Static',
          new Map(),
          false,
        );

        // Should fail - a "*" element is a wildcard even next to a scoped intrinsic ARN
        expect(success).toBe(false);
        expect(failedRules(path.join(outputDir, 'passrole-wildcard-in-list-static-test.xml'))).toContain('IAM_NO_OVERLY_PERMISSIVE_PASSROLE');
      });

      test('Resolved: should not flag the intrinsic ARN list after resolution', async () => {
        // After preprocessing, the Fn::GetAtt list resolves to concrete role ARNs; still not a wildcard.
        preprocessTemplates(passroleFixturesDir, outputDir);

        const success = await runCfnGuardValidation(
          path.join(outputDir, 'compliant-intrinsic-arn-list.json'),
          passroleRule,
          path.join(outputDir, 'passrole-intrinsic-list-resolved-test.xml'),
          'PassRole Intrinsic List Resolved',
          new Map(),
          true,
        );

        // Should pass - resolved values are valid ARNs, not "*"
        expect(success).toBe(true);
      });

      test('Static: should not flag an inline-policy PassRole scoped to a list of Fn::GetAtt role ARNs', async () => {
        // Covers the Properties.Policies[*].PolicyDocument branch, which cfn-guard evaluates
        // independently of the Properties.PolicyDocument path.
        const success = await runCfnGuardValidation(
          path.join(passroleFixturesDir, 'compliant-inline-policy-intrinsic-arn-list.json'),
          passroleRule,
          path.join(outputDir, 'passrole-inline-intrinsic-list-static-test.xml'),
          'PassRole Inline Intrinsic List Static',
          new Map(),
          true,
        );

        // Should pass - a list of intrinsic ARNs on the inline-policy path is not a wildcard
        expect(success).toBe(true);
      });

      test('Static: should flag an inline-policy PassRole whose resource list contains "*"', async () => {
        const success = await runCfnGuardValidation(
          path.join(passroleFixturesDir, 'non-compliant-inline-policy-wildcard-in-list.json'),
          passroleRule,
          path.join(outputDir, 'passrole-inline-wildcard-in-list-static-test.xml'),
          'PassRole Inline Wildcard In List Static',
          new Map(),
          false,
        );

        // Should fail - a "*" element is a wildcard on the inline-policy path too
        expect(success).toBe(false);
        expect(failedRules(path.join(outputDir, 'passrole-inline-wildcard-in-list-static-test.xml'))).toContain('IAM_NO_OVERLY_PERMISSIVE_PASSROLE');
      });
    });
  });


  describe('Template Processing', () => {
    test('should successfully process all existing templates', () => {
      // Process all existing templates in test/templates
      const { files: processedFiles, mapping } = preprocessTemplates(templatesDir, outputDir);
      
      // Should process all template files
      expect(processedFiles.length).toBeGreaterThan(0);
      
      // Check that resolved templates exist
      processedFiles.forEach(file => {
        expect(fs.existsSync(path.join(outputDir, file))).toBe(true);
      });
      
      // Verify file mapping is created correctly
      expect(mapping.size).toBeGreaterThan(0);
      for (const [resolvedPath, originalPath] of mapping.entries()) {
        expect(resolvedPath).toContain(outputDir);
        expect(originalPath).toContain(templatesDir);
      }
    });
  });

  describe('IAM Role Root Principal Conditions Rules', () => {
    test('IAM_ROLE_ROOT_PRINCIPAL_NEEDS_CONDITIONS - should detect root principals without restrictive conditions', async () => {
      // Process existing templates that may contain IAM roles with root principals
      preprocessTemplates(templatesDir, outputDir);
      
      // Run validation with IAM root principal rule
      const success = await runCfnGuardValidation(
        outputDir,
        path.join(rulesDir, 'iam/iam-role-root-principal-needs-conditions.guard'),
        path.join(outputDir, 'root-principal-test.xml'),
        'Root Principal',
        new Map(),
        false
      );
      
      // Should detect root principals without conditions (validation should fail)
      expect(typeof success).toBe('boolean');
      expect(success).toBe(false);
      expect(failedRules(path.join(outputDir, 'root-principal-test.xml'))).toContain('IAM_ROLE_ROOT_PRINCIPAL_NEEDS_CONDITIONS');
    });
  });

  describe('Compliant Templates', () => {
    const compliantTemplate = path.join(templatesDir, 'compliant-secure.template.json');

    test('should pass validation with compliant IAM role', async () => {
      // Run validation with trust scope rules on compliant template
      const success = await runCfnGuardValidation(
        compliantTemplate,
        path.join(rulesDir, 'iam/iam-role-no-broad-principals.guard'),
        path.join(outputDir, 'compliant-trust-test.xml'),
        'Compliant Trust',
        new Map(),
        true
      );
      
      // Should pass validation (no violations found)
      expect(typeof success).toBe('boolean');
      expect(success).toBe(true);
    });


    test('should pass validation with compliant EBS volume', async () => {
      // Run validation with EC2 rules on compliant template
      const success = await runCfnGuardValidation(
        compliantTemplate,
        path.join(rulesDir, 'ec2/ec2-ebs-encryption-enabled.guard'),
        path.join(outputDir, 'compliant-ebs-test.xml'),
        'Compliant EBS',
        new Map(),
        true
      );
      
      // Should pass validation (encryption enabled)
      expect(typeof success).toBe('boolean');
      expect(success).toBe(true);
    });
  });

  describe('XML Post-Processing', () => {
    test('should correctly post-process XML with file mapping for successful tests', async () => {
      const fileMapping = new Map([
        [path.resolve(templatesDir, 'compliant-secure.template.json'), 'packages/compliant-secure.template.json']
      ]);

      const success = await runCfnGuardValidation(
        path.join(templatesDir, 'compliant-secure.template.json'),
        path.join(rulesDir, 'iam/iam-role-no-broad-principals.guard'),
        path.join(outputDir, 'xml-success-test.xml'),
        'Success Type',
        fileMapping,
        true
      );

      expect(success).toBe(true);
      
      // Verify XML file exists and testsuite name is replaced
      const xmlContent = fs.readFileSync(path.join(outputDir, 'xml-success-test.xml'), 'utf8');
      expect(xmlContent).toContain('name="packages/compliant-secure.template.json"');
      expect(xmlContent).toContain('file="packages/compliant-secure.template.json"');
    });

    test('should correctly post-process XML with file mapping for failing tests', async () => {
      // Process templates to create files that will fail validation
      preprocessTemplates(templatesDir, outputDir);
      
      const fileMapping = new Map([
        [path.resolve(outputDir, 'CMCMK-Stack.template.json'), 'src/CMCMK-Stack.template.json'],
        [path.resolve(outputDir, 'StagingStack-default-resourcesmax-ACCOUNT-REGION.template.json'), 'src/StagingStack.template.json']
      ]);

      const success = await runCfnGuardValidation(
        outputDir,
        path.join(rulesDir, 'iam/iam-role-no-broad-principals.guard'),
        path.join(outputDir, 'xml-failure-test.xml'),
        'Failure Type',
        fileMapping,
        true
      );

      expect(success).toBe(false);
      
      // Verify XML file exists and testsuite names are replaced
      const xmlContent = fs.readFileSync(path.join(outputDir, 'xml-failure-test.xml'), 'utf8');
      expect(xmlContent).toContain('name="src/CMCMK-Stack.template.json"');
      expect(xmlContent).toContain('<failure message="[Type: Failure Type] IAM role trust policy must not use broadly scoped principals. Remove &apos;*&apos; from Principal and scope to specific accounts or roles.">');
    });

    test('should correctly post-process XML with enhanceXml disabled', async () => {
      // Process templates to create files that will fail validation
      preprocessTemplates(templatesDir, outputDir);
      
      const fileMapping = new Map([
        [path.resolve(outputDir, 'CMCMK-Stack.template.json'), 'src/CMCMK-Stack.template.json'],
        [path.resolve(outputDir, 'StagingStack-default-resourcesmax-ACCOUNT-REGION.template.json'), 'src/StagingStack.template.json']
      ]);

      const success = await runCfnGuardValidation(
        outputDir,
        path.join(rulesDir, 'iam/iam-role-no-broad-principals.guard'),
        path.join(outputDir, 'xml-failure-test.xml'),
        'Failure Type',
        fileMapping,
        false
      );

      expect(success).toBe(false);
      
      // Verify XML file exists and testsuite names are replaced
      const xmlContent = fs.readFileSync(path.join(outputDir, 'xml-failure-test.xml'), 'utf8');
      expect(xmlContent).toContain('name="src/CMCMK-Stack.template.json"');
      expect(xmlContent).toContain('<failure message="[Type: Failure Type] IAM_ROLE_NO_BROAD_PRINCIPALS">');
      expect(xmlContent).toContain('##ERROR:IAM role trust policy must not use broadly scoped principals. Remove &apos;*&apos; from Principal and scope to specific accounts or roles.##');
    });
  });
});
