# Security Guardian

A GitHub Action and CLI tool that helps detect broadly scoped IAM principals in CloudFormation templates by:

- Validating **changed** `*.template.json` files in pull requests using custom [cfn-guard v3](https://github.com/aws-cloudformation/cloudformation-guard) rules.
- Detecting **broadly scoped IAM principals** using CloudFormation **intrinsic functions** (e.g., `Fn::Join` with `:root`).

---

## Features

 Validates **only changed** templates in a PR  
 Supports **cfn-guard v3** with rule sets  
 Scans for **broad IAM principals using intrinsics**  
 Runs locally and in GitHub Actions  
 Outputs human-readable and machine-parsable summaries

---

## Inputs (GitHub Action)

| Name             | Description                                          | Required | Default               |
|------------------|------------------------------------------------------|----------|-----------------------|
| `rule_set_path`  | Local path to the cfn-guard rules file               | Yes      |                       |
| `show_summary`   | Show summary (`fail`, `warn`, or `none`)             | No       | `fail`                |
| `output_format`  | Output format (`single-line-summary`, `json`, etc.)  | No       | `single-line-summary` |
| `base_sha`       | Commit SHA to compare against                        | No       | `origin/main`         |
| `head_sha`       | The commit SHA for the head (current) branch or PR   | No       | `HEAD`                |

---

## Usage (GitHub Action)

```yaml
- name: Run Security Guardian
  uses: ./tools/@aws-cdk/security-guardian
  with:
    rule_set_path: './tools/@aws-cdk/security-guardian/rules'
    show_summary: 'fail'
    output_format: 'single-line-summary'
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
