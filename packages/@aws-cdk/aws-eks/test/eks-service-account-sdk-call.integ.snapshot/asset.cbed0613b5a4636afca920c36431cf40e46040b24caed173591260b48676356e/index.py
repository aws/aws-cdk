import json
import logging
#import urllib3
import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)
#http = urllib3.PoolManager()

def handler(event, context):
  print(json.dumps(event))

  request_type = event['RequestType']
  props = event['ResourceProperties']

  s3_bucket_name = 'amazingly-made-sdk-call-created-eks-bucket'

  if request_type in ['Create', 'Update']:
    #logger.info(f'Sending request to {url}')
    # this should a substantial retry because it has to wait for the ELB to actually
    # be functioning
    #response = http.request('GET', url, retries=urllib3.Retry(10, backoff_factor=1))
    #if response.status != 200:
    #  raise RuntimeError(f'Request failed: {response.status} ({response.reason})')
    #return {'Data': {'Value': response.data.decode('utf-8')}}
    logger.info(f'making sdk call to create bucket with name {s3_bucket_name}')

    s3 = boto3.client('s3')
    try:
      s3.head_bucket(Bucket=s3_bucket_name)
    except Exception as error:
      raise RuntimeError(f'failed to head bucket with error: {str(error)}')
    try:
      s3.delete_bucket(Bucket=s3_bucket_name)
    except Exception as error:
      # If the bucket does not exist, then this error will be thrown
      raise RuntimeError(f'failed to delete bucket: {str(error)}')

    return {'Data': {'Value': f'confirmed that bucket with name {s3_bucket_name} exists...bucket has been deleted' }}