[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Handler;

public class Function {
    public Function() {}
    
    public async Task<APIGatewayProxyResponse> Handler(APIGatewayProxyRequest request) {
        var id = request.PathParameters["id"];
        
        return new APIGatewayProxyResponse {
            StatusCode = (int)HttpStatusCode.OK,
            Body = JsonSerializer.Serialize(databaseRecord)
        };
    }
}