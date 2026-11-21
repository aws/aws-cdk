#!/usr/bin/env python3
"""Minimal AgentCore Runtime test agent (HTTP protocol) with a warmup build hook.

Implements the AgentCore custom HTTP contract on port 8080:
  GET  /ping         -> health check (must return 200 for the runtime to stabilize)
  POST /invocations  -> agent invocation
  POST /warmup       -> warmup build hook (must return 2xx or the runtime build fails)
Used by integ.runtime-build-hooks to deploy a real V2 runtime with a warmup hook and minimum memory.
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

    def _read_body(self):
        length = int(self.headers.get('Content-Length', 0))
        return self.rfile.read(length) if length else b''

    def do_GET(self):
        if self.path == '/ping':
            self._send(200, {'status': 'Healthy'})
        else:
            self._send(404, {'error': 'not found'})

    def do_POST(self):
        raw = self._read_body()
        if self.path == '/warmup':
            logger.info('Warmup hook called')
            self._send(200, {'status': 'warm'})
        elif self.path == '/invocations':
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
