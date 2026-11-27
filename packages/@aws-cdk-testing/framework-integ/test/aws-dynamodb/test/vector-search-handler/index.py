"""Call SearchVectors on the vector index named in the environment.

The vector index integ tests grant this function access with
grants.vectorSearch() and invoke it. SearchVectors fails if the grant is
missing, or if the vector index does not exist or is not ACTIVE.

The function signs the request with botocore instead of calling
boto3.client('dynamodb').search_vectors(), because the boto3 version included
in the Lambda runtime can predate the SearchVectors API. SearchVectors is
served by the search endpoint, search-dynamodb.<region>.amazonaws.com (the
integ tests run in the aws partition); dynamodb.<region>.amazonaws.com rejects
it with UnknownOperationException.

The index has a HASH search schema element, so the request must give its value
in SearchConditionExpression.
"""
import json
import os

import boto3
from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest
from botocore.httpsession import URLLib3Session


def handler(event, context):
    region = os.environ['AWS_REGION']
    body = json.dumps({
        'TableName': os.environ['TABLE_NAME'],
        'IndexName': os.environ['INDEX_NAME'],
        'SearchVector': [{'N': '0.1'}] * int(os.environ['DIMENSIONS']),
        'SearchConditionExpression': '#hash = :hash',
        'ExpressionAttributeNames': {'#hash': os.environ['HASH_ATTRIBUTE']},
        'ExpressionAttributeValues': {':hash': {'S': os.environ['HASH_VALUE']}},
        'TopK': 1,
    })
    url = f'https://search-dynamodb.{region}.amazonaws.com/'
    request = AWSRequest(method='POST', url=url, data=body, headers={
        'Content-Type': 'application/x-amz-json-1.0',
        'X-Amz-Target': 'DynamoDB_20120810.SearchVectors',
    })
    SigV4Auth(boto3.Session().get_credentials().get_frozen_credentials(), 'dynamodb', region).add_auth(request)
    response = URLLib3Session().send(request.prepare())
    if response.status_code != 200:
        raise RuntimeError(f'SearchVectors returned {response.status_code}: {response.text}')
    return {'status_code': response.status_code}
