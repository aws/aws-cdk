import json
import os


def handler(event, context):
    path = '/mnt/data'
    files = os.listdir(path) if os.path.exists(path) else []
    return {
        'statusCode': 200,
        'body': json.dumps({'mount': path, 'files': files}),
    }
