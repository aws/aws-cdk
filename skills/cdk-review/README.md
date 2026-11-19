# CDK review skills

Skills for reviewing changes to AWS CDK code, locally or on a pull request, with any agent.

| Skill | Reviews |
|---|---|
| [`cdk-review-principles`](./cdk-review-principles/SKILL.md) | The shared base the other five apply: severity, evidence and finding format |
| [`cdk-regression-review`](./cdk-regression-review/SKILL.md) | Regressions and breaking changes |
| [`cdk-construct-design-review`](./cdk-construct-design-review/SKILL.md) | Construct and API design |
| [`cdk-security-review`](./cdk-security-review/SKILL.md) | Security exposure: IAM, network access, secrets and secure defaults |
| [`cdk-testing-review`](./cdk-testing-review/SKILL.md) | Test coverage a change needs |
| [`cdk-documentation-review`](./cdk-documentation-review/SKILL.md) | Documentation: JSDoc, README examples and required docs |

The skills follow the aws-cdk [contributor guide](../../CONTRIBUTING.md),
[`AGENTS.md`](../../AGENTS.md) and [construct design guidelines](../../docs/AGENTS_CONSTRUCT_DESIGN.md).

## Install

Install all six together, because the other five apply `cdk-review-principles`.

```sh
npx skills add aws/aws-cdk --skill '*' -g
```

`-g` installs for your user instead of into the current directory. From an aws-cdk checkout:

```sh
npx skills add ./skills/cdk-review --skill '*' -g
```

The skills ask your agent to check AWS facts against AWS documentation before it reports them.
If your agent has no AWS documentation tool, set up the
[AWS MCP Server](https://docs.aws.amazon.com/agent-toolkit/latest/userguide/getting-started-aws-mcp-server.html).
