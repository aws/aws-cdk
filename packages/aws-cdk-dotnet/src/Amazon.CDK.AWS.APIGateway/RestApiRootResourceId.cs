using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway
{
    [JsiiClass(typeof(RestApiRootResourceId), "@aws-cdk/aws-apigateway.RestApiRootResourceId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class RestApiRootResourceId : Token
    {
        public RestApiRootResourceId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected RestApiRootResourceId(ByRefValue reference): base(reference)
        {
        }

        protected RestApiRootResourceId(DeputyProps props): base(props)
        {
        }
    }
}