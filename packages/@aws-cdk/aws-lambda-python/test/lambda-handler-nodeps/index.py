from http import HTTPStatus

def handler(event, context):
  print('No dependencies')
  return HTTPStatus.OK.value
