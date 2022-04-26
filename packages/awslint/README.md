# awslint
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Developer Preview](https://img.shields.io/badge/cdk--constructs-developer--preview-informational.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are in **developer preview** before they
> become stable. We will only make breaking changes to address unforeseen API issues. Therefore,
> these APIs are not subject to [Semantic Versioning](https://semver.org/), and breaking changes
> will be announced in release notes. This means that while you may use them, you may need to
> update your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

A linter for the AWS Construct Library's API. It reflects a construct library's
module via it's `.jsii` manifest and checks that the module adheres to the [AWS
Resource Construct Design Guidelines](../../docs/DESIGN_GUIDELINES.md).

## Usage

First, the module must be built through `jsii` (the linter reads the `.jsii`
manifest).

Now, if you simply run `awslint` from a module directory, you will
see a list of diagnostic messages.

For example:

```console
$ cd @aws-cdk/aws-sns
$ npm run awslint
warning: [awslint:resource-interface:@aws-cdk/aws-sns.Subscription] every resource must have a resource interface 
warning: [awslint:resource-interface:@aws-cdk/aws-sns.TopicPolicy] every resource must have a resource interface 
```

Each diagnostics includes the following elements:

```
warning: [awslint:resource-interface:@aws-cdk/aws-sns.Subscription] every resource must have a resource interface 
[------] [-------------------------] [----------------------------] [-------------------------------------------] 
   ^              ^                                 ^                                       ^                        
   |              |                                 |                                       |                        
 level           rule                             scope                                  message                     
```

## Options and Configuration

`awslint` accepts options either through the command-line (i.e. `--debug`) or
via an `awslint` key in the module's `package.json`.

```json
{
  "awslint": {
    "debug": true
  }
}
```

## Include/Exclude

The `i`/`--include` and `-x`/`--exclude` options can be used to specify which rules will
be evaluated.

For example:

```console
# evaluate only the "resource-props" and "import" rules in all scopes
$ npm run awslint -- -i resource-props -i import

# evaluate only the "import" rule in all scopes besides ones that begin with "@aws-cdk/aws-s3"
$ npm run awslint -- -i import -x "*:@aws-cdk/aws-s3*"
```

Filters are specified using the following pattern:

    rule[*][:scope[*]]

If a `"*"` suffix is provided, the component is treated as a prefix. Otherwise,
it is evaluated as a full match.

If scope is not specified, all scopes are implied (`*`).

Examples:

* `*:*` - matches all rules in all scopes
* `*:@aws-cdk/aws-apigateway.IRestApi*` - matches all rules in scopes that begin with `@aws-cdk/aws-apigateway.IRestApi`
* `resource-props` - matches the `resource-props` rule in all scopes
* `resource-*` - matches all rules that begin with `resource-`.
* `resource-*:@aws-cdk/aws-sns*` - matches all `resource-` rules with scope that
  begins with `@aws-cdk/aws-sns`.

When a rule is excluded, it will be displayed as `skipped:` in the output and
will always considered to pass.

## Saving State

The `--save` option can be used to capture all failed linting rules and save them as `exclude`s
in the module's `package.json` file. This is useful to bootstrap the linting process and \
progressively fix errors.

```console
$ npm run awslint -- --save
[shows errors]

$ cat package.json
{
  ...
  "awslint": {
    "exclude": [
      "...", // added by awslint --save
      "...", // added by awslint --save
    ]
  }
}

$ npm run awslint
[no errors]
```

If `--save` is specified, `awslint` will always exit with status code 0.

## Output Options

* Use `--verbose` to print all passing linter rules (disabled by default).
* Use `--quiet` to hide all warnings and skips (just prints errors)

## Listing Rules

To list all linter rules:

```console
$ npm run awslint list
module-name: module name must be @aws-cdk/aws-<namespace>
construct-ctor: signature of all construct constructors should be "scope, id, props"
resource-class: every resource must have a resource class (L2)
...
```

The [AWS Resource Construct Design Guidelines](../../docs/DESIGN_GUIDELINES.md) document
includes references for all rules. For example, see [#construct-interface](../../docs/DESIGN_GUIDELINES.md#construct-interface)
for a discussion about the "construct-interface" rule.
