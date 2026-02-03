from http.server import SimpleHTTPRequestHandler
import urllib.request
import json

class MyRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()

            try:
                # IPv4 request
                response = urllib.request.urlopen('http://ipv4.google.com')
                status_code = response.getcode()  
                if (status_code != 200):
                  raise Exception(f"Received a non-successful status code: {status_code}")

                # IPv6 request
                response = urllib.request.urlopen('http://ipv6.google.com')
                status_code = response.getcode()  
                if (status_code != 200):
                  raise Exception(f"Received a non-successful status code: {status_code}")

                json_response = { 
                    "status": status_code
                    }

                self.wfile.write(json.dumps(json_response).encode('utf-8'))
            except Exception as e:
                self.wfile.write(bytes(f"Error: {str(e)}", 'utf-8'))
            return
        else:
            super().do_GET()

if __name__ == '__main__':
    from http.server import HTTPServer
    server = HTTPServer(('0.0.0.0', 8000), MyRequestHandler)
    print('Server started on http://0.0.0.0:8000')
    server.serve_forever()