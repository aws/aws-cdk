# Security Guardian

A GitHub Action and CLI tool that helps detect broadly scoped IAM principals in CloudFormation templates by:

- Validating **changed** `*.template.json` files in pull requests using custom [cfn-guard v3](https://github.com/aws-cloudformation/cloudformation-guard) rules.
- Detecting **broadly scoped IAM principals** using CloudFormation **intrinsic functions** (e.g., `Fn::Join` with `:root`).
- **Cross-account wildcard detection** - Flags dangerous patterns like `"*"` or `"arn:aws:iam::*:root"`.
- **Extensible exemption system** - Smart exemptions for AWS service default policies.

---

## Features

 Validates **only changed** templates in a PR  
 Supports **cfn-guard v3** with rule sets  
 Scans for **broad IAM principals using intrinsics**  
 **Flags cross-account wildcards** - Always dangerous  
 **Extensible exemptions** for AWS service defaults  
 **Future-proof validation** - Detects when AWS changes default policies  
 Runs locally and in GitHub Actions  
 Outputs human-readable and machine-parsable summaries

---

## Security Checks

### Rule Organization
Guard rules are organized in service-specific directories for granular control:

```
rules/
├── codepipeline/
│   └── cross-account-role-trust-scope.guard
├── documentdb/
│   └── encryption-enabled.guard
├── ec2/
│   ├── ebs-encryption-enabled.guard
│   └── no-open-security-groups.guard
├── guard-hooks/
│   └── no-root-principals-except-kms-secrets.guard
├── iam/
│   ├── no-overly-permissive-passrole.guard
│   ├── no-wildcard-actions.guard
│   ├── no-world-accessible-trust-policy.guard
│   ├── policy-no-broad-principals.guard
│   └── role-no-broad-principals.guard
├── s3/
│   ├── encryption-enabled.guard
│   ├── no-world-readable.guard
│   └── secure-transport.guard
└── [other services...]
```

### Always Flagged (High Risk)
- **Cross-account wildcards**: `"*"` or `"arn:aws:iam::*:root"`
- **Custom policies with root access**: Non-default policies granting root
- **Broad principals in sensitive resources**: IAM roles, S3 buckets, etc.

### Smart Exemptions (Configurable)
- **AWS KMS default policies**: Standard root access for IAM integration
- **Individual rule control**: Enable/disable specific rules per service
- **Metadata-based suppression**: Use CDK metadata to suppress specific rules

---

## Inputs (GitHub Action)

| Name            | Description                               | Required | Default       |
|-----------------|-------------------------------------------|----------|---------------|
| `rule_set_path` | Local path to the cfn-guard rules file   | Yes      | N/A           |
| `base_sha`      | Commit SHA to compare against             | No       | `origin/main` |
| `head_sha`      | The commit SHA for the head branch or PR | No       | `HEAD`        |
| `enhance_xml`   | Enable XML enhancement for individual failure annotations | No | `true` |

## Outputs (GitHub Action)

| Name         | Description                               |
|--------------|-------------------------------------------|
| `junit_files`| Comma-separated list of JUnit XML files  |
| `all_passed` | Whether all validations passed            |

---

## Usage (GitHub Action)

```yaml
- name: Run Security Guardian
  id: security-guardian
  uses: ./tools/@aws-cdk/security-guardian
  with:
    rule_set_path: './tools/@aws-cdk/security-guardian/rules'
    enhance_xml: 'true'  # Optional: Enable individual failure annotations (default: true)

- name: Publish Security Test Results
  uses: mikepenz/action-junit-report@e08919a3b1fb83a78393dfb775a9c37f17d8eea6  # v6.0.1
  if: always()
  with:
    report_paths: 'test-results/*.xml'
    check_name: 'Security Guardian Results'
    detailed_summary: true
    include_passed: true
    fail_on_failure: true
```

---

## Local Development

### 1. Install Dependencies
```bash
cd tools/@aws-cdk/security-guardian && yarn install
```

### 2. Run Locally
The tool automatically detects changed templates and validates them.

```bash
yarn security-guardian
```

> You can override defaults using:
> - `--base_sha=origin/main`  
> - `--rule_set_path=./custom-rules`

---

## Output

The tool generates JUnit XML reports that can be consumed by GitHub Actions:

- `test-results/cfn-guard-static.xml` - Results from original templates
- `test-results/cfn-guard-resolved.xml` - Results from templates with resolved intrinsics

Use `mikepenz/action-junit-report@e08919a3b1fb83a78393dfb775a9c37f17d8eea6` (v6.0.1) to display rich test results in GitHub PRs with:
- **Enhanced failure messages** - Automatically parses and formats concatenated CFN Guard failures
- **Precise line numbers** - Exact file locations for each violation
- **Resource identification** - Clear resource names and property paths
- **Rule descriptions** - Detailed explanations and remediation guidance

### Enhanced Failure Formatting

The tool automatically enhances CFN Guard failure messages by:
- Splitting concatenated failure messages into individual violations
- Extracting exact line numbers and column positions
- Identifying specific CloudFormation resources and properties
- Formatting output for better readability in CI/CD reports

**Before (Raw CFN Guard Output):**
```
IAM_NO_WILDCARD_ACTIONS_INLINE for Type: ResolvedCheck was not compliant as property [Policies[*].PolicyDocument.Statement[*]] is missing. Value traversed to [Path=/Resources/Role1/Properties[L:324,C:20]]Check was not compliant as property [Policies[*].PolicyDocument.Statement[*]] is missing. Value traversed to [Path=/Resources/Role2/Properties[L:485,C:20]]
```

**After (Enhanced Format):**
```
Rule: IAM_NO_WILDCARD_ACTIONS_INLINE (Type: Resolved)
==================================================

- Check was not compliant as property [Policies[*].PolicyDocument.Statement[*]] is missing. Value traversed to [Path=/Resources/Role1/Properties[L:324,C:20]]
- Check was not compliant as property [Policies[*].PolicyDocument.Statement[*]] is missing. Value traversed to [Path=/Resources/Role2/Properties[L:485,C:20]]
```

---

## Suppressing Rules

For integration tests or specific resources that generate false positives, you can suppress individual rules using CDK metadata:

```typescript
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class MyTestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const testBucket = new Bucket(this, 'TestBucket', {
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Suppress S3 encryption rule for integration test
    testBucket.node.addMetadata('guard', {
      SuppressedRules: ['S3_ENCRYPTION_ENABLED']
    });
  }
}
```

**Available Rules to Suppress:**
- `S3_ENCRYPTION_ENABLED`
- `IAM_ROLE_NO_BROAD_PRINCIPALS` 
- `IAM_NO_WILDCARD_ACTIONS`
- `NO_ROOT_PRINCIPALS_EXCEPT_KMS_SECRETS`
- `EBS_ENCRYPTION_ENABLED`
- `SNS_ENCRYPTION_ENABLED`
- `SQS_ENCRYPTION_ENABLED`
- And others (see individual `.guard` files in service subdirectories)

---

## Acknowledgments

Built with care on top of [cfn-guard](https://github.com/aws-cloudformation/cloudformation-guard) and the [GitHub Actions Toolkit](https://github.com/actions/toolkit).

---

Happy Guarding!
