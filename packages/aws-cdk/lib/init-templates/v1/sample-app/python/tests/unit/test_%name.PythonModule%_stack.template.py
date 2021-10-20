from aws_cdk import (
        core,
        assertions
    )

from %name.PythonModule%.%name.PythonModule%_stack import %name.PascalCased%Stack


def test_sqs_queue_created():
    app = core.App()
    stack = %name.PascalCased%Stack(app, "%name.StackName%")
    template = assertions.Template.from_stack(stack)

    template.has_resource_properties("AWS::SQS::Queue", {
        "VisibilityTimeout": 300
    })


def test_sns_topic_created():
    app = core.App()
    stack = %name.PascalCased%Stack(app, "%name.StackName%")
    template = assertions.Template.from_stack(stack)

    template.has_resource("AWS::SNS::Topic", assertions.Match.any_value())
