import boto3
import os

def handler(event, context):
  table_name = os.environ['TABLE_NAME']
  replica_region = os.environ['REPLICA_REGION']
  dynamodb = boto3.resource('dynamodb', region_name=replica_region)
  table = dynamodb.Table(table_name)
  response = table.put_item(
      Item={ 'pk': 'value' }
  )
  print(response['ResponseMetadata'])
  return {
    'status_code': response['ResponseMetadata']['HTTPStatusCode']
  }
