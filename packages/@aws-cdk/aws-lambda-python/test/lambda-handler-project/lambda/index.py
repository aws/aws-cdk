import requests
import shared

def handler(event, context):
  response = requests.get(shared.get_url(), stream=True)

  print(response.status_code)

  return response.status_code
