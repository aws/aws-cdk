#!/usr/bin/env python3

import aws_cdk as cdk

from %name.PythonModule%.%name.PythonModule%_stack import %name.PascalCased%Stack


app = cdk.App()
%name.PascalCased%Stack(app, "%stackname%")

app.synth()
