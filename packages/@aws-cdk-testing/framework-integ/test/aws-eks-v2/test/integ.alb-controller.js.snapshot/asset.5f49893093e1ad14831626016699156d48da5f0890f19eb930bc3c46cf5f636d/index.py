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
    # this should a substantial retry because it has to wait for the ELB to actually
    # be functioning
    response = http.request('GET', url, retries=urllib3.Retry(10, backoff_factor=1))
    if response.status != 200:
      raise RuntimeError(f'Request failed: {response.status} ({response.reason})')
    return {'Data': {'Value': response.data.decode('utf-8')}}