#!/usr/bin/env python3

from aws_cdk import core, core as cdk

from %name.PythonModule%.%name.PythonModule%_stack import %name.PascalCased%Stack


app = cdk.App()
%name.PascalCased%Stack(app, "%name.StackName%")

app.synth()
