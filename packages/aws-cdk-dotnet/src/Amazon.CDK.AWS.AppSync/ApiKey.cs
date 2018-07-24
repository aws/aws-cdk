using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync
{
    [JsiiClass(typeof(ApiKey), "@aws-cdk/aws-appsync.ApiKey", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ApiKey : Token
    {
        public ApiKey(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ApiKey(ByRefValue reference): base(reference)
        {
        }

        protected ApiKey(DeputyProps props): base(props)
        {
        }
    }
}