#!/usr/bin/env python3

from aws_cdk import core

from %name.PythonModule%.%name.PythonModule%_stack import %name.PascalCased%Stack


app = core.App()
%name.PascalCased%Stack(app, "%name.StackName%")

app.synth()
