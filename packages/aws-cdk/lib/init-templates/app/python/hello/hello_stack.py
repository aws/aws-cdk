from aws_cdk import (
    aws_iam as iam,
    aws_sqs as sqs,
    aws_sns as sns,
    cdk
)

from hello_construct import HelloConstruct

class MyStack(cdk.Stack):

    def __init__(self, app: cdk.App, id: str) -> None:
        super().__init__(app, id)

        queue = sqs.Queue(self, "MyFirstQueue",
            visibility_timeout_sec=300,
        )

        topic = sns.Topic(self, "MyFirstTopic",
            display_name="My First Topic"
        )

        topic.subscribe_queue(queue)

        hello = HelloConstruct(self, "MyHelloConstruct", num_buckets=4)
        user = iam.User(self, "MyUser")
        hello.grant_read(user)
