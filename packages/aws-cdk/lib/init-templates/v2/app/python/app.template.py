#!/usr/bin/env python3

import aws_cdk_lib as core

from %name.PythonModule%.%name.PythonModule%_stack import %name.PascalCased%Stack


app = core.App()
%name.PascalCased%Stack(app, "%name.PascalCased%Stack")

app.synth()
