import os
import boto3

client = boto3.client('sns')

def lambda_handler(event, context):
    client.publish(TopicArn=os.environ['TOPIC_ARN'], Message='hello world')
    return 'published successfully'
