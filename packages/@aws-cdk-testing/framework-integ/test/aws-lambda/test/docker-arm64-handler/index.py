import json, platform
def handler(event, context):
  return {
    'statusCode': 200,
    'body': json.dumps( f'Hello CDK from Lambda({platform.platform()})!')
  }