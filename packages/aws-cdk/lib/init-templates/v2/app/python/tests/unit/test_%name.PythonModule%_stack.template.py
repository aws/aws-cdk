import aws_cdk as core
import aws_cdk.assertions_alpha as assertions

from %name.PythonModule%.%name.PythonModule%_stack import %name.PascalCased%Stack


def get_template():
    app = core.App()
    stack = %name.PascalCased%Stack(app, "%name.StackName%")
    template = assertions.Template.from_stack(stack)
    return template


def test_empty_stack():
    get_template().template_matches({})
