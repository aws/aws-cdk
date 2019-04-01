#!/usr/bin/env python3

from aws_cdk import cdk

from hello.hello_stack import MyStack


app = cdk.App()
MyStack(app, "hello-cdk-1")
MyStack(app, "hello-cdk-2")

app.run()
