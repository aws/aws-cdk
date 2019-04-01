#!/usr/bin/env python3

from aws_cdk import cdk

from hello.hello_stack import PyStack


app = cdk.App()
PyStack(app, "hello-cdk-1")

app.run()
