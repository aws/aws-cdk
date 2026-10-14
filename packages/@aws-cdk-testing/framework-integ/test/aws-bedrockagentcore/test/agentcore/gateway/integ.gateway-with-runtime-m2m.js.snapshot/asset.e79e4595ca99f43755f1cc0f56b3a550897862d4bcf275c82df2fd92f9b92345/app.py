import json
import os
import base64
import urllib.request
from http.server import HTTPServer, BaseHTTPRequestHandler


def get_token():
    """Get M2M access token from Cognito"""
    credentials = f"{os.environ['CLIENT_ID']}:{os.environ['CLIENT_SECRET']}"
    auth = base64.b64encode(credentials.encode()).decode()
    
    req = urllib.request.Request(
        os.environ['TOKEN_ENDPOINT'],
        data=f"grant_type=client_credentials&scope={os.environ['SCOPE']}".encode(),
        headers={
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': f'Basic {auth}'
        }
    )
    
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read())['access_token']


def call_tool(url, token):
    """Call Gateway tool via MCP"""
    if not url.endswith('/mcp'):
        url = f"{url.rstrip('/')}/mcp"
    
    req = urllib.request.Request(
        url,
        data=json.dumps({
            'jsonrpc': '2.0',
            'method': 'tools/call',
            'params': {'name': 'test-tools___hello', 'arguments': {}},
            'id': 1
        }).encode(),
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}'
        }
    )
    
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read())['result']


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/ping':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'healthy'}).encode())
    
    def do_POST(self):
        if self.path == '/invocations':
            try:
                token = get_token()
                result = call_tool(os.environ['GATEWAY_URL'], token)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'output': {
                        'message': 'Gateway M2M authentication successful',
                        'result': result
                    }
                }).encode())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def log_message(self, format, *args):
        pass


if __name__ == '__main__':
    HTTPServer(('', 8080), Handler).serve_forever()
