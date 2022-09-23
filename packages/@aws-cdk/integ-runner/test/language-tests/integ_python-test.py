import aws_cdk as cdk
from aws_cdk.integ_tests_alpha import IntegTest

app = cdk.App()
stack = cdk.Stack(app)

IntegTest(app, "Integ", test_cases=[stack])

app.synth()