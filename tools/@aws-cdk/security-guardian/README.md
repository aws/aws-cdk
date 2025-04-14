# Security Guardian

A GitHub Action tool designed to 
 - detect broadly scoped inline policies in `*.template.json` files in incoming PRs and validate changed AWS CloudFormation templates against custom [cfn-guard](https://github.com/aws-cloudformation/cloudformation-guard) rules. Supports local paths for custom rule sets.
 - [in future] detect broadly scoped CFN intrinsic statements

---

## 🚀 Features

- Validates only changed `*.template.json` files in PRs
- Supports `cfn-guard v3`
- Accepts rules from a local file or remote URL
- Outputs validation results in summary format

---

## 📦 Inputs

| Name             | Description                                                       | Required | Default |
|------------------|-------------------------------------------------------------------|----------|---------|
| `data_directory` | Directory containing templates to validate                        | Yes   |         |
| `rule_file_path` | Local path to the rules file                                     | Yes    |         |
| `show_summary`   | Whether to show summary output (`fail`, `warn`, `none`)          | No    | `fail`  |
| `output_format`  | Output format (`single-line-summary`, `json`, etc.)              | No    | `single-line-summary` |

> `data_directory` and `rule_file_path` must be set.

---

## Usage

```yaml
- name: Run CFN Guard
  uses: ./tools/@aws-cdk/security-guardian
  with:
    data_directory: './changed_templates'
    rule_set_path: './tools/@aws-cdk/security-guardian/rules/trust_scope_rules.guard'
    show_summary: 'fail'
    output_format: 'single-line-summary'
```

---

## Local Development

### 1. Build
```bash
npm install
npm run build
```

### 2. Run Locally
```bash
node dist/index.js \
  --data_directory=./changed_templates \
  --rule_file_path=./rules.guard \
  --output_format=single-line-summary \
  --show_summary=fail
```
---

## Contributing

PRs are welcome! Please follow conventional commit messages and test your changes before opening a pull request.

---

## Acknowledgments

Built on top of [cfn-guard](https://github.com/aws-cloudformation/cloudformation-guard) and [GitHub Actions Toolkit](https://github.com/actions/toolkit).

---

Happy Guarding! 

