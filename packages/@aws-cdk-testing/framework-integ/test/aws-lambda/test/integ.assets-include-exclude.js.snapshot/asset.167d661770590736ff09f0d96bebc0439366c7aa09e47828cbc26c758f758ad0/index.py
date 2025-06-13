from subdir.sub import get_message


def main(event, context):
    return {"message": get_message()}
