import json

def handler(event, context):
    print("Event: ", event)
    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Hello from Lambda l2!'})
    }