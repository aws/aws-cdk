#!/usr/bin/env python3
"""Minimal AgentCore Runtime test agent (HTTP protocol).

Implements the AgentCore custom HTTP contract on port 8080:
  GET  /ping         -> health check (must return 200 for the runtime to stabilize)
  POST /invocations  -> agent invocation
Used by integ.runtime-platformversion to deploy a real (V2) runtime that reaches READY.
"""
import json
import logging
from http.server import HTTPServer, BaseHTTPRequestHandler

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class Handler(BaseHTTPRequestHandler):
    def _send(self, code, body):
        payload = json.dumps(body).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self):
        if self.path == '/ping':
            self._send(200, {'status': 'Healthy'})
        else:
            self._send(404, {'error': 'not found'})

    def do_POST(self):
        if self.path == '/invocations':
            length = int(self.headers.get('Content-Length', 0))
            raw = self.rfile.read(length) if length else b''
            try:
                data = json.loads(raw) if raw else {}
            except json.JSONDecodeError:
                data = {}
            self._send(200, {'output': f"Echo: {data.get('prompt', '')}"})
        else:
            self._send(404, {'error': 'not found'})

    def log_message(self, fmt, *args):
        logger.info('%s - %s', self.address_string(), fmt % args)


if __name__ == '__main__':
    logger.info('Starting test agent on :8080')
    HTTPServer(('', 8080), Handler).serve_forever()
