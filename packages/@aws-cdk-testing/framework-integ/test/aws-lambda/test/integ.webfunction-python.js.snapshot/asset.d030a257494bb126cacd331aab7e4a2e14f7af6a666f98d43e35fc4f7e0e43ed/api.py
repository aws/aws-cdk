import json


def application(environ, start_response):
    body = json.dumps({'entry': 'api'}).encode()
    start_response('200 OK', [('Content-Type', 'application/json'), ('Content-Length', str(len(body)))])
    return [body]
