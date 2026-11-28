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

```text
rules/
├── documentdb/
│   └── documentdb-encryption-enabled.guard
├── ec2/
│   ├── ec2-ebs-encryption-enabled.guard
│   └── ec2-no-open-security-groups.guard
├── guard-hooks/
│   └── guardhooks-no-root-principals-except-kms-secrets.guard
├── iam/
│   ├── iam-no-overly-permissive-passrole.guard
│   ├── iam-no-wildcard-actions.guard
│   ├── iam-no-wildcard-actions-inline.guard
│   ├── iam-no-world-accessible-trust-policy.guard
│   ├── iam-policy-no-broad-principals.guard
│   ├── iam-role-no-broad-principals.guard
│   └── iam-role-root-principal-needs-conditions.guard
├── kinesis/
│   └── kinesis-firehose-encryption-enabled.guard
├── neptune/
│   └── neptune-encryption-enabled.guard
├── redshift/
│   └── redshift-encryption-enabled.guard
├── s3/
│   ├── s3-no-confused-deputy.guard
│   ├── s3-no-world-readable.guard
│   ├── s3-no-world-writable.guard
│   └── s3-secure-transport.guard
├── sns/
│   ├── sns-no-world-accessible.guard
│   └── sns-no-world-accessible-inline.guard
└── sqs/
    ├── sqs-encryption-enabled.guard
    ├── sqs-no-world-accessible.guard
    └── sqs-no-world-accessible-inline.guard
```

### Always Flagged (High Risk)

- **Cross-account wildcards**: `"*"` or `"arn:aws:iam::*:root"`
- **Root principals without conditions**: `:root` principals must have restrictive conditions
- **Broad principals in sensitive resources**: IAM roles, S3 buckets, etc.

### Smart Exemptions (Configurable)

- **AWS KMS default policies**: Standard root access for IAM integration
- **Individual rule control**: Enable/disable specific rules per service
- **Metadata-based suppression**: Use CDK metadata to suppress specific rules

### Conditions on `"*"` principals

S3_NO_WORLD_READABLE, S3_NO_WORLD_WRITABLE, SNS_NO_WORLD_ACCESSIBLE, SNS_NO_WORLD_ACCESSIBLE_INLINE, SQS_NO_WORLD_ACCESSIBLE and SQS_NO_WORLD_ACCESSIBLE_INLINE fail every `Allow` statement with a `"*"` principal. The tool reads each statement's `Condition` in the committed template, before intrinsics are resolved. Both reports show such a rule as passed for a template when every failed check of the rule is on the `Principal` of a statement whose `Condition` limits it to fixed values. Any other failure stays in the reports.

A statement of an `AWS::S3::BucketPolicy`, `AWS::SNS::TopicPolicy`, `AWS::SNS::TopicInlinePolicy`, `AWS::SQS::QueuePolicy` or `AWS::SQS::QueueInlinePolicy` is limited when it has `Effect: Allow`, a `Principal`, no `NotPrincipal`, and at least one `Condition` entry where all of these hold:

- **Operator:** `StringEquals`, `StringEqualsIgnoreCase`, `StringLike`, `ArnEquals` or `ArnLike`, alone or after `ForAnyValue:`, in this letter case. The `...IfExists` forms, `ForAllValues:`, negated operators, `Null`, `Bool` and `IpAddress` do not count.
- **Key:** one of `aws:PrincipalOrgID`, `aws:SourceArn`, `aws:SourceVpc`, `aws:SourceVpce`, `aws:SourceOwner`, `aws:SourceAccount`, `aws:userid`, `s3:DataAccessPointArn` and `s3:DataAccessPointAccount`, in any letter case. The list follows the bucket policy section of [The meaning of "public"](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html#access-control-block-public-access-policy-status) in the Amazon S3 User Guide, without `aws:SourceIp` and with `aws:PrincipalOrgID` as its one principal key.
- **Value:** one value or a non-empty list, where every string that any element can produce is fixed: not empty, at most 65,536 characters long, and without `*`, `?`, `${` or `{{resolve:`. For `aws:userid`, a string is fixed only as literal text, without any of the deploy-time values below, and `anonymous` in any letter case is not fixed.

Other entries of the `Condition` do not change the result, since IAM combines operators and keys with AND.

Intrinsic functions produce these values:

- `Fn::If` produces both branches. `Fn::FindInMap` produces every entry of the template's map that its keys can select (a literal key selects one entry, any other key selects all), and its `DefaultValue`. `Fn::Select` produces every element of its list, whatever the index. `Fn::Split`, `Fn::Join` and `Fn::Sub` produce every string their arguments can give; `${!Name}` in `Fn::Sub` writes the text `${Name}`.
- A `Ref` to a parameter produces its `AllowedValues`. A parameter without `AllowedValues` is not fixed, whatever its `Default`, and neither is one whose `Type` starts with `AWS::SSM::Parameter::`.
- Not fixed: `Ref` to `AWS::NoValue` or to a name the template does not define, an `Fn::Sub` variable the template does not define, any other intrinsic function or object, numbers, booleans, `null`, a list inside the list, a value that produces more than 256 strings, and any value judged once the template has used up its fixed amount of judging work (one million steps), which a value that expands far beyond its size in the template uses up.

Except for `aws:userid`, these deploy-time values are taken as fixed without being checked: a `Ref` to a resource of the template, `Fn::GetAtt` of such a resource, `Fn::ImportValue`, and the pseudo parameters `AWS::AccountId`, `AWS::Partition`, `AWS::Region`, `AWS::StackId`, `AWS::StackName` and `AWS::URLSuffix`. Inside `Fn::Join` and `Fn::Sub` they stand for text without `*`, `?` or `${`, and each counts as 4,096 characters, the largest a parameter value or a custom resource response can be, toward the 65,536-character limit.

These still fail:

- `aws:SourceIp` and keys outside the list, such as `aws:SourceVpcArn`, `aws:PrincipalAccount` and `aws:PrincipalArn`.
- A wildcard access point name in `s3:DataAccessPointArn`, and an `aws:userid` value `<role ID>:*`.
- A `Ref` to a Systems Manager parameter type, and a `{{resolve:…}}` dynamic reference.
- A number or boolean value, such as an unquoted account ID.
- An `Fn::If` with a wildcard in either branch: CloudFormation `Conditions` are not evaluated.
- An `Allow` statement with `NotPrincipal`, whatever its `Condition`.

The template is read as `JSON.parse` reads it, which keeps the last of duplicate keys. A template that `JSON.parse` rejects, that has a logical ID that is not alphanumeric, or that the preprocessor cannot write a resolved copy of, gets no verdicts. When a test case still fails, its failure text can also quote checks of a limited statement in the same policy.

The locations of failed checks come from a second cfn-guard run with structured JSON output. The workflows install cfn-guard `releases/latest`; if that output changes form, the failures stay in the reports, and the tests, written against cfn-guard 3.2.1, fail.

---

## Inputs (GitHub Action)

| Name            | Description                                               | Required | Default       |
| --------------- | --------------------------------------------------------- | -------- | ------------- |
| `rule_set_path` | Local path to the cfn-guard rules file                    | Yes      | N/A           |
| `base_sha`      | Commit SHA to compare against                             | No       | `origin/main` |
| `head_sha`      | The commit SHA for the head branch or PR                  | No       | `HEAD`        |
| `enhance_xml`   | Enable XML enhancement for individual failure annotations | No       | `true`        |

## Outputs (GitHub Action)

| Name          | Description                             |
| ------------- | --------------------------------------- |
| `junit_files` | Comma-separated list of JUnit XML files |
| `all_passed`  | Whether all validations passed          |

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
>
> - `--base_sha=origin/main`  
> - `--rule_set_path=./custom-rules`

### 3. Run Tests

The tests run the rules with [cfn-guard](https://github.com/aws-cloudformation/cloudformation-guard), so install cfn-guard 3 and put it on your `PATH` first.

```bash
yarn test
```

Every rule in `rules/` needs two fixtures in `test/rule-fixtures/<rule path without .guard>/`: `non-compliant.json`, which the rule must fail, and `compliant.json`, which the rule must evaluate and pass. The tests fail for a rule that has no fixtures.

A rule can also have `compliant-<name>.json` and `non-compliant-<name>.json` fixtures, checked like the base pair, where `<name>` is lowercase letters, digits and hyphens, with no leading, trailing or doubled hyphen. Any other file under `test/rule-fixtures/`, except hidden files, fails the tests, as does a fixture outside a rule's directory.

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

When `enhance_xml` is enabled, the tool enhances CFN Guard failure messages by:

- Extracting human-readable error descriptions from custom `<<##ERROR:...##>>` annotations in guard rules
- Replacing the raw rule name with an actionable message that explains what's wrong and how to fix it
- Splitting concatenated failure details into individual violations
- Prefixing each failure with the validation type (e.g., `[Type: Static]` or `[Type: Resolved]`)

Each guard rule includes a custom error annotation using cfn-guard's `<<...>>` syntax:

```
<<##ERROR:EBS volume must have encryption enabled. Set 'Encrypted' to true.##>>
```

**Before (Raw CFN Guard Output):**

```xml
<failure message="EBS_ENCRYPTION_ENABLED for Type: Static">Check was not compliant as property [Properties.Encrypted] is missing.</failure>
```

**After (Enhanced Format):**

```xml
<failure message="[Type: Static] EBS volume must have encryption enabled. Set 'Encrypted' to true.">
Check was not compliant as property [Properties.Encrypted] is missing.</failure>
```

---

## Suppressing Rules

For integration tests or specific resources that generate false positives, you can suppress individual rules using CloudFormation resource metadata. The suppression must be added to the **L1 (CfnResource)** construct to appear in the synthesized CloudFormation template.

### Method 1: Using CfnResource.addMetadata() (Recommended)

```typescript
import { SecurityGroup, Vpc, Peer, Port } from 'aws-cdk-lib/aws-ec2';
import { Stack, StackProps, CfnResource } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class MyTestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'Vpc');
    const securityGroup = new SecurityGroup(this, 'SecurityGroup', { vpc });
    
    // Add ingress rule that would normally trigger security alert
    securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(80));

    // Suppress security guardian rule - get the L1 construct
    const cfnSecurityGroup = securityGroup.node.defaultChild as CfnResource;
    cfnSecurityGroup.addMetadata('guard', {
      SuppressedRules: ['EC2_NO_OPEN_SECURITY_GROUPS'],
    });
  }
}
```

### Method 2: Direct CfnResource Creation

```typescript
import { CfnSecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class MyTestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const cfnSecurityGroup = new CfnSecurityGroup(this, 'SecurityGroup', {
      groupDescription: 'Test security group',
      vpcId: 'vpc-12345',
      securityGroupIngress: [{
        ipProtocol: 'tcp',
        fromPort: 80,
        toPort: 80,
        cidrIp: '0.0.0.0/0',
      }],
    });

    // Add suppression metadata
    cfnSecurityGroup.addMetadata('guard', {
      SuppressedRules: ['EC2_NO_OPEN_SECURITY_GROUPS'],
    });
  }
}
```

### How It Works

The suppression metadata appears in the synthesized CloudFormation template:

```json
{
  "Resources": {
    "SecurityGroup": {
      "Type": "AWS::EC2::SecurityGroup",
      "Properties": {
        "GroupDescription": "Test security group",
        "SecurityGroupIngress": [
          {
            "IpProtocol": "tcp",
            "FromPort": 80,
            "ToPort": 80,
            "CidrIp": "0.0.0.0/0"
          }
        ]
      },
      "Metadata": {
        "guard": {
          "SuppressedRules": [
            "EC2_NO_OPEN_SECURITY_GROUPS"
          ]
        }
      }
    }
  }
}
```

The cfn-guard rules check for this metadata and skip validation for suppressed rules:

```guard
let security_groups = Resources.*[
  Type == 'AWS::EC2::SecurityGroup'
  Metadata.guard.SuppressedRules not exists or
  Metadata.guard.SuppressedRules.* != "EC2_NO_OPEN_SECURITY_GROUPS"
]
```

### Important Notes

- **Suppressions must be added to L1 constructs** (CfnResource) to appear in CloudFormation templates
- Using `construct.node.addMetadata()` on L2 constructs will NOT work - use `construct.node.defaultChild` to get the L1
- After adding suppressions, **regenerate integration test snapshots** by running the tests
- Commit the updated snapshot templates so Security Guardian can read them from git history

**Available Rules to Suppress:**

- `EC2_NO_OPEN_SECURITY_GROUPS`
- `S3_ENCRYPTION_ENABLED`
- `S3_NO_WORLD_READABLE`
- `S3_SECURE_TRANSPORT`
- `IAM_ROLE_NO_BROAD_PRINCIPALS`
- `IAM_ROLE_ROOT_PRINCIPAL_NEEDS_CONDITIONS`
- `IAM_NO_WILDCARD_ACTIONS`
- `IAM_NO_WORLD_ACCESSIBLE_TRUST_POLICY`
- `NO_ROOT_PRINCIPALS_EXCEPT_KMS_SECRETS`
- `EBS_ENCRYPTION_ENABLED`
- `DOCUMENTDB_ENCRYPTION_ENABLED`
- `SNS_ENCRYPTION_ENABLED`
- `SQS_ENCRYPTION_ENABLED`
- And others (see individual `.guard` files in service subdirectories)

---

## Acknowledgments

Built with care on top of [cfn-guard](https://github.com/aws-cloudformation/cloudformation-guard) and the [GitHub Actions Toolkit](https://github.com/actions/toolkit).

---

Happy Guarding!
