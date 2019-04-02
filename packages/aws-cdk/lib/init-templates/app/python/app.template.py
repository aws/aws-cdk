#!/usr/bin/env python3

from aws_cdk import cdk

from %name%.%name%_stack import PyStack


app = cdk.App()
PyStack(app, "%name%-cdk-1")

app.run()
