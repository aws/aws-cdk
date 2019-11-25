#!/usr/bin/env python3

from aws_cdk import core

from %name%.%name%_stack import %name.PascalCased%Stack


app = core.App()
%name.PascalCased%Stack(app, "%name%", env={'region': 'us-west-2'})

app.synth()
