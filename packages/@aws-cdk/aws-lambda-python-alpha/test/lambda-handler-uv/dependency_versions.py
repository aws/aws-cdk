from importlib.metadata import version

def handler(event, context):
    status_code = 200

    certifi_version = version('certifi')
    urllib3_version = version('urllib3')
    charset_normalizer_version = version('charset-normalizer')

    if (certifi_version != '2025.1.31' or
            urllib3_version != '2.3.0' or
            charset_normalizer_version != '3.4.1'):
        status_code = 400

    return status_code