#!/usr/bin/env python3

from aws_cdk import cdk

from %name.PythonModule%.%name.PythonModule%_stack import %name.PascalCased%Stack


app = cdk.App()
%name.PascalCased%Stack(app, "%name%-cdk-1")

app.run()
