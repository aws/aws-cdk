import json
import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
  print(json.dumps(event))

  request_type = event['RequestType']
  props = event['ResourceProperties']

  s3_bucket_name = 'amazingly-made-sdk-call-created-eks-bucket'
  s3 = boto3.client('s3')

  if request_type in ['Create', 'Update']:
    logger.info(f'making sdk call to check if bucket with name {s3_bucket_name} exists')

    try:
      s3.head_bucket(Bucket=s3_bucket_name)
    except Exception as error:
      raise RuntimeError(f'failed to head bucket with error: {str(error)}')
    return {'Data': {'Value': f'confirmed that bucket with name {s3_bucket_name} exists' }}

  elif request_type == 'Delete':
    logger.info(f'making sdk call to delete bucket with name {s3_bucket_name}')

    try:
      s3.delete_bucket(Bucket=s3_bucket_name)
    except Exception as error:
      # If the bucket does not exist, then this error will be thrown
      raise RuntimeError(f'failed to delete bucket: {str(error)}')
    return {'Data': {'Value': f'bucket with name {s3_bucket_name} has been deleted' }}
