import json

def lambda_handler(event, context):
    # event: The event schema should match whatever inputSchema you define for the target.
    # context: Sample event
    # ClientContext([custom={'bedrockAgentCoreGatewayId': 'Y02ERAYBHB', 'bedrockAgentCoreTargetId': 'RQHDN3J002', 'bedrockAgentCoreMessageVersion': '1.0', 'bedrockAgentCoreToolName': 'weather_tool', 'bedrockAgentCoreSessionId': ''},env=None,client=None])
    toolName = context.client_context.custom['bedrockAgentCoreToolName']
    print(context.client_context)
    print(event)
    print(f"Original toolName: , {toolName}")
    delimiter = "___"
    if delimiter in toolName:
        toolName = toolName[toolName.index(delimiter) + len(delimiter):]
    print(f"Converted toolName: , {toolName}")
    if toolName == 'get_order_tool':
        return {'statusCode': 200, 'body': "Order Id 123 is in shipped status"}
    else:
        return {'statusCode': 200, 'body': "Updated the order details successfully"}
