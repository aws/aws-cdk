# This example comes from the AWS Synthetics service console "API canary" blueprint

import json
import http.client
import urllib.parse
from aws_synthetics.selenium import synthetics_webdriver as syn_webdriver
from aws_synthetics.common import synthetics_logger as logger


def verify_request(method, url, post_data=None, headers={}):
    parsed_url = urllib.parse.urlparse(url)
    user_agent = str(syn_webdriver.get_canary_user_agent_string())
    if "User-Agent" in headers:
        headers["User-Agent"] = " ".join([user_agent, headers["User-Agent"]])
    else:
        headers["User-Agent"] = "{}".format(user_agent)

    logger.info("Making request with Method: '%s' URL: %s: Data: %s Headers: %s" % (
        method, url, json.dumps(post_data), json.dumps(headers)))

    if parsed_url.scheme == "https":
        conn = http.client.HTTPSConnection(parsed_url.hostname, parsed_url.port)
    else:
        conn = http.client.HTTPConnection(parsed_url.hostname, parsed_url.port)

    conn.request(method, url, str(post_data), headers)
    response = conn.getresponse()
    logger.info("Status Code: %s " % response.status)
    logger.info("Response Headers: %s" % json.dumps(response.headers.as_string()))

    if not response.status or response.status < 200 or response.status > 299:
        try:
            logger.error("Response: %s" % response.read().decode())
        finally:
            if response.reason:
                conn.close()
                raise Exception("Failed: %s" % response.reason)
            else:
                conn.close()
                raise Exception("Failed with status code: %s" % response.status)

    logger.info("Response: %s" % response.read().decode())
    logger.info("HTTP request successfully executed")
    conn.close()


def main():

    url = 'https://example.com/'
    method = 'GET'
    postData = ""
    headers = {}

    verify_request(method, url, None, headers)

    logger.info("Canary successfully executed")


def handler(event, context):
    logger.info("Selenium Python API canary")
    main()