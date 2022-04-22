import logging
import os

import boto3

from lib.cleanup_resource_handler import CleanupResourceHandler
from lib.queue_handler import QueueHandler

logging.getLogger().setLevel(logging.INFO)


def queue_handler(event, context):
    """
    Handler for the event queue lambda trigger
    """

    ec2_client = boto3.client('ec2')
    dynamodb_resource = boto3.resource('dynamodb')
    route53_client = boto3.client('route53')

    handler = QueueHandler(ec2_client=ec2_client, dynamodb_resource=dynamodb_resource, route53_client=route53_client,
                           environ=os.environ)

    return handler.handle(event, context)


def cleanup_resource_handler(event, context):
    """
    Event handler for the custom resource.
    """

    route53_client = boto3.client('route53')
    handler = CleanupResourceHandler(route53_client=route53_client)
    handler.handle_event(event, context)
