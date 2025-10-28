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

### Always Flagged (High Risk)
- **Cross-account wildcards**: `"*"` or `"arn:aws:iam::*:root"`
- **Custom policies with root access**: Non-default policies granting root
- **Broad principals in sensitive resources**: IAM roles, S3 buckets, etc.

### Smart Exemptions (Configurable)
- **AWS KMS default policies**: Standard root access for IAM integration
- **Extensible for other services**: Easy to add S3, SNS, etc.

### Adding New Exemptions
```typescript
const EXEMPTION_RULES = {
  'AWS::KMS::Key': { /* existing */ },
  'AWS::S3::Bucket': {
    docs: 'https://docs.aws.amazon.com/s3/latest/userguide/bucket-policies.html',
    isDefaultPolicy: (statement) => /* your logic */
  }
};
```

---

## Inputs (GitHub Action)

| Name                      | Description                                          | Required | Default               |
|---------------------------|------------------------------------------------------|----------|-----------------------|
| `rule_set_path`           | Local path to the cfn-guard rules file               | No       | `./rules`             |
| `show_summary`            | Show summary (`none`, `all`, `pass`, `fail`, `skip`) | No       | `fail`                |
| `output_format`           | Output format (`single-line-summary`, `json`, etc.)  | No       | `single-line-summary` |
| `base_sha`                | Commit SHA to compare against                        | No       | `origin/main`         |
| `head_sha`                | The commit SHA for the head (current) branch or PR   | No       | `HEAD`                |
| `enable_intrinsic_scanner`| Enable intrinsic scanner for resolved CF values      | No       | `false`               |

---

## Usage (GitHub Action)

```yaml
- name: Run Security Guardian
  uses: ./tools/@aws-cdk/security-guardian
  with:
    rule_set_path: './tools/@aws-cdk/security-guardian/rules'
    show_summary: 'fail'
    output_format: 'single-line-summary'
    enable_intrinsic_scanner: 'true'  # Optional: Enable intrinsic scanning
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
> - `--output_format=json`  
> - `--show_summary=warn`
> - `--enable_intrinsic_scanner=true`

---

## Output

In addition to validation results from `cfn-guard`, the tool logs detailed findings from the intrinsic scan (if applicable), such as:

```
detailed_output File: changed_templates/example.template.json
{
  "Action": "kms:*",
  "Effect": "Allow",
  "Principal": {
    "AWS": {
      "Fn::Join": [
        "",
        ["arn:", { "Ref": "AWS::Partition" }, ":iam::", { "Ref": "AWS::AccountId" }, ":root"]
      ]
    }
  },
  "Resource": "*"
}
```

---

## Acknowledgments

Built with care on top of [cfn-guard](https://github.com/aws-cloudformation/cloudformation-guard) and the [GitHub Actions Toolkit](https://github.com/actions/toolkit).

---

Happy Guarding!
