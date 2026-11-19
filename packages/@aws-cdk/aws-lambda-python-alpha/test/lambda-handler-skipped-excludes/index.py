import os


def handler(event, context):
    if os.path.exists(os.path.join(os.path.dirname(__file__), "excluded-metadata")):
        raise RuntimeError("Excluded metadata was packaged into the function")
    return "metadata excluded"
