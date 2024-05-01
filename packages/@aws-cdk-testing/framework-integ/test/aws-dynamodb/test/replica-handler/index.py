import boto3

def handler(event, context):
  dynamodb = boto3.resource('dynamodb', region_name='us-west-1')
  table = dynamodb.Table('global-table')
  response = table.put_item(
      Item={ 'pk': 'value' }
  )
  print(response['ResponseMetadata'])
  return {
    'status_code': response['ResponseMetadata']['HTTPStatusCode']
  }
