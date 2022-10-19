#!/usr/bin/python
import os
import boto3

QUEUE_NAME = os.environ.get('QUEUE_NAME')
print('QUEUE_NAME ' + QUEUE_NAME)

if __name__ == '__main__':
    client = boto3.client('sqs')
    queue_url = client.get_queue_url(QueueName=QUEUE_NAME)['QueueUrl']
    print('queue_url ' + queue_url)
    while True:
        response = client.receive_message(
            QueueUrl=queue_url,
            WaitTimeSeconds=10,
        )
        if response and 'Messages' in response:
            for msg in response['Messages']:
                print(msg['Body'])
            entries = [{'Id': x['MessageId'], 'ReceiptHandle': x['ReceiptHandle']} for x in response['Messages']]
            client.delete_message_batch(QueueUrl=queue_url, Entries=entries)

