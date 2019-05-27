# Implementation of cfn_gen that performs an action
def _cfn2ts(ctx):
  # Define arguments that will be passed to the underlying nodejs script.
  args = ctx.actions.args()

  # The Cfn scope to generate
  args.add("--scope")
  args.add(ctx.attr.scope)

  # The generated bundle's filename.
  args.add("--out")
  args.add(ctx.outputs.outputs[0].dirname)

  # Define an "action" that will run the nodejs_binary executable. This is
  # the main thing that cfn2ts rule does.
  ctx.actions.run(
    inputs = [],
    executable = ctx.executable._cfn2ts,
    outputs = ctx.outputs.outputs,
    arguments = [args],
    progress_message = "Cfn2TS (%s)" % ctx.attr.outputs,
  )

  output_depset = depset(ctx.outputs.outputs)

  # The return value describes what the rule is producing. In this case we need to specify
  # the "DefaultInfo" so that the given rule target acts like a filegroup
  return [
    DefaultInfo(files = output_depset),
  ]

# Rule definition for cfn_gen that defines attributes and outputs.
cfn2ts = rule(
  # Point to the function that will execute for this rule.
  implementation = _cfn2ts,

  # The attributes that can be set to this rule.
  attrs = {
    # The name of the file(s) to be output from this rule. The rule will fail if
    # the nodejs_binary does not produce these output file(s).
    "outputs": attr.output_list(),

    # The Cfn scope of the generated output (e.g. AWS::IAM)
    "scope": attr.string_list(
        default = [],
        doc = "The CloudFormation scope(s) to generate",
        mandatory = True,
    ),

    # The executable (bundler) for this rule (private).
    "_cfn2ts": attr.label(
      default = Label("//tools/cfn2ts"),
      executable = True,
      cfg = "host")
  },
)
