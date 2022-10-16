# To run this and get the snapshot, you need to install:
# pip install aws-cdk-lib aws-cdk.integ-tests-alpha

from aws_cdk import (
    App, Stack
)
from aws_cdk.integ_tests_alpha import IntegTest

app = App()
stack = Stack(app, "Stack")

IntegTest(app, "IntegTest", test_cases=[stack])

app.synth()
