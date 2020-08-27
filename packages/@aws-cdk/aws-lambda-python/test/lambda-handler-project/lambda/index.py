import requests
from PIL import Image
from shared.get_url import get_url

def handler(event, context):
  response = requests.get(get_url(), stream=True)
  img = Image.open(response.raw)

  print(response.status_code)
  print(img.size)

  return response.status_code
