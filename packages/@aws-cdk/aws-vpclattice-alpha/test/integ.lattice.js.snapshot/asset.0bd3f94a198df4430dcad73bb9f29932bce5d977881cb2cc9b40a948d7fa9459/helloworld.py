import json
import logging
import os

log = logging.getLogger("handler")
log.setLevel(logging.INFO)

def lambda_handler(event, context):
	try:
		region = os.environ.get('AWS_REGION')
		response = "Hello from " + region
		return {
			"statusCode": 200,
			"statusDescription": "200 OK",
			"body": response
		}

	except Exception as e:
		log.exception("whoops")
		log.info(e)
		
		return {
			"statusCode": 500,
			"statusDescription": "500 Internal Server Error",
			"body": "Server error - check lambda logs\n"
		}