from http import HTTPStatus

def custom_handler(event, context):
  print('No dependencies')
  return HTTPStatus.OK.value
