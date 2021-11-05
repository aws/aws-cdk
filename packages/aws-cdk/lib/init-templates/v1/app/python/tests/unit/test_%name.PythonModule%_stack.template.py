from aws_cdk import (
        core,
        assertions
    )

from %name.PythonModule%.%name.PythonModule%_stack import %name.PascalCased%Stack


# example test. full snaphost validation of the stack
def test_stack():
    app = core.App()
    stack = %name.PascalCased%Stack(app, "%name.StackName%")
    template = assertions.Template.from_stack(stack)

    expected_template = {}
    template.template_matches(expected_template)
