#!/usr/bin/env python3

from aws_cdk import cdk

from hello.hello_stack import MyStack


app = cdk.App()
MyStack(app, "hello-cdk-1", env={'region': 'us-east-2'})
MyStack(app, "hello-cdk-2", env={'region': 'us-west-2'})

app.run()
