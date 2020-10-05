import boto3

s3 = boto3.client('s3')

def on_event(event, ctx):
  print(event)
  return {
    'ArbitraryField': 12345
  }

def is_complete(event, ctx):
  print(event)

  # verify result from on_event is passed through
  if event.get('ArbitraryField', None) != 12345:
    raise 'Error: expecting "event" to include "ArbitraryField" with value 12345'

  # nothing to assert if this resource is being deleted
  if event['RequestType'] == 'Delete':
    return { 'IsComplete': True }

  props = event['ResourceProperties']
  bucket_name = props['BucketName']
  object_key = props['ObjectKey']
  expected_content = props['ExpectedContent']

  print("reading content from s3://%s/%s" % (bucket_name, object_key))
  content = None
  try:
    result = s3.get_object(Bucket=bucket_name, Key=object_key)
    content = result['Body'].read().decode('utf-8')
  except s3.exceptions.NoSuchKey:
    print("file not found")
    pass

  print("actual content: %s" % content)
  print("expected content: %s" % expected_content)
  
  is_equal = content == expected_content

  if is_equal:
    print("s3 content matches expected")

  return { 'IsComplete': is_equal }
