import requests

def handler(event, context):
  r = requests.get('https://aws.amazon.com')

  print(r.status_code)

  return r.status_code
