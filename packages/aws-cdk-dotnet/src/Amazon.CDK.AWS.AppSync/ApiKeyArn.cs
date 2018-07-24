using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync
{
    [JsiiClass(typeof(ApiKeyArn), "@aws-cdk/aws-appsync.ApiKeyArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ApiKeyArn : Arn
    {
        public ApiKeyArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ApiKeyArn(ByRefValue reference): base(reference)
        {
        }

        protected ApiKeyArn(DeputyProps props): base(props)
        {
        }
    }
}