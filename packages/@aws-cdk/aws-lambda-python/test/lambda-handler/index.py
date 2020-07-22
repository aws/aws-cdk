import requests
from PIL import Image

def handler(event, context):
  response = requests.get('https://a0.awsstatic.com/main/images/logos/aws_smile-header-desktop-en-white_59x35.png', stream=True).raw
  img = Image.open(response)

  print(response.status_code)
  print(img.size)

  return response.status_code
