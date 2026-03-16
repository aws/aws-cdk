#!/usr/bin/env python3
import aws_cdk as cdk
from aws_cdk import App, Stack
import aws_cdk.aws_sns as sns
import json
import yaml

app = App()
stack = Stack(app, "MyStack")
sns.Topic(stack, "Topic")

assembly = app.synth()

# Get the stack's template
stack_artifact = assembly.get_stack_by_name("MyStack")
template = stack_artifact.template

# Print as JSON
print(json.dumps(template, indent=2))
print(yaml.dump(template, default_flow_style=False))

