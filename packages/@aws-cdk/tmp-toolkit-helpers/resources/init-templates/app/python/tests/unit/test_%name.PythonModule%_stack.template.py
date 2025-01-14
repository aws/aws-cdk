import aws_cdk as core
import aws_cdk.assertions as assertions

from %name.PythonModule%.%name.PythonModule%_stack import %name.PascalCased%Stack

# example tests. To run these tests, uncomment this file along with the example
# resource in %name.PythonModule%/%name.PythonModule%_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = %name.PascalCased%Stack(app, "%name.StackName%")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
