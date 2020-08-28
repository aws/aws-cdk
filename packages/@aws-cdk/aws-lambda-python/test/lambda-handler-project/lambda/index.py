import requests
from PIL import Image
import shared

def handler(event, context):
  response = requests.get(shared.get_url(), stream=True)
  img = Image.open(response.raw)

  print(response.status_code)
  print(img.size)

  return response.status_code
