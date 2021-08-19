import json
import pytest

import aws_cdk_lib as core
from %name.PythonModule%.%name.PythonModule%_stack import %name.PascalCased%Stack


def get_template():
    app = core.App()
    %name.PascalCased%Stack(app, "%name.StackName%")
    return json.dumps(app.synth().get_stack("%name.StackName%").template)


def test_sqs_queue_created():
    assert("AWS::SQS::Queue" in get_template())


def test_sns_topic_created():
    assert("AWS::SNS::Topic" in get_template())
