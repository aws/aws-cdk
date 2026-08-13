#!/usr/bin/python
import sys
import textwrap
import http.server
import socketserver

PORT = 8000

# Read the file that was copied from the build context
try:
    with open('/src/hello.txt', 'r') as f:
        context_message = f.read().strip()
except FileNotFoundError:
    context_message = 'ERROR: hello.txt not found - build context may not have worked'


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/html')
        self.end_headers()
        self.wfile.write(textwrap.dedent('''\
            <!doctype html>
            <html><head><title>It works</title></head>
            <body>
                <h1>Hello from the integ test container with build context</h1>
                <p>Message from build context: {message}</p>
                <img src="https://media.giphy.com/media/nFjDu1LjEADh6/giphy.gif">
            </body>
            ''').format(message=context_message).encode('utf-8'))


def main():
    httpd = http.server.HTTPServer(("", PORT), Handler)
    print("serving at port", PORT)
    print("message from build context:", context_message)
    httpd.serve_forever()


if __name__ == '__main__':
    main()
