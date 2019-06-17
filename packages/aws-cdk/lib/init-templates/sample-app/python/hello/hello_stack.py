from aws_cdk import (
    aws_iam as iam,
    aws_sqs as sqs,
    aws_sns as sns,
    aws_sns_subscriptions as subs,
    cdk
)

from hello_construct import HelloConstruct


class MyStack(cdk.Stack):

    def __init__(self, app: cdk.App, id: str, **kwargs) -> None:
        super().__init__(app, id, **kwargs)

        queue = sqs.Queue(
            self, "MyFirstQueue",
            visibility_timeout_sec=300,
        )

        topic = sns.Topic(
            self, "MyFirstTopic",
            display_name="My First Topic"
        )

        topic.add_subscription(subs.SqsSubscription(queue))

        hello = HelloConstruct(self, "MyHelloConstruct", num_buckets=4)
        user = iam.User(self, "MyUser")
        hello.grant_read(user)
