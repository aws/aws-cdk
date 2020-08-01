import json
import logging
import urllib3

logger = logging.getLogger()
logger.setLevel(logging.INFO)
http = urllib3.PoolManager()

def handler(event, context):
  print(json.dumps(event))

  request_type = event['RequestType']
  props = event['ResourceProperties']

  url = props['Url']

  if request_type in ['Create', 'Update']:
    logger.info(f'Sending request to {url}')
    response = http.request('GET', url, timeout=10.0, retries=6)
    if response.status != 200:
      raise RuntimeError(f'Request failed: {status} ({response.reason})')
    return {'Data': {'Value': response.data.decode('utf-8')}}