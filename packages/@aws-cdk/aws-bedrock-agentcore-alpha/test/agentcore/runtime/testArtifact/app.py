"""
Test handler for Bedrock Agent Core Runtime tests
"""

def handler(event, context):
    """
    Simple test handler that returns a success response
    """
    return {
        'statusCode': 200,
        'body': 'Test agent runtime handler'
    }
