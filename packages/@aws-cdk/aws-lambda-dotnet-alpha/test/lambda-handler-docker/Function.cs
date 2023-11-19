using Amazon.Lambda.Core;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace LambdaHandler;

public class Function
{
    
    public string FunctionHandler(ILambdaContext context)
    {
        return "Ok";
    }
}
