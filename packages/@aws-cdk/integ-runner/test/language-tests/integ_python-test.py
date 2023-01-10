import aws_cdk as cdk
import aws_cdk.aws_sqs as sqs
from aws_cdk.integ_tests_alpha import IntegTest, ExpectedResult

app = cdk.App()
stack = cdk.Stack(app, 'PythonStack')

queue = sqs.Queue(stack, 'Queue', fifo=True)

integ = IntegTest(app, "Python", test_cases=[stack])

integ.assertions.aws_api_call('SQS', 'getQueueAttributes', {
    "QueueUrl": queue.queue_url,
    "AttributeNames": ["QueueArn"]
}).assert_at_path('Attributes.QueueArn', ExpectedResult.string_like_regexp(".*\\.fifo$"))

app.synth()
