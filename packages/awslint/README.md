# awslint

A linter for the AWS Construct Library's API. It reflects a construct library's
module via it's `.jsii` manifest and checks that the module adheres to the [AWS
Resource Construct Design Guidelines](../../design/aws-guidelines.md).

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

The [AWS Resource Construct Design Guidelines](../../design/aws-guidelines.md) document
includes references for all rules. For example, see [#resource-class](../../design/aws-guidelines.md#resource-class)
for a discussion about the "resource-class" rule.
