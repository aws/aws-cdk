#!/usr/bin/env python3
"""
Minimal AgentCore Runtime container implementing the HTTP protocol contract.

Platform version V2 snapshots the environment on the first healthy /ping, and
fails creation if the container does not report healthy within 120 seconds, so
this artifact serves /ping and /invocations rather than being a stub image.

https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-http-protocol-contract.html
"""

import json
from http.server import BaseHTTPRequestHandler, HTTPServer


class AgentRuntimeHandler(BaseHTTPRequestHandler):
    def _respond(self, status, payload):
        body = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == '/ping':
            self._respond(200, {'status': 'Healthy'})
        else:
            self._respond(404, {'error': 'not found'})

    def do_POST(self):
        if self.path != '/invocations':
            self._respond(404, {'error': 'not found'})
            return
        body = self.rfile.read(int(self.headers.get('Content-Length', 0)))
        prompt = (json.loads(body) if body else {}).get('prompt', '')
        self._respond(200, {'response': f'Echo: {prompt}', 'status': 'success'})


if __name__ == '__main__':
    HTTPServer(('0.0.0.0', 8080), AgentRuntimeHandler).serve_forever()
