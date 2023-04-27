import requests

def handler(event, context):
  response = requests.get('https://a0.awsstatic.com/main/images/logos/aws_smile-header-desktop-en-white_59x35.png', stream=True)

  print(response.status_code)

  return response.status_code
