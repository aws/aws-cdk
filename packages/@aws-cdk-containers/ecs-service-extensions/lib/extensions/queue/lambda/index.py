import os
import boto3
from queue import QueueHandler


def queue_handler(event, context):
    """
    Handler for the lambda trigger
    """

    ecs = boto3.client('ecs')
    sqs = boto3.client('sqs')

    queue_handler = QueueHandler(ecs_client=ecs, sqs_client=sqs, environ=os.environ)

    return queue_handler.emit()
